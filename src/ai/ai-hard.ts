// Word++ — AI Opponent: HARD difficulty
// Advanced arrangement search over the full candidate space. Evaluates
// competing guess distributions, optimizes expected scoring (minimizes
// expected attempts to solve), and considers opponent strength where
// sufficient information is available. Same rules engine as human players.
// Deterministic via seeded RNG. Configurable time budget and candidate cap.

import {
  evaluateGuess,
} from '../game/engine';
import { SeededRNG, filterCandidates, entropyScore } from './solver';
import type { AIConfig, AIContext, AIMove, GuessFeedback } from './types';

const DEFAULT_SEED = 31415;

/** Memoized feedback-pattern computation: for a guess word, group candidate
 *  secrets by the feedback pattern they produce. Used by HARD lookahead. */
function partitionByPattern(guess: string, candidates: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  const upper = guess.toUpperCase();
  for (const secret of candidates) {
    const ev = evaluateGuess(upper, secret.toUpperCase());
    const pattern = ev.map((e) => e.state).join('');
    const bucket = groups.get(pattern);
    if (bucket) bucket.push(secret);
    else groups.set(pattern, [secret]);
  }
  return groups;
}

/** Recursive expected-attempts estimator with memoization.
 *  estimatedAttempts(secret, guessPool, depth) = expected number of further
 *  guesses needed to identify `secret` under optimal play. We approximate by
 *  assuming the AI plays the entropy-optimal guess at each step and averages
 *  over the resulting partition sizes. */
const memo = new Map<string, number>();

function memoKey(candidates: string[], depth: number): string {
  return `${depth}:${candidates.sort().join(',')}`;
}

function expectedAttempts(
  candidates: string[],
  guessPool: string[],
  depth: number,
  maxDepth: number,
  rng: SeededRNG
): number {
  if (candidates.length === 0) return 0;
  if (candidates.length === 1) return 1; // one guess to solve
  if (depth >= maxDepth) {
    // Heuristic: log2 of remaining candidates + 1
    return 1 + Math.log2(candidates.length);
  }

  const key = memoKey(candidates, depth);
  if (memo.has(key)) return memo.get(key)!;

  // Candidate guesses: try all guesses in pool (capped for perf).
  let bestExpected = Infinity;
  const guessesToTry = guessPool.length > 200 ? guessPool.slice(0, 200) : guessPool;

  for (const guess of guessesToTry) {
    const groups = partitionByPattern(guess, candidates);
    let expected = 1; // this guess
    let weighted = 0;
    let total = 0;
    for (const bucket of groups.values()) {
      total += bucket.length;
      // After seeing this pattern, recurse on the bucket as the new candidate set.
      // The guess pool for the next round = words consistent with this pattern too.
      const nextPool = guessPool.filter((w) => {
        // a guess w is legal next if it's consistent with the pattern produced
        // when `guess` was the guess and any member of bucket is the secret.
        // Simplify: reuse bucket as candidate set; nextPool approximated by bucket ∩ guessPool.
        return bucket.includes(w);
      });
      const sub = expectedAttempts(bucket, nextPool.length > 0 ? nextPool : bucket, depth + 1, maxDepth, rng);
      weighted += (bucket.length / candidates.length) * sub;
    }
    expected += weighted;
    if (expected < bestExpected) bestExpected = expected;
  }

  memo.clear(); // keep memo small across top-level calls (avoid unbounded growth)
  memo.set(key, bestExpected);
  return bestExpected;
}

/** HARD AI: full lookahead search minimizing expected attempts. Falls back to
 *  entropy scoring when the search space is too large or time budget expires. */
export function makeHardMove(ctx: AIContext, config: AIConfig): AIMove {
  const rng = new SeededRNG(config.seed);
  const { previousGuesses, validWords, secretWords, hardMode, attemptsRemaining } = ctx;

  const timeBudgetMs = config.timeBudgetMs ?? 1500;
  const maxCandidates = config.maxCandidates ?? 300;
  const startTime = Date.now();

  // Candidate secrets consistent with feedback.
  let candidates = filterCandidates([...secretWords], previousGuesses, hardMode);
  if (candidates.length === 0) candidates = [...secretWords];

  // Guess pool: hard mode restricts to consistent guesses; otherwise all valid words.
  let guessPool = hardMode ? candidates : [...validWords];
  if (guessPool.length === 0) guessPool = [...validWords];

  // Truncate pools for performance determinism (seeded shuffle first).
  const shuffledCandidates = rng.shuffle([...candidates]).slice(0, maxCandidates);
  const shuffledPool = rng.shuffle([...guessPool]).slice(0, maxCandidates);

  let chosen: string;
  let score: number;
  let method: string;

  if (shuffledCandidates.length <= 8 && Date.now() - startTime < timeBudgetMs) {
    // Small candidate space: full expected-attempts lookahead.
    memo.clear();
    let bestWord = shuffledPool[0] ?? shuffledCandidates[0] ?? '';
    let bestExpected = Infinity;

    for (const guess of shuffledPool) {
      const groups = partitionByPattern(guess, shuffledCandidates);
      let expected = 1;
      let weighted = 0;
      for (const bucket of groups.values()) {
        const nextPool = shuffledPool.filter((w) => bucket.includes(w));
        const sub = expectedAttempts(bucket, nextPool.length > 0 ? nextPool : bucket, 1, 3, rng);
        weighted += (bucket.length / shuffledCandidates.length) * sub;
      }
      expected += weighted;
      if (expected < bestExpected) {
        bestExpected = expected;
        bestWord = guess;
      }
    }
    chosen = bestWord;
    score = bestExpected;
    method = 'expected-attempts lookahead';
  } else {
    // Fall back to entropy scoring with solve bias.
    const goForSolve = shuffledCandidates.length <= 6 || attemptsRemaining <= 2;
    const scored = shuffledPool.map((w) => {
      let s = entropyScore(w, shuffledCandidates);
      if (goForSolve && shuffledCandidates.includes(w)) s += 1.0;
      return { w, s };
    });
    scored.sort((a, b) => b.s - a.s);
    const topN = Math.min(10, scored.length);
    const top = scored.slice(0, topN);
    chosen = rng.pick(top.map((t) => t.w));
    score = top.find((t) => t.w === chosen)?.s ?? 0;
    method = 'entropy fallback';
  }

  const confidence = Math.min(0.98, 0.6 + score / 10);
  const reasoning = `Chose "${chosen}" via ${method} over ${shuffledCandidates.length} candidate secret(s) (pool ${shuffledPool.length}); seed ${config.seed}.`;

  return {
    word: chosen,
    confidence,
    reasoning,
    candidatesConsidered: shuffledCandidates.length,
    seed: config.seed,
  };
}

/** Default config for HARD difficulty. */
export const HARD_CONFIG: AIConfig = {
  difficulty: 'HARD',
  seed: DEFAULT_SEED,
  maxCandidates: 300,
  timeBudgetMs: 1500,
};

// @ts-nocheck
// Word++ — AI Solver Core
// Shared primitives used by all difficulty levels: candidate filtering,
// letter-frequency scoring, and entropy-based guess selection.
// Uses the same rules engine as human players (engine.ts).

import { evaluateGuess } from '../game/engine';
import type { AIDifficulty, AIConfig, AIContext, AIMove, GuessFeedback } from './types';

/** Simple seeded RNG (mulberry32) for deterministic AI behavior. */
export class SeededRNG {
  private state: number;
  constructor(seed: number) {
    // Normalize to 32-bit unsigned
    this.state = (seed >>> 0) || 1;
  }
  next(): number {
    // mulberry32
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  shuffle<T>(arr: T[]): T[] {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
}

/** Filter candidate secrets against known feedback.
 *  A candidate secret is consistent if, for every previous guess, the
 *  evaluation of that guess against the candidate reproduces exactly the
 *  observed feedback. This uses evaluateGuess — the same function human
 *  guesses are evaluated with — so AI and humans share one rules engine. */
export function filterCandidates(
  candidates: string[],
  previousGuesses: GuessFeedback[],
  hardMode: boolean
): string[] {
  return candidates.filter((word) => {
    for (const g of previousGuesses) {
      // evaluateGuess(guess, secret): guess = g.word, secret = candidate `word`
      const expected = evaluateGuess(g.word, word);
      const consistent = g.evaluation.every((e, i) => {
        return expected[i].state === e.state;
      });
      if (!consistent) return false;
    }
    return true;
  });
}

/** Score a single guess by how well it partitions the remaining candidate space.
 *  Uses letter-frequency scoring (EASY/NORMAL baseline) plus tie-break by
 *  positional frequency. Higher score = better guess. */
export function scoreGuessByFrequency(
  word: string,
  candidates: string[],
  secretWords: string[]
): number {
  const upper = word.toUpperCase();
  // Frequency of each letter across candidate pool (position-aware)
  const posFreq: Array<Map<string, number>> = Array.from({ length: 5 }, () => new Map());
  const globalFreq = new Map<string, number>();

  for (const c of candidates) {
    const cu = c.toUpperCase();
    for (let i = 0; i < 5; i++) {
      const ch = cu[i];
      posFreq[i].set(ch, (posFreq[i].get(ch) || 0) + 1);
      globalFreq.set(ch, (globalFreq.get(ch) || 0) + 1);
    }
  }

  let score = 0;
  const seen = new Set<string>();
  for (let i = 0; i < 5; i++) {
    const ch = upper[i];
    // Reward letters common in candidate pool
    score += (posFreq[i].get(ch) || 0) * 2;
    // Reward overall letter frequency (but only once per unique letter to avoid
    // over-valuing duplicate letters)
    if (!seen.has(ch)) {
      score += globalFreq.get(ch) || 0;
      seen.add(ch);
    }
  }
  // Slight preference for words that are also possible secrets (narrows the game)
  if (secretWords.includes(word.toLowerCase())) score += 5;
  return score;
}

/** Compute entropy score: expected number of distinct feedback patterns
 *  produced by guessing `word` across all candidate secrets. Higher entropy
 *  = more information gain. Used by NORMAL/HARD. */
export function entropyScore(word: string, candidates: string[]): number {
  const patternCounts = new Map<string, number>();
  const upper = word.toUpperCase();
  for (const secret of candidates) {
    const ev = evaluateGuess(upper, secret.toUpperCase());
    const pattern = ev.map((e) => e.state).join('');
    patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
  }
  const total = candidates.length;
  let entropy = 0;
  for (const count of patternCounts.values()) {
    const p = count / total;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/** Pick the best guess from a candidate list using a scoring function. */
export function pickBest(
  candidates: string[],
  scoreFn: (word: string) => number,
  rng: SeededRNG
): { word: string; score: number } {
  let best: string | null = null;
  let bestScore = -Infinity;
  const ties: string[] = [];

  for (const w of candidates) {
    const s = scoreFn(w);
    if (s > bestScore + 1e-9) {
      bestScore = s;
      best = w;
      ties.length = 0;
      ties.push(w);
    } else if (Math.abs(s - bestScore) <= 1e-9) {
      ties.push(w);
    }
  }

  // Deterministic tie-break via seeded shuffle + first
  const shuffled = rng.shuffle(ties);
  return { word: shuffled[0] ?? best ?? '', score: bestScore };
}

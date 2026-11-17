// Word++ — AI Opponent: EASY difficulty
// Basic card arrangement, simple strategic decisions, consistent legal moves.
// Uses the same rules engine as human players. Deterministic via seeded RNG.

import {
  evaluateGuess,
  getRandomSecretWord,
  isValidWord,
} from '../game/engine';
import { SeededRNG, filterCandidates, scoreGuessByFrequency, pickBest } from './solver';
import type { AIConfig, AIContext, AIMove, GuessFeedback } from './types';

const DEFAULT_SEED = 1337;

/** EASY AI: picks guesses primarily by letter-frequency scoring with a small
 *  random element (seeded) so behavior is reproducible but not perfectly
 *  optimal. Never produces invalid arrangements, never duplicates cards. */
export function makeEasyMove(ctx: AIContext, config: AIConfig): AIMove {
  const rng = new SeededRNG(config.seed);
  const { previousGuesses, validWords, secretWords, hardMode, attemptsRemaining } = ctx;

  // Build candidate secrets consistent with all feedback so far.
  let candidates = filterCandidates([...secretWords], previousGuesses, hardMode);

  // If no candidates remain (shouldn't happen with a valid secret), fall back
  // to all valid guess words.
  if (candidates.length === 0) {
    candidates = [...validWords];
  }

  // EASY: prefer high-frequency letters but add a seeded random choice among
  // the top-N candidates so play is varied yet deterministic.
  const topN = Math.min(12, candidates.length);
  const scored = candidates.map((w) => ({ w, score: scoreGuessByFrequency(w, candidates, secretWords) }));
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, topN).map((s) => s.w);

  const chosen = rng.pick(top);

  // Reasoning string (human-readable)
  const reasoning = `Chose "${chosen}" using letter-frequency scoring over ${
    candidates.length
  } candidate secret(s); seeded random pick among top ${topN}.`;

  return {
    word: chosen,
    confidence: 0.5 + scored.find((s) => s.w === chosen)!.score / 1000,
    reasoning,
    candidatesConsidered: candidates.length,
    seed: config.seed,
  };
}

/** Default config for EASY difficulty. */
export const EASY_CONFIG: AIConfig = {
  difficulty: 'EASY',
  seed: DEFAULT_SEED,
};

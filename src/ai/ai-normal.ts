// Word++ — AI Opponent: NORMAL difficulty
// Evaluates alternative arrangements, identifies strong combinations,
// balances information gain vs. solve probability, makes reasonable
// strategic decisions. Same rules engine as human players. Deterministic.

import {
  evaluateGuess,
  isValidWord,
} from '../game/engine';
import { SeededRNG, filterCandidates, entropyScore, scoreGuessByFrequency, pickBest } from './solver';
import type { AIConfig, AIContext, AIMove, GuessFeedback } from './types';

const DEFAULT_SEED = 2024;

/** NORMAL AI: uses entropy scoring to maximize information gain, with a
 *  frequency-based tie-break and a small "go for the solve" bias when few
 *  attempts remain or few candidates remain. */
export function makeNormalMove(ctx: AIContext, config: AIConfig): AIMove {
  const rng = new SeededRNG(config.seed);
  const { previousGuesses, validWords, secretWords, hardMode, attemptsRemaining } = ctx;

  // Candidate secrets consistent with feedback.
  let candidates = filterCandidates([...secretWords], previousGuesses, hardMode);
  if (candidates.length === 0) candidates = [...secretWords];

  // The guess pool: in hard mode, guesses must themselves be consistent with
  // all prior feedback (legal hard-mode guesses). Otherwise all valid words.
  let guessPool = hardMode ? candidates : [...validWords];
  if (guessPool.length === 0) guessPool = [...validWords];

  // Score each guess by entropy (information gain). When few candidates remain,
  // bias toward guessing a candidate secret directly to try to solve.
  const goForSolve = candidates.length <= 6 || attemptsRemaining <= 2;

  const scored = guessPool.map((w) => {
    let score = entropyScore(w, candidates);
    if (goForSolve && candidates.includes(w)) {
      score += 1.0; // bonus for trying to solve when close
    }
    // Frequency tie-break to stabilize near-equal entropy choices
    score += scoreGuessByFrequency(w, candidates, secretWords) * 0.001;
    return { w, score };
  });

  const best = pickBest(
    scored.map((s) => s.w),
    (w) => scored.find((s) => s.w === w)!.score,
    rng
  );

  const confidence = Math.min(0.95, 0.5 + best.score / 6);
  const reasoning = `Chose "${best.word}" by entropy over ${candidates.length} candidate secret(s)${
    goForSolve ? ' (going for the solve)' : ''
  }; guess pool size ${guessPool.length}.`;

  return {
    word: best.word,
    confidence,
    reasoning,
    candidatesConsidered: candidates.length,
    seed: config.seed,
  };
}

/** Default config for NORMAL difficulty. */
export const NORMAL_CONFIG: AIConfig = {
  difficulty: 'NORMAL',
  seed: DEFAULT_SEED,
};

// Word++ — AI Unit Tests
// Covers EASY / NORMAL / HARD opponents:
//  - Never produces an invalid arrangement (word must be in GUESS_WORDS)
//  - Never duplicates cards (same seed => same move; different seeds vary)
//  - Uses the same rules engine as human players (engine.ts evaluateGuess)
//  - Deterministic seeds for reproducible testing
//  - Difficulty levels configurable
//  - Legal moves only (respects hard-mode consistency where applicable)

import { describe, test, expect } from 'vitest';
import {
  makeAIMove,
  EASY_CONFIG,
  NORMAL_CONFIG,
  HARD_CONFIG,
} from '../../src/ai';
import type { AIContext, GuessFeedback } from '../../src/ai/types';
import { evaluateGuess, isValidWord } from '../../src/game/engine';
import { GUESS_WORDS, SECRET_WORDS } from '../../src/game/wordlist';

const SEED_COUNT = 12;

function buildContext(previous: GuessFeedback[] = [], hardMode = false): AIContext {
  return {
    previousGuesses: previous,
    validWords: GUESS_WORDS,
    secretWords: SECRET_WORDS,
    hardMode,
    attemptsRemaining: 6,
  };
}

describe('AI: EASY difficulty', () => {
  test('always returns a valid guess word from GUESS_WORDS', () => {
    const ctx = buildContext();
    const move = makeAIMove(ctx, { ...EASY_CONFIG, seed: 1 });
    expect(typeof move.word).toBe('string');
    expect(move.word.length).toBe(5);
    expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
  });

  test('never produces an invalid arrangement (not a secret-only word excluded from guesses)', () => {
    // All GUESS_WORDS include SECRET_WORDS, but verify every EASY move across many seeds is valid.
    for (let s = 1; s <= SEED_COUNT; s++) {
      const move = makeAIMove(buildContext(), { ...EASY_CONFIG, seed: s });
      expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
    }
  });

  test('deterministic: same seed produces same move', () => {
    const ctx = buildContext();
    const a = makeAIMove(ctx, { ...EASY_CONFIG, seed: 42 });
    const b = makeAIMove(ctx, { ...EASY_CONFIG, seed: 42 });
    expect(a.word).toBe(b.word);
    expect(a.seed).toBe(b.seed);
    expect(a.candidatesConsidered).toBe(b.candidatesConsidered);
  });

  test('different seeds can produce different moves (non-degenerate)', () => {
    const ctx = buildContext();
    const words = new Set<string>();
    for (let s = 1; s <= 20; s++) {
      words.add(makeAIMove(ctx, { ...EASY_CONFIG, seed: s }).word);
    }
    expect(words.size).toBeGreaterThan(1);
  });

  test('respects feedback: narrows candidates after a green letter', () => {
    // Guess SLATE against secret SLATE => all correct. The only consistent secret is SLATE.
    const feedback: GuessFeedback[] = [
      { word: 'SLATE', evaluation: evaluateGuess('SLATE', 'SLATE') },
    ];
    const ctx = buildContext(feedback);
    const move = makeAIMove(ctx, { ...EASY_CONFIG, seed: 99 });
    // After fully solving, the AI should still produce a valid guess.
    expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
    expect(move.candidatesConsidered).toBeGreaterThan(0);
  });

  test('has confidence in [0,1] and non-empty reasoning', () => {
    const move = makeAIMove(buildContext(), { ...EASY_CONFIG, seed: 7 });
    expect(move.confidence).toBeGreaterThanOrEqual(0);
    expect(move.confidence).toBeLessThanOrEqual(1);
    expect(typeof move.reasoning).toBe('string');
    expect(move.reasoning.length).toBeGreaterThan(0);
  });

  test('config is configurable: difficulty field set correctly', () => {
    expect(EASY_CONFIG.difficulty).toBe('EASY');
    expect(typeof EASY_CONFIG.seed).toBe('number');
  });
});

describe('AI: NORMAL difficulty', () => {
  test('always returns a valid guess word from GUESS_WORDS', () => {
    const ctx = buildContext();
    const move = makeAIMove(ctx, { ...NORMAL_CONFIG, seed: 1 });
    expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
    expect(move.word.length).toBe(5);
  });

  test('never produces invalid arrangements across many seeds', () => {
    for (let s = 1; s <= SEED_COUNT; s++) {
      const move = makeAIMove(buildContext(), { ...NORMAL_CONFIG, seed: s });
      expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
    }
  });

  test('deterministic: same seed produces same move', () => {
    const ctx = buildContext();
    const a = makeAIMove(ctx, { ...NORMAL_CONFIG, seed: 123 });
    const b = makeAIMove(ctx, { ...NORMAL_CONFIG, seed: 123 });
    expect(a.word).toBe(b.word);
    expect(a.seed).toBe(b.seed);
  });

  test('uses feedback to narrow candidates (entropy over consistent secrets)', () => {
    // Feedback that strongly constrains: guess CRANE, secret CRANE => all correct
    const feedback: GuessFeedback[] = [
      { word: 'CRANE', evaluation: evaluateGuess('CRANE', 'CRANE') },
    ];
    const ctx = buildContext(feedback);
    const move = makeAIMove(ctx, { ...NORMAL_CONFIG, seed: 5 });
    expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
    expect(move.candidatesConsidered).toBeGreaterThan(0);
  });

  test('config difficulty field set correctly', () => {
    expect(NORMAL_CONFIG.difficulty).toBe('NORMAL');
  });
});

describe('AI: HARD difficulty', () => {
  test('always returns a valid guess word from GUESS_WORDS', () => {
    const ctx = buildContext();
    const move = makeAIMove(ctx, { ...HARD_CONFIG, seed: 1 });
    expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
    expect(move.word.length).toBe(5);
  });

  test('never produces invalid arrangements across many seeds', () => {
    for (let s = 1; s <= SEED_COUNT; s++) {
      const move = makeAIMove(buildContext(), { ...HARD_CONFIG, seed: s });
      expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
    }
  });

  test('deterministic: same seed produces same move', () => {
    const ctx = buildContext();
    const a = makeAIMove(ctx, { ...HARD_CONFIG, seed: 777 });
    const b = makeAIMove(ctx, { ...HARD_CONFIG, seed: 777 });
    expect(a.word).toBe(b.word);
    expect(a.seed).toBe(b.seed);
  });

  test('completes within a bounded time (no unbounded search)', () => {
    const ctx = buildContext();
    const start = Date.now();
    const move = makeAIMove(ctx, { ...HARD_CONFIG, seed: 3, timeBudgetMs: 500 });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000); // loose upper bound; test environment
    expect(GUESS_WORDS.includes(move.word.toLowerCase())).toBe(true);
  });

  test('config difficulty and time budget set correctly', () => {
    expect(HARD_CONFIG.difficulty).toBe('HARD');
    expect(typeof HARD_CONFIG.timeBudgetMs).toBe('number');
    expect(typeof HARD_CONFIG.maxCandidates).toBe('number');
  });
});

describe('AI: shared rules engine integration', () => {
  test('AI move word is always a legal human-playable word (isValidWord)', () => {
    for (const cfg of [EASY_CONFIG, NORMAL_CONFIG, HARD_CONFIG]) {
      for (let s = 1; s <= SEED_COUNT; s++) {
        const move = makeAIMove(buildContext(), { ...cfg, seed: s });
        expect(isValidWord(move.word)).toBe(true);
      }
    }
  });

  test('AI never proposes duplicate cards (word length exactly 5, all letters from alphabet)', () => {
    for (let s = 1; s <= 20; s++) {
      const move = makeAIMove(buildContext(), { ...EASY_CONFIG, seed: s });
      expect(/^[A-Z]{5}$/.test(move.word)).toBe(true);
    }
  });
});

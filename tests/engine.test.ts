import { describe, test, expect } from 'vitest';
import { 
  evaluateGuess, 
  isValidWord, 
  getRandomSecretWord, 
  getDailySecretWord, 
  calculateKeyboardLetterStates, 
  validateHardModeGuess,
  getGameSummary,
  type GuessResult,
  type PlayerStats
} from '../src/game/engine';

describe('Word++ Game Engine Tests', () => {
  test('evaluateGuess: Case insensitivity and mixed case handling', () => {
    const res = evaluateGuess('stare', 'slate');
    expect(res[0]).toEqual({ letter: 'S', state: 'correct' });
    expect(res[1]).toEqual({ letter: 'T', state: 'present' });
    expect(res[2]).toEqual({ letter: 'A', state: 'correct' });
    expect(res[3]).toEqual({ letter: 'R', state: 'absent' });
    expect(res[4]).toEqual({ letter: 'E', state: 'correct' });
  });

  test('evaluateGuess: All correct and all absent edge cases', () => {
    const allCorrect = evaluateGuess('SLATE', 'SLATE');
    allCorrect.forEach(r => expect(r.state).toBe('correct'));

    const allAbsent = evaluateGuess('MIGHT', 'CLOUD');
    allAbsent.forEach(r => expect(r.state).toBe('absent'));
  });

  test('evaluateGuess: Duplicate Letter Scenarios (Phase 4 requirement)', () => {
    // Secret: A P P L E
    // Guess:  P A P A L
    const res1 = evaluateGuess('PAPAL', 'APPLE');
    expect(res1[0]).toEqual({ letter: 'P', state: 'present' });
    expect(res1[1]).toEqual({ letter: 'A', state: 'present' });
    expect(res1[2]).toEqual({ letter: 'P', state: 'correct' });
    expect(res1[3]).toEqual({ letter: 'A', state: 'absent' });
    expect(res1[4]).toEqual({ letter: 'L', state: 'present' });
  });

  test('evaluateGuess: LEVEL (Secret) vs ELEVE (Guess)', () => {
    const res = evaluateGuess('ELEVE', 'LEVEL');
    expect(res[0]).toEqual({ letter: 'E', state: 'present' });
    expect(res[1]).toEqual({ letter: 'L', state: 'present' });
    expect(res[2]).toEqual({ letter: 'E', state: 'present' });
    expect(res[3]).toEqual({ letter: 'V', state: 'present' });
    expect(res[4]).toEqual({ letter: 'E', state: 'absent' });
  });

  test('evaluateGuess: ALLOW (Secret) vs LOLLY (Guess)', () => {
    const res = evaluateGuess('LOLLY', 'ALLOW');
    expect(res[0]).toEqual({ letter: 'L', state: 'present' });
    expect(res[1]).toEqual({ letter: 'O', state: 'present' });
    expect(res[2]).toEqual({ letter: 'L', state: 'correct' });
    expect(res[3]).toEqual({ letter: 'L', state: 'absent' });
    expect(res[4]).toEqual({ letter: 'Y', state: 'absent' });
  });

  test('evaluateGuess: EERIE (Secret) vs GEESE (Guess)', () => {
    const res = evaluateGuess('GEESE', 'EERIE');
    expect(res[0]).toEqual({ letter: 'G', state: 'absent' });
    expect(res[1]).toEqual({ letter: 'E', state: 'correct' });
    expect(res[2]).toEqual({ letter: 'E', state: 'present' });
    expect(res[3]).toEqual({ letter: 'S', state: 'absent' });
    expect(res[4]).toEqual({ letter: 'E', state: 'correct' });
  });

  test('isValidWord: Dictionary containment and edge cases', () => {
    expect(isValidWord('slate')).toBe(true);
    expect(isValidWord('  SLATE  ')).toBe(true);
    expect(isValidWord('abcde')).toBe(false);
    expect(isValidWord('')).toBe(false);
    expect(isValidWord('toolong')).toBe(false);
    expect(isValidWord('cat')).toBe(false);
    expect(isValidWord(null as unknown as string)).toBe(false);
    expect(isValidWord(undefined as unknown as string)).toBe(false);
  });

  test('getRandomSecretWord: Returns valid uppercase 5-letter secret word', () => {
    const word = getRandomSecretWord();
    expect(typeof word).toBe('string');
    expect(word.length).toBe(5);
    expect(word).toBe(word.toUpperCase());
    expect(isValidWord(word)).toBe(true);
  });

  test('getDailySecretWord: Daily hashing stability and default date fallback', () => {
    const word1 = getDailySecretWord('2026-11-15');
    const word2 = getDailySecretWord('2026-11-15');
    const word3 = getDailySecretWord('2026-11-16');
    const defaultWord = getDailySecretWord();
    expect(word1).toBe(word2);
    expect(word1.length).toBe(5);
    expect(word3.length).toBe(5);
    expect(typeof defaultWord).toBe('string');
    expect(defaultWord.length).toBe(5);
    expect(getDailySecretWord('2026-01-01')).toBe(getDailySecretWord('2026-01-01'));
  });

  test('calculateKeyboardLetterStates: Aggregates letter state priority', () => {
    const guesses: GuessResult[] = [
      { word: 'STARE', evaluation: evaluateGuess('STARE', 'SLATE') },
      { word: 'SLATE', evaluation: evaluateGuess('SLATE', 'SLATE') }
    ];
    const states = calculateKeyboardLetterStates(guesses);
    expect(states['S']).toBe('correct');
    expect(states['L']).toBe('correct');
    expect(states['A']).toBe('correct');
    expect(states['T']).toBe('correct');
    expect(states['E']).toBe('correct');
    expect(states['R']).toBe('absent');
  });

  test('validateHardModeGuess: Handles empty previous guesses', () => {
    expect(validateHardModeGuess('SLATE', [])).toBe(null);
    expect(validateHardModeGuess('SLATE', null as unknown as [])).toBe(null);
  });

  test('validateHardModeGuess: Enforces green and yellow letter reuse', () => {
    const prevGuesses: GuessResult[] = [
      { word: 'STARE', evaluation: evaluateGuess('STARE', 'SLATE') }
    ];
    expect(validateHardModeGuess('CRANE', prevGuesses)).toBe('1st letter must be S');
    expect(validateHardModeGuess('SPARE', prevGuesses)).toBe('Guess must contain T');
    expect(validateHardModeGuess('SPATE', prevGuesses)).toBe(null);
  });

  test('validateHardModeGuess: Enforces positional green constraints', () => {
    const prevGuesses: GuessResult[] = [
      { word: 'CLASH', evaluation: evaluateGuess('CLASH', 'SLATE') }
    ];
    expect(validateHardModeGuess('CRAZE', prevGuesses)).toBe('2nd letter must be L');
    expect(validateHardModeGuess('FLUTE', prevGuesses)).toBe('3rd letter must be A');
    const prevGuesses4: GuessResult[] = [
      { word: 'CRATE', evaluation: evaluateGuess('CRATE', 'SLATE') }
    ];
    expect(validateHardModeGuess('SLAPE', prevGuesses4)).toBe('4th letter must be T');
    expect(validateHardModeGuess('SLATS', prevGuesses4)).toBe('5th letter must be E');
  });

  test('getGameSummary: Returns correct summary for won game', () => {
    const guesses: GuessResult[] = [
      {
        word: 'SLATE',
        evaluation: [
          { letter: 'S', state: 'correct' },
          { letter: 'L', state: 'correct' },
          { letter: 'A', state: 'correct' },
          { letter: 'T', state: 'correct' },
          { letter: 'E', state: 'correct' },
        ],
      },
    ];
    const stats: PlayerStats = {
      gamesPlayed: 10, gamesWon: 7, currentStreak: 3, maxStreak: 5,
      guessDistribution: { 1: 0, 2: 1, 3: 2, 4: 2, 5: 1, 6: 1 },
    };
    const summary = getGameSummary('SLATE', guesses, 'CLASSIC', stats);
    expect(summary.won).toBe(true);
    expect(summary.finalGuess).toBe('SLATE');
    expect(summary.mode).toBe('CLASSIC');
    expect(summary.attemptsUsed).toBe(1);
    expect(summary.streak).toBe(3);
    expect(summary.winRate).toBe(70);
  });

  test('getGameSummary: Returns correct summary for lost game', () => {
    const guesses: GuessResult[] = [
      { word: 'CRANE', evaluation: evaluateGuess('CRANE', 'SLATE') },
      { word: 'STARE', evaluation: evaluateGuess('STARE', 'SLATE') },
    ];
    const stats: PlayerStats = {
      gamesPlayed: 5, gamesWon: 2, currentStreak: 0, maxStreak: 3,
      guessDistribution: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 1, 6: 0 },
    };
    const summary = getGameSummary('SLATE', guesses, 'DAILY', stats);
    expect(summary.won).toBe(false);
    expect(summary.attemptsUsed).toBe(2);
    expect(summary.streak).toBe(0);
    expect(summary.winRate).toBe(40);
  });

  test('getGameSummary: Handles zero games played (100% win rate)', () => {
    const guesses: GuessResult[] = [];
    const stats: PlayerStats = {
      gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    };
    const summary = getGameSummary('SLATE', guesses, 'FAST', stats);
    expect(summary.winRate).toBe(100);
    expect(summary.attemptsUsed).toBe(0);
  });
});
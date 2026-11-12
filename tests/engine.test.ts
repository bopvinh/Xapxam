import { describe, test, expect } from 'vitest';
import { 
  evaluateGuess, 
  isValidWord, 
  getRandomSecretWord, 
  getDailySecretWord, 
  calculateKeyboardLetterStates, 
  validateHardModeGuess 
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
    // P at 0: present (misplaced match with P at 1 in secret)
    // A at 1: present (misplaced match with A at 0 in secret)
    // P at 2: correct (exact match with P at 2 in secret)
    // A at 3: absent (since the only A in secret was matched at index 1 of guess)
    // L at 4: present (misplaced match with L at 3 in secret)
    expect(res1[0]).toEqual({ letter: 'P', state: 'present' });
    expect(res1[1]).toEqual({ letter: 'A', state: 'present' });
    expect(res1[2]).toEqual({ letter: 'P', state: 'correct' });
    expect(res1[3]).toEqual({ letter: 'A', state: 'absent' });
    expect(res1[4]).toEqual({ letter: 'L', state: 'present' });
  });

  test('evaluateGuess: LEVEL (Secret) vs ELEVE (Guess)', () => {
    // Secret: L E V E L
    // Guess:  E L E V E
    // Pass 1: None are in the same spot.
    // Pass 2:
    // Guess[0]='E' -> matches Secret[1] => present
    // Guess[1]='L' -> matches Secret[0] => present
    // Guess[2]='E' -> matches Secret[3] => present
    // Guess[3]='V' -> matches Secret[2] => present
    // Guess[4]='E' -> no more unused E => absent
    const res = evaluateGuess('ELEVE', 'LEVEL');
    expect(res[0]).toEqual({ letter: 'E', state: 'present' });
    expect(res[1]).toEqual({ letter: 'L', state: 'present' });
    expect(res[2]).toEqual({ letter: 'E', state: 'present' });
    expect(res[3]).toEqual({ letter: 'V', state: 'present' });
    expect(res[4]).toEqual({ letter: 'E', state: 'absent' });
  });

  test('evaluateGuess: ALLOW (Secret) vs LOLLY (Guess)', () => {
    // Secret: A L L O W
    // Guess:  L O L L Y
    // Pass 1:
    // Guess[2]='L' === Secret[2]='L' => correct. secretConsumed[2]=true
    // Pass 2:
    // Guess[0]='L' -> matches Secret[1] => present. secretConsumed[1]=true
    // Guess[1]='O' -> matches Secret[3] => present. secretConsumed[3]=true
    // Guess[3]='L' -> no more unused L => absent
    // Guess[4]='Y' -> absent
    const res = evaluateGuess('LOLLY', 'ALLOW');
    expect(res[0]).toEqual({ letter: 'L', state: 'present' });
    expect(res[1]).toEqual({ letter: 'O', state: 'present' });
    expect(res[2]).toEqual({ letter: 'L', state: 'correct' });
    expect(res[3]).toEqual({ letter: 'L', state: 'absent' });
    expect(res[4]).toEqual({ letter: 'Y', state: 'absent' });
  });

  test('evaluateGuess: EERIE (Secret) vs GEESE (Guess)', () => {
    // Secret: E E R I E
    // Guess:  G E E S E
    // Pass 1:
    // Guess[1]='E' === Secret[1]='E' => correct. secretConsumed[1]=true
    // Guess[4]='E' === Secret[4]='E' => correct. secretConsumed[4]=true
    // Pass 2:
    // Guess[0]='G' -> absent
    // Guess[2]='E' -> matches Secret[0] => present. secretConsumed[0]=true
    // Guess[3]='S' -> absent
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
    // Hash determinism check for same date inputs
    expect(getDailySecretWord('2026-01-01')).toBe(getDailySecretWord('2026-01-01'));
  });

  test('calculateKeyboardLetterStates: Aggregates letter state priority (correct > present > absent)', () => {
    const guesses = [
      {
        word: 'STARE',
        evaluation: evaluateGuess('STARE', 'SLATE')
      },
      {
        word: 'SLATE',
        evaluation: evaluateGuess('SLATE', 'SLATE')
      }
    ];

    const states = calculateKeyboardLetterStates(guesses);
    expect(states['S']).toBe('correct');
    expect(states['L']).toBe('correct');
    expect(states['A']).toBe('correct');
    expect(states['T']).toBe('correct');
    expect(states['E']).toBe('correct');
    expect(states['R']).toBe('absent');
  });

  test('validateHardModeGuess: Handles empty previous guesses and edge cases', () => {
    expect(validateHardModeGuess('SLATE', [])).toBe(null);
    expect(validateHardModeGuess('SLATE', null as unknown as [])).toBe(null);
  });

  test('validateHardModeGuess: Enforces green and yellow letter reuse', () => {
    // Previous guess: STARE against secret SLATE
    // S=correct (pos 0), T=present, A=correct (pos 2), R=absent, E=correct (pos 4)
    const prevGuesses = [
      {
        word: 'STARE',
        evaluation: evaluateGuess('STARE', 'SLATE')
      }
    ];

    // Invalid: missing 'S' in position 0
    expect(validateHardModeGuess('CRANE', prevGuesses)).toBe('1st letter must be S');

    // Invalid: missing 'T' (which was present)
    expect(validateHardModeGuess('SPARE', prevGuesses)).toBe('Guess must contain T');

    // Valid: keeps S at 0, A at 2, E at 4, and includes T
    expect(validateHardModeGuess('SPATE', prevGuesses)).toBe(null);
  });

  test('validateHardModeGuess: Enforces positional green constraints for all indices (2nd, 3rd, 4th, 5th)', () => {
    // Secret: SLATE
    // Guess 1: CLASH -> C(absent), L(correct pos 1), A(correct pos 2), S(present), H(absent)
    const prevGuesses = [
      {
        word: 'CLASH',
        evaluation: evaluateGuess('CLASH', 'SLATE')
      }
    ];

    // Violates 2nd letter (pos 1 must be L)
    expect(validateHardModeGuess('CRAZE', prevGuesses)).toBe('2nd letter must be L');

    // Violates 3rd letter (pos 2 must be A)
    expect(validateHardModeGuess('FLUTE', prevGuesses)).toBe('3rd letter must be A');

    // Test 4th letter violation: Secret SLATE, Guess CRATE -> T is correct at pos 3
    const prevGuesses4 = [
      {
        word: 'CRATE',
        evaluation: evaluateGuess('CRATE', 'SLATE')
      }
    ];
    // Violates 4th letter (pos 3 must be T)
    expect(validateHardModeGuess('SLAPE', prevGuesses4)).toBe('4th letter must be T');

    // Test 5th letter violation: Secret SLATE, Guess CRATE -> E is correct at pos 4
    // Violates 5th letter (pos 4 must be E)
    expect(validateHardModeGuess('SLATS', prevGuesses4)).toBe('5th letter must be E');
  });
});

import { describe, test, expect } from 'vitest';
import { evaluateGuess, isValidWord, getDailySecretWord } from '../src/game/engine';

describe('Word++ Game Engine Tests', () => {
  test('evaluateGuess: Basic Single occurrences and exact matches', () => {
    // Secret: SLATE, Guess: STARE
    const res = evaluateGuess('STARE', 'SLATE');
    expect(res[0]).toEqual({ letter: 'S', state: 'correct' }); // S correct position
    expect(res[1]).toEqual({ letter: 'T', state: 'present' }); // T present elsewhere
    expect(res[2]).toEqual({ letter: 'A', state: 'correct' }); // A correct position
    expect(res[3]).toEqual({ letter: 'R', state: 'absent' });  // R absent
    expect(res[4]).toEqual({ letter: 'E', state: 'correct' }); // E correct position
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

  test('isValidWord: Dictionary containment', () => {
    expect(isValidWord('slate')).toBe(true);
    expect(isValidWord('abcde')).toBe(false);
  });

  test('getDailySecretWord: Stability', () => {
    const word1 = getDailySecretWord('2026-11-15');
    const word2 = getDailySecretWord('2026-11-15');
    const word3 = getDailySecretWord('2026-11-16');
    expect(word1).toBe(word2);
    expect(word1.length).toBe(5);
    expect(word3.length).toBe(5);
  });
});

import { LetterEvaluation, LetterState, GuessResult } from './types';
import { GUESS_WORDS, SECRET_WORDS } from './wordlist';

/**
 * Evaluates a guess word against a secret word with correct two-pass duplicate-letter handling.
 */
export function evaluateGuess(guessWord: string, secretWord: string): LetterEvaluation[] {
  const guess = guessWord.toUpperCase();
  const secret = secretWord.toUpperCase();
  
  const result: LetterEvaluation[] = Array.from({ length: 5 }, (_, i) => ({
    letter: guess[i],
    state: 'absent'
  }));

  // Track consumed letters in the secret word
  const secretConsumed = Array(5).fill(false);
  const guessAssigned = Array(5).fill(false);

  // Pass 1: Mark correct matches (Green)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      result[i].state = 'correct';
      secretConsumed[i] = true;
      guessAssigned[i] = true;
    }
  }

  // Pass 2: Mark partial matches (Yellow)
  for (let i = 0; i < 5; i++) {
    if (guessAssigned[i]) continue;

    for (let j = 0; j < 5; j++) {
      if (!secretConsumed[j] && guess[i] === secret[j]) {
        result[i].state = 'present';
        secretConsumed[j] = true;
        break; // Stop after first unused occurrence match
      }
    }
  }

  return result;
}

/**
 * Validates whether a word is in our 5-letter dictionary.
 */
export function isValidWord(word: string): boolean {
  if (!word || typeof word !== 'string') return false;
  const clean = word.trim().toLowerCase();
  if (clean.length !== 5) return false;
  return GUESS_WORDS.includes(clean);
}

/**
 * Picks a random clean secret word.
 */
export function getRandomSecretWord(): string {
  const idx = Math.floor(Math.random() * SECRET_WORDS.length);
  return SECRET_WORDS[idx].toUpperCase();
}

/**
 * Returns the stable daily secret word for a calendar date string.
 * Uses a basic hashing algorithm to map a date to a consistent index.
 */
export function getDailySecretWord(dateStr?: string): string {
  const date = dateStr || new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = date.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SECRET_WORDS.length;
  return SECRET_WORDS[index].toUpperCase();
}

/**
 * Computes the aggregated state for each keyboard letter given previous guesses.
 * A letter retains its highest feedback priority: correct (green) > present (yellow) > absent (gray).
 */
export function calculateKeyboardLetterStates(guesses: GuessResult[]): Record<string, LetterState> {
  const states: Record<string, LetterState> = {};

  for (const guess of guesses) {
    for (const evalResult of guess.evaluation) {
      const char = evalResult.letter;
      const currentState = states[char];

      if (evalResult.state === 'correct') {
        states[char] = 'correct';
      } else if (evalResult.state === 'present') {
        if (currentState !== 'correct') {
          states[char] = 'present';
        }
      } else if (evalResult.state === 'absent') {
        if (currentState !== 'correct' && currentState !== 'present') {
          states[char] = 'absent';
        }
      }
    }
  }

  return states;
}

/**
 * Validates whether a guess satisfies Hard Mode constraints based on previous guesses.
 * Returns null if valid, or an error message describing the violation.
 */
export function validateHardModeGuess(
  currentGuess: string,
  previousGuesses: GuessResult[]
): string | null {
  if (!previousGuesses || previousGuesses.length === 0) return null;
  const guess = currentGuess.toUpperCase();

  // Aggregate required correct letters by index and present letters
  for (const prev of previousGuesses) {
    for (let i = 0; i < 5; i++) {
      const prevEval = prev.evaluation[i];
      if (prevEval.state === 'correct') {
        if (guess[i] !== prevEval.letter) {
          const ordinal = ['1st', '2nd', '3rd', '4th', '5th'][i];
          return `${ordinal} letter must be ${prevEval.letter}`;
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      const prevEval = prev.evaluation[i];
      if (prevEval.state === 'present') {
        if (!guess.includes(prevEval.letter)) {
          return `Guess must contain ${prevEval.letter}`;
        }
      }
    }
  }

  return null;
}

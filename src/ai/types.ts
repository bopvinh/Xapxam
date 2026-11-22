// Word++ — AI Opponent Types
// Defines difficulty levels, AI move contracts, and solver primitives.

import type { LetterEvaluation } from '../game/types';

export type AIDifficulty = 'EASY' | 'NORMAL' | 'HARD';

export type AIPersonalityId = 
  | 'LEXICAL_DUELIST'
  | 'SCRABBLE_WIZARD'
  | 'CHAOS_JESTER'
  | 'CRYPTIC_ORACLE'
  | 'WORDMASTER_SUPREME';

export interface AIPersonality {
  id: AIPersonalityId;
  name: string;
  title: string;
  icon: string;
  difficulty: AIDifficulty;
  description: string;
  avatarColor: string;
  quote: string;
}

export interface AIConfig {
  difficulty: AIDifficulty;
  seed: number;                 // deterministic seed for reproducible testing
  personalityId?: AIPersonalityId;
  maxCandidates?: number;       // cap candidate pool for HARD search (performance)
  timeBudgetMs?: number;        // soft time budget for HARD search
}

export interface AIMove {
  word: string;                 // the 5-letter guess
  confidence: number;           // 0..1 — how confident the AI is in this guess
  reasoning: string;            // human-readable explanation
  candidatesConsidered: number; // how many words were evaluated
  seed: number;                 // seed used (for reproducibility)
  personalityName?: string;     // Boss personality label
}

export interface AIAssessment {
  difficulty: AIDifficulty;
  secretWordLength: number;
  validGuessCount: number;
  secretWordCount: number;
}

export interface GuessFeedback {
  word: string;
  evaluation: LetterEvaluation[];
}

export interface AIContext {
  previousGuesses: GuessFeedback[];
  validWords: string[];        // GUESS_WORDS
  secretWords: string[];       // SECRET_WORDS (possible secrets, hard mode may restrict)
  hardMode: boolean;
  attemptsRemaining: number;
}

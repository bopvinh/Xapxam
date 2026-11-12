export type GameMode = 'CLASSIC' | 'DAILY' | 'PARTY' | 'FAST' | 'TIMED' | 'TEAM';

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface LetterEvaluation {
  letter: string;
  state: LetterState;
}

export interface GuessResult {
  word: string;
  evaluation: LetterEvaluation[];
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>; // 1 to 6
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  guesses: GuessResult[];
  score: number; // For party, cumulative score (low is good). For Fast, points won (high is good).
  solved: boolean;
  attemptsUsed: number;
  timeRemaining?: number; // Timed mode
}

export interface GameSettings {
  timedDuration: 60 | 90; // 60s or 90s
  colorBlindMode: boolean;
}

export interface GameState {
  mode: GameMode;
  secretWord: string;
  players: Player[];
  currentPlayerIndex: number; // Host or active guessing player in pass-and-play
  roundNumber: number;
  maxRounds: number;
  status: 'LOBBY' | 'PLAYING' | 'ROUND_OVER' | 'GAME_OVER';
  settings: GameSettings;
  dailyDate?: string; // YYYY-MM-DD for daily mode
}

import React from 'react';
import { GuessResult, LetterEvaluation, LetterState } from '../game/types';

interface GameBoardProps {
  guesses: GuessResult[];
  currentGuess: string;
  maxGuesses?: number;
  invalidRowIndex?: number | null; // For shake animation
  colorBlindMode?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  guesses,
  currentGuess,
  maxGuesses = 6,
  invalidRowIndex = null,
  colorBlindMode = false
}) => {
  const rows: JSX.Element[] = [];

  for (let r = 0; r < maxGuesses; r++) {
    const isCurrentRow = r === guesses.length;
    const isSubmittedRow = r < guesses.length;
    const isShake = invalidRowIndex === r;

    const cells: JSX.Element[] = [];

    for (let c = 0; c < 5; c++) {
      let char = '';
      let state: LetterState = 'empty';

      if (isSubmittedRow) {
        const evalRes: LetterEvaluation = guesses[r].evaluation[c];
        char = evalRes.letter;
        state = evalRes.state;
      } else if (isCurrentRow) {
        char = currentGuess[c] || '';
      }

      // Accessibiltiy symbol for color blind mode
      let symbol = '';
      if (colorBlindMode && isSubmittedRow) {
        if (state === 'correct') symbol = ' ✓';
        if (state === 'present') symbol = ' ✦';
      }

      cells.push(
        <div 
          key={c} 
          className={`board-cell ${state} ${char ? 'has-letter' : ''} ${isSubmittedRow ? 'submitted animate-flip' : ''} ${isCurrentRow ? 'active-tile' : ''}`}
          style={{ 
            animationDelay: isSubmittedRow 
              ? `${c * 150}ms` 
              : isCurrentRow 
                ? `${c * 75}ms` 
                : '0ms' 
          }}
        >
          <span className="letter-text">{char}</span>
          {symbol && <span className="cb-badge">{symbol}</span>}
        </div>
      );
    }

    rows.push(
      <div key={r} className={`board-row ${isShake ? 'shake-row' : ''}`}>
        {cells}
      </div>
    );
  }

  return (
    <div className="game-board-container">
      <div className="game-board">
        {rows}
      </div>
    </div>
  );
};

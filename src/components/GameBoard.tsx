import React from 'react';
import { GuessResult, LetterEvaluation, LetterState } from '../game/types';

interface GameBoardProps {
  guesses: GuessResult[];
  currentGuess: string;
  maxGuesses?: number;
  invalidRowIndex?: number | null; // For shake animation
  colorBlindMode?: boolean;
  /** AI Arena: the boss's last move being revealed (drives the tile-by-tile reveal). */
  aiJudgement?: 'revealing' | null;
  aiGuess?: string | null;
  aiEvaluation?: LetterEvaluation[] | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  guesses,
  currentGuess,
  maxGuesses = 6,
  invalidRowIndex = null,
  colorBlindMode = false,
  aiJudgement = null,
  aiGuess = null,
  aiEvaluation = null
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
          className={`board-cell ${state} ${char ? 'has-letter' : 'empty-slot'} ${isSubmittedRow ? 'submitted animate-flip tile-enhance-enter' : ''} ${isCurrentRow ? 'active-tile animate-stagger-enter' : ''}`}
        >
          {/* Custom tactical vector corner ticks to elevate visual cosmetics */}
          <svg className="tile-vector-accent" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,8 L0,0 L8,0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M92,0 L100,0 L100,8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M100,92 L100,100 L92,100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M8,100 L0,100 L0,92" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="letter-text">{char}</span>
          {symbol && <span className="cb-badge">{symbol}</span>}
          {isSubmittedRow && (state === 'correct' || state === 'present') && (
            <div className="tile-burst-effect" aria-hidden="true">
              <div className={`tile-shockwave ${state}`} />
              <div className={`tile-particle-spore p1 ${state}`} />
              <div className={`tile-particle-spore p2 ${state}`} />
              <div className={`tile-particle-spore p3 ${state}`} />
              <div className={`tile-particle-spore p4 ${state}`} />
            </div>
          )}
        </div>
      );
    }

    rows.push(
      <div key={r} className={`board-row ${isCurrentRow ? 'active-row' : ''} ${isShake ? 'shake-row' : ''}`}>
        {cells}
        {isCurrentRow && (
          <div className="active-row-reticle" aria-hidden="true">
            <div className="reticle-corner tl" />
            <div className="reticle-corner tr" />
            <div className="reticle-corner bl" />
            <div className="reticle-corner br" />
            <div className="reticle-scanline" />

          </div>
        )}

      </div>
    );
  }

  return (
    <div className="game-board-container">
      <div className="game-board">
        {/* AI Arena: the boss's move, revealed tile-by-tile with a spark. */}
        {aiJudgement === 'revealing' && aiGuess != null && aiEvaluation != null && (
          <div className="board-row ai-guess-row">
            <div className="ai-reveal-label">THE BOSS PLAYS</div>
            {aiGuess.split('').map((letter, c) => {
              const evalRes = aiEvaluation[c];
              const state: LetterState = evalRes.state;
              return (
                <div
                  key={c}
                  className={`board-cell ${state} has-letter submitted`}
                >
                  <span className="letter-text">{letter}</span>
                  <div className="tile-spark" aria-hidden="true">
                    <span className="spark p1" />
                    <span className="spark p2" />
                    <span className="spark p3" />
                    <span className="spark p4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {rows}
      </div>
    </div>
  );
};

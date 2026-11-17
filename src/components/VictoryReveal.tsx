import React, { useMemo } from 'react';
import { GameMode, LetterEvaluation } from '../game/types';

interface VictoryRevealProps {
  won: boolean;
  finalGuess: string;
  finalEvals: LetterEvaluation[];
  mode: GameMode;
  attemptsUsed: number;
  streak: number;
  winRate: number;
  onPlayAgain: () => void;
  onMeaning: () => void;
}

/**
 * Signature Solved-Word Reveal.
 *
 * A premium, shareable "winner's screen" that replaces the plain
 * outcome panel the moment a round is solved. It turns a silent
 * correct guess into a short 3D letter cascade + stat proof + a
 * high-emphasis "Share This Win" CTA, which is the single highest
 * conversion touch after a success.
 */
export const VictoryReveal: React.FC<VictoryRevealProps> = ({
  won,
  finalGuess,
  finalEvals,
  mode,
  attemptsUsed,
  streak,
  winRate,
  onPlayAgain,
  onMeaning,
}) => {
  if (!won) return null;

  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 20;
      const distance = 100 + Math.random() * 50;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      return {
        '--x': `${x}px`,
        '--y': `${y}px`,
        'animationDelay': `${0.8 + Math.random() * 0.4}s`
      } as React.CSSProperties;
    });
  }, []);

  return (
    <div className={`victory-reveal animate-scale is-win-aura`} role="status" aria-live="polite">
      <div className="victory-particle-explosion">
        {particles.map((style, i) => (
          <div key={i} className="victory-particle" style={style} />
        ))}
      </div>
      <div className="victory-emblem">
        <span className="victory-emblem-emoji">🏆</span>
      </div>

      <h2 className="victory-title">Word Solved!</h2>

      {/* 3D letter cascade of the solved word */}
      <div className="victory-word victory-word-shimmer">
        {finalEvals.map((ev, idx) => (
          <div
            key={idx}
            className={`word-tile ${ev.state}`}
            aria-label={`Letter ${ev.letter}, ${ev.state} match`}
          >
            <span className="word-tile-letter">{ev.letter}</span>
          </div>
        ))}
      </div>

      <p className="victory-mode">
        {mode.replace('_', ' ')} · {finalGuess}
      </p>

      <div className="victory-stats">
        <span>Attempts: <strong>{attemptsUsed}/6</strong></span>
        <span>Streak: <strong>{streak}</strong></span>
        <span>Win: <strong>{winRate}%</strong></span>
      </div>

      <div className="victory-actions">
        <button
          type="button"
          className="btn-victory-secondary"
          onClick={onPlayAgain}
          aria-label="Play again"
        >
          Play Again
        </button>
        <button
          type="button"
          className="btn-victory-ghost"
          onClick={onMeaning}
          aria-label="Show word meaning"
        >
          Meaning
        </button>
      </div>
    </div>
  );
};

import React, { useMemo, useEffect, useState } from 'react';
import { GameMode, LetterEvaluation } from '../game/types';
import '../styles/game-over-reveal.css';
import { soundManager } from '../game/audio';

interface GameOverRevealProps {
  won: boolean;
  finalGuess: string;
  finalEvals: LetterEvaluation[];
  mode: GameMode;
  attemptsUsed: number;
  secretWord: string;
  streak: number;
  winRate: number;
  onPlayAgain: () => void;
  onMeaning: () => void;
}

/**
 * Cinematic game-over reveal shown when the player runs out of attempts.
 *
 * Mirrors VictoryReveal's production value so a loss feels like a proper
 * finale rather than an abrupt, flat "Game over" screen: the player's guesses
 * resolve into place, then the secret word is revealed one dramatic tile at a
 * time, closing with encouragement and clear next-step CTAs.
 *
 * Purely presentational — reads props, plays sounds, and invokes callbacks.
 * No engine or rule logic is touched.
 */
export const GameOverReveal: React.FC<GameOverRevealProps> = ({
  won,
  finalEvals,
  attemptsUsed,
  secretWord,
  streak,
  winRate,
  onPlayAgain,
  onMeaning,
}) => {
  if (won) return null;

  const [secretRevealed, setSecretRevealed] = useState(false);
  const [secretIdx, setSecretIdx] = useState(-1);
  const [showFlash, setShowFlash] = useState(true);
  const [showCallout, setShowCallout] = useState(true);

  // Comfort: honor reduced motion by skipping staggered reveals.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sound on mount.
  useEffect(() => {
    soundManager.playFanfare();
    soundManager.playHaptic();

    const timers = [
      setTimeout(() => setShowFlash(false), 900),
      setTimeout(() => setShowCallout(false), 2200),
      setTimeout(() => setSecretRevealed(true), 700),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Dramatic one-by-one secret word tile reveal.
  useEffect(() => {
    if (!secretRevealed || prefersReducedMotion) {
      setSecretIdx(secretWord.length - 1);
      return;
    }
    const timer = setInterval(() => {
      setSecretIdx((prev) => (prev >= secretWord.length - 1 ? prev : prev + 1));
    }, prefersReducedMotion ? 0 : 120);
    return () => clearInterval(timer);
  }, [secretRevealed, secretWord.length, prefersReducedMotion]);

  const calloutPhrases = [
    'CLOSE CALL!',
    'NEAR MISS!',
    'ONE LETTER AWAY!',
    'LEXICON LOCKOUT!',
    'WORD WALL!',
  ];
  const calloutText = calloutPhrases[Math.floor(Math.random() * calloutPhrases.length)];

  // Already-evaluated guesses resolve into place on mount.
  const guessTiles = useMemo(() => {
    return finalEvals.map((ev, idx) => ({
      letter: ev.letter,
      state: ev.state,
      delay: prefersReducedMotion ? 0 : idx * 60,
    }));
  }, [finalEvals, prefersReducedMotion]);

  // Secret word letters revealed progressively.
  const secretLetters = secretWord.toUpperCase().split('');
  const revealedSecret = secretLetters.map((letter, i) => ({
    letter,
    state: 'correct' as const,
    revealed: i <= secretIdx,
    delay: prefersReducedMotion ? 0 : i * 120,
  }));

  return (
    <div className="go-overlay" role="status" aria-live="polite">
      {/* Screen flash burst */}
      {showFlash && <div className="go-flash" aria-hidden="true" />}

      {/* Callout banner */}
      {showCallout && (
        <div className="go-callout" aria-hidden="true">
          {calloutText}
        </div>
      )}

      {/* Holographic glass game-over card */}
      <div className="go-card animate-scale">
        {/* Header */}
        <div className="go-header">
          <span className="go-status-icon">💀</span>
          <h2 className="go-title">GAME OVER</h2>
        </div>

        {/* Player's guesses, resolving into place */}
        <div className="go-guesses-section">
          <span className="go-section-label">YOUR GUESSES</span>
          <div className="go-guesses-grid">
            {guessTiles.map((tile, idx) => (
              <div
                key={idx}
                className={`go-guess-tile ${tile.state}`}
                style={{ animationDelay: `${tile.delay}ms` }}
                aria-label={`Letter ${tile.letter}, ${tile.state} match`}
              >
                <span className="go-tile-letter">{tile.letter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dramatic secret word reveal */}
        <div className="go-secret-section">
          <span className="go-section-label">THE SECRET WORD WAS</span>
          <div className="go-secret-row">
            {revealedSecret.map((tile, i) => (
              <div
                key={i}
                className={`go-secret-tile ${tile.revealed ? 'revealed' : 'hidden'} ${tile.state}`}
                style={{ animationDelay: `${tile.delay}ms` }}
                aria-hidden="true"
              >
                <span className="go-secret-letter">{tile.letter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arcade stat badges */}
        <div className="go-stats-grid">
          <div className="go-stat-badge">
            <span className="stat-icon">🎯</span>
            <span className="stat-val">{attemptsUsed}</span>
            <span className="stat-lbl">Attempts</span>
          </div>
          <div className="go-stat-badge highlight">
            <span className="stat-icon">🔥</span>
            <span className="stat-val">{streak}</span>
            <span className="stat-lbl">Streak</span>
          </div>
          <div className="go-stat-badge">
            <span className="stat-icon">🏆</span>
            <span className="stat-val">{winRate}%</span>
            <span className="stat-lbl">Win Rate</span>
          </div>
        </div>

        {/* Encouraging line */}
        <p className="go-encouragement">
          One more guess and you would have had it. Ready for another round?
        </p>

        {/* Golden action CTAs */}
        <div className="go-actions-row">
          <button
            type="button"
            className="go-btn-play-again"
            onClick={() => {
              soundManager.playFlip();
              onPlayAgain();
            }}
            aria-label="Play again"
          >
            <span className="btn-glow-sweep" />
            <span>▶ PLAY AGAIN</span>
          </button>
          <button
            type="button"
            className="go-btn-secondary"
            onClick={() => {
              soundManager.playPop();
              onMeaning();
            }}
            aria-label="Show word meaning"
          >
            📖 MEANING
          </button>
        </div>
      </div>
    </div>
  );
};

GameOverReveal.displayName = 'GameOverReveal';

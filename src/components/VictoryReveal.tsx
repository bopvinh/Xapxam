import React, { useMemo, useEffect, useState } from 'react';
import { GameMode, LetterEvaluation } from '../game/types';
import '../styles/mvc2-victory.css';

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
 * AAA Arcade-Grade Victory Celebration & Showdown Card
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
    return Array.from({ length: 24 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 24;
      const distance = 120 + Math.random() * 60;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      return {
        '--x': `${x}px`,
        '--y': `${y}px`,
        'animationDelay': `${0.3 + Math.random() * 0.4}s`
      } as React.CSSProperties;
    });
  }, []);

  // Medal tier based on attempts used
  const medalTier = attemptsUsed <= 2 ? 'diamond' : attemptsUsed <= 4 ? 'gold' : 'silver';
  const medalEmoji = medalTier === 'diamond' ? '💎' : medalTier === 'gold' ? '🥇' : '🥈';
  const medalLabel = medalTier === 'diamond' ? 'PERFECT' : medalTier === 'gold' ? 'MASTERFUL' : 'SKILLED';

  const [showFlash, setShowFlash] = useState(true);
  const [showPerfect, setShowPerfect] = useState(true);

  // Callout phrases based on performance
  const calloutPhrases = [
    'PERFECT VICTORY!',
    'FLAWLESS SOLVE!',
    'MASTERCLASS!',
    'UNSTOPPABLE!',
    'LEXICON LEGEND!',
  ];
  const calloutText = calloutPhrases[Math.floor(Math.random() * calloutPhrases.length)];

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowFlash(false), 1200),
      setTimeout(() => setShowPerfect(false), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="aaa-victory-overlay" role="status" aria-live="polite">
      {/* ── Screen Flash Burst ──────────────────────────────── */}
      {showFlash && <div className="mvc2-flash-overlay" aria-hidden="true" />}

      {/* ── Callout Banner ─────────────────────────────────── */}
      {showPerfect && (
        <div className="mvc2-perfect-banner" aria-hidden="true">
          {calloutText}
        </div>
      )}

      {/* ── Holographic Glass Victory Card ─────────────────── */}
      <div className={`aaa-victory-card animate-scale medal-${medalTier}`}>
        {/* Dynamic Medal Header */}
        <div className="aaa-medal-badge" data-tier={medalTier}>
          <span className="aaa-medal-icon">{medalEmoji}</span>
          <span className="aaa-medal-text">{medalLabel}</span>
          <span className="aaa-medal-sub">{attemptsUsed}/6 GUESSES</span>
        </div>

        <h1 className="aaa-victory-title" style={{ display: 'none' }}>ROUND COMPLETE</h1>

        {/* 3D Metallic Beveled Word Tiles */}
        <div className="aaa-word-tiles-row" style={{ marginTop: '0', marginBottom: '16px' }}>
          {finalEvals.map((ev, idx) => (
            <div
              key={idx}
              className={`aaa-word-tile ${ev.state}`}
              style={{ animationDelay: `${idx * 0.08}s` }}
              aria-label={`Letter ${ev.letter}, ${ev.state} match`}
            >
              <div className="aaa-tile-shine" />
              <span className="aaa-tile-letter">{ev.letter}</span>
            </div>
          ))}
        </div>

        <p className="aaa-mode-tag">
          {mode.replace('_', ' ')} · {finalGuess}
        </p>

        {/* Arcade Leaderboard Stat Badges */}
        <div className="aaa-stats-grid">
          <div className="aaa-stat-badge">
            <span className="stat-icon">🎯</span>
            <span className="stat-val">{attemptsUsed}/6</span>
            <span className="stat-lbl">Attempts</span>
          </div>
          <div className="aaa-stat-badge highlight">
            <span className="stat-icon">🔥</span>
            <span className="stat-val">{streak}</span>
            <span className="stat-lbl">Streak</span>
          </div>
          <div className="aaa-stat-badge">
            <span className="stat-icon">🏆</span>
            <span className="stat-val">{winRate}%</span>
            <span className="stat-lbl">Win Rate</span>
          </div>
        </div>

        {/* Golden Action CTAs */}
        <div className="aaa-actions-row">
          <button
            type="button"
            className="aaa-btn-play-again"
            onClick={onPlayAgain}
            aria-label="Play again"
          >
            <span className="btn-glow-sweep" />
            <span>▶ PLAY AGAIN</span>
          </button>
          <button
            type="button"
            className="aaa-btn-secondary"
            onClick={onMeaning}
            aria-label="Show word meaning"
          >
            📖 MEANING
          </button>
        </div>

        {/* Particle Fireworks Explosion */}
        <div className="victory-particle-explosion" aria-hidden="true">
          {particles.map((style, i) => (
            <div key={i} className="victory-particle" style={style} />
          ))}
        </div>
      </div>
    </div>
  );
};

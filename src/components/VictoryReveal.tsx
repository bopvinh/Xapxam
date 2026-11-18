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
 * MvC2-Inspired Victory Celebration
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

  const edgeParticles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, _i) => ({
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 0.5}s`
      } as React.CSSProperties
    }));
  }, []);

  // Medal tier based on attempts used
  const medalTier = attemptsUsed <= 2 ? 'diamond' : attemptsUsed <= 4 ? 'gold' : 'silver';
  const medalEmoji = medalTier === 'diamond' ? '💎' : medalTier === 'gold' ? '🥇' : '🥈';
  const medalLabel = medalTier === 'diamond' ? 'PERFECT' : medalTier === 'gold' ? 'MASTERFUL' : 'SKILLED';

  // Streak fire intensity
  

  // MvC2 state
  const [showFlash, setShowFlash] = useState(true);
  const [showPerfect, setShowPerfect] = useState(true);
  const [showCombo, setShowCombo] = useState(true);
  const [showCallout, setShowCallout] = useState(true);

  // Callout phrases based on performance
  const calloutPhrases = [
    'PERFECT!',
    'FLAWLESS VICTORY!',
    'MASTERCLASS!',
    'UNSTOPPABLE!',
    'LEXICON LEGEND!',
    'WORD WARRIOR!',
  ];
  const calloutText = calloutPhrases[Math.floor(Math.random() * calloutPhrases.length)];

  // Generate MvC2 particles
  const mvc2Particles = useMemo(() => {
    const particles = [];
    const types = ['spark', 'energy', 'flare'] as const;
    for (let i = 0; i < 36; i++) {
      const angle = (Math.PI * 2 * i) / 36;
      const distance = 80 + Math.random() * 120;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const type = types[Math.floor(Math.random() * types.length)];
      particles.push({
        type,
        style: {
          left: '50%',
          top: '50%',
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          '--rot': `${Math.random() * 720 - 360}deg`,
          animationDelay: `${Math.random() * 0.3}s`,
        } as React.CSSProperties,
      });
    }
    return particles;
  }, []);

  // Cleanup timers
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowFlash(false), 1200),
      setTimeout(() => setShowPerfect(false), 3000),
      setTimeout(() => setShowCombo(false), 2500),
      setTimeout(() => setShowCallout(false), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      {/* MvC2 Screen Flash Overlay */}
      {showFlash && <div className="mvc2-flash-overlay" aria-hidden="true" />}

      {/* MvC2 PERFECT Banner */}
      {showPerfect && (
        <div className="mvc2-perfect-banner" aria-hidden="true">
          {medalLabel}
        </div>
      )}

      {/* MvC2 Combo Counter */}
      {showCombo && (
        <div className="mvc2-combo-display" aria-hidden="true">
          {attemptsUsed}
          <span className="mvc2-combo-label">ATTEMPTS</span>
        </div>
      )}

      {/* MvC2 Callout */}
      {showCallout && (
        <div className="mvc2-callout" style={{ color: medalTier === 'diamond' ? '#f59e0b' : medalTier === 'gold' ? '#fde047' : '#60a5fa' }} aria-hidden="true">
          {calloutText}
        </div>
      )}

      {/* MvC2 Particle Burst */}
      <div className="mvc2-particle-container" aria-hidden="true">
        {mvc2Particles.map((p, i) => (
          <div key={i} className={`mvc2-particle ${p.type}`} style={p.style} />
        ))}
      </div>

      {/* Main Victory Reveal Container */}
      <div className={`victory-reveal animate-scale is-win-aura medal-${medalTier} mvc2-mode`} role="status" aria-live="polite" style={{
        height: '100vh',
        width: '90%',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        overflow: 'hidden'
      }}>
        {edgeParticles.map((p, i) => (
          <div key={i} className="victory-edge-particle" style={p.style} />
        ))}
        <div className="victory-particle-explosion">
          {particles.map((style, i) => (
            <div key={i} className="victory-particle" style={style} />
          ))}
        </div>

        {/* Dynamic Medal Display */}
        <div className="victory-medal" data-tier={medalTier}>
          <div className="medal-glow" />
          <span className="medal-emoji">{medalEmoji}</span>
          <span className="medal-label">{medalLabel}</span>
          <span className="medal-attempts">{attemptsUsed}/6</span>
        </div>

        <h2 className="victory-title">Word Solved!</h2>

        {/* 3D Letter Cascade with MvC2 Victory Pose */}
        <div className="victory-word victory-word-shimmer">
          {finalEvals.map((ev, idx) => (
            <div
              key={idx}
              className={`word-tile ${ev.state} mvc2-victory`}
              style={{ animationDelay: `${idx * 0.08}s` }}
              aria-label={`Letter ${ev.letter}, ${ev.state} match`}
            >
              <span className="word-tile-letter">{ev.letter}</span>
            </div>
          ))}
        </div>

        {/* Streak Fire Visualization with MvC2 Surge */}

        <p className="victory-mode">
          {mode.replace('_', ' ')} · {finalGuess}
        </p>

        <div className="victory-stats">
          <span>Attempts: <strong>{attemptsUsed}/6</strong></span>
          <span>Streak: <strong>{streak}</strong></span>
          <span>Win: <strong>{winRate}%</strong></span>
        </div>

        <div className="victory-actions" style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={onPlayAgain}
            aria-label="Play again"
            style={{ padding: '16px 32px', fontSize: '16px' }}
          >
            Play Again
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onMeaning}
            aria-label="Show word meaning"
            style={{ padding: '16px 32px', fontSize: '16px' }}
          >
            Meaning
          </button>
        </div>
      </div>
    </>
  );
};

import React from 'react';
import { PlayerStats } from '../game/types';

interface MasteryStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: PlayerStats | null;
}

export const MasteryStatsModal: React.FC<MasteryStatsModalProps> = ({
  isOpen,
  onClose,
  stats
}) => {
  if (!isOpen) return null;

  const gamesPlayed = stats?.gamesPlayed || 0;
  const gamesWon = stats?.gamesWon || 0;
  const currentStreak = stats?.currentStreak || 0;
  const maxStreak = stats?.maxStreak || 0;

  const xpEarned = gamesWon * 250 + gamesPlayed * 50;
  const currentLevel = Math.floor(xpEarned / 500) + 1;
  const currentLevelXP = xpEarned % 500;
  const progressPercent = Math.min((currentLevelXP / 500) * 100, 100);

  const getTier = (lvl: number) => {
    if (lvl >= 10) return { title: 'Grandmaster Lexicon', badge: '👑', color: '#f59e0b' };
    if (lvl >= 5) return { title: 'Master Wordsmith', badge: '💎', color: '#818cf8' };
    if (lvl >= 3) return { title: 'Adept Solver', badge: '⚡', color: '#22d3a0' };
    return { title: 'Novice Seeker', badge: '🌱', color: '#94a3b8' };
  };

  const tier = getTier(currentLevel);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mastery-modal animate-scale" onClick={(e) => e.stopPropagation()} style={{
        maxHeight: '95vh',
        width: '90vw',
        maxWidth: '500px'
      }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🎖️</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Mastery & XP Progression</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Level up through victories and streak endurance</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
          {/* Level Header Banner */}
          <div
            style={{
              padding: '16px',
              background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.25) 0%, rgba(13, 17, 23, 0.95) 100%)',
              borderRadius: '14px',
              border: `1.5px solid ${tier.color}`,
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '32px' }}>{tier.badge}</span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: tier.color, marginTop: '2px' }}>
              Level {currentLevel} · {tier.title}
            </h3>
            <div style={{ marginTop: '10px', background: 'var(--bg-void)', borderRadius: '8px', padding: '4px', border: '1px solid var(--bg-elevated)' }}>
              <div
                style={{
                  height: '10px',
                  borderRadius: '6px',
                  background: 'linear-gradient(90deg, #6366f1 0%, #22d3a0 100%)',
                  width: `${progressPercent}%`,
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
              {currentLevelXP} / 500 XP to Level {currentLevel + 1}
            </span>
          </div>

          {/* Core Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px 4px', borderRadius: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', display: 'block' }}>{gamesPlayed}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Played</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px 4px', borderRadius: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--correct)', display: 'block' }}>{gamesWon}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Won</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px 4px', borderRadius: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#f59e0b', display: 'block' }}>{currentStreak}🔥</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Streak</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px 4px', borderRadius: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--accent-bright)', display: 'block' }}>{maxStreak}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

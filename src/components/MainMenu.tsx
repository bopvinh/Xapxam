import React, { useState, useEffect } from 'react';
import { GameMode } from '../game/types';
import { soundManager } from '../game/audio';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onOpenDailyChest?: () => void;
  onOpenMentor?: () => void;
  onOpenBlitz?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenMastery?: () => void;
}

interface ModeConfig {
  mode: GameMode;
  label: string;
  description: string;
  tag: string;
  tagColor: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'CLASSIC',
    label: 'Classic Play',
    description: 'One secret 5-letter word. Six attempts.',
    tag: 'SOLO',
    tagColor: '#818cf8',
  },
  {
    mode: 'DAILY',
    label: 'Daily Challenge',
    description: 'Same word for everyone. Keep streak!',
    tag: 'DAILY',
    tagColor: '#f59e0b',
  },
  {
    mode: 'PARTY',
    label: 'Multiplayer Party',
    description: '2–4 players. Host rotating word challenge.',
    tag: 'PARTY',
    tagColor: '#ec4899',
  },
  {
    mode: 'FAST',
    label: 'Fast Mode',
    description: 'Solve first to end round and score point.',
    tag: 'SPEED',
    tagColor: '#facc15',
  },
  {
    mode: 'TIMED',
    label: 'Timed Mode',
    description: 'Beat the 60 or 90s countdown clock!',
    tag: 'TIMED',
    tagColor: '#f43f5e',
  },
  {
    mode: 'TEAM',
    label: 'Team Challenge',
    description: 'Combine forces. Work together to solve.',
    tag: 'CO-OP',
    tagColor: '#06b6d4',
  },
];

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenHelp,
  onOpenStats,
}) => {
  const [flippedTile, setFlippedTile] = useState<number | null>(null);
  const [dailyCountdown, setDailyCountdown] = useState<string>('00:00:00');

  useEffect(() => {
    const calcCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
      const h = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');
      setDailyCountdown(`${h}:${m}:${s}`);
    };
    calcCountdown();
    const interval = setInterval(calcCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTileClick = (index: number) => {
    soundManager.playFlip();
    setFlippedTile(index);
    setTimeout(() => setFlippedTile(null), 800);
  };

  const handleHover = () => {
    soundManager.playHover();
  };

  const tiles = ['W', 'O', 'R', 'D', '++'];

  return (
    <div className="main-menu-container animate-scale">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section" aria-label="Game title">
        <div className="hero-tiles-row" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          {tiles.map((letter, idx) => (
            <div
              key={idx}
              className={`hero-interactive-tile ${flippedTile === idx ? 'tile-flip' : ''}`}
              onClick={() => handleTileClick(idx)}
              onMouseEnter={handleHover}
              title="Click to flip!"
              role="button"
              tabIndex={0}
            >
              <span className="hero-tile-letter">{letter}</span>
            </div>
          ))}
        </div>
        <p className="hero-subtitle">The Ultimate Word Challenge</p>
      </section>

      {/* ── Primary CTA ──────────────────────────────────── */}
      <div className="hero-cta">
        <button
          className="btn-play-now"
          onClick={() => {
            soundManager.playFlip();
            onSelectMode('CLASSIC');
          }}
          onMouseEnter={handleHover}
          aria-label="Play Classic mode"
        >
          <div className="btn-play-now-glow" />
          <span style={{ position: 'relative', zIndex: 2 }}>Play Now</span>
        </button>
        <span className="hero-cta-label">Classic · 5 letters · 6 guesses</span>
      </div>

      {/* ── Modes grid ───────────────────────────────────── */}
      <div>
        <p className="menu-section-label" aria-hidden="true">All Modes</p>
        <div
          className="menu-options-grid"
          role="list"
          aria-label="Game modes"
          style={{ marginTop: '12px' }}
        >
          {MODES.map(({ mode, label, description, tag, tagColor }) => {
            const isDaily = mode === 'DAILY';
            return (
              <button
                key={mode}
                className={`menu-card ${isDaily ? 'daily-highlight-card' : ''}`}
                onClick={() => {
                  soundManager.playFlip();
                  onSelectMode(mode);
                }}
                onMouseEnter={handleHover}
                role="listitem"
                aria-label={`${label} — ${description}`}
              >
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3>{label}</h3>
                      {isDaily && (
                        <span className="daily-pulse-badge">FEATURED</span>
                      )}
                    </div>
                    <span className="mode-category-tag" style={{ color: tagColor, borderColor: tagColor, background: `${tagColor}15` }}>
                      {tag}
                    </span>
                  </div>
                  <p>{description}</p>
                  {isDaily && (
                    <div className="daily-timer-ticker">
                      <span>⏳ Resets in {dailyCountdown}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Social Proof & Community Activity Ticker ──────── */}
      <div className="social-proof-ticker" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 14px', borderRadius: '20px', marginTop: '12px' }}>
        <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3a0', boxShadow: '0 0 8px #22d3a0' }} />
        <span><strong style={{ color: 'var(--text-primary)' }}>1,428 Solvers</strong> online</span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span><strong style={{ color: '#f59e0b' }}>8,920</strong> Puzzles Solved Today</span>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="menu-footer">
        <button className="btn-secondary" onClick={onOpenHelp}>
          How to Play
        </button>
        <button className="btn-secondary" onClick={onOpenStats}>
          Statistics
        </button>
      </div>
    </div>
  );
};

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

// ── Mode Icon SVG Components (High-Fidelity Dual-Toned Vectors) ────────
const ClassicIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" stroke="var(--accent-bright)"/>
    <path d="M6 6h10M6 10h10M6 14h6" stroke="#f59e0b" strokeWidth="2.5"/>
  </svg>
);

const DailyIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="4" rx="3" ry="3" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.1)"/>
    <line x1="16" x2="16" y1="2" y2="6" stroke="#f59e0b"/>
    <line x1="8" x2="8" y1="2" y2="6" stroke="#f59e0b"/>
    <line x1="3" x2="21" y1="10" y2="10" stroke="#f59e0b"/>
    <path d="m9 16 2 2 4-4" stroke="var(--correct)" strokeWidth="2.5"/>
  </svg>
);

const PartyIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5.8 11.3 2 22l10.7-3.79" stroke="#ec4899" fill="rgba(236, 72, 153, 0.15)"/>
    <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M20 12l2-2M15 15l3 3M11 6l2 2" stroke="#f59e0b" strokeWidth="2.5"/>
    <path d="m14.5 12.5 2.5-2.5-4-4L10.5 8.5" stroke="var(--accent-bright)"/>
  </svg>
);

const FastIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2.2"/>
  </svg>
);

const TimedIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="var(--accent-bright)" fill="rgba(99, 102, 241, 0.1)"/>
    <polyline points="12 6 12 12 16 14" stroke="#f43f5e" strokeWidth="2.5"/>
  </svg>
);

const TeamIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#06b6d4"/>
    <circle cx="9" cy="7" r="4" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.1)"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#22d3a0"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#22d3a0"/>
  </svg>
);

interface ModeConfig {
  mode: GameMode;
  icon: React.ReactNode;
  label: string;
  description: string;
  tag: string;
  tagColor: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'CLASSIC',
    icon: <ClassicIcon />,
    label: 'Classic Play',
    description: 'One secret 5-letter word. Six attempts.',
    tag: 'SOLO',
    tagColor: '#818cf8',
  },
  {
    mode: 'DAILY',
    icon: <DailyIcon />,
    label: 'Daily Challenge',
    description: 'Same word for everyone. Keep streak!',
    tag: 'DAILY',
    tagColor: '#f59e0b',
  },
  {
    mode: 'PARTY',
    icon: <PartyIcon />,
    label: 'Multiplayer Party',
    description: '2–4 players. Host rotating word challenge.',
    tag: 'PARTY',
    tagColor: '#ec4899',
  },
  {
    mode: 'FAST',
    icon: <FastIcon />,
    label: 'Fast Mode',
    description: 'Solve first to end round and score point.',
    tag: 'SPEED',
    tagColor: '#facc15',
  },
  {
    mode: 'TIMED',
    icon: <TimedIcon />,
    label: 'Timed Mode',
    description: 'Beat the 60 or 90s countdown clock!',
    tag: 'TIMED',
    tagColor: '#f43f5e',
  },
  {
    mode: 'TEAM',
    icon: <TeamIcon />,
    label: 'Team Challenge',
    description: 'Combine forces. Work together to solve.',
    tag: 'CO-OP',
    tagColor: '#06b6d4',
  },
];

/** Chevron-right indicator on each mode card */
const ChevronRight: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

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
          <span className="btn-play-now-icon" aria-hidden="true">▶</span>
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
          {MODES.map(({ mode, icon, label, description, tag, tagColor }) => {
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
                <div className="card-icon-wrap" aria-hidden="true">
                  {icon}
                </div>
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
                <span className="card-arrow" aria-hidden="true">
                  <ChevronRight />
                </span>
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

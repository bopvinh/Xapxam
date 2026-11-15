import React from 'react';
import { GameMode } from '../game/types';

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

// ── Mode Icon SVG Components ─────────────────────────────────
const ClassicIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
    <path d="M6 6h10M6 10h10M6 14h6"/>
  </svg>
);

const DailyIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
    <path d="m9 16 2 2 4-4"/>
  </svg>
);

const PartyIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5.8 11.3 2 22l10.7-3.79"/>
    <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M20 12l2-2M15 15l3 3M11 6l2 2"/>
    <path d="m14.5 12.5 2.5-2.5-4-4L10.5 8.5"/>
  </svg>
);

const FastIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const TimedIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const TeamIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

interface ModeConfig {
  mode: GameMode;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'CLASSIC',
    icon: <ClassicIcon />,
    label: 'Classic Play',
    description: 'One secret five-letter word. Six attempts.',
  },
  {
    mode: 'DAILY',
    icon: <DailyIcon />,
    label: 'Daily Challenge',
    description: 'Same word for everyone today. Keep your streak!',
  },
  {
    mode: 'PARTY',
    icon: <PartyIcon />,
    label: 'Multiplayer Party',
    description: '2–4 players. Host rotating word challenge.',
  },
  {
    mode: 'FAST',
    icon: <FastIcon />,
    label: 'Fast Mode',
    description: 'Solve first to end the round and score a point.',
  },
  {
    mode: 'TIMED',
    icon: <TimedIcon />,
    label: 'Timed Mode',
    description: 'Beat the 60 or 90-second countdown clock!',
  },
  {
    mode: 'TEAM',
    icon: <TeamIcon />,
    label: 'Team Challenge',
    description: 'Combine forces. Work together to find the word.',
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
  return (
    <div className="main-menu-container animate-scale">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section" aria-label="Game title">
        <p className="hero-eyebrow">Word Game</p>
        <h1 className="hero-logo">
          WORD<span className="plus-accent">++</span>
        </h1>
        <p className="hero-subtitle">The Ultimate Word Challenge</p>
      </section>

      {/* ── Primary CTA ──────────────────────────────────── */}
      <div className="hero-cta">
        <button
          className="btn-play-now"
          onClick={() => onSelectMode('CLASSIC')}
          aria-label="Play Classic mode"
        >
          <span className="btn-play-now-icon" aria-hidden="true">▶</span>
          Play Now
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
          {MODES.map(({ mode, icon, label, description }) => (
            <button
              key={mode}
              className="menu-card"
              onClick={() => onSelectMode(mode)}
              role="listitem"
              aria-label={`${label} — ${description}`}
            >
              <div className="card-icon-wrap" aria-hidden="true">
                {icon}
              </div>
              <div className="card-body">
                <h3>{label}</h3>
                <p>{description}</p>
              </div>
              <span className="card-arrow" aria-hidden="true">
                <ChevronRight />
              </span>
            </button>
          ))}
        </div>
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

import React from 'react';
import { GameMode } from '../game/types';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

interface ModeConfig {
  mode: GameMode;
  icon: string;
  label: string;
  description: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'CLASSIC',
    icon: '📚',
    label: 'Classic Play',
    description: 'One secret five-letter word. Six attempts.',
  },
  {
    mode: 'DAILY',
    icon: '📅',
    label: 'Daily Challenge',
    description: 'Same word for everyone today. Keep your streak!',
  },
  {
    mode: 'PARTY',
    icon: '🎉',
    label: 'Multiplayer Party',
    description: '2–4 players. Host rotating word challenge.',
  },
  {
    mode: 'FAST',
    icon: '⚡',
    label: 'Fast Mode',
    description: 'Solve first to end the round and score a point.',
  },
  {
    mode: 'TIMED',
    icon: '⏱️',
    label: 'Timed Mode',
    description: 'Beat the 60 or 90-second countdown clock!',
  },
  {
    mode: 'TEAM',
    icon: '👥',
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

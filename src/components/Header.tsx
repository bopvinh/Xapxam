import React from 'react';
import { GameMode } from '../game/types';

interface HeaderProps {
  mode: GameMode | null;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onHomeClick: () => void;
  colorBlindMode: boolean;
  onToggleColorBlind: () => void;
  hardMode: boolean;
  onToggleHardMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

/** Home icon */
const HomeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

/** Question-mark / help icon */
const HelpIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/** Sound-on icon */
const SoundOnIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

/** Sound-off icon */
const SoundOffIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

/** Lightning / hard-mode icon */
const HardModeIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

/** Eye / color-blind icon */
const EyeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/** Bar-chart / stats icon */
const StatsIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

/** Format the mode label for display */
function formatMode(mode: GameMode): string {
  return mode.replace('_', ' ');
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onOpenHelp,
  onOpenStats,
  onHomeClick,
  colorBlindMode,
  onToggleColorBlind,
  hardMode,
  onToggleHardMode,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="app-header" role="banner">
      {/* ── Left: navigation ─────────────────────────────── */}
      <div className="header-left">
        <button
          className="icon-btn home-btn"
          onClick={onHomeClick}
          title="Main Menu"
          aria-label="Go to Main Menu"
        >
          <HomeIcon />
        </button>
        <button
          className="icon-btn help-btn"
          onClick={onOpenHelp}
          title="How to Play"
          aria-label="How to Play"
        >
          <HelpIcon />
        </button>
      </div>

      {/* ── Center: brand + mode badge ───────────────────── */}
      <div className="header-center">
        <h1
          className="logo-title"
          onClick={onHomeClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onHomeClick()}
          aria-label="Word++ — go to main menu"
        >
          WORD<span className="plus-accent">++</span>
        </h1>
        {mode && (
          <div className="badge-row" aria-live="polite">
            <span className="mode-badge">{formatMode(mode)}</span>
            {hardMode && <span className="hard-badge" aria-label="Hard mode active">HARD</span>}
          </div>
        )}
      </div>

      {/* ── Right: settings cluster ───────────────────────── */}
      <div className="header-right" role="toolbar" aria-label="Game settings">
        <button
          className={`icon-btn toggle-sound-btn${soundEnabled ? ' active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>

        <button
          className={`icon-btn toggle-hard-btn${hardMode ? ' active hard-active' : ''}`}
          onClick={onToggleHardMode}
          title={hardMode ? 'Hard Mode: ON' : 'Hard Mode: OFF'}
          aria-label={hardMode ? 'Disable hard mode' : 'Enable hard mode'}
          aria-pressed={hardMode}
        >
          <HardModeIcon />
        </button>

        <button
          className={`icon-btn toggle-cb-btn${colorBlindMode ? ' active' : ''}`}
          onClick={onToggleColorBlind}
          title={colorBlindMode ? 'Color-blind mode: ON' : 'Color-blind mode: OFF'}
          aria-label={colorBlindMode ? 'Disable color-blind mode' : 'Enable color-blind mode'}
          aria-pressed={colorBlindMode}
        >
          <EyeIcon />
        </button>

        <button
          className="icon-btn stats-btn"
          onClick={onOpenStats}
          title="Statistics"
          aria-label="View statistics"
        >
          <StatsIcon />
        </button>
      </div>
    </header>
  );
};

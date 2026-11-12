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
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onOpenHelp,
  onOpenStats,
  onHomeClick,
  colorBlindMode,
  onToggleColorBlind,
  hardMode,
  onToggleHardMode
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="icon-btn home-btn" onClick={onHomeClick} title="Main Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
        <button className="icon-btn help-btn" onClick={onOpenHelp} title="How to Play">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
      </div>

      <div className="header-center">
        <h1 className="logo-title" onClick={onHomeClick}>
          WORD<span className="plus-accent">++</span>
        </h1>
        {mode && (
          <div className="badge-row">
            <span className="mode-badge">{mode.replace('_', ' ')}</span>
            {hardMode && <span className="hard-badge">HARD</span>}
          </div>
        )}
      </div>

      <div className="header-right">
        <button 
          className={`icon-btn toggle-hard-btn ${hardMode ? 'active hard-active' : ''}`}
          onClick={onToggleHardMode}
          title={hardMode ? "Hard Mode: ON (Strict clues)" : "Hard Mode: OFF"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </button>
        <button 
          className={`icon-btn toggle-cb-btn ${colorBlindMode ? 'active' : ''}`}
          onClick={onToggleColorBlind}
          title={colorBlindMode ? "Color-blind mode: ON" : "Color-blind mode: OFF"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        <button className="icon-btn stats-btn" onClick={onOpenStats} title="Statistics">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </button>
      </div>
    </header>
  );
};

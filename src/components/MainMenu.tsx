import React from 'react';
import { GameMode } from '../game/types';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenHelp,
  onOpenStats
}) => {
  return (
    <div className="main-menu-container card-panel animate-scale">
      <div className="hero-section">
        <h1 className="hero-logo animate-pulse">
          WORD<span className="plus-accent">++</span>
        </h1>
        <p className="hero-subtitle">The Ultimate Word Challenge</p>
      </div>

      <div className="menu-options-grid">
        <button 
          className="menu-card primary-card animate-hover" 
          onClick={() => onSelectMode('CLASSIC')}
        >
          <div className="card-icon">📚</div>
          <div className="card-body">
            <h3>Classic Play</h3>
            <p>One secret five-letter word. Max six attempts.</p>
          </div>
        </button>

        <button 
          className="menu-card daily-card animate-hover" 
          onClick={() => onSelectMode('DAILY')}
        >
          <div className="card-icon">📅</div>
          <div className="card-body">
            <h3>Daily Challenge</h3>
            <p>Same secret word for all players today. Keep your streak!</p>
          </div>
        </button>

        <button 
          className="menu-card party-card animate-hover" 
          onClick={() => onSelectMode('PARTY')}
        >
          <div className="card-icon">🎉</div>
          <div className="card-body">
            <h3>Multiplayer Party</h3>
            <p>2 to 4 players. Host rotating word challenge.</p>
          </div>
        </button>

        <button 
          className="menu-card fast-card animate-hover" 
          onClick={() => onSelectMode('FAST')}
        >
          <div className="card-icon">⚡</div>
          <div className="card-body">
            <h3>Fast Mode</h3>
            <p>Solve first to end the round and score 1 point.</p>
          </div>
        </button>

        <button 
          className="menu-card timed-card animate-hover" 
          onClick={() => onSelectMode('TIMED')}
        >
          <div className="card-icon">⏱️</div>
          <div className="card-body">
            <h3>Timed Mode</h3>
            <p>Beat the 60 or 90-second countdown clock!</p>
          </div>
        </button>

        <button 
          className="menu-card team-card animate-hover" 
          onClick={() => onSelectMode('TEAM')}
        >
          <div className="card-icon">👥</div>
          <div className="card-body">
            <h3>Team Challenge</h3>
            <p>Combine forces. Work with teammates to find the word.</p>
          </div>
        </button>
      </div>

      <div className="menu-footer">
        <button className="btn-secondary" onClick={onOpenHelp}>
          How To Play
        </button>
        <button className="btn-secondary" onClick={onOpenStats}>
          View Statistics
        </button>
      </div>
    </div>
  );
};

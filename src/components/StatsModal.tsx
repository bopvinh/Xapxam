import React from 'react';
import { PlayerStats } from '../game/types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onReset?: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, onReset }) => {
  if (!isOpen) return null;

  const totalPlayed = stats.gamesPlayed;
  const winPercent = totalPlayed > 0 ? Math.round((stats.gamesWon / totalPlayed) * 100) : 0;

  const maxCount = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content stats-modal animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Game Statistics</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-val">{totalPlayed}</span>
              <span className="stat-label">Played</span>
            </div>
            <div className="stat-card">
              <span className="stat-val">{winPercent}%</span>
              <span className="stat-label">Win %</span>
            </div>
            <div className={`stat-card ${stats.currentStreak > 0 ? 'has-streak' : ''}`}>
              <span className="stat-val">{stats.currentStreak}</span>
              <span className="stat-label">Streak</span>
            </div>
            <div className="stat-card">
              <span className="stat-val">{stats.maxStreak}</span>
              <span className="stat-label">Max Streak</span>
            </div>
          </div>

          <h3 className="section-title">Guess Distribution</h3>
          <div className="dist-chart">
            {[1, 2, 3, 4, 5, 6].map((guessNum) => {
              const count = stats.guessDistribution[guessNum] || 0;
              const percent = Math.max((count / maxCount) * 100, 5);
              return (
                <div key={guessNum} className="dist-row">
                  <span className="dist-label">{guessNum}</span>
                  <div className="dist-bar-wrapper">
                    <div 
                      className={`dist-bar ${count > 0 ? 'active' : ''}`} 
                      style={{ width: `${percent}%` }}
                    >
                      <span className="dist-count">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          {onReset && (
            <button className="btn-secondary btn-danger" onClick={onReset}>
              Reset Stats
            </button>
          )}
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

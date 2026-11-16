import React, { useState, useEffect } from 'react';

interface FloatingHUDProps {
  streak: number;
  winRate: number;
}

export const FloatingHUD: React.FC<FloatingHUDProps> = ({ streak, winRate }) => {
  const [liveUsers, setLiveUsers] = useState(1420);
  const [activity, setActivity] = useState('Sarah just solved the Daily!');

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
      const activities = [
        'James just solved the Daily!',
        'New record: 12 day streak by user42',
        '3,402 puzzles solved in the last hour',
        'Alex solved in 2 guesses!',
        'Global challenge word: BRAIN',
        'User "WordKing" is on fire: 50 streak!',
      ];
      setActivity(activities[Math.floor(Math.random() * activities.length)]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="floating-hud-root">
      <style>{`
        .floating-hud-root {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          pointer-events: none;
          font-family: var(--font-display, sans-serif);
        }

        .hud-card {
          pointer-events: auto;
          background: rgba(13, 17, 23, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15);
          animation: hud-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          min-width: 200px;
        }

        .hud-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 8px;
        }

        .hud-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary, #8d9ec4);
        }

        .hud-value {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
        }

        .hud-value.highlight {
          color: #f59e0b;
          text-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
        }

        .live-indicator {
          background: rgba(34, 211, 160, 0.1);
          border: 1px solid rgba(34, 211, 160, 0.3);
          border-radius: 20px;
          padding: 4px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #22d3a0;
          animation: slide-in-right 0.6s ease-out;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: #22d3a0;
          border-radius: 50%;
          box-shadow: 0 0 8px #22d3a0;
          animation: dot-pulse 2s infinite;
        }

        .activity-ticker {
          font-size: 11px;
          color: var(--text-secondary, #8d9ec4);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 6px 10px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        @keyframes hud-pop {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes dot-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="live-indicator">
        <div className="pulse-dot" />
        <span>{liveUsers.toLocaleString()} Playing Now</span>
      </div>

      <div className="hud-card">
        <div className="hud-stat-row">
          <div className="hud-item">
            <div className="hud-label">Streak</div>
            <div className={`hud-value ${streak > 0 ? 'highlight' : ''}`}>
              {streak > 0 ? `🔥 ${streak}` : '0'}
            </div>
          </div>
          <div className="hud-item" style={{ textAlign: 'right' }}>
            <div className="hud-label">Win Rate</div>
            <div className="hud-value">{winRate}%</div>
          </div>
        </div>
        <div className="activity-ticker">
          {activity}
        </div>
      </div>
    </div>
  );
};

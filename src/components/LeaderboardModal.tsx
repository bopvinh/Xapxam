import React from 'react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userScore?: number;
}

const MOCK_LEADERS = [
  { rank: 1, name: 'NovaLexicon', score: 9850, streak: 42, badge: '👑' },
  { rank: 2, name: 'CipherQueen', score: 8740, streak: 35, badge: '🥈' },
  { rank: 3, name: 'VortexVanguard', score: 7920, streak: 28, badge: '🥉' },
  { rank: 4, name: 'You (Player 1)', score: 6450, streak: 14, badge: '⚡', isUser: true },
  { rank: 5, name: 'AeroWord', score: 5310, streak: 11, badge: '🌱' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content leaderboard-modal animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Global Hall of Fame</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Top Daily Solvers & Arena Champions</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--bg-elevated-2)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-void)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--bg-elevated-2)' }}>
                  <th style={{ padding: '10px 12px' }}>Rank</th>
                  <th style={{ padding: '10px 12px' }}>Player</th>
                  <th style={{ padding: '10px 12px' }}>Score</th>
                  <th style={{ padding: '10px 12px' }}>Streak</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERS.map((leader) => (
                  <tr
                    key={leader.rank}
                    style={{
                      borderBottom: '1px solid var(--bg-elevated-2)',
                      background: leader.isUser ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      fontWeight: leader.isUser ? 800 : 500
                    }}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ marginRight: '4px' }}>{leader.badge}</span>
                      #{leader.rank}
                    </td>
                    <td style={{ padding: '10px 12px', color: leader.isUser ? 'var(--accent-bright)' : 'var(--text-primary)' }}>
                      {leader.name}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--correct)', fontWeight: 700 }}>
                      {leader.score.toLocaleString()} XP
                    </td>
                    <td style={{ padding: '10px 12px', color: '#f59e0b' }}>
                      {leader.streak} 🔥
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

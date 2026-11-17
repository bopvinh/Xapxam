import React, { useState, useEffect } from 'react';

interface Reward {
  id: string;
  label: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic';
  icon: string;
}

const DAILY_REWARDS: Reward[] = [
  {
    id: 'streak-shield',
    label: 'Streak Shield',
    description: 'Protects your streak for one missed day',
    rarity: 'rare',
    icon: '🛡️',
  },
  {
    id: 'keycap-set',
    label: 'Neon Keycap Set',
    description: 'Unlocks a new keyboard theme',
    rarity: 'epic',
    icon: '⌨️',
  },
  {
    id: 'bonus-stripe',
    label: 'Bonus Stripe Token',
    description: '+1 bonus stripe on your next win',
    rarity: 'common',
    icon: '🏷️',
  },
  {
    id: 'undo-token',
    label: 'Undo Token',
    description: 'Retract your last guess once per game',
    rarity: 'rare',
    icon: '↩️',
  },
];

interface DailyChestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (reward: Reward) => void;
}

export const DailyChestModal: React.FC<DailyChestModalProps> = ({
  isOpen,
  onClose,
  onClaim,
}) => {
  const [claimedToday, setClaimedToday] = useState<boolean>(false);
  const [reward, setReward] = useState<Reward | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const lastClaimed = localStorage.getItem('wordplusplus_daily_chest');
    const today = new Date().toISOString().split('T')[0];
    setClaimedToday(lastClaimed === today);
  }, [isOpen]);

  const handleClaim = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('wordplusplus_daily_chest', today);
    const picked = DAILY_REWARDS[Math.floor(Math.random() * DAILY_REWARDS.length)];
    setReward(picked);
    setClaimedToday(true);
    onClaim(picked);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content daily-chest-modal animate-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>🎁 Daily Chest</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {claimedToday ? (
            <div className="chest-claimed">
              <div className="chest-icon">🔒</div>
              <h3>Chest Claimed Today</h3>
              <p>Come back tomorrow for your next daily reward!</p>
            </div>
          ) : reward ? (
            <div className="chest-revealed">
              <div className={`chest-icon ${reward.rarity}`}>{reward.icon}</div>
              <h3>{reward.label}</h3>
              <p>{reward.description}</p>
              <span className={`chest-rarity ${reward.rarity}`}>
                {reward.rarity.toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="chest-closed">
              <div className="chest-icon">🎁</div>
              <h3>Open Your Daily Chest</h3>
              <p>Claim your free reward for playing today!</p>
              <button
                className="btn-primary"
                onClick={handleClaim}
                aria-label="Open daily chest"
              >
                Open Chest
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

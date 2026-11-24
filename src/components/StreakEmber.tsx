import React from 'react';

interface StreakEmberProps {
  /** Current multi-round win streak. A value of 0 hides the badge. */
  streak: number;
  /** True to sharpen the glow and pulse faster (used as a win flare). */
  flare?: boolean;
}

/**
 * Small, warm "streak ember" badge shown on the single-player board.
 *
 * Reinforces the streak reward loop: it is subtle during play, flares on a
 * recent win, and never blocks the core guess -> feedback -> reveal loop.
 */
export const StreakEmber: React.FC<StreakEmberProps> = ({ streak, flare = false }) => {
  if (streak <= 0) return null;

  return (
    <span
      className={`streak-ember${flare ? ' streak-ember--flame' : ''}`}
      role="status"
      aria-label={`${streak} consecutive win${streak === 1 ? '' : 's'}`}
    >
      <span className="streak-ember__icon">🔥</span>
      <span className="streak-ember__count">{streak}</span>
    </span>
  );
};

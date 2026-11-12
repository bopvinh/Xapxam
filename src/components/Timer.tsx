import React, { useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onTimeout: () => void;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  timeLeft,
  setTimeLeft,
  onTimeout,
  isActive
}) => {
  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeout, isActive, setTimeLeft]);

  const percentage = (timeLeft / duration) * 100;
  const isLowTime = timeLeft <= 15;

  return (
    <div className="timer-container">
      <div className="timer-header">
        <span className="timer-label">Time Remaining:</span>
        <span className={`timer-digits ${isLowTime ? 'time-critical' : ''}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="timer-bar-bg">
        <div 
          className={`timer-bar-fg ${isLowTime ? 'bar-critical' : ''}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

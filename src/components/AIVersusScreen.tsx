import React, { useEffect } from 'react';
import { AIPersonality } from '../ai/index';
import { soundManager } from '../game/audio';
import '../styles/ai-versus-screen.css';

interface AIVersusScreenProps {
  boss: AIPersonality;
  hardMode: boolean;
  onComplete: () => void;
}

export const AIVersusScreen: React.FC<AIVersusScreenProps> = ({
  boss,
  hardMode,
  onComplete,
}) => {
  useEffect(() => {
    // Play sound FX
    soundManager.playFanfare();

    // Auto-advance timer after 3.2s
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="versus-overlay"
      onClick={onComplete}
      role="button"
      tabIndex={0}
      aria-label="Click to skip versus animation"
    >
      <div className="vs-emblem">VS</div>

      <div className="versus-content">
        {/* Human Fighter Card */}
        <div
          className="fighter-card player"
          style={
            {
              '--fighter-color': '#38bdf8',
              '--fighter-glow': 'rgba(56, 189, 248, 0.3)',
            } as React.CSSProperties
          }
        >
          <div className="fighter-icon">👤</div>
          <div className="fighter-name">YOU</div>
          <div className="fighter-title">CHALLENGER</div>
          <div className="taunt-container">
            <p className="taunt-text">
              "Ready to conquer the arena and prove human superiority!"
            </p>
          </div>
        </div>

        {/* AI Boss Fighter Card */}
        <div
          className="fighter-card boss"
          style={
            {
              '--fighter-color': boss.avatarColor || '#f43f5e',
              '--fighter-glow': `${boss.avatarColor || '#f43f5e'}55`,
            } as React.CSSProperties
          }
        >
          <div className="fighter-icon">{boss.icon}</div>
          <div className="fighter-name">{boss.name}</div>
          <div className="fighter-title">
            {boss.title} {hardMode && '• ⚡ HARD'}
          </div>
          <div className="taunt-container">
            <p className="taunt-text">"{boss.quote}"</p>
          </div>
        </div>
      </div>

      <div className="versus-footer">
        <span className="skip-hint">CLICK ANYWHERE TO SKIP</span>
      </div>
    </div>
  );
};

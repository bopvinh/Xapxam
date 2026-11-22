import React, { useState } from 'react';
import { AIPersonality, AI_PERSONALITIES } from '../ai/index';
import { soundManager } from '../game/audio';

interface AIArenaSetupProps {
  onStart: (personality: AIPersonality, useHardMode: boolean) => void;
  onBack: () => void;
}

export const AIArenaSetup: React.FC<AIArenaSetupProps> = ({ onStart, onBack }) => {
  const [selectedId, setSelectedId] = useState<string>(AI_PERSONALITIES[0].id);
  const [useHardMode, setUseHardMode] = useState<boolean>(false);

  const selectedPersonality = AI_PERSONALITIES.find((p) => p.id === selectedId) || AI_PERSONALITIES[0];

  const handleSelect = (id: string) => {
    soundManager.playPop();
    setSelectedId(id);
  };

  const handleStartGame = () => {
    soundManager.playFlip();
    onStart(selectedPersonality, useHardMode);
  };

  return (
    <div className="setup-container card-panel animate-scale" style={{ maxWidth: '650px', margin: '0 auto', color: '#fff' }}>
      <div className="setup-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '1px', color: '#f43f5e' }}>💥 AI Boss Arena 💥</h2>
        <p className="subtitle" style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Select an AI opponent with distinct strategy and play style</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Boss Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {AI_PERSONALITIES.map((boss) => {
            const isSelected = boss.id === selectedId;
            const diffColor = boss.difficulty === 'EASY' ? '#38bdf8' : boss.difficulty === 'NORMAL' ? '#a855f7' : '#f59e0b';
            return (
              <div
                key={boss.id}
                onClick={() => handleSelect(boss.id)}
                style={{
                  background: isSelected ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: `2px solid ${isSelected ? '#f43f5e' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isSelected ? '0 0 15px rgba(244, 63, 94, 0.3)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>{boss.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>{boss.name}</h3>
                    <span style={{ fontSize: '9px', color: diffColor, fontWeight: 800 }}>{boss.difficulty}</span>
                  </div>
                </div>
                <p style={{ fontSize: '11px', margin: 0, color: 'var(--text-secondary)', lineHeight: '1.4' }}>{boss.description}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Boss Quote Card */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100px',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: '-10px', left: '16px', background: '#f43f5e', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
            {selectedPersonality.title.toUpperCase()}
          </div>
          <p style={{ fontStyle: 'italic', color: '#e2e8f0', margin: '8px 0', fontSize: '13px', textAlign: 'center' }}>
            "{selectedPersonality.quote}"
          </p>
        </div>

        {/* Hard Mode Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', color: '#fff' }}>⚡ Hard Mode Rules</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>AI and human must adhere strictly to discovered clues.</p>
          </div>
          <input
            type="checkbox"
            checked={useHardMode}
            onChange={(e) => {
              soundManager.playPop();
              setUseHardMode(e.target.checked);
            }}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f43f5e' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}
        >
          Back to Menu
        </button>
        <button
          onClick={handleStartGame}
          className="btn-primary"
          style={{
            flex: 2,
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #f43f5e, #ec4899)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)',
          }}
        >
          ENGAGE DUEL ⚔️
        </button>
      </div>
    </div>
  );
};

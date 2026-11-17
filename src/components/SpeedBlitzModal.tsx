import React, { useState } from 'react';

interface SpeedBlitzModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBlitz: (seconds: number) => void;
}

export const SpeedBlitzModal: React.FC<SpeedBlitzModalProps> = ({
  isOpen,
  onClose,
  onStartBlitz
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(45);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content blitz-modal animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Speed Blitz Rush</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Adrenaline Rush Wordle · Score Multiplier</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.2) 0%, rgba(13, 17, 23, 0.9) 100%)', borderRadius: '14px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <span style={{ fontSize: '36px', fontWeight: 900, color: 'var(--accent-bright)', fontFamily: 'var(--font-display)' }}>
              {selectedDuration}s
            </span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Countdown clock starts immediately. Every remaining second awards +50 Bonus XP!
            </p>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Select Rush Pace:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { time: 30, label: 'Hyper (30s)', mult: '3.0x XP' },
                { time: 45, label: 'Turbo (45s)', mult: '2.0x XP' },
                { time: 60, label: 'Standard (60s)', mult: '1.5x XP' }
              ].map((item) => (
                <button
                  key={item.time}
                  className={`btn-secondary ${selectedDuration === item.time ? 'active-blitz-btn' : ''}`}
                  onClick={() => setSelectedDuration(item.time)}
                  style={{
                    padding: '10px 4px',
                    textAlign: 'center',
                    borderColor: selectedDuration === item.time ? 'var(--accent)' : 'var(--bg-elevated-2)',
                    background: selectedDuration === item.time ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '12px' }}>{item.label}</strong>
                  <span style={{ fontSize: '10px', color: 'var(--correct)' }}>{item.mult}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => onStartBlitz(selectedDuration)}
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)' }}
          >
            ⚡ Start Speed Rush
          </button>
        </div>
      </div>
    </div>
  );
};

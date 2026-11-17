import React, { useState } from 'react';
import { LetterState } from '../game/types';

interface KeyboardProps {
  onChar: (char: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  letterStates: Record<string, LetterState>;
  disabled?: boolean;
  isSubmitting?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
];

export const Keyboard: React.FC<KeyboardProps> = ({
  onChar,
  onEnter,
  onDelete,
  letterStates,
  disabled = false,
  isSubmitting = false
}) => {
  const [activeSpinKey, setActiveSpinKey] = useState<string | null>(null);

  const handleClick = (key: string) => {
    if (disabled) return;
    
    // Trigger 3D-spin animation for character keys
    if (key !== 'ENTER' && key !== 'DEL') {
      setActiveSpinKey(key);
      setTimeout(() => setActiveSpinKey(null), 300);
    }

    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'DEL') {
      onDelete();
    } else {
      onChar(key);
    }
  };

  return (
    <div className={`keyboard-container ${isSubmitting ? 'is-submitting' : ''}`}>
      {KEYBOARD_ROWS.map((row, rIdx) => (
        <div key={rIdx} className="keyboard-row">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'DEL';
            const state = isSpecial ? '' : letterStates[key] || '';
            const isEnter = key === 'ENTER';
            const isSpinning = activeSpinKey === key;

            let label: React.ReactNode = key;
            if (key === 'ENTER') {
              label = (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 10 4 15 9 20"/>
                    <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                  </svg>
                  <span>ENTER</span>
                </span>
              );
            } else if (key === 'DEL') {
              label = (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Delete">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                  <line x1="18" y1="9" x2="12" y2="15"/>
                  <line x1="12" y1="9" x2="18" y2="15"/>
                </svg>
              );
            }

            return (
              <button
                key={key}
                type="button"
                className={`key-btn ${isSpecial ? 'special-key' : ''} ${state} ${isEnter && isSubmitting ? 'enter-shockwave-source' : ''} ${isSpinning ? 'is-spinning' : ''}`}
                onClick={() => handleClick(key)}
                disabled={disabled}
              >
                <span className="key-label">{label}</span>
                {state === 'absent' && (
                  <div className="key-particle-container" aria-hidden="true">
                    {[
                      { x: '-18px', y: '-16px', size: 3, delay: '0.45s' },
                      { x: '20px', y: '-12px', size: 4, delay: '0.48s' },
                      { x: '-22px', y: '14px', size: 3, delay: '0.42s' },
                      { x: '16px', y: '18px', size: 2, delay: '0.50s' },
                      { x: '-12px', y: '-22px', size: 4, delay: '0.46s' },
                      { x: '24px', y: '8px', size: 3, delay: '0.44s' },
                      { x: '0px', y: '-24px', size: 2, delay: '0.49s' },
                      { x: '-8px', y: '22px', size: 3, delay: '0.47s' },
                    ].map((p, i) => (
                      <span
                        key={i}
                        className="key-particle"
                        style={{
                          '--x': p.x,
                          '--y': p.y,
                          width: `${p.size}px`,
                          height: `${p.size}px`,
                          animationDelay: p.delay,
                        } as React.CSSProperties}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

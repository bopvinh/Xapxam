import React from 'react';
import { LetterState } from '../game/types';

interface KeyboardProps {
  onChar: (char: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  letterStates: Record<string, LetterState>;
  disabled?: boolean;
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
  disabled = false
}) => {
  const handleClick = (key: string) => {
    if (disabled) return;
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'DEL') {
      onDelete();
    } else {
      onChar(key);
    }
  };

  return (
    <div className="keyboard-container">
      {KEYBOARD_ROWS.map((row, rIdx) => (
        <div key={rIdx} className="keyboard-row">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'DEL';
            const state = isSpecial ? '' : letterStates[key] || '';

            return (
              <button
                key={key}
                type="button"
                className={`key-btn ${isSpecial ? 'special-key' : ''} ${state}`}
                onClick={() => handleClick(key)}
                disabled={disabled}
              >
                {key === 'DEL' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

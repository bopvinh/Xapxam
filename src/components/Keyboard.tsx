import React from 'react';
import { LetterState } from '../game/types';

interface KeyboardProps {
  onChar: (char: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  letterStates: Record<string, LetterState>;
  disabled?: boolean;
  lastPressedKey?: string | null;
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
  lastPressedKey
}) => {
  const [animatingKey, setAnimatingKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (lastPressedKey) {
      setAnimatingKey(lastPressedKey);
    }
  }, [lastPressedKey]);

  const handleClick = (key: string) => {
    if (disabled) return;
    setAnimatingKey(key);
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
            const isAnimating = animatingKey === key;

            return (
              <button
                key={key}
                type="button"
                className={`key-btn ${isSpecial ? 'special-key' : ''} ${state} ${isAnimating ? 'animate-key-spin' : ''}`}
                onClick={() => handleClick(key)}
                onAnimationEnd={() => setAnimatingKey(null)}
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

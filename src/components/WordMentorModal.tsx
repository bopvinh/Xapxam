import React, { useState, useEffect } from 'react';

interface WordMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  word?: string;
}

export const WordMentorModal: React.FC<WordMentorModalProps> = ({
  isOpen,
  onClose,
  word = 'CLIMB'
}) => {
  const [hintLevel, setHintLevel] = useState<number>(1);
  const [revealedVowel, setRevealedVowel] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setHintLevel(1);
      setRevealedVowel(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const upper = word.toUpperCase();
  const vowels = upper.split('').filter((c) => 'AEIOU'.includes(c));
  const firstVowel = vowels[0] || 'A';

  const hints = [
    `First letter starts with "${upper[0]}" and contains ${vowels.length} vowel(s).`,
    `Rhyme / Semantic category: High-tier vocabulary word with strong consonants.`,
    `Ending letter resolves with "${upper[upper.length - 1]}".`
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mentor-modal animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🧙‍♂️</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Word Mentor AI</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tactical Hints & Vocabulary Booster</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: '12px', border: '1px solid var(--bg-elevated-2)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Level {hintLevel} Tactical Clue
            </span>
            <p style={{ marginTop: '6px', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {hints[hintLevel - 1]}
            </p>
          </div>

          {revealedVowel && (
            <div style={{ background: 'rgba(34, 211, 160, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid var(--correct)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--correct)' }}>
                ✨ Vowel Radar Unlocked: Key vowel is &ldquo;{firstVowel}&rdquo;
              </span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => setHintLevel((prev) => Math.min(prev + 1, 3))}
              disabled={hintLevel >= 3}
              style={{ fontSize: '12px', padding: '10px' }}
            >
              {hintLevel < 3 ? `Deepen Hint (${hintLevel}/3)` : 'Max Clues Reached'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setRevealedVowel(true)}
              disabled={revealedVowel}
              style={{ fontSize: '12px', padding: '10px', borderColor: 'var(--correct)' }}
            >
              {revealedVowel ? 'Vowel Active' : 'Reveal Vowel Clue'}
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Apply Clues</button>
        </div>
      </div>
    </div>
  );
};

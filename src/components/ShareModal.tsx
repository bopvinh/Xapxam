import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  word?: string;
  attemptsUsed?: number;
  solved?: boolean;
  scoreText?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  word = 'POWER',
  attemptsUsed = 3,
  solved = true,
  scoreText
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const defaultShare = scoreText || `Word++ 👑 ${solved ? attemptsUsed : 'X'}/6\n\n🟩🟩🟩🟩🟩\n\nPlay at: http://localhost:5175/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultShare).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(defaultShare)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content share-modal animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Victory Badge & Share</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Show off your word mastery to rivals</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(34, 211, 160, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(34, 211, 160, 0.3)',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '28px' }}>🎉</span>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--correct)', marginTop: '4px' }}>
              {solved ? `Solved in ${attemptsUsed}/6 Attempts!` : `Challenge Finished: ${word}`}
            </h3>
            <pre
              style={{
                background: 'var(--bg-void)',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '10px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap'
              }}
            >
              {defaultShare}
            </pre>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? '✅ Copied Grid!' : '📋 Copy Emoji Grid'}
            </button>
            <button
              className="btn-secondary"
              onClick={handleTwitterShare}
              style={{ borderColor: '#38bdf8', color: '#38bdf8' }}
            >
              🐦 Share to X
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

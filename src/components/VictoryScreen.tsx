import React from 'react';

interface VictoryScreenProps {
  winner: string;
  onPlayAgain?: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ winner, onPlayAgain }) => {
  return (
    <div className="victory-screen animate-scale" style={{ textAlign: 'center', padding: '32px 16px' }}>
      <h1 style={{ fontSize: '36px', color: '#22d3a0', margin: '0 0 12px 0', letterSpacing: '4px' }}>VICTORY</h1>
      <p style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '24px' }}>{winner} Wins!</p>
      {onPlayAgain && (
        <button 
          className="btn-primary" 
          onClick={onPlayAgain}
          style={{ padding: '12px 28px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default VictoryScreen;

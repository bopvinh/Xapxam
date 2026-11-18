import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface VictoryScreenProps {
  winner: string;
  roomID?: string;
  playerHP?: number;
  guessesCount?: number;
  onPlayAgain?: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  winner, 
  roomID,
  playerHP = 100,
  guessesCount = 0,
  onPlayAgain 
}) => {
  const [animatedHP, setAnimatedHP] = useState(0);
  const isFlawless = playerHP === 100 && guessesCount <= 3;

  useEffect(() => {
    // Animate HP count
    const interval = setInterval(() => {
      setAnimatedHP(prev => {
        if (prev >= playerHP) {
          clearInterval(interval);
          return playerHP;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [playerHP]);

  const handleRematch = () => {
    if (roomID) {
      const socket = io('http://localhost:3000');
      socket.emit('request_rematch', roomID);
      socket.disconnect();
    } else if (onPlayAgain) {
      onPlayAgain();
    }
  };

  return (
    <div className="victory-screen animate-scale" style={{ 
      textAlign: 'center', 
      padding: '16px', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <h1 style={{ 
        fontSize: 'clamp(32px, 8vw, 48px)', 
        color: isFlawless ? '#F59E0B' : '#22d3a0', 
        margin: '0 0 12px 0', 
        letterSpacing: '6px',
        textShadow: isFlawless ? '0 0 20px rgba(245, 158, 11, 0.5)' : 'none'
      }}>
        {isFlawless ? '⚡ FLAWLESS ⚡' : 'VICTORY'}
      </h1>
      <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: 'var(--text-primary)', marginBottom: '24px', fontWeight: 600 }}>
        {winner} Wins!
      </p>

      <div className="stats-animation" style={{ 
        background: 'rgba(255,255,255,0.03)', 
        padding: '16px', 
        borderRadius: '12px', 
        width: '100%',
        maxWidth: '400px', 
        margin: '0 auto 32px auto' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Remaining HP:</span>
          <span style={{ color: '#22d3a0', fontWeight: 600 }}>{animatedHP} HP</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Guesses Used:</span>
          <span style={{ color: '#F59E0B', fontWeight: 600 }}>{guessesCount} / 6</span>
        </div>
      </div>

      <button 
        className="btn-primary" 
        onClick={handleRematch}
        style={{ padding: '12px 28px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}
      >
        {roomID ? 'Request Rematch' : 'Play Again'}
      </button>
    </div>
  );
};

export default VictoryScreen;

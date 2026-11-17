import React, { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard'; 
import { GuessResult } from '../game/types';
import { io } from 'socket.io-client';

interface BattleBoardProps {
  roomID: string;
  guesses: GuessResult[];
  currentGuess: string;
}

export const BattleBoard: React.FC<BattleBoardProps> = ({ 
  roomID,
  guesses, 
  currentGuess 
}) => {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.emit('join', roomID);
    
    socket.on('damage_received', (data: { damage: number }) => {
      setPlayerHealth(prev => Math.max(0, prev - data.damage));
      setShake(true);
      setTimeout(() => setShake(false), 500);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomID]);

  return (
    <div className={`battle-board ${shake ? 'shake-row' : ''}`}>
      <div className="combat-hud" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 8px' }}>
        <div className="health-bar player" style={{ color: '#22d3a0', fontWeight: 600 }}>
          Player HP: {playerHealth}
        </div>
        <div className="health-bar opponent" style={{ color: '#f43f5e', fontWeight: 600 }}>
          Opponent HP: {opponentHealth}
        </div>
      </div>
      <GameBoard guesses={guesses} currentGuess={currentGuess} />
    </div>
  );
};

export default BattleBoard;

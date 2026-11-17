import React from 'react';
import { GameBoard } from './GameBoard'; 
import { GuessResult } from '../game/types';

interface BattleBoardProps {
  playerHealth: number;
  opponentHealth: number;
  guesses: GuessResult[];
  currentGuess: string;
}

export const BattleBoard: React.FC<BattleBoardProps> = ({ 
  playerHealth, 
  opponentHealth, 
  guesses, 
  currentGuess 
}) => {
  return (
    <div className="battle-board">
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

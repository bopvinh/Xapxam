import React from 'react';
import GameBoard from './GameBoard'; // Assume this is where the main board is

interface BattleBoardProps {
  playerHealth: number;
  opponentHealth: number;
  // ... other props
}

const BattleBoard: React.FC<BattleBoardProps> = ({ playerHealth, opponentHealth }) => {
  return (
    <div className="battle-board">
      <div className="combat-hud">
        <div className="health-bar player">Health: {playerHealth}</div>
        <div className="health-bar opponent">Opponent: {opponentHealth}</div>
      </div>
      <GameBoard />
    </div>
  );
};

export default BattleBoard;

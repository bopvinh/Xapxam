import React from 'react';
import { GameBoard } from './GameBoard'; 
import { GuessResult } from '../game/types';

interface BattleBoardProps {
  playerHealth: number;
  opponentHealth: number;
  guesses: GuessResult[];
  currentGuess: string;
}

const BattleBoard: React.FC<BattleBoardProps> = ({ playerHealth, opponentHealth, guesses, currentGuess }) => {
  return (
    <div className="battle-board">
      <div className="combat-hud">
        <div className="health-bar player">Health: {playerHealth}</div>
        <div className="health-bar opponent">Opponent: {opponentHealth}</div>
      </div>
      <GameBoard guesses={guesses} currentGuess={currentGuess} />
    </div>
  );
};

export default BattleBoard;
import React, { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard'; 
import { GuessResult } from '../game/types';
import { io } from 'socket.io-client';

interface BattleBoardProps {
  roomID?: string;
  guesses: GuessResult[];
  currentGuess: string;
  playerName?: string;
  opponentName?: string;
  invalidRowIndex?: number | null;
  colorBlindMode?: boolean;
}

export const BattleBoard: React.FC<BattleBoardProps> = ({ 
  roomID,
  guesses, 
  currentGuess,
  playerName = 'YOU',
  opponentName = 'OPPONENT',
  invalidRowIndex = null,
  colorBlindMode = false
}) => {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [gauge, setGauge] = useState(0);
  const [shake, setShake] = useState(false);
  const [combatMessage, setCombatMessage] = useState('⚔️ BATTLE ENGAGED');

  // Compute damage dealt to opponent based on correct letters in last guess
  useEffect(() => {
    if (guesses.length > 0) {
      const last = guesses[guesses.length - 1];
      const correctCount = last.evaluation.filter(e => e.state === 'correct').length;
      const presentCount = last.evaluation.filter(e => e.state === 'present').length;
      
      const dmg = correctCount * 15 + presentCount * 5;
      if (dmg > 0) {
        setOpponentHealth(prev => Math.max(0, prev - dmg));
        setGauge(prev => Math.min(100, prev + correctCount * 20));
        setCombatMessage(`💥 HIT! Dealt -${dmg} DMG to ${opponentName}`);
      }
    }
  }, [guesses, opponentName]);

  useEffect(() => {
    if (!roomID) return;
    const socket = io('http://localhost:3000');
    socket.emit('join', roomID);
    
    socket.on('damage_received', (data: { damage: number; gauge: number }) => {
      setPlayerHealth(prev => Math.max(0, prev - data.damage));
      setGauge(prev => Math.min(100, prev + data.gauge));
      setShake(true);
      setCombatMessage(`⚠️ CRITICAL! Received -${data.damage} DMG!`);
      setTimeout(() => setShake(false), 500);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomID]);

  return (
    <div className={`battle-board-wrapper ${shake ? 'shake-row' : ''}`} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* ── Arcade PvP Combat HUD ───────────────────────────── */}
      <div className="pvp-combat-hud">
        {/* Player Status */}
        <div className="combat-side player-side">
          <div className="combat-name">{playerName}</div>
          <div className="hp-bar-outer">
            <div className="hp-bar-inner player-hp" style={{ width: `${playerHealth}%` }} />
          </div>
          <div className="hp-text">{playerHealth} HP</div>
        </div>

        {/* Center Super Gauge & Callout */}
        <div className="combat-center">
          <div className="combat-callout">{combatMessage}</div>
          <div className="super-gauge-outer">
            <div className="super-gauge-inner" style={{ width: `${gauge}%` }} />
          </div>
          <div className="gauge-label">SUPER {gauge}%</div>
        </div>

        {/* Opponent Status */}
        <div className="combat-side opponent-side">
          <div className="combat-name">{opponentName}</div>
          <div className="hp-bar-outer">
            <div className="hp-bar-inner opponent-hp" style={{ width: `${opponentHealth}%` }} />
          </div>
          <div className="hp-text">{opponentHealth} HP</div>
        </div>
      </div>

      {/* Main Game Board */}
      <GameBoard 
        guesses={guesses} 
        currentGuess={currentGuess} 
        invalidRowIndex={invalidRowIndex}
        colorBlindMode={colorBlindMode}
      />
    </div>
  );
};

export default BattleBoard;

import React, { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard'; 
import { GuessResult } from '../game/types';
import { initPvPSocket, joinRoom, onDamageReceived, onGaugeReceived } from '../game/pvp-engine';

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
  const [opponentHealth] = useState(100); // Server or opponent state managed externally or via synced events
  const [gauge, setGauge] = useState(0);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [combatMessage, setCombatMessage] = useState('⚔️ BATTLE ENGAGED');

  useEffect(() => {
    if (!roomID) return;
    initPvPSocket(roomID);
    joinRoom(roomID);

    const offDamage = onDamageReceived((data) => {
      setPlayerHealth(prev => Math.max(0, prev - data.damage));
      setShake(true);
      setFlash(true);
      setCombatMessage(`⚠️ CRITICAL! Received -${data.damage} DMG!`);
      setTimeout(() => {
        setShake(false);
        setFlash(false);
      }, 500);
    });

    const offGauge = onGaugeReceived((data) => {
      setGauge(prev => Math.min(100, prev + data.gauge));
      if (data.damageDealt) {
        setCombatMessage(`💥 HIT! Dealt -${data.damageDealt} DMG to ${opponentName}`);
      }
    });

    return () => {
      offDamage();
      offGauge();
    };
  }, [roomID, opponentName]);

  return (
    <div className={`battle-board-wrapper ${shake ? 'shake-row' : ''}`} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {flash && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(244, 63, 94, 0.3)',
            zIndex: 99,
            pointerEvents: 'none',
            borderRadius: '12px',
            animation: 'screen-flash-red 0.5s ease-out'
          }} 
        />
      )}
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

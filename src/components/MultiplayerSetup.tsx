import React, { useState } from 'react';
import { GameMode } from '../game/types';
import { isValidWord } from '../game/engine';
import { createRoom, joinRoom } from '../game/pvp-engine';

interface PlayerInput {
  name: string;
}

interface MultiplayerSetupProps {
  mode: GameMode;
  onStart: (setupData: {
    players: { name: string; isHost: boolean }[];
    secretWord: string;
    maxRounds: number;
    teamCount?: number;
  }) => void;
  onBack: () => void;
}

export const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({
  mode,
  onStart,
  onBack
}) => {
  const [lobbyMode, setLobbyMode] = useState<'LOCAL' | 'CREATE' | 'JOIN'>('LOCAL');
  const [roomCode, setRoomCode] = useState<string>('');
  const [createdCode, setCreatedCode] = useState<string>('');
  
  const [playerList, setPlayerList] = useState<PlayerInput[]>([
    { name: 'Player 1' },
    { name: 'Player 2' },
    { name: 'Player 3' }
  ]);
  const [hostIndex, setHostIndex] = useState<number>(0);
  const [customWord, setCustomWord] = useState<string>('');
  const [customWordError, setCustomWordError] = useState<string>('');
  const [rounds, setRounds] = useState<number>(3);

  const handleCreateRoom = () => {
    const code = createRoom();
    setCreatedCode(code);
    setLobbyMode('CREATE');
  };

  const handleJoinRoom = () => {
    if (roomCode.length === 4) {
      joinRoom(roomCode);
      setLobbyMode('JOIN');
    }
  };

  const handleNameChange = (idx: number, value: string) => {
    const updated = [...playerList];
    updated[idx].name = value;
    setPlayerList(updated);
  };

  const handleAddPlayer = () => {
    if (playerList.length >= 4) return;
    setPlayerList([...playerList, { name: `Player ${playerList.length + 1}` }]);
  };

  const handleRemovePlayer = (idx: number) => {
    if (playerList.length <= 2) return;
    const updated = playerList.filter((_, i) => i !== idx);
    setPlayerList(updated);
    if (hostIndex >= updated.length) {
      setHostIndex(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedWord = customWord.trim().toUpperCase();
    if (!formattedWord) {
      setCustomWordError('Secret word is required');
      return;
    }
    if (formattedWord.length !== 5) {
      setCustomWordError('Secret word must be exactly 5 letters');
      return;
    }
    if (!isValidWord(formattedWord)) {
      setCustomWordError('Not a valid English 5-letter word');
      return;
    }

    setCustomWordError('');

    // Prepare list of players
    const preparedPlayers = playerList.map((p, idx) => ({
      name: p.name.trim() || `Player ${idx + 1}`,
      isHost: idx === hostIndex
    }));

    onStart({
      players: preparedPlayers,
      secretWord: formattedWord,
      maxRounds: rounds
    });
  };

  return (
    <div className="setup-container card-panel animate-scale">
      <div className="setup-header">
        <h2>{mode.replace('_', ' ')} Setup</h2>
        <p className="subtitle">Select connection mode or local pass-and-play</p>
      </div>

      <div className="lobby-selector" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button className={`btn-secondary ${lobbyMode === 'LOCAL' ? 'active' : ''}`} onClick={() => setLobbyMode('LOCAL')}>Local</button>
        <button className={`btn-secondary ${lobbyMode === 'CREATE' ? 'active' : ''}`} onClick={handleCreateRoom}>Create Room</button>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input type="text" placeholder="CODE" maxLength={4} value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} style={{ width: '60px' }} />
          <button className="btn-secondary" onClick={handleJoinRoom}>Join</button>
        </div>
      </div>

      {lobbyMode === 'CREATE' && (
        <div className="lobby-info" style={{ marginBottom: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <h3>Room Created: {createdCode}</h3>
          <p>Share this code with your opponents!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-section">
          <h3>Players Selection (2 - 4 players)</h3>
          <div className="player-input-list">
            {playerList.map((player, idx) => (
              <div key={idx} className="player-row">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder={`Player ${idx + 1} Name`}
                  maxLength={15}
                  required
                />
                
                <label className="radio-host-label">
                  <input
                    type="radio"
                    name="hostSelection"
                    checked={hostIndex === idx}
                    onChange={() => setHostIndex(idx)}
                  />
                  <span>Host</span>
                </label>

                {playerList.length > 2 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemovePlayer(idx)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          {playerList.length < 4 && (
            <button
              type="button"
              className="btn-secondary add-player-btn"
              onClick={handleAddPlayer}
            >
              + Add Player
            </button>
          )}
        </div>

        <div className="form-section">
          <h3>Secret Word Selection</h3>
          <p className="field-tip">
            Let the Host <strong>({playerList[hostIndex]?.name})</strong> write a secret 5-letter word without letting others see!
          </p>
          <div className="secret-input-wrapper">
            <input
              type="password" // Obscures the secret word
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value.replace(/[^A-Za-z]/g, ''))}
              placeholder="SECRET WORD"
              maxLength={5}
              className={`secret-word-input ${customWordError ? 'error-border' : ''}`}
              required
            />
            {customWordError && <span className="error-text">{customWordError}</span>}
          </div>
        </div>

        <div className="form-section inline-section">
          <label className="rounds-label">
            <span>Rounds to Play:</span>
            <select value={rounds} onChange={(e) => setRounds(Number(e.target.value))}>
              <option value={2}>2 Rounds</option>
              <option value={3}>3 Rounds</option>
              <option value={4}>4 Rounds</option>
            </select>
          </label>
        </div>

        <div className="setup-actions">
          <button type="button" className="btn-secondary" onClick={onBack}>
            Back to Menu
          </button>
          <button type="submit" className="btn-primary">
            Start Challenge
          </button>
        </div>
      </form>
    </div>
  );
};

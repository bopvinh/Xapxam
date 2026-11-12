import React from 'react';
import { GameMode, Player } from '../game/types';

interface ScoreboardProps {
  players: Player[];
  mode: GameMode;
  secretWord: string;
  roundNumber: number;
  maxRounds: number;
  onNextRound?: () => void;
  onNewGame: () => void;
  isGameOver: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  players,
  mode,
  secretWord,
  roundNumber,
  maxRounds,
  onNextRound,
  onNewGame,
  isGameOver
}) => {
  // Sort players for leaderboard
  const sortedPlayers = [...players].sort((a, b) => {
    if (mode === 'FAST') {
      return b.score - a.score; // Highest points wins
    }
    return a.score - b.score; // Lowest points wins in Party/Classic
  });

  return (
    <div className="scoreboard-container card-panel animate-scale">
      <div className="scoreboard-header">
        <h2>{isGameOver ? 'Game Over: Final Standings' : `Round ${roundNumber} of ${maxRounds} Completed`}</h2>
        <p className="secret-reveal">
          The Secret Word was: <span className="highlight-word">{secretWord}</span>
        </p>
      </div>

      <div className="leaderboard-table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>{mode === 'FAST' ? 'Total Points' : 'Cumulative Score'}</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, idx) => {
              const rank = idx + 1;
              const isWinner = isGameOver && idx === 0;

              return (
                <tr key={player.id} className={isWinner ? 'winner-row' : ''}>
                  <td>
                    <span className={`rank-badge rank-${rank}`}>
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                    </span>
                  </td>
                  <td>
                    <strong>{player.name}</strong> {player.isHost && <span className="host-tag">(Host)</span>}
                  </td>
                  <td>
                    {player.solved ? (
                      <span className="badge-success">Solved</span>
                    ) : (
                      <span className="badge-danger">Unsolved</span>
                    )}
                  </td>
                  <td>{player.solved ? `${player.attemptsUsed} / 6` : 'Failed (7 pts)'}</td>
                  <td>
                    <span className="score-val">{player.score}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="scoreboard-actions">
        {!isGameOver && onNextRound && (
          <button className="btn-primary" onClick={onNextRound}>
            Start Round {roundNumber + 1}
          </button>
        )}
        <button className="btn-secondary" onClick={onNewGame}>
          Main Menu
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Player } from '../game/types';
import { AIPersonality } from '../ai/index';
import { soundManager } from '../game/audio';

interface DuelResultPageProps {
  players: Player[];
  secretWord: string;
  selectedBoss: AIPersonality | null;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  onMeaning?: () => void;
  currencyEarned?: number;
}

export const DuelResultPage: React.FC<DuelResultPageProps> = ({
  players,
  secretWord,
  selectedBoss,
  onPlayAgain,
  onMainMenu,
  onMeaning,
  currencyEarned = 100
}) => {
  const human = players.find(p => p.id === 'human') || players[0];
  const opponent = players.find(p => p.id !== human?.id) || players[1];

  const humanWon = human?.solved;
  const oppWon = opponent?.solved;

  let title = 'ROUND COMPLETE';
  let titleColor = '#a855f7';
  let subtitle = 'Both players fought hard!';

  if (selectedBoss) {
    if (humanWon && !oppWon) {
      title = '🏆 BOSS DEFEATED! 🏆';
      titleColor = '#22d3a0';
      subtitle = `You conquered ${selectedBoss.name}!`;
    } else if (!humanWon && oppWon) {
      title = '💀 DEFEAT 💀';
      titleColor = '#f43f5e';
      subtitle = `${selectedBoss.name} outsmarted you!`;
    } else if (humanWon && oppWon) {
      if ((human?.guesses.length || 6) < (opponent?.guesses.length || 6)) {
        title = '🏆 VICTORY! 🏆';
        titleColor = '#22d3a0';
        subtitle = `You solved it faster than ${selectedBoss.name}!`;
      } else if ((human?.guesses.length || 6) > (opponent?.guesses.length || 6)) {
        title = '💀 DEFEAT 💀';
        titleColor = '#f43f5e';
        subtitle = `${selectedBoss.name} solved it in fewer steps!`;
      } else {
        title = '⚔️ DRAW! ⚔️';
        titleColor = '#f59e0b';
        subtitle = 'An equal match of lexicon intellect!';
      }
    } else {
      title = '❌ DOUBLE FAIL ❌';
      titleColor = '#9ca3af';
      subtitle = 'Both fell victim to the dictionary!';
    }
  }

  // Helper to render mini grid of letter states
  const renderMiniGrid = (player: Player) => {
    if (!player) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '10px' }}>
        {player.guesses.map((guess, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
            {guess.evaluation.map((letter, lIdx) => {
              const color = letter.state === 'correct' ? '#22d3a0' : letter.state === 'present' ? '#f59e0b' : '#374151';
              return (
                <div
                  key={lIdx}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    background: color,
                    boxShadow: letter.state !== 'absent' ? `0 0 6px ${color}88` : 'none'
                  }}
                />
              );
            })}
          </div>
        ))}
        {Array.from({ length: 6 - player.guesses.length }).map((_, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
            {Array.from({ length: 5 }).map((__, lIdx) => (
              <div
                key={lIdx}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '3px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="setup-container card-panel animate-scale"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        color: '#fff',
        padding: '24px',
        background: 'rgba(13, 17, 23, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', color: titleColor, margin: '0 0 4px 0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
          {title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{subtitle}</p>
        <div style={{ display: 'inline-block', margin: '14px 0', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          Secret Word: <strong style={{ color: '#22d3a0', fontSize: '16px', letterSpacing: '1px' }}>{secretWord.toUpperCase()}</strong>
        </div>
      </div>

      {/* Duel Grid Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Human Board */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-primary)' }}>👤 You</h3>
          <span style={{ fontSize: '12px', color: humanWon ? '#22d3a0' : '#f43f5e', fontWeight: 700 }}>
            {humanWon ? `Solved in ${human.guesses.length} attempts` : 'Failed'}
          </span>
          {renderMiniGrid(human)}
        </div>

        {/* Opponent Board */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-primary)' }}>
            {selectedBoss ? `${selectedBoss.icon} ${selectedBoss.name}` : `🤖 ${opponent?.name || 'OPPONENT'}`}
          </h3>
          <span style={{ fontSize: '12px', color: oppWon ? '#22d3a0' : '#f43f5e', fontWeight: 700 }}>
            {oppWon ? `Solved in ${opponent?.guesses.length || 0} attempts` : 'Failed'}
          </span>
          {opponent && renderMiniGrid(opponent)}
        </div>
      </div>

      {/* Rewards Card */}
      {humanWon && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', color: '#fbbf24' }}>💰 Lexicons Rewarded</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>Bonus for defeating the AI Boss</p>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24' }}>+{currencyEarned} 🪙</span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn-secondary"
            onClick={() => {
              soundManager.playPop();
              onMainMenu();
            }}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}
          >
            Main Menu
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              soundManager.playFlip();
              onPlayAgain();
            }}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #f43f5e, #ec4899)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)'
            }}
          >
            Play Again ⚔️
          </button>
        </div>
        {onMeaning && (
          <button
            className="btn-secondary"
            onClick={() => {
              soundManager.playPop();
              onMeaning();
            }}
            style={{ padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}
          >
            📖 Meaning
          </button>
        )}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { GameMode, LetterEvaluation } from '../game/types';
import { evaluateGuess, getRandomSecretWord, isValidWord } from '../game/engine';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

interface ModeConfig {
  mode: GameMode;
  icon: string;
  label: string;
  description: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'CLASSIC',
    icon: '📚',
    label: 'Classic Play',
    description: 'One secret five-letter word. Six attempts.',
  },
  {
    mode: 'DAILY',
    icon: '📅',
    label: 'Daily Challenge',
    description: 'Same word for everyone today. Keep your streak!',
  },
  {
    mode: 'PARTY',
    icon: '🎉',
    label: 'Multiplayer Party',
    description: '2–4 players. Host rotating word challenge.',
  },
  {
    mode: 'FAST',
    icon: '⚡',
    label: 'Fast Mode',
    description: 'Solve first to end the round and score a point.',
  },
  {
    mode: 'TIMED',
    icon: '⏱️',
    label: 'Timed Mode',
    description: 'Beat the 60 or 90-second countdown clock!',
  },
  {
    mode: 'TEAM',
    icon: '👥',
    label: 'Team Challenge',
    description: 'Combine forces. Work together to find the word.',
  },
];

/** Chevron-right indicator on each mode card */
const ChevronRight: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenHelp,
  onOpenStats,
}) => {
  const [miniGuess, setMiniGuess] = useState('');
  const [miniEvaluation, setMiniEvaluation] = useState<LetterEvaluation[] | null>(null);
  const [miniResult, setMiniResult] = useState<'idle' | 'won' | 'lost' | 'invalid'>('idle');

  // Pick a secret word once per page load for the mini guess
  const miniSecret = getRandomSecretWord();

  const handleMiniSubmit = () => {
    const guess = miniGuess.trim().toUpperCase();
    if (guess.length !== 5) {
      setMiniResult('invalid');
      setTimeout(() => setMiniResult('idle'), 1500);
      return;
    }
    if (!isValidWord(guess)) {
      setMiniResult('invalid');
      setTimeout(() => setMiniResult('idle'), 1500);
      return;
    }
    const evaluation = evaluateGuess(guess, miniSecret);
    setMiniEvaluation(evaluation);
    if (guess === miniSecret) {
      setMiniResult('won');
    } else {
      setMiniResult('lost');
      setTimeout(() => setMiniResult('idle'), 2000);
    }
  };

  const handleMiniKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleMiniSubmit();
    else if (/^[a-z]$/i.test(e.key) && miniGuess.length < 5) {
      setMiniGuess((prev) => prev + e.key.toUpperCase());
    } else if (e.key === 'Backspace') {
      setMiniGuess((prev) => prev.slice(0, -1));
    }
  };

  const resetMini = () => {
    setMiniGuess('');
    setMiniEvaluation(null);
    setMiniResult('idle');
  };

  return (
    <div className="main-menu-container animate-scale">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section" aria-label="Game title">
        <p className="hero-eyebrow">Word Game</p>
        <h1 className="hero-logo">
          WORD<span className="plus-accent">++</span>
        </h1>
        <p className="hero-subtitle">The Ultimate Word Challenge</p>
      </section>

      {/* ── Primary CTA ──────────────────────────────────── */}
      <div className="hero-cta">
        <button
          className="btn-play-now"
          onClick={() => onSelectMode('CLASSIC')}
          aria-label="Play Classic mode"
        >
          <span className="btn-play-now-icon" aria-hidden="true">▶</span>
          Play Now
        </button>
        <span className="hero-cta-label">Classic · 5 letters · 6 guesses</span>
      </div>

      {/* ── Live Mini Guess (Conversion Hook) ────────────── */}
      <div className="mini-guess-section">
        <p className="mini-guess-label">Try a guess — no commitment</p>
        <div className="mini-guess-row" role="grid" aria-label="Mini word guess">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`mini-cell ${miniEvaluation?.[i]?.state || 'empty'}`}
              role="gridcell"
            >
              {miniGuess[i] || ''}
            </div>
          ))}
        </div>
        <input
          type="text"
          maxLength={5}
          value={miniGuess}
          onChange={(e) =>
            setMiniGuess(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())
          }
          onKeyDown={handleMiniKeyDown}
          placeholder="_____"
          aria-label="Enter a 5-letter word"
          disabled={miniResult !== 'idle'}
          className="mini-input"
        />
        <div className="mini-guess-actions">
          <button className="btn-secondary" onClick={handleMiniSubmit} disabled={miniGuess.length !== 5 || miniResult !== 'idle'}>
            Guess
          </button>
          {miniResult === 'won' && <span className="mini-status won">🎉 Solved it!</span>}
          {miniResult === 'lost' && <span className="mini-status lost">Not quite — the word was {miniSecret}</span>}
          {miniResult === 'invalid' && <span className="mini-status invalid">Enter a valid 5-letter word</span>}
          <button className="btn-secondary mini-reset" onClick={resetMini} aria-label="Reset mini guess">
            ↻
          </button>
        </div>
        <p className="mini-guest-hint">
          {miniResult === 'won' ? 'Ready for the full game?' : ''}
        </p>
      </div>

      {/* ── Modes grid ───────────────────────────────────── */}
      <div>
        <p className="menu-section-label" aria-hidden="true">All Modes</p>
        <div
          className="menu-options-grid"
          role="list"
          aria-label="Game modes"
          style={{ marginTop: '12px' }}
        >
          {MODES.map(({ mode, icon, label, description }) => (
            <button
              key={mode}
              className="menu-card"
              onClick={() => onSelectMode(mode)}
              role="listitem"
              aria-label={`${label} — ${description}`}
            >
              <div className="card-icon-wrap" aria-hidden="true">
                {icon}
              </div>
              <div className="card-body">
                <h3>{label}</h3>
                <p>{description}</p>
              </div>
              <span className="card-arrow" aria-hidden="true">
                <ChevronRight />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="menu-footer">
        <button className="btn-secondary" onClick={onOpenHelp}>
          How to Play
        </button>
        <button className="btn-secondary" onClick={onOpenStats}>
          Statistics
        </button>
      </div>
    </div>
  );
};

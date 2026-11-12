import React, { useState, useEffect, useCallback } from 'react';
import './styles/global.css';
import { GameMode, Player, PlayerStats, LetterState } from './game/types';
import {
  evaluateGuess,
  isValidWord,
  getRandomSecretWord,
  getDailySecretWord,
  calculateKeyboardLetterStates,
  validateHardModeGuess
} from './game/engine';
import { soundManager } from './game/audio';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { HelpModal } from './components/HelpModal';
import { StatsModal } from './components/StatsModal';
import { DefinitionModal } from './components/DefinitionModal';
import { MultiplayerSetup } from './components/MultiplayerSetup';
import { Scoreboard } from './components/Scoreboard';
import { Timer } from './components/Timer';

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
};

export const App: React.FC = () => {
  // Navigation / Modals State
  const [activeMode, setActiveMode] = useState<GameMode | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isDefinitionOpen, setIsDefinitionOpen] = useState<boolean>(false);
  const [showMultiplayerSetup, setShowMultiplayerSetup] = useState<boolean>(false);
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);

  // Settings state
  const [colorBlindMode, setColorBlindMode] = useState<boolean>(false);
  const [hardMode, setHardMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());
  const [timerDuration] = useState<number>(60);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Player Stats state
  const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);

  // Core Game State
  const [secretWord, setSecretWord] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [invalidRowIndex, setInvalidRowIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<'PLAYING' | 'ROUND_OVER' | 'GAME_OVER'>('PLAYING');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [maxRounds, setMaxRounds] = useState<number>(1);

  // Timed Mode Timer State
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Status/Toast messages
  const [toastMessage, setToastMessage] = useState<string>('');

  // Load stats & settings
  useEffect(() => {
    const savedStats = localStorage.getItem('wordplusplus_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error(e);
      }
    }
    const cbMode = localStorage.getItem('wordplusplus_colorblind');
    if (cbMode === 'true') {
      setColorBlindMode(true);
    }
    const hmMode = localStorage.getItem('wordplusplus_hardmode');
    if (hmMode === 'true') {
      setHardMode(true);
    }
  }, []);

  // Show Toast
  const showToast = (msg: string, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, duration);
  };

  // Switch Color blind mode
  const handleToggleColorBlind = () => {
    const next = !colorBlindMode;
    setColorBlindMode(next);
    localStorage.setItem('wordplusplus_colorblind', String(next));
  };

  // Switch Hard Mode
  const handleToggleHardMode = () => {
    const next = !hardMode;
    setHardMode(next);
    localStorage.setItem('wordplusplus_hardmode', String(next));
    showToast(next ? '⚡ Hard Mode enabled (Strict clues)' : 'Standard Mode enabled');
  };

  // Switch Sound
  const handleToggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
    showToast(next ? '🔊 Sound enabled' : '🔇 Sound muted');
  };

  // Trigger Victory FX & Confetti
  const triggerVictory = () => {
    soundManager.playWin();
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  // Reset Stats
  const handleResetStats = () => {
    setStats(DEFAULT_STATS);
    localStorage.setItem('wordplusplus_stats', JSON.stringify(DEFAULT_STATS));
    showToast('Statistics reset successfully');
  };

  // Select game mode
  const handleSelectMode = (mode: GameMode) => {
    setActiveMode(mode);
    if (mode === 'CLASSIC' || mode === 'DAILY') {
      setShowMultiplayerSetup(false);
      startSinglePlayerGame(mode);
    } else {
      // For MULTIPLAYER setup
      setShowMultiplayerSetup(true);
    }
  };

  // Start single player
  const startSinglePlayerGame = (mode: GameMode) => {
    const word = mode === 'DAILY' ? getDailySecretWord() : getRandomSecretWord();
    setSecretWord(word);
    
    const p: Player = {
      id: 'human',
      name: 'You',
      isHost: false,
      guesses: [],
      score: 0,
      solved: false,
      attemptsUsed: 0
    };
    
    setPlayers([p]);
    setActivePlayerIndex(0);
    setCurrentGuess('');
    setStatus('PLAYING');
    setShowScoreboard(false);
    setIsTimerActive(false);
  };

  // Handle Setup Complete
  const handleStartMultiplayer = (setupData: {
    players: { name: string; isHost: boolean }[];
    secretWord: string;
    maxRounds: number;
  }) => {
    setShowMultiplayerSetup(false);
    setSecretWord(setupData.secretWord.toUpperCase());
    setMaxRounds(setupData.maxRounds);
    setRoundNumber(1);

    const prepared: Player[] = setupData.players.map((p, idx) => ({
      id: `player_${idx}`,
      name: p.name,
      isHost: p.isHost,
      guesses: [],
      score: 0,
      solved: false,
      attemptsUsed: 0
    }));

    setPlayers(prepared);

    // Find the first guessing player (the one who is NOT the host)
    const firstGuessingIdx = prepared.findIndex((p) => !p.isHost);
    setActivePlayerIndex(firstGuessingIdx >= 0 ? firstGuessingIdx : 0);

    setCurrentGuess('');
    setStatus('PLAYING');
    setShowScoreboard(false);

    if (activeMode === 'TIMED') {
      setTimeLeft(timerDuration);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  };

  // Game update stats
  const updateStats = (isWon: boolean, numGuesses: number) => {
    const nextStats = { ...stats };
    nextStats.gamesPlayed += 1;
    if (isWon) {
      nextStats.gamesWon += 1;
      nextStats.currentStreak += 1;
      if (nextStats.currentStreak > nextStats.maxStreak) {
        nextStats.maxStreak = nextStats.currentStreak;
      }
      nextStats.guessDistribution[numGuesses] = (nextStats.guessDistribution[numGuesses] || 0) + 1;
    } else {
      nextStats.currentStreak = 0;
    }
    setStats(nextStats);
    localStorage.setItem('wordplusplus_stats', JSON.stringify(nextStats));
  };

  // Submit current guess
  const handleSubmitGuess = () => {
    if (status !== 'PLAYING') return;

    const formattedGuess = currentGuess.toUpperCase();
    if (formattedGuess.length !== 5) {
      showToast('Word must be 5 letters');
      triggerShake();
      return;
    }

    if (!isValidWord(formattedGuess)) {
      showToast('Not in word list');
      triggerShake();
      return;
    }

    // Hard Mode Check
    if (hardMode && players[activePlayerIndex]?.guesses.length > 0) {
      const violation = validateHardModeGuess(formattedGuess, players[activePlayerIndex].guesses);
      if (violation) {
        showToast(`⚡ Hard Mode: ${violation}`);
        triggerShake();
        return;
      }
    }

    const evaluation = evaluateGuess(formattedGuess, secretWord);
    soundManager.playFlip();
    const isWon = formattedGuess === secretWord;
    if (isWon) {
      triggerVictory();
    }
    const newGuesses = [...players[activePlayerIndex].guesses, { word: formattedGuess, evaluation }];
    const isOutOfAttempts = newGuesses.length >= 6;

    const updatedPlayers = players.map((p, idx) => {
      if (idx === activePlayerIndex) {
        const solved = isWon;
        const attempts = newGuesses.length;
        let scoreAdd = 0;
        
        if (activeMode === 'PARTY') {
          scoreAdd = solved ? attempts : 7;
        } else if (activeMode === 'FAST') {
          scoreAdd = solved ? 1 : 0;
        } else if (activeMode === 'TEAM') {
          scoreAdd = solved ? attempts : 7;
        }

        return {
          ...p,
          guesses: newGuesses,
          solved,
          attemptsUsed: attempts,
          score: p.score + scoreAdd
        };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setCurrentGuess('');

    // Single Player Modes
    if (activeMode === 'CLASSIC' || activeMode === 'DAILY') {
      if (isWon) {
        setStatus('ROUND_OVER');
        updateStats(true, newGuesses.length);
        showToast('🎉 Brilliant! You solved the word!');
      } else if (isOutOfAttempts) {
        setStatus('ROUND_OVER');
        updateStats(false, 6);
        showToast(`😔 Game over! The word was ${secretWord}`);
      }
      return;
    }

    // Timed Mode Turn Complete Reset
    if (activeMode === 'TIMED') {
      setTimeLeft(timerDuration);
    }

    // Fast Mode - solved ends the round immediately
    if (activeMode === 'FAST' && isWon) {
      // Award winner and zero points to others
      setStatus('ROUND_OVER');
      setIsTimerActive(false);
      setShowScoreboard(true);
      showToast(`🏆 ${players[activePlayerIndex].name} won the round!`);
      return;
    }

    // Multiplayer Party or Team pass-and-play turn rotation
    const isTurnOver = isWon || isOutOfAttempts;

    if (isTurnOver) {
      // Find next guessing player
      const nextIdx = findNextActivePlayer(activePlayerIndex, updatedPlayers);
      
      if (nextIdx === -1) {
        // Everyone has finished guessing
        setStatus('ROUND_OVER');
        setIsTimerActive(false);
        setShowScoreboard(true);
      } else {
        // Handover message
        setActivePlayerIndex(nextIdx);
        showToast(`Pass the device to ${updatedPlayers[nextIdx].name}!`);
      }
    }
  };

  const findNextActivePlayer = (currentIdx: number, list: Player[]): number => {
    // Left-to-right round-robin, skipping host and players who have already solved/failed
    for (let i = 1; i <= list.length; i++) {
      const targetIdx = (currentIdx + i) % list.length;
      const target = list[targetIdx];
      if (!target.isHost && !target.solved && target.guesses.length < 6) {
        return targetIdx;
      }
    }
    return -1;
  };

  const triggerShake = () => {
    setInvalidRowIndex(players[activePlayerIndex]?.guesses.length || 0);
    setTimeout(() => {
      setInvalidRowIndex(null);
    }, 500);
  };

  // Keyboard input handlers
  const handleKeyPress = useCallback((key: string) => {
    if (status !== 'PLAYING') return;

    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACKSPACE' || key === 'DEL') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/i.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => (prev + key).toUpperCase());
      }
    }
  }, [currentGuess, status, secretWord, players, activePlayerIndex, activeMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      handleKeyPress(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // Timed Mode Timeout handler
  const handleTimeout = () => {
    showToast("⏰ Time's up! Attempt consumed.");
    // Simulate empty guess
    const newGuesses = [...players[activePlayerIndex].guesses, {
      word: '-----',
      evaluation: Array.from({ length: 5 }, () => ({ letter: ' ', state: 'absent' as LetterState }))
    }];

    const updated = players.map((p, idx) => {
      if (idx === activePlayerIndex) {
        return {
          ...p,
          guesses: newGuesses,
          attemptsUsed: newGuesses.length
        };
      }
      return p;
    });

    setPlayers(updated);
    setCurrentGuess('');

    if (newGuesses.length >= 6) {
      const nextIdx = findNextActivePlayer(activePlayerIndex, updated);
      if (nextIdx === -1) {
        setStatus('ROUND_OVER');
        setIsTimerActive(false);
        setShowScoreboard(true);
      } else {
        setActivePlayerIndex(nextIdx);
        showToast(`Pass the device to ${updated[nextIdx].name}!`);
      }
    } else {
      setTimeLeft(timerDuration);
    }
  };

  // Next Round in multiplayer
  const handleNextRound = () => {
    if (roundNumber >= maxRounds) {
      setStatus('GAME_OVER');
      return;
    }

    // Rotate Host
    const nextRoundNum = roundNumber + 1;
    setRoundNumber(nextRoundNum);

    const nextHostIndex = (players.findIndex((p) => p.isHost) + 1) % players.length;
    
    // Prompt the next host to select a secret word
    const nextHostName = players[nextHostIndex].name;
    showToast(`Round ${nextRoundNum}: Host rotation to ${nextHostName}`);

    // Reset players guesses & solved states
    const resetPlayers = players.map((p, idx) => ({
      ...p,
      guesses: [],
      solved: false,
      attemptsUsed: 0,
      isHost: idx === nextHostIndex
    }));

    setPlayers(resetPlayers);
    setShowMultiplayerSetup(true);
    setShowScoreboard(false);
  };

  // Quit to Menu
  const handleHomeClick = () => {
    setActiveMode(null);
    setShowMultiplayerSetup(false);
    setShowScoreboard(false);
    setIsTimerActive(false);
  };

  const activePlayer = players[activePlayerIndex] || null;
  const keyboardStates = activePlayer ? calculateKeyboardLetterStates(activePlayer.guesses) : {};

  // Emoji share builder
  const handleShareEmoji = () => {
    if (!activePlayer) return;
    const tileEmojis: Record<string, string> = {
      correct: '🟩',
      present: '🟨',
      absent: '⬛'
    };

    const headerText = `Word++ (${activeMode}) ${activePlayer.solved ? activePlayer.attemptsUsed : 'X'}/6\n\n`;
    const gridText = activePlayer.guesses
      .map((g) => g.evaluation.map((e) => tileEmojis[e.state]).join(''))
      .join('\n');

    const fullShareText = headerText + gridText + '\n\nPlay at: Word++';
    
    navigator.clipboard.writeText(fullShareText).then(() => {
      showToast('📋 Copied feedback grid to clipboard!');
    }).catch(() => {
      showToast('Failed to copy to clipboard');
    });
  };

  return (
    <div className={`app-container ${colorBlindMode ? 'cb-theme' : ''}`}>
      {activeMode && (
        <Header
          mode={activeMode}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onHomeClick={handleHomeClick}
          colorBlindMode={colorBlindMode}
          onToggleColorBlind={handleToggleColorBlind}
          hardMode={hardMode}
          onToggleHardMode={handleToggleHardMode}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      <main className="app-main-content">
        {showConfetti && (
          <div className="confetti-container" aria-hidden="true">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className={`confetti-piece p-${i % 6}`} style={{ left: `${(i * 3.33) + 1}%`, animationDelay: `${(i % 5) * 0.2}s` }} />
            ))}
          </div>
        )}
        {toastMessage && (
          <div className="toast-notification animate-fade-in">
            {toastMessage}
          </div>
        )}

        {!activeMode && (
          <MainMenu
            onSelectMode={handleSelectMode}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenStats={() => setIsStatsOpen(true)}
          />
        )}

        {activeMode && showMultiplayerSetup && (
          <MultiplayerSetup
            mode={activeMode}
            onBack={handleHomeClick}
            onStart={handleStartMultiplayer}
          />
        )}

        {activeMode && !showMultiplayerSetup && !showScoreboard && activePlayer && (
          <div className="gameplay-area animate-scale">
            {/* Multiplayer Banner */}
            {players.length > 1 && (
              <div className="multiplayer-hud">
                <div className="hud-player-badge active-player">
                  <span>Current Player:</span>
                  <strong>{activePlayer.name}</strong>
                </div>
                <div className="hud-round-badge">
                  Round {roundNumber} of {maxRounds}
                </div>
              </div>
            )}

            {/* Timer for Timed Mode */}
            {activeMode === 'TIMED' && (
              <Timer
                duration={timerDuration}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                onTimeout={handleTimeout}
                isActive={isTimerActive && status === 'PLAYING'}
              />
            )}

            {/* Game Grid */}
            <GameBoard
              guesses={activePlayer.guesses}
              currentGuess={currentGuess}
              invalidRowIndex={invalidRowIndex}
              colorBlindMode={colorBlindMode}
            />

            {/* Feedback actions if solved / failed */}
            {status === 'ROUND_OVER' && (
              <div className="reveal-actions-panel animate-scale">
                <p className="outcome-reveal">
                  {activePlayer.solved ? '🎉 Word Solved!' : `😔 Answer: ${secretWord}`}
                </p>
                <div className="outcome-btns">
                  <button className="btn-primary" onClick={() => startSinglePlayerGame(activeMode)}>
                    Play Again
                  </button>
                  <button className="btn-secondary" onClick={() => setIsDefinitionOpen(true)}>
                    📖 Meaning
                  </button>
                  <button className="btn-secondary" onClick={handleShareEmoji}>
                    Share
                  </button>
                </div>
              </div>
            )}

            {/* On-screen Keyboard */}
            <Keyboard
              onChar={(char) => handleKeyPress(char)}
              onEnter={() => handleKeyPress('ENTER')}
              onDelete={() => handleKeyPress('DEL')}
              letterStates={keyboardStates}
              disabled={status !== 'PLAYING'}
            />
          </div>
        )}

        {activeMode && showScoreboard && (
          <Scoreboard
            players={players}
            mode={activeMode}
            secretWord={secretWord}
            roundNumber={roundNumber}
            maxRounds={maxRounds}
            onNextRound={handleNextRound}
            onNewGame={handleHomeClick}
            isGameOver={roundNumber >= maxRounds}
          />
        )}
      </main>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} onReset={handleResetStats} />
      <DefinitionModal isOpen={isDefinitionOpen} onClose={() => setIsDefinitionOpen(false)} word={secretWord} />
    </div>
  );
};
export default App;

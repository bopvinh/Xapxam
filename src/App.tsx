import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import './styles/global.css';
import './styles/artifact-system.css';
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
import { AIArenaSetup } from './components/AIArenaSetup';
import { DuelResultPage } from './components/DuelResultPage';
import { VictoryScreen } from './components/VictoryScreen';
import { GameBoard } from './components/GameBoard';
import { BattleBoard } from './components/BattleBoard';
import { Keyboard } from './components/Keyboard';
import { HelpModal } from './components/HelpModal';
import { StatsModal } from './components/StatsModal';
import { DefinitionModal } from './components/DefinitionModal';
import { MultiplayerSetup } from './components/MultiplayerSetup';
import { Scoreboard } from './components/Scoreboard';
import { Timer } from './components/Timer';
import { DailyChestModal } from './components/DailyChestModal';
import { WordMentorModal } from './components/WordMentorModal';
import { SpeedBlitzModal } from './components/SpeedBlitzModal';
import { ShareModal } from './components/ShareModal';
import { MasteryStatsModal } from './components/MasteryStatsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { VictoryReveal } from './components/VictoryReveal';
import { VectorBackground } from './components/VectorBackground';
import { RowReticle } from './components/RowReticle';

// import { FloatingHUD } from './components/FloatingHUD';
import { ArtifactSystem } from './components/ArtifactSystem';
import { 
  PlayerInventory, 
  ARTIFACT_DATABASE, 
  RARITY_CONFIG,
  CompositeInventoryRecordV2,
  loadCompositeInventory,
  saveCompositeInventory,
  ActiveGameSessionRecord
} from './game/artifacts';

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
};

export const App: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Navigation / Modals State
  const [activeMode, setActiveMode] = useState<GameMode | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isDefinitionOpen, setIsDefinitionOpen] = useState<boolean>(false);
  const [showMultiplayerSetup, setShowMultiplayerSetup] = useState<boolean>(false);
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>("");
  const [showDailyChest, setShowDailyChest] = useState<boolean>(false);
  const [showMentor, setShowMentor] = useState<boolean>(false);
  const [showBlitz, setShowBlitz] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [showMastery, setShowMastery] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showArtifacts, setShowArtifacts] = useState<boolean>(false);
  const [isJolting, setIsJolting] = useState<boolean>(false);

  // Settings state
  const [colorBlindMode, setColorBlindMode] = useState<boolean>(false);
  const [hardMode, setHardMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());
  const [timerDuration] = useState<number>(60);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

    // Player Stats state
    const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);

    // Artifact System & Composite Storage State
    const [compositeRecord, setCompositeRecord] = useState<CompositeInventoryRecordV2>(() => loadCompositeInventory());
    const artifactInventory = compositeRecord.inventory;

    const setArtifactInventory = (newInv: PlayerInventory | ((prev: PlayerInventory) => PlayerInventory)) => {
      if (isReadOnly) {
        showToast('⚠️ Read-only mode: Cannot modify inventory.');
        return;
      }
      setCompositeRecord(prev => {
        const nextInv = typeof newInv === 'function' ? newInv(prev.inventory) : newInv;
        const updated: CompositeInventoryRecordV2 = { ...prev, inventory: nextInv };
        saveCompositeInventory(updated);
        return updated;
      });
    };

  // Active Session State
  const [activeSession, _setActiveSession] = useState<ActiveGameSessionRecord | null>(compositeRecord.activeSession);

  // Multi-tab locking
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const tabId = Math.random().toString(36).substring(7);
    const lockKey = 'wpp_leader_key';

    const checkLeader = () => {
      const leader = localStorage.getItem(lockKey);
      if (leader) {
        const [id, time] = leader.split(':');
        if (id !== tabId && Date.now() - parseInt(time) < 5000) {
          setIsReadOnly(true);
          return false;
        }
      }
      return true;
    };

    if ('locks' in navigator) {
      navigator.locks.request('wpp_inventory_lock', { ifAvailable: true }, async (lock) => {
        if (!lock) {
          setIsReadOnly(true);
          return;
        }
        return new Promise(() => {}); // Hold lock for tab lifetime
      });
    } else {
      if (!checkLeader()) return;
      const interval = setInterval(() => {
        if (!checkLeader()) {
          setIsReadOnly(true);
          clearInterval(interval);
        } else {
          localStorage.setItem(lockKey, `${tabId}:${Date.now()}`);
        }
      }, 2000);
      localStorage.setItem(lockKey, `${tabId}:${Date.now()}`);
      return () => clearInterval(interval);
    }
  }, []);

  // Use Active Session in UI
  useEffect(() => {
    if (activeSession) {
      console.log('Restoring session:', activeSession.sessionId);
    }
  }, [activeSession]);

    // Core Game State
  const [secretWord, setSecretWord] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [invalidRowIndex, setInvalidRowIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<'PLAYING' | 'ROUND_OVER' | 'GAME_OVER'>('PLAYING');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [maxRounds, setMaxRounds] = useState<number>(1);
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);

  // Timed Mode Timer State
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Status/Toast messages
  const [toastMessage, setToastMessage] = useState<string>('');

  // Load stats & settings
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room && room.length === 4) {
      setActiveMode('PARTY'); // Default to PARTY mode for URL join
      setShowMultiplayerSetup(true);
    }

    const savedStats = localStorage.getItem('wordplusplus_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error(e);
      }
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

  const handleRematchStart = useCallback(() => {
    const newWord = getRandomSecretWord();
    setSecretWord(newWord);
    setPlayers(prev => prev.map(p => ({
      ...p,
      guesses: [],
      solved: false,
      attemptsUsed: 0
    })));
    setStatus('PLAYING');
    setCurrentGuess('');
    setRoundNumber(1);
    showToast('⚔️ REMATCH STARTED! ⚔️');
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room && room.length === 4) {
      const socket = io('http://localhost:3000');
      socket.emit('join', room);
      socket.on('rematch_started', handleRematchStart);
      return () => { socket.disconnect(); };
    }
  }, [handleRematchStart]);

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
    setIsDefinitionOpen(false);
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
    roomCode?: string;
  }) => {
    setIsDefinitionOpen(false);
    setRoomCode(setupData.roomCode || "");
    setShowMultiplayerSetup(false);
    setMaxRounds(setupData.maxRounds);
    setRoomCode(setupData.roomCode || "");
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
    
    // Sequential Staggered Audio-Visual Tile Reveal Cascade
    evaluation.forEach((item, idx) => {
      setTimeout(() => {
        if (item.state === 'correct') {
          soundManager.playCorrect();
        } else if (item.state === 'present') {
          soundManager.playPresent();
        } else {
          soundManager.playAbsent();
        }
      }, idx * 120);
    });

    setIsJolting(true);
    setTimeout(() => setIsJolting(false), 600);
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
        
            // Artifact System: Award Lexicons and chance for artifact drop
            const baseReward = 100;
            const streakBonus = Math.min(stats.currentStreak * 10, 200);
            const attemptBonus = (7 - newGuesses.length) * 15;
            const totalReward = baseReward + streakBonus + attemptBonus;
        
            const newInventory = { ...artifactInventory };
            newInventory.currency += totalReward;
            newInventory.totalEarned += totalReward;
        
            // Chance for artifact drop (10% base, higher with streak)
            const dropChance = 0.1 + Math.min(stats.currentStreak * 0.02, 0.15);
            if (Math.random() < dropChance) {
              // Pick a random artifact weighted by rarity
              const artifacts = ARTIFACT_DATABASE;
              const totalWeight = artifacts.reduce((sum, a) => sum + RARITY_CONFIG[a.rarity].dropWeight, 0);
              let roll = Math.random() * totalWeight;
              let droppedArtifact = artifacts[0];
              for (const art of artifacts) {
                roll -= RARITY_CONFIG[art.rarity].dropWeight;
                if (roll <= 0) { droppedArtifact = art; break; }
              }
          
              if (newInventory.artifacts[droppedArtifact.id]) {
                newInventory.artifacts[droppedArtifact.id].level = Math.min(
                  newInventory.artifacts[droppedArtifact.id].level + 1,
                  droppedArtifact.maxLevel
                );
              } else {
                newInventory.artifacts[droppedArtifact.id] = {
                  artifactId: droppedArtifact.id,
                  level: 1,
                  obtainedAt: Date.now()
                };
              }
          
              showToast(`🎉 Brilliant! You solved the word! +${totalReward} Lexicons • Artifact found: ${droppedArtifact.name}!`);
            } else {
              showToast(`🎉 Brilliant! You solved the word! +${totalReward} Lexicons`);
            }
        
            setArtifactInventory(newInventory);
          } else if (isOutOfAttempts) {
            setStatus('ROUND_OVER');
            updateStats(false, 6);
            showToast(`😔 Game over! The word was ${secretWord}`);
            triggerShake(5);
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

  const triggerShake = (rowIndex?: number) => {
    const target = typeof rowIndex === 'number'
      ? rowIndex
      : Math.min(players[activePlayerIndex]?.guesses.length || 0, 5);
    setInvalidRowIndex(target);
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
        const upperKey = key.toUpperCase();
        setCurrentGuess((prev) => prev + upperKey);
        setLastPressedKey(upperKey);
        setTimeout(() => setLastPressedKey(null), 10);
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

  // Emoji share builder (re-exposed for Result screen)

  const guessesLength = activePlayer ? activePlayer.guesses.length : 0;
  const tensionScale = activeMode ? 1 + Math.max(0, guessesLength - 3) * 0.015 : 1;

  return (
    <div 
      className={`app-container ${colorBlindMode ? 'cb-theme' : ''} ${showConfetti ? 'screen-flash-green' : ''}`}
      style={{
        '--mx': mousePos.x,
        '--my': mousePos.y,
        '--tx': `${mousePos.x * 20}px`,
        '--ty': `${mousePos.y * 20}px`,
        '--tension-scale': tensionScale,
      } as React.CSSProperties}
    >
      <VectorBackground status={showConfetti ? 'WIN' : status} />
      {activeMode && (
        <Header
                  mode={activeMode}
                  onOpenHelp={() => setIsHelpOpen(true)}
                  onOpenStats={() => setIsStatsOpen(true)}
                  onOpenArtifacts={() => setShowArtifacts(true)}
                  onHomeClick={handleHomeClick}
                  colorBlindMode={colorBlindMode}
                  onToggleColorBlind={handleToggleColorBlind}
                  hardMode={hardMode}
                  onToggleHardMode={handleToggleHardMode}
                  soundEnabled={soundEnabled}
                  onToggleSound={handleToggleSound}
                  artifactCurrency={artifactInventory.currency}
                  roomCode={roomCode}
                  activePlayerName={players.length > 1 && activePlayer ? activePlayer.name : undefined}
                  roundInfo={players.length > 1 ? `Round ${roundNumber} of ${maxRounds}` : undefined}
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
        {isReadOnly && (
          <div className="toast-notification animate-fade-in" style={{ backgroundColor: 'var(--red)' }}>
            ⚠️ Read-Only Mode: Active in another tab
          </div>
        )}
        {toastMessage && (
          <div className="toast-notification animate-fade-in">
            {toastMessage}
          </div>
        )}

        {!activeMode && (
          <AIArenaSetup
            onStart={(_personality, useHardMode) => {
              setActiveMode('CLASSIC');
              setHardMode(useHardMode);
              startSinglePlayerGame('CLASSIC');
            }}
            onBack={handleHomeClick}
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
          <div className="gameplay-area animate-scale" style={{ height: "calc(100vh - 75px)", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", overflow: "hidden", padding: "6px 0", boxSizing: "border-box" }}>
            {/* Kinetic Row Reticle (Tactical Focus HUD) */}
            <RowReticle activeRow={activePlayer.guesses.length} />

            {/* Kinetic Viewport Impact Layer (jolt effect) */}
            <div className={`viewport-impact-layer${isJolting ? ' viewport-impact-jolt' : ''}`} aria-hidden="true" />



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

            {/* Activity Reticle (kinetic tracking HUD) */}
            {activePlayer && status === 'PLAYING' && (
              <RowReticle activeRow={activePlayer.guesses.length} />
            )}

            {/* Game Grid / PvP Battle Board */}
            {activeMode === 'PARTY' ? (
              <BattleBoard
                roomID={roomCode}
                guesses={activePlayer.guesses}
                currentGuess={currentGuess}
                playerName={activePlayer.name}
                opponentName={players.find(p => p.id !== activePlayer.id)?.name || 'OPPONENT'}
                invalidRowIndex={invalidRowIndex}
                colorBlindMode={colorBlindMode}
              />
            ) : (
              <GameBoard
                guesses={activePlayer.guesses}
                currentGuess={currentGuess}
                invalidRowIndex={invalidRowIndex}
                colorBlindMode={colorBlindMode}
              />
            )}

            {/* Loss reveal action panel */}
            {status === 'ROUND_OVER' && (
              <DuelResultPage
                players={players}
                secretWord={secretWord}
                selectedBoss={null}
                onPlayAgain={() => startSinglePlayerGame(activeMode || 'CLASSIC')}
                onMainMenu={handleHomeClick}
                onMeaning={() => setIsDefinitionOpen(true)}
              />
            )}

            {/* On-screen Keyboard */ }
            <Keyboard
              onChar={(char) => handleKeyPress(char)}
              onEnter={() => handleKeyPress('ENTER')}
              onDelete={() => handleKeyPress('DEL')}
              letterStates={keyboardStates}
              disabled={status !== 'PLAYING'}
              isSubmitting={status === 'PLAYING' && isJolting}
              lastPressedKey={lastPressedKey}
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

        {status === 'GAME_OVER' && (
          <VictoryScreen 
            winner={players.sort((a,b) => b.score - a.score)[0]?.name || 'Unknown'} 
            roomID={new URLSearchParams(window.location.search).get('room') || undefined}
            guessesCount={activePlayer?.guesses.length || 0}
            playerHP={100} // Default for final screen
            onPlayAgain={handleHomeClick}
          />
        )}
              {/* Full-Screen AAA Victory Reveal Overlay */}
        {status === 'ROUND_OVER' && activePlayer && activePlayer.solved && (
          <VictoryReveal
            won={true}
            finalGuess={secretWord}
            finalEvals={
              activePlayer.guesses[activePlayer.guesses.length - 1]?.evaluation ?? []
            }
            mode={activeMode || 'CLASSIC'}
            attemptsUsed={activePlayer.attemptsUsed}
            streak={stats.currentStreak}
            winRate={
              stats.gamesPlayed > 0
                ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
                : 100
            }
            onPlayAgain={() => startSinglePlayerGame(activeMode || 'CLASSIC')}
            onMeaning={() => setIsDefinitionOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} onReset={handleResetStats} />
      <DefinitionModal isOpen={isDefinitionOpen} onClose={() => setIsDefinitionOpen(false)} word={secretWord} />
      <DailyChestModal
        isOpen={showDailyChest}
        onClose={() => setShowDailyChest(false)}
        onClaim={(reward) => {
          setShowDailyChest(false);
          if (reward.id === 'streak-shield') {
            const saved = localStorage.getItem('wordplusplus_streak');
            let count = 0;
            if (saved) {
              try { count = JSON.parse(saved).count || 0; } catch (e) {}
            }
            localStorage.setItem('wordplusplus_streak', JSON.stringify({ count, active: true }));
            window.location.reload(); // Refresh to update main menu display instantly!
          }
          showToast(`🎁 Claimed: ${reward.label}`);
        }}
      />
      <WordMentorModal
        isOpen={showMentor}
        onClose={() => setShowMentor(false)}
        word={secretWord || 'CLIMB'}
      />
      <SpeedBlitzModal
        isOpen={showBlitz}
        onClose={() => setShowBlitz(false)}
        onStartBlitz={(seconds) => {
          setShowBlitz(false);
          handleSelectMode('FAST');
          showToast(`⏱️ Speed Rush mode activated: ${seconds} seconds limit!`);
        }}
      />
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        word={secretWord}
        attemptsUsed={players[activePlayerIndex]?.guesses.length}
        solved={players[activePlayerIndex]?.solved}
      />
      <MasteryStatsModal
        isOpen={showMastery}
        onClose={() => setShowMastery(false)}
        stats={stats}
      />
      <LeaderboardModal
              isOpen={showLeaderboard}
              onClose={() => setShowLeaderboard(false)}
            />
            <ArtifactSystem
              isOpen={showArtifacts}
              onClose={() => setShowArtifacts(false)}
              inventory={artifactInventory}
              onInventoryChange={setArtifactInventory}
            />
            {/* <FloatingHUD
        streak={stats.currentStreak} 
        winRate={stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 100} 
      /> */}
    </div>
  );
};
export default App;

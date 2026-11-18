import React, { useState, useEffect, useRef } from 'react';
import { GameMode } from '../game/types';
import { soundManager } from '../game/audio';
// import heroBgV2 from '../assets/hero-bg-v2.svg';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onOpenDailyChest?: () => void;
  onOpenMentor?: () => void;
  onOpenBlitz?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenMastery?: () => void;
}

interface ModeConfig {
  mode: GameMode;
  label: string;
  description: string;
  tag: string;
  tagColor: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'CLASSIC',
    label: 'Classic Play',
    description: 'One secret 5-letter word. Six attempts.',
    tag: 'SOLO',
    tagColor: '#818cf8',
  },
  {
    mode: 'DAILY',
    label: 'Daily Challenge',
    description: 'Same word for everyone. Keep streak!',
    tag: 'DAILY',
    tagColor: '#f59e0b',
  },
  {
    mode: 'PARTY',
    label: 'Multiplayer Party',
    description: '2–4 players. Host rotating word challenge.',
    tag: 'PARTY',
    tagColor: '#ec4899',
  },
  {
    mode: 'FAST',
    label: 'Fast Mode',
    description: 'Solve first to end round and score point.',
    tag: 'SPEED',
    tagColor: '#facc15',
  },
  {
    mode: 'TIMED',
    label: 'Timed Mode',
    description: 'Beat the 60 or 90s countdown clock!',
    tag: 'TIMED',
    tagColor: '#f43f5e',
  },
  {
    mode: 'TEAM',
    label: 'Team Challenge',
    description: 'Combine forces. Work together to solve.',
    tag: 'CO-OP',
    tagColor: '#06b6d4',
  },
];

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenHelp,
  onOpenStats,
}) => {
  const [flippedTile, setFlippedTile] = useState<number | null>(null);
  const [dailyCountdown, setDailyCountdown] = useState<string>('00:00:00');
  const [dayProgress, setDayProgress] = useState<number>(0);
  const [socialFeedIndex, setSocialFeedIndex] = useState<number>(0);


  // Daily UTC countdown & day progress calculation
  useEffect(() => {
    const calcCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const totalDayMs = 86400000;
      const elapsedMs = now.getTime() - startOfDay.getTime();
      const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
      
      const h = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');
      setDailyCountdown(`${h}:${m}:${s}`);
      setDayProgress(Math.min(100, Math.max(0, (elapsedMs / totalDayMs) * 100)));
    };
    calcCountdown();
    const interval = setInterval(calcCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotating live community social proof feed
  useEffect(() => {
    const feedInterval = setInterval(() => {
      setSocialFeedIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(feedInterval);
  }, []);

  // Keyboard shortcut listener: Space = Classic, D = Daily
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        soundManager.playFlip();
        onSelectMode('CLASSIC');
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        soundManager.playFlip();
        onSelectMode('DAILY');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectMode]);

  // Entrance Domino Wave Flip
  useEffect(() => {
    const timer = setTimeout(() => {
      [0, 1, 2, 3, 4].forEach((_idx) => {
        setTimeout(() => {
          // setFlippedTile(idx);
          // setTimeout(() => setFlippedTile(null), 600);
        }, _idx * 120);
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleTileClick = (index: number) => {
      soundManager.playFlip();
      setFlippedTile(index);
      setTimeout(() => setFlippedTile(null), 800);
    };

    // Innovative CTA: Hold-to-charge entry mechanic
    const [chargeState, setChargeState] = useState<'idle' | 'charging' | 'ready'>('idle');
    const [chargeProgress, setChargeProgress] = useState(0);
    const [chargeTargetMode, setChargeTargetMode] = useState<GameMode | null>(null);
    const chargeIntervalRef = useRef<number | null>(null);

    const startCharge = (mode: GameMode) => {
      soundManager.playHover();
      setChargeTargetMode(mode);
      setChargeState('charging');
      setChargeProgress(0);
      chargeIntervalRef.current = window.setInterval(() => {
        setChargeProgress(prev => {
          const next = Math.min(100, prev + 2.5);
          if (next >= 100) {
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
            setChargeState('ready');
            setTimeout(() => {
              if (chargeTargetMode) {
                soundManager.playFlip();
                onSelectMode(chargeTargetMode);
              }
              setChargeState('idle');
              setChargeTargetMode(null);
            }, 200);
          }
          return next;
        });
      }, 30);
    };

    const cancelCharge = () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
      setChargeState('idle');
      setChargeTargetMode(null);
      setChargeProgress(0);
    };

    const handleHover = () => {
      soundManager.playHover();
    };

  const tiles = [
    { letter: 'W', state: 'correct', color: '#22d3a0', rot: -12, y: 6 },
    { letter: 'O', state: 'present', color: '#f59e0b', rot: -6, y: 2 },
    { letter: 'R', state: 'absent', color: '#818cf8', rot: 0, y: 0 },
    { letter: 'D', state: 'correct', color: '#22d3a0', rot: 6, y: 2 },
    { letter: '++', state: 'brand', color: '#06b6d4', rot: 12, y: 6 },
  ];

  const socialMessages = [
    <>
      <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3a0', boxShadow: '0 0 8px #22d3a0' }} />
      <span><strong style={{ color: 'var(--text-primary)' }}>1,428 Solvers</strong> online • <strong>8,920</strong> Puzzles Solved Today</span>
    </>,
    <>
      <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
      <span>🔥 <strong style={{ color: '#f59e0b' }}>Daily Challenge:</strong> New word in {dailyCountdown} • Protect your streak!</span>
    </>,
    <>
      <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 8px #06b6d4' }} />
      <span>⚡ <strong style={{ color: 'var(--text-primary)' }}>Pro Tip:</strong> Press <kbd style={{ padding: '1px 5px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px' }}>SPACE</kbd> to launch Classic or <kbd style={{ padding: '1px 5px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px' }}>D</kbd> for Daily</span>
    </>,
  ];

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    // const [heroTileMousePos, setHeroTileMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        setMousePos({ x, y });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="main-menu-container animate-scale">
          <div className="main-menu-inner" style={{ transform: `perspective(1000px) rotateY(${mousePos.x * 0.1}deg) rotateX(${-mousePos.y * 0.1}deg)`, width:'100%', height:'100%', position:'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="main-menu-inner" style={{ transform: `perspective(1000px) rotateY(${mousePos.x * 0.1}deg) rotateX(${-mousePos.y * 0.1}deg)` }}>
              <div style={{ width:'100%', height:'100%', position:'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* ── Premium SVG Hero Background ───────────────────────── */}
          <div 
            className="hero-svg-bg" 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              zIndex: 0, 
              pointerEvents: 'none',
              opacity: 0.6
            }} 
            
          />
          {/* ── Precision Vector Corner Reticle Brackets ───────── */}
          <div className="vector-corner-tl" aria-hidden="true" />
          <div className="vector-corner-tr" aria-hidden="true" />
          <div className="vector-corner-bl" aria-hidden="true" />
          <div className="vector-corner-br" aria-hidden="true" />

            {/* ── Hero ─────────────────────────────────────────── */}
                  <section className="hero-section" aria-label="Game title" style={{ padding: '4px 0' }}>
                    {/* ── 3D Fanned WORD++ Title Logo ─────────────────────────── */}
                    <div className="hero-fanned-title-container" aria-label="WORD++ Title Logo">
                      {tiles.map(({ letter, color, rot, y }, idx) => (
                        <div
                          key={idx}
                          className={`hero-fanned-tile ${flippedTile === idx ? 'tile-flip' : ''}`}
                          onClick={() => handleTileClick(idx)}
                          onMouseEnter={() => soundManager.playPop()}
                          title="Click to flip WORD++ tile!"
                          style={{
                            borderColor: color,
                            boxShadow: `0 10px 25px rgba(0, 0, 0, 0.5), 0 0 16px ${color}55`,
                            transform: `rotate(${rot}deg) translateY(${y}px)`,
                            '--tile-color': color
                          } as React.CSSProperties}
                        >
                          <span className="hero-tile-letter">{letter}</span>
                        </div>
                      ))}
                    </div>
                    <p className="hero-subtitle" style={{ marginTop: '2px', letterSpacing: '3px' }}>The Ultimate Word Challenge</p>
                  </section>

      {/* ── Featured Modes: Spotlight Pair (Classic & Daily) + Compact Secondary ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p className="menu-section-label" style={{ margin: 0 }} aria-hidden="true">Game Modes</p>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Select or press key</span>
        </div>

        <div
          className="menu-options-grid"
          role="list"
          aria-label="Game modes"
          style={{ gap: '8px' }}
        >
                  {MODES.map(({ mode, label, description, tag, tagColor }) => {
                    const isDaily = mode === 'DAILY';
                    const isClassic = mode === 'CLASSIC';
                    const isCharging = chargeState === 'charging' && chargeTargetMode === mode;
                    const isReady = chargeState === 'ready' && chargeTargetMode === mode;
                    return (
                      <button
                        key={mode}
                        className={`menu-card ${isDaily ? 'daily-highlight-card' : ''} ${isCharging ? 'charging' : ''} ${isReady ? 'ready' : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          startCharge(mode);
                        }}
                        onMouseUp={cancelCharge}
                        onMouseLeave={cancelCharge}
                        onClick={() => {
                          if (!isCharging) {
                            soundManager.playFlip();
                            onSelectMode(mode);
                          }
                        }}
                        onMouseEnter={handleHover}
                        role="button"
                        aria-label={mode === 'CLASSIC' ? 'Play Classic mode' : `${label} — ${description}`}
                        style={{
                          '--card-accent': tagColor,
                          padding: '10px 14px',
                        } as React.CSSProperties}
                      >
                        <div className="card-body" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className="mode-accent-dot" style={{ background: tagColor, boxShadow: `0 0 6px ${tagColor}` }} />
                              <h3 style={{ fontSize: '14px', margin: 0 }}>{label}</h3>
                              {isDaily && (
                                <span className="daily-pulse-badge">FEATURED</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {isDaily && (
                                <kbd style={{ fontSize: '9px', padding: '1px 4px', background: 'rgba(245,158,11,0.2)', border: '1px solid #f59e0b', borderRadius: '3px', color: '#f59e0b', fontWeight: 800 }}>D</kbd>
                              )}
                              {isClassic && (
                                <kbd style={{ fontSize: '9px', padding: '1px 4px', background: 'rgba(129,140,248,0.2)', border: '1px solid #818cf8', borderRadius: '3px', color: '#818cf8', fontWeight: 800 }}>SPACE</kbd>
                              )}
                              <span className="mode-category-tag" style={{ color: tagColor, borderColor: tagColor, background: `${tagColor}18` }}>
                                {tag}
                              </span>
                            </div>
                          </div>
                          <p style={{ fontSize: '11px', margin: '4px 0 0 0', opacity: 0.85 }}>{description}</p>
                          {isDaily && (
                            <div style={{ marginTop: '6px' }}>
                              <div className="daily-timer-ticker" style={{ margin: '0 0 4px 0', fontSize: '10px' }}>
                                <span>⏳ Resets in {dailyCountdown}</span>
                              </div>
                              <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${dayProgress}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fde047)', transition: 'width 1s linear' }} />
                              </div>
                            </div>
                          )}
                          {/* Hold-to-charge overlay */}
                          {isCharging || isReady ? (
                            <div style={{ position: 'relative' }}>
                              <div className="charge-ring" />
                              <div className="charge-fill" style={{ transform: `rotate(${-90 + chargeProgress * 3.6}deg)` }} />
                              <span className="charge-label">{isReady ? 'RELEASE' : `${Math.round(chargeProgress)}%`}</span>
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
        </div>
      </div>

      {/* ── Rotating Social Proof & Community Activity Ticker ──────── */}
      <div className="social-proof-ticker" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '5px 12px', borderRadius: '20px', minHeight: '26px' }}>
        {socialMessages[socialFeedIndex]}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="menu-footer" style={{ paddingBottom: '2px' }}>
        <button className="btn-secondary" onClick={onOpenHelp} style={{ padding: '8px 18px', fontSize: '12px' }}>
          How to Play
        </button>
        <button className="btn-secondary" onClick={onOpenStats} style={{ padding: '8px 18px', fontSize: '12px' }}>
          Statistics
        </button>
      </div>
      </div>
    </div>
        </div>
          </div>
  );
};

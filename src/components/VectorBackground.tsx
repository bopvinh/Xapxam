import React from 'react';

interface FloatingLetter {
  char: string;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const LETTERS: FloatingLetter[] = [
  { char: 'W', x: '8%', y: '15%', size: 42, duration: 8, delay: 0, color: '#22d3a0' },
  { char: 'O', x: '88%', y: '18%', size: 38, duration: 10, delay: 1, color: '#f59e0b' },
  { char: 'R', x: '5%', y: '55%', size: 46, duration: 9, delay: 2, color: '#818cf8' },
  { char: 'D', x: '90%', y: '65%', size: 40, duration: 11, delay: 0.5, color: '#22d3a0' },
  { char: '+', x: '12%', y: '82%', size: 36, duration: 7, delay: 1.5, color: '#06b6d4' },
  { char: '+', x: '85%', y: '86%', size: 34, duration: 9.5, delay: 3, color: '#06b6d4' },
  { char: 'A', x: '4%', y: '35%', size: 30, duration: 8.5, delay: 2.5, color: '#a5b4fc' },
  { char: 'Z', x: '93%', y: '42%', size: 32, duration: 10.5, delay: 1.8, color: '#ec4899' },
];

interface VectorBackgroundProps {
  status?: 'PLAYING' | 'ROUND_OVER' | 'GAME_OVER' | 'WIN' | 'LOSS';
}

export const VectorBackground: React.FC<VectorBackgroundProps> = ({ status = 'PLAYING' }) => {
  const isWin = status === 'WIN' || status === 'GAME_OVER';
  const isSubmitting = status === 'ROUND_OVER';

  return (
    <div className={`vector-background-root kinetic-bg-layer ${isWin ? 'is-win' : ''} ${isSubmitting ? 'is-submitting' : ''}`} aria-hidden="true">
      {/* ── Background Vector Grid Matrix ─────────────────────── */}
      <svg className="vector-grid-overlay" width="100%" height="100%" style={{ transform: 'translate(calc(var(--tx) * 0.1), calc(var(--ty) * 0.1))' }}>
        <defs>
          <pattern id="vector-crosshair-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 50 42 L 50 58 M 42 50 L 58 50" stroke="rgba(99, 102, 241, 0.22)" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="1.5" fill="rgba(129, 140, 248, 0.35)" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vector-crosshair-pattern)" />
      </svg>

      {/* ── Top-Right Animated Vector Astrolabe Compass Ring ───── */}
      <svg
        className="vector-astrolabe-tr"
        width="340"
        height="340"
        viewBox="0 0 340 340"
        style={{
          position: 'absolute',
          top: '-70px',
          right: '-70px',
          opacity: 0.35,
          pointerEvents: 'none',
          transform: 'translate(calc(var(--tx) * 0.5), calc(var(--ty) * 0.5))',
        }}
      >
        <circle cx="170" cy="170" r="150" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.5" strokeDasharray="6 6" className="spin-clockwise-slow" />
        <circle cx="170" cy="170" r="120" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1" strokeDasharray="12 4" className="spin-counter-slow" />
        <circle cx="170" cy="170" r="85" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" />
        <line x1="170" y1="10" x2="170" y2="330" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" />
        <line x1="10" y1="170" x2="330" y2="170" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" />
        <circle cx="170" cy="20" r="4" fill="#06b6d4" />
        <circle cx="320" cy="170" r="4" fill="#6366f1" />
      </svg>

      {/* ── Bottom-Left Animated Vector Orbital Ring ──────────── */}
      <svg
        className="vector-astrolabe-bl"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          opacity: 0.32,
          pointerEvents: 'none',
          transform: 'translate(calc(var(--tx) * -0.5), calc(var(--ty) * -0.5))',
        }}
      >
        <circle cx="150" cy="150" r="135" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="1.5" strokeDasharray="8 8" className="spin-counter-slow" />
        <circle cx="150" cy="150" r="100" stroke="rgba(34, 211, 160, 0.25)" strokeWidth="1" strokeDasharray="4 6" className="spin-clockwise-slow" />
        <circle cx="150" cy="150" r="65" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" />
        <polygon points="150,40 180,150 150,260 120,150" stroke="rgba(6, 182, 212, 0.2)" fill="none" strokeWidth="1" className="spin-clockwise-slow" />
        <circle cx="150" cy="15" r="3.5" fill="#22d3a0" />
      </svg>

      {/* ── Floating Translucent Letter Tiles ─────────────────── */}
      {LETTERS.map(({ char, x, y, size, duration, delay, color }, i) => (
        <div
          key={i}
          className="floating-vector-letter"
          style={{
            left: x,
            top: y,
            width: `${size}px`,
            height: `${size * 1.12}px`,
            fontSize: `${size * 0.55}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            borderColor: `${color}40`,
            color: color,
            boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px ${color}22`,
            transform: 'translate(calc(var(--tx) * 0.8), calc(var(--ty) * 0.8))',
          }}
        >
          <span className="floating-char">{char}</span>
        </div>
      ))}
    </div>
  );
};

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

export const VectorBackground: React.FC = () => {
  return (
    <div className="vector-background-root" aria-hidden="true">
      {/* ── Ambient Coordinate Reticles ───────────────────────── */}
      <svg className="vector-grid-overlay" width="100%" height="100%">
        <defs>
          <pattern id="vector-crosshair-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 60 52 L 60 68 M 52 60 L 68 60" stroke="rgba(99, 102, 241, 0.18)" strokeWidth="1.2" />
            <circle cx="60" cy="60" r="1.5" fill="rgba(129, 140, 248, 0.25)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vector-crosshair-pattern)" />
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
          }}
        >
          <span className="floating-char">{char}</span>
        </div>
      ))}
    </div>
  );
};

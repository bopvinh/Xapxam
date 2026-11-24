import React, { useState, useEffect } from 'react';

interface FloatingLetter {
  char: string;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
  driftX: number;
  driftY: number;
}

const LETTERS: FloatingLetter[] = [
  { char: 'W', x: '12%', y: '18%', size: 52, duration: 12, delay: 0, color: '#6366f1', driftX: 15, driftY: 10 },
  { char: 'O', x: '82%', y: '15%', size: 48, duration: 14, delay: 1.5, color: '#818cf8', driftX: -12, driftY: 8 },
  { char: 'R', x: '8%', y: '55%', size: 56, duration: 11, delay: 3, color: '#06b6d4', driftX: 10, driftY: -12 },
  { char: 'D', x: '88%', y: '62%', size: 50, duration: 13, delay: 0.8, color: '#22d3a0', driftX: -18, driftY: -8 },
  { char: '+', x: '15%', y: '82%', size: 44, duration: 10, delay: 2.2, color: '#f59e0b', driftX: 8, driftY: 14 },
  { char: '+', x: '80%', y: '85%', size: 42, duration: 12.5, delay: 4, color: '#f59e0b', driftX: -10, driftY: 12 },
  { char: 'A', x: '5%', y: '35%', size: 36, duration: 11.5, delay: 1.2, color: '#a5b4fc', driftX: 6, driftY: -6 },
  { char: 'Z', x: '92%', y: '42%', size: 38, duration: 13.5, delay: 2.8, color: '#ec4899', driftX: -8, driftY: 6 },
];

interface MainMenuVectorBackdropProps {
  mousePos?: { x: number; y: number };
  hoveredModeColor?: string | null;
}

export const MainMenuVectorBackdrop: React.FC<MainMenuVectorBackdropProps> = ({
  mousePos = { x: 0, y: 0 },
  hoveredModeColor = null
}) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const mx = mousePos.x;
  const my = mousePos.y;

  // Compute accent color from hovered mode or default
  const accentColor = hoveredModeColor || '#6366f1';
  const accentRgb = hexToRgb(accentColor);

  return (
    <div
      className="main-menu-vector-backdrop"
      aria-hidden="true"
      style={{
        '--mx': mx,
        '--my': my,
        '--accent-r': accentRgb?.r || 99,
        '--accent-g': accentRgb?.g || 102,
        '--accent-b': accentRgb?.b || 241,
      } as React.CSSProperties}
    >
      {/* ── Ambient Radial Light Cones ────────────────────────── */}
      <div className="backdrop-light-cones" style={{ opacity: isReducedMotion ? 0.3 : 1 }} />

      {/* ── Vector Grid Matrix ────────────────────────────────── */}
      <svg className="backdrop-grid-overlay" width="100%" height="100%" viewBox="0 0 1000 700" preserveAspectRatio="none">
        <defs>
          <pattern id="backdrop-crosshair-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 40 34 L 40 46 M 34 40 L 46 40" stroke={`rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.18)`} strokeWidth="1" />
            <circle cx="40" cy="40" r="1.2" fill={`rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)`} />
            <line x1="0" y1="40" x2="80" y2="40" stroke="rgba(255, 255, 255, 0.01)" strokeWidth="0.5" />
            <line x1="40" y1="0" x2="40" y2="80" stroke="rgba(255, 255, 255, 0.01)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#backdrop-crosshair-pattern)" style={{ transform: `translate(calc(var(--mx) * 30px), calc(var(--my) * 30px))` }} />
      </svg>

      {/* ── Top-Right Animated Vector Astrolabe Compass Ring ───── */}
      <svg
        className="backdrop-astrolabe-tr"
        width="380"
        height="380"
        viewBox="0 0 380 380"
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          opacity: isReducedMotion ? 0.2 : 0.4,
          pointerEvents: 'none',
          transform: `translate(calc(var(--mx) * 40px), calc(var(--my) * 40px))`,
          transition: 'opacity 0.3s ease',
        }}
      >
        <defs>
          <filter id="astrolabe-glow-tr" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="190" cy="190" r="170" stroke={`rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)`} strokeWidth="1.5" strokeDasharray="8 8" className="spin-clockwise-slow" filter="url(#astrolabe-glow-tr)" />
        <circle cx="190" cy="190" r="135" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" strokeDasharray="16 6" className="spin-counter-slow" />
        <circle cx="190" cy="190" r="95" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" />
        <line x1="190" y1="15" x2="190" y2="365" stroke={`rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.15)`} strokeWidth="0.8" />
        <line x1="15" y1="190" x2="365" y2="190" stroke={`rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.15)`} strokeWidth="0.8" />
        <circle cx="190" cy="20" r="3.5" fill="#06b6d4" className="pulse-ring" />
        <circle cx="360" cy="190" r="3.5" fill="#6366f1" className="pulse-ring" />
        <circle cx="190" cy="360" r="3.5" fill="#22d3a0" className="pulse-ring" />
        <circle cx="20" cy="190" r="3.5" fill="#f59e0b" className="pulse-ring" />
      </svg>

      {/* ── Bottom-Left Animated Vector Orbital Ring ──────────── */}
      <svg
        className="backdrop-astrolabe-bl"
        width="340"
        height="340"
        viewBox="0 0 340 340"
        style={{
          position: 'absolute',
          bottom: '-70px',
          left: '-70px',
          opacity: isReducedMotion ? 0.18 : 0.35,
          pointerEvents: 'none',
          transform: `translate(calc(var(--mx) * -40px), calc(var(--my) * -40px))`,
          transition: 'opacity 0.3s ease',
        }}
      >
        <defs>
          <filter id="astrolabe-glow-bl" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="170" cy="170" r="155" stroke="rgba(129, 140, 248, 0.25)" strokeWidth="1.5" strokeDasharray="10 10" className="spin-counter-slow" filter="url(#astrolabe-glow-bl)" />
        <circle cx="170" cy="170" r="115" stroke="rgba(34, 211, 160, 0.22)" strokeWidth="1" strokeDasharray="6 8" className="spin-clockwise-slow" />
        <circle cx="170" cy="170" r="75" stroke={`rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.18)`} strokeWidth="1" />
        <polygon points="170,50 205,170 170,290 135,170" stroke="rgba(6, 182, 212, 0.18)" fill="none" strokeWidth="1" className="spin-clockwise-slow" />
        <circle cx="170" cy="15" r="3" fill="#22d3a0" className="pulse-ring" />
        <circle cx="325" cy="170" r="3" fill="#6366f1" className="pulse-ring" />
        <circle cx="170" cy="325" r="3" fill="#06b6d4" className="pulse-ring" />
        <circle cx="15" cy="170" r="3" fill="#f59e0b" className="pulse-ring" />
      </svg>

      {/* ── Center Subtle Orbit Ring (reacts to hovered mode) ─── */}
      <svg
        className="backdrop-center-orbit"
        width="280"
        height="280"
        viewBox="0 0 280 280"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: isReducedMotion ? 0.15 : 0.25,
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease, stroke 0.4s ease',
        }}
      >
        <circle
          cx="140"
          cy="140"
          r="100"
          stroke={`rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)`}
          strokeWidth="1.5"
          strokeDasharray="4 6"
          className="spin-clockwise-slow"
        />
        <circle cx="140" cy="140" r="65" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="8 4" className="spin-counter-slow" />
        <circle cx="140" cy="140" r="35" stroke={`rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.12)`} strokeWidth="0.8" />
      </svg>

      {/* ── Floating Translucent Letter Tiles ─────────────────── */}
      {LETTERS.map(({ char, x, y, size, duration, delay, color, driftX, driftY }, i) => (
        <div
          key={i}
          className="backdrop-floating-letter"
          style={{
            left: x,
            top: y,
            width: `${size}px`,
            height: `${size * 1.15}px`,
            fontSize: `${size * 0.55}px`,
            animationDuration: isReducedMotion ? '0s' : `${duration}s`,
            animationDelay: `${delay}s`,
            borderColor: `${color}30`,
            color: color,
            boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${color}25`,
            transform: `translate(calc(var(--mx) * ${driftX}px), calc(var(--my) * ${driftY}px))`,
            willChange: 'transform',
          }}
        >
          <span className="backdrop-floating-char">{char}</span>
          {/* Subtle inner glow */}
          <span className="backdrop-tile-inner-glow" style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }} />
        </div>
      ))}

      {/* ── Corner Vector Brackets ────────────────────────────── */}
      <div className="backdrop-corner-brackets" aria-hidden="true">
        <div className="backdrop-corner tl" style={{ borderColor: `rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.5)` }} />
        <div className="backdrop-corner tr" style={{ borderColor: `rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.5)` }} />
        <div className="backdrop-corner bl" style={{ borderColor: `rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.5)` }} />
        <div className="backdrop-corner br" style={{ borderColor: `rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.5)` }} />
      </div>

      {/* ── Subtle Scanline Overlay ───────────────────────────── */}
      <div className="backdrop-scanlines" aria-hidden="true" />
    </div>
  );
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export default MainMenuVectorBackdrop;
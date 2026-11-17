import React, { useState, useEffect } from 'react';

export type ThemeName = 'imperial' | 'cyberpunk' | 'synthwave' | 'emerald' | 'minimal';

interface ThemeCustomizerProps {
  onThemeChange?: (theme: ThemeName) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('imperial');

  useEffect(() => {
    const saved = localStorage.getItem('wordplusplus_custom_theme') as ThemeName;
    if (saved) {
      setCurrentTheme(saved);
      applyTheme(saved);
    }
  }, []);

  const applyTheme = (theme: ThemeName) => {
    const root = document.documentElement;
    if (theme === 'cyberpunk') {
      root.style.setProperty('--accent', '#06b6d4');
      root.style.setProperty('--accent-bright', '#22d3ee');
      root.style.setProperty('--correct', '#10b981');
      root.style.setProperty('--present', '#facc15');
      root.style.setProperty('--bg-ambient', '#050814');
    } else if (theme === 'synthwave') {
      root.style.setProperty('--accent', '#d946ef');
      root.style.setProperty('--accent-bright', '#f472b6');
      root.style.setProperty('--correct', '#34d399');
      root.style.setProperty('--present', '#fb923c');
      root.style.setProperty('--bg-ambient', '#180728');
    } else if (theme === 'emerald') {
      root.style.setProperty('--accent', '#10b981');
      root.style.setProperty('--accent-bright', '#34d399');
      root.style.setProperty('--correct', '#059669');
      root.style.setProperty('--present', '#eab308');
      root.style.setProperty('--bg-ambient', '#061a12');
    } else if (theme === 'minimal') {
      root.style.setProperty('--accent', '#94a3b8');
      root.style.setProperty('--accent-bright', '#cbd5e1');
      root.style.setProperty('--correct', '#64748b');
      root.style.setProperty('--present', '#d97706');
      root.style.setProperty('--bg-ambient', '#0f172a');
    } else {
      // Default Imperial
      root.style.setProperty('--accent', '#6366f1');
      root.style.setProperty('--accent-bright', '#818cf8');
      root.style.setProperty('--correct', '#22d3a0');
      root.style.setProperty('--present', '#f59e0b');
      root.style.setProperty('--bg-ambient', '#0d1117');
    }
  };

  const handleSelect = (theme: ThemeName) => {
    setCurrentTheme(theme);
    localStorage.setItem('wordplusplus_custom_theme', theme);
    applyTheme(theme);
    if (onThemeChange) onThemeChange(theme);
  };

  return (
    <div className="theme-customizer-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700 }}>Theme:</span>
      {(['imperial', 'cyberpunk', 'synthwave', 'emerald'] as ThemeName[]).map((t) => (
        <button
          key={t}
          onClick={() => handleSelect(t)}
          style={{
            fontSize: '10px',
            padding: '3px 8px',
            borderRadius: '12px',
            border: currentTheme === t ? '1.5px solid var(--accent)' : '1px solid var(--bg-elevated-2)',
            background: currentTheme === t ? 'var(--accent)' : 'var(--bg-elevated)',
            color: currentTheme === t ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            textTransform: 'capitalize'
          }}
        >
          {t === 'imperial' ? '👑 Imperial' : t === 'cyberpunk' ? '⚡ Cyber' : t === 'synthwave' ? '🟪 Synth' : '🌿 Emerald'}
        </button>
      ))}
    </div>
  );
};

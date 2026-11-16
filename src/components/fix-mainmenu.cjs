const fs = require('fs');
let content = fs.readFileSync('MainMenu.tsx', 'utf-8');

// Remove the module-level return statement and its opening div
const returnStart = content.indexOf('  return (');
const returnEnd = content.lastIndexOf('  );');
if (returnStart !== -1 && returnEnd !== -1) {
  content = content.substring(0, returnStart) + content.substring(returnEnd + '  );'.length);
}

// Now add the complete return JSX correctly inside the component
const returnJSX = `
  return (
    <div className="main-menu-container">
      {/* Hero Background SVG */}
      <div className="hero-bg-layer">
        <img src={heroBg} alt="" className="hero-bg-image" />
        <div className="hero-glow-accent" />
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        {/* Animated RGB Wordmark */}
        <div className="rgb-wordmark">
          <div className="rgb-word-wrapper">
            <span className="rgb-word-letter rgb-w">W</span>
            <span className="rgb-word-letter rgb-o">O</span>
            <span className="rgb-word-letter rgb-r">R</span>
            <span className="rgb-word-letter rgb-d">D</span>
            <span className="rgb-word-plus">+</span>
            <span className="rgb-word-plus">+</span>
          </div>
        </div>

        {/* Hero subtitle */}
        <p className="hero-subtitle">The Ultimate Word Challenge</p>

        {/* Primary CTA */}
        <div className="hero-cta">
          <button
            className="btn-play-now pulse-glow-cta"
            onClick={() => {
              soundManager.playFlip();
              onSelectMode('CLASSIC');
            }}
            onMouseEnter={handleHover}
            aria-label="Play Classic mode"
          >
            <div className="btn-play-now-glow" />
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>⚡ Quick Match</span>
              <kbd style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>SPACE</kbd>
            </span>
          </button>
          <span className="hero-cta-label">
            {(userStats && userStats.streak > 0)
              ? \`🔥 Streak Active (\${userStats.streak}) — Jump right back in!\`
              : 'Classic Solo · 5 Letters · 6 Guesses'}
          </span>
        </div>

        {/* Mode selector carousel */}
        <div className="mode-selector">
          <div className="mode-selector-track">
            {MODES.map((item) => {
              const { mode, label, description, tag, tagColor } = item;
              const isDaily = mode === 'DAILY';
              return (
                <button
                  key={mode}
                  className={\`mode-card \${isDaily ? 'daily-highlight-card' : ''}\`}
                  onClick={() => {
                    soundManager.playFlip();
                    onSelectMode(mode);
                  }}
                  onMouseEnter={handleHover}
                  role="listitem"
                  aria-label={\`\${label} — \${description}\`}
                >
                  <div className="mode-card-body">
                    <div className="card-icon-row">
                      <span className="mode-icon" style={{ background: 'rgba(50,50,80,0.5)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tagColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {mode === 'CLASSIC' && <circle cx="12" cy="12" r="8"/>}
                          {mode === 'DAILY' && <rect x="6" y="6" width="12" height="12" rx="2"/>}
                          {mode === 'PARTY' && (
                            <><circle cx="10" cy="10" r="5"/><circle cx="17" cy="14" r="4"/></>
                          )}
                          {mode === 'FAST' && (
                            <polygon points="13,4 15,8 18,10 16,14 12,12 8,14 6,10 9,8"/>
                          )}
                          {mode === 'TIMED' && (
                            <><circle cx="12" cy="12" r="8"/><line x1="12" y1="22" x2="12" y2="14"/></>
                          )}
                          {mode === 'TEAM' && (
                            <><circle cx="10" cy="10" r="5"/><circle cx="16" cy="8" r="4"/></>
                          )}
                        </svg>
                      </span>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <h3 style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>{label}</h3>
                        <span className="mode-badge" style={{ color: tagColor, borderColor: tagColor, background: \`\${tagColor}18\` }}>
                          {tag}
                        </span>
                      </div>
                    </div>
                    <p className="card-desc">{description}</p>
                    {isDaily && (
                      <div className="card-daily-cta">
                        <span className="card-daily-timer">⏳ Resets in {dailyCountdown}</span>
                        <div className="card-daily-progress">
                          <div style={{ width: \`\${dayProgress}%\`, height: '3px', background: 'linear-gradient(90deg, #f59e0b, #fde047)', borderRadius: '2px' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rotating social proof ticker */}
        <div className="social-proof-ticker">
          {socialMessages[socialFeedIndex]}
        </div>

        {/* Footer */}
        <div className="menu-footer">
          <button className="btn-secondary" onClick={onOpenHelp} style={{ padding: '8px 16px', fontSize: '12px' }}>
            How to Play
          </button>
          <button className="btn-secondary" onClick={onOpenStats} style={{ padding: '8px 16px', fontSize: '12px' }}>
            Statistics
          </button>
        </div>
      </div>
    </div>
  );
};
`;

// Insert return JSX before the final };
const componentEnd = content.lastIndexOf('};');
if (componentEnd !== -1) {
  content = content.substring(0, componentEnd) + returnJSX + content.substring(componentEnd);
}

fs.writeFileSync('MainMenu.tsx', content);
console.log('Fixed file, length:', content.length);

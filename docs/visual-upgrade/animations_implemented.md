# Implemented Animations

List of animations introduced or enhanced in **Word++** for the premium visual experience.

| # | CSS Class(es) (file: src/styles/global.css) | Animation (Keyframes) | Visual Effect |
|---|----------------------------------------------|-----------------------|----------------|
| 1 | `.main-menu-container, .gameplay-area` | `screen-fade` + `scale-up` | Main containers fade in and scale‑up from 0.85→1. |
| 2 | `.spin-clockwise-slow` | `spin-clockwise` (45 s) | Background middle layer slowly rotates clockwise. |
| 3 | `.spin-counter-slow` | `spin-counter` (35 s) | Background top layer slowly rotates counter‑clockwise. |
| 4 | `.floating-vector-letter` | `float-drift` | Vector letters drift upward and rotate gently. |
| 5 | `.shimmer-sweep` | `shimmer-sweep` | Light sweep across the “Play” button. |
| 6 | `.pulse-glow` | `pulse-glow` | Pulse glow on the hero CTA button. |
| 7 | `.hero-flip` | `hero-flip` | Hero tile flip on hover/click. |
| 8 | `.victory-flash` | `victory-flash` | Full‑screen flash when a game is won. |
| 9 | `.victory-tile-cascade` | `victory-tile-cascade` | Victory tiles cascade into place. |
|10 | `.word-slide-in` | `word-slide-in` | Word letters slide in during victory reveal. |
|11 | `.emblem-flare` | `emblem-flare` | Medal emblem flare on victory screen. |
|12 | `.flame-flicker` | `flame-flicker` | Streak fire flicker animation. |
|13 | `.flame-aura-breathe` | `flame-aura-breathe` | Aura around the streak fire. |
|14 | `.active-rainbow-glow` | `active-rainbow-glow` | Active tile glow in rainbow gradient. |
|15 | `.key-spin-3d` | `key-spin-3d` | Keyboard key 3‑D spin on press. |
|16 | `.board-cell-breathe` | `board-cell-breathe` | Board cell breathing effect on active row. |
|17 | `.submit-flash-green` | `submit-flash-green` | Green flash on correct submission. |
|18 | `.gold-word-shimmer` | `gold-word-shimmer` | Gold shimmer on word tile. |
|19 | `.victory-word-bloom` | `victory-word-bloom` | Victory word blooms. |
|20 | `.bg-radial-ripple` | `bg-radial-ripple` | Radial ripple background. |
|21 | `.live-beacon-pulse` | `live-beacon-pulse` | Live‑player beacon pulse. |
|22 | `.key-glow-pulse` | `key-glow-pulse` | Key glow pulse on press. |
|23 | `.key-scan` | `key-scan` | Scanline sweep across keyboard. |
|24 | `.badge-pulse` | `badge-pulse` | Badge pulse animation. |
|25 | `.hero-tile-float` | `hero-tile-float` | Hero tile float. |
|26 | `.border-glow` | `border-glow` | Border glow pulse. |
|27 | `.shake` | `shake` | Screen shake on invalid guess. |
|28 | `.chromatic-glitch` | `chromatic-glitch` | Chromatic glitch effect. |
|29 | `.row-breathe` | `row-breathe` | Row breathing animation. |
|30 | `.gold-victory-pulse` | `gold-victory-pulse` | Gold victory pulse. |
|31 | `.title-bounce-elastic` | `title-bounce-elastic` | Title bounce elastic. |
|32 | `.victory-title-pulse` | `victory-title-pulse` | Victory title pulse. |
|33 | `.particle-burst` | `particle-burst` | Particle burst on hit. |
|34 | `.confetti-fall-fast` | `confetti-fall-fast` | Confetti fast fall. |
|35 | `.confetti-fall-slow` | `confetti-fall-slow` | Confetti slow fall. |
|36 | `.confetti-drift` | `confetti-drift` | Confetti drift. |
|37 | `.stagger-enter` | `stagger-enter` | Staggered entry of UI elements. |
|38 | `.particle-fall` | `particle-fall` | Particle falling animation. |
|39 | `.live-pulse` | `live-pulse` | Live indicator pulse. |

**Component classes that also trigger CSS animations**

| Component (file) | Trigger | Effect |
|------------------|---------|--------|
| `MainMenu.tsx` | `mousePos` change | 3‑D tilt of hero tile (`perspective` + `rotateY`/`rotateX`). |
| `MainMenu.tsx` | `mousePos` change | Cursor‑driven hero glow emission. |
| `VectorBackground.tsx` | `useEffect` | Continuous background rotation & particle drift. |
| `GameBoard.tsx` | `invalidRowIndex` change | Shaking of the board (`shake` class). |
| `VictoryScreen.tsx` | `status === 'GAME_OVER'` | Victory overlay fade‑in, tile cascade, confetti burst. |
| `App.tsx` | `isJolting` state | Viewport impact jolt on player move. |
| `BattleBoard.tsx` | Game state change | Health bar pop & tile lock UI updates. |

---
*All animations respect `prefers-reduced-motion` via the global media query block at lines 2552‑2643 of `src/styles/global.css`.*

# Redesigned UI Components

This file lists each UI component that was redesigned or newly introduced as part of the **Battle Word++** premium visual overhaul, along with a summary of the major changes applied.

---

## 1. MainMenu (`src/components/MainMenu.tsx`)

- **3‑D tilt on mouse move** – The whole menu container now tracks the cursor with a subtle perspective‑based tilt (`transform: perspective(1000px) rotateY(...) rotateX(...)`).
- **Entrance domino‑wave flip** – Animated tile‑flip sequence (`flippedTile` state) for the five letter tiles in the hero area.
- **Shimmer overlay on hero CTA** – Continuous `shimmer-sweep` animation over the “Play Now” button.
- **Daily progress ribbon** – Animated fill bar (`main-menu-progress-ribbon__fill`) showing the day‑progress percentage.
- **Social proof ticker** – Rotating live feed of solver stats and challenge countdown.
- **Cursor‑driven hero glow** – A subtle radial glow follows the mouse over the hero tile area (defined in CSS, driven by `--hero-mouse-x`/`--hero-mouse-y` variables).

## 2. VectorBackground (`src/components/VectorBackground.tsx`)

- **Dual‑axis astrolabe rings** – Two large rings (`spin-clockwise-slow` & `spin-counter-slow`) rotate in opposite directions, creating a 3‑D celestial effect.
- **Kinetic particle layer** – Many small floating glyphs (`floating-vector-letter`) drift upward with gentle rotation, giving a sense of depth.
- **Grid pulse** – A subtle grid overlay pulses gently to reinforce the vector theme.
- **Corner ticks** – Four bright corner ticks appear on hover, matching the “precision instrument” aesthetic.

## 3. Animations (`src/components/Animations.tsx`)

- **Flip variants** – `flipVariants` defines a clean Y‑axis flip for the hero tiles, used by the domino‑wave entrance.
- **Hit variants** – `hitVariants` (scale + translate) used for quick feedback (e.g., tile hit, key press).

## 4. BattleBoard (`src/components/BattleBoard.tsx`)

- **Health‑bar overlay** – Shows player/opponent health using dynamic gradients.
- **Tile‑lock UI** – Displays which letters are locked for each player, with synced colors.
- **Time‑penalty display** – Shows remaining time and any added penalty.

## 5. VictoryScreen (`src/components/VictoryScreen.tsx`)

- **Celebration overlay** – Scales up with a golden flash and spins the medal emblem.
- **Streak fire** – Animated flame particle effect behind the streak count.
- **Confetti burst** – Colorful particle explosion on a perfect win.
- **Medal display** – Shows tier (diamond/gold/silver) with glow pulse.
- **Animations**:

  - `victory-flash` – Full‑screen flash.
  - `victory-tile-cascade` – Tiles cascade into place.
  - `word-slide-in` – Letters of the winning word slide in.
  - `emblem-flare` – Emblem flare.
  - `flame-flicker` / `flame-aura-breathe` – Streak fire.
  - `gold-victory-pulse` – Pulsing gold rim.
  - `active-rainbow-glow` – Rainbow glow on active key.
  - `key-spin-3d` – Keyboard key 3‑D spin on press.
  - `board-cell-breathe` – Breathing animation on the active board row.
  - `submit-flash-green` – Green flash on correct submission.
  - `gold-word-shimmer` – Shimmer on gold word tile.
  - `victory-word-bloom` – Victory word bloom animation.
  - `bg-radial-ripple` – Background radial ripple.
  - `live-beacon-pulse` – Live‑status beacon.
  - `key-glow-pulse` – Keyboard key glow pulse.
  - `key-scan` – Scanline sweep across keyboard.
  - `badge-pulse` – Badge pulse animation.
  - `hero-tile-float` – Hero tile float.
  - `border-glow` – Border glow pulse.
  - `shake` – Screen shake on invalid move.
  - `chromatic-glitch` – Chromatic glitch effect.
  - `row-breathe` – Row breathing animation.
  - `gold-victory-pulse` – Gold victory pulse.
  - `title-bounce-elastic` – Title bounce elastic.
  - `victory-title-pulse` – Victory title pulse.
  - `particle-burst` – Particle burst on hit.
  - `confetti-fall-fast` / `confetti-fall-slow` / `confetti-drift` – Confetti animations.
  - `stagger-enter` – Staggered entry of UI elements.
  - `particle-fall` – Particle falling animation.
  - `live-pulse` – Live indicator pulse.

## 6. App (`src/App.tsx`)

- **VictoryScreen integration** – Renders the celebration overlay when `status === 'GAME_OVER'`.
- **Viewport impact jolt** – Adds a brief “jolt” to the whole viewport when a player makes a quick move (`isJolting` state).

## 7. Global Styles (`src/styles/global.css`)

- **Utility animations** – `screen-fade`, `scale-up`, `shimmer`, `pulse-glow`, `float`, `spin-clockwise`, `spin-counter`, `float-drift`, `shimmer-sweep`, `badge-pulse`, `hero-tile-float`, `border-glow`, `shake`, `chromatic-glitch`, `row-breathe`, `gold-victory-pulse`, `title-bounce-elastic`, `victory-title-pulse`, `particle-burst`, `confetti-fall-fast`, `confetti-fall-slow`, `confetti-drift`, `stagger-enter`, `particle-fall`, `live-pulse`.
- **Reduced‑motion support** – `@media (prefers-reduced-motion: reduce)` disables all animations (including the new ones) for accessibility.
- **Keyframe definitions** – All keyframes are defined at the end of the file, and application classes reference them via `animation` shorthand.

---

*All components respect `prefers-reduced-motion` where appropriate, and any new animation is paired with a corresponding ARIA‑friendly behavior (e.g., focus states, fallbacks).*

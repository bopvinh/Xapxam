# WORD++ — The Ultimate Word Challenge

WORD++ is a premium, fully-featured, browser-based word puzzle game designed with React, TypeScript, and modern CSS. It is inspired by classic word guessing and the official Hasbro Wordle Party Game rules, optimized for zero-scroll viewport autofits, WCAG AAA accessibility, and flawless duplicate-letter feedback.

---

## Key Features

1. **Classic Mode:** Guess a secret five-letter word in six tries with instant, color-coded letter feedback.
2. **Daily Challenge:** A daily synchronized puzzle with streaks and statistics tracked locally.
3. **Multiplayer Party (2-4 Players):** Real-life pass-and-play party game with rotating hosts, custom secret word selection, and lowest-cumulative-score rules.
4. **Fast Mode:** Competitive multiplayer speed challenge where the first to solve gets a point.
5. **Timed Mode:** Race against a 60 or 90-second countdown; expired guesses consume attempts.
6. **Team Mode:** Form teams to solve words collaboratively and share attempt counts.
7. **Color-Blind Mode:** Highly accessible high-contrast themes utilizing shapes/badges (✓, ✦) for visibility.
8. **Professional Graphics:** Sleek dark-mode aesthetic with smooth card-flipping and text shake animations.

---

## Technical Architecture

- **Engine (`src/game/engine.ts`):** Robust, double-pass evaluation algorithm that correctly manages duplicate letters (such as in `APPLE`, `LEVEL`, `ALLOW`, and `EERIE`) matching exact placements before partial ones.
- **Dictionary (`src/game/wordlist.ts`):** Complete dictionary of 5,757 valid 5-letter English words and a clean subset of ~2,000 secrets (excluding plurals/proper nouns/abbreviations per Hasbro standards).
- **TypeScript:** Strictly type-safe interfaces (`src/game/types.ts`) passing `--noEmit` checks perfectly.
- **Bundler:** Vite 5 with Vitest unit testing and automated Playwright E2E support.

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x / pnpm / uv

### Installation

Navigate to the project root and install dependencies:

```bash
cd "C:/Users/Bopvi/Projects/Word++"
npm install
```

### Development Startup

To run the development server with hot-reload:

```bash
npm run dev
```

The server will be active at `http://localhost:5173`.

### Running Tests

To run the full suite of unit tests verifying the duplicate-letter engine:

```bash
npm run test
```

To run typechecking:

```bash
npm run typecheck
```

### Production Build

To bundle the application for production:

```bash
npm run build
```

This compiles TypeScript and outputs optimized assets to `dist/`.

---

## Game Rules & Dual-Pass Handling

The exact duplicate-letter feedback follows the standard established in **Hasbro Party Game F8348**:
- **First Pass (Green/Correct):** Matches exact letters in their correct positions. Matches are registered, and those letters in the secret word are marked as "consumed."
- **Second Pass (Yellow/Present):** Scanning remaining letters left-to-right, letters are marked as yellow *only if* an unconsumed matching letter remains in the secret word.
- **Surplus (Gray/Absent):** If a letter is guessed twice but only exists once in the secret, the second letter is colored dark gray/absent, indicating "no more copies."

# Battle Word++ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Word++ into a premium, competitive PvP game with combat-like mechanics, cinematic animations, and a distinct visual identity.

**Architecture:** Build a "Battle UI" layer over the existing Word++ game board, using WebSocket-based turn state management.

**Tech Stack:** React, TypeScript, Vite, Framer Motion (animations), socket.io (PvP synchronization), lightweight SVG/Canvas for VFX.

**Spec:** `C:/Users/Bopvi/Projects/Word++/docs/superpowers/specs/2026-11-17-word-plus-plus-pvp-design.md`

## Global Constraints
- **Framework Floor:** React 18 / TypeScript
- **CSS:** Pure CSS (no Tailwind)
- **Responsiveness:** Desktop and Mobile friendly
- **Animation:** Respect `prefers-reduced-motion`

## Review Focus
1. WebSocket disconnect handling and game state recovery.
2. Responsiveness of complex animations across slow mobile devices.
3. Fairness of combat mechanics (avoiding "attack spam").
4. Visual accessibility of combat feedback (contrast/readability).
5. Performance of particle VFX on mobile viewports.

---

### Task 1: Foundation & WebSocket Scaffolding

**Files:**
- Modify: `whitefish/src/App.tsx` (Add PvP entry/wrapper)
- Create: `whitefish/src/game/pvp-engine.ts` (WebSocket logic)
- Test: `whitefish/tests/pvp-engine.test.ts`

**Interfaces:**
- Consumes: Existing `engine.ts` (Core game logic)
- Produces: `initPvPSocket(roomID: string): Socket`, `sendGuess(guess: string)`

- [ ] **Step 1: Write the failing test for WebSocket connection**
- [ ] **Step 2: Implement socket connection logic in `pvp-engine.ts`**
- [ ] **Step 3: Run tests and verify**
- [ ] **Step 4: Commit**

### Task 2: Combat Logic & Board Layer

**Files:**
- Create: `whitefish/src/components/BattleBoard.tsx` (Wrap GameBoard)
- Modify: `whitefish/src/game/types.ts` (Add Health, Damage types)

**Interfaces:**
- Consumes: PvP Socket state, existing game engine guesses
- Produces: `CombatBoard` component with `health` and `attack` triggers

- [ ] **Step 1: Define Battle types**
- [ ] **Step 2: Create `BattleBoard` wrapper**
- [ ] **Step 3: Commit**

### Task 3: Cinematic Animations (Theatricals)

**Files:**
- Create: `whitefish/src/components/Animations.tsx`
- Modify: `whitefish/src/components/GameBoard.tsx` (Insert tile flip/hit animations)

**Interfaces:**
- Consumes: Guess results
- Produces: `flipTile()`, `triggerHitEffect()`

- [ ] **Step 1: Implement Framer Motion flip animations**
- [ ] **Step 2: Integrate `triggerHitEffect` on incorrect guesses**
- [ ] **Step 3: Commit**

### Task 4: Integration & Victory Celebration

**Files:**
- Create: `whitefish/src/components/VictoryScreen.tsx`
- Modify: `whitefish/src/App.tsx` (Wire up victory path)

**Interfaces:**
- Consumes: Game over state (PvP winner)
- Produces: Victory screen UI

- [ ] **Step 1: Create Victory celebration screen**
- [ ] **Step 2: Integrate with PvP engine state**
- [ ] **Step 3: Run E2E tests**
- [ ] **Step 4: Commit**

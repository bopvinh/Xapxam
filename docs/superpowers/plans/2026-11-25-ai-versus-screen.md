# AI Boss Arena Arcade VERSUS Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a cinematic, AAA arcade-style "VERSUS" takeover screen (`AIVersusScreen.tsx`) when launching an AI Boss Arena match, displaying the player vs the selected AI Boss with custom icons, color auras, quotes, and sound FX before auto-advancing to the gameplay board.

**Architecture:**
- **Component**: `src/components/AIVersusScreen.tsx`
- **Styles**: `src/styles/ai-versus-screen.css`
- **Integration**: Integrated into `src/App.tsx` when starting an AI Boss Arena match (`showAIVersusScreen` state).

**Tech Stack:** React 18, TypeScript, CSS Keyframe Animations, Web Audio Synth (`soundManager`).

## Global Constraints
- Pure CSS animations; zero new npm dependencies.
- Zero game-logic or engine rule changes.
- Automatically advances after 2.4s or when clicked/tapped (accessibility and speedrun friendly).

---

## Tasks

### Task 1: Create `ai-versus-screen.css` Stylesheet

**Files:**
- Create: `src/styles/ai-versus-screen.css`
- Modify: `src/App.tsx` (import stylesheet)

- [ ] **Step 1: Write `src/styles/ai-versus-screen.css` with high-impact keyframe animations**

Include:
- `.ai-versus-overlay` (fixed inset 0, dark backdrop, z-index 15000).
- `.ai-versus-card-left` (player slide-in from left).
- `.ai-versus-card-right` (boss slide-in from right).
- `.ai-versus-emblem` (3D metallic VS badge drop in center).
- `.ai-versus-quote` (glowing quote text).
- `.ai-versus-skip-btn` (subtle skip prompt).

### Task 2: Create `AIVersusScreen.tsx` Component

**Files:**
- Create: `src/components/AIVersusScreen.tsx`

- [ ] **Step 1: Implement `AIVersusScreen` component**

Props:
- `boss: AIPersonality`
- `hardMode: boolean`
- `onComplete: () => void`

Behavior:
- Plays `soundManager.playFanfare()` and `soundManager.playHaptic()` on mount.
- 2.4-second auto-complete timer.
- Click anywhere or press Space/Enter to skip immediately.

### Task 3: Integrate into `App.tsx` and Verify

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add `showAIVersus` state and trigger logic in `App.tsx`**
- [ ] **Step 2: Render `<AIVersusScreen>` when active**
- [ ] **Step 3: Run `npm run build` and `npm run test`**

Verify zero build/typecheck errors and all 77 tests pass.

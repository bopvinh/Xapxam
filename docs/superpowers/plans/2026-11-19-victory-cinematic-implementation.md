# Cinematic Victory Celebration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic victory takeover pipeline triggered by game events.

**Architecture:** A Global Overlay component that listens for `GAME_WIN` events, plays a pre-fetched `.mp4`, and auto-transitions to the results screen.

**Tech Stack:** React, HTML5 Video, Socket.io.

**Spec:** docs/superpowers/specs/2026-11-19-victory-cinematic-design.md

## Global Constraints
- **Animation Style:** MVC2/DBZ High-Intensity Anime.
- **Delivery Format:** Performant `.mp4` (H.264/AAC) for browser compatibility.
- **Performance:** Pre-fetch video asset during game match.

## Review Focus
1. **Trigger Sync:** Video must start *instantly* (no buffer).
2. **State Cleanup:** Must clear all game board interactions during the takeover.
3. **Transition:** Video-to-Results fade must feel "seamless" (zero frame-drop).

---

### Task 1: Cinematic Overlay Component

**Files:**
- Create: `src/components/CinematicVictory.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `winner`, `isVictoryCinematic` state from App root.
- Produces: Visual overlay component.

- [ ] **Step 1: Create `CinematicVictory.tsx`**
    - Component props: `videoSource: string`, `onComplete: () => void`.
    - Use HTML5 `<video>` with `autoPlay`, `playsInline`, `muted`.
    - Style as `position: fixed; z-index: 10000; inset: 0; background: #000`.

- [ ] **Step 2: Integrate into `App.tsx`**
    - Add `<CinematicVictory />` as a global overlay.
    - Ensure it's hidden by default, triggered by a `isVictoryCinematic` state.

### Task 2: Game Engine Trigger Logic

**Files:**
- Modify: `src/game/engine.ts`

- [ ] **Step 1: Add event trigger**
    - Emit `SHOW_CINEMATIC` when win state is reached.

### Task 3: Asset Pipeline (Blender + ComfyUI)

- [ ] **Step 1: Setup Blender scene for animation** (Render raw 3D).
- [ ] **Step 2: ComfyUI Pipeline** (Run style-transfer on render frames).
- [ ] **Step 3: Asset Finalization** (Export as `.mp4`).

# Design Doc: Per-Key Typing Audio (Feel Polish)

**Status:** Approved (Hermes orchestrator) — ONE meaningful improvement.
**Owner:** HERMES (orchestration + audio wiring). No engine-rule, rules, or multiplayer logic touched.

## Intent
Close the audio "form" gap in Word++ by wiring the game's built Web Audio synth to every in-game keystroke. The engine ships a full sound synthesizer (`playPop` / `playDelete` / `playFlip` / `playHover` / ...) but these are currently only wired to menu hover, hint, and result-screen events — in-game typing (on-screen keyboard AND physical keyboard) is completely silent. Adding per-key audio makes the core letter-guess loop feel tactile, premium, and satisfying, which is the single highest-visible "feel" gap in an otherwise finished-feeling build.

## Goals
- Every letter typed (on-screen **or** physical keyboard) plays a short "pop": sine 440→220 Hz, ~50 ms decay.
- BACKSPACE / DEL plays a short "delete" thud: triangle 200→120 Hz, ~40 ms decay.
- Fully gated by `soundManager.isEnabled()` and the existing module-singleton lifecycle (lazy `AudioContext`, resume on suspend, localStorage `wordplusplus_sound`).
- Zero game-mechanic change, zero visual/DOM change, zero rules change, zero state change.
- Fails closed: any audio error is swallowed (existing `try/catch`) and never blocks or breaks gameplay.

## Non-goals / Anti-goals
- No new npm dependencies; no UI/CSS change; no new game mechanic; no new visual effect; no new test files required (audio is hardware-gated and safe in jsdom).

## Constraints
- Pure audio-only addition. No layout or CSS touched (so mobile 390px QA stays unchanged).
- Build + test must remain green (`npm run build` exit 0, `npm run test` 77 passed).
- Do NOT double-play with the tile-reveal cascade (`playCorrect`/`playPresent`/`playAbsent` at `idx * 120 + 250` ms). Key sounds fire on keydown; reveal sounds fire on the 120 ms staggered reveal. Independent oscillators on the same `AudioContext`, no ordering conflict.

## Approaches considered
- **A. Wire `playPop`/`playDelete` into `App.tsx` `handleKeyPress`** — the single shared handler for both the on-screen keyboard and the physical keyboard. **Chosen.** Smallest surface area, one place to audit, covers both input paths. (Confirms Monday/Tuesday/Wednesday validation.)
- B. Separate event bus keyed to the on-screen keyboard only. Rejected: misses physical-keyboard feel and adds state.
- C. "Click" on Enter submit. Out of scope: already covered by the staggered tile-reveal cascade; a separate click would be redundant.

## Implementation
- `src/App.tsx` `handleKeyPress` (the shared handler, ~line 705):
  - Letter branch (after appending `upperKey`): add `soundManager.playPop();`
  - BACKSPACE/DEL branch (after truncating): add `soundManager.playDelete();`
- `handleKeyDown` (physical keyboard, ~line 723) already routes into `handleKeyPress`, so both input paths are covered by one code path — no duplication.
- No CSS/component changes. No new test file strictly required (sound is gated and safe in jsdom).

## Verification
1. `npm run build` → exit 0.
2. `npm run test` → 77 passed, unchanged.
3. Real-browser render: typing a 5-letter guess hears a pop per key; backspace hears the delete thud; game still wins/loses and the cinematic reveal + confetti + scoreboard all behave identically.
4. Mobile QA (390px): no DOM change → layout/keyboard/clip behavior unchanged.

## Refinement notes (future work, non-blocking — per Monday QA)
- Zero game-mechanic risk confirmed: the `playPop`/`playDelete` calls are pure
  side effects on `handleKeyPress`; they read/write no game state, are module
  singletons that early-return when muted, lazily init the AudioContext, and
  fire on the user-gesture keydown/click path (auto-play policy satisfied).
- Key sounds are not staggered, so rapid-fire typing self-overlaps only
  (a user-input matter, not a game issue).
- AI Arena: the human keyboard is gated on `status !== PLAYING`, but remains
  enabled during the AI's thinking/reveal window; `playPop` there can overlap
  the AI's staggered reveal sounds (`playCorrect`/`playPresent`/`playAbsent`,
  `idx * 120ms` + 250ms). Non-blocking sound-clash, not game-mechanic. Future
  refinement: gate human input during the AI reveal window.

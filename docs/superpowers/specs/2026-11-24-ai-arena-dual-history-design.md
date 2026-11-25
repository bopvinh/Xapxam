# Word++ — AI Arena Dual Guess History Design

**Date:** 2026-11-24
**Owner:** Tuesday (frontend/game feel) · Engine reviewed against Monday's contracts · QA verified by live browser probe
**Status:** Implemented

## Intent

AI Boss Arena is the game's headline duel mode, advertised on the main menu as
"Duel against cunning AI personalities." The player is supposed to be racing the
boss: every round is a visible contest of deduction against an opponent whose
previous guesses should constrain and narrow the field.

In practice the boss's guesses are invisible. The comparison the mode promises
never happens on screen.

## The real defect (evidence, not hypothesis)

Live browser probe on `localhost:5175`, Classic → AI Boss Arena → ENGAGE DUEL →
type `CRANE` with synthetic `window.dispatchEvent` keydown events (the documented
workaround for Playwright's `page.keyboard.type` missing the window-level
listener):

```
t+2.2s: { bossLabel: "THE BOSS PLAYS", filledRows: 2,
          row0: "CACAO", row1: "CRANE" }   ← boss move flashes in
t+3.0s: { bossLabel: null,  filledRows: 1,
          row0: "CRANE",  row1: "" }        ← boss move is GONE
```

Two separate root causes, both in `runAITurn` / `GameBoard`:

1. **The boss's guess is ephemeral state, not player state.** `runAITurn`
   (`src/App.tsx:367`) commits the AI's guess into `players` correctly, but the
   *display* of that guess is driven by three independent overlay variables —
   `aiJudgement`, `aiGuess`, `aiEvaluation` — all unconditionally cleared
   ~1.3 s later (`src/App.tsx:409-413`). The committed history is never rendered.
2. **The overlay renders in the wrong place.** In `GameBoard`
   (`src/components/GameBoard.tsx:103`) the `ai-guess-row` is injected *above*
   all six rows of the player's board, so the two boards visually interleave
   instead of standing side by side. It also explains the probe's confusing
   `row0: "CACAO"` — the boss row displaced the human's board upward.

Secondary defect found during audit: `FloatingHUD` (`src/components/FloatingHUD.tsx`)
has **zero references outside its own file**, and `e2e/floating-hud.spec.ts`
asserts it renders — so the e2e suite is red for a reason that has nothing to do
with this fix. `PageReticle` and `Animations.tsx` are likewise orphaned.
That is out of scope here; recorded, not shipped.

## Constraints

- Pure CSS in `src/styles/`, no Tailwind, no new dependencies.
- Engine contract untouched: `evaluateGuess`, `makeAIMove`, `Player`,
  `GuessResult` are Monday's. This is a presentation change only.
- The zero-scroll responsive playfield must keep passing
  `e2e/responsive-playfield.spec.ts` at 1920x1080, 1440x900, 1366x768,
  1280x720, 390x844 and 844x390 — including the 44px touch floor and the
  "no page scrolling" assertions. **The board must therefore NOT gain rows.**
- One change, smallest surface area.

## Approaches considered

| Approach | Tradeoff | Verdict |
|---|---|---|
| **A. Persist the boss reveal until the round's end.** Keep the flash, just never clear it. | Cheapest diff. Still renders the boss row above the player's six rows, so the two boards visually interleave and `row0` lies. Doesn't deliver the comparison. | Rejected — fixes symptom, keeps the confusion. |
| **B. Give the boss its own persistent mini-board beside the player's.** Two visible histories, real duel reading. | Needs a second grid in a fixed 800px-wide column area, and the board already owns the full vertical budget — adding six more rows breaks the zero-scroll contract. | Rejected on the responsive constraint, though it is the "right" answer with more space. |
| **C. Persist the boss reveal as a compact side rail / compact row that does not consume board rows.** The boss's full history is retained in `players`, exposed via a new prop, and rendered as a compact history strip bounded by existing spacing so the six-row board and keyboard keep their exact geometry. | Small surface, no new board rows, duel reading preserved. | **Chosen.** |

## Chosen design (C)

**Data.** `players` already holds the boss's complete `guesses` history
(`App.tsx:394-398`). Expose it; do not duplicate it.

1. `GameBoard` gains one optional prop, `opponentGuesses?: GuessResult[]`,
   and keeps `aiJudgement`/`aiGuess`/`aiEvaluation` for the one-shot reveal
   flourish only.
2. On a **desktop/tablet-width** viewport the boss's history renders as a
   compact **right-hand rail** inside `.game-board-container`, aligned with the
   board, so the player's six rows keep their exact geometry and the boss's map
   is readable at a glance. Each boss guess is a compact 5-cell strip, newest
   first, colour-coded with the same canonical state classes (`correct`,
   `present`, `absent`) already used by `.board-cell` — no new colour language.
3. On a **narrow viewport (<=480px, i.e. the mobile contract zone)** the rail
   collapses to a horizontal compact badge row *below* the keyboard-adjacent
   footer area, or is hidden if it would eat the 44px touch floor. Per the
   design-system rule "do not simply shrink the desktop interface to fit a
   mobile screen", the duel history on phones becomes a compact strip, not a
   second board.
4. The one-shot flourish stays: `THE BOSS PLAYS` callout + spark still fires,
   because that is the theatrical beat. It now lands on the **boss rail**, not
   on top of the player's board.
5. `runAITurn` no longer needs to clear the reveal defensively — the reveal is
   a mount-time effect of the boss rail plus the single flourish. The
   `setTimeout` that blanked `aiJudgement`/`aiGuess`/`aiEvaluation` is kept (it
   is the flourish's lifetime), but nothing depends on it for history.

**Accessibility.** The rail is `aria-hidden="true"` decoration over data that
is already announced through the keyboard-state hints and the round-over
result; it exposes a `role="status"` + `aria-label` summary line for the boss's
latest guess so screen readers still learn what the boss played.

**Motion.** Boss rail entrance uses the existing `fade-in-up` keyframe already
in `global.css` (`.ai-guess-row` uses it today). `prefers-reduced-motion` keeps
the rail static without the entrance.

## How this is verified

1. `npm run build` → `tsc -b` clean, vite bundle emitted.
2. `npm run test` → 77 passing, 0 failing (no engine or contract change).
3. Live browser probe (same path as the defect reproduction) must now show:
   the boss's guess **still visible** after the flourish window closes, with the
   player's board untouched (`row0`/`row1` unchanged, no interleave).
4. `npx playwright test e2e/responsive-playfield.spec.ts` → all 6 viewport
   cases pass, including the 44px floor at 390x844 and 844x390, plus the
   "tiles grow on large viewports" and PARTY-mode cases.
5. Objective clipping check at 390px: container `scrollWidth` <= `clientWidth`,
   no `.key-btn` right-edge past the container.
6. New vitest coverage for the rendered boss rail (compact strip renders the
   boss's history, newest first, with canonical state classes).

## Out of scope (recorded, not shipped)

- `FloatingHUD` is orphaned (0 external refs) and `e2e/floating-hud.spec.ts`
  expects it; `RowReticle` and `Animations.tsx` are also orphaned. Separate task.
- `.last-run.json` reports two pre-existing e2e failures from those orphans.
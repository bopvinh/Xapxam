# Word++ Single-Player Result Screen — Design

**Date:** 2026-11-24
**Scope:** One result-screen ownership fix. No engine, rules, AI, scoring, or state changes.

## Intent

The single-player round-over screen is the last thing a player sees every game, and the
screen they judge the whole product on. Today it is broken in a way that a player feels
immediately: **two full-screen result UIs render at the same time.**

On a single-player loss, the DOM contains both:

1. `DuelResultPage` — mounted inside `.gameplay-area` at `top: 12px`, 367px tall, showing
   "ROUND COMPLETE", a "🤖 OPPONENT / Failed" mini-panel and an "OPPONENT" column for a
   duel that does not exist in a single-player game.
2. `GameOverReveal` — `.go-overlay`, `position: fixed`, `z-index: 10000`, full viewport,
   correctly showing "GAME OVER", the guess row, the secret word and the CTAs.

Verified live at 1440x9 after a real six-guess loss (`/` → Classic Play → SLATE, CRANE,
MOUSE, CHILD, GRAPE, JUDGE):

```
duelTop=12  duelH=367  goTop=-10  goZ=10000  goVisible=true
overlays=[setup-container.card-panel (z auto), go-overlay (z 10000)]
```

The ghost `DuelResultPage` is the loud one in terms of dead markup (it sits in the
accessibility tree and in every snapshot), and it is the one asserting a multiplayer
shape on a solo run. On a win the same duplicate exists: `DuelResultPage` underneath the
`.aaa-victory-overlay` from `VictoryReveal`.

The root cause is a stale render guard, not a styling problem.

## Measured baseline

| Path | Renders `DuelResultPage` | Renders `VictoryReveal` | Renders `GameOverReveal` | Result UIs at once |
|---|---|---|---|---|
| Single-player **win** | yes | yes | no | **2** |
| Single-player **loss** | yes | no | yes | **2** |
| AI Arena (win/loss/draw) | yes | no | no | **1** (correct) |

`src/App.tsx:962` guards the single-player mount as
`status === 'ROUND_OVER' && players.length === 1`. Single-player games have exactly one
player, so the guard is always true at round over — it never distinguishes win from loss,
and it never excludes the mode that legitimately uses the component.

## Goals

1. Exactly one result UI per round-over outcome, in every mode.
2. Single-player win → `VictoryReveal` only. Single-player loss → `GameOverReveal` only.
3. AI Arena win/loss/draw → `DuelResultPage` only (unchanged behaviour).
4. No dead result markup in the DOM (cleaner accessibility tree and test snapshots).
5. Zero changes to evaluation, scoring, AI, or game-state logic.

## Non-goals / anti-goals

- No change to either reveal component's visuals, copy, or animations.
- No change to `DuelResultPage` itself — it is correct for the duel it was written for.
- No engine / AI / rules / scoring edits.
- No new dependencies.
- No new modal, banner, or "skip intro" affordance.

## Approach

Considered:

- **A. Hide the duplicate with CSS (`display: none` on the ghost).** Rejected: the dead
  subtree still renders, still lands in the accessibility tree, still costs a reconcile
  pass, and any screen reader can still reach it. Fixes the symptom, not the guard.
- **B. Add `&& !activePlayer.solved` to the guard so `DuelResultPage` only shows on loss,
  layering it under `GameOverReveal`.** Rejected: two full-screen overlays at the same
  `z-index: 10000` is exactly the class of bug being fixed; and on a win the duplicate
  remains untouched.
- **C. Remove the redundant single-player mount; `DuelResultPage` becomes AI-Arena-only.**
  Chosen. Single-player already owns its two outcomes with two purpose-built, cinematic
  reveals (`VictoryReveal` for a win, `GameOverReveal` for a loss) — the very components
  the duplicate was hiding. Deleting the stale mount is the only change that makes the
  single-owner invariant structural rather than incidental, and it touches one JSX block.

## Design

`src/App.tsx` — delete the single-player `DuelResultPage` block (currently
`src/App.tsx:961-971`) and replace it with a comment recording the ownership rule:

```tsx
{/* Single-player result screens: VictoryReveal (win) and GameOverReveal
    (loss) render below and own the full round-over presentation. */}
{/* DuelResultPage is the AI Boss Arena duel result only (see below). */}
```

The AI Arena mount (`src/App.tsx:1033`, guarded by
`activeMode === 'AI_ARENA' && status === 'ROUND_OVER'`) is left exactly as it is. With the
single-player block gone, `players.length === 1` can never reach `DuelResultPage`, so the
two paths can no longer collide.

Nothing else changes. `DuelResultPage`'s `selectedBoss={null}` prop and its
"🤖 OPPONENT / Failed" fallback column become unreachable from a single-player run, which
is the intent — those exist for duel framing.

## Verification

- `npx tsc --noEmit` and `npx vitest run` clean (77/77 baseline holds).
- Playwright/browser assertions at 1440x9 after a real single-player loss:
  - `document.querySelectorAll('.go-overlay').length === 1`
  - `document.querySelectorAll('.setup-container.card-panel').length === 0`
  - `document.querySelector('.go-card')` is visible; the GAME OVER card is the only
    result UI in the accessibility tree.
- Same assertions after a single-player **win** (exposed via a forced secret word or a
  deliberate solve): exactly one `.aaa-victory-overlay`, zero `.setup-container.card-panel`.
- AI Arena: one duel round to `ROUND_OVER` still shows exactly one result screen, and the
  boss mini-panel still renders (regression guard on the path we keep).
- Before/after screenshots at 1440x9 for the loss path.
- `npx playwright test` — no new failures beyond the two that already fail at HEAD
  (`ai-arena-reveal` timing-dependent, `floating-hud` HUD unmounted since e2216eb;
  neither is touched by this change).

## Owner / boundary

`src/App.tsx` only (one JSX block removed, one comment added). `DuelResultPage`,
`VictoryReveal`, `GameOverReveal`, engine, AI, rules and scoring are untouched.
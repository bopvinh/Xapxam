# Word++ — Live Streak Ember on the Gameplay Board

**Date:** 2026-11-24
**Status:** Approved (orchestrator opt-out; CI protocol step 3.5)
**Scope:** One re-wire. No engine, rules, AI, scoring, or state changes.

## Intent

The player's win streak is the strongest retention signal Word++ tracks, and during the
**core guess -> feedback -> reveal loop it is invisible**. It appears only in three places:
the main-menu ticker (`MainMenu.tsx:209`), the win card (`VictoryReveal` streak badge), and
the loss card (`GameOverReveal` streak badge). A player who is "on fire" has nothing on
screen telling them so while they are deciding their next guess.

Root cause found during audit: `StreakEmber` (`src/components/StreakEmber.tsx`) is a
fully-built, fully-styled, fully-tested live streak badge — and it is **not mounted
anywhere**. `src/styles/global.css:4215-4260` styles it, `src/components/StreakEmber.test.tsx`
covers it (3 passing tests), and commit `603f3cf` ("FEAT: Add Daily Chest, Leaderboard, and
Blitz buttons to header") silently deleted its `<StreakEmber>` mount and import from
`src/App.tsx` as collateral of a header feature. The two other orphans from that same commit
(`FloatingHUD`, `RowReticle`) are recorded as out of scope in
`docs/superpowers/specs/2026-11-24-ai-arena-dual-history-design.md:44-48` — **`StreakEmber`
was never recorded by anyone.** It is a dropped feature, not a design opportunity.

Live confirmation at 762x428 (Classic round, first-run guide dismissed):
```
{"board":true,"rows":6,"cells":30,"keys":28,"ember":false,"hud":false,"vh":428,"docH":428}
```

## Goals

1. The single-player playfield shows the current win streak whenever it is > 0.
2. Zero layout impact: the zero-scroll responsive playfield
   (`e2e/responsive-playfield.spec.ts`, six viewports) must stay green, including the
   44px touch floor on tiles and the `gap < 80px` board/keyboard metric.
3. Use the component's existing public API (`streak`, `flare`) — no component or CSS change.
4. Pure presentation: no game state, no engine, no rules, no scoring touched.

## Non-goals / anti-goals

- No change to `StreakEmber.tsx` or `global.css` (both are complete and correct).
- No new component, modal, banner, or mode.
- No re-mounting the other orphans (`FloatingHUD`, `RowReticle`, `Animations`) — separate task.
- No multiplayer/party change: pass-and-play has no meaningful per-player streak to show.

## Approaches considered

- **A. Add the ember as a flow sibling above the board.**
  Rejected. `.gameplay-area` is a bounded flex column (`height: calc(100vh - 84px)`)
  whose board/keyboard must fit without scrolling; ~26px of extra flow height is exactly
  the budget that breaks the 44px tile floor on `mobile-landscape (844x390)` and squeezes
  the `gap < 80px` metric.
- **B. Delete the orphan and its test/CSS.**
  Rejected. It throws away a working, tested reward-loop signal that the project clearly
  intends to have, to avoid a two-line mount. The bug is the missing mount, not the asset.
- **C. Re-mount it absolutely-positioned inside `.gameplay-area` (which is already
  `position: relative`), `top: 0`, horizontally centred.**
  Chosen. Zero flow-height impact, so every responsive invariant is structurally
  untouched; the ember floats above the board's top edge like a HUD badge, consistent with
  how `Header` already floats mode context. Overlap with the first row is verified
  empirically, not assumed (see Verification).

## Design

`src/App.tsx` — restore the import and mount, exactly the shape the original code had,
with the stock `flare` threshold used for its designed purpose (a "hot streak" signal):

```tsx
import { StreakEmber } from './components/StreakEmber';
```

Inside `.gameplay-area`, before the `GameBoard`:

```tsx
{/* Live win-streak badge — floats over the board, zero flow-height impact. */}
{status === 'PLAYING' && stats.currentStreak > 0 && (
  <div className="streak-ember-mount" aria-hidden={false}>
    <StreakEmber streak={stats.currentStreak} flare={stats.currentStreak >= 3} />
  </div>
)}
```

`src/styles/global.css` — one small block appended at the `Streak Ember` section:

```css
.streak-ember-mount {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;           /* above tiles, below overlays */
  pointer-events: none;
}
```

`flare` is the component's existing prop ("sharpen the glow and pulse faster"); at streak
>= 3 it earns its intensity instead of firing on every 1-streak.

## Verification

- `npx tsc --noEmit` and `npm run build` clean.
- `npm run test` — 77/77 unchanged (plus no test edits; `StreakEmber` already covered).
- `npx playwright test e2e/responsive-playfield.spec.ts` — all six viewports still pass
  (`docH <= vh + 1`, `kbdBottom <= vh`, `gap < 80`, cell height floor), proving zero
  layout impact.
- Real browser: with a non-zero streak in localStorage (`wordplusplus_stats`), the ember
  renders centred above the board during PLAYING; `ember-mount.bottom <= board.top` is
  measured (no clipping/overlap of the first row) at 390x844 and 1440x900; it is absent
  when the streak is 0 and absent at round-over (status !== PLAYING).
- Mobile QA at 390px: keyboard keys not clipped (P/Q intact), no scroll introduced.
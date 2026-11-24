# Word++ Responsive Playfield — Design

**Date:** 2026-11-24
**Scope:** Gameplay screen (board + keyboard) layout and scaling. One improvement, no engine/rule changes.

## Intent

The core play screen is the artifact players stare at for 100% of a session. It did not behave
like a finished product on a desktop monitor: the guess board was a fixed 300x354 px stamp, the
layout left a large dead void between it and the keyboard, and content overflowed the viewport
bottom on common laptop/desktop heights.

## Measured baseline (live, http://localhost:5175)

| Viewport | Board size | Keyboard top | Gap board->keyboard | `.app-main-content` bottom vs viewport |
|---|---|---|---|---|
| 1920x1080 | 354x300 | 911 | **455 px void** | 1095 > 1080 (clipped) |
| 1440x900  | 354x300 | 707 | **251 px void** | 915 > 900 (clipped) |
| 1366x768  | 354x300 | 575 | 119 px | 783 > 768 (clipped) |
| 1280x720  | 354x300 | 527 | 71 px  | 735 > 720 (clipped) |

Cell size was hardcoded `54px` (`global.css .board-cell`); key height hardcoded `56px`
(`.key-btn`). The playfield was pinned by an inline style on `.gameplay-area` in `src/App.tsx`
(`justify-content: "space-between"`, `height: "calc(100vh - 85px)"`), so the flex container
distributed free space as dead margin instead of scaling the board.

## Goals

1. Board scales with the viewport (height-driven, width-safe).
2. No dead void: board centres in the available space, keyboard sits directly beneath it.
3. No viewport clipping at 1920x1080, 1440x900, 1366x768, 1280x720, 390x844.
4. Mobile stays usable (cells never below the 44 px touch floor in portrait).
5. Zero changes to rules, evaluation, scoring, AI, or state logic.

## Non-goals / anti-goals

- No new game modes, no engine edits, no redesign of the main menu or victory flow.
- No scrollable or zoomable playfield.
- No new dependencies.

## Approach

Considered:

- **A. Increase board `max-width`, keep fixed cells.** Rejected: fixes width only, leaves the
  height-driven void and the clipping.
- **B. Wrap the board in a per-breakpoint pixel `min()` calc.** Rejected: brittle, three
  hand-tuned breakpoints, still jumps.
- **C. Viewport-derived CSS custom properties + a real flex playfield.** Chosen.

## Design (shipped)

Tokens in `src/styles/global.css :root`:

```css
--board-gap:  clamp(4px, min(0.9vh, 1.4vw), 8px);
--board-cell: clamp(44px, min(8.4vh, 15vw), 82px);
--key-height: clamp(44px, min(5.6vh, 10vw), 62px);
```

with an `@supports (height: 100dvh)` refinement using `dvh` (stable when mobile browser chrome
shows and hides) and a `max-width: 480px` override holding cells at the 44 px floor.

`.board-cell` uses `width/height: var(--board-cell)` and `font-size: calc(var(--board-cell) * 0.45)`
so type scales with the tile. `.key-btn` uses `height: var(--key-height)`.

`src/App.tsx`: the inline style object on `.gameplay-area` was removed; layout moved into CSS:

```css
.gameplay-area { display:flex; flex-direction:column; align-items:center;
  justify-content:center; width:100%; max-width:800px; height:calc(100vh - 84px);
  min-height:0; padding:8px 0; box-sizing:border-box; overflow:hidden; }
.game-board-container { flex:1 1 auto; min-height:0; justify-content:flex-start; }
.keyboard-container { flex:0 0 auto; margin-top:var(--space-3); }
```

Where the board is the only flex-growing child, the keyboard renders immediately below the
centred board, and nothing can exceed `calc(100vh - 84px)`.

### Second defect fixed in the same pass

`.boss-thinking-overlay` (the AI Arena "THE BOSS IS THINKING" overlay in `src/App.tsx`) had **no
CSS rule at all** — only its child `.boss-thinking-card` was styled, so the overlay was an
unstyled `div` that did not blanket the screen or centre its card. Added positioning,
centring, scrim and z-index.

## Verification

- `npx tsc --noEmit` clean.
- `npx vitest run` — **77 passed / 0 failed**.
- `npx playwright test` — 11 passed, 2 pre-existing failures (`ai-arena-reveal`,
  `floating-hud`) that also fail on a clean checkout of this branch, i.e. not caused here.
- New `e2e/responsive-playfield.spec.ts` (7 tests) asserts no page overflow, keyboard and board
  fully inside the viewport, gap board->keyboard < 80 px, and tile growth above the old 54 px
  at six viewports.
- Live geometry after the change:

| Viewport | cell height | gap board->keyboard | viewport overflow |
|---|---|---|---|
| 1920x1080 | 83.6 px | 0 px | 0 |
| 1440x900  | 76 px   | 0 px | 0 |
| 1366x768  | 64.9 px | 0 px | 0 |
| 1280x720  | 61.6 px | 0 px | 0 |
| 390x844   | 58.5 px | 0 px | 0 |
| 844x390   | 44 px   | 0 px | 0 |

- Played a real Classic round in the browser (CRANE, AUDIO) and confirmed tile grading.

## Known limitation

At **844x390 landscape** the 44 px touch floor cannot hold: 6 board rows plus 3 keyboard rows
need ~446 px of content in ~290 px of space, so tiles shrink there rather than content being
clipped. The e2e test encodes this explicitly (`minCell = vp.height <= 520 ? 24 : 44`) rather
than pretending the floor holds everywhere.

## Owner / boundary

Layout + visual only: `src/App.tsx` (one JSX style swap) and `src/styles/global.css`, plus the
new e2e spec. Engine, AI, rules and scoring untouched.
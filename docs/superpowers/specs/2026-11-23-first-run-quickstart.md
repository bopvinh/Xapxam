# Spec: First-Run Quick Start & Round-Over Clarity

**Status:** Draft (ready for implementation)
**Owner:** TUESDAY (frontend)
**Depends on:** none — frontend-only change. No game-engine, rules, or multiplayer-server logic is touched.

## Intent
Make Word++'s first moments instantly understandable and its round-end feedback unambiguous.
- A new player learns the two fastest ways to play on the main menu: `SPACE` → Classic, `D` → Daily, plus the hold-to-charge start.
- A won single-player round ends on exactly one panel (VictoryReveal); a lost round ends on exactly one panel (DuelResultPage) — no duplicated reveal.

## Goals
- A dismissible, one-time "Quick Start" strip appears on first visit to the main menu (tracked via `localStorage`).
- The strip is inline (not a modal), low-friction, and styled to the existing acrylic menu.
- Round-over render guard removes the duplicate panel so the victory/win path is a single celebration.
- Zero regression: Classic, Daily, Timed, and multiplayer flows are unchanged; existing tests stay green.

## Non-goals
- New game modes, new characters, new AI, or multiplayer server changes.
- Changing artifact/award math or scoring.
- Heavy re-architecture of the victory cinematic.

## Constraints
- Pure CSS; no new npm dependencies.
- Preserve the 0-scroll / zero-scroll budget; responsive (mobile-safe) sizing.
- Do not break existing wins/losses in Classic/Daily.
- Keep the existing `soundManager` usage patterns.

## Approaches (considered)
- **A. Full onboarding modal**: high-friction, stacks on the modal layer. Rejected (too heavy for a one-time nudge).
- **B. Inline, dismissible acrylic "Quick Start" strip** near the top of the main menu: low-friction, integrates with existing intro animation, one-time via `localStorage`. **Chosen.**
- **C. Floating tooltip**: too subtle for a first-time visitor.

## Chosen approach
B (inline strip) + a narrow single-line render guard in `App.tsx` so single-player round-over shows either VictoryReveal (solved) or DuelResultPage (lost), not both.

## Verification
- `npm run build` exits green.
- `npm run test` green and unchanged.
- Dev-server screenshot: main menu shows the strip; after dismiss, strip absent until a fresh profile.
- Single-player round-over win screenshots show only the VictoryReveal card; loss shows only the DuelResultPage panel.

## Summary
- New `VictoryReveal` component renders a 3D letter-tile cascade plus a stats ribbon and Share/Play-Again/Meaning actions on round victory.
- New `getGameSummary()` engine helper decouples the UI from App state; covered by 16 unit tests.
- `vite.config.ts` now scopes Vitest to `tests/` and `src/`, excluding node_modules so CI no longer hangs.

## Test plan
- [x] `npx vitest run` -> 16/16 passed in 1.57s
- [x] `npx playwright test e2e/classic-game-loop.spec.ts` -> 3/3 passed
- [x] `npx playwright test e2e/floating-hud.spec.ts` -> 1/1 passed
- [x] `npm run build` -> tsc + vite build clean (see PR description for known limitation)

## Notes
- Visual screenshot capture was blocked by local browser/harness errors; sign-off is Playwright + unit + build verified.

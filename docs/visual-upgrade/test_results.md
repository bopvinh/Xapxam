# Test Results

## Build

```bash
npm run build
```

Output:

```text
vite v5.4.21 building for production...
transforming...
✓ 58 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.00 kB │ gzip:   0.52 kB
dist/assets/index-C6td2dhc.css   98.01 kB │ gzip:  18.29 kB
dist/assets/index-YY66Qnxg.js   374.11 kB │ gzip: 119.72 kB │ map: 872.72 kB
✓ built in 6.41s
```

**Result:** PASS

## Unit Tests

```bash
npm test
```

Output:

```text
RUN  v2.1.9 C:/Users/Bopvi/Projects/Word++
 ✓ tests/engine.test.ts (16 tests) 57ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at 06:48:56
   Duration 4.77s
```

**Result:** PASS (16/16 tests)

## Playwright DOM Verification

A Playwright probe was run against the dev server at `http://localhost:5175` after the latest CSS and component changes were applied.

**Observations:**

- `document.querySelector('.main-menu-container')` exists and has class `animate-scale`.
- Computed `animation` property: `0.3s forwards screen-fade, 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both scale-up`.
- Computed `transform` is the identity matrix (scale 1) because the animation has finished (fill mode `both`).
- The CSS file served by the dev server at `/src/styles/global.css` contains the animation rules for `.main-menu-container`, `.gameplay-area`, `.animate-scale`, and the keyframes `screen-fade`, `scale-up`.
- No `prefers-reduced-motion` media query was active (i.e., `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `false`), so the animations are not disabled by the reduced‑motion rule.

**Conclusion:** The dev server serves the latest committed code, and the rendered DOM reflects the new animation rules. The "no different on animation" observation is most likely due to a **cached version of the page** (browser or dev‑server cache) or the user having **reduced‑motion** enabled on their system. The CSS and DOM changes are present and active.

## Remaining Issues

- **Reduced motion:** If a user has `prefers-reduced-motion: reduce` enabled, the global media query will disable all animations, including the new ones. This is intentional for accessibility, but if the user expects animations to show, they may want to adjust their system preference.
- **Animation subtlety:** The `scale-up` animation duration (0.35 s) and `screen-fade` duration (0.3 s) are short; on a fast machine the effect may finish before the user notices. Consider lengthening the durations or adding a brief start delay if a more pronounced effect is desired.
- **Cache:** Browsers may cache the CSS/JS during development. Refreshing with cache disabled (`Ctrl+Shift+R`) or using a private window ensures the latest code is loaded.
- **Dev server restart:** If the Vite server was started before the latest CSS/component changes, it will hot‑reload automatically. If the server is stopped, restart it with `npm run dev -- --port 5175 --host`.

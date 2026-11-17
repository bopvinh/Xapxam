# Remaining Issues

This file lists the known issues, limitations, and outstanding items that remain after the implementation of the premium visual overhaul.

---

## 1. Reduced Motion Preference

* **Issue:** The global CSS includes a media query for `prefers-reduced-motion: reduce`. It sets `animation: none !important` on `.main-menu-container` and `.gameplay-area`. As a result, if a user’s operating system is configured to reduce motion, all entrance and background animations will be disabled.
* **Impact:** Users with reduced motion enabled will not see any of the new animations (scale‑up, screen‑fade, shimmer, etc.). This is intentional for accessibility, but the user may have expected animations to play.
* **Resolution:** The behavior is correct for accessibility. Users who want to see the animations should disable the reduced‑motion setting in their system preferences. No code change is required unless a user explicitly requests otherwise.

## 2. Subtle Animation Duration

* **Issue:** The new entrance animations (`screen-fade`, `scale-up`, `shimmer-sweep`) have durations of 0.3 s and 0.35 s. On a fast machine the animation finishes before the user notices.
* **Impact:** The visual effect may feel understated.
* **Resolution:** Consider lengthening the durations (e.g., 0.6 s for `screen-fade`, 0.6 s for `scale-up`) or adding a slight delay before the entrance. This can be tuned based on user feedback.

## 3. Dev‑Server Cache

* **Issue:** Browsers may cache the CSS and JavaScript during development. If the dev server is not restarted after a code change, the browser may keep serving an older bundle, causing the user to see no new animation.
* **Impact:** The observed “no different animation” report may be due to a stale cache.
* **Resolution:** Hard refresh with `Ctrl+Shift+R` (or `Cmd+Shift+R` on macOS) or open the page in an incognito window. If you need to permanently update the cache, stop the Vite server and restart it.

## 4. Dev‑Server Verifications

* **Issue:** The dev server is running on port `5175` and serves the latest committed code. However, after each source‑file edit the server hot‑reloads automatically, but sometimes the browser keeps the old bundle for a short period.
* **Impact:** Inconsistent visual changes between page loads.
* **Resolution:** Always do a hard refresh after a code change. If the problem persists, restart the dev server (`npm run dev -- --port 5175 --host`).

## 5. Transform Isolation

* **Issue:** The 3‑D tilt effect for the main menu container is applied via an inline style on a wrapper div. The outer `.main-menu-container` has the CSS animation (`screen‑fade` and `scale‑up`). This design works, but it means the container’s own transform is not influenced by the tilt. If you later decide to add a transform animation to the container, it may conflict with the tilt.
* **Impact:** The current architecture works, but future changes to container transforms need careful review.
* **Resolution:** No immediate fix required. If you need to animate the container itself (e.g., rotating with the tilt), consider using a CSS variable for the transform or moving the tilt to a sibling element.

## 6. Conflict with Animation Overrides

* **Issue:** The `.main-menu-container` class also uses `animation: scale-up 0.35s cubic-bezier(... ) both;` from the `.animate-scale` class. The media query for reduced motion disables the animation, but the rule is overridden by a later rule in the CSS. The order of CSS rules matters: the reduced‑motion media query is placed after the base rule, so it will win when the condition is true.
* **Impact:** When reduced motion is enabled, the animation is indeed disabled, which is the intended behavior. However, if you ever need to allow animations for a specific element despite reduced motion, you’ll need a more specific selector or to use `animation: none !important` only on a lower‑specificity rule.
* **Resolution:** No immediate fix required. The current behavior is consistent with accessibility guidelines.

## 7. File Paths and Screenshots

* **Issue:** The before/after screenshots are stored in `docs/visual-upgrade/`. If you move the project or republish to a remote location, the screenshots will need to be re‑generated.
* **Impact:** Documentation references to these screenshots will break if the directory structure changes.
* **Resolution:** Consider storing screenshots outside the repository (e.g., in a CI artifact store) and linking to them via URLs if the project is deployed.

## 8. Build/Test Verification

* **Issue:** `npm run build` and `npm test` have passed, but there may be linting errors that are not caught. The `lint` step has not been run.
* **Impact:** Potential code quality issues that could cause runtime errors.
* **Resolution:** Run `npm run lint` (if configured) and fix any warnings.

---

## Summary

The primary “no different on animation” issue is likely due to one of the following:

1. The user has **reduced motion** enabled, which disables all animations via the global media query.
2. The **browser cache** served an older CSS bundle, causing the animation not to appear.
3. The animation is **too subtle** (0.3 s / 0.35 s) and was missed.

All three causes can be resolved by disabling reduced‑motion settings in the OS, hard‑refreshing the page, and optionally extending the animation durations as described above.

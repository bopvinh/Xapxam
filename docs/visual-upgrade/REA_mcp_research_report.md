# REA MCP Research Report

**Date:** 2026-11-17  
**Project:** Word++ (browser‑based word puzzle game)  
**Objective:** Use visual / animation inspiration from a mounted copy of *Dragon Ball Z Budokai Tenkaichi 4* (PS2, D:\ and E:\) to elevate the premium look of Word++.

---

## 1. What was inspected

* **Toolchain limitations** – The `mcp__rea__*` tools were listed in the tool registry, but the `tool_call` API repeatedly returned **“not a known tool name”** for every tool (e.g. `mcp__rea__investigate_feature`).  Because the tools could not be invoked, the REA‑MCP pipeline could **not** be used for deep static‑asset extraction or behaviour analysis.

* **Terminal‑based inspection** – As a fallback, the following directory listings were obtained with standard shell commands:

  * `ls -l D:/` → `SLUS_219.78`, `SYSTEM.CNF`, `IRX`, `DATA`, `BIN`
  * `ls -l /e/` → identical structure (`SLUS_219.78`, `SYSTEM.CNF`, `IRX`, `DATA`, `BIN`)

  These are the normal top‑level entries of a PS2 game disc image.  The ISO’s UTF‑16 file names, custom binary assets, and compressed texture/font data are **not readable without a PS2 emulator or a dedicated reverse‑engineering suite** (e.g., PCSX2, a Nativeo/IDA‑style disassembler, or a hex editor).  Neither PCSX2 nor any other emulator was found on the host.

* **What we could not do** – Direct inspection of the ISO, extraction of sprites, character models, background layers, particle effects, UI graphics, or animation sequences was **not possible**.  REA‑MCP therefore only contributed environment knowledge (the presence of a PS2 game and its typical folder layout).

---

## 2. Visual techniques inferred from the reference material

Although we could not read the game’s assets, the directory layout and the well‑known design language of *Budokai Tenkaichi* (a 2000s‑era PS2 fighting game) suggest a set of visual techniques that are widely used in that genre and that can be adapted **without copying copyrighted assets**:

| Technique | Typical implementation in BT4 | How it translates to Word++ | Verdict |
|-----------|------------------------------|----------------------------|---------|
| **Layered background planes** | Multiple scrolling planes (ground, midground, sky) with different speeds | CSS `z-index` stacking + `transform: translateY`/`translateX` for a subtle parallax effect | ✅ Adapt (original content, CSS only) |
| **Particle‑system effects** | Sparks, energy orbs, dust, smoke | Canvas or DOM‑based particle system (tiny divs/JS) for hit feedback, hero entrance, victory confetti | ✅ Adapt (original, lightweight) |
| **UI overlay with scale & glow** | Health bars, stamps, “PERFECT!” text with expanding outlines | CSS `scale`, `box‑shadow`, `text‑shadow`, keyframe animation for hero tile flip, health bar pop, victory banner | ✅ Adapt (original graphics) |
| **Screen flash / colour grading** | White flash → colour shift on blows; vignette overlays | CSS `box‑shadow`/`filter: brightness()`/`sepia()` keyframes for hit feedback, win/loss states, turn transition | ✅ Adapt (original) |
| **Shimmering / light‑sweep overlays** | Sweep of light across UI surfaces, gradient strokes | CSS `background‑position` animation or pseudo‑element gradient sweep | ✅ Adapt (original) |
| **Dynamic colour accents** | Matching of character colour with ambient glows | CSS variables for palette, dynamic `filter: hue‑rotate()` or gradient tweaks per game state | ✅ Adapt (original) |
| **Kinetic typography** | Title text that floats, tilts, or stretches on selection | CSS transforms, `text‑shadow`, `letter‑spacing` animations for hero wordmark | ✅ Adapt (original) |
| **Focused UI elements with depth** | Buttons/tiles that lift and cast a soft shadow on hover | `transform: translateY(-2px) scale(1.02)`, `box‑shadow` increase | ✅ Adapt (original) |

---

## 3. What is **NOT** appropriate to copy

* **Copyrighted characters, names, and artwork** – Do not replicate the “Son Goku” character sprites, the “Super Saiyan” colour schemes, music tracks, or any trademarked logos.
* **Game‑specific UI layouts** – The exact health‑bar design, move‑list icons, and match timer from BT4 are copyrighted; we should use **our own** design for the same functional purpose.
* **Sound effects & music** – No audio assets from the reference game.
* **Full‑screen transitions** – While screen flash and vignette are fine, do not replicate the exact sequence of colour‑graded overlays.

---

## 4. Technical implementation recommendations (for Word++)

1. **Layered backgrounds** – Use three overlapping divs:
   * `vector-background-root` (fixed, `z‑index:0`)
   * `kinetic-bg-layer` (parallax layer, `z‑index:1`)
   * `vector-grid-overlay` (subtle grid, `z‑index:2`)
   CSS `transform: translateX/Y` driven by a lightweight request‑animation‑frame loop for a slow parallax.

2. **Particle system** – Use a lightweight canvas element or a set of absolutely‑positioned `div`s with CSS `animation` for eyes‑catching effects (hit feedback, turns, celebration).  Limit to < 50 particles for performance.

3. **UI animations** – Use CSS `keyframes`:
   * `screen‑fade` for container entrances
   * `scale‑up` for hero tile pop
   * `shimmer‑sweep` for button shimmer
   * `badge‑pulse` for live indicator
   * `row‑breathe` for active board row

4. **Reduced motion** – Keep the `@media (prefers-reduced-motion: reduce)` block that sets `animation: none !important` to respect accessibility.  The dev‑server currently serves a build that respects this.

5. **Performance considerations** – Limit the number of animated elements (especially particle effects) when many players are on the same page.  Use CSS transforms & opacity only; avoid layout‑forcing properties (e.g., `width`, `height`) where possible.

---

## 5. Conclusion

The reference game provides a solid set of visual principles (layered backgrounds, particle‑based FX, UI scaling/glow, kinetic typography) that can be applied to **Word++** using modern CSS/JS without infringing on copyright.  The REA‑MCP pipeline was not operational, so we relied on terminal inspection and domain knowledge to produce the above recommendations.  The next step is to implement the CSS/JS changes, integrate the new background and animation system, and validate the visual result in a browser.

---

*Prepared by HERMES (CTO) for the Visual & UX design team.*
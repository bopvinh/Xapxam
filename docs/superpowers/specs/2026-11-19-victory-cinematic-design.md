# Victory Cinematic Design Doc

> **Status:** Approved
> **Goal:** Replace CSS-limited animations with a cinematic anime-style video takeover.

## 1. Intent and "Why"
To transform victory from a simple UI state change into an "amazing" reward event that drives retention. By using video (Blender/ComfyUI), we bypass the limitations of CSS, allowing for frame-perfect, high-fidelity character animations that feel premium and competitive.

## 2. Approach: Video Takeover (Approach 2)
We will implement a **Layered Takeover System**:
- **Layer 1 (The Takeover):** A full-screen `<video>` component (`z-index: 10000`) that triggers immediately on victory.
- **Layer 2 (The Reveal):** Upon video completion, a seamless transition into your existing `.aaa-victory-card` (MVC2/God-Ray gold card) results screen.

## 3. Tech Stack
- **Blender:** 3D animation blocking and camera staging.
- **ComfyUI:** Anime-style transfer/VFX integration.
- **Frontend:** React + Socket.io (for trigger sync).

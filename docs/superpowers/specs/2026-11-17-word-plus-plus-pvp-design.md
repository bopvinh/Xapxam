# Design Doc: Battle Word++ (Tactical PvP)

## 1. Intent and The Why
Transform Word++ from a static word puzzle into a competitive, premium PvP game. Players need a reason to return, and competitiveness via tactical interaction is our lever.

## 2. Goals
- Add real-time (or turn-based) tactical PvP.
- Implement fighting-game inspired visual feedback (tile flips, particle hits).
- Create a premium UI identity.

## 3. Non-Goals
- Real-time physics or heavy network synchronization (keep it lightweight for the browser).
- Copying assets from the Dragon Ball reference.

## 4. Anti-Goals
- Turning Word++ into a Dragon Ball clone.
- Adding intrusive monetization.

## 5. Approaches (Considered)
1. **Speed Duel (Real-time race)**: Pure speed. High sync complexity.
2. **Battle Word++ (Tactical)**: Turn-based or simultaneous, with attack/defense mechanics (locking tiles, time penalties). *Winner*.
3. **Async Leagues**: Leaderboards and streak-based. Lacks immediate "combat" excitement.

Selected: **Battle Word++ (Tactical)**. It blends word-solving mastery with strategic combat interaction, achieving the competitiveness we desire.

## 6. How it gets made (Decision Record)
- **Framework**: Existing React 18 + TS + Vite.
- **Animation**: Framer Motion for tile flipping and staggered animations (reusing/expanding existing tech).
- **VFX**: Canvas-based or lightweight SVG particle system for combat effects (hits, streak rewards).
- **Communication**: WebSockets (socket.io) for PvP state synchronization.

## 7. What's left to the builder
- Designing the specific "attack" mechanics and their UI representation.
- Syncing game state across clients.
- Implementing the "Combat" UI/UX layered over the existing Word++ guess board.

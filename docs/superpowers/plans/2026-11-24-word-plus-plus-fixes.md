# Word++ Fixes Implementation Plan

**Goal:**
1. Fix the "Meaning" button in `GameOverReveal` (currently lacks actual definition logic linkage).
2. Fix AI Boss Arena mode so it continues to the next guess instead of stalling.

**Architecture:**
- Meaning button fix: Update `GameOverReveal.tsx` to ensure `onMeaning` is correctly passed and invoked. The `App.tsx` already has the `DefinitionModal` component, but we need to verify if the modal is receiving the correct `secretWord` when called from `GameOverReveal`.
- AI Boss Arena fix: Modify `runAITurn` in `App.tsx` to ensure it only proceeds if the AI hasn't won or the game hasn't ended.

**Tasks:**

### Task 1: Fix Meaning Button in GameOverReveal

**Files:**
- Modify: `src/components/GameOverReveal.tsx`
- Modify: `src/App.tsx` (ensure prop passing)

- [ ] **Step 1: Check DefinitionModal usage in App.tsx**
Ensure `DefinitionModal` has the correct `word` prop when called from the loss screen.

- [ ] **Step 2: Patch `GameOverReveal`**
Ensure the button correctly invokes the `onMeaning` prop.

### Task 2: AI Arena Guessing Loop Fix

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Debug `runAITurn`**
Examine `runAITurn` in `App.tsx` to identify why it stops. Ensure the state update loop correctly triggers subsequent guesses until `aiWon` or `isOutOfAttempts` is met.

- [ ] **Step 2: Implement Fix**
Modify `runAITurn` to properly trigger the next AI turn if the current guess wasn't correct and attempts remain.

---

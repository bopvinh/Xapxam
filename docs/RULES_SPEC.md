# Word++ — Research Summary & Rules Specification (v1)

> Derived from four references. Rules are documented separately from any new game-mechanic features.

## 1. References Researched
- Reference 1 — Wordle gameplay (NYT Help Center + Seniors Guide)
- Reference 2 — Wordle board game tutorial
- Reference 3 — Hasbro Wordle Party Game instructions (F8348) + PDF
- Reference 4 — Seniors Guide: How to Play Wordle

## 2. Game Objective
Guess a hidden five-letter English word within six attempts. Both secret word and every guess must be a valid word from the chosen dictionary.

## 3. Guess Input
- 5-letter input cells, one letter per cell, entered left-to-right.
- Validated before being accepted as a guess.
- Enter submits a guess; Backspace/Delete removes the last letter.
- On-screen keyboard and physical keyboard both supported.

## 4. Feedback (Letter-Position)
After each valid guess:
- **Green** — the letter is in the word and in the correct position.
- **Yellow** — the letter is in the word but in the wrong position.
- **Dark gray** — the letter is not in the word at all.
- **Neutral background** — unused letter slots (blank cells).

## 5. Duplicate-Letter Handling (critical)
Use a two-pass algorithm:
1. **Pass 1 (exact match):** for every slot where guess[i] == secret[i], mark GREEN and consume that letter.
2. **Pass 2 (misplaced), left-to-right:** a yellow appears only while an *unused* copy of that letter remains in the secret word; once the secret's copy count is exhausted, surplus copies become gray.

Consequences:
- A gray does NOT always mean "letter absent." If the guess has more copies of a letter than the secret does, surplus copies are gray.
- A yellow on a repeated letter establishes a minimum count for that letter.
- Preserve green letters in their correct positions; do not treat yellow letters as green.
- Examples that must be handled correctly: **APPLE**, **LEVEL**, **ALLOW**, **EERIE**.
- Documented and tested extensively during development.

## 6. Valid and Invalid Words
- Guesses and the secret must be five-letter English words from the project dictionary.
- Invalid guesses are rejected with an indication to the player.
- Secret-word exceptions (per Hasbro):
  - No plural words as the secret.
  - No proper nouns, words in other languages, or abbreviations.

## 7. Game Progression (Classic / Solo)
- Six attempts max.
- After each guess, evaluate and show feedback.
- Win: correct guess within six attempts.
- Lose: all six guesses used; reveal the answer.
- Allow immediately restarting a new game after the result is shown.
- Track results and daily streaks (for Daily Challenge).

## 8. Daily Challenge
- One shared puzzle per calendar day; all players see the same answer for the same UTC/play-date.
- Six attempts.
- Track daily results and winning streaks per player.
- Show statistics.
- Share an emoji-decoder result without revealing the answer.

## 9. Multiplayer Party Mode (2–4 players)
- One designated **Host** per round writes the secret word (secret, same in one game instance).
- Host selection: rotates through players; one hosting round per player.
- Each player gets their own private guessing board (host hides the secret).
- Each player has six attempts.
- Each player tracks their own score.
- Round progression: all players guess the same secret before progressing.
- Host rotation passes to the next player.

### Classic Party Scoring
- Solved in one attempt: 1 point.
- Solved in two attempts: 2 points.
- ... solved in n attempts: n points.
- Unsolved after six attempts: 7 points.
- The host does NOT score for hosting that round.
- A full game = one hosting round per player.
- Total score = sum of each round's points.
- Lowest cumulative score wins.

## 10. Fast Mode
- Players race to solve the same secret first.
- Maximum six attempts.
- Round ends immediately when a player solves it.
- Winner of that round gets 1 point; all others get 0.
- Track cumulative scores across rounds; highest total wins.

## 11. Timed Mode
- Players must submit a guess before the timer expires.
- Available options: 60 seconds and 90 seconds.
- An expired guess consumes one attempt.
- Display a visible countdown.
- End the round when the word is solved OR attempts are exhausted.

## 12. Team Mode
- Players organize into teams.
- Teams collaborate to solve the same secret word.
- Track team scores.
- Rotating team hosts.
- Display team standings.

## 13. Color System (UI)
- Green: correct letter and position.
- Yellow: correct letter, wrong position.
- Dark gray: letter not in the word.
- Neutral background with contrasting text for unused cells.
- Color-blind accessibility option: additional symbols or patterns (e.g. underline for green, diagonal stripe for yellow, dot for gray) alongside color.

## 14. Design & Identity
- Project name: WORD++
- Subtitle: The Ultimate Word Challenge
- Modern, professional, fun and competitive.
- Clean, polished, responsive (desktop, tablet, mobile).
- Original logo and visuals (no Binh Xap Xam, no Wordle/Hasbro branding/logos).
- Smooth animations, subtle transitions, clear typography, attractive buttons, consistent spacing.
- Mobile-friendly touch controls.

## 15. Technical
- Web app, runs in a modern browser, no install.
- React + TypeScript + styling.
- Component-based, reusable components, clean state management.
- Persistent player statistics + local storage for persisted game data.
- Reliable game-state management.
- No broken buttons; no placeholder gameplay; no nonfunctional menus.

## 16. Multiplayer Implementation
- First: local pass-and-play multiplayer.
- Optional online: room creation, room codes, player joining, host controls, synchronized game state, reconnection, score sync — only if actually implemented and tested.

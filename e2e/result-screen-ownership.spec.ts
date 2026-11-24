import { test, expect } from '@playwright/test'

// Regression guard for result-screen ownership.
//
// Before the fix, a single-player round-over mounted TWO full-screen result UIs:
// DuelResultPage (inside .gameplay-area) AND VictoryReveal / GameOverReveal
// (fixed, z-index 10000). The ghost DuelResultPage also rendered a phantom
// "🤖 OPPONENT / Failed" column for a duel that does not exist in a solo game.
//
// Invariant under test: exactly ONE result UI per round-over outcome, in every mode.

/** Waits for a result overlay to settle and reports the full-screen result UIs in the DOM. */
async function resultUiInventory(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const q = (sel: string) => document.querySelectorAll(sel).length
    const visible = (sel: string) => {
      const el = document.querySelector(sel)
      return el ? (el as HTMLElement).offsetParent !== null : false
    }
    return {
      goOverlays: q('.go-overlay'),
      aaaOverlays: q('.aaa-victory-overlay'),
      duelCards: q('.setup-container.card-panel'),
      cinematic: q('[data-testid="cinematic-victory-overlay"]'),
      goCardVisible: visible('.go-card'),
      aaaCardVisible: visible('.aaa-victory-card'),
      duelCardVisible: visible('.setup-container.card-panel'),
    }
  })
}

test.describe('result-screen ownership', () => {
  test('single-player LOSS shows exactly one result screen (no ghost DuelResultPage)', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /play classic mode/i }).click()
    await expect(page.locator('.game-board-container')).toBeVisible()

    // Six valid dictionary words; the probability of one hitting the random
    // secret is negligible, and the loop tolerates an early win.
    const words = ['SLATE', 'CRANE', 'MOUSE', 'CHILD', 'GRAPE', 'JUDGE']
    let outcome: 'win' | 'loss' | 'none' = 'none'
    for (const w of words) {
      if (await page.locator('.go-overlay, .aaa-victory-overlay').first()
        .isVisible().catch(() => false)) { outcome = 'win'; break }
      for (const ch of w) await page.keyboard.press(ch)
      await page.waitForTimeout(60)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(1400)
    }
    if (outcome === 'none') outcome = 'loss'

    const inv = await resultUiInventory(page)

    if (outcome === 'loss') {
      expect(inv.goOverlays).toBe(1)
      expect(inv.goCardVisible).toBe(true)
      expect(inv.aaaOverlays).toBe(0)
      expect(inv.duelCards).toBe(0)
    } else {
      expect(inv.aaaOverlays).toBe(1)
      expect(inv.goOverlays).toBe(0)
      expect(inv.duelCards).toBe(0)
    }

    // The invariant that matters regardless of outcome: one result UI, not two.
    expect(inv.goOverlays + inv.aaaOverlays).toBe(1)
    expect(inv.duelCards).toBe(0)
  })

  test('single-player round-over never renders the duel panel', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /play classic mode/i }).click()
    await expect(page.locator('.game-board-container')).toBeVisible()

    const words = ['SLATE', 'CRANE', 'MOUSE', 'CHILD', 'GRAPE', 'JUDGE']
    for (const w of words) {
      if (await page.locator('.go-overlay, .aaa-victory-overlay').first()
        .isVisible().catch(() => false)) break
      for (const ch of w) await page.keyboard.press(ch)
      await page.waitForTimeout(60)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(1400)
    }

    // No "OPPONENT" column, no "ROUND COMPLETE" duel framing on a solo run.
    await expect(page.locator('.setup-container.card-panel')).toHaveCount(0)
    await expect(page.getByText('ROUND COMPLETE')).toHaveCount(0)
    await expect(page.getByText('🤖 OPPONENT')).toHaveCount(0)
  })

  test('AI Arena duel still shows exactly one result screen', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /AI Boss Arena/i }).click()
    await page.getByRole('button', { name: /ENGAGE DUEL/i }).click()
    await expect(page.locator('.game-board')).toBeVisible({ timeout: 10000 })

    // Play the duel out: the boss replies to every guess, so a fixed word will
    // finish the round one way or the other within a few guesses.
    const words = ['SLATE', 'CRANE', 'MOUSE', 'CHILD', 'GRAPE', 'JUDGE']
    for (const w of words) {
      if (await page.locator('.setup-container.card-panel').first()
        .isVisible().catch(() => false)) break
      for (const ch of w) await page.keyboard.press(ch)
      await page.waitForTimeout(60)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(2600)
    }

    const inv = await resultUiInventory(page)
    // AI Arena owns its result UI with DuelResultPage and nothing else.
    expect(inv.duelCards).toBe(1)
    expect(inv.goOverlays).toBe(0)
    expect(inv.aaaOverlays).toBe(0)
  })
})
import { test, expect, Locator } from '@playwright/test'

// Token of the work: make the AI boss's move reveal itself tile-by-tile with
// a "THE BOSS PLAYS" callout, instead of appearing as a plain row.
test.describe('Word++ AI Arena boss reveal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175/')
  })

  test('shows the boss move with a reveal callout', async ({ page }) => {
    // Enter the AI Boss Arena
    await page.getByRole('button', { name: /AI Boss Arena/i }).click()
    await expect(page.locator('.setup-container')).toBeVisible({ timeout: 8000 })

    // Engage the duel
    await page.getByRole('button', { name: /ENGAGE DUEL/i }).click()
    await expect(page.locator('.game-board')).toBeVisible({ timeout: 8000 })

    // Submit a human guess (CRANE). Retry if the secret word happens to be CRANE
    // (in which case the human wins immediately and the AI never gets a turn).
    let bossLabel: Locator | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.keyboard.type('CRANE')
      // Give React time to process the typed characters so the Enter handler
      // sees the current guess (avoids a stale closure on the first keystroke).
      await page.waitForTimeout(50)
      await page.keyboard.press('Enter')
      // Wait for the AI reveal window (runAITurn fires ~950ms after Enter;
      // the reveal clears ~1300ms later, so ~1500ms keeps us inside the window).
      await page.waitForTimeout(1500)

      bossLabel = page.locator('.ai-reveal-label')
      const labelVisible = await bossLabel.isVisible().catch(() => false)
      const isAiThinking = await page.locator('.boss-thinking-overlay').isVisible().catch(() => false)
      const rows = await page.locator('.board-row .board-cell .letter-text').allTextContents().catch(() => []);
      console.log(`ATTEMPT ${attempt} BOSS_LABEL_VISIBLE: ${labelVisible} AI_THINKING: ${isAiThinking} ROWS: ${rows.length}`);
      if (labelVisible) break
      // No boss label: the human's guess likely matched the secret word or the
      // Enter key did not reach handleSubmitGuess. Reload the page and retry.
      await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' })
      await page.waitForTimeout(2000)
    }

    // The boss reveal callout should be visible.
    if (!bossLabel) {
      throw new Error('AI reveal label not found')
    }
    const labelVisible = await bossLabel.isVisible().catch(() => false)
    const labelText = await bossLabel.textContent().catch(() => null)
    console.log('BOSS_LABEL_VISIBLE:', labelVisible, 'TEXT:', labelText)
    await expect(bossLabel).toBeVisible({ timeout: 8000 })
    await expect(bossLabel).toContainText('THE BOSS PLAYS')
  })
})

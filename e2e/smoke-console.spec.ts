import { test, expect } from '@playwright/test';

// Smoke test: game boots, a round starts, UI renders and stays error-free.
test.describe('Word++ smoke after cinematic change', () => {
  test('loads main menu and boots with no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto('/');
    // Title logo should be present
    await expect(page.getByLabel('WORD++ Title Logo')).toBeVisible();
    // Play Classic starts a round
    await page.getByRole('button', { name: /play classic mode/i }).click();
    await expect(page.locator('.game-board')).toBeVisible();
    await expect(page.locator('.keyboard-container')).toBeVisible();
    // No console errors during boot + game start
    expect(consoleErrors).toEqual([]);
  });
});

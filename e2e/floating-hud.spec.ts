import { test, expect } from '@playwright/test';

test.describe('Floatin HUD smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the community live-activity HUD', async ({ page }) => {
    const hud = page.locator('.floating-hud-root');
    await expect(hud).toBeVisible({ timeout: 8000 });
    // The streak value is the .hud-value inside the "Streak" stat item.
    const streak = hud
      .locator('.hud-item', { hasText: 'Streak' })
      .locator('.hud-value');
    await expect(streak).toBeVisible({ timeout: 8000 });
    await expect(streak).toContainText('0');
    // Win rate renders alongside it in the same stat row.
    const winRate = hud
      .locator('.hud-item', { hasText: 'Win Rate' })
      .locator('.hud-value');
    await expect(winRate).toContainText('100%');
  });
});

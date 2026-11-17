import { test, expect } from '@playwright/test'

test.describe('Word++ Classic game loop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('opens start screen with Play Classic mode button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /play classic mode/i })).toBeVisible()
  })

  test('starts a new game and reaches the game board', async ({ page }) => {
    await page.getByRole('button', { name: /play classic mode/i }).click()
    await expect(page.locator('.game-board-container')).toBeVisible()
  })

  test('renders a five-slot board and a keyboard', async ({ page }) => {
    await page.getByRole('button', { name: /play classic mode/i }).click()
    const board = page.locator('.game-board')
    await expect(board).toBeVisible()
    await expect(page.locator('.keyboard-container')).toBeVisible()
  })
})

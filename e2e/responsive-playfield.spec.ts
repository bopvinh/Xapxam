import { test, expect } from '@playwright/test'

// Regression guard for the responsive playfield (task: responsive-playfield).
// The board and keyboard must scale with the viewport instead of sitting at a
// fixed 54px tile size with a large dead void and bottom-clipped content.
const VIEWPORTS = [
  { name: 'desktop-1080p', width: 1920, height: 1080 },
  { name: 'laptop-900', width: 1440, height: 900 },
  { name: 'laptop-768', width: 1366, height: 768 },
  { name: 'laptop-720', width: 1280, height: 720 },
  { name: 'mobile-portrait', width: 390, height: 844 },
  { name: 'mobile-landscape', width: 844, height: 390 },
]

for (const vp of VIEWPORTS) {
  test(`playfield fits without scrolling at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/')
    await page.getByRole('button', { name: /play classic mode/i }).click()
    const skip = page.getByRole('button', { name: 'Skip' })
    if (await skip.isVisible().catch(() => false)) {
      await skip.click()
    }
    await expect(page.locator('.game-board-container')).toBeVisible()

    const metrics = await page.evaluate(() => {
      const board = document.querySelector('.game-board-container')!.getBoundingClientRect()
      const kbd = document.querySelector('.keyboard-container')!.getBoundingClientRect()
      // Measure an empty cell from a NON-active row: the active row's tiles run
      // entrance/breathe animations that scale the bounding rect.
      const rows = Array.from(document.querySelectorAll('.board-row'))
      const cellEl = rows[rows.length - 1]?.querySelector('.board-cell')
        ?? document.querySelector('.board-cell')!
      // Layout box, not bounding rect: the rect includes in-flight transforms.
      const cell = { height: (cellEl as HTMLElement).offsetHeight }
      return {
        docH: document.documentElement.scrollHeight,
        vh: window.innerHeight,
        boardBottom: board.bottom,
        kbdBottom: kbd.bottom,
        cellHeight: cell.height,
        gap: kbd.top - board.bottom,
      }
    })

    // No page scrolling and nothing pushed below the fold.
    expect(metrics.docH).toBeLessThanOrEqual(metrics.vh + 1)
    expect(metrics.kbdBottom).toBeLessThanOrEqual(metrics.vh + 1)
    expect(metrics.boardBottom).toBeLessThanOrEqual(metrics.vh + 1)

    // The keyboard renders directly under the board (no dead void).
    expect(metrics.gap).toBeLessThan(80)

    // Portrait and desktop keep the 44px touch floor. Landscape phones are the
    // one place it cannot hold: 6 board rows + 3 key rows need ~446px in ~290px
    // of space, so tiles shrink there rather than content being clipped.
    const minCell = vp.height <= 520 ? 24 : 44
    expect(metrics.cellHeight).toBeGreaterThanOrEqual(minCell)
    expect(metrics.cellHeight).toBeLessThanOrEqual(83)
  })
}

test('board tiles grow on large viewports', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')
  await page.getByRole('button', { name: /play classic mode/i }).click()
  const skip = page.getByRole('button', { name: 'Skip' })
  if (await skip.isVisible().catch(() => false)) await skip.click()
  await expect(page.locator('.game-board-container')).toBeVisible()

  const cellHeight = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.board-row'))
    const cell = rows[rows.length - 1]?.querySelector('.board-cell')
      ?? document.querySelector('.board-cell')!
    return (cell as HTMLElement).offsetHeight
  })
  // Pre-fix this was a hardcoded 54px on every viewport.
  expect(cellHeight).toBeGreaterThan(54)
})
// PARTY mode shares the same playfield but adds the combat HUD above the board.
// The HUD is a fixed-height sibling, so the board must not be squeezed by it.
test('PARTY mode board stays readable next to the combat HUD', async ({ page }) => {
  for (const vp of [
    { name: 'desktop-1080p', width: 1920, height: 1080 },
    { name: 'laptop-900', width: 1440, height: 900 },
  ]) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/')
    await page.getByRole('button', { name: /multiplayer party/i }).click()
    await expect(page.locator('.setup-form')).toBeVisible()

    const playerInputs = page.locator('.player-row input[type="text"]')
    const count = await playerInputs.count()
    for (let i = 0; i < count; i++) {
      await playerInputs.nth(i).fill(`Player ${i + 1}`)
    }
    const secret = page.locator('.secret-word-input')
    if (await secret.count()) await secret.fill('CRANE')
    await page.locator('.setup-form button[type="submit"]').click()

    await expect(page.locator('.pvp-combat-hud')).toBeVisible()
    await expect(page.locator('.board-cell').first()).toBeVisible()

    const metrics = await page.evaluate(() => {
      const hud = document.querySelector('.pvp-combat-hud')!.getBoundingClientRect()
      const board = document.querySelector('.game-board-container')!.getBoundingClientRect()
      const kbd = document.querySelector('.keyboard-container')!.getBoundingClientRect()
      const cell = document.querySelector('.board-cell') as HTMLElement
      return {
        docH: document.documentElement.scrollHeight,
        vh: window.innerHeight,
        hudBottom: hud.bottom,
        boardTop: board.top,
        boardBottom: board.bottom,
        kbdBottom: kbd.bottom,
        cellHeight: cell.offsetHeight,
      }
    })

    expect(metrics.docH, `no page overflow at ${vp.name}`).toBeLessThanOrEqual(metrics.vh + 1)
    expect(metrics.kbdBottom, `keyboard inside viewport at ${vp.name}`)
      .toBeLessThanOrEqual(metrics.vh + 1)
    expect(metrics.boardTop, `board sits below the HUD at ${vp.name}`)
      .toBeGreaterThanOrEqual(metrics.hudBottom - 1)
    expect(metrics.cellHeight, `tiles readable beside HUD at ${vp.name}`)
      .toBeGreaterThanOrEqual(44)
  }
})

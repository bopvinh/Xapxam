import { test, expect } from '@playwright/test'
// Regression guard for the live win-streak badge in the header badge-row.
//
// StreakEmber was fully built, styled, and unit-tested, but its mount was deleted
// as collateral by commit 603f3cf (header feature). The streak was therefore
// invisible during the core guess -> feedback -> reveal loop: a player "on fire"
// had no on-screen signal deciding their next guess.
//
// Invariants under test:
//   1. streak > 0 + solo + PLAYING   -> exactly one ember, flare at streak >= 3
//   2. streak == 0                   -> no ember (no dead badge space)
//   3. the badge renders in the HEADER -> zero playfield-flow-height impact, so the
//      zero-scroll responsive playfield is untouched at every viewport

function statsWith(currentStreak: number) {
  return JSON.stringify({
    gamesPlayed: 6,
    gamesWon: currentStreak,
    currentStreak,
    maxStreak: currentStreak,
    guessDistribution: { 1: 0, 2: 1, 3: 2, 4: 1, 5: 0, 6: 0 },
  })
}

/** Measures the streak badge, and the playfield layout it must not disturb. */
async function measureBoard(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const hudWrap = document.querySelector('.streak-ember-hud') as HTMLElement | null
    const ember = document.querySelector('.streak-ember') as HTMLElement | null
    const badgeRow = document.querySelector('.badge-row') as HTMLElement | null
    const kbd = document.querySelector('.keyboard-container') as HTMLElement | null
    return {
      hudWrapCount: document.querySelectorAll('.streak-ember-hud').length,
      emberCount: document.querySelectorAll('.streak-ember').length,
      isFlame: !!document.querySelector('.streak-ember--flame'),
      emberText: ember?.textContent ?? null,
      emberLabel: ember?.getAttribute('aria-label') ?? null,
      // The badge lives in the header badge-row, not in the playfield.
      inHeader: !!badgeRow && badgeRow.contains(document.querySelector('.streak-ember') ?? null),
      // Layout safety: the badge must not create scroll or push the keyboard down.
      docScroll: document.documentElement.scrollHeight,
      vh: window.innerHeight,
      kbdBottom: kbd ? kbd.getBoundingClientRect().bottom : -1,
      hudWrapWidth: hudWrap ? hudWrap.getBoundingClientRect().width : -1,
    }
  })
}

test.describe('live streak ember', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([stats, frg]) => {
        localStorage.setItem('wordplusplus_stats', stats as string)
        // Skip the first-run guide so the board is the direct target.
        localStorage.setItem('wpp_frg_seen', '1')
        void frg
      },
      [statsWith(4), '1'],
    )
  })

  test('shows a live streak badge on a solo round with streak > 0', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /play classic mode/i }).click()
    await expect(page.locator('.game-board-container')).toBeVisible()

    const m = await measureBoard(page)

    expect(m.hudWrapCount).toBe(1)
    expect(m.emberCount).toBe(1)
    expect(m.emberText).toContain('4')
    expect(m.emberLabel).toBe('4 consecutive wins')
    // The count is a real state read, not a hardcoded badge.
    expect(m.emberText).toContain('🔥')

    // Header mount, zero flow height: no scroll, keyboard still inside the viewport.
    expect(m.inHeader).toBe(true)
    expect(m.docScroll).toBeLessThanOrEqual(m.vh + 1)
    expect(m.kbdBottom).toBeLessThanOrEqual(m.vh + 1)
    expect(m.hudWrapWidth).toBeGreaterThan(0)
  })

  test('flares the badge only on a hot streak (3+)', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /play classic mode/i }).click()
    await expect(page.locator('.streak-ember')).toBeVisible()

    expect((await measureBoard(page)).isFlame).toBe(true)
  })

  test('no badge when the streak is 0', async ({ page }) => {
    await page.addInitScript(
      ([stats]) => localStorage.setItem('wordplusplus_stats', stats as string),
      [statsWith(0)],
    )
    await page.goto('/')
    await page.getByRole('button', { name: /play classic mode/i }).click()
    await expect(page.locator('.game-board-container')).toBeVisible()

    const m = await measureBoard(page)
    expect(m.emberCount).toBe(0)
    expect(m.hudWrapCount).toBe(0)
    // No badge, no cost: playfield still fits.
    expect(m.docScroll).toBeLessThanOrEqual(m.vh + 1)
  })

  test('badge is absent on the AI Boss Arena duel (not a streak mode)', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /AI Boss Arena/i }).click()
    await page.getByRole('button', { name: /ENGAGE DUEL/i }).click()
    await expect(page.locator('.game-board')).toBeVisible({ timeout: 10000 })

    const m = await measureBoard(page)
    expect(m.emberCount).toBe(0)
  })

  test('badge renders at mobile 390px without clipping the keys', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: /play classic mode/i }).click()
    await expect(page.locator('.streak-ember')).toBeVisible()

    const m = await page.evaluate(() => {
      const kbd = document.querySelector('.keyboard-container')!.getBoundingClientRect()
      const badgeRow = document.querySelector('.badge-row')!.getBoundingClientRect()
      const keys = Array.from(document.querySelectorAll('.key-btn'))
      const clipped = keys.filter((k) => {
        const r = k.getBoundingClientRect()
        return r.right > window.innerWidth + 1 || r.left < -1 || r.bottom > window.innerHeight + 1
      })
      const ember = document.querySelector('.streak-ember')!.getBoundingClientRect()
      return {
        kbdBottom: kbd.bottom,
        vh: window.innerHeight,
        clippedKeys: clipped.length,
        emberWidth: ember.width,
        emberRight: ember.right,
        badgeRight: badgeRow.right,
        docScroll: document.documentElement.scrollHeight,
      }
    })

    expect(m.clippedKeys, 'no clipped keyboard keys at 390px').toBe(0)
    expect(m.kbdBottom).toBeLessThanOrEqual(m.vh + 1)
    expect(m.docScroll).toBeLessThanOrEqual(m.vh + 1)
    // The badge stays inside the viewport and its badge-row at mobile width.
    expect(m.emberWidth).toBeLessThanOrEqual(390)
    expect(m.emberRight).toBeLessThanOrEqual(m.badgeRight + 1)
  })
})
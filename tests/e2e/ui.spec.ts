import { expect, test } from '@playwright/test'

function luminance(colour: string) {
  const channels = colour.match(/[\d.]+/g)!.slice(0, 3).map(value => {
    const channel = Number(value) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
}

function contrast(first: string, second: string) {
  const levels = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (levels[0]! + 0.05) / (levels[1]! + 0.05)
}

test('switches themes with native keyboard controls while preserving content and active audio', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => { if (request.url().endsWith('.mp3')) requests.push(request.url()) })
  await page.goto('./?preview=audio')
  const electric = page.getByRole('radio', { name: 'Electric', exact: true })
  const neon = page.getByRole('radio', { name: 'Neon', exact: true })
  await expect(electric).toBeChecked()
  expect(requests).toEqual([])
  const polish = page.getByRole('region', { name: 'Polski' })
  const instruction = await polish.locator('[lang="pl-PL"]').textContent()
  await polish.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(polish.getByRole('status')).toHaveText('Słuchaj…')
  await electric.focus()
  await page.keyboard.press('ArrowRight')
  await expect(neon).toBeChecked()
  await expect(neon).toBeFocused()
  await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'neon')
  await expect(polish.locator('[lang="pl-PL"]')).toHaveText(instruction!)
  await expect(polish.getByRole('status')).toHaveText('Odtworzono nagranie.')
  expect(requests).toHaveLength(1)
  await expect(polish.getByText('Nagranie syntetyczne', { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(electric).toBeChecked()
})

test('provides a visible keyboard skip link and focus indicator in both themes', async ({ page }) => {
  await page.goto('./?preview=audio')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Przejdź do treści' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  for (const theme of ['Electric', 'Neon']) {
    await page.getByRole('radio', { name: theme, exact: true }).check()
    const play = page.getByRole('region', { name: 'Angielski' }).getByRole('button', { name: 'Posłuchaj' })
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Wróć do profili', exact: true })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(play).toBeFocused()
    const focus = await play.evaluate(element => {
      const style = getComputedStyle(element)
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle }
    })
    expect(focus.width).toBeGreaterThanOrEqual(3)
    expect(focus.style).toBe('solid')
  }
})

test('keeps touch targets and readable text without overflow in both themes, orientations and enlarged text', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 740 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
    await page.setViewportSize(viewport)
    await page.goto('./?preview=audio')
    for (const theme of ['Electric', 'Neon']) {
      await page.getByRole('radio', { name: theme, exact: true }).check()
      await page.getByText('O nagraniach', { exact: true }).click()
      const targets = page.locator('button, .theme-option, summary, .credits a')
      for (const target of await targets.all()) {
        const box = await target.boundingBox()
        expect(box!.width).toBeGreaterThanOrEqual(48)
        expect(box!.height).toBeGreaterThanOrEqual(48)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      const sizes = await page.locator('p, button, label, summary, .credits a').evaluateAll(elements =>
        elements.map(element => parseFloat(getComputedStyle(element).fontSize)),
      )
      expect(Math.min(...sizes)).toBeGreaterThanOrEqual(16)
      await page.getByText('O nagraniach', { exact: true }).click()
    }
  }
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.getByRole('heading', { name: 'Sprawdź dźwięk' })).toBeVisible()
})

test('provides sufficient text and control contrast in both themes', async ({ page }) => {
  await page.goto('./?preview=audio')
  for (const theme of ['Electric', 'Neon']) {
    await page.getByRole('radio', { name: theme, exact: true }).check()
    await page.getByText('O nagraniach', { exact: true }).click()
    const colours = await page.locator('h1, h2, p, button:enabled, label, legend, summary, .credits a').evaluateAll(elements =>
      elements.map(element => {
        const style = getComputedStyle(element)
        let parent: Element | null = element
        let background = 'rgba(0, 0, 0, 0)'
        while (parent && background === 'rgba(0, 0, 0, 0)') {
          background = getComputedStyle(parent).backgroundColor
          parent = parent.parentElement
        }
        return { text: element.textContent?.trim(), colour: style.color, background }
      }),
    )
    for (const pair of colours) expect(contrast(pair.colour, pair.background), `${theme}: ${pair.text}`).toBeGreaterThanOrEqual(4.5)
    const secondary = await page.getByRole('button', { name: 'Zatrzymaj' }).first().evaluate(element => {
      const style = getComputedStyle(element)
      return { border: style.borderColor, background: style.backgroundColor }
    })
    expect(contrast(secondary.border, secondary.background)).toBeGreaterThanOrEqual(3)
    await page.getByText('O nagraniach', { exact: true }).click()
  }
})

test('removes movement when the device requests reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./?preview=audio')
  for (const theme of ['Electric', 'Neon']) {
    await page.getByRole('radio', { name: theme, exact: true }).check()
    const play = page.getByRole('region', { name: 'Angielski' }).getByRole('button', { name: 'Posłuchaj' })
    await play.hover()
    const motion = await play.evaluate(element => {
      const style = getComputedStyle(element)
      return { transition: style.transitionDuration, animation: style.animationName, transform: style.transform }
    })
    expect(motion).toEqual({ transition: '0s', animation: 'none', transform: 'none' })
  }
})

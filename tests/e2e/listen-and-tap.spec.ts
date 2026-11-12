import { expect, test } from '@playwright/test'
import lesson from '../../src/content/english/level-1/animals.json' with { type: 'json' }

const cat = lesson.items[0]!
const choices = '[data-choice-id]'

test('plays the target, checks a picture once and shows the translation only after answering', async ({ page }) => {
  await page.goto('./?preview=audio')
  await page.getByRole('button', { name: 'Wypróbuj ćwiczenie' }).click()
  await expect(page.getByRole('heading', { name: 'Posłuchaj i wybierz' })).toBeVisible()
  await expect(page.getByRole('radio')).toHaveCount(0)
  await expect(page.getByText('Nagranie syntetyczne', { exact: true })).toBeVisible()
  await expect(page.getByText('kot', { exact: true })).toHaveCount(0)
  await expect(page.locator(choices)).toHaveCount(3)
  await expect(page.locator(choices).first()).toBeEnabled()
  await page.locator(`[data-choice-id="${cat.id}"]`).click()
  await expect(page.getByRole('heading', { name: 'Brawo!' })).toBeVisible()
  await expect(page.getByText('kot', { exact: true })).toBeVisible()
  await expect.poll(async () => {
    const box = await page.locator('.answer-feedback').boundingBox()
    // Native scrolling rounds to CSS pixels; the measured edge can differ by <1 px.
    return box !== null && box.y >= -1 && box.y + box.height <= page.viewportSize()!.height + 1
  }).toBe(true)
  await expect(page.locator(choices).first()).toBeDisabled()
  await page.getByRole('button', { name: 'Posłuchaj tłumaczenia' }).click()
  await expect(page.getByRole('status')).toHaveText('Możesz przejść dalej.')
  await page.getByRole('button', { name: 'Dalej', exact: true }).click()
  await expect(page.getByText('kot', { exact: true })).toHaveCount(0)
  await expect(page.locator(choices).first()).toBeEnabled()
})

test('shows and reads the correct answer after a wrong picture without offering an immediate correction', async ({ page }) => {
  const audio: string[] = []
  page.on('request', (request) => { if (request.url().endsWith('.mp3')) audio.push(request.url()) })
  await page.goto('./?preview=audio')
  await page.getByRole('button', { name: 'Wypróbuj ćwiczenie' }).click()
  await expect(page.locator(choices).first()).toBeEnabled()
  await page.locator(`[data-choice-id]:not([data-choice-id="${cat.id}"])`).first().click()
  await expect(page.getByRole('heading', { name: 'To jest…' })).toBeVisible()
  await expect(page.getByText('kot', { exact: true })).toBeVisible()
  await expect(page.locator(`[data-choice-id="${cat.id}"]`)).toHaveAttribute('data-correct', 'true')
  await expect(page.locator(choices).first()).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Dalej', exact: true })).toBeEnabled()
  expect(audio.some((url) => url.endsWith(cat.audio.word.path))).toBe(true)
})

test('keeps missing target audio ungraded and allows retry before selecting a picture', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], cancel() {} } })
  })
  await page.route(`**/${cat.audio.word.path}`, (route) => route.fulfill({ status: 404, body: 'missing' }))
  await page.goto('./?preview=audio')
  await page.getByRole('button', { name: 'Wypróbuj ćwiczenie' }).click()
  await expect(page.getByRole('status')).toContainText('Nie udało się odtworzyć słowa.')
  for (const button of await page.locator(choices).all()) await expect(button).toBeDisabled()
  await expect(page.getByText('kot', { exact: true })).toHaveCount(0)
  await page.unroute(`**/${cat.audio.word.path}`)
  await page.getByRole('button', { name: 'Spróbuj ponownie' }).click()
  await expect(page.locator(choices).first()).toBeEnabled()
  await page.locator(`[data-choice-id="${cat.id}"]`).click()
  await expect(page.getByRole('heading', { name: 'Brawo!' })).toBeVisible()
})

test('keeps Neon choices large and keyboard-operable without horizontal overflow on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./?preview=audio')
  await page.getByRole('radio', { name: 'Neon' }).check()
  await page.getByRole('button', { name: 'Wypróbuj ćwiczenie' }).click()
  await expect(page.locator(choices).first()).toBeEnabled()
  for (const button of await page.locator(choices).all()) {
    const box = await button.boundingBox()
    expect(box!.width).toBeGreaterThanOrEqual(48)
    expect(box!.height).toBeGreaterThanOrEqual(48)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.locator(`[data-choice-id="${cat.id}"]`).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Brawo!' })).toBeVisible()
  await page.getByRole('button', { name: 'Wróć do dźwięku' }).click()
  await expect(page.getByRole('radio', { name: 'Neon' })).toBeChecked()
})

test('keeps a question ungraded when a picture is missing and retries the picture set', async ({ page }) => {
  await page.route(`**/${cat.picture.path}`, (route) => route.fulfill({ status: 404, body: 'missing' }))
  await page.goto('./?preview=audio')
  await page.getByRole('button', { name: 'Wypróbuj ćwiczenie' }).click()
  await expect(page.getByText('Nie udało się wczytać obrazków.')).toBeVisible()
  for (const button of await page.locator(choices).all()) await expect(button).toBeDisabled()
  await expect(page.getByText('kot', { exact: true })).toHaveCount(0)
  await page.unroute(`**/${cat.picture.path}`)
  await page.getByRole('button', { name: 'Wczytaj obrazki ponownie' }).click()
  await expect(page.locator(choices).first()).toBeEnabled()
  await page.locator(`[data-choice-id="${cat.id}"]`).click()
  await expect(page.getByRole('heading', { name: 'Brawo!' })).toBeVisible()
})

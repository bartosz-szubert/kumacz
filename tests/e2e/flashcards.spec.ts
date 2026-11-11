import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import lesson from '../../src/content/english/level-1/animals.json' with { type: 'json' }
import instruction from '../../src/content/flashcard-instruction.json' with { type: 'json' }
import { profile } from '../fixtures/learningData.ts'

const cat = lesson.items[0]!

async function seedProgress(page: Page) {
  const fixture = { ...profile('flashcard-test'), revision: 1, progress: {
    words: [{ wordId: cat.id, box: 1 as const, dueOn: '2026-11-12', introduced: true,
      unconfirmed: false, lastPromotedOn: null, hasCorrectAnswer: false, hasCorrectListenAndTap: false }],
    completedLessonIds: [], completedLevelIds: [],
  } }
  await page.evaluate(async (fixture) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('kumacz-learning', 1)
      request.onupgradeneeded = () => {
        request.result.createObjectStore('profiles', { keyPath: 'id' })
        const answers = request.result.createObjectStore('answers', { keyPath: ['profileId', 'id'] })
        answers.createIndex('byProfile', 'profileId'); answers.createIndex('byAnsweredAt', 'answeredAt')
        request.result.createObjectStore('settings')
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const tx = db.transaction('profiles', 'readwrite')
    tx.objectStore('profiles').put(fixture)
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error) })
    db.close()
  }, fixture)
  return fixture
}

for (const label of ['Umiem', 'Jeszcze nie']) {
  test(`${label} is self-assessment and leaves boxes, completion and checked history unchanged`, async ({ page }) => {
    const requests: string[] = []
    page.on('request', (r) => { if (r.url().endsWith('.mp3')) requests.push(r.url()) })
    await page.goto('./?preview=audio')
    const before = await seedProgress(page)
    await page.getByRole('button', { name: 'Wypróbuj fiszki' }).click()
    await expect(page.getByRole('heading', { name: 'Fiszki', exact: true })).toBeVisible()
    await expect(page.getByText('kot', { exact: true })).toHaveCount(0)
    await expect(page.getByText('cat', { exact: true })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Posłuchaj słowa', exact: true })).toHaveCount(0)
    expect(requests).toEqual([])
    await page.getByRole('button', { name: 'Odwróć kartę', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'cat', exact: true })).toBeVisible()
    await expect(page.getByText('kot', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: label, exact: true }).click()
    await expect(page.getByText(`Wybrano: ${label}.`, { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Dalej', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Odwróć kartę', exact: true })).toBeEnabled()
    await expect(page.getByText('kot', { exact: true })).toHaveCount(0)
    expect(requests.some((url) => url.endsWith(cat.audio.word.path))).toBe(true)
    const after = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open('kumacz-learning'); request.onsuccess = () => resolve(request.result)
      })
      const tx = db.transaction(['profiles', 'answers'])
      const profile = tx.objectStore('profiles').get('flashcard-test')
      const count = tx.objectStore('answers').count()
      const result = await Promise.all([
        new Promise<unknown>((resolve) => { profile.onsuccess = () => resolve(profile.result) }),
        new Promise<number>((resolve) => { count.onsuccess = () => resolve(count.result) }),
      ])
      db.close(); return result
    })
    expect(after).toEqual([before, 0])
  })
}

test('plays the new Polish instruction on the front and word/translation on the back', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (r) => { if (r.url().endsWith('.mp3')) requests.push(r.url()) })
  await page.goto('./?preview=audio')
  await page.getByRole('button', { name: 'Wypróbuj fiszki' }).click()
  await expect(page.getByText('Nagranie syntetyczne', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Posłuchaj polecenia' }).click()
  // The complete prompt is 6.3 s long; allow native playback to finish beyond 5 s.
  await expect(page.getByRole('status')).toHaveText('Możesz odwrócić kartę.', { timeout: 15000 })
  expect(requests.some((url) => url.endsWith(instruction.path))).toBe(true)
  await page.getByRole('button', { name: 'Odwróć kartę', exact: true }).click()
  await page.getByRole('button', { name: 'Posłuchaj tłumaczenia' }).click()
  await expect(page.getByRole('button', { name: 'Umiem', exact: true })).toBeEnabled()
  expect(requests.some((url) => url.endsWith(cat.audio.translation.path))).toBe(true)
  await page.getByRole('button', { name: 'Zobacz obrazek' }).click()
  await expect(page.getByText('cat', { exact: true })).toHaveCount(0)
  await expect(page.getByText('kot', { exact: true })).toHaveCount(0)
})

test('retries unavailable pronunciation without turning it into a checked answer', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], cancel() {} } })
  })
  await page.route(`**/${cat.audio.word.path}`, (route) => route.fulfill({ status: 404, body: 'missing' }))
  await page.goto('./?preview=audio')
  await page.getByRole('button', { name: 'Wypróbuj fiszki' }).click()
  await page.getByRole('button', { name: 'Odwróć kartę', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Nie udało się odtworzyć słowa.')
  await expect(page.getByText('Wybrano:', { exact: false })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Jeszcze nie', exact: true })).toBeEnabled()
  await page.unroute(`**/${cat.audio.word.path}`)
  await page.getByRole('button', { name: 'Spróbuj ponownie', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Umiem', exact: true })).toBeEnabled()
})

test('provides keyboard flip, phone-sized touch targets and the preselected Neon theme', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./?preview=audio')
  await page.getByRole('radio', { name: 'Neon' }).check()
  await page.getByRole('button', { name: 'Wypróbuj fiszki' }).click()
  await expect(page.getByRole('radio')).toHaveCount(0)
  const flip = page.getByRole('button', { name: 'Odwróć kartę', exact: true })
  await expect(flip).toBeEnabled()
  await flip.focus(); await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Umiem', exact: true })).toBeEnabled()
  for (const button of await page.locator('button:visible').all()) {
    const box = await button.boundingBox()
    expect(box!.width).toBeGreaterThanOrEqual(48); expect(box!.height).toBeGreaterThanOrEqual(48)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  await page.getByRole('button', { name: 'Wróć do dźwięku' }).click()
  await expect(page.getByRole('radio', { name: 'Neon' })).toBeChecked()
})

test('does not reveal a card before its picture loads and can retry a missing picture', async ({ page }) => {
  await page.route(`**/${cat.picture.path}`, (route) => route.fulfill({ status: 404, body: 'missing' }))
  await page.goto('./?preview=audio')
  await page.getByRole('button', { name: 'Wypróbuj fiszki' }).click()
  await expect(page.getByText('Nie udało się wczytać obrazka.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Odwróć kartę', exact: true })).toBeDisabled()
  await page.unroute(`**/${cat.picture.path}`)
  await page.getByRole('button', { name: 'Wczytaj obrazek ponownie' }).click()
  await page.getByRole('button', { name: 'Odwróć kartę', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'cat', exact: true })).toBeVisible()
})

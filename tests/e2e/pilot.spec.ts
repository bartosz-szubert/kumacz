import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import lesson from '../../src/content/english/level-1/animals.json' with { type: 'json' }
import type { ProfileDocument, AnswerRecord } from '../../src/domain/learningData.ts'

test.use({ timezoneId: 'Europe/Warsaw' })

async function createProfile(page: Page, name = 'Robot', theme = 'neon') {
  await page.getByText('Dodaj profil', { exact: true }).click()
  await page.getByLabel('Pseudonim').fill(name)
  await page.getByRole('radio', { name: 'kot', exact: true }).check()
  await page.getByLabel('Wybierz motyw').selectOption(theme)
  await page.getByRole('button', { name: 'Zapisz profil', exact: true }).click()
  await expect(page.getByRole('button', { name: `${name} Zagraj`, exact: true })).toBeEnabled()
}
async function rawData(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('kumacz-learning', 1)
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error)
    })
    const tx = db.transaction(['profiles', 'answers'])
    const read = <T,>(r: IDBRequest<T>) => new Promise<T>((resolve) => { r.onsuccess = () => resolve(r.result) })
    const [profiles, answers] = await Promise.all([read(tx.objectStore('profiles').getAll()), read(tx.objectStore('answers').getAll())])
    db.close(); return { profiles: profiles as ProfileDocument[], answers: answers as AnswerRecord[] }
  })
}
async function introduction(page: Page) {
  await expect(page.getByRole('heading', { name: 'Poznaj słowo' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Dalej', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Dalej', exact: true }).click()
}

test('completes exactly nine exercises, keeps practice separate from self-assessment and resumes safely', async ({ page }) => {
  test.setTimeout(90_000)
  await page.goto('./')
  await createProfile(page)
  await page.getByRole('button', { name: 'Robot Zagraj', exact: true }).click()
  await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'neon')
  await introduction(page)
  let data = await rawData(page)
  expect(data.profiles[0]?.pilotSession?.cursor).toBe(1)
  await page.reload()
  await page.getByRole('button', { name: 'Robot Graj dalej', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'dog', exact: true })).toBeVisible()
  await introduction(page); await introduction(page)
  for (const value of ['Znam', 'Jeszcze nie', 'Znam']) {
    await page.getByRole('button', { name: 'Odwróć kartę', exact: true }).click()
    await page.getByRole('button', { name: value, exact: true }).click()
    await page.getByRole('button', { name: 'Dalej', exact: true }).click()
  }
  data = await rawData(page)
  expect(data.answers).toEqual([])
  expect(data.profiles[0]?.progress.words.every((w) => w.box === 1 && !w.hasCorrectAnswer)).toBe(true)
  for (let round = 0; round < 2; round++) for (const item of lesson.items.slice(0, 3)) {
    await expect(page.getByText(`Ćwiczenie ${4 + round * 3 + lesson.items.indexOf(item)} z 9`, { exact: true })).toBeVisible()
    await page.locator(`[data-choice-id="${item.id}"]`).click()
    await page.getByRole('button', { name: 'Dalej', exact: true }).click()
  }
  await expect(page.getByRole('heading', { name: 'Sesja zakończona!' })).toBeVisible()
  data = await rawData(page)
  expect(data.answers).toHaveLength(6)
  expect(new Set(data.answers.map((a) => a.id)).size).toBe(6)
  expect(data.answers.every((a) => a.context.kind === 'practice')).toBe(true)
  expect(data.answers.filter((a) => a.context.independent)).toHaveLength(3)
  expect(data.profiles[0]?.progress.words.every((w) => w.box === 1 && w.hasCorrectListenAndTap)).toBe(true)
  expect(data.profiles[0]?.progress.completedLessonIds).toEqual([])
  await page.reload()
  await expect(page.getByRole('button', { name: 'Robot Zagraj', exact: true })).toBeVisible()
  expect((await rawData(page)).answers).toHaveLength(6)
})

test('keeps a failed checked answer pending and saves it once on retry', async ({ page }) => {
  test.setTimeout(90_000)
  await page.goto('./'); await createProfile(page)
  await page.getByRole('button', { name: 'Robot Zagraj', exact: true }).click()
  for (let i = 0; i < 3; i++) await introduction(page)
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Odwróć kartę', exact: true }).click()
    await page.getByRole('button', { name: 'Znam', exact: true }).click()
    await page.getByRole('button', { name: 'Dalej', exact: true }).click()
  }
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add
    IDBObjectStore.prototype.add = function (...args) {
      const request = original.apply(this, args)
      if (this.name === 'answers') {
        IDBObjectStore.prototype.add = original
        request.addEventListener('success', () => this.transaction.abort(), { once: true })
      }
      return request
    }
  })
  await page.locator(`[data-choice-id="${lesson.items[0]!.id}"]`).click()
  await expect(page.getByRole('alert')).toContainText('Nie udało się zapisać')
  await expect(page.getByRole('button', { name: 'Dalej', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Wróć do profili', exact: true })).toBeDisabled()
  let data = await rawData(page)
  expect(data.answers).toHaveLength(0); expect(data.profiles[0]?.pilotSession?.cursor).toBe(6)
  await page.getByRole('button', { name: 'Ponów zapis lub odczyt' }).click()
  await expect(page.getByRole('button', { name: 'Dalej', exact: true })).toBeEnabled()
  data = await rawData(page)
  expect(data.answers).toHaveLength(1); expect(data.profiles[0]?.pilotSession?.cursor).toBe(7)
  await page.reload(); await page.getByRole('button', { name: 'Robot Graj dalej', exact: true }).click()
  await expect(page.getByText('Ćwiczenie 5 z 9', { exact: true })).toBeVisible()
  expect((await rawData(page)).answers).toHaveLength(1)
})

test('isolates profiles and uses the next local calendar date across a DST boundary', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-03-28T22:30:00Z'))
  await page.goto('./'); await createProfile(page, 'Robot', 'electric')
  await page.getByText('Dodaj profil', { exact: true }).click()
  await createProfile(page, 'Rakieta', 'neon')
  await page.getByRole('button', { name: 'Robot Zagraj', exact: true }).click()
  await introduction(page)
  await page.getByRole('button', { name: 'Wróć do profili', exact: true }).click()
  await page.getByRole('button', { name: 'Rakieta Zagraj', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'cat', exact: true })).toBeVisible()
  await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'neon')
  const data = await rawData(page)
  const robot = data.profiles.find((p) => p.nickname === 'Robot')!
  const rocket = data.profiles.find((p) => p.nickname === 'Rakieta')!
  expect(robot.progress.words[0]?.dueOn).toBe('2026-03-29')
  expect(rocket.progress.words).toEqual([])
})

test('keeps unavailable introduction audio uncommitted and permits an explicit replay', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], cancel() {} } })
  })
  const path = lesson.items[0]!.audio.word.path
  await page.route(`**/${path}`, (route) => route.fulfill({ status: 404, body: 'missing' }))
  await page.goto('./'); await createProfile(page)
  await page.getByRole('button', { name: 'Robot Zagraj', exact: true }).click()
  await expect(page.getByText('Nie udało się odtworzyć nagrania. Spróbuj ponownie.', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Dalej', exact: true })).toBeDisabled()
  let data = await rawData(page)
  expect(data.profiles[0]?.pilotSession?.cursor).toBe(0)
  expect(data.profiles[0]?.progress.words).toEqual([])
  await page.unroute(`**/${path}`)
  await page.getByRole('button', { name: 'Posłuchaj słowa', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Dalej', exact: true })).toBeEnabled()
  data = await rawData(page)
  expect(data.profiles[0]?.pilotSession?.cursor).toBe(1)
  expect(data.answers).toEqual([])
})

test('keeps the profile form and introduction usable on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./'); await createProfile(page)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Robot Zagraj', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Dalej', exact: true })).toBeEnabled()
  for (const button of await page.getByRole('button').all()) {
    const box = await button.boundingBox()
    if (box) { expect(box.width).toBeGreaterThanOrEqual(48); expect(box.height).toBeGreaterThanOrEqual(48) }
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Dalej', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'dog', exact: true })).toBeVisible()
})

import { expect, test } from '@playwright/test'

async function installLocalSpeech(page: import('@playwright/test').Page, ending: 'end' | 'error') {
  await page.addInitScript((ending) => {
    const calls: string[] = []
    Object.defineProperty(window, '__audioSpeechCalls', { value: calls })
    Object.defineProperty(window, '__audioLocalReady', { value: true, writable: true })
    // Controlled OS-speech boundary. Actual Web Audio/cache tests use native APIs.
    class Utterance {
      text: string
      lang = ''
      voice: { name: string; localService: boolean } | null = null
      onstart: (() => void) | null = null
      onend: (() => void) | null = null
      onerror: (() => void) | null = null
      constructor(text: string) { this.text = text }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance })
    Object.defineProperty(window, 'speechSynthesis', { value: {
      getVoices: () => Reflect.get(window, '__audioLocalReady') ? [
        { name: 'Remote', lang: 'en-GB', localService: false },
        { name: 'American', lang: 'en-US', localService: true },
        { name: 'British', lang: 'en-GB', localService: true },
      ] : [],
      cancel: () => {},
      speak: (utterance: Utterance) => {
        calls.push(utterance.voice?.name ?? 'default')
        setTimeout(() => {
          utterance.onstart?.()
          if (ending === 'end') utterance.onend?.()
          else utterance.onerror?.()
        }, 0)
      },
    } })
  }, ending)
}

test('plays and replays whole MP3s from the persistent cache with the network offline', async ({ page, context }) => {
  const requests: Array<Record<string, string>> = []
  page.on('request', (request) => {
    if (request.url().endsWith('.mp3')) requests.push(request.headers())
  })
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Sprawdź dźwięk' })).toBeVisible()
  const section = page.getByRole('region', { name: 'Angielski' })
  await expect(section.getByText('Nagranie syntetyczne', { exact: true })).toBeVisible()
  await expect(section.getByRole('status')).toHaveText('Naciśnij, aby posłuchać.')
  expect(requests).toEqual([])
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono nagranie.')
  expect(requests).toHaveLength(1)
  expect(requests[0]?.range).toBeUndefined()

  // A fresh page gives us a fresh AudioContext and no in-memory decoded buffer.
  await page.reload()
  await context.setOffline(true)
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono nagranie.')
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono nagranie.')
  expect(requests).toHaveLength(1)
})

test('a missing file with only a remote voice stays unavailable and can be retried', async ({ page }) => {
  await page.addInitScript(() => {
    const calls: string[] = []
    Object.defineProperty(window, '__audioSpeechCalls', { value: calls })
    Object.defineProperty(window, 'speechSynthesis', { value: {
      getVoices: () => [{ name: 'Remote', lang: 'en-GB', localService: false }],
      speak: () => { calls.push('unsafe') },
      cancel: () => {},
    } })
  })
  await page.route('**/en-GB-red.mp3', (route) => route.fulfill({ status: 404, body: 'missing' }))
  await page.goto('./')
  const section = page.getByRole('region', { name: 'Angielski' })
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Nie można odtworzyć nagrania. Spróbuj ponownie.')
  expect(await page.evaluate(() => Reflect.get(window, '__audioSpeechCalls'))).toEqual([])
  await page.unroute('**/en-GB-red.mp3')
  await section.getByRole('button', { name: 'Spróbuj ponownie' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono nagranie.')
})

test('uses an explicitly local British voice after corrupt audio, and reports speech errors safely', async ({ page }) => {
  await installLocalSpeech(page, 'error')
  await page.route('**/en-GB-red.mp3', (route) => route.fulfill({ contentType: 'audio/mpeg', body: 'corrupt MP3' }))
  await page.goto('./')
  const section = page.getByRole('region', { name: 'Angielski' })
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Nie można odtworzyć nagrania. Spróbuj ponownie.')
  expect(await page.evaluate(() => Reflect.get(window, '__audioSpeechCalls'))).toEqual(['British'])
  await page.unroute('**/en-GB-red.mp3')
  await section.getByRole('button', { name: 'Spróbuj ponownie' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono nagranie.')
})

test('completes a successful local fallback using the exact British voice', async ({ page }) => {
  await installLocalSpeech(page, 'end')
  await page.route('**/en-GB-red.mp3', (route) => route.fulfill({ status: 404, body: 'missing' }))
  await page.goto('./')
  const section = page.getByRole('region', { name: 'Angielski' })
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono głosem urządzenia.')
  expect(await page.evaluate(() => Reflect.get(window, '__audioSpeechCalls'))).toEqual(['British'])
})

test('continues playing online when the browser refuses Cache Storage', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'caches', { get: () => { throw new Error('Cache storage denied') } })
  })
  await page.goto('./')
  const section = page.getByRole('region', { name: 'Angielski' })
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono nagranie.')
})

test('re-reads asynchronously available local voices on a fresh retry tap', async ({ page }) => {
  await installLocalSpeech(page, 'end')
  await page.route('**/en-GB-red.mp3', (route) => route.fulfill({ status: 404, body: 'missing' }))
  await page.goto('./')
  await page.evaluate(() => Reflect.set(window, '__audioLocalReady', false))
  const section = page.getByRole('region', { name: 'Angielski' })
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Nie można odtworzyć nagrania. Spróbuj ponownie.')
  await page.evaluate(() => Reflect.set(window, '__audioLocalReady', true))
  await section.getByRole('button', { name: 'Spróbuj ponownie' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono głosem urządzenia.')
})

test('a blocked AudioContext remains retryable and resume is requested within the tap', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeContext = window.AudioContext
    let blocked = true
    Object.defineProperty(window, '__audioActivation', { value: false, writable: true })
    class Context extends NativeContext {
      get state() { return blocked ? 'suspended' : super.state }
      resume() {
        Reflect.set(window, '__audioActivation', navigator.userActivation.isActive)
        if (blocked) {
          blocked = false
          return Promise.reject(new DOMException('Blocked for this attempt', 'NotAllowedError'))
        }
        return super.resume()
      }
    }
    Object.defineProperty(window, 'AudioContext', { value: Context })
    Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], cancel: () => {} } })
  })
  await page.goto('./')
  const section = page.getByRole('region', { name: 'Angielski' })
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Nie można odtworzyć nagrania. Spróbuj ponownie.')
  expect(await page.evaluate(() => Reflect.get(window, '__audioActivation'))).toBe(true)
  await section.getByRole('button', { name: 'Spróbuj ponownie' }).click()
  await expect(section.getByRole('status')).toHaveText('Odtworzono nagranie.')
})

test('stops playback and preserves the permanent disclosure', async ({ page }) => {
  await page.goto('./')
  const section = page.getByRole('region', { name: 'Polski' })
  await section.getByRole('button', { name: 'Posłuchaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Słuchaj…')
  await section.getByRole('button', { name: 'Zatrzymaj' }).click()
  await expect(section.getByRole('status')).toHaveText('Naciśnij, aby posłuchać.')
  await expect(section.getByText('Nagranie syntetyczne', { exact: true })).toBeVisible()
})

test('keeps all audio touch controls usable on a narrow portrait viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto('./')
  for (const control of await page.getByRole('button').all()) {
    const box = await control.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(48)
    expect(box?.height).toBeGreaterThanOrEqual(48)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

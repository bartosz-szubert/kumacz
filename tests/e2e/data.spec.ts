import { expect, test } from '@playwright/test'
import { build } from 'vite'
import { resolve } from 'node:path'
import { answer, profile } from '../fixtures/learningData.ts'

declare global {
  interface Window { learningDataTest: typeof import('../../src/data/learningData.ts') }
}

const now = Date.UTC(2026, 10, 10)
const day = 86_400_000
let source: string

test.beforeAll(async () => {
  // Test the production data module with native browser IndexedDB, without a shipped test screen.
  const bundle = await build({ configFile: false, logLevel: 'error', build: {
    write: false, lib: { entry: resolve('src/data/learningData.ts'), formats: ['es'] },
  } })
  const outputs = Array.isArray(bundle) ? bundle : [bundle]
  const entry = outputs.flatMap((item) => 'output' in item ? item.output : [])
    .find((item) => item.type === 'chunk' && item.isEntry)
  if (!entry || entry.type !== 'chunk') throw new Error('Data entry is missing')
  source = entry.code
})

test.beforeEach(async ({ page }) => {
  await page.route('**/__data-test.js', (route) => route.fulfill({ contentType: 'text/javascript', body: source }))
  await page.goto('./?preview=audio')
  await page.evaluate(async () => {
    window.learningDataTest = await import(new URL('__data-test.js', location.href).href)
  })
})

test('persists separate profiles, explicit preferences and settings across reopen', async ({ page }) => {
  const state = await page.evaluate(async ({ a, b, now }) => {
    const store = await window.learningDataTest.openLearningData({ now: () => now })
    const saved = await store.saveProfile(a)
    await store.saveProfile({ ...b, theme: 'neon', settings: { dailyLimitMinutes: 45, autoVoiceOver: false } })
    await store.saveSettings({ formatVersion: 1, revision: 0, lastBackupAt: now })
    saved.nickname = 'Unsaved change'
    store.close()
    const reopened = await window.learningDataTest.openLearningData({ now: () => now })
    const result = { profiles: await reopened.listProfiles(), settings: await reopened.getSettings() }
    reopened.close()
    return result
  }, { a: profile(), b: profile('test-b'), now })
  expect(state.profiles.map((p) => [p.id, p.revision, p.theme, p.settings.dailyLimitMinutes]))
    .toEqual([['test-a', 1, 'electric', 30], ['test-b', 1, 'neon', 45]])
  expect(state.profiles[0]?.nickname).toBe('Profil testowy')
  expect(state.settings).toEqual({ formatVersion: 1, revision: 1, lastBackupAt: now })
  await page.reload()
  const afterReload = await page.evaluate(async (now) => {
    const module = await import(new URL('__data-test.js', location.href).href) as typeof window.learningDataTest
    const store = await module.openLearningData({ now: () => now })
    const profiles = await store.listProfiles()
    store.close()
    return profiles
  }, now)
  expect(afterReload).toEqual(state.profiles)
})

test('commits progress and checked answers together, preserving stable IDs and attempt context', async ({ page }) => {
  const state = await page.evaluate(async ({ p, a, now }) => {
    const store = await window.learningDataTest.openLearningData({ now: () => now })
    const saved = await store.saveProfile(p)
    const progress = { ...saved.progress, completedLessonIds: [a.lessonId], words: [{
      wordId: a.wordId, box: 2 as const, dueOn: '2026-11-12', introduced: true,
      unconfirmed: false, lastPromotedOn: '2026-11-10', hasCorrectAnswer: true, hasCorrectListenAndTap: true,
    }] }
    const retry = { ...a, id: 'retry', correct: false, context: {
      kind: 'corrective-retry' as const, attemptNumber: 2, independent: false,
    } }
    const updated = await store.saveProfile({ ...saved, progress }, [a, retry])
    store.close()
    const reopened = await window.learningDataTest.openLearningData({ now: () => now })
    const result = { profile: await reopened.getProfile(p.id), answers: await reopened.getAnswers(p.id), updated }
    reopened.close()
    return result
  }, { p: profile(), a: answer(), now })
  expect(state.profile).toEqual(state.updated)
  expect(state.profile?.progress.completedLessonIds).toEqual(['english.level-1.animals'])
  expect(state.profile?.progress.words[0]?.wordId).toBe('english.animal.cat')
  expect(state.answers.map((a) => [a.wordId, a.context.kind, a.context.independent]))
    .toEqual([['english.animal.cat', 'due-review', true], ['english.animal.cat', 'corrective-retry', false]])
})

test('rolls back the profile and all earlier answer writes when a duplicate answer fails', async ({ page }) => {
  const result = await page.evaluate(async ({ p, a, now }) => {
    const store = await window.learningDataTest.openLearningData({ now: () => now })
    const initial = await store.saveProfile(p, [a])
    let rejected = false
    try { await store.saveProfile({ ...initial, theme: 'neon' }, [{ ...a, id: 'new-answer' }, a]) }
    catch { rejected = true }
    const result = { rejected, profile: await store.getProfile(p.id), answers: await store.getAnswers(p.id), initial }
    store.close()
    return result
  }, { p: profile(), a: answer(), now })
  expect(result.rejected).toBe(true)
  expect(result.profile).toEqual(result.initial)
  expect(result.answers.map((a) => a.id)).toEqual(['answer-1'])
})

test('aborts a real transaction after its profile write and allows the same pending save to be retried', async ({ page }) => {
  const result = await page.evaluate(async ({ p, a, now }) => {
    const store = await window.learningDataTest.openLearningData({ now: () => now })
    const initial = await store.saveProfile(p)
    const controller = new AbortController()
    const put = IDBObjectStore.prototype.put
    IDBObjectStore.prototype.put = function (...args) {
      const request = put.apply(this, args)
      if (this.name === 'profiles') request.addEventListener('success', () => controller.abort(), { once: true })
      return request
    }
    let rejected = false
    try { await store.saveProfile({ ...initial, theme: 'neon' }, [a], { signal: controller.signal }) }
    catch { rejected = true }
    finally { IDBObjectStore.prototype.put = put }
    const afterAbort = { profile: await store.getProfile(p.id), answers: await store.getAnswers(p.id) }
    const retried = await store.saveProfile({ ...initial, theme: 'neon' }, [a])
    const result = { rejected, afterAbort, initial, retried, answers: await store.getAnswers(p.id) }
    store.close()
    return result
  }, { p: profile(), a: answer(), now })
  expect(result.rejected).toBe(true)
  expect(result.afterAbort).toEqual({ profile: result.initial, answers: [] })
  expect(result.retried.theme).toBe('neon')
  expect(result.retried.revision).toBe(2)
  expect(result.answers).toHaveLength(1)
})

test('automatically removes expired history on open, read and write, keeping the exact 90-day boundary', async ({ page }) => {
  const result = await page.evaluate(async ({ p, a, now, day }) => {
    let clock = now - day
    const store = await window.learningDataTest.openLearningData({ now: () => clock })
    const saved = await store.saveProfile(p, [
      { ...a, id: 'expired-later', answeredAt: now - 90 * day - 1 },
      { ...a, id: 'boundary', answeredAt: now - 90 * day }, a,
    ])
    store.close()
    clock = now
    const reopened = await window.learningDataTest.openLearningData({ now: () => clock })
    const atOpen = await reopened.getAnswers(p.id)
    clock++
    const atRead = await reopened.getAnswers(p.id)
    await reopened.saveProfile(saved, [{ ...a, id: 'already-old', answeredAt: now - 91 * day }])
    const atWrite = await reopened.getAnswers(p.id)
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('kumacz-learning')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const physicallyStored = await new Promise<number>((resolve) => {
      const request = db.transaction('answers').objectStore('answers').count()
      request.onsuccess = () => resolve(request.result)
    })
    db.close(); reopened.close()
    return { atOpen, atRead, atWrite, physicallyStored }
  }, { p: profile(), a: answer(), now, day })
  expect(result.atOpen.map((a) => a.id)).toEqual(['boundary', 'answer-1'])
  expect(result.atRead.map((a) => a.id)).toEqual(['answer-1'])
  expect(result.atWrite.map((a) => a.id)).toEqual(['answer-1'])
  expect(result.physicallyStored).toBe(1)
})

test('rejects stale concurrent writes through separate connections without losing the winning change', async ({ page }) => {
  const result = await page.evaluate(async ({ p, now }) => {
    const first = await window.learningDataTest.openLearningData({ now: () => now })
    const second = await window.learningDataTest.openLearningData({ now: () => now })
    const saved = await first.saveProfile(p)
    const writes = await Promise.allSettled([
      first.saveProfile({ ...saved, theme: 'neon' }),
      second.saveProfile({ ...saved, nickname: 'Druga karta' }),
    ])
    const winner = writes.find((w) => w.status === 'fulfilled')
    const failure = writes.find((w) => w.status === 'rejected')
    const result = { outcomes: writes.map((w) => w.status), profile: await first.getProfile(p.id),
      winner: winner?.status === 'fulfilled' ? winner.value : undefined,
      error: failure?.status === 'rejected' ? failure.reason.code : undefined }
    first.close(); second.close()
    return result
  }, { p: profile(), now })
  expect(result.outcomes.sort()).toEqual(['fulfilled', 'rejected'])
  expect(result.profile?.revision).toBe(2)
  expect(result.profile).toEqual(result.winner)
  expect(result.error).toBe('conflict')
})

test('rejects another profile’s answers and deletes only the selected profile and its history', async ({ page }) => {
  const result = await page.evaluate(async ({ p, other, a, now }) => {
    const store = await window.learningDataTest.openLearningData({ now: () => now })
    const first = await store.saveProfile(p, [a])
    const second = await store.saveProfile(other, [{ ...a, profileId: other.id }])
    let rejected = false
    try { await store.saveProfile({ ...first, theme: 'neon' }, [{ ...a, id: 'wrong-profile', profileId: other.id }]) }
    catch { rejected = true }
    const unchanged = await store.getProfile(p.id)
    await store.deleteProfile(first.id, first.revision)
    const result = { rejected, unchanged, first, deleted: await store.getProfile(p.id),
      remaining: await store.getProfile(other.id), second, a: await store.getAnswers(p.id), b: await store.getAnswers(other.id) }
    store.close()
    return result
  }, { p: profile(), other: profile('test-b'), a: answer(), now })
  expect(result.rejected).toBe(true)
  expect(result.unchanged).toEqual(result.first)
  expect(result.deleted).toBeUndefined()
  expect(result.a).toEqual([])
  expect(result.remaining).toEqual(result.second)
  expect(result.b).toHaveLength(1)
})

test('rejects stale app settings without changing saved preferences or a profile', async ({ page }) => {
  const result = await page.evaluate(async ({ p, now }) => {
    const store = await window.learningDataTest.openLearningData({ now: () => now })
    const saved = await store.saveProfile(p)
    const first = await store.saveSettings({ formatVersion: 1, revision: 0, lastBackupAt: null })
    const latest = await store.saveSettings({ ...first, lastBackupAt: now })
    let rejected = false
    try { await store.saveSettings({ ...first, lastBackupAt: now + 1 }) }
    catch { rejected = true }
    const result = { rejected, settings: await store.getSettings(), latest, saved, profile: await store.getProfile(p.id) }
    store.close()
    return result
  }, { p: profile(), now })
  expect(result.rejected).toBe(true)
  expect(result.settings).toEqual(result.latest)
  expect(result.profile).toEqual(result.saved)
})

test('refuses a newer database without resetting it', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('future-learning', 2)
      request.onupgradeneeded = () => request.result.createObjectStore('sentinel')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    db.close()
    let rejected = false
    try { await window.learningDataTest.openLearningData({ name: 'future-learning' }) }
    catch { rejected = true }
    const request = indexedDB.open('future-learning')
    const version = await new Promise<number>((resolve) => { request.onsuccess = () => {
      const version = request.result.version
      request.result.close()
      resolve(version)
    } })
    return { rejected, version }
  })
  expect(result).toEqual({ rejected: true, version: 2 })
})

test('refuses newer document formats before cleanup can alter committed data', async ({ page }) => {
  const result = await page.evaluate(async ({ p, a, now, day }) => {
    const store = await window.learningDataTest.openLearningData({ now: () => now - day })
    const saved = await store.saveProfile(p, [{ ...a, answeredAt: now - 90 * day - 1 }])
    store.close()
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open('kumacz-learning')
      request.onsuccess = () => resolve(request.result)
    })
    const tx = db.transaction('profiles', 'readwrite')
    tx.objectStore('profiles').put({ ...saved, formatVersion: 3 })
    await new Promise<void>((resolve) => { tx.oncomplete = () => resolve() })
    let rejected = false
    try {
      const reopened = await window.learningDataTest.openLearningData({ now: () => now })
      reopened.close()
    } catch { rejected = true }
    const count = await new Promise<number>((resolve) => {
      const request = db.transaction('answers').objectStore('answers').count()
      request.onsuccess = () => resolve(request.result)
    })
    db.close()
    return { rejected, count }
  }, { p: profile(), a: answer(), now, day })
  expect(result).toEqual({ rejected: true, count: 1 })
})

for (const mode of ['commit', 'abort', 'invalid'] as const) {
  test(`migrates legacy profiles atomically with history cleanup: ${mode}`, async ({ page }) => {
    const result = await page.evaluate(async ({ a, b, old, now, mode }) => {
      function legacy(p: typeof a) {
        const { pilotSession: _pilot, ...rest } = p
        return { ...rest, formatVersion: 1, revision: 7 }
      }
      const originals = [legacy(a), { ...legacy(b), ...(mode === 'invalid' ? { unknownField: true } : {}) }]
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('migration-test', 1)
        request.onupgradeneeded = () => {
          const db = request.result
          db.createObjectStore('profiles', { keyPath: 'id' })
          const answers = db.createObjectStore('answers', { keyPath: ['profileId', 'id'] })
          answers.createIndex('byProfile', 'profileId'); answers.createIndex('byAnsweredAt', 'answeredAt')
          db.createObjectStore('settings')
        }
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error)
      })
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(['profiles', 'answers', 'settings'], 'readwrite')
        originals.forEach((p) => tx.objectStore('profiles').put(p))
        tx.objectStore('answers').put(old)
        tx.objectStore('settings').put({ formatVersion: 1, revision: 3, lastBackupAt: now }, 'app')
        tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error)
      })
      db.close()
      const nativePut = IDBObjectStore.prototype.put
      let aborted = false
      if (mode === 'abort') IDBObjectStore.prototype.put = function (...args) {
        const request = nativePut.apply(this, args)
        if (this.name === 'profiles' && !aborted) request.addEventListener('success', () => {
          aborted = true; this.transaction.abort()
        }, { once: true })
        return request
      }
      let error: string | null = null
      try { const store = await window.learningDataTest.openLearningData({ name: 'migration-test', now: () => now }); store.close() }
      catch (e) { error = (e as Error).name }
      finally { IDBObjectStore.prototype.put = nativePut }
      const raw = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open('migration-test', 1); request.onsuccess = () => resolve(request.result)
      })
      const tx = raw.transaction(['profiles', 'answers', 'settings'])
      const read = <T,>(request: IDBRequest<T>) => new Promise<T>((resolve) => { request.onsuccess = () => resolve(request.result) })
      const [profiles, answers, settings] = await Promise.all([
        read(tx.objectStore('profiles').getAll()), read(tx.objectStore('answers').getAll()), read(tx.objectStore('settings').get('app')),
      ])
      raw.close()
      let retried = null
      if (mode === 'abort') {
        const store = await window.learningDataTest.openLearningData({ name: 'migration-test', now: () => now })
        retried = { profiles: await store.listProfiles(), answers: await store.getAnswers(a.id) }; store.close()
      }
      return { originals, profiles, answers, settings, error, aborted, retried }
    }, { a: profile(), b: { ...profile('test-b'), theme: 'neon' as const }, old: { ...answer(), answeredAt: now - 91 * day }, now, mode })
    expect(result.settings).toEqual({ formatVersion: 1, revision: 3, lastBackupAt: now })
    if (mode === 'commit') {
      expect(result.error).toBeNull()
      expect(result.profiles).toEqual(result.originals.map((p) => ({ ...p, formatVersion: 2, pilotSession: null })))
      expect(result.answers).toEqual([])
    } else {
      expect(result.error).not.toBeNull()
      expect(result.profiles).toEqual(result.originals)
      expect(result.answers).toHaveLength(1)
      if (mode === 'abort') {
        expect(result.aborted).toBe(true)
        expect(result.retried?.profiles.every((p) => p.formatVersion === 2 && p.pilotSession === null)).toBe(true)
        expect(result.retried?.answers).toEqual([])
      }
    }
  })
}

import { openDB } from 'idb'
import type { DBSchema, IDBPTransaction } from 'idb'
import type { AnswerRecord, AppSettings, LearningData, ProfileDocument } from '../domain/learningData.ts'
import { integer, LearningDataError, text, validateAnswer, validateProfile, validateSettings } from './learningDataValidation.ts'

export { LearningDataError } from './learningDataValidation.ts'

const HISTORY_AGE_MS = 90 * 24 * 60 * 60 * 1000
interface LearningSchema extends DBSchema {
  profiles: { key: string; value: ProfileDocument }
  answers: {
    key: [string, string]
    value: AnswerRecord
    indexes: { byProfile: string; byAnsweredAt: number }
  }
  settings: { key: string; value: AppSettings }
}
type StoreName = 'profiles' | 'answers' | 'settings'
type WriteTransaction = IDBPTransaction<LearningSchema, StoreName[], 'readwrite'>

function expectRevision(current: { revision: number } | undefined, revision: number) {
  if (revision === 0 ? current !== undefined : current?.revision !== revision) {
    throw new LearningDataError('conflict')
  }
}

// idb 8: only await IDB requests inside a transaction; success means tx.done resolved.
// https://github.com/jakearchibald/idb#transaction-lifetime
export async function openLearningData(options: { name?: string; now?: () => number } = {}): Promise<LearningData> {
  const now = options.now ?? Date.now
  function cutoff() { const timestamp = now(); integer(timestamp); return timestamp - HISTORY_AGE_MS }
  const db = await openDB<LearningSchema>(options.name ?? 'kumacz-learning', 1, {
    upgrade(database) {
      database.createObjectStore('profiles', { keyPath: 'id' })
      const answers = database.createObjectStore('answers', { keyPath: ['profileId', 'id'] })
      answers.createIndex('byProfile', 'profileId')
      answers.createIndex('byAnsweredAt', 'answeredAt')
      database.createObjectStore('settings')
    },
    blocking() { db.close() },
  })

  async function write<T>(stores: StoreName[], action: (tx: WriteTransaction) => Promise<T>, signal?: AbortSignal): Promise<T> {
    signal?.throwIfAborted()
    const tx = db.transaction(stores, 'readwrite', { durability: 'strict' })
    // Handle rejection immediately, including when an individual request fails first.
    const done = tx.done
    void done.catch(() => {})
    const abort = () => { try { tx.abort() } catch { /* It may already have finished. */ } }
    signal?.addEventListener('abort', abort, { once: true })
    try {
      const result = await action(tx)
      await done
      return result
    } catch (error) {
      abort()
      await done.catch(() => {})
      throw error
    } finally { signal?.removeEventListener('abort', abort) }
  }

  async function prune(tx: WriteTransaction, before: number) {
    let cursor = await tx.objectStore('answers').index('byAnsweredAt').openCursor(IDBKeyRange.upperBound(before, true))
    while (cursor) {
      validateAnswer(cursor.value)
      await cursor.delete()
      cursor = await cursor.continue()
    }
  }

  try {
    const before = cutoff()
    await write(['profiles', 'answers', 'settings'], async (tx) => {
      // Refuse unknown/corrupt documents before cleanup can change any committed data.
      const [profiles, answers, settings] = await Promise.all([
        tx.objectStore('profiles').getAll(),
        tx.objectStore('answers').getAll(),
        tx.objectStore('settings').getAll(),
      ])
      profiles.forEach(validateProfile)
      answers.forEach(validateAnswer)
      settings.forEach(validateSettings)
      await prune(tx, before)
    })
  } catch (error) { db.close(); throw error }

  return {
    async listProfiles() {
      const profiles = await db.getAll('profiles')
      profiles.forEach(validateProfile)
      return profiles
    },
    async getProfile(id) {
      text(id)
      const profile = await db.get('profiles', id)
      if (profile !== undefined) validateProfile(profile)
      return profile
    },
    async saveProfile(profile, answers = [], { signal } = {}) {
      // Snapshot caller-owned input before any await; later mutations cannot alter a pending save.
      const pending = structuredClone({ profile, answers })
      validateProfile(pending.profile)
      for (const answer of pending.answers) {
        validateAnswer(answer)
        if (answer.profileId !== pending.profile.id) throw new LearningDataError('invalid-data')
      }
      const saved = { ...pending.profile, revision: pending.profile.revision + 1 }
      validateProfile(saved)
      const before = cutoff()
      return write(['profiles', 'answers'], async (tx) => {
        const profiles = tx.objectStore('profiles')
        const current = await profiles.get(saved.id)
        if (current !== undefined) validateProfile(current)
        expectRevision(current, pending.profile.revision)
        await profiles.put(saved)
        for (const answer of pending.answers) await tx.objectStore('answers').add(answer)
        await prune(tx, before)
        return saved
      }, signal)
    },
    async deleteProfile(id, revision) {
      text(id); integer(revision, 1)
      return write(['profiles', 'answers'], async (tx) => {
        const current = await tx.objectStore('profiles').get(id)
        if (current !== undefined) validateProfile(current)
        expectRevision(current, revision)
        await tx.objectStore('profiles').delete(id)
        let cursor = await tx.objectStore('answers').index('byProfile').openCursor(id)
        while (cursor) { await cursor.delete(); cursor = await cursor.continue() }
      })
    },
    async getAnswers(profileId) {
      text(profileId)
      const before = cutoff()
      return write(['answers'], async (tx) => {
        await prune(tx, before)
        const answers = await tx.objectStore('answers').index('byProfile').getAll(profileId)
        answers.forEach(validateAnswer)
        return answers.sort((a, b) => a.answeredAt - b.answeredAt || a.id.localeCompare(b.id))
      })
    },
    async getSettings() {
      const settings = await db.get('settings', 'app')
      if (settings !== undefined) validateSettings(settings)
      return settings
    },
    async saveSettings(settings) {
      const pending = structuredClone(settings)
      validateSettings(pending)
      const saved = { ...pending, revision: pending.revision + 1 }
      validateSettings(saved)
      return write(['settings'], async (tx) => {
        const current = await tx.objectStore('settings').get('app')
        if (current !== undefined) validateSettings(current)
        expectRevision(current, pending.revision)
        await tx.objectStore('settings').put(saved, 'app')
        return saved
      })
    },
    close() { db.close() },
  }
}

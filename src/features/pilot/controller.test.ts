import { describe, expect, it, vi } from 'vitest'
import lesson from '../../content/english/level-1/animals.json'
import instruction from '../../content/flashcard-instruction.json'
import { profile } from '../../../tests/fixtures/learningData.ts'
import type { LearningData, ProfileDocument } from '../../domain/learningData.ts'
import { createPilot } from './controller.ts'

function setup() {
  let saved = { ...profile(), revision: 1 }
  const writes: ProfileDocument[] = []
  let rejectWrite = false
  const store = { listProfiles: async () => [saved], close: vi.fn(),
    async saveProfile(p: ProfileDocument) {
      writes.push(structuredClone(p))
      if (rejectWrite) throw new Error('Storage unavailable')
      saved = { ...structuredClone(p), revision: p.revision + 1 }; return saved
    },
  } as unknown as LearningData
  const play = vi.fn(async () => ({ status: 'played', source: 'file' }) as const)
  const c = createPilot({ open: async () => store, audio: { play, stop: vi.fn() },
    lesson, flashcardInstruction: instruction, introductionInstruction: instruction,
    id: () => 'session-test', now: () => 123456789, onTheme: vi.fn() })
  return { c, play, writes, fail: (value: boolean) => { rejectWrite = value } }
}
const flush = async () => { await new Promise((resolve) => setTimeout(resolve, 0)) }

describe('pilot checkpoint boundary', () => {
  it('starts speech inside the profile tap, then saves a resumable session', async () => {
    const { c, play, writes } = setup(); await c.load()
    c.chooseProfile('test-a')
    expect(play).toHaveBeenCalledTimes(1)
    expect(c.getSnapshot().saving).toBe(true)
    await flush()
    expect(writes[0]?.pilotSession?.cursor).toBe(0)
    expect(c.getSnapshot().ready).toBe(true)
    c.dispose()
  })
  it('pauses on a failed save, retries the same result, and advances only on another tap', async () => {
    const { c, fail, writes } = setup(); await c.load(); c.chooseProfile('test-a'); await flush()
    const step = c.getSnapshot().runtime!.step
    fail(true)
    c.record({ kind: 'introduction', stepId: step.id, wordId: step.wordId, at: 123456790 })
    await flush()
    expect(c.getSnapshot().error).not.toBeNull()
    c.advance(); c.showProfiles()
    expect(c.getSnapshot().runtime?.step.id).toBe(step.id)
    fail(false); await c.retry()
    expect(writes.at(-1)).toEqual(writes.at(-2))
    expect(c.getSnapshot().recorded).toBe(true)
    expect(c.getSnapshot().runtime?.step.id).toBe(step.id)
    c.record({ kind: 'introduction', stepId: step.id, wordId: step.wordId, at: 123456791 })
    expect(writes).toHaveLength(3)
    c.advance()
    expect(c.getSnapshot().runtime?.step.id).not.toBe(step.id)
    c.dispose()
  })
  it('resumes at the saved next step after returning to profiles', async () => {
    const { c } = setup(); await c.load(); c.chooseProfile('test-a'); await flush()
    const first = c.getSnapshot().runtime!.step
    c.record({ kind: 'introduction', stepId: first.id, wordId: first.wordId, at: 123456790 }); await flush()
    c.showProfiles(); c.chooseProfile('test-a')
    expect(c.getSnapshot().runtime?.step.wordId).toBe(lesson.items[1]!.id)
    expect(c.getSnapshot().profile?.pilotSession?.cursor).toBe(1)
    c.dispose()
  })
})

import { expect, it } from 'vitest'
import type { AudioOutcome } from '../../audio/types.ts'
import lesson from '../../content/english/level-1/animals.json'
import instruction from '../../content/introduction-instruction.json'
import { createIntroduction } from './introduction.ts'

it('requires a complete word playback, keeps instruction separate and ignores disposed completion', async () => {
  const pending: Array<(result: AudioOutcome) => void> = []
  const c = createIntroduction(lesson.items[0]!, instruction, {
    play: () => new Promise((resolve) => pending.push(resolve)), stop() {},
  }, false)
  await c.start(); expect(pending).toHaveLength(0)
  const first = c.playWord(); pending[0]!({ status: 'unavailable' }); await first
  expect(c.getSnapshot()).toMatchObject({ heard: false, error: true })
  const cue = c.playInstruction(); pending[1]!({ status: 'played', source: 'file' }); await cue
  expect(c.getSnapshot().heard).toBe(false)
  const retry = c.playWord(); pending[2]!({ status: 'cancelled' }); await retry
  expect(c.getSnapshot().heard).toBe(false)
  const success = c.playWord(); pending[3]!({ status: 'played', source: 'file' }); await success
  expect(c.getSnapshot().heard).toBe(true)
  const late = c.playWord(); c.dispose(); const snapshot = c.getSnapshot()
  pending[4]!({ status: 'played', source: 'file' }); await late
  expect(c.getSnapshot()).toBe(snapshot)
})

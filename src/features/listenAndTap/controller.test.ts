import { describe, expect, it } from 'vitest'
import lesson from '../../content/english/level-1/animals.json'
import type { AudioClip, AudioOutcome } from '../../audio/types'
import { buildListenAndTap } from './question.ts'
import { createListenAndTap } from './controller.ts'

function setup(autoVoiceOver = true) {
  const pending: Array<{ clip: AudioClip; finish: (outcome: AudioOutcome) => void }> = []
  const audio = {
    play: (clip: AudioClip) => new Promise<AudioOutcome>((finish) => { pending.push({ clip, finish }) }),
    stop() {},
  }
  const view = buildListenAndTap(lesson, 'english.animal.cat', 'q1')
  return { controller: createListenAndTap(view, audio, autoVoiceOver), pending, view }
}

const played = { status: 'played', source: 'file' } as const

describe('listen-and-tap controller', () => {
  it('leaves the question ungraded until the required word has finished, then checks only once', async () => {
    const { controller: c, pending } = setup()
    expect(c.select('english.animal.cat')).toBeUndefined()
    const listening = c.start()
    expect(c.select('english.animal.cat')).toBeUndefined()
    pending[0]!.finish({ status: 'unavailable' }); await listening
    expect(c.getSnapshot().answer).toBeNull()
    expect(c.select('english.animal.cat')).toBeUndefined()
    const retry = c.playWord()
    pending[1]!.finish(played); await retry
    expect(c.select('english.animal.cat')?.correct).toBe(true)
    expect(c.select('english.animal.cat')).toBeUndefined()
    pending[2]!.finish(played)
  })

  it('reveals and reads the correct word after a wrong choice, keeping the result through feedback failure', async () => {
    const { controller: c, pending, view } = setup()
    const listening = c.start(); pending[0]!.finish(played); await listening
    const wrong = view.question.optionIds.find((id) => id !== view.target.id)!
    const checked = c.select(wrong)
    expect(checked?.correct).toBe(false)
    expect(pending[1]!.clip.id).toBe(view.target.audio.word.id)
    pending[1]!.finish({ status: 'unavailable' }); await Promise.resolve()
    expect(c.getSnapshot().answer).toEqual(checked)
    expect(c.select(view.target.id)).toBeUndefined()
    const translation = c.playTranslation()
    pending[2]!.finish(played); await translation
    expect(c.getSnapshot().answer).toEqual(checked)
  })

  it('ignores a superseded word completion and does not treat instruction playback as hearing the word', async () => {
    const { controller: c, pending } = setup()
    const word = c.start()
    const instruction = c.playInstruction()
    pending[0]!.finish(played); await word
    pending[1]!.finish(played); await instruction
    expect(c.getSnapshot().heard).toBe(false)
    expect(c.select('english.animal.cat')).toBeUndefined()
    await c.playTranslation()
    expect(pending).toHaveLength(2)
  })

  it('supports manual word playback when automatic voice-over is off', async () => {
    const { controller: c, pending } = setup(false)
    await c.start()
    expect(c.getSnapshot().heard).toBe(false)
    const word = c.playWord(); pending[0]!.finish(played); await word
    expect(c.select('english.animal.cat')?.correct).toBe(true)
    expect(pending).toHaveLength(1)
  })

  it('accepts a completed local-voice fallback as hearing the required word', async () => {
    const { controller: c, pending } = setup(false)
    const word = c.playWord()
    pending[0]!.finish({ status: 'played', source: 'local' }); await word
    expect(c.select('english.animal.cat')?.correct).toBe(true)
  })

  it('reads the solution after a wrong answer even with automatic voice-over off', async () => {
    const { controller: c, pending, view } = setup(false)
    const word = c.playWord(); pending[0]!.finish(played); await word
    c.select(view.question.optionIds.find((id) => id !== view.target.id)!)
    expect(c.getSnapshot().answer?.correct).toBe(false)
    expect(pending[1]!.clip.id).toBe(view.target.audio.word.id)
    pending[1]!.finish(played)
  })

  it('retries a cancelled word and ignores completion after disposal', async () => {
    const { controller: c, pending } = setup()
    const word = c.start(); pending[0]!.finish({ status: 'cancelled' }); await word
    expect(c.getSnapshot().heard).toBe(false)
    const retry = c.playWord()
    c.dispose()
    const snapshot = c.getSnapshot()
    pending[1]!.finish(played); await retry
    expect(c.getSnapshot()).toBe(snapshot)
    expect(c.select('english.animal.cat')).toBeUndefined()
  })

  it('builds every pilot question from its curated, distinct same-lesson options', () => {
    for (const item of lesson.items) {
      const view = buildListenAndTap(lesson, item.id, item.id)
      expect(view.options.map((o) => o.id).sort()).toEqual([item.id, ...item.distractorIds].sort())
      for (const pair of lesson.confusablePairs) {
        expect(pair.every((id) => view.question.optionIds.includes(id))).toBe(false)
      }
    }
    expect(() => buildListenAndTap({ ...lesson, confusablePairs: [lesson.items[0]!.distractorIds] },
      'english.animal.cat', 'invalid')).toThrow()
  })
})

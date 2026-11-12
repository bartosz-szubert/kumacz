import { describe, expect, it } from 'vitest'
import lesson from '../../content/english/level-1/animals.json'
import instruction from '../../content/flashcard-instruction.json'
import type { AudioClip, AudioOutcome } from '../../audio/types'
import { createFlashcard } from './controller.ts'

function setup(autoVoiceOver = true) {
  const pending: Array<{ clip: AudioClip; finish: (outcome: AudioOutcome) => void }> = []
  let stops = 0
  const audio = {
    play: (clip: AudioClip) => new Promise<AudioOutcome>((finish) => { pending.push({ clip, finish }) }),
    stop() { stops++ },
  }
  const controller = createFlashcard({ id: 'card-1', item: lesson.items[0]!, instruction }, audio, autoVoiceOver)
  return { controller, pending, stops: () => stops }
}
const played = { status: 'played', source: 'file' } as const

describe('flashcard lifecycle and self-assessment', () => {
  it('starts picture-only and refuses assessment or word/translation playback on the front', async () => {
    const { controller: c, pending } = setup()
    expect(c.getSnapshot().side).toBe('front')
    expect(c.assess('know')).toBeUndefined()
    await c.playWord(); await c.playTranslation()
    expect(pending).toEqual([])
    expect(c.getSnapshot().result).toBeNull()
  })

  it('reveals the back and automatically plays the accepted English word', async () => {
    const { controller: c, pending } = setup()
    const flipping = c.flip()
    expect(c.getSnapshot().side).toBe('back')
    expect(pending[0]!.clip).toEqual(lesson.items[0]!.audio.word)
    expect(c.assess('know')).toBeUndefined()
    pending[0]!.finish(played); await flipping
    expect(c.getSnapshot().playing).toBeNull()
  })

  it.each(['know', 'not-yet'] as const)('returns %s once as self-assessment, without a checked correctness result', async (value) => {
    const { controller: c } = setup(false)
    await c.flip()
    const result = c.assess(value)
    expect(result).toEqual({ kind: 'self-assessment', cardId: 'card-1', wordId: 'english.animal.cat', value })
    expect(result).not.toHaveProperty('correct')
    expect(c.assess('know')).toBeUndefined()
    await c.flip()
    expect(c.getSnapshot().side).toBe('back')
    expect(c.getSnapshot().result).toEqual(result)
  })

  it('allows quiet manual study with automatic voice-over off', async () => {
    const { controller: c, pending } = setup(false)
    await c.flip()
    expect(pending).toEqual([])
    const word = c.playWord(); pending[0]!.finish(played); await word
    const translation = c.playTranslation()
    expect(pending[1]!.clip).toEqual(lesson.items[0]!.audio.translation)
    pending[1]!.finish(played); await translation
    expect(c.assess('not-yet')?.kind).toBe('self-assessment')
  })

  it('keeps unavailable audio separate from self-assessment and supports replay', async () => {
    const { controller: c, pending } = setup()
    const flip = c.flip(); pending[0]!.finish({ status: 'unavailable' }); await flip
    expect(c.getSnapshot().audioError).toBe('word')
    expect(c.getSnapshot().result).toBeNull()
    const retry = c.playWord(); pending[1]!.finish(played); await retry
    expect(c.getSnapshot().audioError).toBeNull()
    expect(c.assess('know')?.value).toBe('know')
  })

  it('does not convert an audio failure into a checked error when the child self-assesses', async () => {
    const { controller: c, pending } = setup()
    const flip = c.flip(); pending[0]!.finish({ status: 'unavailable' }); await flip
    const result = c.assess('not-yet')
    expect(result?.kind).toBe('self-assessment')
    expect(result).not.toHaveProperty('correct')
  })

  it('stops word playback on flipping to the front and ignores its late completion', async () => {
    const { controller: c, pending, stops } = setup()
    const flip = c.flip()
    await c.flip()
    const front = c.getSnapshot()
    pending[0]!.finish(played); await flip
    expect(c.getSnapshot()).toBe(front)
    expect(front.side).toBe('front')
    expect(front.playing).toBeNull()
    expect(stops()).toBeGreaterThan(0)
  })

  it('reads the Polish instruction without exposing or assessing the word', async () => {
    const { controller: c, pending } = setup()
    const reading = c.playInstruction()
    expect(pending[0]!.clip).toEqual(instruction)
    pending[0]!.finish(played); await reading
    expect(c.getSnapshot().side).toBe('front')
    expect(c.assess('know')).toBeUndefined()
  })

  it('ignores disposed audio completions and further assessment', async () => {
    const { controller: c, pending } = setup()
    const flip = c.flip(); c.dispose()
    const snapshot = c.getSnapshot()
    pending[0]!.finish(played); await flip
    expect(c.getSnapshot()).toBe(snapshot)
    expect(c.assess('know')).toBeUndefined()
  })
})

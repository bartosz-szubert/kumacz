import { describe, expect, it, vi } from 'vitest'
import { createAudioPlayer } from './player'
import { selectLocalVoice } from './voices'
import type { AudioClip, AudioRuntime } from './types'

const english: AudioClip = { id: 'red', language: 'en-GB', text: 'Red.', path: 'red.mp3' }
const polish: AudioClip = { id: 'instruction', language: 'pl-PL', text: 'Posłuchaj.', path: 'pl.mp3' }

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((r) => { resolve = r })
  return { promise, resolve }
}

function runtime(overrides: Partial<AudioRuntime> = {}): AudioRuntime {
  return {
    playFile: async (_clip, _signal, started) => { started() },
    speakLocal: async () => { throw new Error('No eligible voice') },
    close: async () => {},
    ...overrides,
  }
}

describe('local-only voice policy', () => {
  it('selects British English and refuses remote and American defaults', () => {
    const remote = { lang: 'en-GB', localService: false }
    const american = { lang: 'en-US', localService: true }
    const british = { lang: 'en-GB', localService: true }
    expect(selectLocalVoice([remote, american], 'en-GB')).toBeUndefined()
    expect(selectLocalVoice([remote, american, british], 'en-GB')).toBe(british)
  })

  it('accepts a local Polish voice and fails closed on unknown locality or language', () => {
    const polishVoice = { lang: 'pl', localService: true }
    expect(selectLocalVoice([polishVoice], 'pl-PL')).toBe(polishVoice)
    expect(selectLocalVoice([{ lang: 'pl-PL' }], 'pl-PL')).toBeUndefined()
    expect(selectLocalVoice([polishVoice], 'de-DE')).toBeUndefined()
  })
})

describe('audio player outcomes', () => {
  it('finishes only after file playback completes, then supports replay', async () => {
    const end = deferred()
    const player = createAudioPlayer(runtime({
      playFile: async (_clip, _signal, started) => { started(); await end.promise },
    }))
    const first = player.play(english)
    expect(player.getSnapshot()).toEqual({ status: 'playing', clipId: 'red', source: 'file' })
    end.resolve()
    expect(await first).toEqual({ status: 'played', source: 'file' })
    expect(await player.play(english)).toEqual({ status: 'played', source: 'file' })
  })

  it('reports a local fallback only after its actual completion', async () => {
    const end = deferred()
    const player = createAudioPlayer(runtime({
      playFile: async () => { throw new Error('Missing MP3') },
      speakLocal: async (_clip, _signal, started) => { started(); await end.promise },
    }))
    const result = player.play(english)
    await vi.waitFor(() => expect(player.getSnapshot()).toEqual({ status: 'playing', clipId: 'red', source: 'local' }))
    end.resolve()
    expect(await result).toEqual({ status: 'played', source: 'local' })
  })

  it('returns unavailable instead of success when neither source works, and allows retry', async () => {
    let fileAvailable = false
    const player = createAudioPlayer(runtime({
      playFile: async (_clip, _signal, started) => {
        if (!fileAvailable) throw new Error('Unavailable')
        started()
      },
    }))
    expect(await player.play(english)).toEqual({ status: 'unavailable' })
    expect(player.getSnapshot()).toEqual({ status: 'unavailable', clipId: 'red' })
    fileAvailable = true
    expect(await player.play(english)).toEqual({ status: 'played', source: 'file' })
  })

  it('cancels a stalled load immediately and ignores its late result', async () => {
    const load = deferred()
    const player = createAudioPlayer(runtime({ playFile: () => load.promise }))
    const result = player.play(english)
    player.stop()
    expect(await result).toEqual({ status: 'cancelled' })
    load.resolve()
    await Promise.resolve()
    expect(player.getSnapshot()).toEqual({ status: 'idle' })
  })

  it('keeps the new clip state when an old load finishes after another tap', async () => {
    const old = deferred()
    const current = deferred()
    const player = createAudioPlayer(runtime({
      playFile: async (clip, _signal, started) => {
        if (clip.id === english.id) await old.promise
        else { started(); await current.promise }
      },
    }))
    const previous = player.play(english)
    const next = player.play(polish)
    old.resolve()
    expect(await previous).toEqual({ status: 'cancelled' })
    expect(player.getSnapshot()).toEqual({ status: 'playing', clipId: polish.id, source: 'file' })
    current.resolve()
    expect(await next).toEqual({ status: 'played', source: 'file' })
  })

  it('returns to loading while a failed playing file is replaced by a pending local voice', async () => {
    const interrupted = deferred()
    const player = createAudioPlayer(runtime({
      playFile: async (_clip, _signal, started) => {
        started()
        await interrupted.promise
        throw new Error('Audio context interrupted')
      },
      speakLocal: () => new Promise<void>(() => {}),
    }))
    const result = player.play(english)
    interrupted.resolve()
    try {
      await vi.waitFor(() => expect(player.getSnapshot()).toEqual({ status: 'loading', clipId: 'red' }))
    } finally {
      player.stop()
      await result
    }
  })

  it('starts no audio when the consumer cancels synchronously on loading', async () => {
    const audible: string[] = []
    const player = createAudioPlayer(runtime({
      playFile: async (clip, _signal, started) => { audible.push(clip.text); started() },
    }))
    const unsubscribe = player.subscribe(() => {
      if (player.getSnapshot().status === 'loading') player.stop()
    })
    expect(await player.play(english)).toEqual({ status: 'cancelled' })
    expect(audible).toEqual([])
    unsubscribe()
  })

  it('settles an engine that never starts, keeping retry available', async () => {
    vi.useFakeTimers()
    try {
      const never = new Promise<void>(() => {})
      const player = createAudioPlayer(runtime({ playFile: () => never, speakLocal: () => never }))
      const result = player.play(english)
      await vi.advanceTimersByTimeAsync(20_001)
      expect(await result).toEqual({ status: 'unavailable' })
    } finally { vi.useRealTimers() }
  })

  it('notifies subscribers of outcomes and releases subscriptions', async () => {
    const player = createAudioPlayer(runtime())
    const states: string[] = []
    const unsubscribe = player.subscribe(() => states.push(player.getSnapshot().status))
    await player.play(english)
    expect(states).toContain('playing')
    expect(states.at(-1)).toBe('finished')
    unsubscribe()
    const length = states.length
    player.stop()
    expect(states).toHaveLength(length)
  })
})

import type { AudioClip, AudioOutcome } from '../../audio/types.ts'
import type { LessonItem } from '../../content/lesson.ts'

export interface PilotAudio { play(clip: AudioClip): Promise<AudioOutcome>; stop(): void }
export function createIntroduction(item: LessonItem, instruction: AudioClip, audio: PilotAudio, automatic: boolean) {
  let state = { heard: false, playing: false, error: false }
  let generation = 0
  let disposed = false
  const listeners = new Set<() => void>()
  function publish(next: typeof state) { state = next; listeners.forEach((fn) => fn()) }
  async function read(clip: AudioClip, word: boolean) {
    if (disposed) return
    const request = ++generation
    publish({ ...state, playing: true, error: false, heard: word ? false : state.heard })
    let outcome: AudioOutcome
    try { outcome = await audio.play(clip) } catch { outcome = { status: 'unavailable' } }
    if (disposed || request !== generation) return
    publish({ heard: word ? outcome.status === 'played' : state.heard, playing: false, error: outcome.status === 'unavailable' })
  }
  return { item, instruction,
    getSnapshot: () => state,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn) } },
    start: () => automatic ? read(item.audio.word, true) : Promise.resolve(),
    playWord: () => read(item.audio.word, true),
    playInstruction: () => read(instruction, false),
    dispose() { disposed = true; generation++; audio.stop(); listeners.clear() },
  }
}
export type IntroductionController = ReturnType<typeof createIntroduction>

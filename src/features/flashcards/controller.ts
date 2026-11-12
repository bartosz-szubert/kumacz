import type { AudioClip, AudioOutcome } from '../../audio/types'
import type { LessonItem } from '../../content/lesson.ts'
import { selfAssessFlashcard } from '../../domain/flashcards.ts'
import type { FlashcardResult, SelfAssessment } from '../../domain/flashcards.ts'

interface Audio {
  play(clip: AudioClip): Promise<AudioOutcome>
  stop(): void
}
interface FlashcardView { id: string; item: LessonItem; instruction: AudioClip }
type Purpose = 'word' | 'translation' | 'instruction'
interface State {
  readonly side: 'front' | 'back'
  readonly playing: Purpose | null
  readonly audioError: Purpose | null
  readonly result: FlashcardResult | null
}

export function createFlashcard(view: FlashcardView, audio: Audio, autoVoiceOver = true) {
  let state: State = { side: 'front', playing: null, audioError: null, result: null }
  let generation = 0
  let disposed = false
  const listeners = new Set<() => void>()
  function publish(next: State) { state = next; listeners.forEach((listener) => listener()) }

  async function read(purpose: Purpose, clip: AudioClip) {
    if (disposed) return
    const request = ++generation
    publish({ ...state, playing: purpose, audioError: null })
    let outcome: AudioOutcome
    try { outcome = await audio.play(clip) }
    catch { outcome = { status: 'unavailable' } }
    if (disposed || request !== generation) return
    publish({ ...state, playing: null, audioError: outcome.status === 'unavailable' ? purpose : null })
  }

  return {
    view,
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    async flip() {
      if (disposed || state.result) return
      generation++; audio.stop()
      const side = state.side === 'front' ? 'back' : 'front'
      publish({ ...state, side, playing: null, audioError: null })
      // Called inside the flip tap; P03 resumes audio before awaiting file loading.
      if (side === 'back' && autoVoiceOver) await read('word', view.item.audio.word)
    },
    playInstruction: () => read('instruction', view.instruction),
    playWord: () => state.side === 'back' ? read('word', view.item.audio.word) : Promise.resolve(),
    playTranslation: () => state.side === 'back' ? read('translation', view.item.audio.translation) : Promise.resolve(),
    assess(value: SelfAssessment) {
      if (disposed || state.side !== 'back' || state.playing || state.result) return undefined
      const result = selfAssessFlashcard(view.id, view.item.id, value)
      if (!result) return undefined
      publish({ ...state, result })
      return result
    },
    dispose() { disposed = true; generation++; audio.stop(); listeners.clear() },
  }
}

export type FlashcardController = ReturnType<typeof createFlashcard>

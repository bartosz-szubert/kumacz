import type { AudioClip, AudioOutcome } from '../../audio/types'
import { checkChoice } from '../../domain/listenAndTap.ts'
import type { CheckedChoice } from '../../domain/listenAndTap.ts'
import type { ListenAndTapView } from './question.ts'

interface ExerciseAudio {
  play(clip: AudioClip): Promise<AudioOutcome>
  stop(): void
}
type Purpose = 'word' | 'instruction' | 'feedback' | 'translation'
interface ExerciseState {
  readonly heard: boolean
  readonly playing: Purpose | null
  readonly audioError: Purpose | null
  readonly answer: CheckedChoice | null
}

export function createListenAndTap(view: ListenAndTapView, audio: ExerciseAudio, autoVoiceOver = true) {
  let state: ExerciseState = { heard: false, playing: null, audioError: null, answer: null }
  let generation = 0
  let disposed = false
  const listeners = new Set<() => void>()
  function publish(next: ExerciseState) { state = next; listeners.forEach((listener) => listener()) }

  async function read(purpose: Purpose, clip: AudioClip) {
    if (disposed) return
    const request = ++generation
    publish({ ...state, playing: purpose, audioError: null, heard: purpose === 'word' ? false : state.heard })
    let outcome: AudioOutcome
    try { outcome = await audio.play(clip) }
    catch { outcome = { status: 'unavailable' } }
    if (disposed || request !== generation) return
    publish({ ...state, playing: null, audioError: outcome.status === 'unavailable' ? purpose : null,
      heard: purpose === 'word' ? outcome.status === 'played' : state.heard })
  }

  return {
    view,
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    start: () => autoVoiceOver ? read('word', view.target.audio.word) : Promise.resolve(),
    playWord: () => read(state.answer ? 'feedback' : 'word', view.target.audio.word),
    playInstruction: () => read('instruction', view.instruction),
    playTranslation: () => state.answer ? read('translation', view.target.audio.translation) : Promise.resolve(),
    select(selectedId: string) {
      if (disposed || !state.heard || state.playing || state.answer) return undefined
      const answer = checkChoice(view.question, selectedId)
      if (!answer) return undefined
      publish({ ...state, answer, audioError: null })
      // A wrong choice always reads the solution (F-06), even with automatic voice-over off.
      if (!answer.correct || autoVoiceOver) void read('feedback', view.target.audio.word)
      return answer
    },
    dispose() { disposed = true; generation++; audio.stop(); listeners.clear() },
  }
}

export type ListenAndTapController = ReturnType<typeof createListenAndTap>

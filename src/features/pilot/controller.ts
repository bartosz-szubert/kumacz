import type { AudioClip } from '../../audio/types.ts'
import type { Lesson } from '../../content/lesson.ts'
import type { AnswerRecord, LearningData, ProfileDocument } from '../../domain/learningData.ts'
import { PROFILE_FORMAT_VERSION } from '../../domain/learningData.ts'
import type { Theme } from '../../domain/theme.ts'
import { applyPilotResult, createPilotSession } from '../../domain/pilotSession.ts'
import { pilotSteps } from '../../domain/pilotTypes.ts'
import type { PilotResult, PilotStep } from '../../domain/pilotTypes.ts'
import { createFlashcard } from '../flashcards/controller.ts'
import type { FlashcardController } from '../flashcards/controller.ts'
import { createListenAndTap } from '../listenAndTap/controller.ts'
import type { ListenAndTapController } from '../listenAndTap/controller.ts'
import { buildListenAndTap } from '../listenAndTap/question.ts'
import { createIntroduction } from './introduction.ts'
import type { IntroductionController, PilotAudio } from './introduction.ts'

type Runtime = { step: PilotStep } & (
  | { kind: 'introduction'; controller: IntroductionController }
  | { kind: 'flashcard'; controller: FlashcardController }
  | { kind: 'listen-and-tap'; controller: ListenAndTapController }
)
interface State {
  screen: 'profiles' | 'session' | 'finished'
  profiles: ProfileDocument[]
  profile: ProfileDocument | null
  runtime: Runtime | null
  ready: boolean
  recorded: boolean
  saving: boolean
  error: string | null
}
interface Options {
  open(): Promise<LearningData>
  audio: PilotAudio
  lesson: Lesson
  flashcardInstruction: AudioClip
  introductionInstruction: AudioClip
  now(): number
  id(): string
  onTheme(theme: Theme): void
}
type Pending = { profile: ProfileDocument; answers: AnswerRecord[]; mode: 'create' | 'start' | 'result' }
const saveError = 'Nie udało się zapisać postępów. Zostaw tę stronę otwartą i spróbuj ponownie.'

export function createPilot(options: Options) {
  let state: State = { screen: 'profiles', profiles: [], profile: null, runtime: null,
    ready: false, recorded: false, saving: false, error: null }
  let data: LearningData | null = null
  let disposed = false
  let pending: Pending | null = null
  const listeners = new Set<() => void>()
  function publish(patch: Partial<State>) {
    if (disposed) return
    state = { ...state, ...patch }; listeners.forEach((fn) => fn())
  }
  async function connect() {
    if (data) return data
    const opened = await options.open()
    if (disposed) { opened.close(); throw new Error('Pilot disposed') }
    data = opened; return opened
  }
  async function save() {
    if (!pending || disposed) return
    const write = pending
    publish({ saving: true, error: null })
    try {
      const store = await connect()
      const saved = await store.saveProfile(write.profile, write.answers)
      if (disposed) return
      pending = null
      const profiles = [...state.profiles.filter((p) => p.id !== saved.id), saved]
      publish({ profiles, profile: write.mode === 'create' ? null : saved, saving: false,
        ready: true, recorded: write.mode === 'result' })
    } catch {
      publish({ saving: false, error: saveError })
    }
  }
  function showStep(profile: ProfileDocument) {
    const session = profile.pilotSession!
    const step = pilotSteps(session)[session.cursor]
    if (!step) { publish({ screen: 'finished', profile, runtime: null }); return }
    const item = options.lesson.items.find((item) => item.id === step.wordId)
    if (!item || session.lessonId !== options.lesson.id) throw new Error('Pilot content is unavailable')
    const automatic = profile.settings.autoVoiceOver
    let runtime: Runtime
    switch (step.kind) {
      case 'introduction': runtime = { step, kind: step.kind,
        controller: createIntroduction(item, options.introductionInstruction, options.audio, automatic) }; break
      case 'flashcard': runtime = { step, kind: step.kind,
        controller: createFlashcard({ id: step.id, item, instruction: options.flashcardInstruction }, options.audio, automatic) }; break
      case 'listen-and-tap': runtime = { step, kind: step.kind,
        controller: createListenAndTap(buildListenAndTap(options.lesson, item.id, step.id), options.audio, automatic) }; break
    }
    publish({ screen: 'session', profile, runtime, recorded: false, error: null })
    // Keep audio activation inside the profile/continue tap, before the first await.
    if (runtime.kind !== 'flashcard') void runtime.controller.start()
  }
  return {
    getSnapshot: () => state,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn) } },
    async load() {
      if (disposed || state.saving) return
      publish({ saving: true, error: null })
      try { const store = await connect(); const profiles = await store.listProfiles(); publish({ profiles, ready: true, saving: false }) }
      catch { publish({ saving: false, error: 'Nie udało się otworzyć zapisanych profili. Spróbuj ponownie. Dane nie zostały zresetowane.' }) }
    },
    async createProfile(nickname: string, avatarId: string, theme: Theme) {
      if (disposed || !state.ready || state.saving || pending) return
      if (!nickname.trim() || !['electric', 'neon'].includes(theme) || !options.lesson.items.some((i) => i.picture.id === avatarId)) return
      const profile: ProfileDocument = { formatVersion: PROFILE_FORMAT_VERSION, id: options.id(), revision: 0,
        nickname: nickname.trim(), avatarId, theme, settings: { dailyLimitMinutes: 30, autoVoiceOver: true },
        progress: { words: [], completedLessonIds: [], completedLevelIds: [] }, pilotSession: null }
      pending = { profile, answers: [], mode: 'create' }; await save()
    },
    chooseProfile(id: string) {
      if (disposed || !state.ready || state.saving || pending) return
      const previous = state.profiles.find((p) => p.id === id)
      if (!previous) return
      options.onTheme(previous.theme)
      const resume = previous.pilotSession && previous.pilotSession.cursor < pilotSteps(previous.pilotSession).length
      const profile = resume ? previous : { ...previous,
        pilotSession: createPilotSession(previous, options.lesson, options.id(), options.now()) }
      state.runtime?.controller.dispose()
      try { showStep(profile) } catch { publish({ error: 'Ta sesja wymaga innej wersji treści. Zachowaliśmy zapisane dane.' }); return }
      if (!resume) {
        pending = { profile, answers: [], mode: 'start' }; publish({ ready: false }); void save()
      }
    },
    record(event: PilotResult) {
      if (disposed || !state.ready || state.saving || pending || state.recorded || !state.profile || event.stepId !== state.runtime?.step.id) return
      const result = applyPilotResult(state.profile, options.lesson, event)
      pending = { ...result, mode: 'result' }; void save()
    },
    advance() {
      if (disposed || !state.recorded || state.saving || pending || !state.profile) return
      state.runtime?.controller.dispose(); showStep(state.profile)
    },
    showProfiles() {
      if (disposed || state.saving || pending) return
      state.runtime?.controller.dispose()
      publish({ screen: 'profiles', profile: null, runtime: null, recorded: false, error: null })
    },
    async retry() {
      if (disposed || state.saving) return
      data?.close(); data = null
      if (pending) await save()
      else await this.load()
    },
    dispose() { disposed = true; state.runtime?.controller.dispose(); data?.close(); listeners.clear() },
  }
}
export type PilotController = ReturnType<typeof createPilot>

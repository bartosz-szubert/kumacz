import type { Lesson } from '../content/lesson.ts'
import { ANSWER_FORMAT_VERSION } from './learningData.ts'
import type { AnswerRecord, ProfileDocument, WordProgress } from './learningData.ts'
import { pilotSteps } from './pilotTypes.ts'
import type { PilotResult, PilotSession } from './pilotTypes.ts'

export function createPilotSession(profile: ProfileDocument, lesson: Lesson, id: string, at: number): PilotSession {
  const previous = profile.pilotSession
  if (previous && previous.cursor < pilotSteps(previous).length) throw new Error('Resume the unfinished session')
  const last = new Map<string, boolean>()
  previous?.results.forEach((r) => { if (r.kind === 'listen-and-tap') last.set(r.wordId, r.correct) })
  const all = lesson.items.map((item) => item.id)
  const retries = [...last].filter(([id, correct]) => !correct && all.includes(id)).map(([id]) => id)
  const fresh = all.filter((id) => !profile.progress.words.find((word) => word.wordId === id)?.introduced)
  const wordIds = [...new Set([...retries, ...fresh, ...all])].slice(0, 3)
  if (wordIds.length !== 3) throw new Error('The pilot needs three available words')
  return { id, planVersion: 1, lessonId: lesson.id, wordIds, newWordIds: wordIds.filter((id) => fresh.includes(id)),
    attemptOffsets: wordIds.map((id) => {
      const index = previous?.wordIds.indexOf(id) ?? -1
      return retries.includes(id) && previous && index >= 0 ? previous.attemptOffsets[index]! + 2 : 0
    }), startedAt: at, cursor: 0, results: [] }
}

function initialWord(wordId: string, at: number): WordProgress {
  const next = new Date(at)
  next.setDate(next.getDate() + 1)
  const dueOn = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`
  return { wordId, box: 1, dueOn, introduced: true, unconfirmed: false, lastPromotedOn: null,
    hasCorrectAnswer: false, hasCorrectListenAndTap: false }
}

export function applyPilotResult(profile: ProfileDocument, lesson: Lesson, event: PilotResult): { profile: ProfileDocument; answers: AnswerRecord[] } {
  const session = profile.pilotSession
  const step = session && pilotSteps(session)[session.cursor]
  if (!session || !step || session.lessonId !== lesson.id || event.stepId !== step.id || event.kind !== step.kind || event.wordId !== step.wordId) {
    throw new Error('Result does not match the current step')
  }
  if (!Number.isSafeInteger(event.at) || event.at < 0) throw new Error('Invalid result time')
  const target = lesson.items.find((item) => item.id === event.wordId)
  if (!target) throw new Error('Word is unavailable')
  const next = structuredClone(profile)
  const checkpoint = next.pilotSession!
  const results = checkpoint.results
  const answers: AnswerRecord[] = []
  let word = next.progress.words.find((word) => word.wordId === event.wordId)
  if (event.kind === 'introduction') {
    if (word) word.introduced = true
    else next.progress.words.push(initialWord(event.wordId, event.at))
  } else if (event.kind === 'listen-and-tap') {
    if (!word?.introduced) throw new Error('Introduce the word before testing')
    if (![target.id, ...target.distractorIds].includes(event.selectedId) || event.correct !== (event.selectedId === target.id)) {
      throw new Error('Invalid checked selection')
    }
    const prior = [...results].reverse().find((r) => r.kind === 'listen-and-tap' && r.wordId === event.wordId)
    const offset = checkpoint.attemptOffsets[checkpoint.wordIds.indexOf(event.wordId)]!
    const corrective = offset > 0 || (prior?.kind === 'listen-and-tap' && !prior.correct)
    answers.push({ formatVersion: ANSWER_FORMAT_VERSION, id: step.id, profileId: next.id, sessionId: session.id,
      exerciseId: step.id, moduleId: lesson.moduleId, levelId: lesson.levelId, lessonId: lesson.id,
      wordId: event.wordId, answeredAt: event.at, exerciseType: 'listen-and-tap', correct: event.correct,
      context: { kind: corrective ? 'corrective-retry' : 'practice', attemptNumber: offset + step.attempt,
        independent: !corrective && step.attempt === 1 } })
    if (event.correct) { word.hasCorrectAnswer = true; word.hasCorrectListenAndTap = true }
  } else if (event.value !== 'know' && event.value !== 'not-yet') throw new Error('Invalid self-assessment')
  results.push(structuredClone(event))
  checkpoint.cursor++
  return { profile: next, answers }
}

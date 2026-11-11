import { pilotSteps } from '../domain/pilotTypes.ts'
import type { PilotSession } from '../domain/pilotTypes.ts'
import { bool, check, fields, ids, integer, object, text } from './validation.ts'

export function validatePilotSession(value: unknown): asserts value is PilotSession {
  const s = fields(value, ['id', 'planVersion', 'lessonId', 'wordIds', 'newWordIds', 'attemptOffsets', 'startedAt', 'cursor', 'results'])
  text(s.id); text(s.lessonId); check(s.planVersion === 1)
  ids(s.wordIds); ids(s.newWordIds)
  const wordIds = s.wordIds
  check(wordIds.length === 3 && s.newWordIds.length <= 3 && s.newWordIds.every((id) => wordIds.includes(id)))
  check(Array.isArray(s.attemptOffsets) && s.attemptOffsets.length === wordIds.length)
  s.attemptOffsets.forEach((offset) => integer(offset))
  integer(s.startedAt); integer(s.cursor)
  check(Array.isArray(s.results))
  const steps = pilotSteps({ id: s.id, wordIds: s.wordIds, newWordIds: s.newWordIds })
  check(s.cursor <= steps.length && s.results.length === s.cursor)
  s.results.forEach((value, index) => {
    object(value)
    const extra = value.kind === 'flashcard' ? ['value'] : value.kind === 'listen-and-tap' ? ['selectedId', 'correct'] : []
    const r = fields(value, ['kind', 'stepId', 'wordId', 'at', ...extra])
    const step = steps[index]!
    check(r.kind === step.kind && r.stepId === step.id && r.wordId === step.wordId)
    integer(r.at)
    if (r.kind === 'flashcard') check(r.value === 'know' || r.value === 'not-yet')
    if (r.kind === 'listen-and-tap') {
      text(r.selectedId); bool(r.correct)
      check(r.correct === (r.selectedId === r.wordId))
    }
  })
}

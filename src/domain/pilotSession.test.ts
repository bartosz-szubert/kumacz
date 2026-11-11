import { describe, expect, it } from 'vitest'
import lesson from '../content/english/level-1/animals.json'
import { profile } from '../../tests/fixtures/learningData'
import { applyPilotResult, createPilotSession } from './pilotSession'
import { pilotSteps } from './pilotTypes'

describe('fixed pilot session', () => {
  it('introduces at most three words before nine exercises with two spaced listening rounds', () => {
    const s = createPilotSession(profile(), lesson, 'session-1', 100)
    const steps = pilotSteps(s)
    expect(s.wordIds).toHaveLength(3)
    expect(s.newWordIds).toHaveLength(3)
    expect(steps.slice(0, 3).map((s) => s.kind)).toEqual(['introduction', 'introduction', 'introduction'])
    expect(steps.filter((s) => s.kind === 'flashcard')).toHaveLength(3)
    expect(steps.filter((s) => s.kind === 'listen-and-tap')).toHaveLength(6)
    const listening = steps.filter((s) => s.kind === 'listen-and-tap')
    expect(listening[3]!.wordId).toBe(listening[0]!.wordId)
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length)
  })

  it('initialises introduction in box one using the next local calendar date', () => {
    const p = profile(); const session = createPilotSession(p, lesson, 'session-1', 100)
    const step = pilotSteps(session)[0]!
    const at = new Date(2026, 10, 11, 23, 59).getTime()
    const applied = applyPilotResult({ ...p, pilotSession: session }, lesson, { kind: 'introduction', stepId: step.id, wordId: step.wordId, at })
    expect(applied.profile.progress.words[0]).toMatchObject({ wordId: step.wordId, introduced: true, box: 1, dueOn: '2026-11-12', hasCorrectAnswer: false })
    expect(applied.answers).toEqual([])
    expect(applied.profile.pilotSession?.cursor).toBe(1)
    expect(p.progress.words).toEqual([])
  })

  it.each(['know', 'not-yet'] as const)('keeps %s out of checked history and mastery', (value) => {
    const p = profile(); const session = createPilotSession(p, lesson, 'session-1', 100)
    session.newWordIds = []
    const step = pilotSteps(session)[0]!
    const applied = applyPilotResult({ ...p, pilotSession: session }, lesson,
      { kind: 'flashcard', stepId: step.id, wordId: step.wordId, at: 200, value })
    expect(applied.answers).toEqual([])
    expect(applied.profile.progress).toEqual(p.progress)
  })

  it('stores checked practice with stable attempt IDs and preserves boxes and lesson completion', () => {
    let p = profile(); p.pilotSession = createPilotSession(p, lesson, 'session-1', 100)
    p.pilotSession.newWordIds = []
    p.progress.words = p.pilotSession.wordIds.map((wordId) => ({ wordId, box: 1, dueOn: '2026-11-12',
      introduced: true, unconfirmed: false, lastPromotedOn: null, hasCorrectAnswer: false, hasCorrectListenAndTap: false }))
    for (let i = 0; i < 3; i++) {
      const step = pilotSteps(p.pilotSession!)[p.pilotSession!.cursor]!
      p = applyPilotResult(p, lesson, { kind: 'flashcard', stepId: step.id, wordId: step.wordId, at: 200, value: 'know' }).profile
    }
    const step = pilotSteps(p.pilotSession!)[p.pilotSession!.cursor]!
    const applied = applyPilotResult(p, lesson, { kind: 'listen-and-tap', stepId: step.id, wordId: step.wordId, at: 300, selectedId: step.wordId, correct: true })
    expect(applied.answers[0]).toMatchObject({ id: step.id, exerciseId: step.id, wordId: step.wordId, context: { kind: 'practice', independent: true, attemptNumber: 1 } })
    expect(applied.profile.progress.completedLessonIds).toEqual([])
  })

  it('rejects repeated or foreign step results rather than advancing a second time', () => {
    const p = profile(); p.pilotSession = createPilotSession(p, lesson, 'session-1', 100)
    const step = pilotSteps(p.pilotSession)[0]!
    const event = { kind: 'introduction' as const, stepId: step.id, wordId: step.wordId, at: 200 }
    const applied = applyPilotResult(p, lesson, event)
    expect(() => applyPilotResult(applied.profile, lesson, event)).toThrow()
    expect(() => applyPilotResult(p, lesson, { ...event, wordId: 'other' })).toThrow()
  })
})

describe('pilot practice policy', () => {
  it('spaces corrective retry and carries the final wrong answer into the next fixed session', () => {
    let p = profile(); p.pilotSession = createPilotSession(p, lesson, 'first', 100)
    const target = p.pilotSession.wordIds[0]!
    const checked = []
    for (const step of pilotSteps(p.pilotSession)) {
      const base = { stepId: step.id, wordId: step.wordId, at: 200 }
      const event = step.kind === 'introduction' ? { ...base, kind: 'introduction' as const }
        : step.kind === 'flashcard' ? { ...base, kind: 'flashcard' as const, value: 'not-yet' as const }
        : { ...base, kind: 'listen-and-tap' as const, correct: step.wordId !== target,
          selectedId: step.wordId === target ? lesson.items[0]!.distractorIds[0]! : step.wordId }
      const applied = applyPilotResult(p, lesson, event); p = applied.profile; checked.push(...applied.answers)
    }
    const first = checked.filter((a) => a.wordId === target)
    expect(first.map((a) => a.context)).toEqual([
      { kind: 'practice', attemptNumber: 1, independent: true },
      { kind: 'corrective-retry', attemptNumber: 2, independent: false },
    ])
    const next = createPilotSession(p, lesson, 'second', 300)
    expect(next.wordIds[0]).toBe(target)
    expect(next.attemptOffsets[0]).toBe(2)
    expect(next.newWordIds).toHaveLength(2)
    expect(pilotSteps(next).filter((s) => s.kind !== 'introduction')).toHaveLength(9)
    expect(p.progress.words.every((w) => w.box === 1 && w.dueOn !== null)).toBe(true)
  })
  it('preserves existing skipped-word placement when introducing its picture and pronunciation', () => {
    const p = profile()
    p.progress.words = [{ wordId: lesson.items[0]!.id, box: 3, dueOn: '2026-12-01', introduced: false,
      unconfirmed: true, lastPromotedOn: null, hasCorrectAnswer: false, hasCorrectListenAndTap: false }]
    p.pilotSession = createPilotSession(p, lesson, 'first', 100)
    const step = pilotSteps(p.pilotSession)[0]!
    const applied = applyPilotResult(p, lesson, { kind: 'introduction', stepId: step.id, wordId: step.wordId, at: 200 })
    expect(applied.profile.progress.words[0]).toEqual({ ...p.progress.words[0], introduced: true })
  })
})

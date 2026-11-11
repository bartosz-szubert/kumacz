import { describe, expect, it } from 'vitest'
import { answer, profile } from '../../tests/fixtures/learningData'
import { validateAnswer, validateProfile, validateSettings } from './learningDataValidation'

describe('stored learning data boundary', () => {
  it('accepts the initial format with explicit profile preferences and stable IDs', () => {
    expect(() => validateProfile(profile())).not.toThrow()
    expect(() => validateAnswer(answer())).not.toThrow()
    expect(() => validateSettings({ formatVersion: 1, revision: 0, lastBackupAt: null })).not.toThrow()
  })

  it.each([
    ['newer format', { ...profile(), formatVersion: 2 }],
    ['negative revision', { ...profile(), revision: -1 }],
    ['unknown theme', { ...profile(), theme: 'other' }],
    ['empty nickname', { ...profile(), nickname: ' ' }],
    ['invalid limit', { ...profile(), settings: { dailyLimitMinutes: 0, autoVoiceOver: true } }],
    ['unexpected personal field', { ...profile(), dateOfBirth: '2000-01-01' }],
  ])('rejects %s without silently normalising the document', (_label, input) => {
    expect(() => validateProfile(input)).toThrow()
  })

  it('rejects invalid dates and duplicate stable word IDs in progress', () => {
    const word = {
      wordId: 'english.animal.cat', box: 1, dueOn: '2026-02-30', introduced: true,
      unconfirmed: false, lastPromotedOn: null, hasCorrectAnswer: false, hasCorrectListenAndTap: false,
    }
    expect(() => validateProfile({ ...profile(), progress: {
      words: [word], completedLessonIds: [], completedLevelIds: [],
    } })).toThrow()
    expect(() => validateProfile({ ...profile(), progress: {
      words: [{ ...word, dueOn: '2026-11-11' }, { ...word, dueOn: '2026-11-11' }],
      completedLessonIds: [], completedLevelIds: [],
    } })).toThrow()
  })

  it('rejects object values that coerce to a supported exercise type', () => {
    expect(() => validateAnswer({ ...answer(), exerciseType: new String('listen-and-tap') })).toThrow()
  })

  it.each([
    ['flashcard self-assessment', { ...answer(), exerciseType: 'flashcard' }],
    ['ungraded audio failure', { ...answer(), correct: null }],
    ['non-finite timestamp', { ...answer(), answeredAt: Infinity }],
    ['retry claimed as independent', { ...answer(), context: {
      kind: 'corrective-retry', attemptNumber: 2, independent: true,
    } }],
    ['noninitial independent attempt', { ...answer(), context: {
      kind: 'due-review', attemptNumber: 2, independent: true,
    } }],
  ])('keeps %s out of checked-answer history', (_label, input) => {
    expect(() => validateAnswer(input)).toThrow()
  })
})

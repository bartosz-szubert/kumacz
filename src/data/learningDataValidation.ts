import { ANSWER_FORMAT_VERSION, PROFILE_FORMAT_VERSION, SETTINGS_FORMAT_VERSION } from '../domain/learningData.ts'
import type { AnswerRecord, AppSettings, ProfileDocument } from '../domain/learningData.ts'
import { bool, check, date, fields, ids, integer, text, version } from './validation.ts'
import { validatePilotSession } from './pilotValidation.ts'

export function validateProfile(value: unknown): asserts value is ProfileDocument {
  const p = fields(value, ['formatVersion', 'id', 'revision', 'nickname', 'avatarId', 'theme', 'settings', 'progress', 'pilotSession'])
  version(p.formatVersion, PROFILE_FORMAT_VERSION); integer(p.revision)
  text(p.id); text(p.nickname); text(p.avatarId)
  check(p.theme === 'electric' || p.theme === 'neon')
  const settings = fields(p.settings, ['dailyLimitMinutes', 'autoVoiceOver'])
  check(typeof settings.dailyLimitMinutes === 'number' && Number.isFinite(settings.dailyLimitMinutes) && settings.dailyLimitMinutes > 0)
  bool(settings.autoVoiceOver)
  const progress = fields(p.progress, ['words', 'completedLessonIds', 'completedLevelIds'])
  ids(progress.completedLessonIds); ids(progress.completedLevelIds)
  check(Array.isArray(progress.words))
  const wordIds: string[] = []
  for (const item of progress.words) {
    const word = fields(item, ['wordId', 'box', 'dueOn', 'introduced', 'unconfirmed', 'lastPromotedOn', 'hasCorrectAnswer', 'hasCorrectListenAndTap'])
    text(word.wordId); integer(word.box, 1); check(word.box <= 5)
    date(word.dueOn)
    if (word.lastPromotedOn !== null) date(word.lastPromotedOn)
    bool(word.introduced); bool(word.unconfirmed); bool(word.hasCorrectAnswer); bool(word.hasCorrectListenAndTap)
    wordIds.push(word.wordId)
  }
  check(new Set(wordIds).size === wordIds.length)
  if (p.pilotSession !== null) validatePilotSession(p.pilotSession)
}

export function validateAnswer(value: unknown): asserts value is AnswerRecord {
  const a = fields(value, ['formatVersion', 'id', 'profileId', 'sessionId', 'exerciseId', 'moduleId', 'levelId', 'lessonId', 'wordId', 'answeredAt', 'exerciseType', 'correct', 'context'])
  version(a.formatVersion, ANSWER_FORMAT_VERSION); integer(a.answeredAt)
  for (const key of ['id', 'profileId', 'sessionId', 'exerciseId', 'moduleId', 'levelId', 'lessonId', 'wordId']) text(a[key])
  check(typeof a.exerciseType === 'string' && ['listen-and-tap', 'picture-to-word', 'context'].includes(a.exerciseType))
  bool(a.correct)
  const context = fields(a.context, ['kind', 'attemptNumber', 'independent'])
  check(typeof context.kind === 'string' && ['due-review', 'practice', 'corrective-retry'].includes(context.kind))
  integer(context.attemptNumber, 1); bool(context.independent)
  if (context.independent) check(context.attemptNumber === 1 && context.kind !== 'corrective-retry')
  if (context.kind === 'corrective-retry') check(context.attemptNumber >= 2 && !context.independent)
}

export function validateSettings(value: unknown): asserts value is AppSettings {
  const settings = fields(value, ['formatVersion', 'revision', 'lastBackupAt'])
  version(settings.formatVersion, SETTINGS_FORMAT_VERSION); integer(settings.revision)
  if (settings.lastBackupAt !== null) integer(settings.lastBackupAt)
}

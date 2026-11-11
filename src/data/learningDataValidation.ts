import { DATA_FORMAT_VERSION } from '../domain/learningData.ts'
import type { AnswerRecord, AppSettings, ProfileDocument } from '../domain/learningData.ts'

export class LearningDataError extends Error {
  readonly code: 'invalid-data' | 'unsupported-format' | 'conflict'
  constructor(code: LearningDataError['code']) {
    super(`Learning data: ${code}`)
    this.name = 'LearningDataError'
    this.code = code
  }
}

function check(condition: unknown): asserts condition {
  if (!condition) throw new LearningDataError('invalid-data')
}

function fields(value: unknown, names: string[]): Record<string, unknown> {
  check(value !== null && typeof value === 'object' && !Array.isArray(value))
  const record = value as Record<string, unknown>
  check(Object.keys(record).length === names.length && names.every((name) => Object.hasOwn(record, name)))
  return record
}

export function text(value: unknown): asserts value is string {
  check(typeof value === 'string' && value.trim().length > 0)
}

export function integer(value: unknown, minimum = 0): asserts value is number {
  check(typeof value === 'number' && Number.isSafeInteger(value) && value >= minimum)
}

function bool(value: unknown) { check(typeof value === 'boolean') }
function date(value: unknown) {
  check(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
  const parsed = new Date(`${value}T00:00:00Z`)
  check(Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value)
}

function version(value: unknown) {
  integer(value, 1)
  if (value !== DATA_FORMAT_VERSION) throw new LearningDataError('unsupported-format')
}

function ids(value: unknown) {
  check(Array.isArray(value))
  value.forEach(text)
  check(new Set(value).size === value.length)
}

export function validateProfile(value: unknown): asserts value is ProfileDocument {
  const p = fields(value, ['formatVersion', 'id', 'revision', 'nickname', 'avatarId', 'theme', 'settings', 'progress'])
  version(p.formatVersion); integer(p.revision)
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
}

export function validateAnswer(value: unknown): asserts value is AnswerRecord {
  const a = fields(value, ['formatVersion', 'id', 'profileId', 'sessionId', 'exerciseId', 'moduleId', 'levelId', 'lessonId', 'wordId', 'answeredAt', 'exerciseType', 'correct', 'context'])
  version(a.formatVersion); integer(a.answeredAt)
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
  version(settings.formatVersion); integer(settings.revision)
  if (settings.lastBackupAt !== null) integer(settings.lastBackupAt)
}

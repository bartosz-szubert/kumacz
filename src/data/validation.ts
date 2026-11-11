export class LearningDataError extends Error {
  readonly code: 'invalid-data' | 'unsupported-format' | 'conflict'
  constructor(code: LearningDataError['code']) {
    super(`Learning data: ${code}`)
    this.name = 'LearningDataError'
    this.code = code
  }
}
export function check(condition: unknown): asserts condition {
  if (!condition) throw new LearningDataError('invalid-data')
}
export function object(value: unknown): asserts value is Record<string, unknown> {
  check(value !== null && typeof value === 'object' && !Array.isArray(value))
}
export function fields(value: unknown, names: string[]): Record<string, unknown> {
  object(value)
  check(Object.keys(value).length === names.length && names.every((name) => Object.hasOwn(value, name)))
  return value
}
export function text(value: unknown): asserts value is string { check(typeof value === 'string' && value.trim().length > 0) }
export function integer(value: unknown, minimum = 0): asserts value is number {
  check(typeof value === 'number' && Number.isSafeInteger(value) && value >= minimum)
}
export function bool(value: unknown) { check(typeof value === 'boolean') }
export function date(value: unknown) {
  check(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
  const parsed = new Date(`${value}T00:00:00Z`)
  check(Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value)
}
export function version(value: unknown, expected: number) {
  integer(value, 1)
  if (value !== expected) throw new LearningDataError('unsupported-format')
}
export function ids(value: unknown): asserts value is string[] {
  check(Array.isArray(value)); value.forEach(text)
  check(new Set(value).size === value.length)
}

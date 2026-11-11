import { PROFILE_FORMAT_VERSION } from '../domain/learningData.ts'
import type { ProfileDocument } from '../domain/learningData.ts'
import { validateProfile } from './learningDataValidation.ts'
import { check, object } from './validation.ts'

export function migrateProfile(value: unknown): ProfileDocument {
  object(value)
  if (value.formatVersion === 1) {
    // A legacy document could not contain this field. Never silently discard it.
    check(!Object.hasOwn(value, 'pilotSession'))
    const migrated = { ...value, formatVersion: PROFILE_FORMAT_VERSION, pilotSession: null }
    validateProfile(migrated)
    return migrated
  }
  validateProfile(value)
  return value
}

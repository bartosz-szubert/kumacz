import { describe, expect, it } from 'vitest'
import { answer, profile } from '../../tests/fixtures/learningData.ts'
import { migrateProfile } from './profileMigration.ts'

describe('profile format compatibility', () => {
  it('adds an empty pilot checkpoint to valid v1 data without changing existing progress or revisions', () => {
    const { pilotSession: _pilot, ...rest } = profile()
    const legacy = { ...rest, formatVersion: 1 }
    const migrated = migrateProfile(legacy)
    expect(migrated).toEqual({ ...legacy, formatVersion: 2, pilotSession: null })
    expect(legacy).not.toHaveProperty('pilotSession')
  })

  it('rejects unknown versions and unrecognised legacy fields instead of dropping data', () => {
    expect(() => migrateProfile({ ...profile(), formatVersion: 3 })).toThrow()
    const { pilotSession: _pilot, ...rest } = profile()
    expect(() => migrateProfile({ ...rest, formatVersion: 1, unknown: 'keep me' })).toThrow()
    expect(() => migrateProfile({ ...profile(), formatVersion: 1 })).toThrow()
  })

  it('keeps the answer-history format separate from the profile format', () => {
    expect(answer().formatVersion).toBe(1)
    expect(profile().formatVersion).toBe(2)
  })
})

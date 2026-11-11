import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import clip from '../../src/content/flashcard-instruction.json' with { type: 'json' }
import provenance from './flashcard-audio-provenance.json' with { type: 'json' }

it('bundles the flashcard prompt with matching Polish text, immutable bytes and approved voice provenance', () => {
  const fixture = provenance.fixtures[0]!
  const bytes = readFileSync(resolve(import.meta.dirname, '../..', fixture.path))
  const sha = createHash('sha256').update(bytes).digest('hex')
  expect(clip.text).toBe(fixture.text)
  expect(clip.language).toBe('pl-PL')
  expect(clip.path).toBe(fixture.path.replace(/^public\//, ''))
  expect(clip.path).toContain(sha.slice(0, 12))
  expect(sha).toBe(fixture.mp3Sha256)
  expect(bytes.length).toBe(fixture.mp3Bytes)
  expect(fixture.generationExtra).toEqual({ lang: 'pl' })
  expect([fixture.model, fixture.speakerId, fixture.steps]).toEqual(['supertonic-3-int8', 0, 8])
  expect(provenance.generator.version).toBe('1.13.8')
  expect(fixture.levelsAfterGain.peakDbFS).toBeLessThan(-3)
})

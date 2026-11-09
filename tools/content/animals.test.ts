import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import lesson from '../../src/content/english/level-1/animals.json' with { type: 'json' }
import provenance from './pilot-animals-provenance.json' with { type: 'json' }

const root = resolve(import.meta.dirname, '../..')
const hash = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex')
const clips = [...provenance.fixtures, ...provenance.reusedFixtures]
const lessonClips = [
  lesson.instructions['listen-and-tap'],
  ...lesson.items.flatMap(item => [item.audio.word, item.audio.translation]),
]

describe('the P04 animal lesson', () => {
  it('contains the complete seven-word English/Polish pilot with stable, unique IDs', () => {
    expect(lesson.schemaVersion).toBe(1)
    expect(lesson.id).toBe('english.level-1.animals')
    expect(lesson.moduleId).toBe('english')
    expect(lesson.levelId).toBe('english.level-1')
    expect(lesson.category).toBe('animals')
    expect(lesson.language).toBe('en-GB')
    expect(lesson.translationLanguage).toBe('pl-PL')
    expect(lesson.items).toHaveLength(7)
    expect(new Set(lesson.items.map(item => item.id)).size).toBe(7)
    expect(lesson.items.map(item => [item.word, item.translation])).toEqual([
      ['cat', 'kot'], ['dog', 'pies'], ['fish', 'ryba'], ['frog', 'żaba'],
      ['horse', 'koń'], ['cow', 'krowa'], ['elephant', 'słoń'],
    ])
    for (const item of lesson.items) {
      expect(item.id).toMatch(/^english\.animal\.[a-z]+$/)
      expect(item.exerciseTypes).toEqual(['flashcard', 'listen-and-tap'])
      expect(item.audio.word.text).toBe(item.word)
      expect(item.audio.word.language).toBe(lesson.language)
      expect(item.audio.translation.text).toBe(item.translation)
      expect(item.audio.translation.language).toBe(lesson.translationLanguage)
    }
    expect(lesson.instructions['listen-and-tap'].text).toBe('Posłuchaj i wybierz obrazek.')
    expect(lesson.instructions['listen-and-tap'].language).toBe('pl-PL')
  })

  it('provides three distinct same-lesson choices without a curated confusable pair (F-09, F-40)', () => {
    const ids = new Set(lesson.items.map(item => item.id))
    for (const pair of lesson.confusablePairs) {
      expect(pair).toHaveLength(2)
      expect(new Set(pair).size).toBe(2)
      for (const id of pair) expect(ids.has(id)).toBe(true)
    }
    for (const item of lesson.items) {
      const choices = [item.id, ...item.distractorIds]
      expect(choices).toHaveLength(3)
      expect(new Set(choices).size).toBe(3)
      for (const id of choices) expect(ids.has(id)).toBe(true)
      for (const pair of lesson.confusablePairs) {
        expect(pair.every(id => choices.includes(id)), `${item.word}: ${pair.join(', ')}`).toBe(false)
      }
    }
  })

  it('resolves every picture and audio reference to one hash-verified local asset', () => {
    expect(new Set(clips.map(clip => clip.id)).size).toBe(clips.length)
    expect(new Set(provenance.pictures.assets.map(asset => asset.id)).size).toBe(7)
    expect(new Set(lesson.items.map(item => item.picture.id)).size).toBe(7)
    expect(lessonClips).toHaveLength(15)
    expect(new Set(lessonClips.map(clip => clip.id)).size).toBe(15)
    expect(new Set(clips.map(clip => clip.id))).toEqual(new Set(lessonClips.map(clip => clip.id)))
    for (const clip of lessonClips) {
      const source = clips.find(asset => asset.id === clip.id)
      expect(source, clip.id).toBeDefined()
      expect(clip.path).toMatch(/^assets\/audio\/[a-zA-Z0-9./-]+\.mp3$/)
      expect(clip.path).not.toContain('..')
      expect(source).toMatchObject({ text: clip.text, language: clip.language, path: `public/${clip.path}` })
      expect(hash(`public/${clip.path}`)).toBe(source!.mp3Sha256)
    }
    for (const item of lesson.items) {
      const source = provenance.pictures.assets.find(asset => asset.id === item.picture.id)
      expect(source, item.picture.id).toBeDefined()
      expect(item.picture.path).toMatch(/^assets\/pictures\/twemoji\/[a-f0-9]+\.[a-f0-9]{12}\.svg$/)
      expect(source!.path).toBe(`public/${item.picture.path}`)
      expect(hash(source!.path)).toBe(source!.sha256)
      expect(item.picture.path).toContain(source!.sha256.slice(0, 12))
    }
    for (const clip of provenance.fixtures) {
      expect(clip.path).toContain(clip.mp3Sha256.slice(0, 12))
      expect(clip.mp3DurationSeconds).toBeGreaterThan(0)
      expect(clip.mp3DurationSeconds).toBeLessThan(5)
    }
    expect(hash(provenance.reviewAudio.path)).toBe(provenance.reviewAudio.mp3Sha256)
  })
})

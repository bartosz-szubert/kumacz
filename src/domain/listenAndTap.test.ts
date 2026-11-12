import { describe, expect, it } from 'vitest'
import { checkChoice, createChoiceQuestion } from './listenAndTap.ts'

describe('listen-and-tap choices', () => {
  it('varies the target position without changing the curated choice set or input', () => {
    const distractors = ['fish', 'frog']
    const positions = new Set<number>()
    for (const draws of [[0, 0], [0.99, 0], [0.5, 0.99]]) {
      let draw = 0
      const q = createChoiceQuestion('q1', 'cat', distractors, () => draws[draw++]!)
      expect([...q.optionIds].sort()).toEqual(['cat', 'fish', 'frog'])
      positions.add(q.optionIds.indexOf('cat'))
    }
    expect(positions).toEqual(new Set([0, 1, 2]))
    expect(distractors).toEqual(['fish', 'frog'])
  })

  it.each([['cat', 'fish'], ['fish', 'fish'], ['fish'], ['a', 'b', 'c', 'd']])('refuses an invalid choice set %j', (...ids) => {
    expect(() => createChoiceQuestion('q', 'cat', ids)).toThrow()
  })

  it('checks stable IDs and ignores a choice outside the question', () => {
    const q = createChoiceQuestion('q1', 'cat', ['fish', 'frog'])
    expect(checkChoice(q, 'cat')).toEqual({ questionId: 'q1', wordId: 'cat', selectedId: 'cat', correct: true })
    expect(checkChoice(q, 'fish')?.correct).toBe(false)
    expect(checkChoice(q, 'dog')).toBeUndefined()
  })
})

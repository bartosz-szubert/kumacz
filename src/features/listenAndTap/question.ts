import type { Lesson } from '../../content/lesson.ts'
import { createChoiceQuestion } from '../../domain/listenAndTap.ts'

export function buildListenAndTap(lesson: Lesson, wordId: string, id: string, random = Math.random) {
  const target = lesson.items.find((item) => item.id === wordId)
  if (!target) throw new Error('Word is not in this lesson')
  const question = createChoiceQuestion(id, wordId, target.distractorIds, random)
  const options = question.optionIds.map((id) => {
    const item = lesson.items.find((item) => item.id === id)
    if (!item) throw new Error('Choice is not in this lesson')
    return item
  })
  if (lesson.confusablePairs.some((pair) => pair.every((id) => question.optionIds.includes(id)))) {
    throw new Error('Confusable pictures cannot share a question')
  }
  return { question, target, options, instruction: lesson.instructions['listen-and-tap'] }
}

export type ListenAndTapView = ReturnType<typeof buildListenAndTap>

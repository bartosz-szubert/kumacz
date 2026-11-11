export interface ChoiceQuestion {
  readonly id: string
  readonly wordId: string
  readonly optionIds: readonly string[]
}

export interface CheckedChoice {
  readonly questionId: string
  readonly wordId: string
  readonly selectedId: string
  readonly correct: boolean
}

export function createChoiceQuestion(id: string, wordId: string, distractors: readonly string[], random = Math.random): ChoiceQuestion {
  const optionIds = [wordId, ...distractors]
  if (!id || optionIds.some((id) => !id) || optionIds.length < 3 || optionIds.length > 4 || new Set(optionIds).size !== optionIds.length) {
    throw new Error('A question requires three or four distinct choices')
  }
  // Fisher–Yates: preserve the curated set while varying every answer position.
  for (let i = optionIds.length - 1; i > 0; i--) {
    const draw = random()
    if (!Number.isFinite(draw) || draw < 0 || draw >= 1) throw new Error('Invalid random draw')
    const j = Math.floor(draw * (i + 1))
    ;[optionIds[i], optionIds[j]] = [optionIds[j]!, optionIds[i]!]
  }
  return { id, wordId, optionIds }
}

export function checkChoice(question: ChoiceQuestion, selectedId: string): CheckedChoice | undefined {
  if (!question.optionIds.includes(selectedId)) return undefined
  return { questionId: question.id, wordId: question.wordId, selectedId, correct: selectedId === question.wordId }
}

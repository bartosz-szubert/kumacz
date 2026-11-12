export type SelfAssessment = 'know' | 'not-yet'

export interface FlashcardResult {
  readonly kind: 'self-assessment'
  readonly cardId: string
  readonly wordId: string
  readonly value: SelfAssessment
}

// Self-report is deliberately a different result type from a checked answer (D-33).
export function selfAssessFlashcard(cardId: string, wordId: string, value: SelfAssessment): FlashcardResult | undefined {
  if (value !== 'know' && value !== 'not-yet') return undefined
  return { kind: 'self-assessment', cardId, wordId, value }
}

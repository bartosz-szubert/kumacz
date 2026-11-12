import type { SelfAssessment } from './flashcards.ts'

export interface PilotStep {
  id: string
  kind: 'introduction' | 'flashcard' | 'listen-and-tap'
  wordId: string
  attempt: number
}

export type PilotResult = { stepId: string; wordId: string; at: number } & (
  | { kind: 'introduction' }
  | { kind: 'flashcard'; value: SelfAssessment }
  | { kind: 'listen-and-tap'; selectedId: string; correct: boolean }
)

export interface PilotSession {
  id: string
  planVersion: 1
  lessonId: string
  wordIds: string[]
  newWordIds: string[]
  attemptOffsets: number[]
  startedAt: number
  cursor: number
  results: PilotResult[]
}

// Version 1 is the owner-selected fixed pilot, independently of future MVP planning.
export function pilotSteps(session: Pick<PilotSession, 'id' | 'newWordIds' | 'wordIds'>): PilotStep[] {
  const step = (kind: PilotStep['kind'], wordId: string, attempt = 0): PilotStep =>
    ({ id: `${session.id}:${kind}:${wordId}:${attempt}`, kind, wordId, attempt })
  return [
    ...session.newWordIds.map((id) => step('introduction', id)),
    ...session.wordIds.map((id) => step('flashcard', id)),
    ...[1, 2].flatMap((round) => session.wordIds.map((id) => step('listen-and-tap', id, round))),
  ]
}

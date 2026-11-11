import type { AnswerRecord, ProfileDocument } from '../../src/domain/learningData.ts'

// Invented fixtures only; never copy a child's real profile or progress here.
export function profile(id = 'test-a'): ProfileDocument {
  return {
    formatVersion: 2, id, revision: 0, nickname: 'Profil testowy', avatarId: 'avatar.frog',
    theme: 'electric', settings: { dailyLimitMinutes: 30, autoVoiceOver: true },
    progress: { words: [], completedLessonIds: [], completedLevelIds: [] },
    pilotSession: null,
  }
}

export function answer(id = 'answer-1', profileId = 'test-a'): AnswerRecord {
  return {
    formatVersion: 1, id, profileId, sessionId: 'session-test', exerciseId: 'exercise-1',
    moduleId: 'english', levelId: 'english.level-1', lessonId: 'english.level-1.animals',
    wordId: 'english.animal.cat', answeredAt: Date.UTC(2026, 10, 10),
    exerciseType: 'listen-and-tap', correct: true,
    context: { kind: 'due-review', attemptNumber: 1, independent: true },
  }
}

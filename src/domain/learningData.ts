import type { Theme } from './theme.ts'

export const DATA_FORMAT_VERSION = 1

export interface WordProgress {
  wordId: string
  box: 1 | 2 | 3 | 4 | 5
  dueOn: string // Local calendar date, YYYY-MM-DD; scheduling belongs to P13.
  introduced: boolean
  unconfirmed: boolean
  lastPromotedOn: string | null
  hasCorrectAnswer: boolean
  hasCorrectListenAndTap: boolean
}

export interface ProfileDocument {
  formatVersion: typeof DATA_FORMAT_VERSION
  id: string
  revision: number // 0 for a new document; successful writes return the next revision.
  nickname: string
  avatarId: string
  theme: Theme
  settings: { dailyLimitMinutes: number; autoVoiceOver: boolean }
  progress: {
    words: WordProgress[]
    completedLessonIds: string[]
    completedLevelIds: string[]
  }
}

export interface AnswerRecord {
  formatVersion: typeof DATA_FORMAT_VERSION
  id: string
  profileId: string
  sessionId: string
  exerciseId: string
  moduleId: string
  levelId: string
  lessonId: string
  wordId: string
  answeredAt: number // Epoch milliseconds, also used for rolling 90-day retention.
  exerciseType: 'listen-and-tap' | 'picture-to-word' | 'context'
  correct: boolean
  context: {
    kind: 'due-review' | 'practice' | 'corrective-retry'
    attemptNumber: number
    independent: boolean // Initial answer, before feedback or revealing the solution.
  }
}

export interface AppSettings {
  formatVersion: typeof DATA_FORMAT_VERSION
  revision: number
  lastBackupAt: number | null
}

export interface LearningData {
  listProfiles(): Promise<ProfileDocument[]>
  getProfile(id: string): Promise<ProfileDocument | undefined>
  saveProfile(profile: ProfileDocument, answers?: readonly AnswerRecord[], options?: { signal?: AbortSignal }): Promise<ProfileDocument>
  deleteProfile(id: string, revision: number): Promise<void>
  getAnswers(profileId: string): Promise<AnswerRecord[]>
  getSettings(): Promise<AppSettings | undefined>
  saveSettings(settings: AppSettings): Promise<AppSettings>
  close(): void
}

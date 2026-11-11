import type { AudioClip } from '../audio/types'

export interface LessonItem {
  id: string
  word: string
  translation: string
  picture: { id: string; path: string }
  audio: { word: AudioClip; translation: AudioClip }
  distractorIds: readonly string[]
}

export interface Lesson {
  id: string
  title: string
  instructions: { 'listen-and-tap': AudioClip }
  items: readonly LessonItem[]
  confusablePairs: readonly (readonly string[])[]
}

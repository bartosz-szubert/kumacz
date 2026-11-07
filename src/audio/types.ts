export interface AudioClip {
  id: string
  language: string
  text: string
  path: string
}

export type AudioSource = 'file' | 'local'
export type AudioOutcome =
  | { status: 'played'; source: AudioSource }
  | { status: 'unavailable' | 'cancelled' }

export type AudioState =
  | { status: 'idle' }
  | { status: 'loading' | 'unavailable'; clipId: string }
  | { status: 'playing' | 'finished'; clipId: string; source: AudioSource }

export interface AudioRuntime {
  playFile(clip: AudioClip, signal: AbortSignal, started: () => void): Promise<void>
  speakLocal(clip: AudioClip, signal: AbortSignal, started: () => void): Promise<void>
  close(): Promise<void>
}

export interface AudioAssets {
  load(path: string, signal: AbortSignal): Promise<ArrayBuffer>
  remember(path: string, bytes: ArrayBuffer): Promise<void>
  remove(path: string): Promise<void>
}

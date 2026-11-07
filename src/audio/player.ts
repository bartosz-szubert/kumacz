import type { AudioClip, AudioOutcome, AudioRuntime, AudioSource, AudioState } from './types'

// Operational startup deadline, not a learning/session time limit.
const START_TIMEOUT_MS = 10_000

export function createAudioPlayer(runtime: AudioRuntime) {
  let state: AudioState = { status: 'idle' }
  let current: AbortController | undefined
  const listeners = new Set<() => void>()
  const publish = (next: AudioState) => {
    state = next
    listeners.forEach((listener) => listener())
  }

  function stop() {
    current?.abort()
    current = undefined
    publish({ status: 'idle' })
  }

  async function play(clip: AudioClip): Promise<AudioOutcome> {
    stop()
    const request = new AbortController()
    current = request

    async function attempt(source: AudioSource) {
      request.signal.throwIfAborted()
      const operation = new AbortController()
      const cancel = () => operation.abort()
      request.signal.addEventListener('abort', cancel, { once: true })
      const timer = setTimeout(cancel, START_TIMEOUT_MS)
      try {
        await new Promise<void>((resolve, reject) => {
          const aborted = () => {
            operation.signal.removeEventListener('abort', aborted)
            reject(new DOMException('Audio interrupted', 'AbortError'))
          }
          operation.signal.addEventListener('abort', aborted, { once: true })
          const started = () => {
            clearTimeout(timer)
            if (!request.signal.aborted && !operation.signal.aborted) {
              publish({ status: 'playing', clipId: clip.id, source })
            }
          }
          operation.signal.throwIfAborted()
          const playback = source === 'file'
            ? runtime.playFile(clip, operation.signal, started)
            : runtime.speakLocal(clip, operation.signal, started)
          playback.then(resolve, reject).finally(() => {
            operation.signal.removeEventListener('abort', aborted)
          })
        })
        request.signal.throwIfAborted()
        operation.signal.throwIfAborted()
      } finally {
        clearTimeout(timer)
        request.signal.removeEventListener('abort', cancel)
        operation.abort()
      }
    }

    for (const source of ['file', 'local'] as const) {
      publish({ status: 'loading', clipId: clip.id })
      try {
        await attempt(source)
        publish({ status: 'finished', clipId: clip.id, source })
        return { status: 'played', source }
      } catch {
        if (request.signal.aborted) return { status: 'cancelled' }
      }
    }
    publish({ status: 'unavailable', clipId: clip.id })
    return { status: 'unavailable' }
  }

  return {
    play,
    stop,
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    async close() { stop(); await runtime.close() },
  }
}

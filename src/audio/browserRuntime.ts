import { selectLocalVoice } from './voices'
import type { AudioAssets, AudioRuntime } from './types'

export function createBrowserAudioRuntime(assets: AudioAssets): AudioRuntime {
  let context: AudioContext | undefined
  let activeSpeech: SpeechSynthesisUtterance | undefined

  return {
    playFile(clip, signal, started) {
      return new Promise<void>((resolve, reject) => {
        let source: AudioBufferSourceNode | undefined
        let settled = false
        let audio: AudioContext | undefined
        const finish = (error?: unknown) => {
          if (settled) return
          settled = true
          signal.removeEventListener('abort', aborted)
          audio?.removeEventListener('statechange', interrupted)
          if (source) {
            source.onended = null
            try { source.stop() } catch { /* start() may have failed. */ }
            source.disconnect()
          }
          if (error) reject(error)
          else resolve()
        }
        const aborted = () => finish(new DOMException('Audio interrupted', 'AbortError'))
        const interrupted = () => {
          if (source && audio?.state !== 'running') finish(new Error('Audio context interrupted'))
        }
        signal.addEventListener('abort', aborted, { once: true })
        // Begin resume synchronously in the tap handler, before network/decode awaits.
        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume
        void (async () => {
          signal.throwIfAborted()
          if (!context || context.state === 'closed') context = new AudioContext()
          audio = context
          const unlocking = audio.state === 'running' ? Promise.resolve() : audio.resume()
          const [, bytes] = await Promise.all([unlocking, assets.load(clip.path, signal)])
          signal.throwIfAborted()
          let buffer: AudioBuffer
          try {
            // decodeAudioData requires the full file and may detach its input buffer.
            // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
            buffer = await audio.decodeAudioData(bytes.slice(0))
          } catch (error) {
            if (!signal.aborted) await assets.remove(clip.path)
            throw error
          }
          signal.throwIfAborted()
          if (audio.state !== 'running' || buffer.duration <= 0) throw new Error('Audio not ready')
          source = audio.createBufferSource()
          source.buffer = buffer
          source.connect(audio.destination)
          source.onended = () => finish()
          audio.addEventListener('statechange', interrupted)
          source.start()
          started()
          // Keep cache writes out of the critical playback path; no offline-ready claim.
          void assets.remember(clip.path, bytes).catch(() => {})
        })().catch(finish)
      })
    },
    speakLocal(clip, signal, started) {
      return new Promise<void>((resolve, reject) => {
        signal.throwIfAborted()
        if (!('speechSynthesis' in globalThis) || !('SpeechSynthesisUtterance' in globalThis)) {
          throw new Error('Local speech is unavailable')
        }
        const synth = globalThis.speechSynthesis
        // Re-read on every retry: voices may be populated asynchronously (voiceschanged).
        const voice = selectLocalVoice(synth.getVoices(), clip.language)
        if (!voice) throw new Error('No eligible local voice')
        const utterance = new SpeechSynthesisUtterance(clip.text)
        utterance.voice = voice
        utterance.lang = voice.lang
        activeSpeech = utterance
        let settled = false
        let began = false
        const finish = (error?: unknown) => {
          if (settled) return
          settled = true
          signal.removeEventListener('abort', aborted)
          utterance.onstart = null
          utterance.onend = null
          utterance.onerror = null
          if (activeSpeech === utterance) activeSpeech = undefined
          if (error) { synth.cancel(); reject(error) }
          else resolve()
        }
        const aborted = () => finish(new DOMException('Speech interrupted', 'AbortError'))
        signal.addEventListener('abort', aborted, { once: true })
        utterance.onstart = () => { began = true; started() }
        utterance.onend = () => finish(began ? undefined : new Error('Speech did not start'))
        utterance.onerror = () => finish(new Error('Local speech failed'))
        try { synth.speak(utterance) } catch (error) { finish(error) }
      })
    },
    async close() {
      const closing = context
      context = undefined
      if (closing && closing.state !== 'closed') await closing.close()
    },
  }
}

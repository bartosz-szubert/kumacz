import type { AudioAssets } from '../audio/types'

export const AUDIO_CACHE_NAME = 'kumacz-audio-v1'

function isCompleteMp3(response: Response) {
  const mime = response.headers.get('Content-Type')?.split(';')[0]?.trim().toLowerCase()
  return response.status === 200 && (mime === 'audio/mpeg' || mime === 'audio/mp3')
}

// Only this boundary accesses Cache Storage. P36 will integrate the full precache.
export function createAudioAssets(base: URL): AudioAssets {
  function urlFor(path: string) {
    const url = new URL(path, base)
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname + 'assets/audio/')) {
      throw new Error('Audio must be a bundled same-origin asset')
    }
    return url.href
  }

  async function cache() {
    try { return await globalThis.caches?.open(AUDIO_CACHE_NAME) }
    catch { return undefined }
  }

  return {
    async load(path, signal) {
      const url = urlFor(path)
      try {
        const store = await cache()
        const cached = await store?.match(url)
        if (cached && isCompleteMp3(cached)) {
          const bytes = await cached.arrayBuffer()
          signal.throwIfAborted()
          return bytes
        }
        if (cached) await store?.delete(url)
      }
      catch { /* Cache refusal must not block online audio. */ }
      signal.throwIfAborted()
      const response = await fetch(url, { signal, cache: 'no-store', credentials: 'omit', redirect: 'error' })
      // Reject partial data and HTML error pages before decoding or remembering them.
      if (!isCompleteMp3(response)) {
        throw new Error('A complete MP3 response is required')
      }
      return response.arrayBuffer()
    },
    async remember(path, bytes) {
      const url = urlFor(path)
      try {
        await (await cache())?.put(url, new Response(bytes.slice(0), {
          headers: { 'Content-Type': 'audio/mpeg' },
        }))
      } catch { /* Optional asset caching must not interrupt playback. */ }
    },
    async remove(path) {
      const url = urlFor(path)
      try { await (await cache())?.delete(url) }
      catch { /* Retry may still use the network or a local voice. */ }
    },
  }
}

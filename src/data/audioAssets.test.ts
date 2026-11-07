import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAudioAssets } from './audioAssets'

afterEach(() => vi.unstubAllGlobals())

describe('bundled MP3 loading', () => {
  it('rejects external URLs before a request can leave the app', async () => {
    const requests: string[] = []
    vi.stubGlobal('fetch', async (url: string) => { requests.push(url); return new Response() })
    const assets = createAudioAssets(new URL('https://example.test/kumacz/'))
    await expect(assets.load('https://other.test/audio.mp3', new AbortController().signal)).rejects.toThrow('bundled')
    expect(requests).toEqual([])
  })

  it('discards an invalid cached response and fetches the complete file immediately', async () => {
    const entries = new Map([['https://example.test/kumacz/assets/audio/red.mp3', new Response('partial', {
      status: 206, headers: { 'Content-Type': 'audio/mpeg' },
    })]])
    vi.stubGlobal('caches', { open: async () => ({
      match: async (url: string) => entries.get(url),
      delete: async (url: string) => entries.delete(url),
    }) })
    vi.stubGlobal('fetch', async () => new Response('complete', { headers: { 'Content-Type': 'audio/mpeg' } }))
    const assets = createAudioAssets(new URL('https://example.test/kumacz/'))
    const bytes = await assets.load('assets/audio/red.mp3', new AbortController().signal)
    expect(new TextDecoder().decode(bytes)).toBe('complete')
    expect(entries.size).toBe(0)
  })

  it('continues online when Cache Storage is refused', async () => {
    vi.stubGlobal('caches', { open: async () => { throw new Error('Storage denied') } })
    vi.stubGlobal('fetch', async () => new Response('audio', { headers: { 'Content-Type': 'audio/mpeg' } }))
    const assets = createAudioAssets(new URL('https://example.test/kumacz/'))
    const bytes = await assets.load('assets/audio/red.mp3', new AbortController().signal)
    expect(new TextDecoder().decode(bytes)).toBe('audio')
    await expect(assets.remember('assets/audio/red.mp3', bytes)).resolves.toBeUndefined()
  })

  it('recovers online even when deleting an invalid cache entry is refused', async () => {
    vi.stubGlobal('caches', { open: async () => ({
      match: async () => new Response('partial', { status: 206, headers: { 'Content-Type': 'audio/mpeg' } }),
      delete: async () => { throw new Error('Cache deletion refused') },
    }) })
    vi.stubGlobal('fetch', async () => new Response('complete', { headers: { 'Content-Type': 'audio/mpeg' } }))
    const assets = createAudioAssets(new URL('https://example.test/kumacz/'))
    const bytes = await assets.load('assets/audio/red.mp3', new AbortController().signal)
    expect(new TextDecoder().decode(bytes)).toBe('complete')
  })

  it('rejects successful HTML error pages instead of caching them as audio', async () => {
    vi.stubGlobal('caches', undefined)
    vi.stubGlobal('fetch', async () => new Response('<html>not found</html>', { headers: { 'Content-Type': 'text/html' } }))
    const assets = createAudioAssets(new URL('https://example.test/kumacz/'))
    await expect(assets.load('assets/audio/missing.mp3', new AbortController().signal)).rejects.toThrow('complete MP3')
  })
})

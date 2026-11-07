import { useEffect, useState, useSyncExternalStore } from 'react'
import { createAudioAssets } from '../data/audioAssets'
import { createBrowserAudioRuntime } from './browserRuntime'
import { createAudioPlayer } from './player'

export function useAudioPlayer() {
  const [player] = useState(() => createAudioPlayer(createBrowserAudioRuntime(
    createAudioAssets(new URL(import.meta.env.BASE_URL, window.location.origin)),
  )))
  // Stable subscription/snapshot functions bridge the non-React player state.
  // https://react.dev/reference/react/useSyncExternalStore
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot)
  useEffect(() => {
    const hidden = () => { if (document.hidden) player.stop() }
    window.addEventListener('pagehide', player.stop)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      window.removeEventListener('pagehide', player.stop)
      document.removeEventListener('visibilitychange', hidden)
      void player.close().catch(() => {})
    }
  }, [player])
  return { state, play: player.play, stop: player.stop }
}

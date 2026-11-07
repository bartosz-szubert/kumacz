import samples from '../content/audio-samples.json'
import { useAudioPlayer } from '../audio/useAudioPlayer'
import type { AudioState } from '../audio/types'

function statusText(state: AudioState, id: string) {
  if (state.status === 'idle' || state.clipId !== id) return 'Naciśnij, aby posłuchać.'
  switch (state.status) {
    case 'loading': return 'Przygotowuję nagranie…'
    case 'playing': return 'Słuchaj…'
    case 'finished': return state.source === 'file' ? 'Odtworzono nagranie.' : 'Odtworzono głosem urządzenia.'
    case 'unavailable': return 'Nie można odtworzyć nagrania. Spróbuj ponownie.'
  }
}

export function App() {
  const audio = useAudioPlayer()
  return (
    <main>
      <header>
        <p className="app-name">Kumacz</p>
        <h1>Sprawdź dźwięk</h1>
        <p>Posłuchaj słowa i polecenia.</p>
      </header>
      <div className="audio-samples">
        {samples.map((clip) => {
          const active = audio.state.status !== 'idle' && audio.state.clipId === clip.id
          const busy = active && (audio.state.status === 'playing' || audio.state.status === 'loading')
          const failed = active && audio.state.status === 'unavailable'
          return (
            <section className="audio-sample" key={clip.id} aria-labelledby={clip.id + '-title'}>
              <h2 id={clip.id + '-title'}>{clip.title}</h2>
              <p className="sample-text" lang={clip.language}>{clip.text}</p>
              <div className="audio-controls">
                <p className="audio-label">Nagranie syntetyczne</p>
                <div className="buttons">
                  <button type="button" onClick={() => { void audio.play(clip) }}>
                    {failed ? 'Spróbuj ponownie' : 'Posłuchaj'}
                  </button>
                  <button type="button" className="secondary" disabled={!busy} onClick={audio.stop}>
                    Zatrzymaj
                  </button>
                </div>
              </div>
              <p className="playback-status" role="status" aria-live="polite">{statusText(audio.state, clip.id)}</p>
            </section>
          )
        })}
      </div>
      <details className="credits">
        <summary>O nagraniach</summary>
        <p>Wszystkie nagrania są syntetyczne i zostały przygotowane lokalnie.</p>
        <p>Angielski: Cori (Bryce Beattie), model udostępniony jako public domain.</p>
        <p>Polski: Supertonic 3 (Supertone), preset 0. Model udostępniony na licencji BigScience Open RAIL-M.</p>
        <p>
          <a href="https://brycebeattie.com/files/tts/">Źródło głosu Cori</a>{' · '}
          <a href="https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE">Licencja modelu Supertonic</a>
        </p>
      </details>
    </main>
  )
}

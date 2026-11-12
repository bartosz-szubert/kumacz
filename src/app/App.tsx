import { useRef, useState } from 'react'
import samples from '../content/audio-samples.json'
import lesson from '../content/english/level-1/animals.json'
import { useAudioPlayer } from '../audio/useAudioPlayer'
import type { AudioState } from '../audio/types'
import type { Theme } from '../domain/theme'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { ThemeSelector } from '../components/ThemeSelector'
import { ListenAndTap } from '../features/listenAndTap/ListenAndTap'
import { createListenAndTap } from '../features/listenAndTap/controller'
import type { ListenAndTapController } from '../features/listenAndTap/controller'
import { buildListenAndTap } from '../features/listenAndTap/question'

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
  // Test-screen preview; actual profile/session integration starts in P09.
  const [theme, setTheme] = useState<Theme>('electric')
  const [exercise, setExercise] = useState<{ index: number; controller: ListenAndTapController } | null>(null)
  const previewNumber = useRef(0)
  function launchExercise(index: number) {
    if (exercise) exercise.controller.dispose()
    else audio.stop()
    const item = lesson.items[index]!
    const view = buildListenAndTap(lesson, item.id, `preview.${++previewNumber.current}`)
    const controller = createListenAndTap(view, audio)
    setExercise({ index, controller })
    // Begin playback in the entry/continue tap, before any await (P03/D-60).
    void controller.start()
  }
  return (
    <AppShell theme={theme} actions={exercise ? undefined : <ThemeSelector theme={theme} onChange={setTheme} />} footer={
      <details className="credits">
        <summary>O nagraniach</summary>
        <p>Wszystkie nagrania są syntetyczne i zostały przygotowane lokalnie.</p>
        <p>Angielski: Cori (Bryce Beattie), model udostępniony jako public domain.</p>
        <p>Polski: Supertonic 3 (Supertone), preset 0. Model udostępniony na licencji BigScience Open RAIL-M.</p>
        <p className="credit-links">
          <a href="https://brycebeattie.com/files/tts/">Źródło głosu Cori</a>
          <a href="https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE">Licencja modelu Supertonic</a>
        </p>
        <p>Obrazki: Twemoji, Twitter, Inc. i inni współtwórcy, CC BY 4.0.</p>
        <a href={import.meta.env.BASE_URL + 'assets/NOTICE.txt'}>Źródła i licencje obrazków</a>
      </details>
    }>
      {exercise ? <>
        <div className="exercise-navigation"><Button tone="secondary" onClick={() => {
          exercise.controller.dispose(); setExercise(null)
        }}>Wróć do dźwięku</Button></div>
        <ListenAndTap key={exercise.controller.view.question.id} controller={exercise.controller}
          onNext={() => launchExercise((exercise.index + 1) % lesson.items.length)} />
      </> : <>
      <header className="page-heading">
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
                  <Button onClick={() => { void audio.play(clip) }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5 3.5 16 10 5 16.5z" /></svg>
                    {failed ? 'Spróbuj ponownie' : 'Posłuchaj'}
                  </Button>
                  <Button tone="secondary" disabled={!busy} onClick={audio.stop}>
                    Zatrzymaj
                  </Button>
                </div>
              </div>
              <p className="playback-status" role="status" aria-live="polite">{statusText(audio.state, clip.id)}</p>
            </section>
          )
        })}
      </div>
      <div className="exercise-navigation"><Button onClick={() => launchExercise(0)}>Wypróbuj ćwiczenie</Button></div>
      </>}
    </AppShell>
  )
}

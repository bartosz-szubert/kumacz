import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Button } from '../../components/Button'
import type { CheckedChoice } from '../../domain/listenAndTap.ts'
import type { ListenAndTapController } from './controller.ts'
import './listenAndTap.css'

type State = ReturnType<ListenAndTapController['getSnapshot']>
function statusText(state: State) {
  if (state.playing) return {
    word: 'Słuchaj słowa…', instruction: 'Słuchaj polecenia…',
    feedback: 'Posłuchaj właściwego słowa…', translation: 'Słuchaj tłumaczenia…',
  }[state.playing]
  if (state.audioError) return {
    word: 'Nie udało się odtworzyć słowa. Spróbuj ponownie.',
    instruction: 'Nie udało się odtworzyć polecenia. Spróbuj ponownie.',
    feedback: 'Nie udało się odtworzyć odpowiedzi. Możesz posłuchać jeszcze raz.',
    translation: 'Nie udało się odtworzyć tłumaczenia. Spróbuj ponownie.',
  }[state.audioError]
  if (state.answer) return 'Możesz przejść dalej.'
  return state.heard ? 'Wybierz pasujący obrazek.' : 'Posłuchaj słowa, aby wybrać obrazek.'
}

interface Props {
  controller: ListenAndTapController
  onNext(): void
  onChecked?(answer: CheckedChoice): void
}

export function ListenAndTap({ controller, onNext, onChecked }: Props) {
  // Same immutable snapshot/subscription bridge as the existing P03 audio player.
  // https://react.dev/reference/react/useSyncExternalStore
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const heading = useRef<HTMLHeadingElement>(null)
  const feedback = useRef<HTMLHeadingElement>(null)
  const feedbackPanel = useRef<HTMLDivElement>(null)
  const [loadedPictures, setLoadedPictures] = useState<Set<string>>(() => new Set())
  const [pictureError, setPictureError] = useState(false)
  const [pictureAttempt, setPictureAttempt] = useState(0)
  const { view } = controller
  useEffect(() => { heading.current?.focus() }, [controller])
  useEffect(() => {
    if (!state.answer) return
    feedback.current?.focus({ preventScroll: true })
    feedbackPanel.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [state.answer])
  const busy = state.playing !== null
  const picturesReady = !pictureError && loadedPictures.size === view.options.length
  const canChoose = state.heard && !busy && !state.answer && picturesReady
  return (
    <section className="listen-exercise" aria-labelledby="listen-title">
      <header className="page-heading">
        <h1 id="listen-title" tabIndex={-1} ref={heading}>Posłuchaj i wybierz</h1>
        <p id="listen-instruction">{view.instruction.text}</p>
      </header>
      <div className="listen-audio">
        <p className="audio-label">Nagranie syntetyczne</p>
        <div className="buttons">
          <Button disabled={busy} onClick={() => { void controller.playWord() }}>
            {state.audioError === 'word' ? 'Spróbuj ponownie' : 'Posłuchaj słowa'}
          </Button>
          <Button tone="secondary" disabled={busy} onClick={() => { void controller.playInstruction() }}>Posłuchaj polecenia</Button>
        </div>
        <p id="listen-status" role="status" className="playback-status">{statusText(state)}</p>
      </div>
      <div id="picture-status" aria-live="polite">
        {pictureError ? <>
          <p>Nie udało się wczytać obrazków.</p>
          <Button tone="secondary" onClick={() => {
            setLoadedPictures(new Set()); setPictureError(false); setPictureAttempt((attempt) => attempt + 1)
          }}>Wczytaj obrazki ponownie</Button>
        </> : !picturesReady && <p>Wczytuję obrazki…</p>}
      </div>
      <div className="picture-choices" role="group" aria-label="Obrazki do wyboru" aria-describedby="listen-instruction listen-status picture-status">
        {view.options.map((option, index) => {
          const correct = state.answer ? option.id === view.target.id : undefined
          const selected = state.answer?.selectedId === option.id
          return (
            <Button key={option.id} tone="secondary" className="picture-choice" disabled={!canChoose}
              data-choice-id={option.id} data-correct={correct} data-selected={selected || undefined}
              aria-label={state.answer ? `${option.word} — ${option.translation}` : `Obrazek ${index + 1}`}
              onClick={() => { if (!picturesReady) return; const checked = controller.select(option.id); if (checked) onChecked?.(checked) }}>
              <img key={pictureAttempt} src={import.meta.env.BASE_URL + option.picture.path} alt="" width="160" height="160"
                onLoad={() => setLoadedPictures((loaded) => new Set([...loaded, option.id]))}
                onError={() => setPictureError(true)} />
              <span className="picture-badge">{correct ? '✓ Pasuje!' : selected ? 'Twój wybór' : '\u00a0'}</span>
            </Button>
          )
        })}
      </div>
      {state.answer && <div className="answer-feedback" ref={feedbackPanel}>
        <h2 tabIndex={-1} ref={feedback}>{state.answer.correct ? 'Brawo!' : 'To jest…'}</h2>
        <p className="answer-word"><strong lang="en-GB">{view.target.word}</strong><span aria-hidden="true"> — </span><span lang="pl-PL">{view.target.translation}</span></p>
        <div className="buttons">
          <Button tone="secondary" disabled={busy} onClick={() => { void controller.playTranslation() }}>Posłuchaj tłumaczenia</Button>
          <Button disabled={busy} onClick={onNext}>Dalej</Button>
        </div>
      </div>}
    </section>
  )
}

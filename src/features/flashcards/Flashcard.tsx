import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Button } from '../../components/Button'
import type { FlashcardResult, SelfAssessment } from '../../domain/flashcards.ts'
import type { FlashcardController } from './controller.ts'
import './flashcards.css'

type State = ReturnType<FlashcardController['getSnapshot']>
function statusText(state: State) {
  if (state.playing) return {
    word: 'Słuchaj słowa…', translation: 'Słuchaj tłumaczenia…', instruction: 'Słuchaj polecenia…',
  }[state.playing]
  if (state.audioError) return {
    word: 'Nie udało się odtworzyć słowa. Spróbuj ponownie.',
    translation: 'Nie udało się odtworzyć tłumaczenia. Spróbuj ponownie.',
    instruction: 'Nie udało się odtworzyć polecenia. Spróbuj ponownie.',
  }[state.audioError]
  if (state.result) return 'Możesz przejść dalej.'
  return state.side === 'front' ? 'Możesz odwrócić kartę.' : 'Wybierz: Umiem albo Jeszcze nie.'
}

interface Props {
  controller: FlashcardController
  onNext(): void
  onAssessed?(result: FlashcardResult): void
}

export function Flashcard({ controller, onNext, onAssessed }: Props) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const [picture, setPicture] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const word = useRef<HTMLHeadingElement>(null)
  const panel = useRef<HTMLElement>(null)
  const opener = useRef<HTMLButtonElement>(null)
  const { item, instruction } = controller.view
  const back = state.side === 'back'
  const busy = state.playing !== null
  let status = statusText(state)
  if (!back && !busy && !state.audioError && picture !== 'ready') {
    status = picture === 'error' ? 'Obrazek jest niedostępny.' : 'Wczytuję obrazek…'
  }
  useEffect(() => { heading.current?.focus() }, [controller])
  useEffect(() => {
    if (state.side === 'back') {
      word.current?.focus({ preventScroll: true })
      panel.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    } else opener.current?.focus()
  }, [state.side])

  function assess(value: SelfAssessment) {
    const result = controller.assess(value)
    if (result) onAssessed?.(result)
  }

  return <section className="flashcard-exercise" aria-labelledby="flashcard-title">
    <header className="page-heading">
      <h1 id="flashcard-title" tabIndex={-1} ref={heading}>Fiszki</h1>
      <p>{instruction.text}</p>
    </header>
    <section className="flashcard-panel" ref={panel} aria-label="Fiszka">
      {back ? <div className="flashcard-words">
        <h2 lang={item.audio.word.language} tabIndex={-1} ref={word}>{item.word}</h2>
        <p lang={item.audio.translation.language}>{item.translation}</p>
      </div> : <>
        <Button ref={opener} tone="secondary" className="flashcard-front" disabled={picture !== 'ready'}
          onClick={() => { if (picture === 'ready') void controller.flip() }}>
          <img key={attempt} src={import.meta.env.BASE_URL + item.picture.path} alt="" width="192" height="192"
            onLoad={() => setPicture('ready')} onError={() => setPicture('error')} />
          <span>Odwróć kartę</span>
        </Button>
        {picture === 'error' && <div aria-live="polite">
          <p>Nie udało się wczytać obrazka.</p>
          <Button tone="secondary" onClick={() => { setPicture('loading'); setAttempt((n) => n + 1) }}>Wczytaj obrazek ponownie</Button>
        </div>}
      </>}
      <div className="flashcard-audio">
        <p className="audio-label">Nagranie syntetyczne</p>
        <div className="buttons">
          {back && <>
            <Button disabled={busy} onClick={() => { void controller.playWord() }}>{state.audioError === 'word' ? 'Spróbuj ponownie' : 'Posłuchaj słowa'}</Button>
            <Button tone="secondary" disabled={busy} onClick={() => { void controller.playTranslation() }}>Posłuchaj tłumaczenia</Button>
          </>}
          <Button tone="secondary" disabled={busy} onClick={() => { void controller.playInstruction() }}>Posłuchaj polecenia</Button>
        </div>
        <p role="status" className="playback-status">{status}</p>
      </div>
      {back && (state.result ? <div className="flashcard-result">
        <p>Wybrano: {state.result.value === 'know' ? 'Umiem' : 'Jeszcze nie'}.</p>
        <Button disabled={busy} onClick={onNext}>Dalej</Button>
      </div> : <>
        <div className="flashcard-return"><Button tone="secondary" onClick={() => { void controller.flip() }}>Zobacz obrazek</Button></div>
        <div className="buttons flashcard-assessment" role="group" aria-label="Samoocena">
          <Button disabled={busy} onClick={() => assess('know')}>Umiem</Button>
          <Button tone="secondary" disabled={busy} onClick={() => assess('not-yet')}>Jeszcze nie</Button>
        </div>
      </>)}
    </section>
  </section>
}

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Button } from '../../components/Button.tsx'
import type { IntroductionController } from './introduction.ts'

export function Introduction({ controller: c, saved, canRecord, onReady, onNext }: {
  controller: IntroductionController; saved: boolean; canRecord: boolean; onReady(): void; onNext(): void
}) {
  const state = useSyncExternalStore(c.subscribe, c.getSnapshot)
  const [picture, setPicture] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus() }, [c])
  useEffect(() => {
    if (canRecord && !saved && state.heard && picture === 'ready') onReady()
  }, [canRecord, saved, state.heard, picture, onReady])
  return <section className="introduction" aria-labelledby="intro-title">
    <header className="page-heading"><h1 ref={heading} tabIndex={-1} id="intro-title">Poznaj słowo</h1><p>{c.instruction.text}</p></header>
    <div className="introduction-card">
      <img key={attempt} src={import.meta.env.BASE_URL + c.item.picture.path} width="192" height="192" alt=""
        onLoad={() => setPicture('ready')} onError={() => setPicture('error')} />
      <h2 lang="en-GB">{c.item.word}</h2>
      {picture === 'error' && <><p>Nie udało się wczytać obrazka.</p><Button tone="secondary" onClick={() => { setPicture('loading'); setAttempt((n) => n + 1) }}>Wczytaj obrazek ponownie</Button></>}
      <p className="audio-label">Nagranie syntetyczne</p>
      <div className="buttons">
        <Button disabled={state.playing} onClick={() => { void c.playWord() }}>Posłuchaj słowa</Button>
        <Button tone="secondary" disabled={state.playing} onClick={() => { void c.playInstruction() }}>Posłuchaj polecenia</Button>
      </div>
      <p role="status">{state.playing ? 'Słuchaj…' : state.error ? 'Nie udało się odtworzyć nagrania. Spróbuj ponownie.' : !state.heard ? 'Posłuchaj słowa, aby przejść dalej.' : saved ? 'Możesz przejść dalej.' : 'Poczekaj na zapis postępów.'}</p>
      <Button disabled={!saved || state.playing || picture !== 'ready'} onClick={onNext}>Dalej</Button>
    </div>
  </section>
}

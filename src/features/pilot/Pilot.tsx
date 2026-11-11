import { useEffect, useState, useSyncExternalStore } from 'react'
import lesson from '../../content/english/level-1/animals.json'
import flashcardInstruction from '../../content/flashcard-instruction.json'
import introductionInstruction from '../../content/introduction-instruction.json'
import { Button } from '../../components/Button.tsx'
import { openLearningData } from '../../data/learningData.ts'
import { pilotSteps } from '../../domain/pilotTypes.ts'
import type { Theme } from '../../domain/theme.ts'
import { Flashcard } from '../flashcards/Flashcard.tsx'
import { ListenAndTap } from '../listenAndTap/ListenAndTap.tsx'
import { createPilot } from './controller.ts'
import type { PilotController } from './controller.ts'
import type { PilotAudio } from './introduction.ts'
import { Introduction } from './Introduction.tsx'
import './pilot.css'

export function Pilot({ audio, onTheme, onAudioCheck }: { audio: PilotAudio; onTheme(theme: Theme): void; onAudioCheck(): void }) {
  const [controller, setController] = useState<PilotController | null>(null)
  const { play, stop } = audio
  useEffect(() => {
    const c = createPilot({ open: openLearningData, audio: { play, stop }, lesson, flashcardInstruction,
      introductionInstruction, now: Date.now, id: () => crypto.randomUUID(), onTheme })
    setController(c); void c.load()
    return () => c.dispose()
  }, [play, stop, onTheme])
  return controller ? <PilotView c={controller} onAudioCheck={onAudioCheck} /> : <p role="status">Wczytuję profile…</p>
}
function PilotView({ c, onAudioCheck }: { c: PilotController; onAudioCheck(): void }) {
  const s = useSyncExternalStore(c.subscribe, c.getSnapshot)
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState('')
  const [theme, setTheme] = useState<Theme | ''>('')
  const canContinue = s.recorded && !s.saving && !s.error
  const runtime = s.runtime
  const session = s.profile?.pilotSession
  const stepIndex = session && runtime ? pilotSteps(session).findIndex((step) => step.id === runtime.step.id) : 0
  return <>
    {s.error && <div className="pilot-error" role="alert"><p>{s.error}</p><Button disabled={s.saving} onClick={() => { void c.retry() }}>Ponów zapis lub odczyt</Button></div>}
    {s.screen === 'profiles' ? <>
      <header className="page-heading"><h1>Kto dziś ćwiczy?</h1><p>Wybierz swój profil, aby zacząć.</p></header>
      <div className="profile-grid">
        {s.profiles.map((p) => {
          const item = lesson.items.find((i) => i.picture.id === p.avatarId)
          const resume = p.pilotSession && p.pilotSession.cursor < pilotSteps(p.pilotSession).length
          return <Button key={p.id} tone="secondary" className="profile-tile" disabled={s.saving || !!s.error}
            onClick={() => c.chooseProfile(p.id)}>
            {item ? <img src={import.meta.env.BASE_URL + item.picture.path} width="80" height="80" alt="" /> : <span aria-hidden="true">{p.nickname.slice(0, 1)}</span>}
            <strong>{p.nickname}</strong><span>{resume ? 'Graj dalej' : 'Zagraj'}</span>
          </Button>
        })}
      </div>
      {s.saving && <p role="status">Wczytuję lub zapisuję profil…</p>}
      <details className="profile-create"><summary>Dodaj profil</summary>
        <form onSubmit={(event) => {
          event.preventDefault()
          if (theme && avatar && nickname.trim()) void c.createProfile(nickname, avatar, theme)
        }}>
          <fieldset disabled={!s.ready || s.saving || !!s.error}>
            <label className="profile-field">Pseudonim<input name="nickname" autoComplete="off" required value={nickname} onChange={(e) => setNickname(e.target.value)} /></label>
            <fieldset className="avatar-options"><legend>Wybierz awatar</legend>
              {lesson.items.map((item) => <label key={item.id} className="avatar-option">
                <input type="radio" name="avatar" value={item.picture.id} required checked={avatar === item.picture.id} onChange={() => setAvatar(item.picture.id)} />
                <img src={import.meta.env.BASE_URL + item.picture.path} width="48" height="48" alt={item.translation} />
              </label>)}
            </fieldset>
            <label className="profile-field">Wybierz motyw<select required value={theme} onChange={(e) => setTheme(e.target.value as Theme | '')}>
              <option value="" disabled>Wybierz…</option><option value="electric">Electric — jasny</option><option value="neon">Neon — ciemny</option>
            </select></label>
            <Button type="submit" disabled={!nickname.trim() || !avatar || !theme}>Zapisz profil</Button>
          </fieldset>
        </form>
      </details>
      <p className="pilot-note">Profile i postępy zapisują się w tej przeglądarce. Wpisz pseudonim, bez nazwiska.</p>
      <Button tone="secondary" disabled={s.saving || !!s.error} onClick={onAudioCheck}>Sprawdź dźwięk</Button>
    </> : s.screen === 'finished' ? <section className="pilot-finished">
      <h1>Sesja zakończona!</h1><p>Udało Ci się ukończyć 9 ćwiczeń.</p>
      <div className="buttons"><Button onClick={() => c.chooseProfile(s.profile!.id)}>Ćwicz dalej</Button><Button tone="secondary" onClick={() => c.showProfiles()}>Wróć do profili</Button></div>
    </section> : runtime && session && <>
      <div className="pilot-navigation"><Button tone="secondary" disabled={s.saving || !!s.error} onClick={() => c.showProfiles()}>Wróć do profili</Button>
        <p>{runtime.kind === 'introduction' ? `Nowe słowo ${stepIndex + 1} z ${session.newWordIds.length}` : `Ćwiczenie ${stepIndex - session.newWordIds.length + 1} z 9`}</p>
      </div>
      {s.saving && <p role="status">Zapisuję postępy…</p>}
      <fieldset className="pilot-step" disabled={!s.ready || !!s.error}>
        {runtime.kind === 'introduction' ? <Introduction key={runtime.step.id} controller={runtime.controller}
          canRecord={s.ready && !s.saving && !s.error} saved={canContinue} onNext={() => c.advance()}
          onReady={() => c.record({ kind: 'introduction', stepId: runtime.step.id, wordId: runtime.step.wordId, at: Date.now() })} />
          : runtime.kind === 'flashcard' ? <Flashcard key={runtime.step.id} controller={runtime.controller} canContinue={canContinue}
            onNext={() => c.advance()} onAssessed={(r) => c.record({ kind: 'flashcard', stepId: r.cardId, wordId: r.wordId, value: r.value, at: Date.now() })} />
          : <ListenAndTap key={runtime.step.id} controller={runtime.controller} canContinue={canContinue}
            onNext={() => c.advance()} onChecked={(r) => c.record({ kind: 'listen-and-tap', stepId: r.questionId, wordId: r.wordId, selectedId: r.selectedId, correct: r.correct, at: Date.now() })} />}
      </fieldset>
    </>}
  </>
}

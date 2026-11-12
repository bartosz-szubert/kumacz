# P09 — pilot session

Prepared on 2026-11-11; reconciled with accepted P07/P08/P09a on 2026-11-12. This is the early test build under D-81, not an MVP release.

## Review and branch order

P09a compatibility is accepted and merged in [PR #23](https://github.com/bartosz-szubert/kumacz/pull/23), after P07 #21, language decisions #25 and P08 #22. P09b [PR #24](https://github.com/bartosz-szubert/kumacz/pull/24) now targets main and incorporates those accepted changes. It is ready for separate review/merge approval. The original stack has been reconciled sequentially; no new stacked stage is started. The existing Pages workflow publishes main only, so this draft does not yet change the public pilot build.

## Run and try it

Use the pinned Node/npm toolchain and `npm ci`, then `npm run dev` (see [DEVELOPMENT.md](DEVELOPMENT.md)). The default route now opens the profile picker. Use invented data for screenshots, shared builds and reports.

1. Open **Dodaj profil**. Enter a nickname, explicitly choose one of the seven existing picture avatars and choose Electric or Neon. Save, then tap the profile tile to enter the session. There is no PIN in this pilot, as allowed by D-81.
2. New words show a picture, written English form and pronunciation. The picture must load and the complete word playback must succeed before introduction is saved and **Dalej** is enabled. With automatic voice-over off, use **Posłuchaj słowa**. An unavailable/cancelled recording does not count as an introduction or a checked answer.
3. Owner-selected variant A (D-86): three flashcards, then two rounds of three listen-and-tap exercises: **9 exercises**, plus up to three preliminary introductions. The written progress counter excludes introductions.
4. A flashcard starts picture-only. Flip it, listen and choose **Znam** or **Jeszcze nie**. Both values save only self-assessment; neither is a checked answer or a Leitner promotion.
5. Listening tasks use the unchanged P07 question and feedback behavior. The second round places two other exercises between occurrences of the same word. A final wrong answer is prioritised in the next fixed pilot session without extending nine exercises. Remaining slots use new words, then known words from the same lesson. Once all seven words have been introduced without errors, this fixed pilot repeats the first three words; the owner accepted this non-blocking observation for the pilot. P14/P16 will provide the full selection/retry policy.
6. After feedback, tap **Dalej**. The final screen offers another session or the profile picker. This pilot does not award stars/stickers, complete lessons/levels or count learning days/time; those belong to later stages. All checked answers are practice or corrective retry, never due reviews.
7. Return to profiles or reload. An unfinished profile shows **Graj dalej** and resumes at its last committed cursor. A saved result resumes at the following step; an uncommitted answer may need answering again. Separate profiles retain separate checkpoints, progress and themes.

**Sprawdź dźwięk** on the profile picker opens the existing P03/P07/P08 review screen. It is also directly reachable at `?preview=audio`.

## Persistence and failure boundary

The domain plan/reducer lives in `src/domain/pilotSession.ts` and `pilotTypes.ts`. The feature controller orchestrates audio and the public `LearningData` API. React components never access browser storage.

Profiles now use format 2 with a nullable version-1 pilot plan, selected word IDs, attempt offsets, cursor and ordered result prefix. Answer documents and app settings retain format 1; the IndexedDB schema remains 1. Opening validates every document, converts all valid v1 profiles and prunes expired history in **one native transaction**. Failed validation or an abort leaves all existing documents and history intact. Migration preserves revisions, preferences and existing progress; unknown fields/formats are refused. See [DATA_LAYER.md](DATA_LAYER.md).

Each introduction/self-assessment/checked answer saves its next cursor and progress together; checked answers append in the same transaction with stable session/step IDs. Next-calendar-date initial placement is local-calendar based; existing word placement is preserved. Correct practice updates factual answer/listening flags but preserves the box, due date and lesson/level completion. Revision comparison rejects concurrent stale writes.

An initial session plan must be durable before responding. After an answer, **Dalej** and profile navigation stay blocked while the result is pending. A failed save preserves the exact pending payload in memory and offers retry through a reopened data connection. Keep the page open until retry succeeds. No automatic reset/overwrite is performed. Refresh after failure returns to the last successful save. A concurrent revision conflict stays blocked rather than overwriting another tab; full conflict/refresh guidance and upgrade-closed connection handling remain P12. Reward idempotency is P11; rewards do not exist in this pilot.

The current step's audio starts synchronously inside a profile/continue/flip tap, before storage awaits. Save completion never starts the next step automatically. Controllers stop playback when leaving a step and ignore disposed audio completions.

## Assets and review

P04 pictures, English words and Polish translations are unchanged. The added Polish introduction instruction is **Spójrz na obrazek i posłuchaj słowa.** It uses the approved Supertonic 3 preset 0, actual `pl` language configuration and the existing local hash-pinned generator. Provenance: [introduction-audio-provenance.json](../tools/content/introduction-audio-provenance.json); synthetic disclosure remains visible and public attribution is in `public/assets/NOTICE.txt`.

The owner approved the introduction instruction unchanged on 2026-11-12 and subsequently approved P08’s revised Znam flashcard recording. Both exact recordings are retained unchanged; their provenance records the approvals. No P04 clip or picture is regenerated.

## Verification and remaining acceptance

Fresh verification after main reconciliation on 2026-11-12: types/build, 74 Vitest cases and 43 Chromium cases pass (`--project=chromium --workers=1`), including current Znam self-assessments, all nine pilot exercises, native save-failure retry, reload/resume, profile isolation, DST placement and missing-audio handling. Accepted recordings have matching manifest/output hashes; no audio was regenerated. Physical device/child acceptance remains pending.

Types/build, 74 Vitest cases, 3 Python generator regressions and 43 Chromium cases passed for the combined implementation. The independent P09a snapshot also passed types/build, 62 Vitest cases and 38 Chromium cases. A corrective-retry classification mutation was caught; the domain source was restored byte for byte and its focused tests passed. Production-preview capture had no console/page errors, external requests or horizontal overflow. Screenshots (invented profiles): [Electric profiles](review/p09-electric-profiles.png), [Neon introduction at 360 px](review/p09-neon-introduction-phone.png). The images were visually inspected. More handoff context is in [STATUS.md](STATUS.md). Coverage includes the complete nine-exercise flow, native checkpoint/history atomicity, refresh resumption without duplicate answers, profile isolation, local date placement across the Warsaw DST boundary, missing introduction audio/replay, narrow-screen controls, migration success, invalid legacy rejection and an actual transaction abort after a successful migration write request. Existing audio/P07/P08 preview flows remain covered.

On the actual Android tablet with Chrome, after P09b is separately approved/merged and the build is published:

1. Run [AUDIO_PLAYER.md](AUDIO_PLAYER.md)'s P03 check: both clips online, then replay with airplane mode while the page stays open. This checks cached audio; it does not claim offline app startup, which is P30/P31.
2. Create a test profile, complete a session, reload and resume an interrupted session. Check word clarity and volume, both instruction recordings, touch controls and both themes.
3. Before P10, record device/browser and pass/fail without a child's personal information. Observe head-only versus whole-animal picture recognition and Polish leading silence as already noted in [PILOT_LESSON.md](PILOT_LESSON.md).

The agent cannot perform this physical-device or child observation check. WebKit remains configured; its browser binary is unavailable in the current environment. These checks remain pending rather than being inferred from desktop Chromium.

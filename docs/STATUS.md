# Status

**Phase:** Implementation (P06 accepted; P07 next)
**Last updated:** 2026-11-11

## In progress

_No agent task running. P06 is accepted; the owner explicitly approved merging PR #20 on 2026-11-11. Next is P07 Listen and tap._

## Resume point

- P06 is accepted with explicit PR #20 merge approval (2026-11-11). It provides versioned profile/settings documents, separate checked-answer history, stable content references, atomic writes and 90-day retention through a storage-independent interface. [DATA_LAYER.md](DATA_LAYER.md) describes the API, revisions and verification.
- Profile/history writes either commit together or preserve the previous state. Stale revisions and duplicate appends reject; unknown formats are refused before cleanup. P11/P12 still own session/reward idempotency and save-error UI; imports/migrations remain P26/P27.
- Build/types, 34 Vitest tests and 24 Chromium cases passed. Ten new browser cases use native IndexedDB, including real abort/rollback and concurrent connections. A deliberately broken 90-day boundary was caught and restored. WebKit remains unavailable.
- Claude's 2026-11-11 review reports the same passing checks and no blocking P06 findings. Follow-ups are recorded in [DATA_LAYER.md](DATA_LAYER.md#second-review--2026-11-11) and the stage plan: P12 upgrade-closed connection/refresh, P27 field-change migrations and P33 whole-minute input.
- P05 is accepted in main (PR #19). Theme preview remains temporary React state; P06 supplies persistence capability, with profile/session UI integration still in later stages. No new default-profile theme decision was made.
- P04's selected content/audio are accepted in main (PR #18). Preserve those assets and IDs. Picture framing and approximately 0.3 s of leading Polish silence remain non-blocking [pilot observations](PILOT_LESSON.md#second-review-and-pilot-observations--2026-11-10); device/child checks remain P09/P10.

## Next

1. Continue with P07 Listen and tap (`docs/IMPLEMENTATION.md`); P06 is accepted.
2. In P09, run the P03 audio check on the Android tablet with Chrome, including offline replay (`docs/AUDIO_PLAYER.md`).
3. Run the configured WebKit project when its browser download is available (HTTP 403 for the official Playwright hosts in agent environments).
4. In P10, observe recognition of head-only versus whole-animal pictures. Consider the reported Polish leading silence when preparing later lessons; accepted P04 assets are unchanged.

## Done

- Recorded D-87 (flashcard buttons „Znam” / „Jeszcze nie”) and D-88 (Polish language quality rule, also in `AGENTS.md`). P08 must apply D-87: button labels and a regenerated, owner-approved flashcard instruction.
- Recorded the owner-supplied Claude P06 review (2026-11-11): passing types/build, 34 unit tests and 24 Chromium cases, with no blocking findings. Documented three non-blocking follow-ups under P12/P27/P33; these remain scheduled after P06 acceptance.

- P06 accepted on 2026-11-11; the owner explicitly approved merging PR #20 after Claude's second review. Typed/versioned profiles, per-profile preferences, app metadata and separate contextual checked-answer history through `idb`; atomic profile/history writes, revision conflict detection, deletion and physical 90-day cleanup. Unknown formats are rejected before cleanup; no reset/fallback database is created on failure. Build/types, 34 Vitest tests and 24 Chromium cases passed, including 10 new native-storage cases; the retention mutation was caught. No profile/session UI, grading, migration or reward rules added.

- Recorded Claude's second review (2026-11-10): passing types/build, 20 unit tests and 14 Chromium cases; P05 consistent with F-31, no blocking findings. P04 picture-recognition and leading-silence observations are in `docs/PILOT_LESSON.md`; accepted content/audio remain unchanged.

- P05 accepted on 2026-11-10; the owner explicitly approved merging PR #19 after Claude's second review. Controlled AppShell/ThemeSelector, native Button with primary/secondary tones, semantic Electric/Neon tokens, responsive audio-check layout, 48×48+ targets, 16 px+ text, keyboard skip/focus, contrast and reduced-motion styles. The test banner and synthetic-audio disclosure remain visible. Clean install, build/types, 20 Vitest tests and 14 Chromium cases passed; a forced-Electric mutation was caught by the theme-switch case. Real screenshots are in `docs/SHARED_UI.md`. WebKit binary is unavailable; actual target-device checks remain P09. No profile storage or exercise implementation added.

- P04 accepted on 2026-11-10; owner explicitly approved merging PR #18. Seven-word lesson JSON, stable IDs, Polish translations, pilot exercise types, curated distractors, seven pinned Twemoji SVGs and 15 MP3s. Fixed Polish language configuration, recorded the approved instruction and matched English levels. Preserved accepted dog and selected horse/elephant variant 2 after listening and the UK /hɔːs/ clarification; exact heard bytes, provenance and historical references are retained. Build/types, 20 Vitest tests, 3 Python generator tests and 9 Chromium tests passed. P09 target-device and P10 child checks remain scheduled.
- P03 accepted (product owner's choice C): both clips played online and offline (airplane mode, page open) on an iPhone with Safari and an Android phone with Dolphin; tablet + Chrome check moved to P09. Recorded in `docs/AUDIO_PLAYER.md`.
- P03 implementation and desktop verification prepared: whole-file Web Audio, same-origin validated asset cache in the data layer, local-only fallback, interruption/retry outcomes, permanent disclosure and a two-clip screen. Unit and Chromium browser checks cover failures, cancellation, policy restrictions and cached offline replay. P03 was subsequently accepted on phones as recorded above; tablet + Chrome remains in P09, and WebKit is blocked by the official browser-download hosts.
- Added the GitHub Pages test-build workflow and "Wersja testowa" banner (D-85) so the product owner can check P03 audio on the tablet without USB debugging.
- P02 accepted: product owner listened to the samples and chose Cori (en-GB) and Supertonic 3 preset 0 (pl) (D-83) and a permanent synthetic-audio label (D-84, F-45). Earlier technical preparation: reviewed pinned Twemoji attribution and model-specific voice terms; generated local English/Polish WAV → MP3 evaluation clips only after the corresponding checks. Added archive/input/output provenance, a hash-pinned optional generation environment and a repeatable recipe.
- Fixed the npm engine requirement: exact npm 11.9.0 rejected the npm 11.17.0 bundled with Node 24.19.0 (`EBADENGINE` on `npm ci`); now `>=11.9.0 <12`. Clean install and `npm run check` verified with both versions.
- P01 Project foundation (PR #12): pinned React/TypeScript/Vite, `idb`, Vitest/Playwright configuration, npm lockfile and disabled install scripts. Verified clean frozen install, type-check, static build, audit and production-preview smoke check in system Chromium. Test runners report zero tests by design; no application tests or learning features were added.
- Second opinion on the technology proposal and stage plan; product owner chose React + TypeScript + Vite, `idb` with per-profile documents, MP3 via Web Audio, an early pilot test build and Twemoji (D-78–D-82). `docs/IMPLEMENTATION.md` reordered into P01–P40 with oversized stages split; `AGENTS.md` stack filled in.
- Prepared a technology proposal and draft implementation sequence for second opinion in draft PR #11. Final stack/plan adoption is pending; approved PRD v0.10 remains the product baseline.
- Product owner accepted integrated PRD v0.10; recorded the approval gate as passed (D-77). Next phase: technology selection.
- Recorded learning-day credit only after both at least 10 minutes of counted learning and at least one completed session that day (D-76, F-20; revision of D-25). Updated README and related completion references.
- Recorded product-owner review: initial grades 1–3 focus within a long-term all-primary-school audience, a daily goal of at least 10 minutes with longer learning allowed, and future natural-science/geography modules (D-73–D-75), draft PRD v0.10. Aligned README and agent context.
- Recorded per-child learning target: at least 10 eligible words, +20 percentage points or maintenance of an initial score of at least 80%; smaller samples are insufficient (D-72, section 11).
- Recorded learning measurement from first and last independent due-review answers for the same words, per child, without a separate examination (D-71, section 11, N-12).
- Recorded written-word exercises becoming available per word after its first correct listen-and-tap answer (D-70, F-35, clarification of D-37).
- Recorded retry after 2 intervening exercises when it fits, otherwise next-session carryover without extending the session (D-69, F-06, clarification of D-36/D-51).
- Recorded difficult words as at least 2 errors in the latest up to 5 checked answers, with removal below that threshold (D-68, F-28).
- Recorded review intervals in the device's local calendar days, with reviews due from the start of the target date (D-67, F-12, F-13).
- Recorded continued learning after persistent-storage refusal when ordinary saving works, with parent information and backup reminders; corrected overstrong storage guarantees (D-66, F-37).
- Recorded paused session progression on failed progress saving, preservation of the last successful save and safe retry before continuing (D-65, F-36, F-43).
- Recorded all-or-nothing backup imports and migrations, preserving existing data on failure and allowing retry (D-64, F-30, N-11, N-13).
- Recorded offline readiness only after the full MVP package is locally available, separate from initial interface load; incomplete preparation can be retried (D-63, N-03, N-07, F-42).
- Recorded local-only speech-synthesis fallback and retry without grading when required audio is unavailable (D-62, N-04, F-41), PRD v0.9 draft.
- Recorded approved level 1 lesson sizes: 8 colours, 10 numbers, 7 animals and 7 fruit, keeping 32 words (D-61, clarification of D-46), PRD v0.9 draft.
- Coding skills for Codex and Claude Code (test-driven-development, code-review-and-quality, source-driven-development, debugging-and-error-recovery, security-and-hardening) from bartosz-szubert/agent-skills.
- Agent skills for Codex and Claude Code (diagram-design, humanizer, interview-me) from the reviewed copies in bartosz-szubert/agent-skills; `AGENTS.md` clarifies that the no-trademarks rule covers the app, not agent tooling.
- Expert PRD review with the product owner: D-46–D-60 (level 1 size, bundled generated audio, minimum cost, data durability, gentler Leitner demotion, initial and skipped-word boxes, PIN reset check, data rules, staged implementation, picture rule, translations, distractors, tap before audio), PRD v0.8.
- Recorded Leitner promotion only in due reviews; correct earlier practice leaves the box and scheduled review date unchanged (D-45, F-12, F-13).
- Recorded validation of one pilot lesson with the children during implementation before preparing the full MVP content (D-44, section 7).
- Recorded English pronunciation only after answering picture-to-word exercises, with Polish instruction playback available before answering (D-43, F-07, F-10).
- Recorded short, calm reward animations enabled by default, with static rewards when the device requests reduced motion (D-42, F-21).
- Recorded review stickers continuing on the completed level's page; its special sticker marks completion without blocking additions (D-41, F-19, clarification of D-24).
- Recorded learning improvement measured on the same words across reviews after a time gap, replacing the difficult-word-count metric (D-40, section 11).
- Recorded a difficult-word list based on recent checked answers rather than lifetime error totals (D-39, F-28).
- Recorded per-exercise saving and interrupted-session resumption, with no duplicate rewards and completion-based session rewards and learning-day credit (D-38, F-36).
- Recorded gradual introduction of written-word exercises after listening and picture-based tasks (D-37, F-35).
- Recorded retry after several intervening exercises rather than immediately after error feedback (D-36, F-06).
- Recorded picture, written word and pronunciation before first testing a new word; due reviews start with a question (D-35, F-04).
- Recorded at most 3 new words per learning session (D-34, F-04).
- Recorded checked-answer-only Leitner promotion; flashcard self-assessment does not change the box (D-33, F-08, F-12).
- Recorded the product owner's choice A: at most one Leitner promotion per word per profile per day (D-32, F-12), PRD v0.7.

- Public repository created.
- Reviews, learning-day and time counting, backup restore, PIN recovery and skip-level test: D-25–D-31, PRD v0.6.
- Lesson and level completion rules and sticker album: D-21–D-24 (F-34, F-15, F-19), PRD v0.5.
- PRD v0.4 (`docs/PRD.md`); D-18–D-20 reviewed with the product owner: bundled open emoji set, per-profile themes, British English.
- README.
- Agent instructions (`AGENTS.md`, `CLAUDE.md`) and this status file.

## Handoff log

- 2026-11-11 · Codex · Recorded the owner's P06 acceptance and explicit PR #20 merge instruction after Claude's second review; prepared acceptance metadata in the same PR · Next is P07 Listen and tap. P12 refresh handling, P27 field-change compatibility and P33 whole-minute settings remain scheduled, along with P09/P10 device/child checks.

- 2026-11-11 · Codex · Recorded Claude's non-blocking P06 review in PR #20 and assigned the three follow-ups to P12/P27/P33 · Await explicit owner merge approval; P07 follows acceptance. Any earlier stage adding persisted fields must address compatibility when it makes the change.

- 2026-11-11 · Codex · Prepared P06 on `feature/p06-data-layer-core`, with the API/limits in `docs/DATA_LAYER.md`, 14 new boundary tests and 10 native IndexedDB cases · Await review and explicit merge approval; after acceptance start P07. P09 wires the pilot UI; P11/P12 own session/reward retries and failure UI; P26/P27 own imports/migrations. P04 observations and P09/P10 device/child checks remain scheduled.

- 2026-11-10 · Codex · Recorded the owner's P05 acceptance and explicit PR #19 merge instruction after Claude's second review; prepared acceptance metadata in the same PR · Next is P06 Data layer core. Theme preview remains temporary React state; P04 observations and P09/P10 device/child checks remain scheduled.

- 2026-11-10 · Codex · Recorded the owner-supplied Claude review of P04/P05 and the two non-blocking P04 pilot observations in PR #19 · Owner visual review and explicit merge approval remain pending. Preserve accepted assets; after P05 acceptance continue with P06, with P09/P10 device/child checks still scheduled.

- 2026-11-10 · Codex · Prepared P05 on `feature/p05-shared-ui-themes`: shared controls/shell and both themes demonstrated by the audio check, with screenshots and 5 new browser cases · Await visual review/explicit merge approval. After acceptance start P06. Preview selection is React state only, not a default-profile or persistence decision. WebKit remains unexecuted; P09 tablet/P10 child checks still apply.

- 2026-11-10 · Codex · Recorded the owner's P04 acceptance and explicit PR #18 merge approval after the three-bullet summary and merge question; prepared acceptance metadata in the same PR · Next is P05 Shared UI and themes. Current selected clips are authoritative; old full audio reviews are historical. P09 tablet and P10 child checks remain; no P05 implementation yet.

- 2026-11-10 · Codex · Selected horse/elephant variant 2 after owner feedback: elephant 2/3 OK; horse concern was only missing r, correct for Cambridge UK /hɔːs/ · Lesson paths/provenance now use heard candidate bytes; accepted dog preserved. Superseded references archived; current selections in `docs/PRONUNCIATION_REVIEW.md` and `horse-elephant-selected-2.wav`. Final PR #18 review/merge approval pending; P05 not started.

- 2026-11-10 · Codex · Paused P04 at the owner's request; saved the resume point and review links in STATUS and draft PR #18 · Resume with the horse/elephant comparison and keep accepted dog. No candidate selection, P04 acceptance or merge approval; P05 has not started.

- 2026-11-09 · Codex · Recorded accepted dog, rejected horse (“płoz”) and unclear elephant final t; prepared `docs/PRONUNCIATION_REVIEW.md` with reference + two Cori variants per word and a lossless comparison WAV in PR #18 · Await listening/selection before replacing lesson files. Same voice/speed; standard vs zero noise are review candidates only. Installed runtime already includes the known BOS/pad fix. No merge approval.

- 2026-11-09 · Codex · Prepared P04 revision 3 in PR #18 after feedback: explicit approval of clearer Polish instruction, measured English gain, fresh dog/horse synthesis with sentence punctuation, versioned assets and `animals-review-v3.mp3` · Levels/decoding do not establish distinct final consonants; await owner listening and merge approval. Voice/preset/speed unchanged; gains are content preparation, not playback/session rules.

- 2026-11-09 · Codex · Corrected P04 Polish generation on PR #18 after the owner's pronunciation rejection: assign the whole native `extra` map, regenerate all eight Polish clips, route the playback check to the new prompt and publish `animals-review-v2.mp3` · Real-binding regression reproduced the bug and now passes; repeat human listening is required. Original P02 fixture bytes are historical playback evidence, not suitable Polish learning content. No merge or voice change.

- 2026-11-09 · Codex · Prepared P04 animals on `feature/p04-pilot-animals`: data, SVG/MP3 assets, integrity checks and `docs/PILOT_LESSON.md` with a 31-second listening review · Human listening (D-83) and explicit PR merge approval remain; next implementation stage after acceptance is P05. P09 tablet and P10 child checks remain scheduled.

Newest first. One line per finished task: date · agent · what was done · anything the next agent must know.

- 2026-11-12 · Claude · Reviewed stacked P07–P09 PRs #21–#24 (types/build, 74 Vitest and 43 Chromium tests pass; no blocking findings) and recorded D-87/D-88 · Before merging P08: change „Umiem” to „Znam” in the buttons and flashcard instruction, regenerate and get the recording approved; the introduction prompt was approved as is. When retargeting the stack, keep D-86 before D-87 in the PRD table.
- 2026-11-09 · Claude · Recorded the P03 phone checks and accepted P03 · Primary target (Android tablet + Chrome) still untested on a real device: do it in P09; local-voice fallback not exercised on devices.
- 2026-11-07 · Claude · Merged P03 into `main` before the tablet check (product owner's choice A) so it appears on the Pages test build · P03 stays open until the tablet check passes; record results in `docs/AUDIO_PLAYER.md`.
- 2026-11-07 · Claude · Reviewed Codex's P03 branch (16 unit + 9 Chromium E2E tests pass; local fallback after a failed file may be blocked by iPad Safari's user-activation rule) and added the Pages test-build workflow (D-85) · P03 needs the Pages setting enabled and a tablet check; Codex's P03 STATUS edits will need a merge with this file.
- 2026-11-07 · Codex · Prepared P03 implementation and desktop tests on `feature/p03-audio-player`; device verification and merge pending · Native file/cache playback checked in system Chromium; speech engine controlled in tests, real `localService` and Android audio still need checking; WebKit download blocked by HTTP policy. P04 has not started. See `docs/AUDIO_PLAYER.md`.
- 2026-11-07 · Claude · Reviewed P02, regenerated extra Cori samples for listening (not committed), recorded D-83/D-84 and F-45 in PR #14 with the product owner's approval · Slowing a single short word (e.g. "Red." at speed 0.85–0.9) produced a long garbled clip: listen to every generated clip; licence pages on huggingface.co and brycebeattie.com were unreachable from the Claude session.
- 2026-11-06 · Codex · Prepared P02 licence review and synthetic evaluation clips on `feature/p02-asset-licences`; owner voice choice and merge pending · Recommend Cori + Supertonic 3 preset 0; Polish Piper lineage remains unresolved; before playback show synthetic disclosure, and do not claim pronunciation/device checks from decoding alone. See `docs/ASSET_LICENCES.md` and `tools/audio/`.
- 2026-11-06 · Claude · Reviewed P01 (install, types, build, preview smoke check passed) and fixed the npm engine range · P02 remains next; consider a free GitHub Actions check later (product owner to decide).
- 2026-11-06 · Codex · Finalized P01 in PR #12; product owner explicitly approved merging · Node 24.19.0 / npm 11.9.0, `npm run check` passes, scripts disabled, no test cases yet; P02 licences next, commands/evidence in `docs/DEVELOPMENT.md`.
- 2026-11-06 · Claude · Second opinion and technology decisions D-78–D-82 in PR #11 (product owner approved writing to Codex's branch) · Start P01; Dexie/multi-table is recorded only as a future option (D-79).
- 2026-11-06 · Codex · At the product owner's request, kept PR #11 as a proposal for second opinion, converted it to draft and removed the premature final-stack decision/configuration from its diff · Do not merge or start P01 before review and the owner's final confirmation; PRD v0.10 stays approved.
- 2026-11-06 · Codex · Finalized the approved PRD v0.10 record (D-77) in PR #10; product owner explicitly approved merging · Next present technology options with a recommendation, obtain the product owner's choice, then plan implementation stages (D-56).
- 2026-11-06 · Codex · Recorded acceptance of integrated PRD v0.10 as D-77 on `docs/prd-approval`; merge pending explicit approval · Present stack options next; no technology decision or implementation has been authorized yet.
- 2026-11-06 · Codex · Finalized product-owner review changes D-73–D-76 in PR #9; product owner explicitly approved merging · PRD v0.10 remains a draft pending whole-document approval; next choose the stack after approval and verify voice licences before audio generation.
- 2026-11-06 · Codex · Recorded explicit learning-day clarification as D-76 in PR #9: at least 10 minutes AND at least one completed session on the same day; merge pending approval · Product-review changes D-73–D-76 are ready for merge review; whole-PRD approval remains pending.
- 2026-11-06 · Codex · Recorded explicit product-owner review feedback as D-73–D-75 on `docs/product-owner-prd-review`; merge pending approval · Clarify how the 10-minute goal relates to weekly learning-day credit; F-20 and D-25 have not been changed, and whole-PRD approval remains pending.
- 2026-11-04 · Codex · Finalized skill-informed PRD v0.9 review decisions D-61–D-72 in PR #8; product owner explicitly approved merging · Next is the product owner's final PRD reading; whole-PRD approval, technology choice and voice-licence verification remain pending.
- 2026-11-04 · Codex · Recorded approved minimum learning sample and success threshold (D-72); D-61–D-72 ready for PR #8 review, merge pending explicit approval · PRD v0.9 remains a draft; final product-owner reading, whole-PRD approval and voice-licence verification are still pending.
- 2026-11-04 · Codex · Recorded approved ordinary-review learning measurement (D-71) in PR #8; merge pending explicit approval · Next agree the minimum sample and numerical success threshold; whole-PRD approval remains pending.
- 2026-11-04 · Codex · Recorded approved per-word listening-success trigger for written-word tasks (D-70) in PR #8; merge pending explicit approval · Next define the learning success measurement and target; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved retry spacing and next-session carryover (D-69) in PR #8; merge pending explicit approval · Next define the written-word exercise introduction trigger; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved 2-errors-in-5 difficult-word rule (D-68) in PR #8; merge pending explicit approval · Next clarify delayed retries near session end; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved local-calendar review intervals (D-67) in PR #8; merge pending explicit approval · Next define the difficult-word window and threshold; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved graceful handling of persistent-storage refusal (D-66) in PR #8 and corrected F-37's unconditional Safari-retention claim; merge pending explicit approval · Next discuss review-day calculation; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved pause-and-retry behaviour for failed progress saving (D-65) in PR #8; merge pending explicit approval · Next distinguish refusal of persistent-storage protection from actual write failure; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved all-or-nothing import and migration behaviour (D-64) in PR #8; merge pending explicit approval · Next discuss failed progress saving during learning; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved full-MVP offline-readiness criteria (D-63) in PR #8; merge pending explicit approval · Next discuss failed imports and migrations; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved local-only speech fallback and ungraded listening exercises on audio failure (D-62) in PR #8; merge pending explicit approval · Next decide offline-readiness criteria; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded product-owner choice A for level 1 lesson sizes (D-61) on `docs/prd-review-clarifications`; merge pending explicit approval · Next discuss local-only speech fallback; other skill-informed review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Claude · Added coding skills in `.agents/skills/` with symlinks in `.claude/skills/` · Tooling only; `AGENTS.md` rules take precedence over skills. `frontend-ui-engineering` is available in agent-skills once the stack is chosen.
- 2026-11-04 · Claude · Added agent skills in `.agents/skills/` with symlinks in `.claude/skills/`; trademark rule clarified (product owner's choice B) · Tooling only; product next steps unchanged. Never copy icons from `diagram-design` into the app.
- 2026-11-02 · Claude · Expert PRD review, D-46–D-60, PRD v0.8 · All review points closed; next is PRD approval, then tech stack and a stage plan sized to one session each (D-56).
- 2026-11-02 · Codex · Finalized PRD v0.7 decisions D-32–D-45 and handoff in PR #4; product owner explicitly approved merging · Resume the integrated draft review; whole-PRD approval and technology selection are still pending.
- 2026-11-02 · Codex · Recorded approved due-review-only Leitner promotion (D-45) in PR #4; D-32–D-45 ready for merge review, explicit merge approval pending · The PRD remains a draft; remaining detailed rules and device-audio validation still need review.
- 2026-11-02 · Codex · Recorded approved pilot-lesson validation before content expansion (D-44) in PR #4; merge pending product-owner approval · Next clarify Leitner promotion eligibility before the due date; PRD approval and technology selection still precede implementation.
- 2026-11-02 · Codex · Recorded approved picture-to-word audio timing (D-43) in PR #4; merge pending product-owner approval · Next discuss pilot content validation; speech synthesis and offline audio still need device testing after PRD approval.
- 2026-11-02 · Codex · Recorded approved default calm reward animations and reduced-motion behaviour (D-42) in PR #4; merge pending product-owner approval · Next clarify task-specific audio without revealing answers; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved review-sticker placement on completed level pages (D-41) in PR #4; merge pending product-owner approval · Next discuss reward animations and reduced motion; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved same-word delayed-review learning metric (D-40, section 11) in PR #4; merge pending product-owner approval · Next clarify stickers after level completion; the measurement sample and numerical target remain unspecified.
- 2026-11-02 · Codex · Recorded approved recent-answer difficult-word list (D-39, F-28) in PR #4; merge pending product-owner approval · Next discuss the learning success metric; recent-answer window and classification threshold remain unspecified.
- 2026-11-02 · Codex · Recorded approved per-exercise saving and interrupted-session resumption (D-38, F-36) in PR #4; merge pending product-owner approval · Next discuss difficult-word metrics; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved gradual written-word exercise introduction (D-37, F-35) in PR #4; merge pending product-owner approval · Next discuss interrupted sessions; the precise progression trigger remains unspecified.
- 2026-11-02 · Codex · Recorded approved delayed retry after error feedback (D-36) in PR #4; merge pending product-owner approval · Next discuss reading demands; exact retry spacing and end-of-session handling remain unspecified.
- 2026-11-02 · Codex · Recorded approved introduction before testing (D-35) in PR #4; merge pending product-owner approval · Next decide when to retry a wrong answer; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved maximum of 3 new words per session (D-34) in PR #4; merge pending product-owner approval · Next decide how to present new words before testing; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved checked-answer-only Leitner promotion (D-33) in the same PR as D-32; merge pending product-owner approval · Continue with new-word introduction; other review suggestions remain proposals.
- 2026-11-02 · Codex · Recorded approved daily Leitner promotion cap (D-32) on `docs/leitner-daily-promotion`; merge pending product-owner approval · D-32 and D-33 are approved; other review suggestions remain proposals.
- 2026-11-02 · Claude · Integrated Codex's product-owner-approved amendments as D-25–D-31 (renumbered from Codex's D-22–D-28; committed by Claude because Codex had no repo access) · Codex's proposed level-unlock rule (80% of words in box 4+, lesson completed by any finished session) was rejected by the product owner in favour of existing D-21–D-24.
- 2026-10-31 · Claude · Recorded sticker album rule (D-24); session paused · Work is on branch `claude/kumacz-zaliczanie-lekcji-0hs0ku` (D-21–D-24, not merged yet); resume with the Leitner scheduling question.
- 2026-10-31 · Claude · Recorded level completion rule (D-23) · Ask next how F-19 album pages relate to level completion.
- 2026-10-31 · Claude · Recorded which answers count towards lesson completion (D-22) · Ask next about level completion.
- 2026-10-31 · Claude · Recorded lesson completion rule (D-21, F-34) · Ask next whether flashcard "I know it" counts towards F-34.

- 2026-10-31 · Claude · Added collaboration rules and merge rule to `AGENTS.md` · Work continues in a new Claude Code session; start from the pending lesson-completion question above.

- 2026-10-31 · Claude · Revised D-18 (open emoji set instead of own SVG), D-19 (per-profile theme), confirmed D-20; added F-33 (About/attribution) · Only record decisions the product owner explicitly chose.

- 2026-10-31 · Codex · Recorded product decisions D-18–D-20 in PRD v0.3 · PRD remains a draft; clarify learning and recovery rules before approval and technology selection.
- 2026-10-31 · Claude · Added agent instructions and status file · Agents work in turns; check "In progress" before starting.

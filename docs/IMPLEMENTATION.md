# Implementation proposal — Kumacz MVP

Status: **approved plan**, 2026-11-06, after a second opinion (D-78–D-82). Stage order puts the pilot early (D-81).
Product baseline: approved PRD. Product behaviour comes from [PRD.md](PRD.md); current work and handoff belong in [STATUS.md](STATUS.md).

## Execution rules after approval

- Work in the order below, one agent at a time. Each numbered stage is one focused task, one session, one branch and one PR under AGENTS.md.
- Read only the current stage and the PRD sections it references. If a stage grows beyond a session, split it before continuing and record the remaining work in STATUS.
- At stage completion, record what passed, what remains, and the next stage in STATUS. Merge requires the product owner's explicit approval.
- For behaviour, use the installed TDD skill: demonstrate the expected outcome before implementing it. Test observable results, with real browser storage for transaction and interruption checks.
- For scaffolding, documentation and static assets, use relevant build, type, licence and data checks; do not add placeholder tests merely to claim a green suite.
- Use the installed source-driven-development, code-review-and-quality, security-and-hardening and debugging skills when applicable. Review official documentation before using version-specific APIs.
- Product parameters not specified in the PRD must be discussed when their stage needs them. Record an explicit choice rather than inventing a new product rule.
- Real children's profiles, progress and exported backups stay out of commits, test fixtures and CI artifacts.
- A technical prototype is not an MVP release. Full offline readiness requires all final MVP assets (D-63); a successful fixture-cache test alone is insufficient.

## Stack and boundaries

- UI: React + TypeScript, built with Vite; ordinary CSS with custom properties for Electric and Neon (D-78).
- Data: IndexedDB through `idb`, behind the dedicated data layer: one versioned document per profile plus a separate answer-history store. Imports and migrations write the complete new state in one transaction. Components never access storage directly (D-79).
- Audio: MP3 files, loaded whole from the cache and played through the Web Audio API; local-only speech fallback (D-80, D-62).
- Pictures: Twemoji SVG (jdecked/twemoji), CC BY 4.0 (D-82).
- Offline: vite-plugin-pwa with Workbox precache; readiness checks every file in the package list; a new version activates only on the profile picker.
- Tests: Vitest for domain logic and focused integration tests, Playwright for critical browser flows. Actual Android Chrome and iPad Safari checks remain necessary.
- Hosting: static GitHub Pages at the repository base path.
- Resolve compatible stable versions and pin them in P01, after checking the available runtime and official docs.

Planned source boundaries, created as needed: `src/app`, `src/features`, `src/components`, `src/domain`, `src/data`, `src/content`, `src/audio`, `src/pwa`, `public/assets`, `tests/e2e`.
Keep scheduling, answer evaluation and session policies in the domain layer, separately from React, storage and audio.

## Stages

Track completed and current stages in `STATUS.md`. Execute the remaining stages in order, never in parallel. "Test build" stages (up to P10) serve the pilot (D-81) and are not an MVP release.

| ID | Focus | Deliverable and acceptance | PRD / prerequisites |
|---|---|---|---|
| P01 | Project foundation | React/TypeScript/Vite scaffold, build/type-check scripts, Vitest and Playwright configuration, `idb`. Pin compatible versions and the lockfile. Inspect dependency scripts before enabling them; verify a reproducible install. Build and type-check pass. | D-78; N-05, N-09 |
| P02 | Asset and voice licences | Verify Piper English/Polish voice licences, including redistribution of generated audio, and Twemoji attribution. Record provenance. Generate and convert (WAV → MP3) a small audio fixture only after the checks pass. | P01; D-48, D-49, D-57, D-82 |
| P03 | Audio player | Web Audio playback of whole MP3 files using the approved voices, user-initiated start, replay, a permanent synthetic-audio label, local-only speech fallback and failure handling (no grading when required audio is unavailable). Verify on the Android tablet, including playback from cache. | P02; F-07, F-39, F-41, F-45, N-04, D-60, D-62, D-80, D-83, D-84 |
| P04 | Pilot lesson data | One level-1 lesson as JSON: stable IDs, translations, unambiguous Twemoji pictures, exercise types, distractors and generated MP3 audio. Validate completeness. | P02, P03; section 7, F-39–F-40, D-44, D-57–D-59, D-61 |
| P05 | Shared UI and themes | Common touch controls and responsive shell, CSS theme variables, 48×48 targets, contrast, reduced motion. | P01; N-01, N-02, N-08, F-21, F-31–F-32 |
| P06 | Data layer core | Typed profile document, answer-history store and settings behind a data-layer interface; stable content IDs, format version, 90-day history with attempt context. Single-transaction writes. | P01; section 10, N-10–N-12, D-55, D-71, D-79 |
| P07 | Listen and tap | Spoken target, picture choices, checked answer, correct-answer feedback, translation after answering; audio failure is never a learning error. | P03–P05; F-06, F-09, F-39–F-41 |
| P08 | Flashcards | Picture front; word, pronunciation and translation on the back; self-assessment that neither promotes nor completes a word. | P03–P05; F-08, F-34, F-39, D-33 |
| P09 | Pilot test build | Simple profile screen without a PIN, a fixed simplified session for the pilot lesson (introduction, flashcards, listen and tap), a simple end screen and saving through the data layer. Deployable for the pilot device. | P06–P08; D-35, D-60, D-81 |
| P10 | Pilot with the children | On the target device, observe picture clarity, instruction comprehension, difficulty and independent use. Record findings without personal data; turn needed fixes into separate focused tasks before continuing. | P09; D-44, section 7 |
| P11 | Progress commits | Commit exercise result, session position and earned progress together; no duplicate results or rewards on retry or resume. | P06, P10; F-36, D-38 |
| P12 | Save failure handling | On write failure keep the last commit, pause progression, explain and allow retry; check real browser interruption at the storage boundary. | P11; F-43, D-65 |
| P13 | Leitner policy | Pure functions: initial box, due-review-only promotion, once-per-day cap, two-box demotion, local calendar intervals, unconfirmed skipped words, unchanged early-practice boxes. | P06; F-12–F-14, F-38, D-51–D-53, D-67 |
| P14 | Session composition | Plan 8–12 exercises with up to 3 new words, about half due reviews and lesson fill-in; review-only sessions; introduction before first test. | P04, P13; F-04, F-05, D-30, D-34–D-35 |
| P15 | Answers and lesson completion | Apply answers, lesson completion and per-word written-task eligibility. | P11, P14; F-34, F-35, D-70 |
| P16 | Retries and carryover | Retry after 2 intervening exercises or carry over; never extend the planned session; persist pending retries. | P15; F-06, D-69 |
| P17 | Picture to word | Written choices, pronunciation only after answering, translation after feedback, eligibility from P15. | P07, P15; F-10, F-35, F-39, D-43, D-70 |
| P18 | Context questions | Data-driven prompts with one unambiguous answer; audio/translation timing and same-category distractors. | P04, P07; F-11, F-39, F-40 |
| P19 | Learning time and day credit | Visible active exercise time, inactivity/audio rules, ≥10 minutes AND ≥1 completed session, reminder and reward limit. | P11, P15; F-20, F-22–F-24, F-44, D-76 |
| P20 | Session screen: integration | Replace the pilot session with the full session: all exercise types, planned composition, replay and progress display. | P12, P14–P18; F-04–F-11 |
| P21 | Session screen: resume and pauses | Resume the last saved position without repeated awards, save-error pause, time accrual only during exercises. | P19, P20; F-36, F-43, F-22 |
| P22 | Session reward screen | Stars, praise, reduced motion and sticker reveal; per-profile persistence and daily reward limits. Ask for unspecified reward amounts first. | P21; F-18, F-19, F-21, F-24 |
| P23 | Parent access | First-launch PIN, access, PIN change and forgotten-PIN multiplication check; reset keeps profiles and progress. | P06, P05; F-25, D-28, D-54 |
| P24 | Parent profile management | Add/edit/delete profiles from the parent panel; replaces the pilot's PIN-less profile screen (F-03). | P23; F-02, F-03, F-26 |
| P25 | Profile picker | Tap to select a profile; no-profile and returning states; entry tap for audio; app updates activate here. | P24; F-01, F-36, D-60 |
| P26 | Backup data operations | Full export and replacing import, validation before writing, single-transaction commit, failure recovery and retry; test interrupted import. | P11; F-30, N-13, D-27, D-64 |
| P27 | Data migration | Versioned migrations that keep old data on failure; realistic older fixtures, success/abort/interruption checks. | P26; N-11, N-13, D-55, D-64 |
| P28 | Sticker album | One page per level, variable sticker count, special completion sticker, later review stickers, reward limit. | P22; F-19, D-24, D-41 |
| P29 | Lesson/level screen | Current, completed and unlocked lessons/levels, separate from mastery; child's theme switch outside exercises. | P15, P21; F-15, F-31, F-34 |
| P30 | Skip-level test and starting level | 10 questions, pass at 8; complete/unlock without mastery; starting-level override; seed unintroduced words under F-38. | P13, P29; F-16, F-17, F-26, F-38, D-31, D-53 |
| P31 | Parent summary | Learning days, daily time, completed lessons and levels; no comparison between children. | P19, P23, P29; F-27 |
| P32 | Difficult words | Latest up to 5 checked answers; enter at 2 errors, leave below 2; translations and replay; exclude ungraded audio failures. | P06, P23; F-28, F-39, D-68 |
| P33 | Parent settings | Time limit, automatic voice-over, per-profile themes, PIN change; changes apply to the intended profile. | P19, P23; F-29, F-31 |
| P34 | Backup and storage screen | Export/import confirmation and retry, persistence request/result, installation guidance, 7-day backup reminder. | P26, P27; F-30, F-37, D-66 |
| P35 | About screen | Credit Twemoji and the voices as their licences require, from the provenance recorded in P02. | P02; F-33, D-82 |
| C01… | Remaining lesson content | One task per remaining level-1 lesson and scoped level-2 lesson, with the same checks as P04. | P10 fixes; section 7, D-44, D-61 |
| P36 | Offline package and readiness | Manifest and precache for all final content and assets; download, verification of every listed file, readiness display, retry of interrupted preparation, offline reopen. | all C stages, P03; N-03–N-04, F-42, D-63 |
| P37 | App updates with existing data | New version activates only on the profile picker; existing progress survives; migrations run safely. | P36, P27, P25; N-11, F-36 |
| P38 | Release verification | Tests and critical browser flows; themes, orientations, touch targets, audio and offline on real devices; first usable load against N-07. Record devices and conditions. | P28–P37; N-01–N-08 |
| P39 | GitHub Pages release | The test-build Pages workflow exists since D-85; remove the test banner and confirm the workflow for the repository base path; publish after the product owner's approval; verify live path, assets, offline reopen and preserved local data. | P38; N-05, D-02 |
| P40 | Three-week MVP test | Observe both children against section 11; learning comparison from local review history (≥10 eligible words per child); keep family data out of the repo; evaluate the v1.1 gate. | P39; section 11, D-71–D-72 |

## Verification priorities

- Scheduling and counting: boundary dates, local calendar transitions, per-profile isolation, retry carryover, one promotion/day and the 10-minutes-plus-session condition.
- Storage: actual transaction abort/interruption, import/migration preservation, resume and idempotent awards. Passing mock-only tests is not evidence of real storage recovery.
- Audio/offline: blocked playback, missing files, unavailable local voices, interrupted preparation and offline restart. A child is never penalised for missing required audio.
- Pilot: validate the one-lesson pattern before producing the rest of the material. Add only changes supported by observations and approved requirements.
- Release: Playwright's WebKit checks complement actual iPad Safari testing; do not report emulation as a real-device pass.

## Official documentation used for the stack choice

- [React with Vite and TypeScript](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite static deployment and GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [idb](https://github.com/jakearchibald/idb)
- [Vite PWA](https://vite-pwa-org.netlify.app/guide/)
- [Vitest](https://vitest.dev/guide/)
- [Playwright](https://playwright.dev/docs/intro)

Version-specific implementation details and licences must be rechecked in the stage that uses them.

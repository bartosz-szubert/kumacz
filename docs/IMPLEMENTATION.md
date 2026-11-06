# Implementation proposal — Kumacz MVP

Status: **draft for a second opinion**, 2026-11-06. Stack and stage order are provisional; see [TECHNOLOGY_PROPOSAL.md](TECHNOLOGY_PROPOSAL.md).
Product baseline: approved PRD v0.10. Product behaviour comes from [PRD.md](PRD.md); current work and handoff belong in [STATUS.md](STATUS.md).

## Execution rules after approval

- Start implementation only after the second opinion and the product owner's final confirmation of the stack and plan. Until then these stages are proposals for review.
- Work in the order below, one agent at a time. Each numbered stage is one focused task, one session, one branch and one PR under AGENTS.md.
- Read only the current stage and the PRD sections it references. If a stage grows beyond a session, split it before continuing and record the remaining work in STATUS.
- At stage completion, record what passed, what remains, and the next stage in STATUS. Merge requires the product owner's explicit approval.
- For behaviour, use the installed TDD skill: demonstrate the expected outcome before implementing it. Test observable results, with real browser storage for transaction and interruption checks.
- For scaffolding, documentation and static assets, use relevant build, type, licence and data checks; do not add placeholder tests merely to claim a green suite.
- Use the installed source-driven-development, code-review-and-quality, security-and-hardening and debugging skills when applicable. Review official documentation before using version-specific APIs.
- Product parameters not specified in the PRD must be discussed when their stage needs them. Record an explicit choice rather than inventing a new product rule.
- Real children's profiles, progress and exported backups stay out of commits, test fixtures and CI artifacts.
- A technical prototype is not an MVP release. Full offline readiness requires all final MVP assets (D-63); a successful fixture-cache test alone is insufficient.

## Proposed stack and boundaries

- UI: React + TypeScript, built with Vite; ordinary CSS with custom properties for Electric and Neon.
- Data: IndexedDB through Dexie, behind the dedicated data layer. Components never access storage directly.
- Offline: vite-plugin-pwa with Workbox; explicitly configure the full asset package and readiness verification.
- Tests: Vitest for domain logic and focused integration tests, Playwright for critical browser flows. Actual Android Chrome and iPad Safari checks remain necessary.
- Hosting: static GitHub Pages at the repository base path.
- Resolve compatible stable versions and pin them during P01, after checking the available runtime and official docs. No application dependencies are installed by this documentation change.

Planned source boundaries, created as needed: `src/app`, `src/features`, `src/components`, `src/domain`, `src/data`, `src/content`, `src/audio`, `src/pwa`, `public/assets`, `tests/e2e`.
Keep scheduling, answer evaluation and session policies in the domain layer, separately from React, storage and audio.

## Stages

All stages below are pending. Prerequisites refer to earlier stages; execute stages sequentially, never in parallel.

| ID | Focus | Deliverable and acceptance | PRD / prerequisites |
|---|---|---|---|
| P01 | Project foundation | React/TypeScript/Vite scaffold, build/type-check scripts, Vitest and Playwright configuration. Pin compatible versions and the package-manager lockfile. Inspect dependency scripts before enabling them; verify a reproducible install. Build and type-check pass. | Proposed stack above; N-05, N-09 |
| P02 | Asset and voice feasibility | Verify licences of candidate emoji assets and specific English/Polish voices, including redistribution of generated audio. Record attribution and provenance. Generate a small technical audio fixture only after checks pass. Select suitable assets within D-18/D-48/D-57; paid tools require approval. | P01; D-18, D-48, D-49, D-57 |
| P03 | Audio player | Bundled English/Polish playback, user-initiated start, local-only speech fallback, replay and failure handling. No grading when required audio is unavailable; no remote voice fallback. | P02; F-07, F-39, F-41, N-04, D-60, D-62 |
| P04 | Offline technical prototype | Configure PWA manifest, repository-relative paths and caching for a complete fixture package. Verify interrupted preparation is not shown as ready and reopening without network plays the fixtures. Full-MVP readiness waits for P33. | P03; N-03, F-42, D-63 |
| P05 | Data contract and local store | Typed profile/progress/session/settings models and Dexie adapter behind a data-layer interface; stable content IDs, format version and bounded answer history with review-attempt context. | P01; section 10, N-10–N-12, D-55, D-71 |
| P06 | Reliable progress commits | Commit exercise result, session position and earned progress consistently. Demonstrate no duplicate results/rewards on retry or resume. On write failure preserve the last commit, pause progression and allow retry. Check real browser interruption at the storage boundary. | P05; F-36, F-43, D-38, D-65 |
| P07 | Shared UI and themes | Common touch controls and responsive shell, CSS theme variables, minimum 48×48 targets, readable contrast and reduced-motion handling. Review applicable UI-engineering guidance before building screens. | P01; N-01, N-02, N-08, F-21, F-31–F-32 |
| P08 | Parent access screen | First-launch PIN setup, access, PIN change and forgotten-PIN arithmetic check; reset preserves profiles and progress. Keep the local PIN's limited protection clear. | P05, P07; F-25, D-28, D-54 |
| P09 | Parent profile management | Add/edit/delete profiles through the parent screen and persist separate settings/progress. The starting-level override and its word placement are completed in P27. | P06, P08; F-02, F-03, F-26 |
| P10 | Profile picker | Select a profile through a tap and handle no-profile/returning-profile states without mixing saved state. Full learning-session integration follows in P20. | P09, P03; F-01, F-36, D-60 |
| P11 | Pilot lesson data | Prepare one level-1 lesson of the approved size as JSON, with stable IDs, translations, unambiguous pictures, allowed exercise types, plausible distractors and licensed bundled audio. Validate completeness. | P02, P03; section 7, F-39–F-40, D-44, D-57–D-59, D-61 |
| P12 | Listen and tap | One exercise type: spoken target, picture choices, checked answer, correct-answer feedback and translation. Required-audio failure never becomes a learning error. | P07, P11; F-06, F-09, F-39–F-41 |
| P13 | Flashcards | One exercise type: picture/front, word/pronunciation/translation on back, self-assessment. Self-assessment does not promote vocabulary or complete a lesson word. | P07, P11; F-08, F-34, F-39, D-33 |
| P14 | Picture to word | One exercise type: written choices, pronunciation only after answering, translation after feedback. Eligibility is supplied by the per-word listening-success rule. | P12; F-10, F-35, F-39, D-43, D-70 |
| P15 | Context questions | One exercise type using data-driven prompts and answer choices with one unambiguous correct answer. Apply audio/translation timing and same-category distractor rules. | P11, P12; F-11, F-39, F-40 |
| P16 | Leitner policy | Pure scheduling/evaluation functions: initial box, due-review-only promotion, once-per-day cap, two-box demotion, local calendar intervals, confirmed/unconfirmed skipped words and unchanged early-practice boxes. | P05; F-12–F-14, F-38, D-51–D-53, D-67 |
| P17 | Session composition | Build planned 8–12-exercise sessions with up to 3 new words, approximately half due reviews and lesson fill-in. Support review-only composition and introduced-word presentation. | P11, P16; F-04, F-05, D-30, D-34–D-35 |
| P18 | Session transitions | Apply answers, lesson completion, per-word written-task eligibility and pending retries. Retry after 2 intervening exercises or carry over; never extend the planned session for retries. Save pending state through the data layer. | P06, P17; F-06, F-34–F-36, D-69–D-70 |
| P19 | Learning time and day credit | Count visible active exercise time, respect inactivity/audio, accumulate daily time, qualify a day only at ≥10 minutes AND ≥1 completed session, and apply the reminder/reward limit. | P06, P18; F-20, F-22–F-24, F-44, D-76 |
| P20 | Learning session screen | Integrate the exercise types, session state, replay, progress and save-error pause into a child-facing screen. Resume the last saved position without repeated awards; menus/background do not accrue learning time. | P10, P12–P15, P18–P19; F-04–F-11, F-36, F-43 |
| P21 | Session reward screen | Stars and session reward presentation, praise, reduced motion and sticker reveal, with per-profile persistence and daily reward limits. Obtain any still-unspecified numerical reward amounts before implementing them. | P20; F-18, F-19, F-21, F-24 |
| P22 | Pilot lesson with the children | On the target device, observe one lesson's picture clarity, instruction comprehension, difficulty and independent use. Record findings without personal data; turn needed fixes into separate focused tasks. The lesson pattern must be checked before expanding content. | P21; D-44, section 7 |
| P23 | Backup data operations | Full export and replacing import, schema validation before writes, all-or-nothing commit, failure recovery and safe retry. Exercise the real storage boundary, including interrupted/failed import. | P05–P06; F-30, N-13, D-27, D-64 |
| P24 | Data migration | Versioned migrations that preserve the old committed data on failure, without silently resetting profiles. Verify success, abort and interruption behaviour using realistic older data fixtures. | P05–P06; N-11, N-13, D-55, D-64 |
| P25 | Sticker album screen | One page per level, variable sticker count and a special completion sticker. Completed pages continue accepting review stickers; respect the reward limit. | P21; F-19, D-24, D-41 |
| P26 | Lesson/level screen | Present current lessons, completed lessons and unlocked levels, with progress distinct from vocabulary mastery. Include the child's theme switch outside exercises. | P18, P20; F-15, F-31, F-34 |
| P27 | Skip-level test screen | Ten questions, pass at eight correct. Complete/unlock the level without marking all words mastered. Also wire the parent's starting-level override: seed unintroduced words under F-38 and retain introduced-word state. | P16, P26; F-16, F-17, F-26, F-38, D-31, D-53 |
| P28 | Parent summary screen | Per-child learning days, daily time, completed lessons and levels; no sibling comparison or leaderboard. | P08, P19, P26; F-27 |
| P29 | Difficult-word screen | Per-profile latest-up-to-5 checked-answer window; enter at 2 errors and leave below 2. Show translations and replay; exclude ungraded audio failures and respect history retention. | P03, P05, P08; F-28, F-39, D-68 |
| P30 | Parent settings screen | Time limit, automatic voice-over, per-profile themes and access to PIN change. Changes persist through the data layer and apply to the intended profile. | P08, P19; F-29, F-31 |
| P31 | Parent backup/storage screen | Export/import confirmation and retry UI; persistence request/result, installation guidance and backup reminders. Denied protection does not block learning when ordinary saving works; actual write failure follows F-43. | P23–P24; F-30, F-37, D-66 |
| P32 | About screen | Credit the actual selected assets and voices as their licences require, using the provenance verified in P02. | P02; F-33 |
| C01… | Remaining lesson content | After P22 and its necessary fixes, create one task/branch/PR per additional lesson. Apply the same JSON, picture, audio, licence and completeness checks as P11. Record the actual lesson ID and next lesson in STATUS. Finish the remaining level-1 topics and the scoped level-2 lessons. | P22; section 7, D-44, D-61 |
| P33 | Complete offline package | Build the manifest from all final level-1/2 content and assets. Verify downloads, readiness, retry, offline reopen and asset availability. Check app updates with existing progress and safe data migrations. Declare MVP offline readiness only after complete-package checks pass. | all C stages, P04, P24; N-03–N-04, F-42, D-63 |
| P34 | Release verification | Run relevant domain/integration tests and critical browser flows; check both themes, portrait/landscape, touch targets, audio and offline behaviour on target devices, plus first usable load against N-07. Record actual device/browser and conditions. Fix findings in separate focused tasks. | P25–P33; N-01–N-08 |
| P35 | GitHub Pages release | Prepare/review the static build and Pages workflow for the repository base path, then publish after the product owner's release/merge approval. Verify the live path, assets, offline reopen and preservation of existing local data. | P34; N-05, D-02 |
| P36 | Three-week MVP test | Observe both children against section 11. Derive the learning comparison from local ordinary-review history, with ≥10 eligible words per child and the approved threshold/ceiling rule. Keep raw family data out of the repo. Evaluate the v1.1 gate before adding sync or new subjects. | P35; section 11, D-71–D-72 |

## Verification priorities

- Scheduling and counting: boundary dates, local calendar transitions, per-profile isolation, retry carryover, one promotion/day and the 10-minutes-plus-session condition.
- Storage: actual transaction abort/interruption, import/migration preservation, resume and idempotent awards. Passing mock-only tests is not evidence of real storage recovery.
- Audio/offline: blocked playback, missing files, unavailable local voices, interrupted preparation and offline restart. A child is never penalised for missing required audio.
- Pilot: validate the one-lesson pattern before producing the rest of the material. Add only changes supported by observations and approved requirements.
- Release: Playwright's WebKit checks complement actual iPad Safari testing; do not report emulation as a real-device pass.

## Official documentation used for the stack choice

- [React with Vite and TypeScript](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite static deployment and GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [Dexie transactions](https://dexie.org/docs/Dexie/Dexie.transaction())
- [Vite PWA](https://vite-pwa-org.netlify.app/guide/)
- [Vitest](https://vitest.dev/guide/)
- [Playwright](https://playwright.dev/docs/intro)

Version-specific implementation details and licences must be rechecked in the stage that uses them.

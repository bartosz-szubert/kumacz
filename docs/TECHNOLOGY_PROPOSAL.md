# Technology proposal — Kumacz MVP

Status: **decided** on 2026-11-06 after a second opinion (Claude); decisions D-78–D-82 in the [PRD](PRD.md).
The original proposal (Codex) is kept below for context; the "Decision" section takes precedence where they differ.

## Decision (after the second opinion)

| Area | Decision | ID |
|---|---|---|
| UI and build | React + TypeScript + Vite; ordinary CSS with custom properties; Vitest + Playwright | D-78 |
| Local data | IndexedDB via `idb` (instead of Dexie): one versioned document per profile plus a separate answer-history store; imports and migrations write the complete new state in one transaction | D-79 |
| Audio | MP3 (Piper WAV converted with a free tool), loaded whole from the cache and played through the Web Audio API | D-80 |
| Offline | vite-plugin-pwa / Workbox precache as proposed; readiness checks every file in the package list; a new app version activates only on the profile picker, never during a session | D-63, F-36 |
| Pilot | Early test build after about ten stages (see [IMPLEMENTATION.md](IMPLEMENTATION.md)) | D-81 |
| Pictures | Twemoji (jdecked/twemoji), graphics CC BY 4.0 | D-82 |

**Future option (not planned):** if data grows substantially (many subjects, v1.1 sync), consider a multi-table model, e.g. with Dexie (D-79).

## Second opinion summary

1. React + TypeScript + Vite: retained. About 15 screens justify a component framework; agents know it well; bundle size does not threaten N-07.
2. Dexie: replaced. The data set is small (a few profiles, tens of words, 90-day history). A per-profile document makes imports and migrations naturally all-or-nothing (N-11, N-13) with less code than multi-table transactions.
3. Offline: retained with two additions. Safari requests media with byte ranges, which plain cached responses do not serve, so audio is decoded from whole cached files via Web Audio (D-80). Ogg is not reliably supported on iPad Safari, so audio is MP3. App updates wait for the profile picker.
4. Pilot: moved from stage 22 to an early test build (D-81); the pilot checks pictures, instructions, difficulty and independent use and does not need PIN, parent panel, Leitner or offline.
5. Stage sizes: the old P06, P18, P20 and P33 were split.
6. Evidence still needed: Piper voice licences (huggingface.co was unreachable from the Claude session; check in P02); whether browsers reliably report local voices (`localService`) for D-62, on the tablet; real iPad tests in addition to Playwright WebKit. Emoji licences were checked in the source READMEs: Twemoji graphics CC BY 4.0, OpenMoji CC BY-SA 4.0.

---

## Original proposal (Codex, 2026-11-06)

## Proposed stack

| Area | Proposal | Purpose |
|---|---|---|
| UI | React + TypeScript | Build reusable screens and components; keep learning rules outside React. |
| Build | Vite | Local development and a static production build for GitHub Pages. |
| Local data | IndexedDB through Dexie | Profile/progress storage and transaction support behind the dedicated data layer. |
| Offline | vite-plugin-pwa / Workbox | Manifest, service-worker tooling and caching; implement explicit full-package readiness checks. |
| Styling | Ordinary CSS with custom properties | Electric/Neon themes and responsive, accessible controls. |
| Verification | Vitest + Playwright | Domain/integration checks and critical browser flows, complemented by actual target-device tests. |

Exact compatible tool and runtime versions would be checked and pinned during project setup, after a final technology decision. No app scaffold, dependencies or deployment have been introduced.

## Constraints the review must preserve

- Initial MVP: beginner English, grades 1–3, levels 1–2. Longer-term primary-school coverage and future subjects do not expand this release.
- Static GitHub Pages, no application server in the MVP (N-05).
- Local profile/progress storage through a dedicated data layer; stable IDs, migration and all-or-nothing import/migration behaviour (N-10–N-13).
- Android Chrome first, desktop Chrome/Edge and iPad Safari compatibility (N-01).
- Offline readiness only after the complete MVP package is locally available (N-03, D-63).
- Bundled audio; speech fallback uses local voices only. Failed required audio is ungraded (N-04, F-41).
- One pilot lesson with the children before expanding content (D-44).
- Work split into focused stages, one agent/session/branch/PR at a time (D-56).

## Rationale and tradeoffs

React can help organise the profile picker, exercise screens, album and parent panel as reusable UI components. The alternative originally presented was TypeScript + Vite without a UI framework: fewer dependencies, but more manually maintained view/state updates.

React with Vite also leaves architectural choices to the project. React's own documentation recommends considering frameworks and explains the tradeoffs of assembling an app from scratch. This proposal assumes a browser-only, locally stored MVP; the reviewer should assess whether that is sufficient justification.

Dexie simplifies IndexedDB transactions, but the application's import, migration, retry and interruption behaviour still needs deliberate design and real-browser verification. A library choice alone is not proof of data safety.

Likewise, the PWA plugin provides tooling, while full-asset completeness, interrupted downloads, update behaviour and honest readiness reporting remain application work.

The supporting libraries add maintenance and dependency-review work. Their value should be assessed against the size of the MVP rather than the long-term wish list.

## Second-opinion questions

1. Is React + TypeScript + Vite an appropriate starting point for this MVP? Would a materially simpler option reduce total work without making the UI harder to maintain?
2. Is Dexie justified for the transaction/migration requirements, or is a smaller IndexedDB abstraction preferable?
3. Is the proposed offline approach sufficient for the full content/audio package and safe app updates?
4. Does the [draft implementation sequence](IMPLEMENTATION.md) reach a useful child-facing pilot early enough? P22 currently follows 21 preceding stages; identify a smaller viable vertical slice if the sequence is too heavy.
5. Which stage boundaries should be split, reordered or simplified to fit one agent session and one focused PR?
6. What important compatibility, licence or verification assumptions need evidence before coding?

Please prioritise concrete correctness, scope and maintenance issues, cite PRD IDs where relevant, and propose specific changes. A useful review states whether to retain, amend or replace the proposal and identifies the smallest sensible first implementation step.

## Decision and execution status

Superseded by the "Decision" section at the top of this file.

## Official references checked

- [React from scratch, including framework tradeoffs and Vite](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite static deployment / GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [Dexie transactions](https://dexie.org/docs/Dexie/Dexie.transaction()) (not adopted, D-79)
- [Twemoji (jdecked/twemoji)](https://github.com/jdecked/twemoji) and [OpenMoji](https://github.com/hfg-gmuend/openmoji) licence sections
- [Vite PWA](https://vite-pwa-org.netlify.app/guide/)
- [Vitest](https://vitest.dev/guide/)
- [Playwright](https://playwright.dev/docs/intro)

Recheck version-specific implementation details and licences when a final stack is selected.

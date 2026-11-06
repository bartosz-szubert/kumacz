# Technology proposal — Kumacz MVP

Status: **draft for a second opinion**, 2026-11-06.
The product owner initially preferred option A and has requested a second opinion before introducing it. The technology choice and implementation sequence remain provisional. The approved product baseline is [PRD v0.10](PRD.md); this proposal does not change product requirements.

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

The product owner will make the final technology/plan decision after the second opinion. Until then, keep the PR in draft, leave the approved PRD and agent stack configuration unchanged, and do not start P01 or merge this proposal as the implementation baseline.

## Official references checked

- [React from scratch, including framework tradeoffs and Vite](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite static deployment / GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [Dexie transactions](https://dexie.org/docs/Dexie/Dexie.transaction())
- [Vite PWA](https://vite-pwa-org.netlify.app/guide/)
- [Vitest](https://vitest.dev/guide/)
- [Playwright](https://playwright.dev/docs/intro)

Recheck version-specific implementation details and licences when a final stack is selected.

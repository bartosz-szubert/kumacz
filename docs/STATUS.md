# Status

**Phase:** Pilot test build (implementation accepted; device/child checks pending)

Older Done and Handoff entries: [STATUS_ARCHIVE.md](STATUS_ARCHIVE.md).

## In progress

_No agent task running. Next are the P09 device checks, P10 observations and discussion of U-09._

## Resume point

- The published [pilot](https://bartosz-szubert.github.io/kumacz/) opens profiles and runs nine exercises with per-step saving/resume; audio preview is at `?preview=audio`. See [PILOT_SESSION.md](PILOT_SESSION.md).
- **Znam / Jeszcze nie** and both Polish prompts are accepted; retain the exact approved recordings and pictures. PRD decisions remain ordered D-86, D-87, D-88.
- Owner-supplied Claude review (2026-11-13): main types/build OK, 74 Vitest and 43 Chromium cases pass, all Pages publications successful; no blocking findings.
- Profiles use format 2; answer history, app settings and IndexedDB schema remain 1. Atomic migrations/writes preserve progress on failure. See [DATA_LAYER.md](DATA_LAYER.md).
- Accepted pilot limitation: after all seven words are introduced without errors, the first three repeat. Full word selection remains P14.

## Next

1. Complete P09 on the Android tablet with Chrome, including online audio, cached replay in airplane mode while the page stays open, a complete session, resume, both themes and instructions.
2. Run P10 using the [pilot observation protocol](PILOT_PROTOCOL.md). Keep raw observations local and record combined findings without personal data.
3. The five questions in section 5 of the [concept review](CONCEPT_REVIEW.md) have been answered. Discuss U-09 and U-10 in order, one topic at a time. Start P11 after P10 and these decisions.
4. Discuss later: U-11 rewards, U-12 child instructions and error messages, U-13 reading, U-14 pronunciation, U-15 devices and backups, U-16 short phrases and U-17 PRD consistency. These remain proposals.
5. Verify WebKit when its binary is available. P12 upgrade recovery, P27 general migrations and imports, P33 whole-minute validation and P36 offline preparation remain in the [implementation plan](IMPLEMENTATION.md).

## Done

- 2026-11-18 · The owner chose U-07 variant A. D-96 adds two vocabulary counts to the parent summary and a listening-practice suggestion to the difficult-word list.

- 2026-11-18 · The owner chose U-06 variant A. D-95 specifies a parent-led listening check before and after the MVP test, supplemented by in-app retention data.

- 2026-11-17 · The owner chose U-05 variant A. D-94 allows a flashcard to return once after „Jeszcze nie” if it fits the planned full MVP session.

- 2026-11-17 · The owner chose U-04 variant A for the MVP. D-93 keeps simple flashcards focused on listening and records a preference to consider optional recall after the MVP.

- 2026-11-17 · The owner chose U-03 variant A. D-92 records the shared suggested daily time target in the MVP and adds observation of attention to the P10 protocol.

## Handoff log

- 2026-11-18 · Codex · Recorded owner approval to merge U-07 PR #35 with D-96 · Discuss U-09 next. Complete P10 and the remaining decisions before P11.

- 2026-11-18 · Codex · Recorded owner approval to merge U-06 PR #34 with D-95 · Discuss U-07 next. Complete P10 and the remaining decisions before P11.

- 2026-11-17 · Codex · Recorded owner approval to merge U-05 PR #33 with D-94 · Discuss U-06 next. Complete P10 and the remaining decisions before P11.

- 2026-11-17 · Codex · Recorded owner approval to merge U-04 PR #32 with D-93 · Discuss U-05 next. Finish P10 and the remaining decisions before P11.

- 2026-11-17 · Codex · Recorded owner approval to merge U-03 PR #31 with D-92 · Discuss U-04 next. P11 waits for the pilot and remaining decisions.

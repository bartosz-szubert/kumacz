# Status

**Phase:** Pilot test build (implementation accepted; device/child checks pending)

Older Done and Handoff entries: [STATUS_ARCHIVE.md](STATUS_ARCHIVE.md).

## In progress

_U-05 variant A is ready for merge review. P09 device checks and P10 observations are pending._

## Resume point

- The published [pilot](https://bartosz-szubert.github.io/kumacz/) opens profiles and runs nine exercises with per-step saving/resume; audio preview is at `?preview=audio`. See [PILOT_SESSION.md](PILOT_SESSION.md).
- **Znam / Jeszcze nie** and both Polish prompts are accepted; retain the exact approved recordings and pictures. PRD decisions remain ordered D-86, D-87, D-88.
- Owner-supplied Claude review (2026-11-13): main types/build OK, 74 Vitest and 43 Chromium cases pass, all Pages publications successful; no blocking findings.
- Profiles use format 2; answer history, app settings and IndexedDB schema remain 1. Atomic migrations/writes preserve progress on failure. See [DATA_LAYER.md](DATA_LAYER.md).
- Accepted pilot limitation: after all seven words are introduced without errors, the first three repeat. Full word selection remains P14.

## Next

1. Complete P09 on the Android tablet with Chrome, including online audio, cached replay in airplane mode while the page stays open, a complete session, resume, both themes and instructions.
2. Run P10 using the [pilot observation protocol](PILOT_PROTOCOL.md). Keep raw observations local and record combined findings without personal data.
3. The five questions in section 5 of the [concept review](CONCEPT_REVIEW.md) have been answered. After the U-05 merge, discuss U-06–U-07 and U-09–U-10 in order, one topic at a time. Start P11 after P10 and these decisions.
4. Discuss later: U-11 rewards, U-12 child instructions and error messages, U-13 reading, U-14 pronunciation, U-15 devices and backups, U-16 short phrases and U-17 PRD consistency. These remain proposals.
5. Verify WebKit when its binary is available. P12 upgrade recovery, P27 general migrations and imports, P33 whole-minute validation and P36 offline preparation remain in the [implementation plan](IMPLEMENTATION.md).

## Done

- 2026-11-17 · The owner chose U-05 variant A. D-94 allows a flashcard to return once after „Jeszcze nie” if it fits the planned full MVP session.

- 2026-11-17 · The owner chose U-04 variant A for the MVP. D-93 keeps simple flashcards focused on listening and records a preference to consider optional recall after the MVP.

- 2026-11-17 · The owner chose U-03 variant A. D-92 records the shared suggested daily time target in the MVP and adds observation of attention to the P10 protocol.

- 2026-11-17 · The owner chose U-02 variant A. D-91 records shorter sessions, empty-plan messages and optional practice of weaker words.

- 2026-11-17 · The owner chose U-01 variant A. D-90 makes one completed session sufficient for learning-day credit and sets 10 minutes as a suggested daily target. The pilot protocol for U-08 was merged in PR #28.

## Handoff log

- 2026-11-17 · Codex · Prepared D-94 for U-05 · Await separate merge approval, then discuss U-06. Complete P10 and the remaining decisions before P11.

- 2026-11-17 · Codex · Recorded owner approval to merge U-04 PR #32 with D-93 · Discuss U-05 next. Finish P10 and the remaining decisions before P11.

- 2026-11-17 · Codex · Recorded owner approval to merge U-03 PR #31 with D-92 · Discuss U-04 next. P11 waits for the pilot and remaining decisions.

- 2026-11-17 · Codex · Recorded owner approval to merge U-02 PR #30 with D-91 · Discuss U-03 next. Complete the pilot and remaining decisions before P11.

- 2026-11-17 · Codex · Recorded owner approval to merge U-01 PR #29 with D-90 · Discuss U-02 next. Complete P10 and the remaining decisions before P11.

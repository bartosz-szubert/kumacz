# Status

**Phase:** Pilot test build (implementation accepted; device/child checks pending)

Older Done and Handoff entries: [STATUS_ARCHIVE.md](STATUS_ARCHIVE.md).

## In progress

_README refresh is ready for merge review. P09 device checks and P10 observations are pending._

## Resume point

- The published [pilot](https://bartosz-szubert.github.io/kumacz/) opens profiles and runs nine exercises with per-step saving/resume; audio preview is at `?preview=audio`. See [PILOT_SESSION.md](PILOT_SESSION.md).
- **Znam / Jeszcze nie** and both Polish prompts are accepted; retain the exact approved recordings and pictures. PRD decisions remain ordered D-86, D-87, D-88.
- Owner-supplied Claude review (2026-11-13): main types/build OK, 74 Vitest and 43 Chromium cases pass, all Pages publications successful; no blocking findings.
- Profiles use format 2; answer history, app settings and IndexedDB schema remain 1. Atomic migrations/writes preserve progress on failure. See [DATA_LAYER.md](DATA_LAYER.md).
- Accepted pilot limitation: after all seven words are introduced without errors, the first three repeat. Full word selection remains P14.

## Next

1. Complete P09 on the Android tablet with Chrome, including online audio, cached replay in airplane mode while the page stays open, a complete session, resume, both themes and instructions.
2. Run P10 using the [pilot observation protocol](PILOT_PROTOCOL.md). Keep raw observations local and record combined findings without personal data.
3. Start P11 after completing P10. The pre-P11 decisions are complete (D-89–D-98).
4. Discuss later: U-11 rewards, U-12 child instructions and error messages, U-13 reading, U-14 pronunciation, U-15 devices and backups, U-16 short phrases and U-17 PRD consistency. These remain proposals.
5. Verify WebKit when its binary is available. P12 upgrade recovery, P27 general migrations and imports, P33 whole-minute validation and P36 offline preparation remain in the [implementation plan](IMPLEMENTATION.md).

## Done

- 2026-11-22 · Shortened the public README, linked the published pilot and added a maintenance rule to AGENTS.md.

- 2026-11-18 · The owner chose U-10 variant A. D-98 keeps three exercise types and the parent-set starting level in the MVP, and defers context questions and the skip-level test.

- 2026-11-18 · The owner chose U-09 variant A. D-97 schedules the three-week family test P29A once the learning flow and Level 1 are ready.

- 2026-11-18 · The owner chose U-07 variant A. D-96 adds two vocabulary counts to the parent summary and a listening-practice suggestion to the difficult-word list.

- 2026-11-18 · The owner chose U-06 variant A. D-95 specifies a parent-led listening check before and after the MVP test, supplemented by in-app retention data.

## Handoff log

- 2026-11-22 · Codex · Prepared the README refresh for merge review · P09 device checks and P10 are next.

- 2026-11-18 · Codex · Recorded owner approval to merge U-10 PR #37 with D-98 · Complete the P09 device checks and P10 before starting P11.

- 2026-11-18 · Codex · Recorded owner approval to merge U-09 PR #36 with D-97 · Discuss U-10 next. P11 follows P10 and the remaining decisions.

- 2026-11-18 · Codex · Recorded owner approval to merge U-07 PR #35 with D-96 · Discuss U-09 next. Complete P10 and the remaining decisions before P11.

- 2026-11-18 · Codex · Recorded owner approval to merge U-06 PR #34 with D-95 · Discuss U-07 next. Complete P10 and the remaining decisions before P11.

# Status

**Phase:** Pilot test build (implementation accepted; device/child checks pending)

Older Done and Handoff entries: [STATUS_ARCHIVE.md](STATUS_ARCHIVE.md).

## In progress

_No agent task running. Next are the P09 device checks, P10 observations and discussion of U-02._

## Resume point

- The published [pilot](https://bartosz-szubert.github.io/kumacz/) opens profiles and runs nine exercises with per-step saving/resume; audio preview is at `?preview=audio`. See [PILOT_SESSION.md](PILOT_SESSION.md).
- **Znam / Jeszcze nie** and both Polish prompts are accepted; retain the exact approved recordings and pictures. PRD decisions remain ordered D-86, D-87, D-88.
- Owner-supplied Claude review (2026-11-13): main types/build OK, 74 Vitest and 43 Chromium cases pass, all Pages publications successful; no blocking findings.
- Profiles use format 2; answer history, app settings and IndexedDB schema remain 1. Atomic migrations/writes preserve progress on failure. See [DATA_LAYER.md](DATA_LAYER.md).
- Accepted pilot limitation: after all seven words are introduced without errors, the first three repeat. Full word selection remains P14.

## Next

1. Complete P09 on the Android tablet with Chrome, including online audio, cached replay in airplane mode while the page stays open, a complete session, resume, both themes and instructions.
2. Run P10 using the [pilot observation protocol](PILOT_PROTOCOL.md). Keep raw observations local and record combined findings without personal data.
3. The five questions in section 5 of the [concept review](CONCEPT_REVIEW.md) have been answered. Discuss U-02, U-03, U-04–U-05, U-06–U-07 and U-09–U-10 in order, one topic at a time. Start P11 after P10 and these decisions.
4. Discuss later: U-11 rewards, U-12 child instructions and error messages, U-13 reading, U-14 pronunciation, U-15 devices and backups, U-16 short phrases and U-17 PRD consistency. These remain proposals.
5. Verify WebKit when its binary is available. P12 upgrade recovery, P27 general migrations and imports, P33 whole-minute validation and P36 offline preparation remain in the [implementation plan](IMPLEMENTATION.md).

## Done

- 2026-11-17 · The owner chose U-01 variant A. D-90 makes one completed session sufficient for learning-day credit and sets 10 minutes as a suggested daily target. The pilot protocol for U-08 was merged in PR #28.

- 2026-11-17 · Recorded the owner's U-08 variant A as D-89 and prepared the P10 observation protocol with decision thresholds and a summary without personal data.

- 2026-11-14 · Added an independent concept/PRD review in `docs/CONCEPT_REVIEW.md` (Polish; proposals only). No PRD, code or asset changes.

- 2026-11-13 · Accepted the documentation cleanup: compact status, verbatim history archive and corrected P36 offline-reopen reference; no code or PRD changes.

- P09b implementation accepted on 2026-11-12: the owner explicitly approved merging PR #24 after the three-point summary and passing types/build, 74 Vitest cases and 43 Chromium cases. Acceptance changes documentation only; application behavior, data and accepted recordings are unchanged. Real-device P09 acceptance and P10 child checks remain pending.

## Handoff log

- 2026-11-17 · Codex · Recorded owner approval to merge U-01 PR #29 with D-90 · Discuss U-02 next. Complete P10 and the remaining decisions before P11.

- 2026-11-17 · Codex · Prepared the P10 protocol for merge review after the owner chose variant A · Next are the section 5 questions and the pilot. P11 waits for P10 and the required decisions.

- 2026-11-14 · Claude · Wrote `docs/CONCEPT_REVIEW.md` on `docs/concept-review` at the owner's request · Proposals need owner decisions before any PRD change; main themes: 10-minute goal vs session length and content pace, recognition-only exercises, learning metric, pilot protocol, stage order.

- 2026-11-13 · Codex · Recorded owner approval of docs/status-cleanup; historical entries and the supplied Claude review are preserved · The owner explicitly approved merging PR #26; next are P09 device checks and P10.

- 2026-11-12 · Codex · Recorded explicit owner #24 merge approval after all stages were reconciled/approved sequentially; retained exact accepted prompt bytes, Znam labels and ordered D-86/D-87/D-88 · Verify Pages publication, then owner Android tablet + Chrome checks and P10 observations. Implementation acceptance does not claim physical-device or child validation; no P11 start yet.

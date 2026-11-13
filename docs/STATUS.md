# Status

**Phase:** Pilot test build (implementation accepted; device/child checks pending)

Older Done and Handoff entries: [STATUS_ARCHIVE.md](STATUS_ARCHIVE.md).

## In progress

_No agent task running. Next are P09 device checks and P10 observations._

## Resume point

- The published [pilot](https://bartosz-szubert.github.io/kumacz/) opens profiles and runs nine exercises with per-step saving/resume; audio preview is at `?preview=audio`. See [PILOT_SESSION.md](PILOT_SESSION.md).
- **Znam / Jeszcze nie** and both Polish prompts are accepted; retain the exact approved recordings and pictures. PRD decisions remain ordered D-86, D-87, D-88.
- Owner-supplied Claude review (2026-11-13): main types/build OK, 74 Vitest and 43 Chromium cases pass, all Pages publications successful; no blocking findings.
- Profiles use format 2; answer history, app settings and IndexedDB schema remain 1. Atomic migrations/writes preserve progress on failure. See [DATA_LAYER.md](DATA_LAYER.md).
- Accepted pilot limitation: after all seven words are introduced without errors, the first three repeat. Full word selection remains P14.

## Next

1. Complete P09 on the actual Android tablet with Chrome: online audio, cached replay in airplane mode while the page stays open, a complete session, resume, both themes and instructions.
2. Run P10 with the children; record picture/instruction clarity and independent use without personal data. Address pilot findings before continuing from P11.
3. Keep P12 upgrade/refresh/conflict guidance, P27 general migrations/imports and P33 whole-minute validation in their planned stages.
4. Verify WebKit when its binary is available. Full offline preparation and reopening belong to P36; see [IMPLEMENTATION.md](IMPLEMENTATION.md).

## Done

- 2026-11-13 · Accepted the documentation cleanup: compact status, verbatim history archive and corrected P36 offline-reopen reference; no code or PRD changes.

- P09b implementation accepted on 2026-11-12: the owner explicitly approved merging PR #24 after the three-point summary and passing types/build, 74 Vitest cases and 43 Chromium cases. Acceptance changes documentation only; application behavior, data and accepted recordings are unchanged. Real-device P09 acceptance and P10 child checks remain pending.

- P09b reconciled on 2026-11-12 after the approved #23 merge: PR #24 targets main, the Znam labels and accepted P08 assets are carried forward, the flashcard canContinue save gate is preserved, pilot tests use the current label and PRD decisions remain D-86/D-87/D-88. Introduction approval is recorded with unchanged audio bytes. Fresh types/build, 74 Vitest cases and 43 Chromium cases passed, including a complete nine-exercise flow, native pending-save retry without duplicates and interrupted-session resume. The owner subsequently approved the P09b merge on 2026-11-12; physical device/child checks remain pending.

- P09a accepted on 2026-11-12: the owner explicitly authorized merging PR #23 after the three-point summary and passing types/build, 62 Vitest cases and 38 Chromium cases. Approval changes documentation only; migration, validation and accepted asset bytes are unchanged.

- P09a reconciled on 2026-11-12 after the owner's approved P08 merge: PR #23 targets main; the STATUS-only conflict preserves accepted P07/P08, both prompt approvals, D-87/D-88 and Claude's review. Migration and validation implementation bytes remain unchanged from the reviewed P09a head. Types/build, 62 Vitest cases and 38 Chromium cases passed after reconciliation. The owner subsequently approved merging P09a on 2026-11-12.

## Handoff log

- 2026-11-13 · Codex · Recorded owner approval of docs/status-cleanup; historical entries and the supplied Claude review are preserved · The owner explicitly approved merging PR #26; next are P09 device checks and P10.

- 2026-11-12 · Codex · Recorded explicit owner #24 merge approval after all stages were reconciled/approved sequentially; retained exact accepted prompt bytes, Znam labels and ordered D-86/D-87/D-88 · Verify Pages publication, then owner Android tablet + Chrome checks and P10 observations. Implementation acceptance does not claim physical-device or child validation; no P11 start yet.

- 2026-11-12 · Codex · Merged approved P09a #23 and reconciled P09b #24 onto main, retaining accepted recordings/Znam, the pending-save continuation guard and ordered D-86/D-87/D-88 · Await separate #24 merge approval, then Pages/device acceptance and P10. No pilot learning-policy changes; full word selection remains P14.

- 2026-11-12 · Codex · Recorded explicit owner P09a #23 merge approval without changing its reviewed implementation · Next reconcile #24 onto main, carry accepted prompts/Znam forward and preserve D-86/D-87/D-88 order. #24 still needs its own merge approval and P09/P10 device/child checks remain pending.

- 2026-11-12 · Codex · Merged owner-approved P08 PR #22 with exact recording approval metadata; reconciled P09a #23 onto main and retained its unchanged migration behavior · Await separate #23 merge approval. Only afterward reconcile #24, carry accepted recordings/Znam forward and preserve D-86/D-87/D-88 order; no #24 merge approval yet.

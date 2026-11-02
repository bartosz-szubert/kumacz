# Status

**Phase:** PRD review (before development)
**Last updated:** 2026-11-02

## In progress

_Nothing. The next agent may start._

## Next

1. Continue the PRD review one decision at a time: next, how many new words to introduce per session and how to present them before testing. The daily Leitner promotion cap and checked-answer-only promotion are recorded as D-32–D-33.
2. Review remaining ambiguities and approve the PRD (gate "PRD approved").
3. Choose the tech stack after PRD approval and fill in "Stack and structure" in `AGENTS.md`.
4. Validate speech synthesis and offline audio behaviour on the target devices.

## Done

- Recorded checked-answer-only Leitner promotion; flashcard self-assessment does not change the box (D-33, F-08, F-12).
- Recorded the product owner's choice A: at most one Leitner promotion per word per profile per day (D-32, F-12), PRD v0.7.

- Public repository created.
- Reviews, learning-day and time counting, backup restore, PIN recovery and skip-level test: D-25–D-31, PRD v0.6.
- Lesson and level completion rules and sticker album: D-21–D-24 (F-34, F-15, F-19), PRD v0.5.
- PRD v0.4 (`docs/PRD.md`); D-18–D-20 reviewed with the product owner: bundled open emoji set, per-profile themes, British English.
- README.
- Agent instructions (`AGENTS.md`, `CLAUDE.md`) and this status file.

## Handoff log

Newest first. One line per finished task: date · agent · what was done · anything the next agent must know.

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

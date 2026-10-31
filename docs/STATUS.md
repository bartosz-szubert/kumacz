# Status

**Phase:** PRD review (before development)
**Last updated:** 2026-10-31

## In progress

_Nothing. The next agent may start._

## Next

1. Clarify learning and recovery rules in the PRD, one question at a time: level completion, Leitner scheduling, learning-day and time counting, backup restore and forgotten PIN handling.
   - Next question: level completion (F-15) — e.g. all lessons completed, and how it relates to the full sticker album page (F-19) and the skip-level test (F-16).
2. Approve the PRD (gate "PRD approved").
3. Choose the tech stack and fill in "Stack and structure" in `AGENTS.md`.

## Done

- Public repository created.
- Lesson completion rule: D-21, D-22 / F-34, PRD v0.5.
- PRD v0.4 (`docs/PRD.md`); D-18–D-20 reviewed with the product owner: bundled open emoji set, per-profile themes, British English.
- README.
- Agent instructions (`AGENTS.md`, `CLAUDE.md`) and this status file.

## Handoff log

Newest first. One line per finished task: date · agent · what was done · anything the next agent must know.

- 2026-10-31 · Claude · Recorded which answers count towards lesson completion (D-22) · Ask next about level completion.
- 2026-10-31 · Claude · Recorded lesson completion rule (D-21, F-34) · Ask next whether flashcard "I know it" counts towards F-34.

- 2026-10-31 · Claude · Added collaboration rules and merge rule to `AGENTS.md` · Work continues in a new Claude Code session; start from the pending lesson-completion question above.

- 2026-10-31 · Claude · Revised D-18 (open emoji set instead of own SVG), D-19 (per-profile theme), confirmed D-20; added F-33 (About/attribution) · Only record decisions the product owner explicitly chose.

- 2026-10-31 · Codex · Recorded product decisions D-18–D-20 in PRD v0.3 · PRD remains a draft; clarify learning and recovery rules before approval and technology selection.
- 2026-10-31 · Claude · Added agent instructions and status file · Agents work in turns; check "In progress" before starting.

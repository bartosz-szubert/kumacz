# Status

**Phase:** PRD review (before development)
**Last updated:** 2026-11-02

## In progress

_Nothing. The next agent may start._

## Next

1. **In progress (Claude, with the product owner):** PRD v0.7 expert review, one question at a time; D-46, D-47 recorded. Remaining review points: source and licence of audio recordings, storage durability, Leitner reset on errors, initial box for new/skipped words, PIN reset mechanism, stable IDs and data schema version, emoji coverage. Then complete the integrated PRD v0.7 review, including remaining rule details and the speech-synthesis/offline-audio validation plan, then approve it (gate "PRD approved"). D-32–D-45 are approved product decisions; the entire PRD is still a draft.
2. Choose the tech stack after PRD approval and fill in "Stack and structure" in `AGENTS.md`.
3. Validate speech synthesis and offline audio behaviour on the target devices.

## Done

- Recorded Leitner promotion only in due reviews; correct earlier practice leaves the box and scheduled review date unchanged (D-45, F-12, F-13).
- Recorded validation of one pilot lesson with the children during implementation before preparing the full MVP content (D-44, section 7).
- Recorded English pronunciation only after answering picture-to-word exercises, with Polish instruction playback available before answering (D-43, F-07, F-10).
- Recorded short, calm reward animations enabled by default, with static rewards when the device requests reduced motion (D-42, F-21).
- Recorded review stickers continuing on the completed level's page; its special sticker marks completion without blocking additions (D-41, F-19, clarification of D-24).
- Recorded learning improvement measured on the same words across reviews after a time gap, replacing the difficult-word-count metric (D-40, section 11).
- Recorded a difficult-word list based on recent checked answers rather than lifetime error totals (D-39, F-28).
- Recorded per-exercise saving and interrupted-session resumption, with no duplicate rewards and completion-based session rewards and learning-day credit (D-38, F-36).
- Recorded gradual introduction of written-word exercises after listening and picture-based tasks (D-37, F-35).
- Recorded retry after several intervening exercises rather than immediately after error feedback (D-36, F-06).
- Recorded picture, written word and pronunciation before first testing a new word; due reviews start with a question (D-35, F-04).
- Recorded at most 3 new words per learning session (D-34, F-04).
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

- 2026-11-02 · Codex · Finalized PRD v0.7 decisions D-32–D-45 and handoff in PR #4; product owner explicitly approved merging · Resume the integrated draft review; whole-PRD approval and technology selection are still pending.
- 2026-11-02 · Codex · Recorded approved due-review-only Leitner promotion (D-45) in PR #4; D-32–D-45 ready for merge review, explicit merge approval pending · The PRD remains a draft; remaining detailed rules and device-audio validation still need review.
- 2026-11-02 · Codex · Recorded approved pilot-lesson validation before content expansion (D-44) in PR #4; merge pending product-owner approval · Next clarify Leitner promotion eligibility before the due date; PRD approval and technology selection still precede implementation.
- 2026-11-02 · Codex · Recorded approved picture-to-word audio timing (D-43) in PR #4; merge pending product-owner approval · Next discuss pilot content validation; speech synthesis and offline audio still need device testing after PRD approval.
- 2026-11-02 · Codex · Recorded approved default calm reward animations and reduced-motion behaviour (D-42) in PR #4; merge pending product-owner approval · Next clarify task-specific audio without revealing answers; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved review-sticker placement on completed level pages (D-41) in PR #4; merge pending product-owner approval · Next discuss reward animations and reduced motion; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved same-word delayed-review learning metric (D-40, section 11) in PR #4; merge pending product-owner approval · Next clarify stickers after level completion; the measurement sample and numerical target remain unspecified.
- 2026-11-02 · Codex · Recorded approved recent-answer difficult-word list (D-39, F-28) in PR #4; merge pending product-owner approval · Next discuss the learning success metric; recent-answer window and classification threshold remain unspecified.
- 2026-11-02 · Codex · Recorded approved per-exercise saving and interrupted-session resumption (D-38, F-36) in PR #4; merge pending product-owner approval · Next discuss difficult-word metrics; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved gradual written-word exercise introduction (D-37, F-35) in PR #4; merge pending product-owner approval · Next discuss interrupted sessions; the precise progression trigger remains unspecified.
- 2026-11-02 · Codex · Recorded approved delayed retry after error feedback (D-36) in PR #4; merge pending product-owner approval · Next discuss reading demands; exact retry spacing and end-of-session handling remain unspecified.
- 2026-11-02 · Codex · Recorded approved introduction before testing (D-35) in PR #4; merge pending product-owner approval · Next decide when to retry a wrong answer; remaining review suggestions are proposals.
- 2026-11-02 · Codex · Recorded approved maximum of 3 new words per session (D-34) in PR #4; merge pending product-owner approval · Next decide how to present new words before testing; remaining review suggestions are proposals.
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

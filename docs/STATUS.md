# Status

**Phase:** Technology selection (before development)
**Last updated:** 2026-11-06

## In progress

_Nothing. The next agent may start._

## Next

1. Present technology options with a recommendation, obtain the product owner's choice and fill in "Stack and structure" in `AGENTS.md`; then prepare a stage plan where each stage fits one agent session (D-56).
2. Before generating audio, verify Piper voice licences (D-48); huggingface.co was not reachable from the earlier Claude session. Validate offline playback of bundled audio and the local speech-synthesis fallback on target devices (D-47, D-62).

## Done

- Product owner accepted integrated PRD v0.10; recorded the approval gate as passed (D-77). Next phase: technology selection.
- Recorded learning-day credit only after both at least 10 minutes of counted learning and at least one completed session that day (D-76, F-20; revision of D-25). Updated README and related completion references.
- Recorded product-owner review: initial grades 1–3 focus within a long-term all-primary-school audience, a daily goal of at least 10 minutes with longer learning allowed, and future natural-science/geography modules (D-73–D-75), draft PRD v0.10. Aligned README and agent context.
- Recorded per-child learning target: at least 10 eligible words, +20 percentage points or maintenance of an initial score of at least 80%; smaller samples are insufficient (D-72, section 11).
- Recorded learning measurement from first and last independent due-review answers for the same words, per child, without a separate examination (D-71, section 11, N-12).
- Recorded written-word exercises becoming available per word after its first correct listen-and-tap answer (D-70, F-35, clarification of D-37).
- Recorded retry after 2 intervening exercises when it fits, otherwise next-session carryover without extending the session (D-69, F-06, clarification of D-36/D-51).
- Recorded difficult words as at least 2 errors in the latest up to 5 checked answers, with removal below that threshold (D-68, F-28).
- Recorded review intervals in the device's local calendar days, with reviews due from the start of the target date (D-67, F-12, F-13).
- Recorded continued learning after persistent-storage refusal when ordinary saving works, with parent information and backup reminders; corrected overstrong storage guarantees (D-66, F-37).
- Recorded paused session progression on failed progress saving, preservation of the last successful save and safe retry before continuing (D-65, F-36, F-43).
- Recorded all-or-nothing backup imports and migrations, preserving existing data on failure and allowing retry (D-64, F-30, N-11, N-13).
- Recorded offline readiness only after the full MVP package is locally available, separate from initial interface load; incomplete preparation can be retried (D-63, N-03, N-07, F-42).
- Recorded local-only speech-synthesis fallback and retry without grading when required audio is unavailable (D-62, N-04, F-41), PRD v0.9 draft.
- Recorded approved level 1 lesson sizes: 8 colours, 10 numbers, 7 animals and 7 fruit, keeping 32 words (D-61, clarification of D-46), PRD v0.9 draft.
- Coding skills for Codex and Claude Code (test-driven-development, code-review-and-quality, source-driven-development, debugging-and-error-recovery, security-and-hardening) from bartosz-szubert/agent-skills.
- Agent skills for Codex and Claude Code (diagram-design, humanizer, interview-me) from the reviewed copies in bartosz-szubert/agent-skills; `AGENTS.md` clarifies that the no-trademarks rule covers the app, not agent tooling.
- Expert PRD review with the product owner: D-46–D-60 (level 1 size, bundled generated audio, minimum cost, data durability, gentler Leitner demotion, initial and skipped-word boxes, PIN reset check, data rules, staged implementation, picture rule, translations, distractors, tap before audio), PRD v0.8.
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

- 2026-11-06 · Codex · Finalized the approved PRD v0.10 record (D-77) in PR #10; product owner explicitly approved merging · Next present technology options with a recommendation, obtain the product owner's choice, then plan implementation stages (D-56).
- 2026-11-06 · Codex · Recorded acceptance of integrated PRD v0.10 as D-77 on `docs/prd-approval`; merge pending explicit approval · Present stack options next; no technology decision or implementation has been authorized yet.
- 2026-11-06 · Codex · Finalized product-owner review changes D-73–D-76 in PR #9; product owner explicitly approved merging · PRD v0.10 remains a draft pending whole-document approval; next choose the stack after approval and verify voice licences before audio generation.
- 2026-11-06 · Codex · Recorded explicit learning-day clarification as D-76 in PR #9: at least 10 minutes AND at least one completed session on the same day; merge pending approval · Product-review changes D-73–D-76 are ready for merge review; whole-PRD approval remains pending.
- 2026-11-06 · Codex · Recorded explicit product-owner review feedback as D-73–D-75 on `docs/product-owner-prd-review`; merge pending approval · Clarify how the 10-minute goal relates to weekly learning-day credit; F-20 and D-25 have not been changed, and whole-PRD approval remains pending.
- 2026-11-04 · Codex · Finalized skill-informed PRD v0.9 review decisions D-61–D-72 in PR #8; product owner explicitly approved merging · Next is the product owner's final PRD reading; whole-PRD approval, technology choice and voice-licence verification remain pending.
- 2026-11-04 · Codex · Recorded approved minimum learning sample and success threshold (D-72); D-61–D-72 ready for PR #8 review, merge pending explicit approval · PRD v0.9 remains a draft; final product-owner reading, whole-PRD approval and voice-licence verification are still pending.
- 2026-11-04 · Codex · Recorded approved ordinary-review learning measurement (D-71) in PR #8; merge pending explicit approval · Next agree the minimum sample and numerical success threshold; whole-PRD approval remains pending.
- 2026-11-04 · Codex · Recorded approved per-word listening-success trigger for written-word tasks (D-70) in PR #8; merge pending explicit approval · Next define the learning success measurement and target; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved retry spacing and next-session carryover (D-69) in PR #8; merge pending explicit approval · Next define the written-word exercise introduction trigger; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved 2-errors-in-5 difficult-word rule (D-68) in PR #8; merge pending explicit approval · Next clarify delayed retries near session end; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved local-calendar review intervals (D-67) in PR #8; merge pending explicit approval · Next define the difficult-word window and threshold; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved graceful handling of persistent-storage refusal (D-66) in PR #8 and corrected F-37's unconditional Safari-retention claim; merge pending explicit approval · Next discuss review-day calculation; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved pause-and-retry behaviour for failed progress saving (D-65) in PR #8; merge pending explicit approval · Next distinguish refusal of persistent-storage protection from actual write failure; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved all-or-nothing import and migration behaviour (D-64) in PR #8; merge pending explicit approval · Next discuss failed progress saving during learning; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved full-MVP offline-readiness criteria (D-63) in PR #8; merge pending explicit approval · Next discuss failed imports and migrations; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded approved local-only speech fallback and ungraded listening exercises on audio failure (D-62) in PR #8; merge pending explicit approval · Next decide offline-readiness criteria; other review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Codex · Recorded product-owner choice A for level 1 lesson sizes (D-61) on `docs/prd-review-clarifications`; merge pending explicit approval · Next discuss local-only speech fallback; other skill-informed review proposals and whole-PRD approval remain pending.
- 2026-11-04 · Claude · Added coding skills in `.agents/skills/` with symlinks in `.claude/skills/` · Tooling only; `AGENTS.md` rules take precedence over skills. `frontend-ui-engineering` is available in agent-skills once the stack is chosen.
- 2026-11-04 · Claude · Added agent skills in `.agents/skills/` with symlinks in `.claude/skills/`; trademark rule clarified (product owner's choice B) · Tooling only; product next steps unchanged. Never copy icons from `diagram-design` into the app.
- 2026-11-02 · Claude · Expert PRD review, D-46–D-60, PRD v0.8 · All review points closed; next is PRD approval, then tech stack and a stage plan sized to one session each (D-56).
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

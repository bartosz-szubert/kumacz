# Kumacz — instructions for coding agents

Kumacz is a learning web app for primary school kids. First module: beginner English for grades 1–3.
This file is read by every agent (Codex, Claude Code). Keep it short: every line costs tokens on every task.

## Start every task here

1. Read `docs/STATUS.md` — current phase, what is in progress, what is next.
2. Read only the PRD sections the task needs (`docs/PRD.md`). Refer to requirements by ID: `F-xx` functional, `N-xx` non-functional, `D-xx` decisions.
3. Do not scan the whole repository unless the task requires it.

## Working with the product owner (Bartek)

- Talk to him in Polish. Ask one question at a time and wait for the answer.
- Be concise. Put anything he should copy (names, commands, texts) in a separate code block. When guiding him through steps, number them and ask at the end whether it worked.
- Never make product decisions for him. Present 2–3 options with pros and cons, give a recommendation with reasons, ask which he chooses.
- "OK" to a list of next steps is not approval of the decisions inside it; discuss each decision first.
- Record a decision in the PRD (new `D-xx`) only after he explicitly picks an option.
- Say plainly when an idea has a weak point (cost, risk, scope, copyright) and propose a better option. Keep MVP scope; suggest new ideas for later versions.
- Before starting, say in 1–2 sentences what you will do; for PRD or scope changes wait for his "ok".
- Do not summarise files he can open himself.

## Workflow (agents work in turns, never in parallel)

- If `docs/STATUS.md` shows a task "In progress" by another agent, stop and ask the product owner.
- One task = one branch (`feature/<name>`, `fix/<name>`, `docs/<name>`) = one pull request to `main`.
- Merge only after the product owner's explicit "ok" in the conversation. Before asking, summarise the changes in 3–5 bullets.
- Keep tasks small: one screen, one exercise type, one data change.
- Before finishing, update `docs/STATUS.md` in the same PR: move the task to Done, set Next, add a one-line handoff note.
- Commit messages: English, imperative mood, short (`Add profile picker screen`).

## Product rules

- Scope follows the PRD. Anything outside it: propose, do not build. Scope changes are recorded as new `D-xx` entries.
- No trademarks: no characters, logos or names of protected brands, in code, assets or content.
- Public repo: never commit secrets, API keys, tokens or personal data.
- Children's data: nickname, avatar, progress only.

## Technical rules

- Static app on GitHub Pages; no server in v1.0 (N-05).
- All storage goes through the data layer; nothing else touches storage directly (PRD section 10).
- Learning content lives in JSON data files, separate from code (PRD section 7).
- Targets: Android tablet + Chrome first, desktop Chrome/Edge, iPad Safari compatible (N-01). Touch targets ≥ 48×48 px (N-02).
- Languages: code, comments, docs and commits in English; UI strings in Polish; learning content in the module's language.

## Stack and structure

Not chosen yet. This section will be filled in when the technology decision is made.

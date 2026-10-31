# PRD — Kumacz

**Educational web app for primary school children**

| | |
|---|---|
| Document version | 0.2 (draft for approval) |
| Date | 2026-10-31 |
| Product owner | Bartek |
| Status | For review before development starts ("PRD approved" gate) |
| Repository | `kumacz` (public, GitHub) |
| Hosting | GitHub Pages: `<login>.github.io/kumacz` |

---

## 1. Product goal

Kumacz is an educational web app for children in grades 1–3 of primary school. It teaches through short daily sessions with gentle gamification that **rewards consistency, not competition**.

First module: **English at beginner level**. Further modules (e.g. German, maths, aligned with the Polish national curriculum) should be addable without rebuilding the app.

## 2. Problem

- Children learn English at school but mostly know the basics (colours, simple objects) and have no tool at home for short, regular practice.
- Available apps are often too complex, paid, competition-driven, or not suited to a child who is still learning to read.
- Parents have no simple view of what the child practised and what they struggle with.

## 3. Users

| Persona | Description | Key needs |
|---|---|---|
| **Child A**: 1st grader | reads with difficulty, knows single English words | voice-over, pictures instead of text, large buttons, quick wins |
| **Child B**: 3rd grader | reads independently, knows basic English | fast track through easy content, challenge, not getting bored |
| **Parent** (admin) | creates profiles, sets limits, checks progress | simple view of consistency and difficult words, time control |

## 4. Design principles

1. **Short and regular**: daily goal of about 10 minutes, not long sessions.
2. **No competition**: no leaderboards, no comparing siblings. Cooperation instead (shared goal from v1.1).
3. **No penalties**: no "lost streaks". A weekly goal instead of an unbroken streak.
4. **Listen before you read**: every word and instruction can be played aloud.
5. **Simple and easy on the eye**: large elements, little text, clear colours.
6. **Content separated from code**: a new module or lesson means new data files, not app changes.
7. **Minimum data about children**: nickname, avatar and progress only.
8. **No trademarks**: no characters, logos or names of protected brands.

## 5. Scope and releases

### v1.0 — MVP

| Area | Scope |
|---|---|
| Module | English, levels 1–2 (see section 7) |
| Profiles | Child profile picker (nickname + avatar), no passwords |
| Exercise types | Flashcards with voice-over · Listen and tap · Picture → word · Context questions |
| Review | Leitner system for vocabulary |
| Gamification | Stars ⭐ · Sticker album · Weekly goal |
| Time | Per-profile timer, gentle reminder after 30 min |
| Parent panel | Profiles, summaries, difficult words, settings, PIN |
| Themes | "Electric" and "Neon", switchable |
| Data storage | Local in the browser (through a dedicated data layer) |
| Devices | Computer and tablet, touch and mouse, portrait and landscape |

### v1.1

- **Sync** across devices (Supabase, parent account) + migration of local progress.
- **Family tree**: shared sibling goal.
- New exercise types: **Memory (pairs)**, **Spell the word from letters**.
- English level 3.

### v1.2

- **Build "my place"**: decorating a room or base with stars.
- English levels 4–5.
- Simple pronunciation practice (in-browser speech recognition, no recording).

### Later (outside current scope)

- Modules: German, maths (aligned with the national curriculum).
- AI conversation: requires a backend, an API key and a separate privacy assessment.

### Out of scope

- Leaderboards, comparing children, chat between users.
- Ads, payments, accounts for people outside the family.
- Characters, graphics and names of protected brands.

## 6. Functional requirements (MVP)

### 6.1 Profiles

- **F-01** The start screen shows profile tiles (avatar + nickname). Tapping one starts that child's session.
- **F-02** Each profile has its own progress, stars, album, timer and weekly goal.
- **F-03** Only the parent creates and edits profiles (parent panel).

### 6.2 Learning session

- **F-04** A session is about 8–12 exercises from the current lesson, mixed types, ending with a reward screen.
- **F-05** Exercises mix new words with reviews (Leitner).
- **F-06** A wrong answer never removes stars. The app shows and reads out the correct answer, and the word comes back later.
- **F-07** Every instruction (in Polish) and every word (in English) has a play-audio button. Words are read out automatically when they appear (can be turned off).

### 6.3 Exercise types

| ID | Type | Mechanics |
|---|---|---|
| **F-08** | Flashcards with voice-over | picture → flip → word + pronunciation; child marks "I know it" / "not yet" |
| **F-09** | Listen and tap | voice says a word, child picks 1 of 3–4 pictures |
| **F-10** | Picture → word | picture shown, child picks the correct written word from 3–4 |
| **F-11** | Context questions | e.g. "What color is a banana?" → colour tiles |

### 6.4 Review (Leitner)

- **F-12** Each word has a box 1–5. A correct answer moves it up, a wrong one sends it back to box 1.
- **F-13** Words from lower boxes appear more often.
- **F-14** A word in box 4+ counts as "known".

### 6.5 Levels

- **F-15** Lessons are grouped into levels (section 7). The next level unlocks when the previous one is completed.
- **F-16** "Skip level" test: a short quiz (e.g. 10 questions, min. 80%) lets the child complete a level right away.
- **F-17** The parent can set a profile's starting level.

### 6.6 Gamification

- **F-18** Stars: for each completed exercise, a bonus for completing a session, a bonus for reaching the weekly goal.
- **F-19** Sticker album: after each session the child reveals a sticker related to the lesson topic. A full album page equals a completed level.
- **F-20** Weekly goal: by default 4 learning days out of 7. Days of the week are visualised, there is no "lost streak".
- **F-21** Short animations and praise messages (in Polish, e.g. "Brawo, prawdziwy z Ciebie Kumacz!" — "Well done, you're a real Kumacz!").

### 6.7 Time limit

- **F-22** The app tracks a profile's total learning time per day.
- **F-23** After the limit is exceeded (30 min by default) it shows a gentle message encouraging a break.
- **F-24** After the limit the child can keep playing but earns no new stars or stickers that day.

### 6.8 Parent panel

- **F-25** Access protected by a 4-digit PIN set on first launch.
- **F-26** Profile management: add, edit, delete, set starting level.
- **F-27** Summary for each child: learning days this week, daily time, completed lessons and levels.
- **F-28** "Difficult words" list: the most frequently missed words.
- **F-29** Settings: time limit, auto voice-over on/off, theme, change PIN.
- **F-30** Export progress to a file (backup before migrating to v1.1).

### 6.9 Themes

- **F-31** Two themes switchable in settings (optionally by the child):
  - **Electric**: yellow, red, navy; light background, energetic accents.
  - **Neon**: purple, pink, turquoise; dark background, glow effect.
- **F-32** A theme changes only colours, backgrounds and decorations. It contains no characters, logos or names of protected brands.

## 7. Content — English

**Reference:** Cambridge **Pre A1 Starters** vocabulary.
**Illustrations:** to be decided (open issue 3).

| Level | Topics | Release |
|---|---|---|
| 1 | colours, numbers 1–10, animals, fruit | v1.0 |
| 2 | school objects, toys, body parts, family | v1.0 |
| 3 | food, clothes, home, numbers to 20 | v1.1 |
| 4 | simple sentences: *I like…*, *I have…*, *It is…* | v1.2 |
| 5 | movement verbs, weather, days of the week | v1.2 |

Estimate: 4–6 lessons per level, 8–12 words per lesson.

**Content data structure** (the same for all future modules):

```
module (english) → level (1) → lesson (colours) → items (word, translation, picture, exercise types)
```

## 8. Non-functional requirements

| ID | Requirement |
|---|---|
| **N-01** | Works in current browsers on computer (Chrome, Edge) and Android tablet (Chrome) as the primary platform; iPad (Safari) compatibility kept from the start, no Android-specific solutions |
| **N-02** | Responsive layout: tablet portrait and landscape, computer; touch targets min. 48×48 px |
| **N-03** | Can be added to the tablet home screen (PWA) and works offline after first load |
| **N-04** | Voice-over based on browser speech synthesis (no cost, no server) |
| **N-05** | Static hosting (GitHub Pages) in v1.0, no own server |
| **N-06** | UI in Polish, learning content in the module's language |
| **N-07** | First load < 3 s on a typical home connection |
| **N-08** | Readability: high contrast, large font, no small text |
| **N-09** | Zero keys, passwords or personal data in the repository |

## 9. Data and privacy

- **v1.0:** all data stays in the browser on the device (nickname, avatar, progress, settings). Nothing is sent anywhere.
- **v1.1:** only the parent creates an account. Children's data limited to nickname, avatar and progress. Access protected by database rules (each family sees only its own data).
- No surnames, dates of birth, photos, voice recordings, third-party analytics or ads.

## 10. Architecture — assumptions

- The app runs entirely in the browser (static files on GitHub Pages).
- **Data layer** separated from the rest of the app: in v1.0 it stores locally, in v1.1 the same layer uses Supabase. The rest of the app does not change.
- **Content in data files** (JSON) following the structure in section 7.
- The choice of specific technologies (framework, tooling) is a separate decision after PRD approval.

## 11. MVP success criteria

Test period: **3 weeks** of regular use by both children.

| Metric | Target |
|---|---|
| Consistency | each child reaches the weekly goal (min. 4/7 days) in ≥ 2 of 3 weeks |
| Voluntary use | children at least sometimes ask for the app themselves |
| Progress | each child completes at least 1 level |
| Learning | the number of "difficult words" in the parent panel goes down |
| Usability | the 1st grader uses the app without adult help |

**v1.1 gate:** meeting the criteria starts work on sync. If they are not met, the core gets fixed first.

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Voice-over quality differs between devices | poor pronunciation on some hardware | test voices on the Android tablet and computer at the start; automatically pick the best available English voice; retest if moving to iPad |
| Children get bored quickly | drop in consistency | short sessions, mixed exercise types, themed stickers; observe during tests |
| No sync in the MVP confuses children | "where are my stars?" | clear information for the parent; progress export; v1.1 right after tests |
| Children bypass the limit by switching profiles | time exceeded | parent panel shows actual time; conversation instead of blocking |
| Browser data cleared | progress lost in v1.0 | progress export (F-30); sync in v1.1 |
| Scope creep | MVP delayed | stick to v1.0 scope; new ideas go to the backlog |

## 13. Open issues

1. ~~Which tablet~~: resolved (D-14).
2. Technology choice: decision after PRD approval.
3. Avatars and stickers: emoji or own simple graphics.
4. Can the child change the theme, or only the parent.
5. English variant for learning content: British or American spelling (e.g. "colour" / "color").

## 14. Decision log

| # | Decision |
|---|---|
| D-01 | Start with the PRD, then repo and code |
| D-02 | Public GitHub repo, hosted on GitHub Pages |
| D-03 | Colour-only themes ("Electric", "Neon"), no trademarks |
| D-04 | Devices: computer and tablet |
| D-05 | Option B: local storage in MVP, sync (Supabase) in v1.1 |
| D-06 | Start at Pre A1; 5-level path; "skip level" test |
| D-07 | Daily goal ~10 min; 30 min limit with a gentle reminder, no blocking |
| D-08 | Gamification without competition: stars, sticker album (v1.0), room building (v1.2) |
| D-09 | Shared sibling goal ("family tree") in v1.1 |
| D-10 | MVP exercise types: flashcards, listen and tap, picture → word, context questions |
| D-11 | Parent panel with PIN, scope F-25…F-30 |
| D-12 | MVP success criteria as in section 11 |
| D-13 | Name: **Kumacz** |
| D-14 | Tablet: currently Android (Chrome) as test platform; possible iPad later, so Safari compatibility from the start |
| D-15 | Repository language: English (README, code, file names, commits, PRD); app UI in Polish |
| D-16 | PRD kept public in the `kumacz` repo as `docs/PRD.md` |
| D-17 | Codex and Claude Code both build, in turns, never in parallel; shared rules in `AGENTS.md`, handoff via `docs/STATUS.md`, one task = one branch = one PR |

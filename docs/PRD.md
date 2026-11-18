# PRD — Kumacz

**Educational web app for primary school children**

| | |
|---|---|
| Document version | 0.12 (approved; technology and voice decisions added) |
| Date | 2026-11-12 (D-86–D-88 reconciled) |
| Product owner | Bartek |
| Status | Approved by the product owner on 2026-11-06; "PRD approved" gate passed. Technology decisions D-78–D-82 recorded on 2026-11-06. |
| Repository | `kumacz` (public, GitHub) |
| Hosting | GitHub Pages: `<login>.github.io/kumacz` |

---

## 1. Product goal

Kumacz is an educational web app for primary-school pupils. Its long-term aim is to support learning across all primary-school grades. The initial release starts with children in grades 1–3 and beginner English (D-73). It supports regular daily practice with gentle gamification that **rewards consistency, not competition**.

First module: **English at beginner level**. Future modules may include German, maths, natural science, geography and other primary-school subjects, aligned with the Polish national curriculum. Content is separated from code to support this expansion; these subjects are a long-term direction, outside the current MVP (D-75).

## 2. Problem

- Children learn English at school but mostly know the basics (colours, simple objects) and have no tool at home for short, regular practice.
- Available apps are often too complex, paid, competition-driven, or not suited to a child who is still learning to read.
- Parents have no simple view of what the child practised and what they struggle with.

## 3. Users

The personas below describe the initial MVP users. Older primary-school pupils are part of the long-term audience; their content and needs will be specified in later releases (D-73).

| Persona | Description | Key needs |
|---|---|---|
| **Child A**: 1st grader | reads with difficulty, knows single English words | voice-over, pictures instead of text, large buttons, quick wins |
| **Child B**: 3rd grader | reads independently, knows basic English | fast track through easy content, challenge, not getting bored |
| **Parent** (admin) | creates profiles, sets limits, checks progress | simple view of consistency and difficult words, time control |

## 4. Design principles

1. **Regular daily practice**: completing a session earns learning-day credit. Ten minutes of counted learning time is a suggested daily target, and children may continue learning for longer (D-90).
2. **No competition**: no leaderboards, no comparing siblings. Cooperation instead (shared goal from v1.1).
3. **No penalties**: no "lost streaks". A weekly goal instead of an unbroken streak.
4. **Listen before you read**: every word and instruction can be played aloud.
5. **Simple and easy on the eye**: large elements, little text, clear colours.
6. **Content separated from code**: a new module or lesson means new data files, not app changes.
7. **Minimum data about children**: nickname, avatar and progress only.
8. **No trademarks**: no characters, logos or names of protected brands.
9. **Minimum cost**: build with as little spending as possible, including licences. Prefer free and open-licence tools, assets and services; anything paid needs the product owner's explicit approval (D-49).

## 5. Scope and releases

### v1.0 — MVP

| Area | Scope |
|---|---|
| Module | English, levels 1–2, with a focus on understanding spoken vocabulary (D-93, section 7) |
| Profiles | Child profile picker (nickname + avatar), no passwords |
| Exercise types | Flashcards with voice-over · Listen and tap · Picture → word (F-08–F-10, D-98) |
| Review | Leitner system for vocabulary |
| Gamification | Stars ⭐ · Sticker album · Weekly goal |
| Time | Suggested daily target of 10 minutes · per-profile timer · gentle reminder after 30 min |
| Parent panel | Profiles with parent-set starting level (F-17), summaries, difficult words, settings, PIN |
| Themes | "Electric" and "Neon", switchable |
| Data storage | Local in the browser (through a dedicated data layer) |
| Devices | Computer and tablet, touch and mouse, portrait and landscape |

### v1.1

- **Sync** across devices (Supabase, parent account) + migration of local progress.
- **Family tree**: shared sibling goal.
- New exercise types: **Memory (pairs)**, **Spell the word from letters**.
- English level 3.
- Candidate: context questions (F-11), e.g. "What colour is a banana?" with colour choices. Before scheduling, define the prompt language, audio and content by category (D-98).
- Candidate: own SVG stickers and avatars on top of the open emoji set (D-18), if the MVP test confirms the need.

### v1.2

- **Build "my place"**: decorating a room or base with stars.
- English levels 4–5.
- Simple pronunciation practice (in-browser speech recognition, no recording).

### Later (outside current scope)

- Broader coverage across all primary-school grades, beyond the initial grades 1–3 audience (D-73).
- Modules: German, maths, natural science, geography and other primary-school subjects (aligned with the national curriculum); no release dates assigned (D-75).
- Reconsider the child-facing skip-level test (F-16) when more English levels are available. The earlier test design is recorded in D-31 and D-53 (D-98).
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

- **F-04** A session normally has about 8–12 exercises of mixed types and ends with a reward screen. When fewer exercises are available in the planned material, use a shorter session (D-91). At most 3 new words are introduced per session; the remaining exercises practise previously introduced words and due reviews (D-34). Before its first checked exercise, each new word is introduced with a picture, written English word and pronunciation. Due reviews start with a question rather than repeating the introduction (D-35).
- **F-05** About half of the exercises in a mixed session are due vocabulary reviews; the rest cover the current lesson. If there are not enough due reviews, use available current-lesson exercises. When the planned material runs out, end the session without adding extra practice just to reach the usual length. When today's plan is empty or exhausted, show „Na dziś wszystko!” and offer optional practice if there are previously introduced words. Prioritise weaker words, using the Leitner boxes and the difficult-word list (F-12, F-28). The child can start a separate review-only session when reviews are due. When none are due, explain that and offer the same optional practice (D-30, D-91). The empty screen does not earn session completion or learning-day credit.
- **F-06** A wrong answer never removes stars. The app shows and reads out the correct answer. Retry the word after 2 other exercises if the retry fits within the session's planned length (F-04). Otherwise carry the word over for retry in the next session. Retries must not extend the current session beyond its planned exercise count (D-36, D-69).
- **F-07** Every instruction (in Polish) and every word (in English) has a play-audio button. Words are read out automatically when they appear (can be turned off), subject to the exercise-specific rule for F-10: before the answer, only the Polish instruction can be played; English word audio, both automatic and on demand, is available only after the child answers (D-43).

- **F-36** Save each completed exercise's result and the session position immediately. After closing or reloading the app, or switching profiles, the child can resume their own unfinished session from the last successfully saved exercise, retaining all saved results. Handle save failures as specified in F-43 (D-65). Resuming must not award the same exercise or session reward twice. Every entry into a session starts with a tap (the profile tile, or a large "Graj dalej" button when resuming) to initiate audio through user interaction (D-60). Playback may still be blocked or fail; handle unavailable required audio according to F-41 rather than assuming the tap guarantees playback. The session-completion bonus and session sticker require completing the session (D-38). Award learning-day credit for a completed session under F-20 (D-90), including after the daily reward limit. Bonuses and stickers follow F-24.

- **F-41** If a bundled audio file cannot play and no eligible local speech-synthesis voice can play it, offer a retry. A listening-dependent exercise remains ungraded while its required audio is unavailable: playback failure is not a wrong answer and must not lower the Leitner box or add an error to the difficult-word history (D-62).

- **F-42** The interface may start before full offline preparation is complete. Show offline readiness only when the complete MVP package is available locally: app resources, both levels' content, pictures and bundled audio (N-03). If preparation is interrupted or incomplete, do not show it as ready; allow downloading to be retried. No per-lesson download management is required from the child (D-63).

- **F-43** If saving learning progress fails, pause session progression and preserve the last successfully committed state. Explain the problem and offer to retry saving; while the app stays open, retain the pending result for that retry. Do not present unsaved progress as saved or continue to further exercises until saving succeeds. Retrying must not duplicate exercise results or rewards (F-36, D-65).

### 6.3 Exercise types

| ID | Type | Mechanics |
|---|---|---|
| **F-08** | Flashcards with voice-over | picture → flip → word + pronunciation; child marks "I know it" / "not yet" (Polish buttons: **„Znam” / „Jeszcze nie”**, D-87); The child can flip directly from the picture (D-93). In the full MVP session, „Jeszcze nie” can bring back that word as a flashcard once later in the same session if the plan has room. „Znam” continues without scheduling a replay. Both choices are ungraded and leave the Leitner box and review date unchanged (D-33, D-94). |
| **F-09** | Listen and tap | voice says a word, child picks 1 of 3–4 pictures |
| **F-10** | Picture → word | picture shown, child picks the correct written word from 3–4; before answering, only the Polish instruction can be played; English pronunciation is available after answering (D-43) |

- **F-40** Wrong options in checked exercises (F-09, F-10) come from the same lesson or category (e.g. other colours). One question never shows two easily confused pictures (e.g. pen and pencil) (D-59).
- **F-39** The Polish translation of a word is shown, with a play-audio button, on the back of the flashcard (F-08) and after the child answers a checked exercise, never before the answer. The parent panel shows translations next to words, e.g. in the difficult-word list (F-28) (D-58).
- **F-35** Introduce exercise types progressively, separately for each word. Choosing its written form (F-10) becomes available only after the child has answered that word correctly at least once in a listen-and-tap exercise (F-09). Until then, use listening and picture-based tasks for the word; flashcard self-assessment does not satisfy this condition. The trigger is word-specific rather than based on the lesson's session number (D-37, D-70).

### 6.4 Review (Leitner)

- **F-12** Each word has a box 1–5. A new word enters box 1 when it is introduced (F-04); its first review is due on the next local calendar date (D-52, D-67). A correct answer in a due review using a checked exercise (F-09, F-10) moves it up by one box, up to box 5 (D-45), with at most one upward move per word per profile per day, across all sessions (D-32). Further correct answers that day are practice and do not move it up again. A wrong answer in a due review moves it down two boxes, not below box 1, and its next review follows the new box (F-13). A wrong answer outside a due review does not change the box; it still counts for the difficult-word list (F-28) and the word follows the retry policy in F-06, including carryover when needed (D-51, D-69). Flashcard self-assessment (F-08) does not change the box (D-33).
- **F-13** The word's resulting box sets when its next review is due (D-29):

  | Box | Next review |
  |---|---|
  | 1 | in 1 day |
  | 2 | in 2 days |
  | 3 | in 4 days |
  | 4 | in 7 days |
  | 5 | in 14 days |

  Intervals use calendar days in the device's local time zone, rather than elapsed 24-hour periods. A review is due from the start of its target calendar date. For example, a word introduced on Monday at 19:00 has its first review due from the start of Tuesday; the child need not wait until Tuesday at 19:00 (D-67).

  Overdue reviews are spread across ordinary short sessions; a backlog does not make a session longer. Correct answers during extra practice before the review is due do not promote the word or change its scheduled review date (D-45).
- **F-14** A word in box 4 or 5 counts as "mastered", unless it is still "unconfirmed" (F-38). Lesson completion (F-34) and vocabulary mastery are tracked separately.

### 6.5 Levels

- **F-15** Lessons are grouped into levels (section 7). The next level unlocks when the previous one is completed. A level is completed when all its lessons are completed under F-34 (D-23, D-98).
- **F-34** A lesson is completed when every word in it has been answered correctly at least once. Only checked exercises count (F-09, F-10); flashcard self-assessment "I know it" (F-08) does not. Its words keep coming back in Leitner reviews afterwards (D-21, D-22).
- **F-17** The parent can set a profile's starting level. Words of the levels below it enter reviews as described in F-38.
- **F-38** Previously unintroduced words from levels below the profile's starting level (F-17) are assigned at random, as evenly as possible, to boxes 3, 4 and 5, with the next review due after that box's interval (F-13), so reviews are spread over time. These words are marked "unconfirmed": they do not count as mastered (F-14) until their first correct due review. Words already introduced keep their current box (D-53, D-98).

### 6.6 Gamification

- **F-18** Stars: for each completed exercise, a bonus for completing a session, a bonus for reaching the weekly goal.
- **F-19** Sticker album: one page per level. After each session the child reveals a sticker related to the lesson topic and it goes on the level's page. Completing the level adds a special large level sticker marking completion. The page continues to accept stickers from review sessions for that level; the page layout must fit a varying number of stickers (D-24, D-41). Stickers follow the daily reward limit (F-24).
- **F-20** Weekly goal: by default 4 learning days out of 7. A profile earns credit for a day by completing at least one learning or review-only session that day, regardless of its duration. Count each day once per profile. Show the days of the week and keep the goal free of streaks (D-25, D-90).
- **F-21** Short, calm reward animations are enabled by default, with praise messages in Polish (e.g. "Brawo, prawdziwy z Ciebie Kumacz!" — "Well done, you're a real Kumacz!"). When the device requests reduced motion, show the reward without animation (D-42).

### 6.7 Time limit

- **F-22** The app tracks learning time per day, separately for each profile. Only time in exercises with the app visible counts; menus and background time do not. Tracking pauses after 60 seconds without interaction; playing instruction or pronunciation audio is not inactivity (D-26).
- **F-44** Use the same suggested daily target of 10 minutes of counted learning time for every profile in the MVP (F-22, D-90, D-92). Track time separately per profile. Time can accumulate across sessions. Children may continue learning after reaching the target. Learning-day credit follows F-20. The reminder and reward-limit rules follow F-23 and F-24.
- **F-23** After the limit is exceeded (30 min by default) it shows a gentle message encouraging a break.
- **F-24** After the limit the child can keep playing but earns no new stars or stickers that day.

### 6.8 Parent panel

- **F-25** Access protected by a 4-digit PIN set on first launch. A forgotten-PIN reset lets the parent set a new PIN without deleting profiles or progress, after solving an adult check: a random two-digit by two-digit multiplication (e.g. 47 × 36) (D-54). The PIN prevents accidental access; it is not strong access control and does not verify parent identity (D-28).
- **F-26** Profile management: add, edit, delete, set starting level.
- **F-27** Show a separate summary for each child with learning days this week, daily time, completed lessons and levels, and two vocabulary counts. **„Opanowane w powtórkach”** counts words that meet F-14. **„W trakcie nauki”** counts introduced words that do not currently meet F-14. Explain both labels briefly and avoid comparing children (D-96).
- **F-28** "Difficult words" list: for each word and profile, use the most recent up to 5 checked answers in the retained answer history (N-12). A word is difficult when this window contains at least 2 wrong answers; with fewer than 5 answers, apply the same threshold to the available answers. Re-evaluate the list as the window changes: a word leaves when fewer than 2 wrong answers remain. Use recent performance rather than lifetime error totals; ungraded audio failures (F-41) are not answers and do not enter this window (D-39, D-68). Show a short suggestion next to the difficult-word list: „Odtwórz słowo i poproś dziecko, żeby wskazało obrazek” (D-96).
- **F-29** Settings: time limit for the break reminder and reward rules (F-23, F-24), auto voice-over on/off, theme, change PIN. The suggested daily target is shared across profiles (F-44, D-92).
- **F-30** Backup: export all profiles, progress and app settings to a file, and import a backup to restore them. Import replaces all existing data (no merging). The backup is validated first; an invalid backup never replaces current data. Replacement is all-or-nothing: if the import fails, existing data remains unchanged; report the failure and allow retry (N-13, D-64). Before import the app explains that current data will be overwritten and asks for explicit confirmation (D-27). Merging imports from several sources is a later-version candidate.
- **F-37** Data durability: request persistent browser storage when supported and check whether it was granted. If protection is refused or unavailable but ordinary progress saving works, learning remains available; explain the limited protection in the parent panel and keep backup reminders. On first launch, show the parent how to add the app to the home screen; installation can help storage protection depending on browser policy, but does not guarantee permanent retention. Do not claim that requesting persistence or installing the app guarantees data safety. The parent panel reminds the parent to export a backup when the last one is older than 7 days (D-50, D-66). Actual progress-save failure pauses the session as specified in F-43 (D-65).

### 6.9 Themes

- **F-31** The theme is stored per profile. The child switches it on their own profile screen without a PIN (not during exercises); the parent can change it for any profile in the parent panel:
  - **Electric**: yellow, red, navy; light background, energetic accents.
  - **Neon**: purple, pink, turquoise; dark background, glow effect.
- **F-32** A theme changes only colours, backgrounds and decorations. It contains no characters, logos or names of protected brands.

### 6.10 About

- **F-33** An "About" screen credits third-party assets as their licences require (e.g. the open emoji set, D-18).
- **F-45** Exercise screens show a small, permanent "Nagranie syntetyczne" label near the audio controls, and the About screen states that all recordings are synthetic and names the voices (D-84).

## 7. Content — English

This section defines the initial beginner-English path. It is not the full English curriculum for all primary-school grades; broader coverage will be planned in later releases (D-73).

**Reference:** Cambridge **Pre A1 Starters** vocabulary.
**Language variant:** British English for learning vocabulary, spelling and example sentences (e.g. "colour"), matching the children's school textbooks. English words use bundled `en-GB` audio files (N-04, D-47), generated once with a local open-source speech generator (e.g. Piper), with an `en-GB` voice for English and a Polish voice for instructions (D-48): Cori medium for English and Supertonic 3 preset 0 for Polish, generated with sherpa-onnx (D-83, `docs/ASSET_LICENCES.md`); when speech synthesis is used as a fallback, request an `en-GB` voice from the available local voices only (D-62). Fallback behaviour must be verified in the planned audio prototype.
**Illustrations:** the Twemoji open-licence emoji set (jdecked/twemoji, graphics under CC BY 4.0) as SVG files (D-82) bundled with the app, for exercise pictures, avatars and stickers. This gives consistent rendering across devices and offline use without drawing assets before the MVP; do not rely on platform emoji. Licence attribution in the app (F-33). Own SVG stickers and avatars are a v1.1 candidate.
**Picture rule:** a word enters the content only if it has an unambiguous picture in the chosen emoji set; otherwise it is replaced by another word from the Pre A1 Starters list (D-57).

| Level | Topics | Release |
|---|---|---|
| 1 | colours, numbers 1–10, animals, fruit | v1.0 |
| 2 | school objects, toys, body parts, family | v1.0 |
| 3 | food, clothes, home, numbers to 20 | v1.1 |
| 4 | simple sentences: *I like…*, *I have…*, *It is…* | v1.2 |
| 5 | movement verbs, weather, days of the week | v1.2 |

General estimate for other levels: 4–6 lessons per level, 8–12 words per lesson. **MVP level 1: 4 lessons totalling 32 words, with varying lesson sizes** (D-46, D-61):

| Lesson | Number of words |
|---|---|
| Colours | 8 |
| Numbers 1–10 | 10 |
| Animals | 7 |
| Fruit | 7 |
| **Total** | **32** |

At most 3 new words are introduced per session (D-34). Introducing 32 words takes at least 11 sessions by word count. Actual session count also depends on lesson boundaries, reviews and correct answers (F-34). The three-week family test uses the complete Level 1 content, and completing Level 1 remains a test target (section 11, D-97).

**Content validation:** after PRD approval and once implementation begins, prepare one pilot lesson and try it with the children before preparing the full content for levels 1–2. Check whether they understand the pictures and instructions, whether the difficulty is appropriate, and whether they can complete the tasks independently. Use the findings to refine the lesson pattern before expanding the content (D-44). Follow the P10 protocol in D-89.

**Content data structure** (the same for all future modules):

```
module (english) → level (1) → lesson (colours) → items (word, translation, picture, exercise types)
```

## 8. Non-functional requirements

| ID | Requirement |
|---|---|
| **N-01** | Works in current browsers on computer (Chrome, Edge) and Android tablet (Chrome) as the primary platform; iPad (Safari) compatibility kept from the start, no Android-specific solutions |
| **N-02** | Responsive layout: tablet portrait and landscape, computer; touch targets min. 48×48 px |
| **N-03** | Can be added to the tablet home screen (PWA). Offline readiness is confirmed only after the app, content for both MVP levels, pictures and all bundled audio have been downloaded and verified as available locally. Opening the interface alone does not establish offline readiness (F-42, D-63) |
| **N-04** | Voice-over from pre-prepared audio files bundled with the app and cached for offline use: English words (`en-GB`), Polish instructions and Polish word translations (F-39). Browser speech synthesis is only a fallback when a file is missing or fails to play, and may use local voices only; remote speech services are not allowed. If neither source can play, follow F-41 (D-47, D-62) |
| **N-05** | Static hosting (GitHub Pages) in v1.0, no own server |
| **N-06** | UI in Polish, learning content in the module's language. Polish texts follow D-88: correct grammar, spelling, punctuation and natural style, simple enough for grades 1–3 |
| **N-07** | First usable interface < 3 s on a typical home connection. Full offline preparation may finish later and is tracked separately (N-03, D-63) |
| **N-08** | Readability: high contrast, large font, no small text |
| **N-09** | Zero keys, passwords or personal data in the repository |
| **N-10** | Stable IDs for modules, levels, lessons and words; editing content must not lose progress (D-55) |
| **N-11** | Stored data and backups carry a data format version; app updates migrate older data. Migrations are all-or-nothing and preserve existing data if they fail (N-13, D-55, D-64) |
| **N-12** | Answer history stores the word, result, date and enough attempt context to distinguish independent due-review answers from practice and corrective retries. Keep the last 90 days and automatically delete older entries; history feeds F-28 and the supplementary retention measure (section 11) (D-55, D-71, D-95) |
| **N-13** | Backup imports and data migrations commit the entire change or none of it. Failure or interruption before completion must leave the previously committed data intact, with no partial replacement or automatic reset. Report failures and allow a safe retry without requiring the parent to restore an exported backup (D-64) |

## 9. Data and privacy

- **v1.0:** all data stays in the browser on the device (nickname, avatar, progress, settings). Nothing is sent anywhere.
- **v1.1:** only the parent creates an account. Children's data limited to nickname, avatar and progress. Access protected by database rules (each family sees only its own data).
- No surnames, dates of birth, photos, voice recordings, third-party analytics or ads.
- Answer history is limited to the last 90 days (N-12).
- Speech-synthesis fallback uses local voices only and never sends text to a remote speech service (D-62).

## 10. Architecture — assumptions

- The app runs entirely in the browser (static files on GitHub Pages).
- **Data layer** separated from the rest of the app: in v1.0 it stores locally, in v1.1 the same layer uses Supabase. The rest of the app does not change.
- **Content in data files** (JSON) following the structure in section 7.
- Technology (D-78): React + TypeScript built with Vite; ordinary CSS with custom properties; Vitest and Playwright for tests; static build on GitHub Pages.
- Local data (D-79): IndexedDB through the small `idb` library; each profile's state is one versioned document and answer history is stored separately. Imports and migrations prepare the complete new state and write it in one transaction (N-11, N-13).
- Audio (D-80): MP3 files, loaded whole from the offline cache and played through the Web Audio API.
- Implementation is split into small stages, each fitting one agent session's token limit; the stage plan is prepared after the technology choice (D-56).

## 11. MVP success criteria

Start with **three weeks** of regular use by both children in the early family test (P29A, D-97). Run it after P10, once progress saving, reviews, full learning sessions, rewards, a simple sticker album and all Level 1 lessons are ready. Use the GitHub Pages test build on the shared device and keep both profiles in the same browser. The test requires internet access and takes place before parent access, backups and offline packaging. Progress is local to the test browser.

Use the criteria below to assess return use, progress and listening comprehension. Apply the parent-led listening check from D-95, and use review history as supplementary evidence when available. Review the findings before continuing with the remaining MVP stages. P38 verifies the complete MVP before release, and P40 retains the full MVP evaluation for the v1.1 decision. See the [implementation plan](IMPLEMENTATION.md).

| Metric | Target |
|---|---|
| Consistency | each child reaches the weekly goal (min. 4/7 days) in ≥ 2 of 3 weeks |
| Voluntary use | children at least sometimes ask for the app themselves |
| Progress | each child completes at least 1 level |
| Learning | For each child, compare listening comprehension before and after the three-week test on the same set of at least 10 Level 1 words. Require at least +20 percentage points from a baseline below 80%. For a baseline of at least 80%, maintaining that baseline meets the criterion and is recorded as maintenance. Fewer than 10 paired results means insufficient measurement (D-95). |
| Usability | the 1st grader uses the app without adult help |

**Learning measurement:** Before the three-week test, select at least 10 Level 1 words for each child. The parent runs a short listening check before the test and repeats it after three weeks using the same selected words. For each item, the child hears the English word and points to an image. Keep the picture choices and instructions comparable, vary the order of words and picture positions, and record the first unaided answer. Keep the answers undisclosed during both checks. Keep raw results local and use only combined, non-identifying findings in the repository (D-95, N-09).

**Learning target:** Calculate each child's scores from the same set of words with a valid answer at both checks. If fewer than 10 words have paired results, report insufficient measurement. Evaluate percentage thresholds before rounding. With an initial score below 80%, require a gain of at least 20 percentage points. At 80% or higher, require the final score to match or exceed the baseline and record the result as maintenance of a high starting score. Interpret results in the context of the small family test (D-95).

**Supplementary retention measure:** From the app's normal due-review history, compare the first and last independent answers for the same words, separately per child. Include words with at least two eligible answers and report the number of words used. Eligible answers are the initial independent attempt in a due review, before feedback or the solution is shown. Corrective retries, flashcard self-assessment and ungraded audio failures are excluded. Use this comparison to assess what the child retains between reviews (D-71, D-95).

**v1.1 gate:** use the full MVP evaluation (P40) to decide when to start work on sync. If the criteria are unmet, fix the core first. Findings from P29A guide improvements to the MVP.

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Voice-over quality differs between devices | poor pronunciation on some hardware | bundled audio files (D-47); local-only speech synthesis as fallback (D-62); retry without grading when required audio is unavailable (F-41); test on the Android tablet and computer, and retest if moving to iPad |
| Children get bored quickly | drop in consistency | short sessions, mixed exercise types, themed stickers; observe whether exercises feel repetitive in the P29A family test (D-98) |
| No sync in the MVP confuses children | "where are my stars?" | clear information for the parent; progress export; v1.1 right after tests |
| Children bypass the limit by switching profiles | time exceeded | parent panel shows actual time; conversation instead of blocking |
| Browser data cleared | progress lost in v1.0 | persistent storage, home-screen install and backup reminder (F-37); backup export (F-30); sync in v1.1 |
| Scope creep | MVP delayed | stick to v1.0 scope; new ideas go to the backlog |

## 13. Open issues

1. ~~Which tablet~~: resolved (D-14).
2. ~~Technology choice~~: resolved (D-78–D-82).
3. ~~Avatars, stickers and exercise illustrations~~: bundled open-licence emoji set (D-18).
4. ~~Who can change the theme~~: child on own profile screen and parent; stored per profile (D-19).
5. ~~English variant for learning content~~: British English (D-20).

6. ~~Relationship between the daily goal and weekly learning-day credit~~: one completed learning or review-only session earns learning-day credit. Ten minutes remains a suggested daily target (F-20, F-44, D-90).

## 14. Decision log

| # | Decision |
|---|---|
| D-01 | Start with the PRD, then repo and code |
| D-02 | Public GitHub repo, hosted on GitHub Pages |
| D-03 | Colour-only themes ("Electric", "Neon"), no trademarks |
| D-04 | Devices: computer and tablet |
| D-05 | Option B: local storage in MVP, sync (Supabase) in v1.1 |
| D-06 | Start at Pre A1; 5-level path; "skip level" test. The test is deferred by D-98. |
| D-07 | Daily goal at least 10 min, with longer learning allowed (clarified by D-74); 30 min limit with a gentle reminder, no blocking |
| D-08 | Gamification without competition: stars, sticker album (v1.0), room building (v1.2) |
| D-09 | Shared sibling goal ("family tree") in v1.1 |
| D-10 | MVP exercise types: flashcards, listen and tap, picture → word, context questions. D-98 defers context questions. |
| D-11 | Parent panel with PIN, scope F-25…F-30 |
| D-12 | MVP success criteria as in section 11 |
| D-13 | Name: **Kumacz** |
| D-14 | Tablet: currently Android (Chrome) as test platform; possible iPad later, so Safari compatibility from the start |
| D-15 | Repository language: English (README, code, file names, commits, PRD); app UI in Polish |
| D-16 | PRD kept public in the `kumacz` repo as `docs/PRD.md` |
| D-17 | Codex and Claude Code both build, in turns, never in parallel; shared rules in `AGENTS.md`, handoff via `docs/STATUS.md`, one task = one branch = one PR |
| D-18 | MVP graphics: open-licence emoji set (SVG) bundled with the app, with attribution; own SVG stickers and avatars considered for v1.1 (revised after review) |
| D-19 | Theme stored per profile; the child switches it on their profile screen without a PIN (not during exercises), the parent in the parent panel (revised after review) |
| D-20 | British English for learning content, matching school textbooks; prefer an en-GB speech synthesis voice (confirmed after review) |
| D-21 | Lesson completion: every word in the lesson answered correctly at least once; mastery continues through Leitner reviews (F-34) |
| D-22 | Only checked exercises (listen and tap, picture → word, context questions) count towards lesson completion; flashcard "I know it" does not (F-34). The MVP uses F-09 and F-10 under D-98. |
| D-23 | Level completion: all lessons of the level completed (or skip-level test passed, F-16); no extra end-of-level test (F-15). The test is deferred by D-98. |
| D-24 | Sticker album: a sticker after every session; level completion adds a special large level sticker marking completion; the page continues to accept review stickers (F-19, clarified by D-41) |
| D-25 | A learning day requires at least 10 minutes of counted learning and at least one completed learning or review-only session on the same day, as revised by D-76; weekly goal stays 4 of 7 days (F-20). |
| D-26 | Count visible exercise time only, excluding menus and background; pause after 60 s of inactivity, audio playback is not inactivity; 30-minute default limit and post-limit reward rules unchanged (F-22–F-24) |
| D-27 | MVP backup: full export and replacing import of all profiles, progress and settings; validate before replacing; require overwrite confirmation; merging imports considered later (F-30) |
| D-28 | Forgotten-PIN reset without deleting profiles or progress; the local PIN guards against accidental access, not strong authentication (F-25) |
| D-29 | Leitner review intervals 1, 2, 4, 7, 14 days for boxes 1–5; overdue reviews spread across normal-length sessions (F-13) |
| D-30 | Mixed sessions: about half due reviews, the rest current lesson, unused review places filled with lesson exercises; separate review-only sessions (F-05). Short and empty plans follow D-91. |
| D-31 | Skip-level test: 10 questions, min. 8 correct; passing completes the level and unlocks the next one, without marking its words as mastered (F-16); their Leitner placement is defined by D-53. The test is deferred by D-98. |
| D-32 | Leitner: at most one upward move per word per profile per day, across all sessions; further same-day correct answers are practice without another upward move (F-12). This prevents repeated practice in one day from being treated as long-term retention. |
| D-33 | Only checked exercises (F-09, F-10, F-11) can promote a word in Leitner, subject to D-32. Flashcard self-assessment (F-08), whether "I know it" or "not yet", does not change the box. The MVP uses F-09 and F-10 under D-98. |
| D-34 | Introduce at most 3 new words per learning session, leaving room for practice and reviews within the existing 8–12-exercise session (F-04, F-05). |
| D-35 | Introduce each new word with a picture, written English word and pronunciation before asking the child to answer a checked exercise. Due reviews start with a question; they do not repeat the introductory presentation (F-04). |
| D-36 | After a wrong answer, show and read out the correct answer, then retry after other exercises rather than immediately; spacing and end-of-session handling are defined by D-69 (F-06). |
| D-37 | Introduce written-word exercises gradually after listening and picture-based tasks, rather than mixing all exercise types from the start; the per-word trigger is defined by D-70 (F-35). |
| D-38 | Save progress after every completed exercise and allow an interrupted session to be resumed without losing saved results or duplicating rewards. Session rewards require session completion; learning-day credit follows F-20 and D-76. The daily reward limit still applies to stars and stickers (F-36). |
| D-39 | Base the difficult-word list on recent checked answers, not lifetime error totals; words leave the list as recent performance improves (F-28). |
| D-40 | Evaluate MVP learning improvement by comparing answers to the same words in reviews after a time gap. The total number of difficult words is not the learning success metric, because newly introduced vocabulary can increase it (section 11). The review comparison is supplementary under D-95. |
| D-41 | Stickers earned from reviews of a completed level continue to go on that level's page. Its special large sticker marks completion rather than closing the page to further stickers; keep one page per level (F-19, clarification of D-24). |
| D-42 | Enable short, calm reward animations by default. Respect the device's reduced-motion preference by showing the reward without animation (F-21). |
| D-43 | In picture-to-word exercises (F-10), allow playback of the Polish instruction before the answer, but English pronunciation only after the child answers. Apply this to automatic and on-demand playback so audio does not give away the answer (F-07). |
| D-44 | Validate one pilot lesson with the children during implementation before preparing the full MVP content. Check picture and instruction clarity, difficulty and independent use; refine the lesson pattern before expanding to levels 1–2 (section 7). Use the approved P10 observation protocol (D-89). |
| D-45 | Only a correct checked answer in a due review can promote a word in Leitner, subject to the once-per-day cap (D-32). Correct answers during earlier extra practice do not promote it or change its scheduled review date; wrong checked answers still reset it to box 1 (F-12, F-13); error handling revised by D-51. |
| D-46 | MVP level 1 has 4 lessons totalling 32 words, to make completion within the 3-week test realistic (section 7, section 11). Lesson sizes clarified by D-61; level 2 size unchanged. |
| D-47 | Audio from pre-prepared files bundled with the app for English words (en-GB) and Polish instructions; browser speech synthesis only as a fallback, restricted to local voices by D-62 (N-04). Source and licence of the recordings decided separately. |
| D-48 | Audio files are generated once with a local open-source speech generator (e.g. Piper): one consistent en-GB voice for English words and one Polish voice for instructions. Before use, verify that the chosen voices' licences allow redistributing the generated files in the public repo; credit them in the About screen if required (F-33). |
| D-49 | Build the app at minimum cost, including licences: prefer free and open-licence tools, assets and services; anything paid needs the product owner's explicit approval (section 4). |
| D-50 | Protect local data: request persistent browser storage, show the parent how to install the app on the home screen on first launch, and remind the parent in the parent panel to export a backup when the last one is older than 7 days (F-37). |
| D-51 | A wrong checked answer in a due review moves the word down two boxes (minimum box 1); a wrong answer outside a due review leaves the box unchanged but counts for difficult words (F-28) and triggers the retry policy in F-06, with spacing and carryover clarified by D-69. Replaces the box-1 reset in F-12 and D-45, so an accidental tap does not undo weeks of progress. |
| D-52 | A new word enters Leitner box 1 when it is introduced in a session, with its first review due the next day, regardless of answers in that session (F-12). |
| D-53 | Words of a skipped level (F-16) or a level below the starting level (F-17) that were not introduced yet go at random, about one third each, into boxes 3, 4 and 5, with reviews due after the box interval. They stay "unconfirmed" and do not count as mastered until their first correct due review (F-14, F-38). The MVP applies this to F-17 under D-98. |
| D-54 | Forgotten-PIN reset requires an adult check: a random two-digit by two-digit multiplication. Sufficient for protection against accidental access (D-28); no recovery code (F-25). |
| D-55 | Technical data rules: stable content IDs (N-10), a data format version with migration (N-11), and answer history kept for 90 days, older entries deleted automatically (N-12). |
| D-56 | Implementation will be split into small stages, each fitting one agent session's token limit; the stage plan is prepared after the technology choice (section 10). |
| D-57 | A word enters the learning content only if it has an unambiguous picture in the chosen emoji set; otherwise replace it with another Pre A1 Starters word (section 7). |
| D-58 | The Polish translation is shown with audio on the flashcard back and after answering a checked exercise, never before the answer; the parent panel shows translations too (F-39). |
| D-59 | Wrong options in checked exercises come from the same lesson or category, never two easily confused pictures in one question; adaptive difficulty considered after the MVP test (F-40). |
| D-60 | Every entry into a session starts with a tap (profile tile, or a "Graj dalej" button when resuming) to initiate audio through user interaction. This does not guarantee successful playback; required-audio failures follow F-41 and D-62 (F-36, F-07). |
| D-61 | MVP level 1 keeps 32 words across 4 lessons: 8 colours, 10 numbers (1–10), 7 animals and 7 fruit. Lesson lengths vary so the full number range fits without increasing the level's vocabulary total (section 7; clarification of D-46). |
| D-62 | Speech-synthesis fallback may use local voices only, never remote speech services. If both the bundled file and local fallback are unavailable, offer playback retry and leave listening-dependent exercises ungraded; audio failure must not count as a learning error (N-04, F-41, section 9). |
| D-63 | Confirm offline readiness only after downloading and verifying local availability of the entire MVP package: app resources, both levels' content, pictures and bundled audio. The interface may start earlier; interrupted or incomplete preparation is not shown as ready and can be retried. Downloading is for the full MVP rather than managed per lesson (N-03, N-07, F-42). |
| D-64 | Backup import and data migration are all-or-nothing. If either operation fails, preserve the existing data in full, report the error and allow retry; the parent is not required to restore a backup manually (F-30, N-11, N-13). |
| D-65 | A progress-save failure pauses the learning session, preserves the last successful save, explains the problem and allows retry. Continue only after saving succeeds; do not introduce a practice-without-saving mode or duplicate results or rewards on retry (F-36, F-43). |
| D-66 | Refusal or unavailability of persistent-storage protection does not block learning when ordinary progress saving works. Inform the parent about limited protection and retain backup reminders. Requesting persistence or home-screen installation is not a guarantee against data loss; actual save failures still pause the session under D-65 (F-37). |
| D-67 | Review intervals use local calendar days according to the device's time zone, not full elapsed 24-hour periods. A due review is available from the start of its target calendar date; a new word's first review is available throughout the next day (F-12, F-13). |
| D-68 | A word is difficult when at least 2 of its latest up to 5 checked answers are wrong, separately per profile and within the retained answer history. The same threshold applies before 5 answers exist. Remove the word when its current window contains fewer than 2 errors; ungraded audio failures do not count (F-28, N-12; clarification of D-39). |
| D-69 | After a wrong answer, retry the word after 2 other exercises if it fits within the planned session. Otherwise carry it over to the next session. Do not extend the session to accommodate retries (F-06; clarification of D-36 and D-51). |
| D-70 | Introduce picture-to-word exercises (F-10) separately for each word, only after at least one correct listen-and-tap answer for that word (F-09). Flashcard self-assessment does not qualify; do not unlock written-word tasks simply because a lesson has reached its second session (F-35; clarification of D-37). |
| D-71 | Measure learning through ordinary due-review history during the 3-week test, separately per child. Compare the first and last independent due-review answer for the same words, using words with at least two eligible answers. Exclude corrective retries, flashcard self-assessment and ungraded audio failures; do not add a separate examination. Sample size and success threshold are defined by D-72 (section 11, N-12; clarification of D-40). D-95 supersedes the review-only measurement and keeps eligible review history as a supplementary retention measure. |
| D-72 | For each child, measure first-versus-last independent due-review accuracy on the same set of at least 10 eligible words. Require at least +20 percentage points if initial accuracy is below 80%; at 80% or above, require maintaining at least the initial accuracy. Fewer than 10 eligible words means insufficient measurement, without concluding learning success or failure (section 11; completion of D-71). D-95 applies these thresholds to the parent-led before-and-after check. |
| D-73 | The long-term audience covers all primary-school grades. Grades 1–3 and beginner English are the initial release focus, rather than a permanent limit on the product's audience (sections 1, 3, 5 and 7). |
| D-74 | The daily learning goal is at least 10 minutes of counted learning time; the child may learn for longer. Reaching 10 minutes does not stop learning. Existing reminder and reward-limit rules remain; weekly learning-day qualification follows D-76 (F-44, section 4; clarification of D-07). D-90 makes the time target advisory. |
| D-75 | Future modules may include natural science, geography and other primary-school subjects alongside German and maths. This is the long-term product direction; the current MVP remains beginner English, levels 1–2 (sections 1 and 5). |
| D-76 | A learning day counts only after the same profile both accumulates at least 10 minutes of counted learning and completes at least one learning or review-only session that day. Time may accumulate across sessions; award credit when both conditions are met. Either condition alone is insufficient; the weekly goal remains 4 of 7 days (F-20, F-36; revision of D-25). Superseded by D-90. |
| D-77 | The product owner accepted the integrated PRD v0.10 after reviewing D-73–D-76, passing the "PRD approved" gate on 2026-11-06. Next choose the technology stack, then prepare implementation stages under D-56. |
| D-78 | Technology after a second opinion: React + TypeScript + Vite, ordinary CSS with custom properties, Vitest and Playwright, static GitHub Pages build (section 10). |
| D-79 | Local data: one versioned document per profile plus a separate answer-history store in IndexedDB, through the `idb` library; imports and migrations write the complete new state in one transaction (N-11, N-13). Future option if data grows substantially (e.g. many subjects or v1.1 sync): a multi-table model, e.g. with Dexie. |
| D-80 | Audio files are MP3, loaded whole from the offline cache and played through the Web Audio API, so offline playback also works in Safari; verify on the target tablet in the audio-player stage (N-04). |
| D-81 | The pilot lesson (D-44) runs early, on a test build after about ten implementation stages: one lesson, listen-and-tap, flashcards, a simplified session and simple saving, with a simple profile screen without a PIN. The test build may temporarily deviate from F-03 and other MVP requirements; it is not an MVP release. |
| D-82 | Emoji set: Twemoji (jdecked/twemoji), graphics under CC BY 4.0, credited in the About screen (F-33); do not use the originating company's name or logo beyond the required attribution (D-18, section 7). |
| D-83 | Voices: Cori medium (en-GB, author's public-domain declaration) and Supertonic 3 preset 0 (Polish, BigScience Open RAIL-M), generated locally with sherpa-onnx and converted to MP3. Polish Piper voices are not used because their training lineage leaves the licence unresolved. Every generated clip is listened to before use. Clarifies D-48; details in `docs/ASSET_LICENCES.md`. |
| D-84 | Synthetic-audio disclosure: a small, permanent "Nagranie syntetyczne" label on exercise screens near the audio controls, for both languages, plus voice credits in About (F-45, F-33). Meets the Supertonic licence's machine-generated disclosure condition. |
| D-85 | Publish test builds of `main` to GitHub Pages now, through a free GitHub Actions workflow that first runs the checks, with a visible "Wersja testowa" banner. Used for tablet checks and the pilot; the MVP release (P39) keeps its own verification and approval. No personal data is published. Remote USB debugging stays available for detailed diagnostics. |
| D-86 | P09 pilot uses variant A selected by the product owner: 3 words, 3 flashcards and 2 listen-and-tap rounds (9 exercises). Present each new word with its picture, written English form and pronunciation before those exercises. The fixed pilot sequence does not replace the full session composition planned in P14. |
| D-87 | Flashcard self-assessment buttons in Polish: „Znam” / „Jeszcze nie” (not „Umiem”, which means "I can do" rather than "I know [a word]"). The flashcard instruction and its recording use the same words (F-08). |
| D-88 | All Polish texts shown or played to users (UI, instructions, recordings) must be correct Polish: grammar, spelling, punctuation and natural, consistent style; short, simple sentences addressed to the child in the second person, suitable for grades 1–3. New or changed Polish texts are shown to the product owner before audio is generated (N-06). |
| D-89 | P10 follows variant A of the [pilot observation protocol](PILOT_PROTOCOL.md) (U-08, approved 2026-11-17): observe each child separately in one nine-exercise session on each of three different days after P09 device checks. Use a stopwatch and record help, picture and instruction clarity, self-assessment understanding, reactions to mistakes and a separate optional speaking attempt. Apply the protocol's stop, fix-and-recheck and close criteria to each child. Keep raw notes local and record only combined, non-identifying findings in the repository (D-44, N-09). |
| D-90 | U-01, variant A, selected on 2026-11-17. One completed learning or review-only session earns one learning day for that profile on the day of completion. Ten minutes of counted learning time is a suggested daily target. The default weekly goal is 4 of 7 days. Time tracking, the break reminder and reward limits follow F-22–F-24. This supersedes D-76 and revises the time target in D-74 (F-20, F-36, F-44). |
| D-91 | U-02, variant A, selected on 2026-11-17. When the planned material supports fewer than eight exercises, shorten the session. When a daily plan is empty or exhausted, show „Na dziś wszystko!” and offer optional practice if there are previously introduced words. Prioritise weaker words. An empty review-only plan explains that no reviews are due. Extra practice does not promote words or move their scheduled review dates. The empty screen does not complete a session or earn learning-day credit. Actual session completion follows D-90 (F-04, F-05, F-13, F-20). |
| D-92 | U-03, variant A, selected on 2026-11-17. The MVP uses the same suggested daily target of 10 minutes for all profiles. Each child works at their own pace. Parents can change the break reminder limit per profile (F-23, F-29). Record session duration and signs of waning attention in P10. Use the observations to consider a per-profile daily target later (F-44, D-89, D-90). |
| D-93 | U-04, variant A for the MVP, selected on 2026-11-17. The vocabulary goal is listening comprehension. Keep the direct picture-to-word flip in F-08. In P10, the optional speaking attempt stays outside the app session (D-89). After the MVP, the owner's preferred option for further consideration is variant B: a short invitation to recall the word silently or aloud before flipping, with no recording or scoring. Revisit it using the P10 observations. |
| D-94 | U-05, variant A, selected on 2026-11-17. After P10, in the full MVP session, „Jeszcze nie” can bring back the word as a flashcard once later in the same session if the planned exercise count allows it. Allow at most one self-assessment replay per word per session. „Znam” continues without scheduling a replay. If there is no room, continue the session. Self-assessment changes neither the word's grade, Leitner box nor review date. P10 observes how children understand both buttons in the existing pilot (F-08, D-33, D-87, D-89). |
| D-95 | U-06, variant A, selected on 2026-11-18. The primary learning measure in the three-week MVP test is a parent-led listening-and-picture check before and after the test, with at least 10 matched Level 1 words per child. Change the order and picture positions between checks. Require a gain of at least 20 percentage points below an 80% baseline, or maintenance of the baseline at 80% or above. Fewer than 10 matched results means insufficient measurement. The first and last eligible due reviews supplement the check with a measure of retention. Keep raw results local and report combined findings without personal data (section 11, D-93, N-09). |
| D-96 | U-07, variant A, selected on 2026-11-18. In the parent summary, show „Opanowane w powtórkach” for words that meet F-14 and „W trakcie nauki” for introduced words that do not currently meet F-14, separately per profile. Explain both labels briefly. Add a short suggestion to the difficult-word list for the parent to play a word and ask the child to point to its picture. The parent-led listening check remains part of the MVP test under D-95 (F-14, F-27, F-28). |
| D-97 | U-09, variant A, selected on 2026-11-18. After P10 and the pre-P11 decisions, prepare progress saving, reviews, full learning sessions, rewards, a simple sticker album and all Level 1 lessons. Then run a three-week family test on the GitHub Pages test build (P29A), online in the same browser on one shared device, before the parent panel, backups and offline packaging. Use the D-95 listening check and observations of return use to review the learning flow before resuming the MVP plan. Exercise scope follows D-98. Keep verification of the full MVP before release and the P40 evaluation for the v1.1 decision (section 11, D-85). |
| D-98 | U-10, variant A, selected on 2026-11-18. The MVP and P29A use voiced flashcards, listen and tap, and picture-to-word exercises (F-08–F-10). Only F-09 and F-10 count as checked exercises. Defer context questions (F-11) as a v1.1 candidate and reconsider the child-facing skip-level test (F-16) when more English levels are available. Complete a level by completing all its lessons (F-15). Keep the parent-set starting level, with unintroduced words from earlier levels entering reviews as unconfirmed (F-17, F-38). |

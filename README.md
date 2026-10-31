# Kumacz

**A learning web app for primary school kids: short daily sessions, gentle gamification, no competition.**

The first module teaches beginner English to children in grades 1–3. More subjects (German, maths) are planned on the same foundation.

> **Status:** 📝 Planning. Requirements are drafted and under review; no code yet.
> **Live app:** coming with v1.0 on GitHub Pages.

## Why

Kids pick up the basics of English at school, but there is little at home for short, regular practice that suits a child who is still learning to read. Many apps are paid, overloaded, or built around leaderboards and streaks that punish a missed day. Parents rarely get a clear view of what their child actually practised.

Kumacz aims to be the opposite: a calm 10-minute daily habit that a 7-year-old can use alone and a parent can follow at a glance.

## Principles

- **Short and regular:** a daily goal of about 10 minutes and a weekly goal (4 of 7 days) instead of streaks that can be lost.
- **Listen before you read:** every word and instruction can be played aloud.
- **No competition, no penalties:** stars and a sticker album, never leaderboards; a wrong answer never takes anything away.
- **Built for parents too:** a PIN-protected panel with learning time, progress and the words a child struggles with.
- **Modular by design:** content lives in data files, so a new lesson or subject does not require changing the app.
- **Minimal data:** a nickname, an avatar and learning progress, nothing more.

## Modules

| Module | Level framework | Status |
|---|---|---|
| English | Cambridge Pre A1 Starters, 5 levels | in planning (first module) |
| German | to be defined | idea |
| Maths | Polish national curriculum | idea |

## Roadmap

| Version | Highlights |
|---|---|
| **v1.0 (MVP)** | English levels 1–2 · flashcards, listen-and-tap, picture-to-word, context questions · Leitner review · stars and sticker album · parent panel · two colour themes · offline-capable, data stored on the device |
| **v1.1** | Sync across devices · shared sibling goal ("family tree") · memory and spelling exercises · level 3 |
| **v1.2** | Decorating "my place" with earned stars · levels 4–5 · pronunciation practice |

Moving from v1.0 to v1.1 is gated: the MVP is tested by real users for 3 weeks against defined success criteria before new features are added.

## How this project is run

Kumacz is built product-first. Before any code, the product was defined in a requirements document with:

- personas, design principles and a scoped release plan,
- numbered functional and non-functional requirements,
- measurable MVP success criteria and a release gate,
- a risk table and a decision log explaining every key choice.

📄 Read it here: [docs/PRD.md](docs/PRD.md)

## Tech

- Static web app hosted on GitHub Pages; no server in v1.0.
- Designed for tablet (Android first, iPad-compatible) and desktop, touch and mouse.
- Installable to the home screen and usable offline after the first load.
- Voice-over via the browser's built-in speech synthesis.
- User interface in Polish; learning content in the module's language.

The framework and tooling will be chosen in the next phase.

## Privacy

- v1.0 keeps all data in the browser on the device; nothing is sent anywhere.
- From v1.1, only a parent creates an account, and each family can see only its own data.
- No surnames, birth dates, photos, voice recordings, ads or third-party analytics.

## License

Not chosen yet. Until a license is added, all rights are reserved.

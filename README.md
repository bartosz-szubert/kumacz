# Kumacz

Kumacz is a web app for short, regular learning sessions for primary-school children. The first module helps children in grades 1–3 understand beginner English words when they hear them. The long-term goal is to cover all primary-school grades and more subjects.

## Try the pilot

The test build includes one English lesson with spoken vocabulary, flashcards and picture choices. Profiles and session progress are stored in the browser. The next steps are checks on an Android tablet and a pilot with children. [Open the test build](https://bartosz-szubert.github.io/kumacz/)

## Run locally

Use the Node.js version in `.nvmrc`. With nvm, run these commands from the repository root.

```sh
nvm use
npm ci
npm run dev
```

Open the URL printed by Vite under `/kumacz/`. The app uses React, TypeScript and IndexedDB. [Development and testing guide](docs/DEVELOPMENT.md)

## Project documentation

- Product requirements, release scope and decisions. [PRD](docs/PRD.md)
- Implementation stages and current progress. [Implementation plan](docs/IMPLEMENTATION.md) · [Status](docs/STATUS.md)
- Pilot session and device checks. [Pilot guide](docs/PILOT_SESSION.md)

## License

All rights are reserved for Kumacz's own code and materials until a project licence is added. Third-party assets and voices follow their respective licences. [Asset and voice licences](docs/ASSET_LICENCES.md)

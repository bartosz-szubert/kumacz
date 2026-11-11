# Learning data layer — P06

**Prepared:** 2026-11-11, for review on `feature/p06-data-layer-core`.

P06 implements the local storage boundary from PRD section 10, N-10–N-12, D-55, D-71 and D-79. The existing audio-check UI remains the preview screen; P09 will connect the pilot's profile/session UI to this layer.

## Model and stores

The domain interfaces in [learningData.ts](../src/domain/learningData.ts) have no React or IndexedDB dependency. [The implementation](../src/data/learningData.ts) uses the existing pinned `idb` 8.0.4. Database name: `kumacz-learning`; IndexedDB schema version: 1. Every stored document carries the separate `formatVersion: 1`.

| Store | Key | Contents |
|---|---|---|
| `profiles` | Stable profile ID | Nickname, avatar ID, explicit theme, per-profile time/voice preferences and typed word/lesson/level progress |
| `answers` | `[profileId, answerId]` | Checked answer, stable module/level/lesson/word IDs, session/exercise IDs, timestamp and attempt context; indexes by profile and answer time |
| `settings` | `app` | Versioned app metadata, currently the last-backup timestamp |

Word progress stores facts needed by the approved rules: box, due date, introduction/unconfirmed flags, last promotion date and correct-answer/listen-and-tap flags. This stage persists supplied values; scheduling, grading and lesson-completion policy remain in later domain stages. Dates such as `dueOn` are local-calendar `YYYY-MM-DD` strings. Answer/backup timestamps are epoch milliseconds.

New documents must supply their preferences explicitly. P06 makes no default-profile theme decision. App metadata does not add a PIN/authentication flow; P23 owns parent access. Extra fields, invalid shapes and unsupported formats are rejected rather than silently stripped or repaired. Fixtures use invented profiles only.

## API and commit contract

Call `openLearningData()` from feature orchestration. Its returned `LearningData` interface provides `listProfiles`, `getProfile`, `saveProfile`, `deleteProfile`, `getAnswers`, `getSettings`, `saveSettings` and `close`. Components use this interface rather than opening browser storage. Missing profiles/settings return `undefined`; they do not trigger automatic creation or reset. Optional database-name/clock injection supports isolated tests.

- **Atomic profile save:** `saveProfile(nextProfile, pendingAnswers, { signal })` snapshots and validates its input, then writes the profile and all appended answers in one read/write transaction. It resolves only after `tx.done`. A duplicate answer, abort or native write error rejects the operation and rolls back all its changes. There is no network request or unrelated asynchronous work inside the transaction.
- **Revisions:** a new document has revision 0. A successful profile/settings save returns the next revision; use that returned document for the next edit. Comparing the stored revision inside the transaction prevents stale writes from a second connection. A conflict raises `LearningDataError` with code `conflict`; it does not overwrite the winning change.
- **History ownership:** appended answers must belong to the saved profile. Composite answer keys allow the same answer ID in different profiles. `deleteProfile(id, revision)` removes only that profile and its history, in one transaction. `getAnswers` returns chronological answers with an ID tie-breaker.
- **Checked answers only:** accepted exercise types are F-09–F-11. Flashcard self-assessment and ungraded audio failures cannot be represented as checked results. Context distinguishes due review, practice and corrective retry, with attempt number and whether the answer was independent before feedback. Callers supply the actual context; storage does not infer eligibility from the current box.
- **Retention:** on open, profile save and history read, physically delete answers strictly older than `now - 90 × 24 hours`. Keep the exact boundary. Opening validates all existing documents before any cleanup; an unknown/corrupt format aborts without changing committed data. Retention follows the device clock; the injected clock is for tests.
- **Failure:** input/format/conflict errors have stable `LearningDataError` codes; native browser storage/abort errors propagate. No operation clears or replaces the database on failure. Connections close when blocking a future schema upgrade. A newer database schema is refused without downgrade/reset.

Read/write transactions request standard `durability: 'strict'`. This is a browser durability hint, not a guarantee against eviction or hardware failure. Awaiting `tx.done` is the logical commit boundary. Persistence requests and backup reminders remain P34.

P11 will add session-position/reward commits and idempotent result retry; P12 owns the pending-result/save-error UI. The core deliberately rejects duplicate appends rather than silently treating them as a repeated reward. Backup import/export and actual format migrations remain P26/P27; a later stage that changes the stored shape must address compatibility explicitly. No reset, migration, import UI or policy is invented here.

## Verification

- Clean lockfile install with dependency scripts disabled; no package or lockfile changes.
- `npm run check`: TypeScript and production build.
- `npm test`: 34 Vitest cases, including 14 new data-boundary cases.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --project=chromium --workers=1`: 24 Chromium cases, including 10 new native IndexedDB cases and the 14 existing audio/UI regressions.
- Native cases cover reopen/reload, separate profiles/preferences, atomic profile/history commits, duplicate-request rollback, `IDBTransaction.abort()` after a real successful profile-write request and safe retry, physical 90-day cleanup, concurrent connections, profile/history deletion, settings conflicts and refusal of newer schemas/documents without reset.
- TDD first exposed the missing boundary module. Focused failing regressions then demonstrated object-to-string enum coercion and cleanup before rejecting a newer format; both were corrected. Changing the cleanup range to delete the exact 90-day boundary made the retention browser assertion fail; the original source was restored byte for byte before the final checks.
- The browser test bundles the production data module with Vite's JavaScript API and serves it through a test-only route. It exercises real IndexedDB; no fake database package or production test screen is added. Tests assert state after native abort, not process termination or power loss. Interruption/import/migration coverage remains with P12/P26/P27.
- The configured WebKit binary is unavailable in this environment; its project remains enabled. No new WebKit result is claimed. Real Android tablet checks remain P09 and child observation P10.

Codex's self-review used the repository's TDD, source-driven-development, code-review-and-quality and security-and-hardening skills. Boundaries were checked for version refusal, profile isolation, stale writes, unexpected personal fields, retention/deletion, error propagation and absence of new data transmission. Explicit owner merge approval is still required.

## Sources

- [idb API and typed schemas](https://github.com/jakearchibald/idb#typescript), checked against the installed 8.0.4 declarations.
- [idb transaction lifetime](https://github.com/jakearchibald/idb#transaction-lifetime) and [`tx.done`](https://github.com/jakearchibald/idb#txdone): only IndexedDB promises within an active transaction; completion is the success signal.
- [MDN transaction scope and standard durability options](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/transaction).
- [Vite JavaScript build API](https://vite.dev/guide/api-javascript.html#build), used only by the native-browser test harness.

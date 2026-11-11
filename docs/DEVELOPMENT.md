# Local development

The current review branch includes the P09 pilot profile/session screen ([PILOT_SESSION.md](PILOT_SESSION.md)). The earlier audio/exercise previews remain at `?preview=audio`. Full scheduling, rewards, parent access and offline preparation follow in later approved stages.

## Toolchain and installation

Use Node **24.19.0** (`.nvmrc`) with its bundled npm. `engines` accepts npm **11.9.0 or newer within 11.x**; `packageManager` records the npm version that created the lockfile. Node 24.19.0 ships npm 11.17.0, so `nvm use` followed by `npm ci` works without installing another npm (verified with npm 11.9.0 and 11.17.0). The supported Node line is 24. Direct dependency versions are exact; `package-lock.json` is the authoritative resolved dependency graph.

```sh
nvm use
npm ci
npm run check
npm run dev
```

Open the address printed by Vite, under `/kumacz/`. The same base path is used for the planned GitHub Pages repository site. A production preview is available with:

```sh
npm run build
npm run preview
```

`npm run check` checks both browser and tooling TypeScript configurations and builds the static site. `dist/` is generated output and is not committed. No Pages deployment workflow is introduced in P01.

## Test tools

- `npm test`: Vitest, discovering `src/**/*.test.{ts,tsx}` in the Node environment.
- `npm run test:watch`: the same unit-test configuration in watch mode.
- `npm run test:e2e`: Playwright, discovering `tests/e2e/`, with Chromium and WebKit projects. It builds the app and starts a production preview under `/kumacz/` on port 4173. Keep that port free.
- Install the matching browser binaries with `npm exec -- playwright install chromium webkit`.

P03 adds actual unit and browser cases. Run the normal commands without allowing empty suites. The [P03 guide](AUDIO_PLAYER.md) records the system-Chromium override and the blocked WebKit download in the current environment. Playwright WebKit does not replace testing on a real iPad.

## Dependency installation policy

The committed `.npmrc` sets `ignore-scripts=true`, `save-exact=true` and `engine-strict=true`. Dependency lifecycle scripts stay disabled during both install and clean `npm ci`. Explicit repository commands such as `npm run build` still run; npm does not run their pre/post hooks under this policy.

P01's Linux installation has no installed dependencies with install lifecycle scripts. The lockfile includes the optional macOS-only `fsevents` install script; it is not installed on Linux and remains blocked by policy on other platforms. No dependency-script exception has been approved or enabled. Prebuilt platform packages used by the build work with scripts disabled.

Before enabling any future dependency script, inspect the exact version and source, use the pinned manager's enforceable policy, and review the change. Do not globally turn scripts back on to repair an installation.

For dependency changes, inspect the manifest and lockfile together, verify a clean `npm ci`, run the relevant checks, and use `npm audit`. Do not run forced automatic audit fixes. Keep credentials, local exports and real profile data out of the repository.

## P01 verification record

Historical foundation baseline, verified on Linux with the pinned Node/npm versions. Current behaviour checks are recorded in [AUDIO_PLAYER.md](AUDIO_PLAYER.md).

- Clean `npm ci --offline --ignore-scripts --no-audit` using the populated package cache; lockfile SHA-256 unchanged. The initial registry installation also used scripts disabled.
- Type-check and production build passed after that clean install.
- `npm audit`: zero known vulnerabilities in the locked graph at the time of verification.
- Vitest and Playwright configurations loaded, explicitly reporting zero tests.
- An ad hoc check of the production preview with installed system Chromium 154.0.8037.57 mounted the React heading, confirmed Polish document metadata and `/kumacz/assets/` paths, and observed no page/console errors, failed responses or external requests. The check and screenshot are workspace artifacts, not placeholder tests committed to the project.

At the time of P01, real Android/iPad checks, application tests and audio/offline verification were pending. P02's licence review is now approved; P03 device verification remains open.

## Sources for the foundation

- [React browser root](https://react.dev/reference/react-dom/client/createRoot)
- [React with Vite and TypeScript](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite's React/TypeScript configuration template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
- [Vite GitHub Pages base path](https://vite.dev/guide/static-deploy.html#github-pages)
- [Vitest configuration](https://vitest.dev/config/)
- [Playwright configuration](https://playwright.dev/docs/test-configuration)
- [npm ignore-scripts](https://docs.npmjs.com/cli/v11/using-npm/config/#ignore-scripts)

## Test builds on GitHub Pages (D-85)

Every push to `main` runs `.github/workflows/pages.yml`: clean install, `npm run check`, unit tests, then publication to `https://bartosz-szubert.github.io/kumacz/` with a "Wersja testowa" banner. A failed check stops publication. The workflow uses no secrets; actions are pinned to commit SHAs. It can also be started manually (Actions → Pages test build → Run workflow).

One-time repository setting: Settings → Pages → Build and deployment → Source: **GitHub Actions**.

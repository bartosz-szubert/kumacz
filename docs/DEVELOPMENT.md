# Local development

P01 provides the application foundation. The current page only mounts the Kumacz heading; learning, profiles, audio and offline preparation follow in the approved implementation stages.

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
- When browser tests are added, install their matching browser binaries with `npm exec -- playwright install chromium webkit`.

There are **no committed unit or E2E tests in P01**. The scaffolding stage deliberately adds no placeholder tests. Default test commands report an empty suite as a failure; add meaningful tests with the behaviour in later stages. The following commands only verify configuration/discovery and explicitly permit an empty suite:

```sh
npm test -- --passWithNoTests
npm run test:e2e -- --list --pass-with-no-tests
```

An empty discovery result is not evidence that application behaviour has passed tests. Playwright WebKit also does not replace testing on a real iPad.

## Dependency installation policy

The committed `.npmrc` sets `ignore-scripts=true`, `save-exact=true` and `engine-strict=true`. Dependency lifecycle scripts stay disabled during both install and clean `npm ci`. Explicit repository commands such as `npm run build` still run; npm does not run their pre/post hooks under this policy.

P01's Linux installation has no installed dependencies with install lifecycle scripts. The lockfile includes the optional macOS-only `fsevents` install script; it is not installed on Linux and remains blocked by policy on other platforms. No dependency-script exception has been approved or enabled. Prebuilt platform packages used by the build work with scripts disabled.

Before enabling any future dependency script, inspect the exact version and source, use the pinned manager's enforceable policy, and review the change. Do not globally turn scripts back on to repair an installation.

For dependency changes, inspect the manifest and lockfile together, verify a clean `npm ci`, run the relevant checks, and use `npm audit`. Do not run forced automatic audit fixes. Keep credentials, local exports and real profile data out of the repository.

## P01 verification record

Verified on Linux with the pinned Node/npm versions:

- Clean `npm ci --offline --ignore-scripts --no-audit` using the populated package cache; lockfile SHA-256 unchanged. The initial registry installation also used scripts disabled.
- Type-check and production build passed after that clean install.
- `npm audit`: zero known vulnerabilities in the locked graph at the time of verification.
- Vitest and Playwright configurations loaded, explicitly reporting zero tests.
- An ad hoc check of the production preview with installed system Chromium 154.0.8037.57 mounted the React heading, confirmed Polish document metadata and `/kumacz/assets/` paths, and observed no page/console errors, failed responses or external requests. The check and screenshot are workspace artifacts, not placeholder tests committed to the project.

Real Android/iPad checks, application tests and audio/offline verification belong to subsequent stages. Next: P02 asset and voice licence checks.

## Sources for the foundation

- [React browser root](https://react.dev/reference/react-dom/client/createRoot)
- [React with Vite and TypeScript](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite's React/TypeScript configuration template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
- [Vite GitHub Pages base path](https://vite.dev/guide/static-deploy.html#github-pages)
- [Vitest configuration](https://vitest.dev/config/)
- [Playwright configuration](https://playwright.dev/docs/test-configuration)
- [npm ignore-scripts](https://docs.npmjs.com/cli/v11/using-npm/config/#ignore-scripts)

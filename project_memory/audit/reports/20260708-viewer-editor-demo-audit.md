# Audit: Viewer and Editor demo pages

- Date: 2026-07-08
- Loop: 45
- Scope: Browser-visible `Viewer` and `Modeler` sample demos for ArchiMate 4.

## Result

- Status: pass
- Change type: demo / usability / rendering guard

## Evidence

- Initial demo build: `project_memory/runlogs/20260708-334-demo-build.txt`
  - Failed because `webpack-cli` was missing.
- Tooling install: `project_memory/runlogs/20260708-335-demo-webpack-cli-install.txt`
  - Added `webpack-cli` as a dev dependency so `npm run demo:build` is reproducible.
- Demo build after CLI install: `project_memory/runlogs/20260708-336-demo-build-after-webpack-cli.txt`
  - Viewer and editor bundles compiled successfully.
- Initial browser smoke: `project_memory/runlogs/20260708-337-demo-puppeteer-smoke.txt`
  - Viewer and editor rendered, but browser console reported SVG `rx` / `ry` warnings from missing ArchiMate 4 aspect border metadata.
- Aspect border fix build: `project_memory/runlogs/20260708-338-demo-build-after-aspect-border-fix.txt`
  - Bundles compiled successfully after renderer metadata fix.
- Language tests: `project_memory/runlogs/20260708-340-demo-language-tests-after-test-fix.txt`
  - `npm run test:language` passed with 79 tests.
- Browser smoke after fix: `project_memory/runlogs/20260708-341-demo-puppeteer-smoke.txt`
  - Viewer and editor both reached `ready`.
  - Each rendered 5 shapes and 4 connections.
  - Editor palette was visible.
  - No browser console errors were reported.
- Changed-file ESLint: `project_memory/runlogs/20260708-345-demo-eslint-changed-js-after-fix.txt`
  - Demo JavaScript, renderer aspect metadata, and language-profile test passed ESLint.
- Whitespace audit: `project_memory/runlogs/20260708-346-demo-git-diff-check-after-eslint-fix.txt`
  - `git diff --check` passed.
- Final demo build: `project_memory/runlogs/20260708-347-demo-final-build.txt`
  - Viewer and editor bundles compiled successfully.
- Final browser smoke: `project_memory/runlogs/20260708-348-demo-final-puppeteer-smoke.txt`
  - Viewer and editor both reached `ready`, rendered sample content, and had no browser console errors.

## Decision

Add static demo pages under `demo/` and a reproducible `npm run demo:build` script. The generated bundles stay local under ignored `demo/dist/`, while committed source files define the demos.

## Remaining External Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names still require the official XSD.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

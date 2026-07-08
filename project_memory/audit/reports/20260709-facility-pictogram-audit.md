# Audit: Facility Renderer Pictogram

- Date: 2026-07-09
- Loop: 83
- Scope: C260 Appendix A-derived ArchiMate 4 `Facility` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-401-c260-appendix-a-facility-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-402-c260-appendix-a-facility-visual-check.txt` records the rendered page observation: `Facility` uses a factory-shaped pictogram rather than the `Node` cube pictogram.

## Red Test

- `project_memory/runlogs/20260709-403-facility-pictogram-red-test.txt` failed because `PICTO_FACILITY` was still an alias of `PICTO_NODE`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_FACILITY` factory-shaped path.
- `PICTO_FACILITY` was removed from the Node alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-404-facility-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-405-facility-pictogram-test-language.txt`: `npm run test:language` passed with 141 tests.
- `project_memory/runlogs/20260709-406-facility-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-407-facility-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-408-facility-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-409-facility-pictogram-git-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-410-facility-pictogram-repo-lint-legacy.txt`: repo-wide lint remains the known legacy failure with 4383 errors.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

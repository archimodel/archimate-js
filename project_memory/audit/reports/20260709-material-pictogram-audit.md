# Audit: Material Renderer Pictogram

- Date: 2026-07-09
- Loop: 82
- Scope: C260 Appendix A-derived ArchiMate 4 `Material` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-389-c260-appendix-a-material-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-390-c260-appendix-a-material-visual-check.txt` records the rendered page observation: `Material` uses a hexagonal pictogram rather than the `Artifact` document pictogram.

## Red Test

- `project_memory/runlogs/20260709-391-material-pictogram-red-test.txt` failed because `PICTO_MATERIAL` was still an alias of `PICTO_ARTIFACT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_MATERIAL` hexagonal path.
- `PICTO_MATERIAL` was removed from the Artifact alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-392-material-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-393-material-pictogram-test-language.txt`: `npm run test:language` passed with 140 tests.
- `project_memory/runlogs/20260709-394-material-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-395-material-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-396-material-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-397-material-pictogram-git-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-398-material-pictogram-repo-lint-legacy.txt`: repo-wide lint remains the known legacy failure with 4383 errors.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

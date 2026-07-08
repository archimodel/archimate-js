# Audit: Location Renderer Pictogram

- Date: 2026-07-09
- Loop: 80
- Scope: C260 Appendix A-derived ArchiMate 4 `Location` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-364-c260-appendix-a-location-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-365-c260-appendix-a-location-visual-check.txt` records the rendered page observation: `Location` uses a location-pin pictogram rather than a generic object/document pictogram.

## Red Test

- `project_memory/runlogs/20260709-366-location-pictogram-red-test.txt` failed because `PICTO_LOCATION` was still an alias of `PICTO_OBJECT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_LOCATION` pin-shaped path.
- `PICTO_LOCATION` was removed from the generic object alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-367-location-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-368-location-pictogram-test-language.txt`: `npm run test:language` passed with 138 tests.
- `project_memory/runlogs/20260709-369-location-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-370-location-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-371-location-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-372-location-pictogram-git-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-373-location-pictogram-repo-lint-legacy.txt`: repo-wide lint remains the known legacy failure with 4383 errors.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

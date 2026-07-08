# Audit: Principle Renderer Pictogram

- Date: 2026-07-09
- Loop: 93
- Scope: C260 Appendix A-derived ArchiMate 4 `Principle` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-528-c260-appendix-a-principle-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-529-c260-appendix-a-principle-visual-check.txt` records the rendered page observation: `Principle` uses a rounded-square pictogram containing an exclamation mark rather than the generic object/document pictogram.

## Red Test

- `project_memory/runlogs/20260709-530-principle-pictogram-red-test.txt` failed because `PICTO_PRINCIPLE` was still an alias of `PICTO_OBJECT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_PRINCIPLE` rounded-square exclamation path.
- `PICTO_PRINCIPLE` was removed from the generic object alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old generic object alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-531-principle-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-532-principle-pictogram-test-language.txt`: `npm run test:language` passed with 151 tests.
- `project_memory/runlogs/20260709-533-principle-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-534-principle-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-535-principle-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-536-principle-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-537-principle-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-538-principle-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-539-principle-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

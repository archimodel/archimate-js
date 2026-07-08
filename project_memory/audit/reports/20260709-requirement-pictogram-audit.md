# Audit: Requirement Renderer Pictogram

- Date: 2026-07-09
- Loop: 94
- Scope: C260 Appendix A-derived ArchiMate 4 `Requirement` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-540-c260-appendix-a-requirement-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-541-c260-appendix-a-requirement-visual-check.txt` records the rendered page observation: `Requirement` uses a slanted parallelogram pictogram rather than the generic object/document pictogram.

## Red Test

- `project_memory/runlogs/20260709-542-requirement-pictogram-red-test.txt` failed because `PICTO_REQUIREMENT` was still an alias of `PICTO_OBJECT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_REQUIREMENT` parallelogram path.
- `PICTO_REQUIREMENT` was removed from the generic object alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old generic object alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-543-requirement-pictogram-test.txt`: focused renderer notation test passed with 18 tests.
- `project_memory/runlogs/20260709-544-requirement-pictogram-test-language.txt`: `npm run test:language` passed with 152 tests.
- `project_memory/runlogs/20260709-545-requirement-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-546-requirement-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-547-requirement-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-548-requirement-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-549-requirement-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-552-requirement-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-553-requirement-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

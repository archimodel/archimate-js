# Audit: Grouping Renderer Pictogram

- Date: 2026-07-09
- Loop: 96
- Scope: C260 Appendix A-derived ArchiMate 4 `Grouping` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-568-c260-appendix-a-grouping-pictogram-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-569-c260-appendix-a-grouping-pictogram-visual-check.txt` records the rendered page observation: `Grouping` uses a dashed, unfilled rectangle pictogram rather than a generic object/document pictogram.

## Red Test

- `project_memory/runlogs/20260709-570-grouping-pictogram-red-test.txt` failed because `PICTO_GROUPING` was still an alias of `PICTO_OBJECT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_GROUPING` dashed-rectangle line path.
- `PICTO_GROUPING` was removed from the generic object alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old generic object alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-571-grouping-pictogram-test.txt`: focused renderer notation test passed with 21 tests.
- `project_memory/runlogs/20260709-572-grouping-pictogram-test-language.txt`: `npm run test:language` passed with 155 tests.
- `project_memory/runlogs/20260709-573-grouping-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-574-grouping-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-575-grouping-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-576-grouping-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-577-grouping-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-580-grouping-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-581-grouping-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

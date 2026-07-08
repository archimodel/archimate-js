# Audit: Plateau Renderer Pictogram

- Date: 2026-07-09
- Loop: 87
- Scope: C260 Appendix A-derived ArchiMate 4 `Plateau` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-455-c260-appendix-a-plateau-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-456-c260-appendix-a-plateau-visual-check.txt` records the rendered page observation: `Plateau` uses a stacked horizontal bars pictogram rather than the `Product` folder pictogram.

## Red Test

- `project_memory/runlogs/20260709-457-plateau-pictogram-red-test.txt` failed because `PICTO_PLATEAU` was still an alias of `PICTO_PRODUCT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_PLATEAU` stacked horizontal bars path.
- `PICTO_PLATEAU` was removed from the Product alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-458-plateau-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-459-plateau-pictogram-test-language.txt`: `npm run test:language` passed with 145 tests.
- `project_memory/runlogs/20260709-460-plateau-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-461-plateau-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-462-plateau-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-463-plateau-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-464-plateau-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-465-plateau-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-466-plateau-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

# Audit: Outcome Renderer Pictogram

- Date: 2026-07-09
- Loop: 92
- Scope: C260 Appendix A-derived ArchiMate 4 `Outcome` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-516-c260-appendix-a-outcome-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-517-c260-appendix-a-outcome-visual-check.txt` records the rendered page observation: `Outcome` uses a target/bullseye pictogram struck by a diagonal arrow rather than the generic object/document pictogram.

## Red Test

- `project_memory/runlogs/20260709-518-outcome-pictogram-red-test.txt` failed because `PICTO_OUTCOME` was still an alias of `PICTO_OBJECT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_OUTCOME` target/bullseye-with-arrow path.
- `PICTO_OUTCOME` was removed from the generic object alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old generic object alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-519-outcome-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-520-outcome-pictogram-test-language.txt`: `npm run test:language` passed with 150 tests.
- `project_memory/runlogs/20260709-521-outcome-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-522-outcome-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-523-outcome-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-524-outcome-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-525-outcome-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-526-outcome-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-527-outcome-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

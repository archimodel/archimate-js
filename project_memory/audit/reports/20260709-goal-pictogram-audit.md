# Audit: Goal Renderer Pictogram

- Date: 2026-07-09
- Loop: 91
- Scope: C260 Appendix A-derived ArchiMate 4 `Goal` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-504-c260-appendix-a-goal-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-505-c260-appendix-a-goal-visual-check.txt` records the rendered page observation: `Goal` uses a target/bullseye pictogram rather than the generic object/document pictogram.

## Red Test

- `project_memory/runlogs/20260709-506-goal-pictogram-red-test.txt` failed because `PICTO_GOAL` was still an alias of `PICTO_OBJECT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_GOAL` target/bullseye path.
- `PICTO_GOAL` was removed from the generic object alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old generic object alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-507-goal-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-508-goal-pictogram-test-language.txt`: `npm run test:language` passed with 149 tests.
- `project_memory/runlogs/20260709-509-goal-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-510-goal-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-511-goal-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-512-goal-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-513-goal-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-514-goal-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-515-goal-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

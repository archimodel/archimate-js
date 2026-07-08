# Audit: Deliverable Renderer Pictogram

- Date: 2026-07-09
- Loop: 86
- Scope: C260 Appendix A-derived ArchiMate 4 `Deliverable` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-442-c260-appendix-a-deliverable-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-443-c260-appendix-a-deliverable-visual-check.txt` records the rendered page observation: `Deliverable` uses a wavy-bottom document pictogram rather than the generic object pictogram.

## Red Test

- `project_memory/runlogs/20260709-444-deliverable-pictogram-red-test.txt` failed because `PICTO_DELIVERABLE` was still an alias of `PICTO_OBJECT`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_DELIVERABLE` wavy-bottom document path.
- `PICTO_DELIVERABLE` was removed from the generic object alias map.
- The legacy misspelled `PICTO_DELIVRABLE` alias remains available and now points at the corrected `PICTO_DELIVERABLE` path.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-445-deliverable-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-446-deliverable-pictogram-test-language.txt`: `npm run test:language` passed with 144 tests.
- `project_memory/runlogs/20260709-447-deliverable-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-448-deliverable-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-449-deliverable-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-450-deliverable-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-451-deliverable-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-452-deliverable-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-453-deliverable-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

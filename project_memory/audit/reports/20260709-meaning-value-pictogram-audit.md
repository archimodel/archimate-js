# Audit: Meaning and Value Renderer Pictograms

- Date: 2026-07-09
- Loop: 95
- Scope: C260 Appendix A-derived ArchiMate 4 `Meaning` and `Value` renderer pictograms.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-554-c260-appendix-a-meaning-value-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-555-c260-appendix-a-meaning-value-visual-check.txt` records the rendered page observation: `Value` uses an oval pictogram and `Meaning` uses a thought-cloud pictogram with small bubbles rather than generic object/document pictograms.

## Red Test

- `project_memory/runlogs/20260709-556-meaning-value-pictogram-red-test.txt` failed because `PICTO_MEANING` and `PICTO_VALUE` were still aliases of `PICTO_OBJECT`.

## Implementation

- `lib/draw/PathMap.js` now defines locally-authored `PICTO_VALUE` oval and `PICTO_MEANING` thought-cloud paths.
- `PICTO_VALUE` and `PICTO_MEANING` were removed from the generic object alias map.
- `test/renderer-notation.test.mjs` guards the dedicated paths and rejects the old generic object aliases.
- README and `docs/archimate4` document the derived renderer requirements and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-557-meaning-value-pictogram-test.txt`: focused renderer notation test passed with 20 tests.
- `project_memory/runlogs/20260709-558-meaning-value-pictogram-test-language.txt`: `npm run test:language` passed with 154 tests.
- `project_memory/runlogs/20260709-559-meaning-value-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-560-meaning-value-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-561-meaning-value-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-562-meaning-value-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-563-meaning-value-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-566-meaning-value-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-567-meaning-value-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

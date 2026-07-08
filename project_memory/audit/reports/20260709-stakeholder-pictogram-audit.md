# Audit: Stakeholder Renderer Pictogram

- Date: 2026-07-09
- Loop: 88
- Scope: C260 Appendix A-derived ArchiMate 4 `Stakeholder` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-468-c260-appendix-a-stakeholder-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-469-c260-appendix-a-stakeholder-visual-check.txt` records the rendered page observation: `Stakeholder` uses a horizontal cylinder pictogram rather than the actor/person pictogram.

## Red Test

- `project_memory/runlogs/20260709-470-stakeholder-pictogram-red-test.txt` failed because `PICTO_STAKEHOLDER` was still an alias of `PICTO_ACTOR`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_STAKEHOLDER` horizontal cylinder path.
- The legacy misspelled `PICTO_STAKHOLDER` alias now points to `PICTO_STAKEHOLDER` for compatibility.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old actor/person alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-471-stakeholder-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-472-stakeholder-pictogram-test-language.txt`: `npm run test:language` passed with 146 tests.
- `project_memory/runlogs/20260709-473-stakeholder-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-474-stakeholder-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-475-stakeholder-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-476-stakeholder-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-477-stakeholder-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-478-stakeholder-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-479-stakeholder-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

# Audit: Work Package Renderer Pictogram

- Date: 2026-07-09
- Loop: 85
- Scope: C260 Appendix A-derived ArchiMate 4 `Work Package` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-427-c260-appendix-a-work-package-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-428-c260-appendix-a-work-package-visual-check.txt` records the rendered page observation: `Work Package` uses a loop-arrow pictogram rather than the `Process` horizontal arrow pictogram.
- `project_memory/runlogs/20260709-426-c260-appendix-a-work-package-render.txt` records the failed wrapper attempt before using the actual Poppler executable.

## Red Test

- `project_memory/runlogs/20260709-429-work-package-pictogram-red-test.txt` failed because `PICTO_WORK_PACKAGE` was still an alias of `PICTO_PROCESS`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_WORK_PACKAGE` loop-arrow path.
- `PICTO_WORK_PACKAGE` was removed from the Process alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-430-work-package-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-431-work-package-pictogram-test-language.txt`: `npm run test:language` passed with 143 tests.
- `project_memory/runlogs/20260709-432-work-package-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-433-work-package-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-434-work-package-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-435-work-package-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-436-work-package-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-439-work-package-pictogram-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-440-work-package-pictogram-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

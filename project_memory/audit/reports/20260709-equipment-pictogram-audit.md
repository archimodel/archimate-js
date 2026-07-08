# Audit: Equipment Renderer Pictogram

- Date: 2026-07-09
- Loop: 84
- Scope: C260 Appendix A-derived ArchiMate 4 `Equipment` renderer pictogram.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-413-c260-appendix-a-equipment-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-414-c260-appendix-a-equipment-visual-check.txt` records the rendered page observation: `Equipment` uses a gear-shaped pictogram rather than the `Device` monitor pictogram.

## Red Test

- `project_memory/runlogs/20260709-415-equipment-pictogram-red-test.txt` failed because `PICTO_EQUIPMENT` was still an alias of `PICTO_DEVICE`.

## Implementation

- `lib/draw/PathMap.js` now defines a locally-authored `PICTO_EQUIPMENT` gear-shaped path.
- `PICTO_EQUIPMENT` was removed from the Device alias map.
- `test/renderer-notation.test.mjs` guards the dedicated path and rejects the old alias.
- README and `docs/archimate4` document the derived renderer requirement and the local artwork boundary.

## Verification

- `project_memory/runlogs/20260709-416-equipment-pictogram-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-417-equipment-pictogram-test-language.txt`: `npm run test:language` passed with 142 tests.
- `project_memory/runlogs/20260709-418-equipment-pictogram-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-419-equipment-pictogram-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-420-equipment-pictogram-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-421-equipment-pictogram-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-422-equipment-pictogram-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

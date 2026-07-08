# Audit: ArchiMate 4 Pictogram Coverage Status

- Date: 2026-07-09
- Loop: 97
- Scope: Machine-auditable ArchiMate 4 profile pictogram coverage after replacing profile generic-object aliases.
- Result: pass

## Red Test

- `project_memory/runlogs/20260709-582-pictogram-coverage-status-red-test.txt` failed because `archimate4-profile.json` did not expose dedicated-local-path coverage metadata, generic object alias count, or legacy compatibility alias metadata.

## Implementation

- `lib/metamodel/languages/archimate4-profile.json` now records `profilePictogramCoverage: dedicated-local-paths`, `genericObjectAliasCount: 0`, and legacy misspelled compatibility aliases `PICTO_DELIVRABLE` and `PICTO_STAKHOLDER`.
- `test/language-profile.test.mjs` verifies that non-`PICTO_OBJECT` ArchiMate 4 profile pictograms resolve to dedicated `PathMap` entries and that no `PICTO_*` entry aliases to `PICTO_OBJECT`.
- README and `docs/archimate4` document the machine-readable iconography boundary exposed through `getArchimate4ImplementationStatus()`.

## Verification

- `project_memory/runlogs/20260709-583-pictogram-coverage-status-test.txt`: focused language-profile test passed with 28 tests.
- `project_memory/runlogs/20260709-584-pictogram-coverage-status-test-language.txt`: `npm run test:language` passed with 156 tests.
- `project_memory/runlogs/20260709-585-pictogram-coverage-status-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-586-pictogram-coverage-status-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-587-pictogram-coverage-status-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-588-pictogram-coverage-status-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-589-pictogram-coverage-status-repo-lint.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-592-pictogram-coverage-status-final-json-check.txt`: final JSON parse check passed after record updates.
- `project_memory/runlogs/20260709-593-pictogram-coverage-status-final-git-diff-check.txt`: final `git diff --check` passed after record updates.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

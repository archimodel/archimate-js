# Source Coverage Catalog Audit

- Date: 2026-07-09
- Loop: 106
- Goal: make ArchiMate 4 source-evidence coverage auditable by exact source identity.

## Change Summary

- Added `conformance.sourceCoverageCatalog` to `lib/metamodel/languages/archimate4-profile.json`.
- Added `sourceCoverage.expectedSourceIds`, `actualSourceIds`, `missingSourceIds`, `extraSourceIds`, `expectedCount`, and `complete` to `getArchimate4ImplementationStatus()`.
- Preserved existing `localSourceCount`, `externalSourceCount`, `missingRequiredSources`, and `missingCompanionSources` behavior.
- Updated tests and docs to require exact source-id coverage for C260, W262, launch transcript, Appendix B relationship matrix, MEFF 4.0 XSD, and Appendix A artwork-rights coverage.

## Audit Results

- Red test: `project_memory/runlogs/20260709-688-source-coverage-catalog-red-test.txt` failed as expected because `sourceCoverageCatalog` was missing.
- Focused test: `project_memory/runlogs/20260709-690-source-coverage-catalog-focused-test.txt` passed with 158 tests.
- Full language test: `project_memory/runlogs/20260709-691-source-coverage-catalog-test-language.txt` passed with 158 tests.
- Scoped ESLint: `project_memory/runlogs/20260709-692-source-coverage-catalog-eslint-registry.txt` passed.
- JSON parse: `project_memory/runlogs/20260709-695-source-coverage-catalog-json-check.txt` passed.
- Demo build: `project_memory/runlogs/20260709-696-source-coverage-catalog-demo-build.txt` passed.
- Repo-wide lint: `project_memory/runlogs/20260709-697-source-coverage-catalog-repo-lint.txt` recorded the expected legacy exit code 1 with 4383 existing errors.
- Final JSON parse: `project_memory/runlogs/20260709-698-source-coverage-catalog-final-json-check.txt` passed after state/audit updates.
- Final diff check: `project_memory/runlogs/20260709-699-source-coverage-catalog-final-diff-check.txt` passed.
- Pre-commit JSON/diff checks: `project_memory/runlogs/20260709-701-source-coverage-catalog-precommit-json-check.txt` and `project_memory/runlogs/20260709-700-source-coverage-catalog-precommit-diff-check.txt` passed.
- Runlog trim: `project_memory/runlogs/20260709-702-source-coverage-catalog-runlog-trim.txt` records whitespace normalization for the loop runlogs.

## Known Remaining External Blockers

- Official Appendix B relationship matrix data or redistribution approval is still required.
- Official MEFF 4.0 XSD is still required before official XML conformance can be claimed.
- W262 is still not present locally and remains a companion source.
- Exact Appendix A vector artwork redistribution rights remain unconfirmed.

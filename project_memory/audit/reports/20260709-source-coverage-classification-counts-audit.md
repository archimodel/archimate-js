# Audit: Source Coverage Classification Counts

- Date: 2026-07-09
- Scope: Keep ArchiMate 4 source coverage counts aligned to local, external, required, and companion classifications.
- Result: pass with external blockers

## Checks

- Added a regression test deriving local and external source ids from `sourceCoverage.items`.
- Verified `localSourceCount` and `externalSourceCount` match the derived source classifications.
- Verified `missingRequiredSources` and `missingCompanionSources` match the derived missing-source classifications.
- Verified every missing required source has an external blocker and every missing companion source remains outside required-source status.

## Evidence

- Focused test: `project_memory/runlogs/20260709-1434-source-coverage-classification-counts-focused-test.txt`
- Full language test: `project_memory/runlogs/20260709-1435-source-coverage-classification-counts-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1436-source-coverage-classification-counts-eslint-changed.txt`
- Diff check: `project_memory/runlogs/20260709-1437-source-coverage-classification-counts-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1438-source-coverage-classification-counts-repo-lint.txt`

## Notes

- `npm run test:language` passed with 214 tests.
- Changed-file ESLint passed.
- Repo-wide `npm run lint` remains the known legacy failure with 4382 existing errors outside this focused feature gate.
- Remaining blockers are external-source dependent rather than source classification count drift.

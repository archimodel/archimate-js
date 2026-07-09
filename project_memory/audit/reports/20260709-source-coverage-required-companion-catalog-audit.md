# Audit: Source Coverage Required And Companion Catalog

- Date: 2026-07-09
- Scope: Keep ArchiMate 4 required and companion source catalogs aligned to source item metadata.
- Result: pass with external blockers

## Checks

- Added a regression test deriving required and companion source ids from `sourceCoverage.items`.
- Verified `sourceCoverage.requiredSourceIds` matches all items marked `required`.
- Verified `sourceCoverage.companionSourceIds` matches all items marked `companion`.
- Verified required and companion source catalogs do not overlap.
- Verified missing required and missing companion source lists stay subsets of their matching catalogs.

## Evidence

- Focused test: `project_memory/runlogs/20260709-1440-source-coverage-required-companion-catalog-focused-test.txt`
- Full language test: `project_memory/runlogs/20260709-1441-source-coverage-required-companion-catalog-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1442-source-coverage-required-companion-catalog-eslint-changed.txt`
- Diff check: `project_memory/runlogs/20260709-1443-source-coverage-required-companion-catalog-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1444-source-coverage-required-companion-catalog-repo-lint.txt`

## Notes

- `npm run test:language` passed with 215 tests.
- Changed-file ESLint passed.
- Repo-wide `npm run lint` remains the known legacy failure with 4382 existing errors outside this focused feature gate.
- Remaining blockers are external-source dependent rather than required/companion source catalog drift.

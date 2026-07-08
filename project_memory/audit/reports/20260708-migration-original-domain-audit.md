# Audit: migration original domain retention

- Date: 2026-07-08
- Loop: 31
- Change type: feature
- Scope: ArchiMate 3.x to 4.0 migration metadata

## Result

PASS with one recorded legacy exception.

The migration utility now preserves the original ArchiMate 3.x domain for retired, merged, or moved concepts when metadata preservation is enabled. This closes the gap where migration warnings claimed original domain preservation but only original type and specialization metadata were stored.

## Evidence

- Gap reproduced: `project_memory/runlogs/20260708-208-migration-original-domain-gap-check.txt`
  - `BusinessService` migrated to `Service`.
  - `archimate-js:originalArchiMate3Domain` was absent from property definitions.
- Fix verified: `project_memory/runlogs/20260708-209-migration-original-domain-fix-check.txt`
  - `BusinessService` migrated to `Service`.
  - `originalArchiMate3Domain` was retained as `Business`.
  - `archimate-js:originalArchiMate3Domain` was stored as a model property definition and property value.
- Language tests: `project_memory/runlogs/20260708-210-migration-original-domain-npm-test-language.txt`
  - `npm run test:language` passed with 68 tests.
- Changed-file ESLint: `project_memory/runlogs/20260708-211-migration-original-domain-eslint-changed-js.txt`
  - `npx eslint` passed for the changed migration files and tests.
- Whitespace check: `project_memory/runlogs/20260708-212-migration-original-domain-git-diff-check.txt`
  - `git diff --check` passed.
- Repository-wide lint baseline: `project_memory/runlogs/20260708-213-migration-original-domain-repo-lint-legacy.txt`
  - `npm run lint` still reports the known legacy baseline of 4710 errors.
  - This is recorded by the existing `audit.lint.repo_legacy` rule and is outside this feature gate.
- Final state check: `project_memory/runlogs/20260708-214-migration-original-domain-final-state-check.txt`
  - `git diff --check` passed.
  - `aria_state.json` parsed successfully.

## Root Cause

The migration table described several merged concepts as preserving original domain intent, but the migration utility only persisted `originalArchiMate3Type` and `specialization`. Consumers could infer the domain from the old type name in many cases, but the model did not carry explicit domain metadata.

## Fix

- Added `originalDomain` to the ArchiMate 3.x to 4.0 migration entries.
- Added `ORIGINAL_ARCHIMATE3_DOMAIN_PROPERTY`.
- Persisted `element.originalArchiMate3Domain` and a model `Property` value when metadata preservation is enabled.
- Included `originalDomain` in migration warnings.
- Added tests for merged common-domain concepts and moved `Path`.

## Open Issues

- Official Appendix B relationship data still requires a licensed host-supplied artifact or redistributable derived data.
- MEFF 4.0 official XSD is still not listed in the official XSD directory as of the last recorded recheck.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

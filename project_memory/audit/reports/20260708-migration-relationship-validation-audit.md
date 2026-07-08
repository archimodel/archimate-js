# Audit: migration relationship validation

- Date: 2026-07-08
- Loop: 32
- Change type: feature
- Scope: ArchiMate 3.x to 4.0 relationship migration validation

## Result

PASS with one recorded legacy exception.

The migration utility can now validate migrated relationships against a host-supplied Appendix B-aware relationship validator. This keeps normative relationship truth outside the repository while allowing migration to warn and, by default, replace invalid relationships with `Association`.

## Evidence

- Gap reproduced: `project_memory/runlogs/20260708-215-migration-relationship-validation-gap-check.txt`
  - `BusinessRole` migrated to `Role`, but the existing `Composition` relationship remained unchanged.
  - No relationship-level migration warning was produced.
- Fix verified: `project_memory/runlogs/20260708-216-migration-relationship-validation-fix-check.txt`
  - The migrated relationship type became `Association`.
  - A relationship-level warning recorded the original type, replacement type, migrated source type, and migrated target type.
- Language tests: `project_memory/runlogs/20260708-217-migration-relationship-validation-npm-test-language.txt`
  - `npm run test:language` passed with 70 tests.
- Changed-file ESLint: `project_memory/runlogs/20260708-218-migration-relationship-validation-eslint-changed-js.txt`
  - `npx eslint` passed for the changed migration files and tests.
- Whitespace check: `project_memory/runlogs/20260708-219-migration-relationship-validation-git-diff-check.txt`
  - `git diff --check` passed.
- Repository-wide lint baseline: `project_memory/runlogs/20260708-220-migration-relationship-validation-repo-lint-legacy.txt`
  - `npm run lint` still reports the known legacy baseline of 4710 errors.
  - This is recorded by the existing `audit.lint.repo_legacy` rule and is outside this feature gate.
- Final state check: `project_memory/runlogs/20260708-221-migration-relationship-validation-final-state-check.txt`
  - `git diff --check` passed.
  - `aria_state.json` parsed successfully.

## Root Cause

`migrateArchimate3ModelTo4()` only migrated element types and metadata. It did not inspect existing relationships after endpoint element types were migrated, so a relationship that became invalid under ArchiMate 4 Appendix B rules could survive without warning.

## Fix

- Added optional `isRelationshipAllowed(sourceType, targetType, relationshipType, relationshipProfile)` validation.
- Added optional `relationshipProfile` pass-through for host-supplied Appendix B-aware validation.
- Added default invalid-relationship replacement to `Association`.
- Added `replaceInvalidRelationships: false` support for warning-only migration.
- Added tests that prove validation uses migrated endpoint types.

## Open Issues

- Official Appendix B relationship data still requires a licensed host-supplied artifact or redistributable derived data.
- MEFF 4.0 official XSD is still not listed in the official XSD directory as of the last recorded recheck.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

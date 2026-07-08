# Audit: relationship profile status actual coverage

- Date: 2026-07-08
- Loop: 30
- Change type: bugfix
- Scope: ArchiMate 4 external Appendix B relationship profile status reporting

## Result

PASS with one recorded legacy exception.

The status API now reports actual source/target-cell coverage from the supplied relationship profile instead of mirroring the requested `requireCompleteTargets` option. This makes omitted cells distinguishable from explicitly empty/disallowed cells.

## Evidence

- Gap reproduced: `project_memory/runlogs/20260708-201-relationship-profile-status-coverage-gap-check.txt`
  - The previous status path exposed `completeTargetCoverage` through an option-only expression and did not expose `targetCellCount`.
- Fix verified: `project_memory/runlogs/20260708-202-relationship-profile-status-coverage-fix-check.txt`
  - `completeTargetCoverage option-only expression: false`
  - `status exposes actual targetCellCount: true`
  - `targetCellCount: 4`
  - `expectedTargetCellCount: 4`
  - `completeTargetCoverage: true`
- Language tests: `project_memory/runlogs/20260708-203-relationship-profile-status-coverage-npm-test-language.txt`
  - `npm run test:language` passed with 66 tests.
- Changed-file ESLint: `project_memory/runlogs/20260708-204-relationship-profile-status-coverage-eslint-changed-js.txt`
  - `npx eslint` passed for the changed JavaScript test and implementation files.
- Whitespace check: `project_memory/runlogs/20260708-205-relationship-profile-status-coverage-git-diff-check.txt`
  - `git diff --check` passed.
- Repository-wide lint baseline: `project_memory/runlogs/20260708-206-relationship-profile-status-coverage-repo-lint-legacy.txt`
  - `npm run lint` still reports the known legacy baseline of 4710 errors.
  - This is recorded by the existing `audit.lint.repo_legacy` rule and is outside this feature gate.
- Final state check: `project_memory/runlogs/20260708-207-relationship-profile-status-coverage-final-state-check.txt`
  - `git diff --check` passed.
  - `aria_state.json` parsed successfully.

## Root Cause

`getArchimate4RelationshipProfileStatus()` used `RELATIONSHIP_PROFILE_OPTIONS.requireCompleteTargets` as the reported `completeTargetCoverage` value. That described the loader option selected by the caller, not the actual coverage of the supplied relationship profile.

## Fix

- Added `getRelationshipProfileCoverageStats(profile, validElementTypes)`.
- Counted explicit source/target cells independently from allowed relationship values.
- Updated ArchiMate 4 relationship profile status to expose `targetCellCount` and actual `completeSourceCoverage` / `completeTargetCoverage`.
- Added tests for complete matrix coverage and sparse object coverage.

## Open Issues

- Official Appendix B relationship data still requires a licensed host-supplied artifact or redistributable derived data.
- MEFF 4.0 official XSD is still not listed in the official XSD directory as of the last recorded recheck.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

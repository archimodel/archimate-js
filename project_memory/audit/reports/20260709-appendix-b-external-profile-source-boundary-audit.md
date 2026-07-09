# 20260709 Appendix B External Profile Source Boundary Audit

## Scope

Guard that externally loaded ArchiMate 4 relationship profile metadata remains separate from the repository's redistributable Appendix B source-coverage status.

## Change

- Added `archimate 4 external relationship profile metadata stays separate from Appendix B source coverage` to `test/relationship-rules.test.mjs`.
- The test verifies that runtime external profile metadata is surfaced and sanitized, while `sourceCoverage.items.appendixBRelationshipMatrix` still reports no local redistributable profile artifact.
- The test keeps `officialAppendixBRelationshipMatrix` tied to conformance readiness until an official or redistributable Appendix B profile is supplied.

## Evidence

- Focused test: `project_memory/runlogs/20260709-1398-appendix-b-external-profile-source-boundary-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-1399-appendix-b-external-profile-source-boundary-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1400-appendix-b-external-profile-source-boundary-eslint-changed.txt`
- Diff check: `project_memory/runlogs/20260709-1401-appendix-b-external-profile-source-boundary-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1402-appendix-b-external-profile-source-boundary-repo-lint.txt`

## Result

- PASS: focused test passed with 1 test.
- PASS: `npm run test:language` passed with 208 tests.
- PASS: changed-file ESLint passed for `test/relationship-rules.test.mjs`.
- PASS: `git diff --check` passed for the working diff at audit time.
- KNOWN FAIL: repo-wide `npm run lint` still reports the existing 4382 legacy errors outside this change.

## Remaining External Blockers

- `officialAppendixBRelationshipMatrix`
- `officialMeff4Xsd`
- `exactAppendixAArtworkRights`
- `w262CompanionPaper`

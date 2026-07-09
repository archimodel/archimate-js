# 20260709 MEFF 4 XSD 3.1 Baseline Boundary Audit

## Scope

Guard that visible ArchiMate 3.1 XSD links and the 3.1 baseline status code do not satisfy the missing official MEFF 4.0 XSD prerequisite.

## Change

- Added `archimate 4 source coverage does not treat 3.1 XSD evidence as MEFF 4 XSD` to `test/language-profile.test.mjs`.
- The test verifies the discovered official-directory XSD links are all 3.1 links and the only 200 candidate status is the 3.1 model XSD baseline.
- The test keeps `official4XsdDiscovered` false, `meff4Xsd` in missing required sources, and the XML exchange status experimental.

## Evidence

- Focused test: `project_memory/runlogs/20260709-1416-meff4-xsd-31-baseline-boundary-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-1417-meff4-xsd-31-baseline-boundary-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1418-meff4-xsd-31-baseline-boundary-eslint-changed.txt`
- Diff check: `project_memory/runlogs/20260709-1419-meff4-xsd-31-baseline-boundary-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1420-meff4-xsd-31-baseline-boundary-repo-lint.txt`

## Result

- PASS: focused test passed with 1 test.
- PASS: `npm run test:language` passed with 211 tests.
- PASS: changed-file ESLint passed for `test/language-profile.test.mjs`.
- PASS: `git diff --check` passed for the working diff at audit time.
- KNOWN FAIL: repo-wide `npm run lint` still reports the existing 4382 legacy errors outside this change.

## Remaining External Blockers

- `officialAppendixBRelationshipMatrix`
- `officialMeff4Xsd`
- `exactAppendixAArtworkRights`
- `w262CompanionPaper`

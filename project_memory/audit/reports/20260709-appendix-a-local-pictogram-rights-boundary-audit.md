# 20260709 Appendix A Local Pictogram Rights Boundary Audit

## Scope

Guard that complete local renderer pictogram coverage does not satisfy the exact Appendix A vector-artwork redistribution-rights prerequisite for official ArchiMate 4 conformance.

## Change

- Added `archimate 4 local pictogram coverage does not satisfy Appendix A artwork rights` to `test/language-profile.test.mjs`.
- The test verifies local dedicated pictogram paths and zero generic-object alias fallback remain separate from `exactAppendixAArtworkRights`.
- The test keeps the `standard-iconography` shall requirement tied to the external artwork-rights blocker until exact rights or an approved source are confirmed.

## Evidence

- Focused test: `project_memory/runlogs/20260709-1410-appendix-a-local-pictogram-rights-boundary-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-1411-appendix-a-local-pictogram-rights-boundary-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1412-appendix-a-local-pictogram-rights-boundary-eslint-changed.txt`
- Diff check: `project_memory/runlogs/20260709-1413-appendix-a-local-pictogram-rights-boundary-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1414-appendix-a-local-pictogram-rights-boundary-repo-lint.txt`

## Result

- PASS: focused test passed with 1 test.
- PASS: `npm run test:language` passed with 210 tests.
- PASS: changed-file ESLint passed for `test/language-profile.test.mjs`.
- PASS: `git diff --check` passed for the working diff at audit time.
- KNOWN FAIL: repo-wide `npm run lint` still reports the existing 4382 legacy errors outside this change.

## Remaining External Blockers

- `officialAppendixBRelationshipMatrix`
- `officialMeff4Xsd`
- `exactAppendixAArtworkRights`
- `w262CompanionPaper`

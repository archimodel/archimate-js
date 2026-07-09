# 20260709 Conformance Requirement Blocker Source Audit

## Scope

- Add a regression guard proving C260 shall requirements with external blockers map to remaining gaps and missing required source coverage.
- Keep implemented shall requirements out of the remaining-gap catalog.

## Evidence

- Focused test pass: `project_memory/runlogs/20260709-1378-conformance-requirement-blocker-source-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-1379-conformance-requirement-blocker-source-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1380-conformance-requirement-blocker-source-eslint-changed.txt`
- Diff whitespace check: `project_memory/runlogs/20260709-1381-conformance-requirement-blocker-source-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1382-conformance-requirement-blocker-source-repo-lint.txt`
- Initial staged diff check: `project_memory/runlogs/20260709-1383-conformance-requirement-blocker-source-staged-diff-check.txt`
- Final staged diff check: `project_memory/runlogs/20260709-1384-conformance-requirement-blocker-source-final-staged-diff-check.txt`

## Result

- PASS: The focused conformance requirement blocker/source test passed.
- PASS: `npm run test:language` passed with 205 tests.
- PASS: Changed-file ESLint and `git diff --check` passed.
- PASS: Final staged diff check passed after trimming a generated repo-lint runlog EOF blank line recorded by the initial staged diff check.
- KNOWN: Repo-wide `npm run lint` still reports the existing 4382 legacy errors outside this feature gate.

## Guarded Invariants

- Implemented C260 `shall` requirements must match `implementedShallCount` and must not appear as remaining gaps.
- Externally blocked C260 `shall` requirements must match `externalBlockedShallCount`.
- Every externally blocked C260 `shall` requirement must map to a remaining gap and to a missing required source coverage item with the same external blocker id.

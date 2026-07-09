# ArchiMate 4 Status Identity Array Audit

Date: 2026-07-09

## Scope

Add a regression guard proving that the machine-readable identity arrays exposed by `getArchimate4ImplementationStatus()` do not contain duplicate values.

## Changes Audited

- `test/language-profile.test.mjs`
  - Added `collectStatusIdentityArrays()`.
  - Added `collectDuplicateValues()`.
  - Added `archimate 4 implementation status identity arrays contain no duplicate values`.
  - The test recursively scans scalar status arrays whose field names end in `Ids`, `Types`, `Names`, `Sources`, `Blockers`, `Gaps`, or `Paths`, then fails if any array has duplicate values.

## Verification

- Focused test:
  - Command: `node --test --test-name-pattern "identity arrays contain no duplicate" test/language-profile.test.mjs`
  - Runlog: `project_memory/runlogs/20260709-1333-status-identity-arrays-focused-test.txt`
  - Result: pass, 1 test.
- Full language tests:
  - Command: `npm run test:language`
  - Runlog: `project_memory/runlogs/20260709-1334-status-identity-arrays-test-language.txt`
  - Result: pass, 201 tests.
- Changed-file ESLint:
  - Command: `npx eslint test\language-profile.test.mjs`
  - Runlog: `project_memory/runlogs/20260709-1335-status-identity-arrays-eslint-test.txt`
  - Result: pass.
- Diff whitespace check:
  - Command: `git diff --check`
  - Runlog: `project_memory/runlogs/20260709-1336-status-identity-arrays-diff-check.txt`
  - Result: pass.
- Status identity-array evidence:
  - Runlog: `project_memory/runlogs/20260709-1337-status-identity-arrays.json`
  - Result: 251 identity arrays, 1038 total identity values, no duplicate identity arrays.
- JSON parse check:
  - Command: `node -e "JSON.parse(require('fs').readFileSync('project_memory/runlogs/20260709-1337-status-identity-arrays.json', 'utf8'));"`
  - Runlog: `project_memory/runlogs/20260709-1339-status-identity-arrays-json-check.txt`
  - Result: pass.
- Repository-wide lint:
  - Command: `npm run lint`
  - Runlog: `project_memory/runlogs/20260709-1340-status-identity-arrays-repo-lint.txt`
  - Result: expected legacy failure, 4382 errors.
- Final staged diff check:
  - Command: `git diff --cached --check`
  - Runlog: `project_memory/runlogs/20260709-1342-status-identity-arrays-final-staged-diff-check.txt`
  - Result: pass after trimming the generated repository-lint runlog EOF blank line.

## Assessment

Pass with external blockers. The implementation-status surface now fails tests if a status identity array hides duplicate ids, types, names, source ids, blockers, gap ids, or evidence paths.

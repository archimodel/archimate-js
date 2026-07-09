# 2026-07-09 C260 Definition Vocabulary Audit

## Result

PASS for exposing the C260 Chapter 2 definition vocabulary as an exact implementation-status catalog.

## Scope

- Use the current local C260 outline extraction as the source of Chapter 2 definition headings.
- Track the 16 Chapter 2 definition terms by stable ids without copying definition prose.
- Expose expected, actual, missing, and extra definition ids through `getArchimate4ImplementationStatus()`.

## Evidence

- Source outline: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt`
  - Confirms the Chapter 2 definition headings from 2.1 through 2.16.
- Red test: `project_memory/runlogs/20260709-820-c260-definition-vocabulary-red-test.txt`
  - Failed because `definitionCoverageCatalog` was absent.
- Focused fix verification: `project_memory/runlogs/20260709-821-c260-definition-vocabulary-focused-test.txt`
  - Passed for the definition vocabulary identity test.
- Status API evidence: `project_memory/runlogs/20260709-822-c260-definition-vocabulary-status.json`
  - Reports expectedCount 16, actualCount 16, no missing definition ids, no extra definition ids, and complete true.
- Full language tests: `project_memory/runlogs/20260709-823-c260-definition-vocabulary-test-language.txt`
  - Passed with 164 tests.
- Registry scoped ESLint: `project_memory/runlogs/20260709-824-c260-definition-vocabulary-eslint-registry.txt`
  - Passed.
- JSON parse check: `project_memory/runlogs/20260709-825-c260-definition-vocabulary-json-check.txt`
  - Passed.
- Diff whitespace check: `project_memory/runlogs/20260709-826-c260-definition-vocabulary-diff-check.txt`
  - Passed.
- Demo build: `project_memory/runlogs/20260709-827-c260-definition-vocabulary-demo-build.txt`
  - Passed with webpack 5.108.4.
- Repo-wide lint: `project_memory/runlogs/20260709-828-c260-definition-vocabulary-repo-lint.txt`
  - Remains the expected legacy failure with 4382 existing errors.

## Implementation Notes

- `archimate4-profile.json` now has `definitionCoverageCatalog` and `definitionCoverage` entries for the 16 Chapter 2 definition headings.
- `getArchimate4ImplementationStatus().definitionCoverage` now exposes `expectedIds`, `actualIds`, `missingDefinitionIds`, `extraDefinitionIds`, `actualCount`, and `complete`.
- README, source ledger, implementation specification, and the implementation plan now document the exact definition-vocabulary boundary.

## Remaining External Issues

- Official Appendix B relationship matrix artifact remains external-source dependent.
- Official MEFF 4.0 XSD remains unavailable in the checked official directory.
- W262 companion paper PDF remains unavailable locally.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

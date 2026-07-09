# 2026-07-09 C260 Business Domain Coverage Audit

## Result

PASS. The ArchiMate 4 implementation status now exposes the C260 Chapter 8
Business Domain outline by exact identity, without committing copied Business
Domain prose.

## Scope

- Source outline: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt`
- Covered outline: C260 Chapter 8 sections 8.1 through 8.5, including Business
  structure metamodel, active structure, passive structure, composite elements,
  examples, and summary headings.
- Runtime status API:
  `getArchimate4ImplementationStatus().businessDomainCoverage`

## Evidence

- Red test:
  `project_memory/runlogs/20260709-910-c260-business-domain-coverage-red-test.txt`
  failed before implementation because `businessDomainCoverageCatalog` was not
  present.
- Focused test:
  `project_memory/runlogs/20260709-911-c260-business-domain-coverage-focused-test.txt`
  passed after implementation.
- Status API:
  `project_memory/runlogs/20260709-912-c260-business-domain-coverage-status.json`
  reports `expectedCount: 12`, `actualCount: 12`, empty
  `missingBusinessDomainIds`, empty `extraBusinessDomainIds`, and
  `complete: true`.
- Language test suite:
  `project_memory/runlogs/20260709-913-c260-business-domain-coverage-test-language.txt`
  passed with 171 tests.
- Changed-file ESLint:
  `project_memory/runlogs/20260709-914-c260-business-domain-coverage-eslint-changed.txt`
  passed with `EXIT_CODE=0`.
- JSON parse check:
  `project_memory/runlogs/20260709-915-c260-business-domain-coverage-json-check.txt`
  passed with `EXIT_CODE=0`.
- Diff whitespace check:
  `project_memory/runlogs/20260709-916-c260-business-domain-coverage-diff-check.txt`
  passed with `EXIT_CODE=0`.
- Registry-scoped ESLint:
  `project_memory/runlogs/20260709-917-c260-business-domain-coverage-eslint-registry-full.txt`
  passed with `EXIT_CODE=0`.
- Demo build:
  `project_memory/runlogs/20260709-918-c260-business-domain-coverage-demo-build.txt`
  passed with `EXIT_CODE=0`.
- Repository-wide lint:
  `project_memory/runlogs/20260709-919-c260-business-domain-coverage-repo-lint.txt`
  remains the expected legacy failure with 4382 existing errors and `EXIT_CODE=1`.

## Implemented Boundary

- `lib/metamodel/languages/archimate4-profile.json` records
  `businessDomainCoverageCatalog` and 12 `businessDomainCoverage` items.
- `lib/metamodel/languages/index.js` exposes expected, actual, missing, and extra
  Business Domain ids through
  `getArchimate4ImplementationStatus().businessDomainCoverage`.
- `test/language-profile.test.mjs` guards the exact catalog, item ids, section
  metadata, status API implementation, and documentation references.
- README and ArchiMate 4 docs describe the exact Chapter 8 coverage status
  fields.

## Remaining External Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed
  profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names
  still require the official XSD.
- W262 companion paper PDF is still not present locally.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed; local
  pictograms remain locally authored implementation paths.

# 2026-07-09 C260 Application Domain Coverage Audit

## Result

PASS. The ArchiMate 4 implementation status now exposes the C260 Chapter 9
Application Domain outline by exact identity, without committing copied
Application Domain prose.

## Scope

- Source outline: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt`
- Covered outline: C260 Chapter 9 sections 9.1 through 9.4, including
  Application structure metamodel, active structure, passive structure,
  examples, and summary headings.
- Runtime status API:
  `getArchimate4ImplementationStatus().applicationDomainCoverage`

## Evidence

- Red test:
  `project_memory/runlogs/20260709-923-c260-application-domain-coverage-red-test.txt`
  failed before implementation because `applicationDomainCoverageCatalog` was
  not present.
- Focused test:
  `project_memory/runlogs/20260709-924-c260-application-domain-coverage-focused-test.txt`
  passed after implementation.
- Status API:
  `project_memory/runlogs/20260709-925-c260-application-domain-coverage-status.json`
  reports `expectedCount: 9`, `actualCount: 9`, empty
  `missingApplicationDomainIds`, empty `extraApplicationDomainIds`, and
  `complete: true`.
- Language test suite:
  `project_memory/runlogs/20260709-926-c260-application-domain-coverage-test-language.txt`
  passed with 172 tests.
- Changed-file ESLint:
  `project_memory/runlogs/20260709-927-c260-application-domain-coverage-eslint-changed.txt`
  passed with `EXIT_CODE=0`.
- JSON parse check:
  `project_memory/runlogs/20260709-928-c260-application-domain-coverage-json-check.txt`
  passed with `EXIT_CODE=0`.
- Diff whitespace check:
  `project_memory/runlogs/20260709-929-c260-application-domain-coverage-diff-check.txt`
  passed with `EXIT_CODE=0`.
- Registry-scoped ESLint:
  `project_memory/runlogs/20260709-930-c260-application-domain-coverage-eslint-registry-full.txt`
  passed with `EXIT_CODE=0`.
- Demo build:
  `project_memory/runlogs/20260709-931-c260-application-domain-coverage-demo-build.txt`
  passed with `EXIT_CODE=0`.
- Repository-wide lint:
  `project_memory/runlogs/20260709-932-c260-application-domain-coverage-repo-lint.txt`
  remains the expected legacy failure with 4382 existing errors and `EXIT_CODE=1`.

## Implemented Boundary

- `lib/metamodel/languages/archimate4-profile.json` records
  `applicationDomainCoverageCatalog` and 9 `applicationDomainCoverage` items.
- `lib/metamodel/languages/index.js` exposes expected, actual, missing, and
  extra Application Domain ids through
  `getArchimate4ImplementationStatus().applicationDomainCoverage`.
- `test/language-profile.test.mjs` guards the exact catalog, item ids, section
  metadata, status API implementation, and documentation references.
- README and ArchiMate 4 docs describe the exact Chapter 9 coverage status
  fields.

## Remaining External Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed
  profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names
  still require the official XSD.
- W262 companion paper PDF is still not present locally.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed; local
  pictograms remain locally authored implementation paths.

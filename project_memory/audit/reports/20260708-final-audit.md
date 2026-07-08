# 2026-07-08 ArchiMate 4 Support Audit

## Scope

- Goal: implement ArchiMate 4 support from `docs/superpowers/plans/2026-07-08-archimate-4-support.md`.
- Branch: `codex/archimate-4-support`.
- Source boundary: C260/W262 and official MEFF 4 XSD are not present locally; 4.0 XML and relationship rules are documented as experimental fallback support.

## Implemented

- Versioned language profiles with default ArchiMate 3.x compatibility.
- `archimateVersion: '4.0'` profile selection for viewer/modeler moddle and new model templates.
- ArchiMate 4 descriptor with relationship end multiplicity fields.
- Fallback ArchiMate 4 relationship maps derived from current 3.x maps and 3.x-to-4.0 concept migrations.
- 3.x to 4.0 migration utility with warnings and specialization preservation.
- Profile-driven palette generation, Common Domain icon aliases, pictogram fallback, multiplicity rendering, menu editing, and persistence.
- README and CHANGELOG release notes.

## Verification

- `npm run test:language`: PASS, 16 tests.
  - Runlog: `project_memory/runlogs/20260708-013-post-diffcheck-npm-test-language.txt`
- Changed-file ESLint: PASS.
  - Runlog: `project_memory/runlogs/20260708-011-final-eslint-changed-files.txt`
- Repository-wide `npm run all`: FAIL, 4847 repo-wide lint errors before tests.
  - Runlog: `project_memory/runlogs/20260708-012-final-npm-run-all.txt`
  - Status: recorded as pre-existing repo-wide lint backlog outside this feature gate.

## Open Risks

- Official ArchiMate 4 conformance remains dependent on C260/W262 redistribution policy and the official MEFF 4 XSD.
- Relationship rules are compatibility-derived fallback data until an official ArchiMate 4 relationship matrix can be supplied.
- Full browser rendering smoke was not run in this turn; current tests cover profile/XML/migration/persistence wiring at file and descriptor level.

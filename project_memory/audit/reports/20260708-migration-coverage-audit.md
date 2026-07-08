# Audit: Migration coverage guard

- Scope: ArchiMate 3 profile concepts that are absent from the ArchiMate 4 catalog.
- Goal: prevent omitted ArchiMate 3 to 4 migration rows as profiles evolve.

## Source Evidence

- `project_memory/runlogs/20260708-365-migration-coverage-source-check-display-names.txt`
  - Checked the licensed C260 PDF by display-name signals without copying normative prose or tables.
- `project_memory/runlogs/20260708-366-migration-coverage-gap-check.txt`
  - Computed 24 ArchiMate 3 profile element types absent from the ArchiMate 4 element/connector catalog.
  - Result: `uncoveredMigrationRows=0`.
- `project_memory/runlogs/20260708-363-official-xsd-directory-recheck.txt`
  - Official public XSD directory still listed 3.1 resources only; no ArchiMate 4 XSD signal was discovered.

## Implementation Evidence

- `test/migration.test.mjs`
  - Adds a dynamic coverage test requiring every ArchiMate 3 profile type absent from the ArchiMate 4 catalog to have a migration row.
  - Adds a replacement-resolution test requiring default and alternative replacements to resolve to ArchiMate 4 profile types.

## Verification

- `project_memory/runlogs/20260708-371-migration-coverage-final-npm-test-language.txt`
  - Command: `npm run test:language`
  - Result: pass, 85 tests.
- `project_memory/runlogs/20260708-372-migration-coverage-final-eslint-gate.txt`
  - Command: ArchiMate 4 changed-file ESLint gate.
  - Result: pass.
- `project_memory/runlogs/20260708-373-migration-coverage-final-git-diff-check.txt`
  - Command: `git diff --check`
  - Result: pass.
- `project_memory/runlogs/20260708-374-migration-coverage-repo-lint-legacy.txt`
  - Command: `npm run lint`
  - Result: expected legacy failure, 4431 errors outside this loop's changed-file gate.

## Result

PASS. The migration table now has a regression guard against missing ArchiMate 3 to 4 migration rows
for all types currently removed or merged out of the ArchiMate 4 profile catalog.

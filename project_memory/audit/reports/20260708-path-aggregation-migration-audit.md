# Audit: Path aggregation migration correction

- date: 2026-07-08
- loop: 46
- scope: C260 Appendix E-derived relationship migration correction for `Path` aggregation.
- result: pass

## Source Evidence

- `project_memory/runlogs/20260708-349-path-aggregation-migration-source-check.txt`
  records a local C260 Appendix E vicinity keyword scan. The log stores only derived facts and does not
  copy C260 prose or table text.

## Implementation

- `lib/migration/archimate3-to-4.js` now corrects `Aggregation` relationships from `Path` to a
  technology internal active structure endpoint by replacing the relationship type with `Realization`
  and reversing the endpoints.
- The correction runs before external Appendix B relationship validation so a host-supplied validator
  sees the migrated relationship shape.
- The migration warning records the original type, replacement type, endpoint types, and that the
  relationship was reversed.

## Verification

- `project_memory/runlogs/20260708-350-path-aggregation-migration-npm-test-language.txt`
  - `npm run test:language` passed with 81 tests.
- `project_memory/runlogs/20260708-351-path-aggregation-migration-eslint-changed-js.txt`
  - Changed-file ESLint passed for the migration code and migration tests.
- `project_memory/runlogs/20260708-352-path-aggregation-migration-git-diff-check.txt`
  - `git diff --check` passed.

## Remaining Gaps

- Full Appendix B relationship matrix conformance still depends on a licensed external profile or
  confirmed redistributable derived data.
- Official MEFF 4.0 XSD details remain unavailable from the latest recorded public directory check.

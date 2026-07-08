# Audit: service realization migration warning

- date: 2026-07-08
- loop: 47
- scope: C260 Appendix E-derived warning for model-dependent cross-domain service realization migration.
- result: pass

## Source Evidence

- `project_memory/runlogs/20260708-355-service-realization-migration-source-check.txt`
  records a local C260 Appendix E vicinity keyword scan. The log stores derived facts only and does
  not copy C260 prose or tables.

## Implementation

- `lib/migration/archimate3-to-4.js` now detects `Realization` relationships between `Service`
  concepts that originated from different ArchiMate 3 domains after migration.
- The relationship is preserved because C260-derived guidance is model-dependent. The migration warning
  reports `Specialization` and `Aggregation` as alternative replacement types for the modeler to review.
- `warnServiceRealizationAlternatives: false` can suppress this warning path for host tooling that
  handles this decision separately.

## Verification

- `project_memory/runlogs/20260708-356-service-realization-migration-npm-test-language.txt`
  - `npm run test:language` passed with 83 tests.
- `project_memory/runlogs/20260708-357-service-realization-migration-eslint-changed-js.txt`
  - Changed-file ESLint passed for the migration code and migration tests.
- `project_memory/runlogs/20260708-358-service-realization-migration-git-diff-check.txt`
  - `git diff --check` passed.

## Remaining Gaps

- Full Appendix B relationship matrix conformance still depends on a licensed external profile or
  confirmed redistributable derived data.
- Official MEFF 4.0 XSD details remain unavailable from the latest recorded public directory check.

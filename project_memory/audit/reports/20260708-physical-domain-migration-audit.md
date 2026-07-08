# Audit: ArchiMate 3.x Physical domain migration guard

- Date: 2026-07-08
- Loop: 42
- Scope: ArchiMate 3.x to 4.0 migration behavior for `DistributionNetwork`, `Equipment`, `Facility`, and `Material`.

## Result

- Status: pass
- Change type: regression guard / specification alignment

## Evidence

- Gap check: `project_memory/runlogs/20260708-311-physical-domain-migration-gap-check.txt`
  - Confirmed ArchiMate 4 has no `Physical` domain profile entry.
  - Confirmed the four former Physical concepts exist as ArchiMate 4 Technology-domain concepts.
  - Confirmed migration preserves `Physical` as original-domain metadata without creating `originalArchiMate3Type` or `specialization`.
- Fix check: `project_memory/runlogs/20260708-312-physical-domain-migration-fix-check.txt`
  - Confirmed the new direct regression test covers the expected behavior.
- Language tests: `project_memory/runlogs/20260708-313-physical-domain-migration-npm-test-language.txt`
  - `npm run test:language` passed with 78 tests.
- Final language tests: `project_memory/runlogs/20260708-317-physical-domain-migration-final-npm-test-language.txt`
  - `npm run test:language` passed with 78 tests after worklog/state/audit updates.
- ArchiMate 4 ESLint gate: `project_memory/runlogs/20260708-314-physical-domain-migration-eslint-gate.txt`
  - The ArchiMate 4 implementation/test gate passed.
- Final ArchiMate 4 ESLint gate: `project_memory/runlogs/20260708-318-physical-domain-migration-final-eslint-gate.txt`
  - The ArchiMate 4 implementation/test gate passed after worklog/state/audit updates.
- Whitespace audit: `project_memory/runlogs/20260708-315-physical-domain-migration-git-diff-check.txt`
  - `git diff --check` passed.
- Final whitespace audit: `project_memory/runlogs/20260708-319-physical-domain-migration-final-git-diff-check.txt`
  - `git diff --check` passed after worklog/state/audit updates.
- Repository lint baseline: `project_memory/runlogs/20260708-316-physical-domain-migration-repo-lint-legacy.txt`
  - Repo-wide lint remains the known legacy failure outside this feature gate.

## Decision

The implementation already performed the correct migration. This loop adds direct coverage and user-facing/source documentation so the C260 physical-domain migration rule does not regress.

## Remaining External Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names still require the official XSD.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

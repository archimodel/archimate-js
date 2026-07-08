# Audit Report: Relationship Option Hydration

- Date: 2026-07-08
- Loop: 37
- Result: pass

## Scope

- Hydrated imported `Access`, `Association`, and `Influence` relationship options into explicit connection properties.
- Kept `typeOption` as a compatibility alias for existing diagram behavior.
- Updated popup active-state and renderer marker logic to prefer explicit properties and fall back to `typeOption`.
- Updated relationshipRef create/update/replace persistence paths to prefer explicit properties and fall back to `typeOption` only when the explicit property is absent.

## Source Evidence

- C260/PDF gap check: `project_memory/runlogs/20260708-257-relationship-option-hydration-gap-check.txt`
- Access wording source check: `project_memory/runlogs/20260708-258-access-type-source-check.txt`

The C260 extraction clearly identified directed association examples. Access-type wording was not reliably recovered as a standalone table term in this run, so the implementation preserves existing MEFF `accessType` values without inventing new values.

## Verification

- Initial fix check and changed-file ESLint: `project_memory/runlogs/20260708-259-relationship-option-hydration-fix-check.txt`
- Persistence fix check: `project_memory/runlogs/20260708-266-relationship-option-persistence-fix-check.txt` -> pass
- `npm run test:language`: `project_memory/runlogs/20260708-267-relationship-option-persistence-npm-test-language.txt` -> pass, 75 tests
- ArchiMate 4 gate ESLint: `project_memory/runlogs/20260708-268-relationship-option-persistence-eslint-archimate4-gate.txt` -> pass
- `git diff --check`: `project_memory/runlogs/20260708-269-relationship-option-persistence-git-diff-check.txt` -> pass
- Repository-wide lint: `project_memory/runlogs/20260708-270-relationship-option-persistence-repo-lint-legacy.txt` -> expected legacy fail, 4467 errors
- Final state trace: `project_memory/runlogs/20260708-264-relationship-option-hydration-final-state-check.txt` -> pass
- Final `git diff --check`: `project_memory/runlogs/20260708-265-relationship-option-hydration-final-git-diff-check.txt` -> pass

## Decision

This loop is accepted because the touched runtime paths now preserve explicit relationship option properties from imported and edited relationship refs, the renderer, popup, and persistence paths remain backward-compatible with `typeOption`, and the ArchiMate 4 gate remains green.

## Remaining Open Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names still require the official XSD.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

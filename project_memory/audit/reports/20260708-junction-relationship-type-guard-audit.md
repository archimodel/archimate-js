# ArchiMate 4 Junction Relationship Type Guard Audit

## Scope

- Enforce the C260-derived rule that relationships joined through a junction use the same relationship type.
- Keep the rule independent from the licensed Appendix B matrix data.
- Route popup relationship choices and reconnect validation through the junction type guard.
- Preserve the existing multiplicity guard for junction-connected relationship ends.

## Required Behavior

- A junction with no existing relationships offers the supported ArchiMate relationship types as candidates.
- A junction with one existing relationship type only allows that same type.
- A junction with conflicting existing relationship types offers no new type and rejects reconnect validation.
- Existing diagram connections use `relationshipRef.type` ahead of generic diagram connection type values.

## Evidence

- `project_memory/runlogs/20260708-072-archimate4-pdf-keyword-pages.txt`: PDF keyword page scan identified C260 junction and migration sections for this loop.
- `project_memory/runlogs/20260708-073-junction-relationship-type-guard-npm-test-language.txt`: intermediary `npm run test:language` passed with 36 tests.
- `project_memory/runlogs/20260708-075-junction-relationship-type-guard-final-npm-test-language.txt`: final `npm run test:language` passed with 37 tests.
- `project_memory/runlogs/20260708-076-junction-relationship-type-guard-final-eslint-changed-js.txt`: final changed-file ESLint passed.
- `project_memory/runlogs/20260708-077-junction-relationship-type-guard-git-diff-check.txt`: `git diff --check` passed.

## Result

pass

## Remaining Gaps

- The direct endpoint validity rule for relationship chains through a junction still depends on official Appendix B relationship data or a supplied external relationship profile.
- MEFF 4.0 XSD is still required to confirm the exchange representation of ArchiMate 4 junctions.

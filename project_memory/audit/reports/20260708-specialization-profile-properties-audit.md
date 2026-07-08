# Specialization Profile Properties Audit

## Scope

- Preserve ArchiMate 3.x modeling intent during 4.0 migration through model properties.
- Keep direct runtime fields for local consumers while adding exchange-friendly metadata through
  `PropertyDefinition` and `Properties`.
- Avoid inventing a non-standard `specialization` XML attribute while MEFF 4.0 XSD is still pending.

## Evidence

- Source check: `project_memory/runlogs/20260708-101-specialization-profile-properties-source-check.txt`
- Official 3.1 XSD status check: `project_memory/runlogs/20260708-096-official-31-xsd-specialization-check.txt`
- Official 3.1 XSD context check: `project_memory/runlogs/20260708-097-official-31-xsd-specialization-context.txt`
- Tests: `project_memory/runlogs/20260708-098-specialization-profile-properties-npm-test-language.txt`
- Changed JS lint: `project_memory/runlogs/20260708-099-specialization-profile-properties-eslint-changed-js.txt`
- Diff whitespace check: `project_memory/runlogs/20260708-100-specialization-profile-properties-git-diff-check.txt`
- Final diff and state check: `project_memory/runlogs/20260708-102-specialization-profile-properties-final-diff-state-check.txt`

## Result

Pass.

## Notes

- `migrateArchimate3ModelTo4()` now creates stable property definitions for original ArchiMate 3 type
  and specialization profile name when specialization preservation is enabled.
- Element-level properties are updated idempotently, so repeated migration calls do not duplicate
  metadata.
- `preserveSpecializations: false` skips both runtime specialization fields and property metadata.

## Remaining Gaps

- MEFF 4.0 XSD details remain unconfirmed.
- Appendix B relationship table data still requires a licensed external profile or redistribution
  decision.

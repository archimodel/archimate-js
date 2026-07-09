# Relationship Endpoint Reference Audit

## Scope

- Validate that ArchiMate relationship `source` and `target` references produce explicit diagnostics
  when present values are malformed or point to unknown model concepts.
- Preserve the existing endpoint-type and partial-editing behavior for absent endpoints and typed
  in-memory endpoint objects.
- Keep Appendix B relationship matrix data external.

## Implementation Evidence

- `validateArchimate4Model()` and `validateArchimateModel()` now report:
  - `invalid-relationship-source-reference`
  - `invalid-relationship-target-reference`
  - `unknown-relationship-source-reference`
  - `unknown-relationship-target-reference`
- `getArchimate4ImplementationStatus().modelValidation.actualCheckIds` now includes
  `relationship-endpoint-reference`.

## Verification

- Red test: `project_memory/runlogs/20260710-0316-relationship-endpoint-reference-red-test.txt`
- Focused model test: `project_memory/runlogs/20260710-0317-relationship-endpoint-reference-focused-model-test.txt`
- Status test: `project_memory/runlogs/20260710-0318-relationship-endpoint-reference-status-test.txt`
- Full model validation test: `project_memory/runlogs/20260710-0319-relationship-endpoint-reference-model-validation-test.txt`
- Changed-file ESLint: `project_memory/runlogs/20260710-0320-relationship-endpoint-reference-eslint-changed.txt`
- Status snapshot: `project_memory/runlogs/20260710-0321-relationship-endpoint-reference-status-snapshot.json`
- Language test suite: `project_memory/runlogs/20260710-0322-relationship-endpoint-reference-test-language.txt`
- Completion audit: `project_memory/runlogs/20260710-0323-relationship-endpoint-reference-completion-audit.json`
- C260 coverage audit: `project_memory/runlogs/20260710-0324-relationship-endpoint-reference-c260-coverage-audit.json`
- Final language test suite after state updates:
  `project_memory/runlogs/20260710-0329-relationship-endpoint-reference-final-test-language.txt`
- Final completion audit after state updates:
  `project_memory/runlogs/20260710-0330-relationship-endpoint-reference-final-completion-audit.json`
- Final C260 coverage audit after state updates:
  `project_memory/runlogs/20260710-0331-relationship-endpoint-reference-final-c260-coverage-audit.json`

## Result

Pass with known external blockers retained:

- Official Appendix B relationship matrix data or redistribution approval remains external-source
  dependent.
- Official MEFF 4.0 XSD remains unavailable, so XML exchange remains experimental.
- W262 companion paper is still not present locally.
- Exact Appendix A vector artwork redistribution rights remain unconfirmed.

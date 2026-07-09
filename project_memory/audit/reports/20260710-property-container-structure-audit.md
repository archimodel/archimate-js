# 2026-07-10 property container structure audit

## Scope

- Target: ArchiMate model validation for descriptor-backed `PropertyDefinitions` and `Properties` containers.
- Goal: malformed root containers must produce root-node diagnostics while malformed child lists keep their existing list diagnostics.
- External-source boundary: this change does not embed Appendix B relationship matrix data, does not claim official MEFF 4.0 XML conformance, and does not resolve Appendix A artwork redistribution rights.

## Observations

- `project_memory/runlogs/20260710-0396-property-container-structure-current-gap.txt` showed that malformed `propertyDefinitionsNode` root values were reported only as `invalid-property-definition-list`.
- The same runlog showed that malformed per-owner `propertiesNode` root values were reported only as `invalid-properties-list`.
- This made descriptor root-container errors indistinguishable from child-list errors.

## Implementation

- `validateArchimate4Model()` and `validateArchimateModel()` now report:
  - `invalid-property-definitions-node` for malformed `PropertyDefinitions` root containers.
  - `invalid-properties-node` for malformed per-owner `Properties` root containers.
- Existing diagnostics remain in place:
  - `invalid-property-definition-list` for malformed `PropertyDefinitions.propertyDefinitions`.
  - `invalid-properties-list` for malformed `Properties.properties`.
- Array shorthand for `propertyDefinitionsNode` remains accepted for existing in-memory helper compatibility.
- `getArchimate4ImplementationStatus().modelValidation` now exposes `property-container-structure`.

## Verification

- Red test: `project_memory/runlogs/20260710-0397-property-container-structure-red-test.txt`
- Focused model validation: `project_memory/runlogs/20260710-0398-property-container-structure-focused-model-test.txt`
- Focused status test: `project_memory/runlogs/20260710-0399-property-container-structure-status-test.txt`
- Full model validation: `project_memory/runlogs/20260710-0400-property-container-structure-model-validation-test.txt`
- Changed-file ESLint: `project_memory/runlogs/20260710-0401-property-container-structure-eslint-changed.txt`
- Status snapshot: `project_memory/runlogs/20260710-0402-property-container-structure-status-snapshot.json`
- Language test: `project_memory/runlogs/20260710-0403-property-container-structure-test-language.txt`
- Completion audit: `project_memory/runlogs/20260710-0404-property-container-structure-completion-audit.json`
- C260 coverage audit: `project_memory/runlogs/20260710-0405-property-container-structure-c260-coverage-audit.json`
- JSON check: `project_memory/runlogs/20260710-0406-property-container-structure-json-check.txt`
- Diff check: `project_memory/runlogs/20260710-0407-property-container-structure-diff-check.txt`
- Final language test: `project_memory/runlogs/20260710-0408-property-container-structure-final-test-language.txt`
- Final completion audit: `project_memory/runlogs/20260710-0409-property-container-structure-final-completion-audit.json`
- Final C260 coverage audit: `project_memory/runlogs/20260710-0410-property-container-structure-final-c260-coverage-audit.json`
- Precommit JSON check: `project_memory/runlogs/20260710-0411-property-container-structure-precommit-json-check.txt`
- Precommit diff check: `project_memory/runlogs/20260710-0412-property-container-structure-precommit-diff-check.txt`
- Final JSON check: `project_memory/runlogs/20260710-0413-property-container-structure-final-json-check.txt`
- Final diff check: `project_memory/runlogs/20260710-0414-property-container-structure-final-diff-check.txt`

## Result

- Pass.
- `npm run test:language` reports 270 passing tests.
- Completion audit reports `complete: true` and `failureCount: 0`.
- C260 coverage audit reports `complete: true` and `failureCount: 0`.
- Remaining open items are external-source dependent: official Appendix B relationship matrix data or redistribution approval, official MEFF 4.0 XSD, W262 companion source, and exact Appendix A artwork redistribution rights.

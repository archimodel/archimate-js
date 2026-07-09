# ArchiMate 4 Viewpoints Container Structure Audit

## Scope

- Tighten model validation for descriptor-backed `Viewpoints` containers under `Views`.
- Preserve partial in-memory editing behavior: absent `Viewpoints` data remains allowed.
- Keep external-source blockers unchanged: official Appendix B relationship matrix, official MEFF 4.0 XSD, exact Appendix A artwork rights, and W262 companion source remain unresolved.

## Observations

- `project_memory/runlogs/20260710-0415-viewpoint-container-structure-current-gap.txt` showed malformed `views.viewpointsNode` and shorthand `views.viewpoints` values could be accepted without diagnostics.
- The same gap reproduced a `TypeError` for malformed `viewpointsNode.viewpoints`, because later viewpoint indexing assumed an array.
- `project_memory/runlogs/20260710-0416-viewpoint-container-structure-red-test.txt` failed before implementation as expected.

## Implementation

- `validateArchimate4Model()` and `validateArchimateModel()` now report:
  - `invalid-viewpoints-node`
  - `invalid-viewpoint-list`
  - `invalid-viewpoint-entry`
- `getModelViewpoints()` now filters malformed entries after structure diagnostics are emitted, preventing malformed `Viewpoints` data from crashing later validation passes.
- `getArchimate4ImplementationStatus().modelValidation` now exposes `viewpoint-container-structure`.

## Verification

- Focused model validation: `project_memory/runlogs/20260710-0417-viewpoint-container-structure-focused-model-test.txt`
- Focused status test: `project_memory/runlogs/20260710-0418-viewpoint-container-structure-status-test.txt`
- Full model validation: `project_memory/runlogs/20260710-0419-viewpoint-container-structure-model-validation-test.txt`
- Changed-file ESLint: `project_memory/runlogs/20260710-0420-viewpoint-container-structure-eslint-changed.txt`
- Status snapshot: `project_memory/runlogs/20260710-0421-viewpoint-container-structure-status-snapshot.json`
- Language test suite: `project_memory/runlogs/20260710-0422-viewpoint-container-structure-test-language.txt`
- Completion audit: `project_memory/runlogs/20260710-0423-viewpoint-container-structure-completion-audit.json`
- C260 coverage audit: `project_memory/runlogs/20260710-0424-viewpoint-container-structure-c260-coverage-audit.json`
- Precommit JSON parse: `project_memory/runlogs/20260710-0430-viewpoint-container-structure-precommit-json-check.txt`
- Precommit diff check: `project_memory/runlogs/20260710-0431-viewpoint-container-structure-precommit-diff-check.txt`
- Final language test suite: `project_memory/runlogs/20260710-0427-viewpoint-container-structure-final-test-language.txt`
- Final completion audit: `project_memory/runlogs/20260710-0428-viewpoint-container-structure-final-completion-audit.json`
- Final C260 coverage audit: `project_memory/runlogs/20260710-0429-viewpoint-container-structure-final-c260-coverage-audit.json`

## Result

Pass with known external blockers retained. The completion and C260 coverage audits report `complete: true` and `failureCount: 0`.

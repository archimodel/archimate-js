# ArchiMate 4 Model Validation Viewpoint/Profile Audit

- Date: 2026-07-09
- Branch: codex/archimate-4-support
- Scope: extend model validation diagnostics to cover ArchiMate viewpoint definitions and profile attribute property values.

## Result

- PASS: `validateArchimate4Model()` now validates viewpoint purpose/content tokens, allowed element and relationship type lists, profile attribute property identity, and typed profile attribute property values.
- PASS: `getArchimate4ImplementationStatus().modelValidation` now exposes the added check ids with no missing or extra validation ids.
- PASS: external conformance blockers remain unchanged for official Appendix B matrix data, MEFF 4.0 XSD, and exact Appendix A artwork rights.

## Evidence

- Focused model validation test: `project_memory/runlogs/20260709-1097-archimate4-model-validation-viewpoint-profile-focused-test.txt`
- Status focused test: `project_memory/runlogs/20260709-1098-archimate4-model-validation-status-focused-test.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1099-archimate4-model-validation-viewpoint-profile-eslint-changed.txt`
- JSON parse check: `project_memory/runlogs/20260709-1100-archimate4-model-validation-viewpoint-profile-json-check.txt`
- Diff whitespace check: `project_memory/runlogs/20260709-1101-archimate4-model-validation-viewpoint-profile-diff-check.txt`
- Full language test: `project_memory/runlogs/20260709-1102-archimate4-model-validation-viewpoint-profile-test-language.txt`
- Completion audit: `project_memory/runlogs/20260709-1103-archimate4-model-validation-viewpoint-profile-completion-audit.json`
- C260 coverage audit: `project_memory/runlogs/20260709-1104-archimate4-model-validation-viewpoint-profile-c260-coverage-audit.json`
- Repo-wide lint baseline: `project_memory/runlogs/20260709-1105-archimate4-model-validation-viewpoint-profile-repo-lint.txt`

## Known Boundary

- `npm run lint` still fails with the existing 4382-error repository-wide legacy baseline; the changed-file ESLint gate passed.
- Official conformance still cannot be claimed until the external Appendix B relationship matrix source, official MEFF 4.0 XSD, and exact Appendix A artwork-rights source are resolved.

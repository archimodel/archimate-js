# ArchiMate 4 Model Validation Viewpoint Application Audit

- Date: 2026-07-09T23:20:00+09:00
- Scope: apply model-defined Viewpoint `allowedElementTypes` and `allowedRelationshipTypes` to actual View node and connection references.
- Result: pass

## Evidence

- Red test: `project_memory/runlogs/20260709-1141-archimate4-model-validation-viewpoint-application-red-test.txt`
  - Failed before implementation because View content outside the Viewpoint allowed type lists still produced `valid: true`.
- Focused test: `project_memory/runlogs/20260709-1143-archimate4-model-validation-viewpoint-application-focused-test.txt`
  - Passed after implementation for disallowed View content and valid allowed content.
- Status focused test: `project_memory/runlogs/20260709-1144-archimate4-model-validation-viewpoint-application-status-focused-test.txt`
  - Passed for the model validation check list and completion scan reference.
- Full model validation test: `project_memory/runlogs/20260709-1145-archimate4-model-validation-viewpoint-application-full-model-test.txt`
  - Passed 14 model validation tests.
- JSON check: `project_memory/runlogs/20260709-1146-archimate4-model-validation-viewpoint-application-json-check.txt`
  - Parsed profile, audit registry, and refreshed completion scan JSON.
- Full language tests: `project_memory/runlogs/20260709-1147-archimate4-model-validation-viewpoint-application-test-language.txt`
  - Passed 241 tests.
- Changed-file lint: `project_memory/runlogs/20260709-1148-archimate4-model-validation-viewpoint-application-eslint-changed.txt`
  - Passed with no output.
- Diff check: `project_memory/runlogs/20260709-1149-archimate4-model-validation-viewpoint-application-diff-check.txt`
  - Passed with no whitespace errors.
- Completion audit: `project_memory/runlogs/20260709-1150-archimate4-model-validation-viewpoint-application-completion-audit.json`
  - Passed with `failureCount: 0`.
- C260 coverage audit: `project_memory/runlogs/20260709-1151-archimate4-model-validation-viewpoint-application-c260-coverage-audit.json`
  - Passed with `failureCount: 0`.
- Repo-wide lint status: `project_memory/runlogs/20260709-1152-archimate4-model-validation-viewpoint-application-repo-lint.txt`
  - Still reports the known legacy repo-wide lint failure with 4382 errors; changed-file lint remains clean.
- Final post-state JSON check: `project_memory/runlogs/20260709-1153-archimate4-model-validation-viewpoint-application-post-state-json-check.txt`
  - Parsed state, audit registry, profile, and refreshed completion scan JSON.
- Final post-state diff check: `project_memory/runlogs/20260709-1154-archimate4-model-validation-viewpoint-application-post-state-diff-check.txt`
  - Passed with no whitespace errors.
- Final language tests: `project_memory/runlogs/20260709-1155-archimate4-model-validation-viewpoint-application-final-test-language.txt`
  - Passed 241 tests after state/worklog/audit updates.

## Conclusion

The validator now reports `view-node-outside-viewpoint-element-types` and
`view-connection-outside-viewpoint-relationship-types` when a View references a model-defined
Viewpoint and the View content uses element or relationship types outside that Viewpoint's allowed
type lists. The status API records this as `view-viewpoint-content-application`.

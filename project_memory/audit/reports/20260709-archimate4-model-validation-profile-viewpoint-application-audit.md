# ArchiMate 4 Model Validation Profile Viewpoint Application Audit

- Date: 2026-07-09T23:35:00+09:00
- Scope: apply active-profile Viewpoint `allowedElementTypes` and `allowedRelationshipTypes` to
  actual View node and connection references when a View names that profile Viewpoint through
  `View.viewpoint`.
- Result: pass

## Evidence

- Red test: `project_memory/runlogs/20260709-1158-archimate4-model-validation-profile-viewpoint-application-red-test.txt`
  - Failed before implementation because a View naming a profile-defined Viewpoint still produced `valid: true`.
- Focused test: `project_memory/runlogs/20260709-1159-archimate4-model-validation-profile-viewpoint-application-focused-test.txt`
  - Passed after implementation for profile-defined Viewpoint application and unknown metadata-only `View.viewpoint` names.
- Completion scan: `project_memory/runlogs/20260709-1160-status-completion-api-scan.json`
  - Records `view-profile-viewpoint-content-application` in `modelValidation`.
- Status focused test: `project_memory/runlogs/20260709-1161-archimate4-model-validation-profile-viewpoint-application-status-focused-test.txt`
  - Passed for the model validation check list and completion scan reference.
- Changed-file lint: `project_memory/runlogs/20260709-1162-archimate4-model-validation-profile-viewpoint-application-eslint-changed.txt`
  - Passed with no output.
- Full model validation test: `project_memory/runlogs/20260709-1163-archimate4-model-validation-profile-viewpoint-application-full-model-test.txt`
  - Passed 16 model validation tests.
- JSON check: `project_memory/runlogs/20260709-1164-archimate4-model-validation-profile-viewpoint-application-json-check.txt`
  - Parsed profile, audit registry, and refreshed completion scan JSON.
- Diff check: `project_memory/runlogs/20260709-1165-archimate4-model-validation-profile-viewpoint-application-diff-check.txt`
  - Passed with no whitespace errors.
- Completion audit: `project_memory/runlogs/20260709-1166-archimate4-model-validation-profile-viewpoint-application-completion-audit.json`
  - Passed with `failureCount: 0`.
- C260 coverage audit: `project_memory/runlogs/20260709-1167-archimate4-model-validation-profile-viewpoint-application-c260-coverage-audit.json`
  - Passed with `failureCount: 0`.
- Full language tests: `project_memory/runlogs/20260709-1168-archimate4-model-validation-profile-viewpoint-application-test-language.txt`
  - Passed 243 tests.
- Repo-wide lint status: `project_memory/runlogs/20260709-1169-archimate4-model-validation-profile-viewpoint-application-repo-lint.txt`
  - Still reports the known legacy repo-wide lint failure with 4382 errors; changed-file lint remains clean.

## Conclusion

The validator now applies Viewpoint allowed type lists from both model-defined `viewpointRef`
definitions and active-profile Viewpoints named by `View.viewpoint`. Unknown `View.viewpoint` values
remain retained metadata rather than validation errors.

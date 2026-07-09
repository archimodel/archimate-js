# Relationship Profile Default Reset Audit

- Date: 2026-07-09
- Scope: verify that constructor-supplied ArchiMate 4 Appendix B relationship profiles cannot leak into a later default ArchiMate 4 viewer/modeler, while preserving explicit process-wide profile setup.
- Result: pass with Appendix B relationship matrix data still externally supplied.

## Evidence

- Focused relationship-rules test: `project_memory/runlogs/20260709-1229-relationship-profile-default-reset-focused-test.txt`.
  - Viewer-scoped profiles loaded with `setArchimate4RelationshipProfileForViewer()` report `sourceScope: viewer-constructor`.
  - `resetArchimate4RelationshipProfileIfViewerScoped()` returns viewer-scoped profiles to `compatibility-fallback`.
  - Profiles loaded through public `setArchimate4RelationshipProfile(profile)` report `sourceScope: global` and survive the viewer-scoped reset check.
- Full language test: `project_memory/runlogs/20260709-1230-relationship-profile-default-reset-test-language.txt`.
- Changed-file ESLint: `project_memory/runlogs/20260709-1231-relationship-profile-default-reset-eslint-changed.txt`.
- JSON parse check: `project_memory/runlogs/20260709-1232-relationship-profile-default-reset-json-check.txt`.
- Diff check: `project_memory/runlogs/20260709-1233-relationship-profile-default-reset-diff-check.txt`.
- Demo build: `project_memory/runlogs/20260709-1234-relationship-profile-default-reset-demo-build.txt`.
- Status evidence: `project_memory/runlogs/20260709-1236-relationship-profile-default-reset-status.json`.
- Final staged diff check: `project_memory/runlogs/20260709-1242-relationship-profile-default-reset-final-staged-diff-check.txt`.
- Repo-wide lint: `project_memory/runlogs/20260709-1235-relationship-profile-default-reset-repo-lint.txt`.
  - This remains the known legacy failure with 4382 existing errors.

## Conclusion

The ArchiMate 4 relationship profile lifecycle now distinguishes default fallback, constructor-scoped external profiles, and explicit process-wide external profiles. A default 4.0 viewer/modeler no longer inherits the previous constructor-provided licensed Appendix B profile by accident.

# Relationship Profile Source Metadata Audit

- Date: 2026-07-09
- Scope: make externally supplied ArchiMate 4 Appendix B relationship profiles auditable without embedding the licensed table data.
- Result: pass with Appendix B relationship matrix data still externally supplied.

## Evidence

- Focused relationship-profile test: `project_memory/runlogs/20260709-1213-relationship-profile-source-metadata-focused-test.txt`.
  - `setArchimate4RelationshipProfile()` accepts scalar source metadata from profile JSON and load options.
  - `getArchimate4RelationshipProfileStatus()` exposes cloned `sourceMetadata` and `hasSourceMetadata`.
  - Nested metadata objects are ignored so licensed table text cannot leak through status output.
  - Resetting the profile clears the metadata and restores the compatibility fallback status.
- Full language test: `project_memory/runlogs/20260709-1214-relationship-profile-source-metadata-test-language.txt`.
- Changed-file ESLint: `project_memory/runlogs/20260709-1215-relationship-profile-source-metadata-eslint-changed.txt`.
- JSON parse check: `project_memory/runlogs/20260709-1216-relationship-profile-source-metadata-json-check.txt`.
- Diff check: `project_memory/runlogs/20260709-1217-relationship-profile-source-metadata-diff-check.txt`.
- Demo build: `project_memory/runlogs/20260709-1218-relationship-profile-source-metadata-demo-build.txt`.
- Repo-wide lint: `project_memory/runlogs/20260709-1219-relationship-profile-source-metadata-repo-lint.txt`.
  - This remains the known legacy failure with 4382 existing errors.
- Final staged diff check: `project_memory/runlogs/20260709-1220-relationship-profile-source-metadata-staged-diff-check.txt`.

## Conclusion

The Appendix B external profile path now preserves audit metadata for the loaded host-controlled artifact while keeping the normative relationship matrix outside the repository.

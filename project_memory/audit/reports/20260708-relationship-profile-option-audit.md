# Relationship Profile Option Audit

- Date: 2026-07-08
- Loop: 7
- Scope: Supplying a licensed ArchiMate 4 Appendix B relationship profile during Modeler/Viewer construction.

## Commands

- `npm run test:language`
  - Logs:
    - `project_memory/runlogs/20260708-050-relationship-profile-option-npm-test-language.txt`
    - `project_memory/runlogs/20260708-053-relationship-profile-option-final-npm-test-language.txt`
  - Result: pass, 30 tests
- `npx eslint ... test/*.test.mjs`
  - Logs:
    - `project_memory/runlogs/20260708-051-relationship-profile-option-eslint-changed-js.txt`
    - `project_memory/runlogs/20260708-052-relationship-profile-option-eslint-changed-js.txt`
  - Result: final pass after BaseViewer legacy lint fixes
- `git diff --check`
  - Log: `project_memory/runlogs/20260708-054-relationship-profile-option-git-diff-check.txt`
  - Result: pass

## Assertions Covered

- `BaseViewer` accepts `archimate4RelationshipProfile` and calls `setArchimate4RelationshipProfile`.
- `BaseViewer` rejects that option unless `archimateVersion` normalizes to `4.0`.
- README documents constructor-time Appendix B relationship profile loading.
- The changed-file lint gate now includes `lib/BaseViewer.js`.

## Remaining Issues

- The actual Appendix B matrix still requires a licensed profile artifact or redistributable
  non-verbatim derived data.
- MEFF 4.0 XSD details are still unavailable from the checked public XSD directory.

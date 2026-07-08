# ArchiMate 4 Relationship Profile JSON String Audit

## Scope

- Allow a licensed ArchiMate 4 Appendix B relationship profile to be supplied as JSON text.
- Keep file-system access outside the browser-oriented package.
- Preserve existing object, Map, and row-array profile inputs.

## Required Behavior

- `normalizeRelationshipProfile()` parses JSON string profiles before validation.
- Invalid JSON text fails with a clear ArchiMate 4 relationship profile error.
- Parsed profiles still use the existing element and relationship-code validation path.
- README and ArchiMate 4 source/spec docs describe object and JSON string inputs.

## Evidence

- `project_memory/runlogs/20260708-081-archimate-xsd-directory-current.html`: current official XSD directory snapshot.
- `project_memory/runlogs/20260708-084-archimate-xsd-current-head-check.txt`: checked candidate MEFF 4.0 XSD paths returned 404.
- `project_memory/runlogs/20260708-082-relationship-profile-json-string-npm-test-language.txt`: `npm run test:language` passed with 42 tests.
- `project_memory/runlogs/20260708-083-relationship-profile-json-string-eslint-changed-js.txt`: changed-file ESLint passed.
- `project_memory/runlogs/20260708-085-relationship-profile-json-string-git-diff-check.txt`: `git diff --check` passed.

## Result

pass

## Remaining Gaps

- Official Appendix B relationship data is still not redistributed in this MIT package.
- MEFF 4.0 XSD is still unavailable from the checked public paths.

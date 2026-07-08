# Profile-Aware Relationship Rules Audit

## Scope

- Ensure editing constraints use the active ArchiMate language profile, not only popup menu display.
- Route `connection.create` and `connection.reconnect` checks through `languageProfile`.
- Keep the existing ArchiMate 3.x default behavior by using the profile-aware relationship lookup.

## Required Behavior

- `ArchimateRules` receives the `languageProfile` service through dependency injection.
- `connection.reconnect` calls `isRelationshipAllowed(source, target, relationship, profile)`.
- External ArchiMate 4 Appendix B profiles loaded at construction time affect reconnect validation.

## Evidence

- `project_memory/runlogs/20260708-059-pdf-outline-keyword-scan.txt`: C260 Appendix B and relationship table locations were confirmed from the supplied PDF.
- `project_memory/runlogs/20260708-060-profile-aware-rules-npm-test-language.txt`: `npm run test:language` passed with 32 tests.
- `project_memory/runlogs/20260708-061-profile-aware-rules-eslint-changed-js.txt`: first changed-file ESLint run failed after adding `ArchimateRules.js` to the lint gate and exposed pre-existing style issues.
- `project_memory/runlogs/20260708-062-profile-aware-rules-eslint-changed-js.txt`: changed-file ESLint passed after formatting the touched file.
- `project_memory/runlogs/20260708-063-profile-aware-rules-git-diff-check.txt`: `git diff --check` passed.
- `project_memory/runlogs/20260708-064-profile-aware-rules-final-git-diff-check.txt`: final post-log `git diff --check` passed.

## Result

pass

## Remaining Gaps

- Appendix B relationship matrix data still requires a licensed artifact or redistributable derived profile.
- MEFF 4.0 XSD is still required before XML namespace, junction serialization, and multiplicity attribute names can be final.

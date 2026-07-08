# Relationship Profile Status Metadata Audit

- Date: 2026-07-08
- Loop: 20
- Scope: observable ArchiMate 4 Appendix B relationship profile completeness status.

## Source Trace

- Previous loops established that the official Appendix B relationship matrix must remain external unless a licensed or redistributable derived artifact is supplied.
- This loop does not add normative relationship table contents; it exposes whether the active profile is the compatibility fallback or an external profile loaded with complete source and target-cell validation.

## Checks

| Check | Command | Evidence | Result |
| --- | --- | --- | --- |
| Language tests | `npm run test:language` | `project_memory/runlogs/20260708-128-relationship-profile-status-metadata-npm-test-language.txt` | pass, 55 tests |
| Changed JS lint | `npx eslint lib\metamodel\languages\archimate4-relationships.js test\relationship-rules.test.mjs` | `project_memory/runlogs/20260708-129-relationship-profile-status-metadata-eslint-changed-js.txt` | pass |
| Whitespace diff check | `git diff --check` | `project_memory/runlogs/20260708-130-relationship-profile-status-metadata-git-diff-check.txt` | pass |
| Repo-wide legacy lint status | `npm run lint` | `project_memory/runlogs/20260708-131-relationship-profile-status-metadata-repo-lint-legacy.txt` | expected legacy failure, exit code 1 |
| Final state check | `git diff --check` plus state JSON parse | `project_memory/runlogs/20260708-132-relationship-profile-status-metadata-final-state-check.txt` | pass |

## Decision

- `getArchimate4RelationshipProfileStatus()` now reports the accepted concept count, expected complete source-target cell count, profile load options, and complete coverage booleans.
- Host applications can use the status result to verify that official Appendix B replacement data was loaded externally with complete source and target-cell validation.
- Full official Appendix B relationship contents and MEFF 4.0 XSD details remain open external-source items.

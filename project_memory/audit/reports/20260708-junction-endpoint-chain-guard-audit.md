# ArchiMate 4 Junction Endpoint Chain Guard Audit

## Scope

- Enforce the C260-derived rule that a chain through a junction is valid only when the direct relationship of the same type is valid between the endpoint concepts.
- Use the active relationship profile instead of embedding Appendix B relationship tables.
- Keep the guard compatible with externally supplied ArchiMate 4 relationship profiles.

## Required Behavior

- For an incoming candidate connection to a junction, compare the candidate source concept against each existing outgoing endpoint concept.
- For an outgoing candidate connection from a junction, compare each existing incoming endpoint concept against the candidate target concept.
- Evaluate the direct endpoint pair with the same relationship type through the active `isRelationshipAllowed(..., profile)` path.
- Preserve the same-type junction guard and mixed-type rejection.

## Evidence

- `project_memory/runlogs/20260708-078-junction-endpoint-chain-guard-npm-test-language.txt`: `npm run test:language` passed with 40 tests.
- `project_memory/runlogs/20260708-079-junction-endpoint-chain-guard-eslint-changed-js.txt`: changed-file ESLint passed.
- `project_memory/runlogs/20260708-080-junction-endpoint-chain-guard-git-diff-check.txt`: `git diff --check` passed.

## Result

pass

## Remaining Gaps

- Final relationship truth still depends on official Appendix B data or an externally supplied profile.
- MEFF 4.0 XSD is still required to confirm exchange serialization details.

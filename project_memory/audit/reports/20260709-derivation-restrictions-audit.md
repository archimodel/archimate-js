# 20260709 derivation restrictions audit

## Scope

- Add a C260 Appendix B.4 restriction guard to derived and potential relationship helper output.
- Preserve existing ArchiMate 3.x and untyped host-callable derivation behavior.
- Keep Appendix B relationship table data external; this change implements only the non-table restriction layer for candidates already derived by DR/PDR helpers.

## Source Evidence

- C260 outline/gap scan: `project_memory/runlogs/20260709-263-c260-outline-gap-scan.txt`
- C260 B.4 restriction signal scan: `project_memory/runlogs/20260709-264-c260-derivation-restrictions-scan.txt`
- Derived facts used: B.4 restrictions apply after DR/PDR candidate derivation and constrain candidates by source/target domains, Relationship-domain endpoints, passive structure endpoints, Access/Influence targets, and the joined third element.

## Red Test

- Log: `project_memory/runlogs/20260709-265-derivation-restrictions-red-test.txt`
- Result: fail, expected. `deriveRelationship()` and `derivePotentialRelationship()` returned candidates that the new B.4 restriction tests expected to reject.

## Implementation

- `lib/util/DerivedRelationshipUtil.js` now normalizes derivation options and applies restrictions when an ArchiMate 4 profile is supplied.
- Endpoint classification uses profile concept metadata: Common/Business/Application/Technology collapse to Core, relationship types/connectors map to Relationships, and passive structure is read from the concept aspect.
- The guard leaves unprofiled derivation calls unchanged because endpoint domains/aspects cannot be proven.
- `test/derived-relationships.test.mjs` covers source-target restrictions, third-element restrictions, Relationship-domain restrictions, passive/access/influence restrictions, and potential relationship restriction filtering.

## Verification

- PASS: `npm run test:language` in `project_memory/runlogs/20260709-266-derivation-restrictions-test-language.txt` passed with 130 tests.
- PASS: registry scoped ESLint in `project_memory/runlogs/20260709-267-derivation-restrictions-eslint-registry.txt` exited 0.
- PASS: `npm run demo:build` in `project_memory/runlogs/20260709-268-derivation-restrictions-demo-build.txt` exited 0.
- PASS: JSON check in `project_memory/runlogs/20260709-269-derivation-restrictions-json-check.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260709-270-derivation-restrictions-git-diff-check.txt` exited 0 with only the existing line-ending warning for `project_memory/state/aria_state.json`.
- EXPECTED LEGACY FAIL: repository-wide `npm run lint` in `project_memory/runlogs/20260709-271-derivation-restrictions-repo-lint-legacy.txt` exited 1 with the known 4413 existing errors.

## Decision

Pass for the scoped Appendix B.4 derivation restriction guard.

Remaining blockers are unchanged: official Appendix B relationship matrix data, MEFF 4.0 XSD availability, W262 PDF local availability, and exact Appendix A vector artwork redistribution.

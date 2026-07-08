# 20260709 profile attribute property audit

## Scope

- Add host-callable persistence helpers for implementation-defined ArchiMate profile attribute values.
- Store values through the existing model `PropertyDefinition` / `Properties` structure instead of adding non-standard element fields.
- Preserve ArchiMate 3.x migration behavior by moving its existing property-writing helper to a shared utility.

## Source Evidence

- C260 local PDF scan: `project_memory/runlogs/20260709-233-c260-profile-attribute-property-scan.txt`
- Derived facts used: Chapter 14 contains profile attribute customization signals, and the local MEFF model already carries property definitions plus per-concept properties suitable for implementation-defined attribute values.

## Red Test

- Command: `npm run test:language`
- Log: `project_memory/runlogs/20260709-234-profile-attribute-property-red-test.txt`
- Result: fail, expected. `getProfileAttributePropertyValue()` and `setProfileAttributePropertyValue()` were missing.

## Implementation

- Added `lib/util/ModelPropertyUtil.js` for reusable model `PropertyDefinition` / `Properties` writes and reads.
- Added profile attribute property helpers in `lib/util/ProfileAttributeUtil.js`: property naming, serialization, parsing, set, and get.
- Reused `setModelProperty()` in `lib/migration/archimate3-to-4.js` so migration metadata keeps the same behavior through the shared property path.
- Exported the new helpers through `lib/metamodel/languages/index.js` and the package entrypoint.
- Updated README, `docs/archimate4`, and the scoped ESLint audit registry.

## Verification

- PASS: source scan in `project_memory/runlogs/20260709-233-c260-profile-attribute-property-scan.txt` exited 0.
- PASS: `npm run test:language` in `project_memory/runlogs/20260709-236-profile-attribute-property-test-language.txt` passed with 123 tests.
- PASS: registry scoped ESLint in `project_memory/runlogs/20260709-237-profile-attribute-property-eslint-registry.txt` exited 0.
- PASS: `npm run demo:build` in `project_memory/runlogs/20260709-238-profile-attribute-property-demo-build.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260709-239-profile-attribute-property-git-diff-check.txt` exited 0.
- PASS: JSON check in `project_memory/runlogs/20260709-240-profile-attribute-property-json-check.txt` exited 0.
- EXPECTED LEGACY FAIL: repository-wide `npm run lint` in `project_memory/runlogs/20260709-241-profile-attribute-property-repo-lint-legacy.txt` exited 1 with the known 4413 existing errors.
- PASS: final state and audit registry JSON check in `project_memory/runlogs/20260709-242-profile-attribute-property-state-json-check.txt` exited 0.
- PASS: final `git diff --check` in `project_memory/runlogs/20260709-243-profile-attribute-property-final-git-diff-check.txt` exited 0 with only the existing line-ending warning for `project_memory/state/aria_state.json`.

## Result

Pass for the scoped ArchiMate 4 profile attribute property-persistence gate.

Remaining blockers are unchanged: official Appendix B data redistribution, MEFF 4.0 XSD availability, W262 PDF local availability, and exact Appendix A vector artwork redistribution.

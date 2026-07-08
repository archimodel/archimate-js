# 20260709 profile attribute value audit

## Scope

- Add host-callable value normalization and validation for implementation-defined ArchiMate profile attributes.
- Keep typed profile attribute support aligned with the C260 Chapter 14 language customization mechanism without embedding normative prose.
- Preserve ArchiMate 3.x behavior and keep the feature opt-in through language profile metadata.

## Source Evidence

- C260 local PDF scan: `project_memory/runlogs/20260709-221-c260-profile-attribute-value-scan.txt`
- Derived facts used: Chapter 14 includes adding attributes, profile attributes are coupled to concepts, and observed basic type signals include String, Integer, Real, Boolean, Currency, Date, URL, Time, and Structure.

## Red Test

- Command: `npm run test:language`
- Log: `project_memory/runlogs/20260709-222-profile-attribute-value-red-test.txt`
- Result: fail, expected. `ProfileAttributeUtil` and `getProfileAttributesForConcept()` were missing.

## Implementation

- Added `lib/util/ProfileAttributeUtil.js` with `PROFILE_ATTRIBUTE_TYPES`, `normalizeProfileAttributeValue()`, and `isProfileAttributeValueValid()`.
- `lib/metamodel/languages/index.js` now reuses the shared type list and exposes `getProfileAttributesForConcept()`, including specialization lineage for concepts and relationships.
- `index.js` exports the host-callable profile attribute helpers.
- README and `docs/archimate4` document the supported value validation boundary.
- `project_memory/audit/audit_registry.json` now includes the new profile attribute utility in the scoped ESLint gate.

## Verification

- PASS: `npm run test:language` in `project_memory/runlogs/20260709-223-profile-attribute-value-test-language.txt` passed with 121 tests.
- PASS: registry scoped ESLint in `project_memory/runlogs/20260709-224-profile-attribute-value-eslint-registry.txt` exited 0.
- PASS: `npm run demo:build` in `project_memory/runlogs/20260709-225-profile-attribute-value-demo-build.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260709-226-profile-attribute-value-git-diff-check.txt` exited 0.
- PASS: JSON check in `project_memory/runlogs/20260709-227-profile-attribute-value-json-check.txt` exited 0.
- EXPECTED LEGACY FAIL: repository-wide `npm run lint` in `project_memory/runlogs/20260709-228-profile-attribute-value-repo-lint-legacy.txt` exited 1 with the known 4413 existing errors.
- PASS: final state and audit registry JSON check in `project_memory/runlogs/20260709-229-profile-attribute-value-state-json-check.txt` exited 0.
- PASS: final `git diff --check` in `project_memory/runlogs/20260709-230-profile-attribute-value-final-git-diff-check.txt` exited 0.
- PASS: post-record `git diff --check` in `project_memory/runlogs/20260709-231-profile-attribute-value-post-record-git-diff-check.txt` exited 0.

## Result

Pass for the scoped ArchiMate 4 profile attribute value-validation gate.

Remaining blockers are unchanged: official Appendix B data redistribution, MEFF 4.0 XSD availability, W262 PDF local availability, and exact Appendix A vector artwork redistribution.

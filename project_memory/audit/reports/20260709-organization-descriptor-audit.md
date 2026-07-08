# 20260709 organization descriptor audit

## Scope

- Close the moddle descriptor gap where `Model.organizationsNode` referenced `Organizations` but no descriptor type defined it.
- Preserve the current ArchiMate 3.x descriptor behavior while adding the same missing type definitions to the current, 3.x, and 4.0 descriptors.
- Keep ArchiMate 4 XML exchange marked experimental until the official MEFF 4.0 XSD confirms exact element naming.

## Source Evidence

- C260 gap scan: `project_memory/runlogs/20260709-246-c260-gap-scan.txt`
- Public ArchiMate 3.1 Model/View XSD check: `project_memory/runlogs/20260709-247-official-xsd-organization-source-check.txt`
- Derived facts used: model organization support exists in the source material, the public 3.1 schema has nested organization items and identifier references, and the local descriptors already exposed `organizationsNode` without its target type.

## Red Test

- Command: `npm run test:language`
- Log: `project_memory/runlogs/20260709-248-organization-descriptor-red-test.txt`
- Result: fail, expected. Descriptor type-reference validation found `Model.organizationsNode -> Organizations`, and organization tree parsing failed.

## Implementation

- Added `Organizations` and recursive `Organization` types to `lib/moddle/resources/archimate.json`, `archimate3.json`, and `archimate4.json`.
- `Organization` now has inherited name/documentation support, nested organization entries, and an optional concept `identifierRef`.
- Added descriptor-wide unresolved complex-type reference checks and ArchiMate 4 organization-tree XML parsing tests.
- Updated README and `docs/archimate4` to describe organization tree retention and the MEFF 4.0 XSD boundary.

## Verification

- PASS: `npm run test:language` in `project_memory/runlogs/20260709-250-organization-descriptor-test-language.txt` passed with 126 tests.
- PASS: registry scoped ESLint in `project_memory/runlogs/20260709-251-organization-descriptor-eslint-registry.txt` exited 0.
- PASS: `npm run demo:build` in `project_memory/runlogs/20260709-252-organization-descriptor-demo-build.txt` exited 0.
- PASS: descriptor/state/audit JSON parse in `project_memory/runlogs/20260709-253-organization-descriptor-json-check.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260709-255-organization-descriptor-git-diff-check-pass.txt` exited 0 after removing one trailing whitespace line.
- EXPECTED LEGACY FAIL: repository-wide `npm run lint` in `project_memory/runlogs/20260709-256-organization-descriptor-repo-lint-legacy.txt` exited 1 with the known 4413 existing errors.
- PASS: final descriptor/state/audit JSON parse in `project_memory/runlogs/20260709-257-organization-descriptor-final-json-check.txt` exited 0.
- PASS: final `git diff --check` in `project_memory/runlogs/20260709-258-organization-descriptor-final-git-diff-check.txt` exited 0 with only the existing line-ending warning for `project_memory/state/aria_state.json`.
- PASS: post-record JSON check in `project_memory/runlogs/20260709-259-organization-descriptor-post-record-json-check.txt` exited 0.
- PASS: post-record `git diff --check` in `project_memory/runlogs/20260709-260-organization-descriptor-post-record-git-diff-check.txt` exited 0 with only the existing line-ending warning for `project_memory/state/aria_state.json`.

## Result

Pass for the scoped ArchiMate organization descriptor gate.

Remaining blockers are unchanged: official Appendix B data redistribution, MEFF 4.0 XSD availability, W262 PDF local availability, and exact Appendix A vector artwork redistribution.

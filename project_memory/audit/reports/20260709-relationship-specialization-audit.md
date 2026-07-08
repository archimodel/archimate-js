# Relationship Specialization Customization Audit - 2026-07-09

## Scope

- Goal: continue aligning ArchiMate 4 support with the licensed C260 book without embedding copyrighted relationship tables.
- Feature: language customization for relationship specializations and junction same-type resolution.
- Files: `lib/metamodel/languages/index.js`, `lib/util/RelationshipUtil.js`, `lib/util/JunctionUtil.js`, `test/language-profile.test.mjs`, `docs/archimate4/*`.

## Result

PASS.

The implementation now accepts custom relationship objects with `specializes`, resolves those custom relationships to their standard base relationship for relationship validation, and applies the same base-type resolution when checking relationship type consistency through junctions.

## Evidence

- `project_memory/runlogs/20260709-032-c260-customization-specialization-scan.txt`
  - Local C260 scan found Chapter 14 language customization and specializations of relationships and junctions.
- `project_memory/runlogs/20260709-033-relationship-specialization-red-test.txt`
  - Red test failed before implementation because the source ledger and code did not expose relationship specialization support.
- `project_memory/runlogs/20260709-035-relationship-specialization-test-language.txt`
  - `npm run test:language` passed with 94 tests after implementation.
- `project_memory/runlogs/20260709-036-relationship-specialization-eslint-changed.txt`
  - Changed-file ESLint passed.
- `project_memory/runlogs/20260709-037-relationship-specialization-git-diff-check.txt`
  - `git diff --check` passed.
- `project_memory/runlogs/20260709-038-relationship-specialization-demo-build.txt`
  - `npm run demo:build` passed.
- `project_memory/runlogs/20260709-039-official-xsd-directory-recheck.txt`
  - Official XSD directory still listed only 3.1 XSD links; tested 4.0 candidate URLs returned 404.
- `project_memory/runlogs/20260709-040-relationship-specialization-final-test-language.txt`
  - Final `npm run test:language` passed with 94 tests.
- `project_memory/runlogs/20260709-041-relationship-specialization-eslint-registry-gate.txt`
  - Registry ESLint gate passed.
- `project_memory/runlogs/20260709-042-relationship-specialization-state-json-check.txt`
  - `aria_state.json` parsed successfully.
- `project_memory/runlogs/20260709-043-relationship-specialization-final-git-diff-check.txt`
  - Final `git diff --check` passed.
- `project_memory/runlogs/20260709-044-relationship-specialization-repo-lint-legacy.txt`
  - Repository-wide `npm run lint` remains the known legacy failure with 4413 existing errors.
- `project_memory/runlogs/20260709-045-relationship-specialization-final-final-git-diff-check.txt`
  - Final record `git diff --check` passed.
- `project_memory/runlogs/20260709-046-relationship-specialization-final-state-json-check.txt`
  - Final record `aria_state.json` parse check passed.

## Implementation Notes

- Custom relationship strings remain accepted for backwards compatibility.
- Custom relationship objects are validated more strictly: an object must have `type`, and custom objects must declare `specializes`.
- Unknown base relationships are rejected during language profile customization.
- Appendix B relationship legality remains driven by the active standard relationship profile; custom relationship specializations inherit their base relationship legality instead of requiring copied matrix rows.

## Residual Risk

- The full Appendix B matrix is still not embedded because redistribution rights are not confirmed.
- MEFF 4.0 XML details remain experimental until an official 4.0 XSD is available or supplied.
- W262 is still not present in this workspace.

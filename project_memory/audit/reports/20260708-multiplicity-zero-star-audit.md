# Audit: multiplicity zero-star alias

- Date: 2026-07-08
- Loop: 33
- Change type: feature
- Scope: ArchiMate 4 relationship-end multiplicity normalization

## Result

PASS with one recorded legacy exception.

The relationship multiplicity normalizer now accepts `0..*` as an input alias for the canonical `*` value. Non-zero unbounded ranges such as `1..*` and `2..*` remain rejected.

## Evidence

- Source and gap check: `project_memory/runlogs/20260708-222-multiplicity-zero-star-gap-check.txt`
  - The supplied C260 PDF was checked for derived multiplicity facts.
  - Before the fix, `normalizeRelationshipMultiplicity('0..*')` returned an empty value.
- Fix check: `project_memory/runlogs/20260708-223-multiplicity-zero-star-fix-check.txt`
  - `0..*` is valid and normalizes to `*`.
  - `1..*` and `2..*` remain invalid.
- Language tests: `project_memory/runlogs/20260708-224-multiplicity-zero-star-npm-test-language.txt`
  - `npm run test:language` passed with 70 tests.
- Changed-file ESLint: `project_memory/runlogs/20260708-225-multiplicity-zero-star-eslint-changed-js.txt`
  - `npx eslint` passed for the changed multiplicity utility and test.
- Whitespace check: `project_memory/runlogs/20260708-226-multiplicity-zero-star-git-diff-check.txt`
  - `git diff --check` passed.
- Repository-wide lint baseline: `project_memory/runlogs/20260708-227-multiplicity-zero-star-repo-lint-legacy.txt`
  - `npm run lint` still reports the known legacy baseline of 4710 errors.
  - This is recorded by the existing `audit.lint.repo_legacy` rule and is outside this feature gate.
- Final state check: `project_memory/runlogs/20260708-228-multiplicity-zero-star-final-state-check.txt`
  - `git diff --check` passed.
  - `aria_state.json` parsed successfully.

## Root Cause

The previous C260-derived multiplicity guard accepted the canonical `*` notation but dropped `0..*`, even though the specification uses `0..*` to explain the zero-to-unbounded semantics of `*`.

## Fix

- `normalizeRelationshipMultiplicity('0..*')` now returns `*`.
- `isValidRelationshipMultiplicity('0..*')` now returns true.
- Tests and documentation now distinguish the accepted zero-to-unbounded alias from rejected non-zero unbounded range forms.

## Open Issues

- Official Appendix B relationship data still requires a licensed host-supplied artifact or redistributable derived data.
- MEFF 4.0 official XSD is still not listed in the official XSD directory as of the last recorded recheck.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

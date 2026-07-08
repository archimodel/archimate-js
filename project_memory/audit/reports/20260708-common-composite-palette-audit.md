# Audit Report: Common Composite Palette Exposure

- Date: 2026-07-08
- Loop: 38
- Result: pass

## Scope

- Expose ArchiMate 4 Common composite elements `Grouping` and `Location` in the 4.0 palette.
- Keep ArchiMate 3.x profile palette exclusions unchanged.
- Add palette icon CSS aliases for `archimate-common-grouping` and `archimate-common-location`.

## Source Evidence

- Gap check: `project_memory/runlogs/20260708-275-common-composite-palette-gap-check.txt`
- C260-derived local spec already classifies `Grouping` and `Location` as Common composite elements in the 42-element catalog.
- MEFF 4.0 XSD recheck remains unresolved: `project_memory/runlogs/20260708-274-meff4-xsd-current-recheck.txt`
- Multiplicity unbounded-range check did not justify expanding notation: `project_memory/runlogs/20260708-273-multiplicity-unbounded-range-source-check.txt`

## Verification

- Fix check: `project_memory/runlogs/20260708-276-common-composite-palette-fix-check.txt` -> pass
- `npm run test:language`: `project_memory/runlogs/20260708-277-common-composite-palette-npm-test-language.txt` -> pass, 76 tests
- ArchiMate 4 gate ESLint: `project_memory/runlogs/20260708-278-common-composite-palette-eslint-archimate4-gate.txt` -> pass
- `git diff --check`: `project_memory/runlogs/20260708-279-common-composite-palette-git-diff-check.txt` -> pass
- Repository-wide lint: `project_memory/runlogs/20260708-280-common-composite-palette-repo-lint-legacy.txt` -> expected legacy fail, 4467 errors
- Final state trace: `project_memory/runlogs/20260708-281-common-composite-palette-final-state-check.txt` -> pass
- Final `git diff --check`: `project_memory/runlogs/20260708-282-common-composite-palette-final-git-diff-check.txt` -> pass

## Decision

This loop is accepted because the active ArchiMate 4 profile no longer hides standard elements from the palette, every standard profile element has a palette CSS rule, and the ArchiMate 4 test and lint gates are green.

## Remaining Open Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names still require the official XSD.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

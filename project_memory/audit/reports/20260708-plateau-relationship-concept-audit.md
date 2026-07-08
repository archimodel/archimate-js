# Audit: Plateau relationship-concept aggregation guard

- Scope: C260 Appendix B.6-derived relationship-concept aggregation helper.
- Goal: Include `Plateau` in the narrow derived `Aggregation` helper that already covers `Grouping`
  and `Location`, without embedding the licensed Appendix B table.

## Source Evidence

- `project_memory/runlogs/20260708-379-plateau-relationship-concept-source-check.txt`
  - Checked local licensed C260 PDF keyword co-occurrence for `Plateau`, `Aggregation`, relationship,
    and junction context.
  - No normative prose or Appendix B table data was copied.

## Implementation Evidence

- `lib/util/JunctionUtil.js`
  - Adds `IMP_MIG_PLATEAU` to `RELATIONSHIP_CONCEPT_AGGREGATORS`.
- `test/multiplicity.test.mjs`
  - Updates the relationship-concept aggregation test so `Plateau` can aggregate an `AndJunction`
    relationship connector in ArchiMate 4 mode.
- `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `README.md`
  - Record that the narrow helper now covers `Grouping`, `Location`, and `Plateau`.

## Verification

- `project_memory/runlogs/20260708-384-plateau-relationship-concept-final-npm-test-language.txt`
  - Command: `npm run test:language`
  - Result: pass, 85 tests.
- `project_memory/runlogs/20260708-385-plateau-relationship-concept-final-eslint-gate.txt`
  - Command: ArchiMate 4 changed-file ESLint gate.
  - Result: pass.
- `project_memory/runlogs/20260708-386-plateau-relationship-concept-final-git-diff-check.txt`
  - Command: `git diff --check`
  - Result: pass.
- `project_memory/runlogs/20260708-387-plateau-relationship-concept-repo-lint-legacy.txt`
  - Command: `npm run lint`
  - Result: expected legacy failure, 4431 errors outside this loop's changed-file gate.

## Result

PASS. The implemented Appendix B.6-derived helper now includes `Plateau` while the full Appendix B
matrix remains external-profile driven.

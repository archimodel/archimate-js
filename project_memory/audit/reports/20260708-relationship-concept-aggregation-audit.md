# Relationship Concept Aggregation Audit

## Scope

- Implement the narrow C260 Appendix B.6 derived rule that ArchiMate 4 `Grouping` and `Location`
  can aggregate relationship concepts.
- Keep the full Appendix B.6 relationship table external/profile-driven.
- Do not broaden `Plateau` behavior beyond what is currently represented by the external profile path.

## Evidence

- Source check: `project_memory/runlogs/20260708-094-appendix-b6-relationship-concept-aggregation-source-check.txt`
- Tests: `project_memory/runlogs/20260708-091-relationship-concept-aggregation-npm-test-language.txt`
- Changed JS lint: `project_memory/runlogs/20260708-092-relationship-concept-aggregation-eslint-changed-js.txt`
- Diff whitespace check: `project_memory/runlogs/20260708-093-relationship-concept-aggregation-git-diff-check.txt`
- Final diff and state check: `project_memory/runlogs/20260708-095-relationship-concept-aggregation-final-diff-state-check.txt`

## Result

Pass.

## Notes

- `JunctionUtil` now exposes a profile-gated helper for ArchiMate 4 relationship-concept aggregation.
- `ArchimateRules` uses the helper during create and reconnect validation.
- `ConnectionMenuProvider` uses the helper when computing relationship type choices.
- Tests verify `Grouping` and `Location` can aggregate relationship concepts in ArchiMate 4 mode, while
  non-4.0 profiles, non-aggregator sources, normal target elements, and `Plateau` remain outside this
  helper.

## Remaining Gaps

- The rest of Appendix B.6 still depends on the external Appendix B relationship profile path.
- MEFF 4.0 XSD details remain unconfirmed.

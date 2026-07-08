# Relationship Specialization Editor Behavior Audit

- Date: 2026-07-09
- Loop: 56
- Result: PASS

## Scope

- Custom ArchiMate relationship specializations supplied through `archimateLanguageProfile`.
- Editor relationship option menu candidates.
- Base relationship behavior inheritance for rendering, option hydration, option persistence, and option toggles.

## Evidence

- Source scan: `project_memory/runlogs/20260709-049-c260-relationship-specialization-menu-source-scan.txt`
- Initial test run: `project_memory/runlogs/20260709-047-relationship-specialization-menu-test-language.txt`
- Passing test run: `project_memory/runlogs/20260709-053-relationship-specialization-menu-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-054-relationship-specialization-menu-eslint-changed.txt`
- Demo build: `project_memory/runlogs/20260709-055-relationship-specialization-menu-demo-build.txt`
- Diff whitespace check: `project_memory/runlogs/20260709-056-relationship-specialization-menu-git-diff-check.txt`
- Final test run: `project_memory/runlogs/20260709-057-relationship-specialization-menu-final-test-language.txt`
- Final registry ESLint gate: `project_memory/runlogs/20260709-058-relationship-specialization-menu-final-eslint-registry-gate.txt`
- Final state JSON parse: `project_memory/runlogs/20260709-059-relationship-specialization-menu-state-json-check.txt`
- Final diff whitespace check: `project_memory/runlogs/20260709-060-relationship-specialization-menu-final-git-diff-check.txt`
- Repository lint legacy record: `project_memory/runlogs/20260709-061-relationship-specialization-menu-repo-lint-legacy.txt`
- Final record state JSON parse: `project_memory/runlogs/20260709-062-relationship-specialization-menu-final-state-json-check.txt`
- Final record diff whitespace check: `project_memory/runlogs/20260709-063-relationship-specialization-menu-final-final-git-diff-check.txt`

## Findings

- `getRelationshipsAllowed()` now expands allowed base relationships into custom specializations from the active language profile.
- `ConnectionOptions` now builds menu entries for specialized relationships by using profile relationship metadata and the base relationship menu icon/shape when no custom class is supplied.
- Access, Association, and Influence option actions preserve the current relationship type instead of replacing a custom specialization with the base relationship type.
- Element import/hydration, connection persistence, replacement, and rendering now resolve custom relationship types to their standard base relationship before applying base-specific behavior.

## Remaining Risks

- Exact Appendix B table data remains external-profile driven because the licensed table is not committed.
- Official MEFF 4.0 XSD details remain unresolved until The Open Group publishes or supplies the schema.

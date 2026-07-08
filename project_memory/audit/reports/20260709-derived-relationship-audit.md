# Derived Relationship Rules Audit

- Date: 2026-07-09
- Loop: 59
- Result: PASS

## Scope

- Host-callable derived relationship helpers for C260 Appendix B DR1 and DR2.
- No automatic model mutation and no embedded Appendix B relationship matrix.

## Evidence

- Source scan: `project_memory/runlogs/20260709-088-c260-derived-relationship-source-scan.txt`
- Initial failing test run: `project_memory/runlogs/20260709-089-derived-relationship-test-language.txt`
- Initial changed-file ESLint: `project_memory/runlogs/20260709-090-derived-relationship-eslint-changed.txt`
- Initial diff whitespace check: `project_memory/runlogs/20260709-091-derived-relationship-git-diff-check.txt`
- Intermediate failing test run: `project_memory/runlogs/20260709-092-derived-relationship-test-language-pass.txt`
- Intermediate changed-file ESLint: `project_memory/runlogs/20260709-093-derived-relationship-eslint-changed-pass.txt`
- Intermediate diff whitespace check: `project_memory/runlogs/20260709-094-derived-relationship-git-diff-check-pass.txt`
- Passing test run: `project_memory/runlogs/20260709-095-derived-relationship-test-language-pass2.txt`
- Passing changed-file ESLint: `project_memory/runlogs/20260709-096-derived-relationship-eslint-changed-pass2.txt`
- Passing diff whitespace check: `project_memory/runlogs/20260709-097-derived-relationship-git-diff-check-pass2.txt`
- Demo build: `project_memory/runlogs/20260709-098-derived-relationship-demo-build.txt`
- Final test run: `project_memory/runlogs/20260709-099-derived-relationship-final-test-language.txt`
- Final registry scoped ESLint: `project_memory/runlogs/20260709-100-derived-relationship-final-eslint-registry-gate.txt`
- State JSON parse check: `project_memory/runlogs/20260709-101-derived-relationship-state-json-check.txt`
- Final diff whitespace check: `project_memory/runlogs/20260709-102-derived-relationship-final-git-diff-check.txt`
- Known repository-wide lint status: `project_memory/runlogs/20260709-103-derived-relationship-repo-lint-legacy.txt`
- Final state JSON parse check: `project_memory/runlogs/20260709-104-derived-relationship-final-state-json-check.txt`
- Final record diff whitespace check: `project_memory/runlogs/20260709-105-derived-relationship-final-final-git-diff-check.txt`

## Findings

- `deriveRelationshipType()` implements DR1 specialization transitivity.
- `deriveRelationshipType()` implements DR2 structural derivation by returning the weakest relationship in a two-step structural chain.
- The implemented structural strength order is Realization, Assignment, Aggregation, Composition from weakest to strongest.
- `deriveRelationship()` preserves the first relationship source and second relationship target when the two relationships form a valid chain.
- Custom relationship specializations supplied in a profile resolve to their base relationship before derivation.
- The helpers return candidate derivation data for host tooling and do not automatically mutate models.
- Repository-wide lint remains a known legacy failure with 4413 existing errors; the scoped ArchiMate 4 registry ESLint gate passed for the touched implementation files.

## Remaining Risks

- Full Appendix B allowed-relationship matrix data remains external-profile driven until licensed redistributable data or a host-supplied profile is available.
- MEFF 4.0 XML details remain experimental until an official 4.0 XSD is available or supplied.

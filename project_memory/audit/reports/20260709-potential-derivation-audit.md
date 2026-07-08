# Potential Derivation Rules Audit

- Date: 2026-07-09
- Loop: 61
- Result: PASS

## Scope

- Host-callable potential derived relationship helpers for C260 Appendix B PDR1 through PDR12.
- Explicit candidate generation only; no automatic model mutation.
- PDR12 Grouping rule guarded by an external relationship validator.
- No embedded Appendix B relationship matrix.

## Evidence

- Source scan: `project_memory/runlogs/20260709-121-c260-potential-derivation-source-scan.txt`
- Detail scan: `project_memory/runlogs/20260709-122-c260-potential-derivation-detail-scan.txt`
- Dependency strength scan: `project_memory/runlogs/20260709-123-c260-dependency-strength-source-scan.txt`
- Red test run: `project_memory/runlogs/20260709-124-potential-derivation-red-test.txt`
- Passing test run: `project_memory/runlogs/20260709-126-potential-derivation-test-language-pass.txt`
- Passing scoped ESLint: `project_memory/runlogs/20260709-127-potential-derivation-eslint-changed.txt`
- Passing diff whitespace check: `project_memory/runlogs/20260709-128-potential-derivation-git-diff-check.txt`
- Non-verbatim source summary: `project_memory/runlogs/20260709-129-c260-potential-derivation-implementation-summary.txt`
- Final test run: `project_memory/runlogs/20260709-130-potential-derivation-final-test-language.txt`
- Final registry scoped ESLint: `project_memory/runlogs/20260709-131-potential-derivation-final-eslint-registry-gate.txt`
- Demo build: `project_memory/runlogs/20260709-132-potential-derivation-demo-build.txt`
- Final diff whitespace check: `project_memory/runlogs/20260709-133-potential-derivation-final-git-diff-check.txt`
- Known repository-wide lint status: `project_memory/runlogs/20260709-134-potential-derivation-repo-lint-legacy.txt`
- Final state JSON parse check: `project_memory/runlogs/20260709-135-potential-derivation-state-json-check.txt`
- Final record diff whitespace check: `project_memory/runlogs/20260709-136-potential-derivation-final-final-git-diff-check.txt`
- Post-record state JSON parse check: `project_memory/runlogs/20260709-137-potential-derivation-post-record-state-json-check.txt`
- Post-record diff whitespace check: `project_memory/runlogs/20260709-138-potential-derivation-post-record-git-diff-check.txt`

## Findings

- `derivePotentialRelationship()` returns explicit `potential: true` candidates for PDR1 through PDR12.
- Dependency relationship strength follows Association, Influence, Access, Serving from weakest to strongest.
- Specialization transfer candidates cover outgoing, incoming, source-outgoing, and source-incoming endpoint patterns.
- Structural/dependency and dynamic potential candidates cover the C260 endpoint patterns tested in `test/derived-relationships.test.mjs`.
- PDR12 returns no candidate unless `isRelationshipAllowed(sourceType, targetType, relationshipType, profile)` allows the derived endpoint pair.
- Repository-wide lint remains a known legacy failure with 4413 existing errors; the scoped ArchiMate 4 registry ESLint gate passed for the touched implementation files.

## Remaining Risks

- The full Appendix B allowed-relationship matrix data remains external-profile driven until licensed redistributable data or a host-supplied profile is available.
- MEFF 4.0 XML details remain experimental until an official 4.0 XSD is available or supplied.

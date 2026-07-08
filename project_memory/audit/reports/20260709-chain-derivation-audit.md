# Chain Derivation Rules Audit

- Date: 2026-07-09
- Loop: 62
- Result: PASS

## Scope

- Host-callable valid in-line derived relationship chain helper for C260 Appendix B.
- No automatic model mutation and no generic graph search.
- Opposite-direction pair rules and potential derivation rules remain explicit pair/candidate helpers.

## Evidence

- Source scan: `project_memory/runlogs/20260709-139-c260-chain-derivation-source-scan.txt`
- Red test run: `project_memory/runlogs/20260709-140-chain-derivation-red-test.txt`
- Passing test run: `project_memory/runlogs/20260709-141-chain-derivation-test-language.txt`
- Passing scoped ESLint: `project_memory/runlogs/20260709-142-chain-derivation-eslint-changed.txt`
- Passing diff whitespace check: `project_memory/runlogs/20260709-143-chain-derivation-git-diff-check.txt`
- Non-verbatim source summary: `project_memory/runlogs/20260709-144-c260-chain-derivation-implementation-summary.txt`
- Final test run: `project_memory/runlogs/20260709-145-chain-derivation-final-test-language.txt`
- Final registry scoped ESLint: `project_memory/runlogs/20260709-146-chain-derivation-final-eslint-registry-gate.txt`
- Demo build: `project_memory/runlogs/20260709-147-chain-derivation-demo-build.txt`
- Final diff whitespace check: `project_memory/runlogs/20260709-148-chain-derivation-final-git-diff-check.txt`
- Known repository-wide lint status: `project_memory/runlogs/20260709-149-chain-derivation-repo-lint-legacy.txt`
- Final state JSON parse check: `project_memory/runlogs/20260709-150-chain-derivation-state-json-check.txt`
- Final record diff whitespace check: `project_memory/runlogs/20260709-151-chain-derivation-final-final-git-diff-check.txt`
- Post-record state JSON parse check: `project_memory/runlogs/20260709-152-chain-derivation-post-record-state-json-check.txt`
- Post-record diff whitespace check: `project_memory/runlogs/20260709-153-chain-derivation-post-record-git-diff-check.txt`

## Findings

- `deriveRelationshipChain()` folds ordered in-line valid derivation chains by repeatedly applying the pair derivation rules.
- Structural chains collapse to the weakest structural relationship across the outer endpoints.
- Dependency/dynamic derivations can be transferred through structural chains when each intermediate pair is derivable.
- Triggering chains preserve Triggering derivation through structural and Triggering steps.
- The helper preserves all original relationship ids in `derivedFrom` and pairwise rule labels in `derivationRules`.
- Repository-wide lint remains a known legacy failure with 4413 existing errors; the scoped ArchiMate 4 registry ESLint gate passed for the touched implementation files.

## Remaining Risks

- The full Appendix B allowed-relationship matrix data remains external-profile driven until licensed redistributable data or a host-supplied profile is available.
- MEFF 4.0 XML details remain experimental until an official 4.0 XSD is available or supplied.

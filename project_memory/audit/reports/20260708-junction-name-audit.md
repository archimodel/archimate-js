# Audit Report: Junction Name Rendering

- Date: 2026-07-08
- Loop: 35
- Result: pass

## Scope

- Implemented C260-derived optional name rendering for `AndJunction` and `OrJunction`.
- Kept the existing `AND` / `OR` marker visible inside the connector.
- Rendered only a separate modeler-supplied label below the connector, suppressing duplicate marker/type names.

## Evidence

- Source and gap check: `project_memory/runlogs/20260708-236-junction-name-gap-check.txt`
- Fix check: `project_memory/runlogs/20260708-237-junction-name-fix-check.txt`
- Language tests: `project_memory/runlogs/20260708-238-junction-name-npm-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260708-239-junction-name-eslint-changed-js.txt`
- Diff whitespace check: `project_memory/runlogs/20260708-240-junction-name-git-diff-check.txt`
- Repo-wide legacy lint record: `project_memory/runlogs/20260708-241-junction-name-repo-lint-legacy.txt`

## Commands

- `npm run test:language` -> pass, 73 tests
- `npx eslint lib\draw\ArchimateRenderer.js test\relationship-rules.test.mjs` -> pass
- `git diff --check` -> pass
- `npm run lint` -> expected legacy fail, 4710 errors outside this feature gate

## Decision

This loop is accepted because the renderer behavior is guarded by tests, touched JavaScript passes ESLint, and the only failing audit is the known repository-wide legacy lint backlog already recorded in prior loops.

## Remaining Open Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names still require the official XSD.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

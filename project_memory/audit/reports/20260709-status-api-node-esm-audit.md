# 2026-07-09 Status API Node ESM Audit

## Result

PASS for the scoped ArchiMate 4 status API boundary.

## Scope

- `getArchimate4ImplementationStatus()` must be directly importable from `lib/metamodel/languages/index.js` in Node ESM audit tooling.
- The browser/webpack package root remains the application entry point and is not claimed as a Node-only API boundary.
- Existing ArchiMate 3.x behavior remains preserved.

## Evidence

- Red test: `project_memory/runlogs/20260709-791-status-api-node-esm-red-test.txt`
  - Failed because Node ESM required JSON import attributes for `archimate3-profile.json`.
- Focused fix verification: `project_memory/runlogs/20260709-792-status-api-node-esm-focused-test.txt`
  - Passed the direct Node ESM import test for `lib/metamodel/languages/index.js`.
- Full language tests: `project_memory/runlogs/20260709-793-status-api-node-esm-test-language.txt`
  - Passed with 163 tests.
- Registry scoped ESLint: `project_memory/runlogs/20260709-794-status-api-node-esm-eslint-registry.txt`
  - Passed.
- Relationship map syntax lint: `project_memory/runlogs/20260709-794b-status-api-node-esm-relationship-map-eslint.txt`
  - Passed with the legacy generated map indentation rule disabled; this keeps the audit focused on the import syntax touched in those maps without reformatting generated legacy content.
- JSON parse check: `project_memory/runlogs/20260709-795-status-api-node-esm-json-check.txt`
  - Passed.
- Diff whitespace check: `project_memory/runlogs/20260709-796-status-api-node-esm-diff-check.txt`
  - Passed.
- Demo build: `project_memory/runlogs/20260709-797-status-api-node-esm-demo-build.txt`
  - Passed with webpack 5.108.4.
- Repo-wide lint: `project_memory/runlogs/20260709-798-status-api-node-esm-repo-lint.txt`
  - Remains the expected legacy failure with 4382 existing errors.

## Implementation Notes

- JSON profile imports in the language status path now use import attributes.
- Relative source imports on the status API dependency path now include explicit `.js` specifiers for Node ESM resolution.
- The legacy relationship map files were not broadly reformatted; only import specifiers and one touched-file trailing blank line were adjusted.
- README and the ArchiMate 4 source ledger now state that Node audit tooling should import the status API from `lib/metamodel/languages/index.js`, while the package root remains the browser/webpack-oriented entry point.

## Remaining External Issues

- Official Appendix B relationship matrix artifact remains external-source dependent.
- Official MEFF 4.0 XSD remains unavailable in the checked official directory.
- W262 companion paper PDF remains unavailable locally.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

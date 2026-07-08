# Audit: Nested View Node Import

- Date: 2026-07-09
- Loop: 75
- Scope: C260-derived view nesting notation preservation during graphical view import.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-297-c260-nesting-notation-source-scan.txt` records a non-verbatim C260 Chapter 3.7 nesting/visual notation keyword scan.

## Red Test

- `project_memory/runlogs/20260709-298-nested-node-import-red-test.txt` failed because nested `Node` view elements were still added to the root shape and linked through `shape.host`.

## Implementation

- `lib/import/Importer.js` now passes the current parent shape to `ArchimateImporter.addElement()` for each nested view node.
- The obsolete root-shape plus `shape.host` recursion path was removed, so nested view `Node` elements become diagram parent-child shapes.
- `test/importer.test.mjs` guards the importer source contract for the parent-shape recursion boundary.
- README and `docs/archimate4` now describe the view nesting preservation behavior and keep relationship semantics explicit.
- `project_memory/audit/audit_registry.json` now includes `lib/import/Importer.js` in the scoped ESLint command.

## Verification

- `project_memory/runlogs/20260709-299-nested-node-import-test.txt`: focused importer test passed.
- `project_memory/runlogs/20260709-300-nested-node-import-test-language.txt`: `npm run test:language` passed with 133 tests.
- `project_memory/runlogs/20260709-302-nested-node-import-eslint-importer-pass.txt`: focused Importer/test ESLint passed after indentation cleanup.
- `project_memory/runlogs/20260709-303-nested-node-import-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-304-nested-node-import-json-check.txt`: JSON parse checks passed.
- `project_memory/runlogs/20260709-305-nested-node-import-git-diff-check.txt`: `git diff --check` passed.
- `project_memory/runlogs/20260709-308-nested-node-import-eslint-registry-updated.txt`: updated registry scoped ESLint passed with `lib/import/Importer.js` included.
- `project_memory/runlogs/20260709-307-nested-node-import-repo-lint-legacy.txt`: repo-wide lint remains the known legacy failure with 4413 errors.
- `project_memory/runlogs/20260709-309-nested-node-import-final-json-check.txt`: final JSON parse checks passed after state/worklog/audit updates.
- `project_memory/runlogs/20260709-310-nested-node-import-final-git-diff-check.txt`: final `git diff --check` passed.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

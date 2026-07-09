# ArchiMate 4 Model Validation: View Node Geometry

- Date: 2026-07-10
- Scope: validate present view `Node` geometry values (`x`, `y`, `w`, `h`) from the diagram surface.
- Result: pass

## Change

- Added diagnostics for invalid view node geometry values:
  - `invalid-view-node-x`
  - `invalid-view-node-y`
  - `invalid-view-node-width`
  - `invalid-view-node-height`
- Kept partial editor compatibility: missing geometry remains tolerated for in-memory editing, while present `x` and `y` values must be finite non-negative numbers and present `w` and `h` values must be finite positive numbers.
- Added `view-node-geometry` to ArchiMate 4 model-validation status coverage.
- Refreshed implementation completion scan evidence to `project_memory/runlogs/20260710-0080-status-completion-api-scan.json`.

## Source Basis

- Official public ArchiMate 3.1 Diagram XSD source check: `project_memory/runlogs/20260710-0077-official-diagram-geometry-source-check.txt`
- The public 3.1 Diagram XSD exposes node `x` and `y` as non-negative coordinates and `w` and `h` as positive dimensions.
- The local ArchiMate 4 descriptor exposes `Node` geometry as `x:Real`, `y:Real`, `w:Real`, and `h:Real`; therefore this implementation validates finite numeric values and range constraints without imposing integer-only values until the official MEFF 4.0 XSD is available.

## Evidence

- Red test: `project_memory/runlogs/20260710-0078-archimate4-model-validation-view-node-geometry-red-test.txt`
- Focused geometry test: `project_memory/runlogs/20260710-0079-archimate4-model-validation-view-node-geometry-focused-test.txt`
- Status focused test: `project_memory/runlogs/20260710-0081-archimate4-model-validation-view-node-geometry-status-focused-test.txt`
- Full model validation: `project_memory/runlogs/20260710-0082-archimate4-model-validation-view-node-geometry-full-model-test.txt` (`26` tests, `26` pass)
- JSON parse check: `project_memory/runlogs/20260710-0083-archimate4-model-validation-view-node-geometry-json-check.txt`
- Changed-file ESLint: `project_memory/runlogs/20260710-0084-archimate4-model-validation-view-node-geometry-eslint-changed.txt`
- Diff whitespace check: `project_memory/runlogs/20260710-0085-archimate4-model-validation-view-node-geometry-diff-check.txt`
- Full language suite: `project_memory/runlogs/20260710-0086-archimate4-model-validation-view-node-geometry-test-language.txt` (`253` tests, `253` pass)
- Completion audit: `project_memory/runlogs/20260710-0087-archimate4-model-validation-view-node-geometry-completion-audit.json` (`failures: []`)
- C260 coverage audit: `project_memory/runlogs/20260710-0088-archimate4-model-validation-view-node-geometry-c260-coverage-audit.json` (`failures: []`)
- Repo-wide lint baseline: `project_memory/runlogs/20260710-0089-archimate4-model-validation-view-node-geometry-repo-lint.txt` remains the known legacy baseline with `4382` errors; changed-file ESLint is clean.
- State update: `project_memory/runlogs/20260710-0090-archimate4-model-validation-view-node-geometry-state-update.txt`
- Post-state JSON parse: `project_memory/runlogs/20260710-0091-archimate4-model-validation-view-node-geometry-post-state-json-check.txt`
- Post-state diff whitespace check: `project_memory/runlogs/20260710-0092-archimate4-model-validation-view-node-geometry-post-state-diff-check.txt`
- Final language suite: `project_memory/runlogs/20260710-0093-archimate4-model-validation-view-node-geometry-final-test-language.txt` (`253` tests, `253` pass)
- Runlog trim: `project_memory/runlogs/20260710-0094-archimate4-model-validation-view-node-geometry-trim-runlogs.txt`
- Final JSON parse: `project_memory/runlogs/20260710-0095-archimate4-model-validation-view-node-geometry-final-json-check.txt`
- Final diff whitespace check: `project_memory/runlogs/20260710-0096-archimate4-model-validation-view-node-geometry-final-diff-check.txt`

## External Boundary

- Official Appendix B relationship matrix data remains externally supplied.
- Official MEFF 4.0 XSD remains unavailable from the checked Open Group XSD directory.
- Exact Appendix A artwork redistribution rights remain unconfirmed.
- W262 remains a companion-source gap, not an official conformance blocker.

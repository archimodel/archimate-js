# ArchiMate 4 Model Validation: View Connection Waypoint Geometry

- Date: 2026-07-10
- Scope: validate view `Connection` waypoint point coordinates (`x`, `y`) and optional `original` point coordinates.
- Result: pass

## Change

- Added diagnostics for invalid view connection waypoint geometry values:
  - `invalid-view-connection-waypoint-x`
  - `invalid-view-connection-waypoint-y`
- Added structural diagnostics for malformed waypoint containers:
  - `invalid-view-connection-waypoints-node`
  - `invalid-view-connection-waypoint-list`
  - `invalid-view-connection-waypoint-entry`
  - `invalid-view-connection-waypoint-original`
- Kept partial editor compatibility: absent `waypointsNode` and absent `waypointsNode.waypoints` remain tolerated, while present waypoint points must contain finite non-negative integer `x` and `y` values.
- Added `view-connection-waypoint-geometry` to ArchiMate 4 model-validation status coverage.
- Refreshed implementation completion scan evidence to `project_memory/runlogs/20260710-0102-status-completion-api-scan.json`.

## Source Basis

- Official public ArchiMate 3.1 Diagram XSD waypoint source check: `project_memory/runlogs/20260710-0099-official-diagram-waypoint-source-check.txt`
- The public 3.1 Diagram XSD exposes connection `bendpoint` entries as `LocationType`, using required non-negative `x` and `y` coordinates through `LocationGroup`.
- The local ArchiMate 4 descriptor exposes `Connection.waypointsNode: Waypoints`, `Waypoints.waypoints: Waypoint[]`, `Waypoint.original: Point`, and `Point.x/y: Integer`; therefore this implementation validates present waypoint point coordinates as finite non-negative integers while keeping official MEFF 4.0 XSD conformance external.

## Evidence

- Source check: `project_memory/runlogs/20260710-0099-official-diagram-waypoint-source-check.txt`
- Red test: `project_memory/runlogs/20260710-0100-archimate4-model-validation-view-connection-waypoint-geometry-red-test.txt`
- Focused waypoint geometry test: `project_memory/runlogs/20260710-0101-archimate4-model-validation-view-connection-waypoint-geometry-focused-test.txt`
- Completion scan: `project_memory/runlogs/20260710-0102-status-completion-api-scan.json`
- Status focused test, first run: `project_memory/runlogs/20260710-0103-archimate4-model-validation-view-connection-waypoint-geometry-status-focused-test.txt` failed because the regenerated scan omitted existing section status-key fields.
- Full model validation: `project_memory/runlogs/20260710-0104-archimate4-model-validation-view-connection-waypoint-geometry-full-model-test.txt` (`27` tests, `27` pass)
- Status focused test, corrected scan: `project_memory/runlogs/20260710-0105-archimate4-model-validation-view-connection-waypoint-geometry-status-focused-test.txt`
- JSON parse check: `project_memory/runlogs/20260710-0106-archimate4-model-validation-view-connection-waypoint-geometry-json-check.txt`
- Changed-file ESLint: `project_memory/runlogs/20260710-0107-archimate4-model-validation-view-connection-waypoint-geometry-eslint-changed.txt`
- Diff whitespace check: `project_memory/runlogs/20260710-0108-archimate4-model-validation-view-connection-waypoint-geometry-diff-check.txt`
- Full language suite: `project_memory/runlogs/20260710-0109-archimate4-model-validation-view-connection-waypoint-geometry-test-language.txt` (`254` tests, `254` pass)
- Completion audit: `project_memory/runlogs/20260710-0110-archimate4-model-validation-view-connection-waypoint-geometry-completion-audit.json` (`failures: []`)
- C260 coverage audit: `project_memory/runlogs/20260710-0111-archimate4-model-validation-view-connection-waypoint-geometry-c260-coverage-audit.json` (`failures: []`)
- Repo-wide lint baseline: `project_memory/runlogs/20260710-0112-archimate4-model-validation-view-connection-waypoint-geometry-repo-lint.txt` remains the known legacy baseline with `4382` errors; changed-file ESLint is clean.
- State update: `project_memory/runlogs/20260710-0113-archimate4-model-validation-view-connection-waypoint-geometry-state-update.txt`
- Post-state JSON parse: `project_memory/runlogs/20260710-0114-archimate4-model-validation-view-connection-waypoint-geometry-post-state-json-check.txt`
- Post-state diff whitespace check: `project_memory/runlogs/20260710-0115-archimate4-model-validation-view-connection-waypoint-geometry-post-state-diff-check.txt`
- Final language suite: `project_memory/runlogs/20260710-0116-archimate4-model-validation-view-connection-waypoint-geometry-final-test-language.txt` (`254` tests, `254` pass)
- Runlog trim: `project_memory/runlogs/20260710-0117-archimate4-model-validation-view-connection-waypoint-geometry-trim-runlogs.txt`
- Final JSON parse: `project_memory/runlogs/20260710-0118-archimate4-model-validation-view-connection-waypoint-geometry-final-json-check.txt`
- Final diff whitespace check: `project_memory/runlogs/20260710-0119-archimate4-model-validation-view-connection-waypoint-geometry-final-diff-check.txt`

## External Boundary

- Official Appendix B relationship matrix data remains externally supplied.
- Official MEFF 4.0 XSD remains unavailable from the checked Open Group XSD directory.
- Exact Appendix A artwork redistribution rights remain unconfirmed.
- W262 remains a companion-source gap, not an official conformance blocker.

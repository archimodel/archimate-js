# Audit: Junction Renderer Notation

- Date: 2026-07-09
- Loop: 78
- Scope: C260 Appendix A-derived ArchiMate 4 junction marker notation.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-338-c260-appendix-a-junction-page-scan.txt` records the local C260 Appendix A page signal for relationships and junctions without reproducing normative artwork.
- `project_memory/runlogs/20260709-339-c260-appendix-a-junction-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-340-c260-appendix-a-junction-visual-check.txt` records the rendered page observation: `AndJunction` is a filled black dot and `OrJunction` is an unfilled ring.

## Red Test

- `project_memory/runlogs/20260709-341-junction-renderer-red-test.txt` failed because `ArchimateRenderer` had no ArchiMate 4-specific junction marker handling and rendered text inside the connector.

## Implementation

- `lib/draw/ArchimateRenderer.js` now detects ArchiMate 4 profiles and renders `AndJunction` as a filled black dot and `OrJunction` as an unfilled ring.
- ArchiMate 3.x keeps the legacy `AND` / `OR` text marker path.
- Optional modeler-supplied junction names still render below the connector.
- `test/renderer-notation.test.mjs` guards the renderer code path.
- README and `docs/archimate4` document the derived renderer requirement and the 3.x compatibility boundary.

## Verification

- `project_memory/runlogs/20260709-342-junction-renderer-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-343-junction-renderer-test-language.txt`: `npm run test:language` passed with 136 tests.
- `project_memory/runlogs/20260709-344-junction-renderer-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-345-junction-renderer-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-346-junction-renderer-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-347-junction-renderer-git-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-348-junction-renderer-repo-lint-legacy.txt`: repo-wide lint remains the known legacy failure with 4383 errors.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

# Audit: Grouping Renderer Notation

- Date: 2026-07-09
- Loop: 77
- Scope: C260 Appendix A-derived ArchiMate 4 `Grouping` renderer outline notation.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-326-c260-appendix-a-grouping-page-scan.txt` records the local C260 Appendix A page signal for `Grouping` notation without reproducing normative artwork.
- `project_memory/runlogs/20260709-327-c260-appendix-a-grouping-visual-check.txt` records the rendered page check: `Grouping` appears as a dashed outline with no filled domain rectangle.

## Red Test

- `project_memory/runlogs/20260709-328-grouping-renderer-red-test.txt` failed because `ArchimateRenderer` had no ArchiMate 4-specific `Grouping` outline handling.

## Implementation

- `lib/draw/ArchimateRenderer.js` now detects ArchiMate 4 profiles and renders `Grouping` with `fill: 'none'` and `strokeDasharray: '3,3'`.
- ArchiMate 3.x `Grouping` rendering remains unchanged because the new outline behavior is gated by the active profile version.
- Grouping pictogram fill is black in ArchiMate 4 mode so the unfilled outline does not erase the pictogram path.
- `test/renderer-notation.test.mjs` guards the renderer code path.
- README and `docs/archimate4` document the derived renderer requirement and keep exact Appendix A vector artwork as an external source/rights boundary.

## Verification

- `project_memory/runlogs/20260709-329-grouping-renderer-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-330-grouping-renderer-test-language.txt`: `npm run test:language` passed.
- `project_memory/runlogs/20260709-331-grouping-renderer-eslint-registry.txt`: registry scoped ESLint passed.
- `project_memory/runlogs/20260709-332-grouping-renderer-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-333-grouping-renderer-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-334-grouping-renderer-git-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-335-grouping-renderer-repo-lint-legacy.txt`: repo-wide lint remains the known legacy failure with 4383 errors.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

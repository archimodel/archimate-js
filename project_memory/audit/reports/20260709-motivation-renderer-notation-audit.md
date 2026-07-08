# Audit: Motivation Renderer Notation

- Date: 2026-07-09
- Loop: 79
- Scope: C260 Appendix A-derived ArchiMate 4 Motivation element body notation.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-351-c260-appendix-a-motivation-render.txt` records the Poppler render command output for the Appendix A page image used for visual review.
- `project_memory/runlogs/20260709-352-c260-appendix-a-motivation-visual-check.txt` records the rendered page observation: Motivation element boxes use clipped/chamfered body corners rather than plain rectangular boxes.

## Red Test

- `project_memory/runlogs/20260709-353-motivation-renderer-red-test.txt` failed because `ArchimateRenderer` and `ArchimateRendererUtil` had no ArchiMate 4-specific Motivation body path.

## Implementation

- `lib/draw/ArchimateRendererUtil.js` now exposes `getChamferedRectPath()` for clipped-corner body geometry.
- `lib/draw/ArchimateRenderer.js` now draws ArchiMate 4 Motivation elements with a filled chamfered path.
- ArchiMate 3.x keeps the existing rectangle body rendering because the new path is gated by the active profile version.
- `test/renderer-notation.test.mjs` guards the renderer and util code path.
- README and `docs/archimate4` document the derived renderer requirement and the 3.x compatibility boundary.
- `project_memory/audit/audit_registry.json` now includes `lib/draw/ArchimateRendererUtil.js` in the scoped ESLint gate.

## Verification

- `project_memory/runlogs/20260709-354-motivation-renderer-test.txt`: focused renderer notation test passed.
- `project_memory/runlogs/20260709-355-motivation-renderer-test-language.txt`: `npm run test:language` passed with 137 tests.
- `project_memory/runlogs/20260709-356-motivation-renderer-eslint-registry.txt`: pre-registry-update scoped ESLint passed before adding `ArchimateRendererUtil.js`.
- `project_memory/runlogs/20260709-357-motivation-renderer-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-358-motivation-renderer-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-359-motivation-renderer-git-diff-check.txt`: `git diff --check` passed before record updates.
- `project_memory/runlogs/20260709-360-motivation-renderer-repo-lint-legacy.txt`: repo-wide lint remains the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-361-motivation-renderer-eslint-registry-updated.txt`: updated registry scoped ESLint passed with `ArchimateRendererUtil.js` included.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

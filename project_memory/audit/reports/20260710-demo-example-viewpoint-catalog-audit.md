# 2026-07-10 Demo Example Viewpoint Catalog Audit

## Scope

- Add a Viewer and Editor demo panel for the ArchiMate 4 Appendix C example viewpoint catalog.
- Keep the catalog informative only: no bundled full viewpoint definitions, allowed-type filters, or normative relationship constraints.
- Preserve ArchiMate 3.x behavior by marking the panel not applicable in 3.x mode.

## Evidence

- Red test: `project_memory/runlogs/20260710-0478-demo-example-viewpoint-catalog-red-test.txt`
- Focused test: `project_memory/runlogs/20260710-0479-demo-example-viewpoint-catalog-focused-test.txt`
- Combined demo tests: `project_memory/runlogs/20260710-0480-demo-example-viewpoint-focused-tests.txt`
- Demo build: `project_memory/runlogs/20260710-0481-demo-example-viewpoint-demo-build.txt`
- Browser smoke: `project_memory/runlogs/20260710-0482-demo-example-viewpoint-browser-smoke.json`
- Changed-file ESLint: `project_memory/runlogs/20260710-0483-demo-example-viewpoint-eslint-changed.txt`
- Language tests: `project_memory/runlogs/20260710-0484-demo-example-viewpoint-test-language.txt`
- Completion audit: `project_memory/runlogs/20260710-0485-demo-example-viewpoint-completion-audit.json`
- C260 coverage audit: `project_memory/runlogs/20260710-0486-demo-example-viewpoint-c260-coverage-audit.json`
- Registry-scoped ESLint: `project_memory/runlogs/20260710-0487-demo-example-viewpoint-eslint-registry.txt`
- Final JSON/diff checks: `project_memory/runlogs/20260710-0488-demo-example-viewpoint-json-check.txt`,
  `project_memory/runlogs/20260710-0489-demo-example-viewpoint-diff-check.txt`
- Final focused demo tests: `project_memory/runlogs/20260710-0490-demo-example-viewpoint-final-focused-tests.txt`
- Final language tests: `project_memory/runlogs/20260710-0491-demo-example-viewpoint-final-test-language.txt`
- Final completion and C260 audits: `project_memory/runlogs/20260710-0492-demo-example-viewpoint-final-completion-audit.json`,
  `project_memory/runlogs/20260710-0493-demo-example-viewpoint-final-c260-coverage-audit.json`

## Result

- PASS: Viewer and Editor render `Informative`, `4 groups`, and `25 viewpoints` in ArchiMate 4 mode.
- PASS: Viewer and Editor render `Not applicable` with empty catalog values in ArchiMate 3.x mode.
- PASS: C260 completion and coverage audits retain the official Appendix B, MEFF 4.0 XSD, Appendix A artwork-rights, and W262 external boundaries.

## Remaining External Issues

- Official Appendix B relationship matrix data or redistribution approval.
- Official MEFF 4.0 XSD.
- Exact Appendix A vector artwork redistribution rights.
- Local W262 companion paper availability.

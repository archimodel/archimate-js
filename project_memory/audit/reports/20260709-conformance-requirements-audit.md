# 20260709 conformance requirements audit

## Scope

- Track C260 conformance requirements per required and optional clause.
- Surface the requirement map through `getArchimate4ImplementationStatus()`.
- Keep external blockers explicit instead of treating fallback support as formal conformance.

## Source Check

- Viewpoint/example viewpoint scan: `project_memory/runlogs/20260709-187-c260-viewpoint-standard-scan.txt`
- Conformance shall/may scan: `project_memory/runlogs/20260709-188-c260-conformance-shall-scan.txt`

## Commands

- Red test: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-189-conformance-requirements-red-test.txt`
  - Result: fail, expected. `profile.conformance.requirements` was missing.
- Language tests: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-190-conformance-requirements-test-language.txt`
  - Result: pass, 117 tests.
- Scoped lint: `npx eslint ... test/*.test.mjs`
  - Log: `project_memory/runlogs/20260709-191-conformance-requirements-eslint-registry.txt`
  - Result: pass.
- Demo build: `npm run demo:build`
  - Log: `project_memory/runlogs/20260709-192-conformance-requirements-demo-build.txt`
  - Result: pass.
- Whitespace check: `git diff --check`
  - Log: `project_memory/runlogs/20260709-193-conformance-requirements-git-diff-check.txt`
  - Result: pass.
- Repository-wide lint: `npm run lint`
  - Log: `project_memory/runlogs/20260709-194-conformance-requirements-repo-lint-legacy.txt`
  - Result: expected legacy failure, 4413 errors outside this feature gate.

## Result

Pass for the scoped ArchiMate 4 conformance requirement tracking gate.

Remaining blockers are unchanged: official Appendix B data redistribution, MEFF 4.0 XSD availability, W262 availability, and exact Appendix A vector artwork redistribution.

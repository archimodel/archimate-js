# 20260709 source coverage status audit

## Scope

- Expose source coverage boundaries through `getArchimate4ImplementationStatus()`.
- Track local C260 and transcript evidence separately from W262, Appendix B, MEFF 4.0 XSD, and Appendix A artwork-rights dependencies.
- Preserve external blockers instead of implying complete official conformance.

## Source Evidence

- W262 publication-page check: `project_memory/runlogs/20260709-210-w262-publication-status-check.txt`
- The Open Group page returned HTTP 200 and indicated W262 is a free PDF edition requiring login.
- The W262 PDF itself is not present locally and is not redistributed by this repository.

## Red Test

- Command: `npm run test:language`
- Log: `project_memory/runlogs/20260709-211-source-coverage-status-red-test.txt`
- Result: fail, expected. `profile.conformance.sourceCoverage` was missing.

## Implementation

- `lib/metamodel/languages/archimate4-profile.json` now records `conformance.sourceCoverage`.
- `lib/metamodel/languages/index.js` now returns `sourceCoverage` from `getArchimate4ImplementationStatus()`, including local/external counts and missing required/companion source lists.
- README and `docs/archimate4` describe the source coverage status and W262 availability boundary.

## Verification

- PASS: `npm run test:language` in `project_memory/runlogs/20260709-212-source-coverage-status-test-language.txt` passed with 119 tests.
- PASS: registry scoped ESLint in `project_memory/runlogs/20260709-213-source-coverage-status-eslint-registry.txt` exited 0.
- PASS: `npm run demo:build` in `project_memory/runlogs/20260709-214-source-coverage-status-demo-build.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260709-215-source-coverage-status-git-diff-check.txt` exited 0.
- PASS: JSON parse check in `project_memory/runlogs/20260709-216-source-coverage-status-json-parse.txt` exited 0.
- EXPECTED LEGACY FAIL: repository-wide `npm run lint` in `project_memory/runlogs/20260709-217-source-coverage-status-repo-lint-legacy.txt` exited 1 with the known 4413 existing errors.
- PASS: final state JSON check in `project_memory/runlogs/20260709-218-source-coverage-status-state-json-check.txt` exited 0.
- PASS: final `git diff --check` in `project_memory/runlogs/20260709-219-source-coverage-status-final-git-diff-check.txt` exited 0.

## Result

Pass for the scoped ArchiMate 4 source coverage status gate.

Remaining blockers are unchanged: official Appendix B data redistribution, MEFF 4.0 XSD availability, W262 PDF local availability, and exact Appendix A vector artwork redistribution.

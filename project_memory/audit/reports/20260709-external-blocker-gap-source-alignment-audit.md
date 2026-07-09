# 20260709 External Blocker Gap Source Alignment Audit

## Scope

- Add a regression guard proving official conformance blockers map consistently across remaining gaps, source coverage, external blocker catalog, and conformance readiness.
- Keep W262 visible as a companion-source gap rather than an official conformance blocker.

## Evidence

- Focused test pass: `project_memory/runlogs/20260709-1371-external-blocker-gap-source-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-1372-external-blocker-gap-source-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1373-external-blocker-gap-source-eslint-changed.txt`
- Diff whitespace check: `project_memory/runlogs/20260709-1374-external-blocker-gap-source-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1375-external-blocker-gap-source-repo-lint.txt`
- Initial staged diff check: `project_memory/runlogs/20260709-1376-external-blocker-gap-source-staged-diff-check.txt`
- Final staged diff check: `project_memory/runlogs/20260709-1377-external-blocker-gap-source-final-staged-diff-check.txt`

## Result

- PASS: The focused external blocker/source alignment test passed.
- PASS: `npm run test:language` passed with 204 tests.
- PASS: Changed-file ESLint and `git diff --check` passed.
- PASS: Final staged diff check passed after trimming a generated repo-lint runlog EOF blank line recorded by the initial staged diff check.
- KNOWN: Repo-wide `npm run lint` still reports the existing 4382 legacy errors outside this feature gate.

## Guarded Invariants

- `remainingGaps.officialConformanceGapIds`, `conformanceReadiness.blockers`, `externalBlockerCatalog.actualIds`, and `externalBlockerCatalog.sourceCoverageIds` must match.
- Every official blocker must point at a missing required source coverage item with `externalBlocker` set back to that blocker id.
- W262 must remain a companion gap mapped to `sourceCoverage.items.w262`, not an official conformance blocker.

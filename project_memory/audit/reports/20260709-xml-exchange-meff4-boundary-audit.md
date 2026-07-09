# 20260709 XML Exchange MEFF 4 Boundary Audit

## Scope

- Add a regression guard proving internal ArchiMate 4 XML round-trip coverage does not imply official MEFF 4.0 XML conformance while the official XSD remains unavailable.
- Keep the MEFF 4.0 XSD blocker tied to source coverage, remaining gaps, and readiness.

## Evidence

- Focused test pass: `project_memory/runlogs/20260709-1385-xml-exchange-meff4-boundary-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-1386-xml-exchange-meff4-boundary-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1387-xml-exchange-meff4-boundary-eslint-changed.txt`
- Diff whitespace check: `project_memory/runlogs/20260709-1388-xml-exchange-meff4-boundary-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1389-xml-exchange-meff4-boundary-repo-lint.txt`
- Initial staged diff check: `project_memory/runlogs/20260709-1390-xml-exchange-meff4-boundary-staged-diff-check.txt`
- Final staged diff check: `project_memory/runlogs/20260709-1391-xml-exchange-meff4-boundary-final-staged-diff-check.txt`

## Result

- PASS: The focused XML exchange boundary test passed.
- PASS: `npm run test:language` passed with 206 tests.
- PASS: Changed-file ESLint and `git diff --check` passed.
- PASS: Final staged diff check passed after trimming a generated repo-lint runlog EOF blank line recorded by the initial staged diff check.
- KNOWN: Repo-wide `npm run lint` still reports the existing 4382 legacy errors outside this feature gate.

## Guarded Invariants

- Internal XML read/write/read round-trip coverage must remain distinct from official XML conformance.
- `exchangeFormat.status` must remain `experimental` and `officialConformanceClaimable` must remain false while `sourceCoverage.items.meff4Xsd.official4XsdDiscovered` is false.
- The `officialMeff4Xsd` blocker must remain present in remaining gaps and readiness while `meff4Xsd` is a missing required source.

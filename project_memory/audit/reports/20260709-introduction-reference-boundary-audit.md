# ArchiMate 4 Introduction Reference Boundary Audit

- Date: 2026-07-09T19:45:00+09:00
- Scope: C260 Chapter 1 Introduction/Conformance coverage boundary.
- Result: pass with known legacy repo-wide lint failures.

## Evidence

- C260 Chapter 1 PDF outline check: `project_memory/runlogs/20260709-192610-c260-chapter1-outline-check.json`
- Initial focused test mismatch: `project_memory/runlogs/20260709-1928-introduction-reference-boundary-focused-test.txt`
- Focused regression test after documentation correction: `project_memory/runlogs/20260709-1929-introduction-reference-boundary-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-1930-introduction-reference-boundary-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1931-introduction-reference-boundary-eslint-changed.txt`
- Diff check: `project_memory/runlogs/20260709-1932-introduction-reference-boundary-diff-check.txt`
- Repo-wide lint baseline: `project_memory/runlogs/20260709-1933-introduction-reference-boundary-repo-lint.txt`

## Findings

- The local C260 PDF outline exposes Chapter 1 items 1.1 Objective, 1.2 Overview, 1.3 Conformance, 1.4 Normative References, 1.5 Terminology, and 1.6 Future Directions.
- `getArchimate4ImplementationStatus().introductionCoverage` now reports `requirementSourceIds`, `referenceOnlyIds`, `missingRequirementSourceIds`, `extraRequirementSourceIds`, `missingReferenceOnlyIds`, and `extraReferenceOnlyIds`.
- Only `conformance` is classified as the Chapter 1 requirement source.
- Objective, Overview, Normative References, Terminology, and Future Directions are classified as reference-only and are regression-tested to stay outside `sourceCoverage`, `remainingGaps`, `conformanceReadiness`, and `externalBlockerCatalog`.
- `npm run test:language` passed with 219 tests.
- Changed-file ESLint passed for `lib/metamodel/languages/index.js` and `test/language-profile.test.mjs`.
- `git diff --check` passed.

## Residual Risk

- Repo-wide `npm run lint` still fails with the known legacy 4382 errors outside this scoped change.
- Official conformance remains unclaimable until Appendix B matrix redistribution/source, MEFF 4.0 XSD, and exact Appendix A artwork rights are resolved.
- W262 remains a companion-source gap.

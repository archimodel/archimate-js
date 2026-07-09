# ArchiMate 4 Document Artifact Boundary Audit

- Date: 2026-07-09T19:58:00+09:00
- Scope: C260 front matter and Index document-artifact coverage boundary.
- Result: pass with known legacy repo-wide lint failures.

## Evidence

- C260 document artifact PDF boundary check: `project_memory/runlogs/20260709-1948-c260-document-artifact-boundary-check.json`
- Focused regression test: `project_memory/runlogs/20260709-1950-document-artifact-boundary-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-1951-document-artifact-boundary-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1952-document-artifact-boundary-eslint-changed.txt`
- Diff check: `project_memory/runlogs/20260709-1953-document-artifact-boundary-diff-check.txt`
- Repo-wide lint baseline: `project_memory/runlogs/20260709-1954-document-artifact-boundary-repo-lint.txt`

## Findings

- The local C260 PDF check covers Cover, Title, Copyright, Table of Contents, Preface, The Open Group, This Document, Trademarks, Acknowledgements, Referenced Documents, and Index.
- `getArchimate4ImplementationStatus().documentArtifactCoverage` now reports `expectedNonImplementationIds`, `nonImplementationIds`, `missingNonImplementationIds`, and `extraNonImplementationIds`.
- All 11 tracked C260 document artifacts are classified as non-implementation references.
- Regression coverage verifies the document artifact ids stay outside `sectionCoverage`, `sourceCoverage`, `remainingGaps`, `conformanceReadiness`, and `externalBlockerCatalog`.
- `npm run test:language` passed with 220 tests.
- Changed-file ESLint passed for `lib/metamodel/languages/index.js` and `test/language-profile.test.mjs`.
- `git diff --check` passed.

## Residual Risk

- Repo-wide `npm run lint` still fails with the known legacy 4382 errors outside this scoped change.
- Official conformance remains unclaimable until Appendix B matrix redistribution/source, MEFF 4.0 XSD, and exact Appendix A artwork rights are resolved.
- W262 remains a companion-source gap.

# Appendix F Vocabulary Boundary Audit

Date: 2026-07-09

## Result

PASS with known legacy repo-wide lint failures and external-source blockers.

## Scope

- Confirmed the local C260 Appendix F acronym tokens from `C:\Users\syska\Downloads\978940181474E.pdf`.
- Classified Appendix F acronym tokens as vocabulary-only coverage.
- Verified the 31 Appendix F token ids stay outside ArchiMate 4 section coverage, source coverage, remaining gaps, conformance readiness blockers, and external blocker catalog ids.

## Evidence

- PDF vocabulary check: `project_memory/runlogs/20260709-2018-c260-appendix-f-vocabulary-boundary-check.json`
- Focused language-profile test: `project_memory/runlogs/20260709-2019-appendix-f-vocabulary-boundary-focused-test.txt`
- Full language tests: `project_memory/runlogs/20260709-2020-appendix-f-vocabulary-boundary-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-2021-appendix-f-vocabulary-boundary-eslint-changed.txt`
- Diff whitespace check: `project_memory/runlogs/20260709-2022-appendix-f-vocabulary-boundary-diff-check.txt`
- Status snapshot: `project_memory/runlogs/20260709-2023-appendix-f-vocabulary-boundary-status.json`
- Repo-wide lint: `project_memory/runlogs/20260709-2024-appendix-f-vocabulary-boundary-repo-lint.txt`

## Verification Summary

- `npm run test:language`: PASS, 222 tests.
- `npx eslint lib/metamodel/languages/index.js test/language-profile.test.mjs`: PASS.
- `git diff --check`: PASS.
- `npm run lint`: known legacy failure, 4382 existing errors.

## Remaining External Issues

- `officialAppendixBRelationshipMatrix` remains external-source and redistribution dependent.
- `officialMeff4Xsd` remains unavailable.
- `exactAppendixAArtworkRights` remains external-rights dependent.
- `w262CompanionPaper` remains unavailable locally as a companion source.

# ArchiMate 4 C260 Coverage Audit Script Audit

- Date: 2026-07-09T23:20:00+09:00
- Loop: 191
- Scope: C260 book-derived coverage ledger audit script, test coverage, documentation, and evidence runlogs.

## Commands

- `node scripts\audit_archimate4_c260_coverage.mjs --checked-at 2026-07-09T23:20:00+09:00 --out project_memory\runlogs\20260709-1039-archimate4-c260-coverage-audit.json`
- `node --test --test-name-pattern "C260 coverage audit script" test\language-profile.test.mjs`
- `npx eslint scripts\audit_archimate4_c260_coverage.mjs test\language-profile.test.mjs`
- `npm run test:language`
- `node scripts\audit_archimate4_c260_coverage.mjs --checked-at 2026-07-09T23:20:00+09:00`
- `git diff --check`
- `npm run lint`

## Result

- PASS: C260 audit JSON reports `complete: true`, 22 tracked coverage groups, 284 aggregate coverage items, 253 PDF-outline items, 31 non-outline derived Appendix F items, three unique source runlog paths, and zero failures.
- PASS: focused C260 audit test.
- PASS: changed-file ESLint for the new audit script and language-profile tests.
- PASS: `npm run test:language` with 225 passing tests.
- PASS: JSON parse for the audit runlog.
- PASS: final audit-script run.
- PASS: `git diff --check`.
- KNOWN: repo-wide `npm run lint` remains the existing legacy baseline with 4382 errors outside this feature gate.

## Evidence

- `project_memory/runlogs/20260709-1039-archimate4-c260-coverage-audit.json`
- `project_memory/runlogs/20260709-1040-archimate4-c260-coverage-audit-focused-test.txt`
- `project_memory/runlogs/20260709-1041-archimate4-c260-coverage-audit-eslint-changed.txt`
- `project_memory/runlogs/20260709-1042-archimate4-c260-coverage-audit-test-language.txt`
- `project_memory/runlogs/20260709-1043-archimate4-c260-coverage-audit-json-check.txt`
- `project_memory/runlogs/20260709-1044-archimate4-c260-coverage-audit-script-run.txt`
- `project_memory/runlogs/20260709-1045-archimate4-c260-coverage-audit-diff-check.txt`
- `project_memory/runlogs/20260709-1046-archimate4-c260-coverage-audit-repo-lint.txt`

## Boundary

- This audit verifies coverage identity and recorded source-extraction evidence. It does not copy C260 prose, Appendix B relationship tables, or exact Appendix A artwork.
- Official conformance remains blocked on the external Appendix B relationship matrix or redistribution approval, official MEFF 4.0 XSD, and exact Appendix A artwork rights. W262 remains a visible companion-source gap.

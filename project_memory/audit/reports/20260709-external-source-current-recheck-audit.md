# Audit: External Source Current Recheck

- Date: 2026-07-09
- Scope: Refresh current external-source evidence for ArchiMate 4 MEFF XSD and W262 companion source status.
- Result: pass with external blockers

## Checks

- Rechecked `https://www.opengroup.org/xsd/archimate/`.
- Rechecked 4.0 candidate XSD URLs plus the 3.1 model XSD baseline.
- Rechecked the W262 publication page.
- Re-ran local W262 and ArchiMate motivation PDF search under Downloads and Codex attachments.
- Updated `archimate4-profile.json`, source ledger, implementation specification, and status tests to point at the new evidence runlog.

## Evidence

- External source recheck: `project_memory/runlogs/20260709-1446-external-source-current-recheck.json`
- Focused test: `project_memory/runlogs/20260709-1447-external-source-current-recheck-focused-test.txt`
- Full language test: `project_memory/runlogs/20260709-1448-external-source-current-recheck-test-language.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-1449-external-source-current-recheck-eslint-changed.txt`
- Diff check: `project_memory/runlogs/20260709-1450-external-source-current-recheck-diff-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260709-1451-external-source-current-recheck-repo-lint.txt`

## Notes

- The official XSD directory returned HTTP 200 and still listed only 3.1 Diagram, Model, and View XSD links.
- Tested 4.0 candidate URLs returned 404; the 3.1 model XSD baseline returned 200.
- W262 publication page returned HTTP 200 and still shows title/free PDF/login/page/date markers.
- Local W262 PDF search still found no matching files.
- `npm run test:language` passed with 215 tests.
- Changed-file ESLint passed.
- Repo-wide `npm run lint` remains the known legacy failure with 4382 existing errors outside this focused feature gate.

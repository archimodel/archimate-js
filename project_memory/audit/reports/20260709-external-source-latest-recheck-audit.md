# External Source Latest Recheck Audit

- Date: 2026-07-09
- Loop: 189
- Result: pass with known legacy repo-wide lint failure and external-source blockers

## Scope

This audit covers the scripted refresh of ArchiMate 4 external-source evidence for:

- MEFF 4.0 XSD availability under the official Open Group XSD directory
- W262 publication-page visibility and local PDF availability

The recheck intentionally stores status codes, discovered XSD link names, boolean page markers, and local candidate paths only. It does not store ArchiMate specification prose, Appendix B relationship matrices, exact Appendix A artwork, or license text.

## Evidence

- Script: `scripts/check_archimate4_external_sources.mjs`
- Source runlog: `project_memory/runlogs/20260709-1017-external-source-latest-recheck.json`
- Focused test: `project_memory/runlogs/20260709-1018-external-source-latest-focused-test.txt`
- JSON parse: `project_memory/runlogs/20260709-1023-external-source-latest-json-check.txt`
- Status API check: `project_memory/runlogs/20260709-1024-external-source-latest-status-api-check.txt`
- Final language test: `project_memory/runlogs/20260709-1026-external-source-latest-final-test-language.txt`
- Final changed-file ESLint: `project_memory/runlogs/20260709-1027-external-source-latest-final-eslint-changed.txt`
- Final diff check: `project_memory/runlogs/20260709-1028-external-source-latest-final-diff-check.txt`
- Repo-wide lint baseline: `project_memory/runlogs/20260709-1022-external-source-latest-repo-lint.txt`

## Observations

- The official XSD directory returned 200.
- The directory still listed only the 3.1 Diagram, Model, and View XSD links.
- Tested 4.0 XSD candidate URLs returned 404.
- The 3.1 Model XSD baseline returned 200.
- The W262 publication page returned 200 and exposed expected publication metadata markers.
- The scoped local search under Downloads and Codex attachments found no W262 PDF candidate.

## Checks

- `npm run test:language`: pass, 223 tests.
- Changed-file ESLint for the new script and touched language test/profile files: pass.
- `git diff --check`: pass.
- `npm run lint`: expected legacy failure, 4382 existing errors outside this feature gate.

## Conclusion

The current external-source status is reproducibly checkable and the ArchiMate 4 source coverage metadata points at the refreshed evidence. Official ArchiMate 4 conformance remains unclaimable until the external blockers are resolved: official MEFF 4.0 XSD, redistributable Appendix B matrix/profile artifact, exact Appendix A artwork redistribution rights, and local W262 companion PDF availability.

# Appendix A Artwork Rights Pictogram Audit

- Date: 2026-07-09
- Scope: make the Appendix A artwork-rights boundary machine-auditable for ArchiMate 4 pictograms.
- Result: pass with exact Appendix A vector artwork redistribution rights still unconfirmed.

## Evidence

- Pictogram audit: `project_memory/runlogs/20260709-1189-appendix-a-artwork-rights-pictogram-audit.json`.
  - Profile concept and connector count: 44.
  - Profile pictogram reference count: 41.
  - Non-`PICTO_OBJECT` pictogram reference count: 40.
  - Missing local `PathMap` references: none.
  - Profile pictograms implemented as `PICTO_OBJECT` aliases: none.
  - `BusinessObject` and `DataObject` remain intentional `PICTO_OBJECT` users.
- JSON check: `project_memory/runlogs/20260709-1190-appendix-a-artwork-rights-json-check.txt`.
- Red test evidence: `project_memory/runlogs/20260709-1191-appendix-a-artwork-rights-test-language.txt`.
- Language profile tests: `project_memory/runlogs/20260709-1192-appendix-a-artwork-rights-test-language-pass.txt`.
- Changed-file ESLint: `project_memory/runlogs/20260709-1193-appendix-a-artwork-rights-eslint-changed.txt`.
- Diff check: `project_memory/runlogs/20260709-1194-appendix-a-artwork-rights-diff-check.txt`.
- Demo build: `project_memory/runlogs/20260709-1195-appendix-a-artwork-rights-demo-build.txt`.
- Repo-wide lint: `project_memory/runlogs/20260709-1196-appendix-a-artwork-rights-repo-lint.txt`.
  - This remains the known legacy failure with 4382 existing errors.
- Status API evidence: `project_memory/runlogs/20260709-1197-appendix-a-artwork-rights-status.json`.
- Staged diff check: `project_memory/runlogs/20260709-1198-appendix-a-artwork-rights-staged-diff-check.txt`.

## Conclusion

`sourceCoverage.appendixAArtworkRights` now records that ArchiMate 4 pictograms use locally authored
renderer paths, local dedicated path coverage is complete, and no profile pictogram relies on a
generic `PICTO_OBJECT` alias fallback. This does not commit the exact Appendix A vector artwork and
does not resolve the external redistribution-rights blocker.

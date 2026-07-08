# 2026-07-08 ArchiMate 4 Appendix B Matrix Text Audit

- loop_id: 27
- stage: appendix_b_matrix_text_profile_loader_verified
- change_type: feature
- scope: accept host-supplied CSV/TSV matrix text for licensed ArchiMate 4 Appendix B relationship profiles.

## Source Trace

- C260 Appendix B relationship tables remain licensed source data and are not embedded in this repository.
- The existing external Appendix B profile contract already validates complete source-target coverage.
- Initial gap check is recorded in `project_memory/runlogs/20260708-182-appendix-b-matrix-text-gap-check.txt`.

## Implemented Surface

- `lib/metamodel/languages/relationship-profile-loader.js` now accepts `{ matrixText, matrixDelimiter }` profiles.
- CSV, TSV, and semicolon-delimited first rows are detected, with explicit delimiter override support.
- Quoted CSV cells and escaped quotes are parsed before reusing the existing matrix-array normalization path.
- Complete source-target cell validation is preserved; empty cells still represent explicit disallowed relationship cells.
- `README.md` and `docs/archimate4/*` document matrix text input as a host-supplied licensed profile shape.

## Checks

- FAIL-THEN-FIXED: initial matrix text gap check in `project_memory/runlogs/20260708-182-appendix-b-matrix-text-gap-check.txt` failed because `matrixText` was treated as an unknown source element.
- PASS: fix check in `project_memory/runlogs/20260708-183-appendix-b-matrix-text-fix-check.txt` confirms TSV and CSV matrix text input are accepted and normalized.
- PASS: `npm run test:language` in `project_memory/runlogs/20260708-184-appendix-b-matrix-text-npm-test-language.txt` passed with 65 tests.
- PASS: changed-file ESLint in `project_memory/runlogs/20260708-185-appendix-b-matrix-text-eslint-changed-js.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260708-186-appendix-b-matrix-text-git-diff-check.txt` exited 0.
- EXPECTED LEGACY FAIL: repo-wide `npm run lint` in `project_memory/runlogs/20260708-187-appendix-b-matrix-text-repo-lint-legacy.txt` exited 1 on existing unrelated lint violations.
- PASS: final state check is recorded in `project_memory/runlogs/20260708-188-appendix-b-matrix-text-final-state-check.txt`.

## Decision

- Appendix B data is still not committed, but a licensed table can now be supplied by a host application as CSV/TSV matrix text without losing completeness validation.

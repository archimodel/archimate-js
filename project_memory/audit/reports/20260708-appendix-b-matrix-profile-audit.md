# 2026-07-08 ArchiMate 4 Appendix B Matrix Profile Audit

- loop_id: 26
- stage: appendix_b_matrix_profile_loader_verified
- change_type: feature
- scope: accept host-supplied header-row matrix arrays for licensed ArchiMate 4 Appendix B relationship profiles.

## Source Trace

- C260 Appendix B relationship tables remain licensed source data and are not embedded in this repository.
- The implementation specification records Appendix B as normative and requires an external profile path in `docs/archimate4/official-specification.md`.
- Initial gap check is recorded in `project_memory/runlogs/20260708-175-appendix-b-matrix-profile-gap-check.txt`.

## Implemented Surface

- `lib/metamodel/languages/relationship-profile-loader.js` now accepts header-row matrix arrays directly or through a `matrix` property.
- Matrix rows are normalized to the existing row-object cell contract, preserving complete source-target cell validation.
- Empty matrix cells represent disallowed relationship cells and still count as present when complete target-cell coverage is required.
- `README.md` and `docs/archimate4/*` document matrix input as a host-supplied licensed profile shape.

## Checks

- FAIL-THEN-FIXED: initial matrix gap check in `project_memory/runlogs/20260708-175-appendix-b-matrix-profile-gap-check.txt` failed because array rows had to be objects.
- PASS: fix check in `project_memory/runlogs/20260708-176-appendix-b-matrix-profile-fix-check.txt` confirms matrix input is accepted and normalized.
- PASS: `npm run test:language` in `project_memory/runlogs/20260708-177-appendix-b-matrix-profile-npm-test-language.txt` passed with 64 tests.
- PASS: changed-file ESLint in `project_memory/runlogs/20260708-178-appendix-b-matrix-profile-eslint-changed-js.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260708-179-appendix-b-matrix-profile-git-diff-check.txt` exited 0.
- EXPECTED LEGACY FAIL: repo-wide `npm run lint` in `project_memory/runlogs/20260708-180-appendix-b-matrix-profile-repo-lint-legacy.txt` exited 1 on existing unrelated lint violations.
- PASS: final state check is recorded in `project_memory/runlogs/20260708-181-appendix-b-matrix-profile-final-state-check.txt`.

## Decision

- Appendix B data is still not committed, but a licensed table can now be supplied by a host application as a matrix without losing completeness validation.

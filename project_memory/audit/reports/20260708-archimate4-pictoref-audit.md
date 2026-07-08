# 2026-07-08 ArchiMate 4 Pictogram Reference Audit

- loop_id: 23
- stage: archimate4_pictoref_guard_verified
- change_type: feature
- scope: renderer path-map coverage for every `pictoRef` referenced by the ArchiMate 4 profile and relationship connector metadata.

## Source Trace

- Local C260 Appendix A / notation keyword scan is recorded in `project_memory/runlogs/20260708-155-archimate4-pictoref-source-check.txt`.
- The scan records only derived facts and page hits. It does not store normative wording or vector artwork.

## Implemented Surface

- `lib/draw/PathMap.js` now defines explicit aliases for all ArchiMate 4 `pictoRef` values that were previously missing from the renderer path map.
- `test/language-profile.test.mjs` verifies that all ArchiMate 4 profile elements and connectors reference a `PathMap` key.
- `docs/archimate4/sources.md` documents the coverage guard and the current artwork redistribution boundary.

## Checks

- FAIL-THEN-FIXED: initial gap check in `project_memory/runlogs/20260708-149-archimate4-pictoref-gap-check.txt` found 18 missing `pictoRef` keys.
- PASS: alias check in `project_memory/runlogs/20260708-150-archimate4-pictoref-alias-check.txt` found 0 missing `pictoRef` keys.
- PASS: `npm run test:language` in `project_memory/runlogs/20260708-151-archimate4-pictoref-npm-test-language.txt` passed with 61 tests.
- PASS: changed-file ESLint in `project_memory/runlogs/20260708-152-archimate4-pictoref-eslint-changed-js.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260708-153-archimate4-pictoref-git-diff-check.txt` exited 0.
- EXPECTED LEGACY FAIL: repo-wide `npm run lint` in `project_memory/runlogs/20260708-154-archimate4-pictoref-repo-lint-legacy.txt` exited 1 on existing unrelated lint violations.
- PASS: final state check is recorded in `project_memory/runlogs/20260708-156-archimate4-pictoref-final-state-check.txt`.

## Decision

- The renderer no longer silently falls back to `PICTO_OBJECT` for ArchiMate 4 profile references because of undefined keys.
- Exact C260 Appendix A vector artwork remains a separate source/licensing decision.

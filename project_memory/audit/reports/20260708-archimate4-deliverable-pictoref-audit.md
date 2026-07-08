# 2026-07-08 ArchiMate 4 Deliverable Pictogram Reference Audit

- loop_id: 24
- stage: archimate4_deliverable_pictoref_spelling_verified
- change_type: bugfix
- scope: standard spelling for the ArchiMate 4 `Deliverable` pictogram reference while preserving the legacy 3.x misspelled renderer alias.

## Source Trace

- Local C260-derived catalog and PDF keyword checks are recorded in `project_memory/runlogs/20260708-162-archimate4-deliverable-pictoref-source-check.txt`.
- The source check records only derived facts and page hits. It does not store normative prose.

## Implemented Surface

- `lib/metamodel/languages/archimate4-profile.json` now uses `PICTO_DELIVERABLE` for `Deliverable`.
- `lib/draw/PathMap.js` defines `PICTO_DELIVERABLE` while keeping `PICTO_DELIVRABLE` as a legacy alias for existing 3.x metadata.
- `test/language-profile.test.mjs` verifies the ArchiMate 4 profile uses the correctly spelled pictogram reference.
- `docs/archimate4/sources.md` documents the spelling guard and compatibility alias.

## Checks

- FAIL-THEN-FIXED: initial check in `project_memory/runlogs/20260708-157-archimate4-deliverable-pictoref-gap-check.txt` found `PICTO_DELIVRABLE` in the ArchiMate 4 profile.
- PASS: fix check in `project_memory/runlogs/20260708-158-archimate4-deliverable-pictoref-fix-check.txt` confirms `PICTO_DELIVERABLE` and the legacy alias.
- PASS: `npm run test:language` in `project_memory/runlogs/20260708-159-archimate4-deliverable-pictoref-npm-test-language.txt` passed with 62 tests.
- PASS: changed-file ESLint in `project_memory/runlogs/20260708-160-archimate4-deliverable-pictoref-eslint-changed-js.txt` exited 0.
- PASS: ArchiMate 4 profile JSON parse in `project_memory/runlogs/20260708-161-archimate4-deliverable-pictoref-json-parse.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260708-163-archimate4-deliverable-pictoref-git-diff-check.txt` exited 0.
- EXPECTED LEGACY FAIL: repo-wide `npm run lint` in `project_memory/runlogs/20260708-164-archimate4-deliverable-pictoref-repo-lint-legacy.txt` exited 1 on existing unrelated lint violations.
- PASS: final state check is recorded in `project_memory/runlogs/20260708-165-archimate4-deliverable-pictoref-final-state-check.txt`.

## Decision

- The ArchiMate 4 profile now uses the standard `Deliverable` spelling consistently for its pictogram reference.
- The old misspelled `PICTO_DELIVRABLE` key remains only as a compatibility alias for legacy profile data.

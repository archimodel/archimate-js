# 2026-07-08 ArchiMate 4 Domain Terminology Metadata Audit

- loop_id: 25
- stage: archimate4_domain_metadata_preserved
- change_type: feature
- scope: preserve ArchiMate 4 domain metadata on created/imported shape attributes while keeping the legacy layer attribute for compatibility.

## Source Trace

- C260-derived implementation requirement is recorded in `docs/archimate4/official-specification.md`: ArchiMate 4 UI and docs should use domain terminology rather than old layer-centric wording.
- Current official XSD availability checks are recorded in `project_memory/runlogs/20260708-166-archimate-xsd-current-head-check.txt` and `project_memory/runlogs/20260708-167-archimate-xsd-current-link-scan.txt`; no public MEFF 4.0 XSD was found.
- Initial implementation gap check is recorded in `project_memory/runlogs/20260708-168-domain-terminology-gap-check.txt`.

## Implemented Surface

- `lib/util/ModelUtil.js` now exposes `getDomainType(elementType, profile)`.
- `lib/features/modeling/ElementFactory.js` assigns `domain` metadata from the active profile when creating or importing ArchiMate shapes.
- Domain color lookup now prefers `domain` when present and falls back to the legacy `layer` value.
- The legacy `layer` attribute remains populated so existing renderer and extension code remains compatible.
- `CHANGELOG.md`, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` record the behavior.

## Checks

- PASS: gap check in `project_memory/runlogs/20260708-168-domain-terminology-gap-check.txt` confirmed the pre-change gap.
- PASS: `npm run test:language` in `project_memory/runlogs/20260708-169-domain-terminology-npm-test-language.txt` passed with 63 tests.
- PASS: changed-file ESLint in `project_memory/runlogs/20260708-170-domain-terminology-eslint-changed-js.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260708-171-domain-terminology-git-diff-check.txt` exited 0.
- PASS: fix check in `project_memory/runlogs/20260708-172-domain-terminology-fix-check.txt` confirms domain helper, shape metadata, and domain-first color lookup.
- EXPECTED LEGACY FAIL: repo-wide `npm run lint` in `project_memory/runlogs/20260708-173-domain-terminology-repo-lint-legacy.txt` exited 1 on existing unrelated lint violations.
- PASS: final state check is recorded in `project_memory/runlogs/20260708-174-domain-terminology-final-state-check.txt`.

## Decision

- ArchiMate 4 shape metadata now carries the standard domain terminology directly while preserving the old layer field as a compatibility alias.

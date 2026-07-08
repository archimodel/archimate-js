# Audit Report: ArchiMate 4 Standard Spelling Metadata

- loop_id: 39
- stage: standard_spelling_metadata_verified
- date: 2026-07-08
- result: pass

## Scope

- Align ArchiMate 4 profile display metadata with C260-derived standard spelling for `Stakeholder`
  and `Course of Action`.
- Keep renderer compatibility aliases for existing 3.x metadata.

## Evidence

- Source/gap check:
  `project_memory/runlogs/20260708-283-archimate4-standard-spelling-gap-check.txt`
  - C260 text extraction finds `Stakeholder` and `Course of Action`.
  - The typo/casing forms `Stakholder` and `Course Of Action` were not found in the extracted PDF text.
  - The ArchiMate 4 profile still used `PICTO_STAKHOLDER` and `Course Of Action` before this loop.
- Fix check:
  `project_memory/runlogs/20260708-284-archimate4-standard-spelling-fix-check.txt`
  - `Stakeholder.pictoRef` is `PICTO_STAKEHOLDER`.
  - `CourseOfAction.typeName` is `Course of Action`.
  - `PICTO_STAKEHOLDER` and legacy `PICTO_STAKHOLDER` both resolve through `PathMap`.

## Verification

- `npm run test:language`
  - runlog: `project_memory/runlogs/20260708-285-archimate4-standard-spelling-npm-test-language.txt`
  - result: pass, 77 tests
- ArchiMate 4 changed-file ESLint gate
  - runlog: `project_memory/runlogs/20260708-286-archimate4-standard-spelling-eslint-gate.txt`
  - result: pass
- `git diff --check`
  - runlog: `project_memory/runlogs/20260708-287-archimate4-standard-spelling-git-diff-check.txt`
  - result: pass
- Repository-wide `npm run lint`
  - runlog: `project_memory/runlogs/20260708-288-archimate4-standard-spelling-repo-lint-legacy.txt`
  - result: expected legacy failure, 4467 errors

## Decision

- The ArchiMate 4 profile should use standard display spelling for the user-facing C260 terms.
- The misspelled `PICTO_STAKHOLDER` renderer key remains only as a compatibility alias so existing
  ArchiMate 3.x metadata is not broken.

## Open Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed profile artifact or
  redistributable non-verbatim derived data.
- MEFF 4.0 namespace, junction serialization, and multiplicity attribute names still require the
  official XSD.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

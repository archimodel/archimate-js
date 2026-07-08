# Audit Report: Relationship Role Labels

- Date: 2026-07-08
- Loop: 36
- Result: pass

## Scope

- Updated the connection popup to show C260 direct/reverse relationship role labels.
- Preserved the underlying ArchiMate relationship type in `relationshipType` and `target.type`.
- Cleaned `lib/features/popup-menu/ConnectionOptions.js` so the file itself now passes ESLint.

## Source Evidence

- Initial C260 PDF and implementation gap check: `project_memory/runlogs/20260708-244-relationship-role-label-gap-check.txt`
- Whitespace-normalized C260 source check: `project_memory/runlogs/20260708-251-relationship-role-label-whitespace-source-check.txt`
- Independent `pdfplumber` source check: `project_memory/runlogs/20260708-252-relationship-role-label-pdfplumber-source-check.txt`
- Assignment role-line check: `project_memory/runlogs/20260708-253-relationship-role-label-assignment-line-check.txt`
- Table-line role check: `project_memory/runlogs/20260708-254-relationship-role-label-table-line-check.txt`

## Corrected Labels

- Reverse Composition now uses `Composed in`.
- Reverse Aggregation now uses `Aggregated in`.
- Reverse Assignment now uses `Has assigned`.
- Reverse Specialization now uses `Specialized by`.

These replace the pre-existing source comments `Part of`, `Aggregated by`, `Assigned from`, and `Specialization of`, which were not supported by the C260 table-line extraction used in this loop.

## Verification

- Fix check: `project_memory/runlogs/20260708-245-relationship-role-label-fix-check.txt`
- `npm run test:language`: `project_memory/runlogs/20260708-246-relationship-role-label-npm-test-language.txt` -> pass, 74 tests
- Changed JS ESLint: `project_memory/runlogs/20260708-247-relationship-role-label-eslint-changed-js.txt` -> pass
- ArchiMate 4 gate ESLint: `project_memory/runlogs/20260708-248-relationship-role-label-eslint-archimate4-gate.txt` -> pass
- `git diff --check`: `project_memory/runlogs/20260708-249-relationship-role-label-git-diff-check.txt` -> pass
- Repository-wide lint: `project_memory/runlogs/20260708-250-relationship-role-label-repo-lint-legacy.txt` -> expected legacy fail, 4467 errors
- Final diff check: `project_memory/runlogs/20260708-256-relationship-role-label-final-git-diff-check.txt` -> pass

## Decision

This loop is accepted. It improves specification fidelity, adds tests for the user-facing role labels and the corrected reverse labels, and reduces the repository-wide lint backlog by cleaning a touched file.

## Remaining Open Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names still require the official XSD.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

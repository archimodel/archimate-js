# Audit: ArchiMate 4 Remaining Gap Catalog

- Date: 2026-07-09
- Loop: 110
- Stage: remaining_gap_catalog_verified
- Result: pass with known repository-wide legacy lint debt

## Scope

- `lib/metamodel/languages/archimate4-profile.json`
- `lib/metamodel/languages/index.js`
- `test/language-profile.test.mjs`
- `README.md`
- `docs/archimate4/sources.md`
- `docs/archimate4/official-specification.md`
- `docs/superpowers/plans/2026-07-08-archimate-4-support.md`

## Verified Behavior

- `profile.conformance.gapCatalog.expectedIds` records the four residual gaps:
  `officialAppendixBRelationshipMatrix`, `officialMeff4Xsd`, `exactAppendixAArtworkRights`,
  and `w262CompanionPaper`.
- `profile.conformance.gaps` records the same ids in order.
- The first three gaps are marked as official conformance blockers.
- The W262 item is marked as a companion-source gap and is not marked as an official conformance blocker.
- `getArchimate4ImplementationStatus().remainingGaps` is implemented to expose expected/actual/missing/extra ids,
  official blocker alignment, companion-source alignment, and unresolved ids.

## Evidence

- Red test: `project_memory/runlogs/20260709-742-remaining-gap-catalog-red-test.txt` failed before implementation because `gapCatalog` was absent.
- Focused test: `project_memory/runlogs/20260709-743-remaining-gap-catalog-focused-test.txt` passed with 159 tests.
- Full language tests: `project_memory/runlogs/20260709-744-remaining-gap-catalog-test-language.txt` passed with 159 tests.
- Scoped ESLint: `project_memory/runlogs/20260709-745-remaining-gap-catalog-eslint-registry.txt` passed.
- JSON parse check: `project_memory/runlogs/20260709-746-remaining-gap-catalog-json-check.txt` passed.
- Working-tree whitespace check: `project_memory/runlogs/20260709-747-remaining-gap-catalog-diff-check.txt` passed.
- Demo build: `project_memory/runlogs/20260709-748-remaining-gap-catalog-demo-build.txt` compiled successfully.
- Profile identity check: `project_memory/runlogs/20260709-751-remaining-gap-catalog-profile-check.txt` confirmed gap ids, blocker ids, and W262 source id.
- Final JSON check: `project_memory/runlogs/20260709-752-remaining-gap-catalog-final-json-check.txt` passed.
- Final diff check: `project_memory/runlogs/20260709-753-remaining-gap-catalog-final-diff-check.txt` passed with only the existing state JSON line-ending warning.

## Known Non-Blocking Evidence

- `project_memory/runlogs/20260709-750-remaining-gap-catalog-status-api.txt` records that direct Node 24 ESM import of the language index fails because existing JSON imports require import attributes. This is outside the current feature change and is already bypassed by the repository's test and webpack paths.
- `project_memory/runlogs/20260709-749-remaining-gap-catalog-repo-lint.txt` records the repository-wide legacy lint failure with 4383 errors. Scoped ESLint for the ArchiMate 4 implementation files passes.

## Remaining External Dependencies

- Official Appendix B relationship matrix data still requires a licensed, redistributable profile artifact.
- Official MEFF 4.0 XSD remains unavailable from the public XSD directory checked in the previous loop.
- Exact Appendix A vector artwork redistribution remains unconfirmed.
- W262 companion paper PDF remains unavailable locally.

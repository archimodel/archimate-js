# Relationship Profile Loader Audit

- Date: 2026-07-08
- Loop: 5
- Scope: ArchiMate 4 Appendix B replacement boundary and validation contract

## Commands

- `npm run test:language`
  - Log: `project_memory/runlogs/20260708-039-relationship-profile-npm-test-language.txt`
  - Result: pass, 27 tests
- `npx eslint ... test/*.test.mjs`
  - Log: `project_memory/runlogs/20260708-040-relationship-profile-eslint-changed-js.txt`
  - Result: pass
- `git diff --check`
  - Log: `project_memory/runlogs/20260708-041-relationship-profile-git-diff-check.txt`
  - Result: pass
- `Invoke-WebRequest` checks for official XSD URLs
  - Logs:
    - `project_memory/runlogs/20260708-042-archimate-xsd-current-check.txt`
    - `project_memory/runlogs/20260708-043-archimate-xsd-link-list.txt`
  - Result: ArchiMate 4 XSD URLs checked still return 404; 3.1 model XSD returns 200.

## Assertions Covered

- The active ArchiMate 4 relationship matrix remains explicitly marked as a compatibility fallback.
- `setArchimate4RelationshipProfile(profile)` can replace that fallback with externally supplied data.
- External relationship profiles accept nested objects, maps, or row arrays.
- Relationship values accept local one-letter codes or relationship names.
- Unknown element types, generic `Interface`, retired 3.x concepts, and unknown relationship codes are rejected.
- Complete-source coverage can be required for official Appendix B profile artifacts.

## Remaining Issues

- The licensed Appendix B relationship profile artifact itself is not committed because redistribution
  rights are not confirmed.
- MEFF 4.0 XSD remains unavailable from the checked public XSD directory, so XML export stays
  experimental for 4.0.

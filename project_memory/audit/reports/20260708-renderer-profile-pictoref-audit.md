# Audit: Renderer profile pictogram resolution

- Date: 2026-07-08
- Loop: 43
- Scope: `ArchimateRenderer` pictogram lookup for ArchiMate 4 and implementation-defined language profiles.

## Result

- Status: pass
- Change type: specification alignment / profile metadata guard

## Evidence

- Gap check: `project_memory/runlogs/20260708-321-renderer-profile-pictoref-gap-check.txt`
  - Confirmed `ArchimateRenderer` used `getPictoRef(elementType)` without an active language profile.
  - Confirmed the renderer did not inject `languageProfile`.
  - Confirmed ArchiMate 4 profile entries with spelling-sensitive pictogram refs: `PICTO_STAKEHOLDER` and `PICTO_DELIVERABLE`.
- Fix check: `project_memory/runlogs/20260708-322-renderer-profile-pictoref-fix-check.txt`
  - Confirmed `ArchimateRenderer` now injects `languageProfile`.
  - Confirmed pictogram lookup uses `getPictoRef(elementType, profile)`.
- Language tests: `project_memory/runlogs/20260708-323-renderer-profile-pictoref-npm-test-language.txt`
  - `npm run test:language` passed with 79 tests.
- Final language tests: `project_memory/runlogs/20260708-325-renderer-profile-pictoref-final-npm-test-language.txt`
  - `npm run test:language` passed with 79 tests after worklog/state/audit updates.
- Changed-file ESLint: `project_memory/runlogs/20260708-324-renderer-profile-pictoref-eslint-changed.txt`
  - `lib/draw/ArchimateRenderer.js` and `test/language-profile.test.mjs` passed ESLint.
- ArchiMate 4 ESLint gate: `project_memory/runlogs/20260708-326-renderer-profile-pictoref-final-eslint-gate.txt`
  - The ArchiMate 4 implementation/test gate passed.
- Whitespace audit: `project_memory/runlogs/20260708-327-renderer-profile-pictoref-final-git-diff-check.txt`
  - `git diff --check` passed.
- Repository lint baseline: `project_memory/runlogs/20260708-328-renderer-profile-pictoref-repo-lint-legacy.txt`
  - Repo-wide lint remains the known legacy failure outside this feature gate.

## Decision

Rendering should honor the active ArchiMate language profile, not only legacy `ModelUtil` metadata. This ensures ArchiMate 4 spelling-corrected `pictoRef` values and implementation-defined specialized concepts can select their intended pictograms.

## Remaining External Issues

- Official ArchiMate 4 Appendix B relationship rules still require a licensed profile artifact or redistributable non-verbatim derived data.
- MEFF 4.0 namespace, Junction serialization, and multiplicity attribute names still require the official XSD.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed.

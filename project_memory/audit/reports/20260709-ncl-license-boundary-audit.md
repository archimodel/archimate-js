# Audit: ArchiMate 4 NCL License Boundary

Date: 2026-07-09

Result: PASS.

Scope:
- Inspect local ArchiMate 4 Non-Commercial License PDFs without storing license prose.
- Record whether the local license PDFs explicitly clear the Appendix B redistributable-profile blocker or Appendix A exact-artwork-rights blocker.
- Keep license context separate from the C260 implementation coverage and from redistributable source artifacts.

Evidence:
- License boundary scan: `project_memory/runlogs/20260709-2125-archimate4-ncl-license-boundary.json`
- JSON parse check: `project_memory/runlogs/20260709-2126-ncl-license-boundary-json-check.txt`
- Focused source-coverage test: `project_memory/runlogs/20260709-2127-ncl-license-boundary-source-coverage-focused-test.txt`
- Status API sample: `project_memory/runlogs/20260709-2128-ncl-license-boundary-status-api.json`
- Final JSON parse check: `project_memory/runlogs/20260709-2129-ncl-license-boundary-final-json-check.txt`
- Changed-file ESLint: `project_memory/runlogs/20260709-2130-ncl-license-boundary-eslint-changed.txt`
- Diff whitespace check: `project_memory/runlogs/20260709-2131-ncl-license-boundary-diff-check.txt`
- Full language test: `project_memory/runlogs/20260709-2132-ncl-license-boundary-test-language.txt`
- Repo-wide lint baseline: `project_memory/runlogs/20260709-2133-ncl-license-boundary-repo-lint.txt`

Observed:
- The boundary scan records only keyword-presence booleans and contains no raw license text.
- Local NCL PDFs are classified as ArchiMate 4 Non-Commercial License documents.
- The scan records no explicit Appendix B profile redistribution approval.
- The scan records no explicit Appendix A artwork redistribution approval.
- `sourceCoverage.appendixBRelationshipMatrix.localLicenseBoundaryClearsBlocker` remains false.
- `sourceCoverage.appendixAArtworkRights.localLicenseBoundaryClearsBlocker` remains false.
- `npm run test:language` passed with 223 tests.
- Changed-file ESLint passed for `test/language-profile.test.mjs`.
- `git diff --check` passed.
- Repo-wide `npm run lint` remains the known legacy failure with 4382 existing errors.

Status decision:
- The local NCL PDFs are license-boundary context only.
- Appendix B still requires an official or redistributable relationship profile artifact.
- Appendix A exact vector artwork rights still require confirmation or an approved artwork source.

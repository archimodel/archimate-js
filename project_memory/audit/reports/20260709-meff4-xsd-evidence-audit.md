# 20260709 MEFF 4 XSD evidence audit

## Scope

- Refresh the official ArchiMate XSD directory evidence for the MEFF 4.0 exchange-format boundary.
- Keep the ArchiMate 4 XML status experimental until an official 4.0 XSD is available or supplied.
- Expose the evidence through `getArchimate4ImplementationStatus()` via the profile source coverage
  metadata.

## Source Evidence

- `project_memory/runlogs/20260709-606-meff4-xsd-current-recheck.txt` records the current official
  directory and candidate URL checks.
- `https://www.opengroup.org/xsd/archimate/` returned HTTP 200 and listed the 3.1 Model, View, and
  Diagram XSD links.
- Tested 4.0 directory and Model/Diagram/View XSD candidate URLs returned 404.
- Known 3.1 Model, Diagram, and View XSD URLs returned HTTP 200.

## Implementation Evidence

- `lib/metamodel/languages/archimate4-profile.json` now records `sourceCoverage.meff4Xsd` evidence:
  `lastCheckedAt`, `lastRunlogPath`, `directoryStatusCode`, discovered XSD links,
  `official4XsdDiscovered: false`, and candidate status codes.
- `docs/archimate4/sources.md` and `docs/archimate4/official-specification.md` reference the refreshed
  runlog and keep MEFF 4.0 exchange conformance source-dependent.
- `test/language-profile.test.mjs` verifies the profile metadata and source ledger reference.

## Verification

- `project_memory/runlogs/20260709-607-meff4-xsd-evidence-test.txt`: focused
  `node --test test/language-profile.test.mjs` passed.
- `project_memory/runlogs/20260709-608-meff4-xsd-evidence-test-language.txt`:
  `npm run test:language` passed with 157 tests.
- `project_memory/runlogs/20260709-609-meff4-xsd-evidence-eslint-registry.txt`: registry scoped
  ESLint passed.
- `project_memory/runlogs/20260709-610-meff4-xsd-evidence-json-check.txt`: JSON parse check passed.
- `project_memory/runlogs/20260709-611-meff4-xsd-evidence-diff-check.txt`: `git diff --check`
  passed before record updates.
- `project_memory/runlogs/20260709-612-meff4-xsd-evidence-demo-build.txt`: `npm run demo:build`
  passed.
- `project_memory/runlogs/20260709-613-meff4-xsd-evidence-repo-lint.txt`: repo-wide lint remains
  the known legacy failure with 4383 errors.
- `project_memory/runlogs/20260709-614-meff4-xsd-evidence-final-json-check.txt`: final JSON parse
  check passed after record updates.
- `project_memory/runlogs/20260709-615-meff4-xsd-evidence-final-diff-check.txt`: final
  `git diff --check` passed after record updates.

## Result

Pass for the scoped MEFF 4 XSD evidence status guard.

## Remaining External Blockers

- Official MEFF 4.0 XSD remains unavailable from the checked public directory and candidate URLs.
- Official Appendix B relationship matrix data remains external-source dependent.
- W262 PDF is still not present locally.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

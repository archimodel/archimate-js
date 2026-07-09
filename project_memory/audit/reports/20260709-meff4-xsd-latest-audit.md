# Audit: Latest MEFF 4.0 XSD Evidence

- Loop: 109
- Stage: `meff4_xsd_latest_recheck_verified`
- Result: pass

## Scope

This audit refreshes the official The Open Group XSD directory evidence used by
`sourceCoverage.meff4Xsd`.

## Source Check

- Runlog: `project_memory/runlogs/20260709-731-meff4-xsd-latest-recheck.txt`
- Directory: `https://www.opengroup.org/xsd/archimate/`
- Directory status: 200
- Discovered XSD links:
  - `3.1/archimate3_Diagram.xsd`
  - `3.1/archimate3_Model.xsd`
  - `3.1/archimate3_View.xsd`
- Tested 4.0 candidates:
  - `https://www.opengroup.org/xsd/archimate/4.0/` -> 404
  - `https://www.opengroup.org/xsd/archimate/4.0/archimate4_Model.xsd` -> 404
  - `https://www.opengroup.org/xsd/archimate/4.0/archimate4_Diagram.xsd` -> 404
  - `https://www.opengroup.org/xsd/archimate/4.0/archimate4_View.xsd` -> 404
  - `https://www.opengroup.org/xsd/archimate/4.0/archimate4.xsd` -> 404
  - `https://www.opengroup.org/xsd/archimate/4.0/archimate4_ModelExchangeFile.xsd` -> 404

## Changes Audited

- `lib/metamodel/languages/archimate4-profile.json` now points
  `sourceCoverage.meff4Xsd.lastRunlogPath` at the latest recheck and records the extra tested 4.0
  candidate URLs.
- `test/language-profile.test.mjs` guards the latest runlog path and additional 404 candidate
  statuses.
- `docs/archimate4/sources.md` and `docs/archimate4/official-specification.md` document the latest
  official directory evidence.

## Evidence

- Red test: `project_memory/runlogs/20260709-732-meff4-xsd-latest-red-test.txt`
  - Expected failure: profile still pointed at the previous XSD recheck runlog.
- Focused test: `project_memory/runlogs/20260709-733-meff4-xsd-latest-focused-test.txt`
  - Result: pass, 158 tests.
- Full language tests: `project_memory/runlogs/20260709-734-meff4-xsd-latest-test-language.txt`
  - Result: pass, 158 tests.
- Scoped ESLint: `project_memory/runlogs/20260709-735-meff4-xsd-latest-eslint-registry.txt`
  - Result: pass.
- JSON parse: `project_memory/runlogs/20260709-736-meff4-xsd-latest-json-check.txt`
  - Result: pass.
- Diff whitespace check: `project_memory/runlogs/20260709-737-meff4-xsd-latest-diff-check.txt`
  - Result: pass.
- Demo build: `project_memory/runlogs/20260709-738-meff4-xsd-latest-demo-build.txt`
  - Result: pass.
- Final JSON parse: `project_memory/runlogs/20260709-740-meff4-xsd-latest-final-json-check.txt`
  - Result: pass.
- Final diff whitespace check: `project_memory/runlogs/20260709-741-meff4-xsd-latest-final-diff-check.txt`
  - Result: pass.
- Repository-wide lint: `project_memory/runlogs/20260709-739-meff4-xsd-latest-repo-lint.txt`
  - Result: expected fail with 4383 existing errors outside this feature gate.

## Decision

MEFF 4.0 XML exchange remains external-source-dependent. No official 4.0 XSD link was discovered in
the latest official directory recheck, and every tested 4.0 candidate URL returned 404.

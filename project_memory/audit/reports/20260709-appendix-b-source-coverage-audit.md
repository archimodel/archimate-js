# Audit Report: Appendix B Source Coverage Status

- Date: 2026-07-09
- Loop: 100
- Branch: `codex/archimate-4-support`
- Change type: feature metadata/docs/test guard

## Scope

- Clarify `sourceCoverage.appendixBRelationshipMatrix` so it distinguishes the reviewed local C260
  source from the absent redistributable Appendix B relationship profile artifact.
- Record that the external relationship profile loader, profile status API, and profile coverage
  report API are implemented.
- Keep the normative Appendix B matrix data external; no licensed table content is embedded.

## Changed Files

- `lib/metamodel/languages/archimate4-profile.json`
- `test/language-profile.test.mjs`
- `docs/archimate4/sources.md`
- `docs/archimate4/official-specification.md`
- `README.md`
- `project_memory/state/aria_state.json`
- `project_memory/logs/worklog.md`

## Verification

- Red test: `project_memory/runlogs/20260709-616-appendix-b-source-coverage-red-test.txt` failed
  before the metadata fields existed.
- Focused source-coverage test: `project_memory/runlogs/20260709-617-appendix-b-source-coverage-test.txt`
  passed.
- Full language tests: `project_memory/runlogs/20260709-618-appendix-b-source-coverage-test-language.txt`
  passed with 157 tests.
- Registry scoped ESLint: `project_memory/runlogs/20260709-619-appendix-b-source-coverage-eslint-registry.txt`
  passed.
- JSON parse check: `project_memory/runlogs/20260709-620-appendix-b-source-coverage-json-check.txt`
  passed.
- `git diff --check`: `project_memory/runlogs/20260709-621-appendix-b-source-coverage-diff-check.txt`
  passed.
- Demo build: `project_memory/runlogs/20260709-622-appendix-b-source-coverage-demo-build.txt`
  passed.

## Known Non-Blocking Failure

- Repository-wide `npm run lint` remains the expected legacy failure outside this feature scope:
  `project_memory/runlogs/20260709-623-appendix-b-source-coverage-repo-lint.txt` reports 4383 existing
  errors.

## Remaining External Blockers

- Official Appendix B relationship matrix data still requires a licensed profile artifact or
  redistributable non-verbatim derived package.
- MEFF 4.0 XSD is still unavailable from the checked public XSD directory.
- W262 PDF is still not present locally.
- Exact Appendix A vector artwork redistribution rights remain unconfirmed.

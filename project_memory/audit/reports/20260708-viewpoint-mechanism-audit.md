# 2026-07-08 Viewpoint Mechanism Audit

- loop_id: 22
- stage: viewpoint_mechanism_metadata_verified
- change_type: feature
- scope: C260 Chapter 13 viewpoint mechanism metadata support for ArchiMate 3/4 moddle descriptors and implementation-defined ArchiMate language profiles.

## Source Trace

- Local C260 PDF keyword scan and official 3.1 View XSD derived facts are recorded in `project_memory/runlogs/20260708-142-viewpoint-mechanism-source-check.txt`.
- Official 3.1 View XSD facts used here: `View.viewpoint`, `View.viewpointRef`, model-level viewpoint definitions, concerns, stakeholders, purpose/content metadata, allowed element/relationship type metadata, and modeling notes.
- C260 PDF facts used here: the conformance/profile material includes the viewpoint mechanism and Chapter 13 covers views, viewpoints, stakeholders, concerns, purpose, content, and notation topics.
- No normative prose or example viewpoint list is committed as source data.

## Implemented Surface

- `lib/moddle/resources/archimate3.json` preserves optional viewpoint definitions and view-level viewpoint metadata.
- `lib/moddle/resources/archimate4.json` preserves optional viewpoint definitions and view-level viewpoint metadata while retaining prior ArchiMate 4 relationship endpoint changes.
- `lib/metamodel/languages/index.js` accepts implementation-defined `archimateLanguageProfile.viewpoints` entries and validates viewpoint purpose/content tokens.
- `test/xml-roundtrip.test.mjs` now verifies descriptor metadata and actual moddle-xml `viewpointRef` resolution.
- README and `docs/archimate4/*` document the supported mechanism and MEFF 4.0 XSD boundary.

## Checks

- PASS: `npm run test:language` in `project_memory/runlogs/20260708-143-viewpoint-mechanism-npm-test-language.txt` passed with 60 tests.
- PASS: changed-file ESLint in `project_memory/runlogs/20260708-144-viewpoint-mechanism-eslint-changed-js.txt` exited 0.
- PASS: descriptor JSON parse in `project_memory/runlogs/20260708-145-viewpoint-mechanism-descriptor-json-parse.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260708-146-viewpoint-mechanism-git-diff-check.txt` exited 0.
- EXPECTED LEGACY FAIL: repo-wide `npm run lint` in `project_memory/runlogs/20260708-147-viewpoint-mechanism-repo-lint-legacy.txt` exited 1 on existing unrelated lint violations.
- PASS: final state check is recorded in `project_memory/runlogs/20260708-148-viewpoint-mechanism-final-state-check.txt`.

## Decision

- The implementation supports the viewpoint mechanism as metadata preservation plus implementation-defined profile configuration.
- Example viewpoints remain informative and are not embedded as normative repository data.
- Official ArchiMate 4 exchange conformance for this serialization surface still depends on the MEFF 4.0 XSD.

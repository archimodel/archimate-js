# worklog (LDD)

## 2026-07-08 loop 1

- Goal: implement ArchiMate 4 support from `docs/superpowers/plans/2026-07-08-archimate-4-support.md`.
- Branch: `codex/archimate-4-support`.
- Initial assumption: C260/W262 licensed source text is not present locally; implementation will keep 4.0 XML/relationship conformance explicitly experimental until official source/XSD is supplied.
- Implemented versioned language profiles, moddle descriptor split, version-aware model template, language profile DI service, fallback 4.0 relationship maps, 3.x to 4.0 migration utility, profile-driven palette, multiplicity rendering/editing/persistence, tests, README, and changelog notes.
- Verification: `npm run test:language` passed with 16 tests. Changed-file `npx eslint` passed after applying mechanical lint fixes to implementation files.
- Repository-wide lint/all: final `npm run all` still fails on legacy repo-wide lint issues unrelated to the ArchiMate 4 implementation; recorded in `project_memory/runlogs/20260708-012-final-npm-run-all.txt`.

## 2026-07-08 loop 2

- Goal: add an official ArchiMate 3.1 XSD `ElementTypeEnum` diff test and make `AndJunction` / `OrJunction` usable while ArchiMate 4 source material remains pending.
- Observation: `https://www.opengroup.org/xsd/archimate/3.1/archimate3_Model.xsd` returned 200 and exposes 62 `ElementTypeEnum` values, including `AndJunction` and `OrJunction`; recorded in `project_memory/runlogs/20260708-021-official-31-xsd-element-type-enum.txt`.
- Implemented: added `test/fixtures/archimate3-element-type-enum.json`, profile exact-match tests, XSD-name implementation tests, ArchiMate 3 profile entries, official XSD constants, display metadata, 40x40 junction shape sizing, renderer support, pictograms, and palette CSS aliases.
- Verification: `npm run test:language` passed with 19 tests in `project_memory/runlogs/20260708-023-junction-final2-npm-test-language.txt`.
- Static checks: changed JS `npx eslint` passed in `project_memory/runlogs/20260708-024-junction-final2-eslint-js-changed-files.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-025-junction-final2-git-diff-check.txt`.
- Post-audit check: `git diff --check` passed again after state/worklog/audit updates in `project_memory/runlogs/20260708-022-junction-post-audit-git-diff-check.txt`.
- Note: `project_memory/runlogs/20260708-015-junction-eslint-changed-files.txt` is a failed exploratory lint run with an invalid scope that included markdown/css/json and pre-fix `Concept.js`; the final scoped JS lint passed.

## 2026-07-08 loop 3

- Goal: review the supplied ArchiMate 4 specification PDF and launch transcript, then convert them into an implementation-facing specification.
- Source observation: `C:\Users\syska\Downloads\978940181474E.pdf` is `ArchiMate 4 Specification`, The Open Group C260, April 2026, 207 pages; metadata recorded in `project_memory/runlogs/20260708-026-archimate4-pdf-extract.txt`.
- Source observation: the supplied transcript corroborates the 60-to-42 simplification, domain terminology, behavior/role/collaboration generalization, and multiplicity as the main new feature; compact facts recorded in `project_memory/runlogs/20260708-027-archimate4-source-facts.txt`.
- Implemented docs: added `docs/archimate4/official-specification.md` as a non-verbatim derived implementation spec and updated `docs/archimate4/sources.md`.
- Key finding: the current experimental profile is not fully C260-aligned because generic `Interface` is not an ArchiMate 4 element, while `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` remain official domain-specific elements.
- Open implementation issues: correct the ArchiMate 4 profile/migration mappings, replace compatibility-derived relationship rules with Appendix B-derived data or a licensed external profile loader, and confirm MEFF 4.0 XML details from the official XSD.
- Verification: `npm run test:language` passed with 19 tests in `project_memory/runlogs/20260708-028-archimate4-spec-npm-test-language.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-029-archimate4-spec-git-diff-check.txt`; copyright watermark scan passed in `project_memory/runlogs/20260708-030-archimate4-spec-copyright-scan.txt`.

## 2026-07-08 loop 4

- Goal: correct the ArchiMate 4 implementation against the C260-derived 42-element catalog.
- Implemented: removed non-standard generic `Interface` from the ArchiMate 4 profile surface, restored `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface`, removed the incorrect interface migration, and removed unused generic interface constant/CSS.
- Implemented: corrected C260 classifications for composite/passive elements in `archimate4-profile.json`, including `Grouping`, `Location`, `Product`, `Deliverable`, and `Plateau`.
- Added tests: `test/fixtures/archimate4-c260-element-catalog.json` and assertions for exact 42-element catalog matching, domain/aspect matching, and interface preservation.
- Verification: `npm run test:language` passed with 22 tests in `project_memory/runlogs/20260708-036-c260-profile-final-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-037-c260-profile-final-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-038-c260-profile-final-git-diff-check.txt`; catalog audit passed in `project_memory/runlogs/20260708-035-c260-profile-catalog-audit.txt`.
- Remaining open issues: Appendix B relationship rules are still fallback-derived, and MEFF 4.0 XSD is still needed for namespace, schema location, Junction serialization, and multiplicity attribute names.

## 2026-07-08 loop 5

- Goal: make the ArchiMate 4 Appendix B relationship matrix replacement point executable without committing licensed table data.
- Implemented: added `lib/metamodel/languages/relationship-profile-loader.js` to normalize external relationship profiles from nested objects, maps, or row arrays.
- Implemented: exposed `setArchimate4RelationshipProfile(profile)` and `getArchimate4RelationshipProfileStatus()` from the package entrypoint, while keeping the default 4.0 relationship rules explicitly marked as a compatibility fallback.
- Added tests: relationship profile loader accepts relationship names and local one-letter codes, rejects generic `Interface`, retired 3.x concepts, unknown element types, and unknown relationship codes, and can require complete source coverage for licensed Appendix B artifacts.
- Source check: `https://www.opengroup.org/xsd/archimate/` returned 200 and listed 3.1 schema links; `https://www.opengroup.org/xsd/archimate/4.0/` and `https://www.opengroup.org/xsd/archimate/4.0/archimate4_Model.xsd` returned 404; recorded in `project_memory/runlogs/20260708-042-archimate-xsd-current-check.txt` and `project_memory/runlogs/20260708-043-archimate-xsd-link-list.txt`.
- Verification: `npm run test:language` passed with 27 tests in `project_memory/runlogs/20260708-039-relationship-profile-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-040-relationship-profile-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-041-relationship-profile-git-diff-check.txt`.
- Remaining open issues: the actual Appendix B matrix still needs a licensed artifact or redistributable derived data, and MEFF 4.0 XSD details are still unavailable from the checked public directory.

## 2026-07-08 loop 6

- Goal: enforce the C260 rule that relationship-end multiplicity must not be applied when an end is connected to a junction.
- Implemented: added `lib/util/JunctionUtil.js` to centralize `AndJunction` / `OrJunction` detection for diagram elements and imported element refs.
- Implemented: disabled multiplicity popup entries for junction-connected relationships, suppressed import hydration and rendering of multiplicity labels, and prevented persistence/replacement handlers from retaining source/target multiplicity on junction-connected relationships.
- Added tests: helper detection for direct and imported junctions, source-string coverage for popup, updater, replacement, import hydration, and renderer guards.
- Note: `project_memory/runlogs/20260708-045-junction-multiplicity-npm-test-language.txt` and `project_memory/runlogs/20260708-046-junction-multiplicity-npm-test-language.txt` are failed intermediary runs while fixing Node ESM import resolution and updating the ElementFactory assertion to the new guard.
- Verification: `npm run test:language` passed with 30 tests in `project_memory/runlogs/20260708-047-junction-multiplicity-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-048-junction-multiplicity-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-049-junction-multiplicity-git-diff-check.txt`.
- Remaining open issues: Appendix B relationship matrix data and MEFF 4.0 XSD details are still external-source dependent.

## 2026-07-08 loop 7

- Goal: allow a licensed ArchiMate 4 Appendix B relationship profile to be supplied at Modeler/Viewer construction time.
- Implemented: `BaseViewer` now accepts `archimate4RelationshipProfile` and loads it through `setArchimate4RelationshipProfile` only when `archimateVersion` normalizes to `4.0`.
- Implemented: passing `archimate4RelationshipProfile` without ArchiMate 4 mode now throws a clear configuration error.
- Implemented: README documents constructor-time relationship profile loading and the junction exception for multiplicity.
- Maintenance: included `lib/BaseViewer.js` in the changed-file lint gate and fixed legacy BaseViewer lint issues touched by this gate, including the undefined `getDefaultLayer` reference in `saveSVG`.
- Verification: `npm run test:language` passed with 30 tests in `project_memory/runlogs/20260708-053-relationship-profile-option-final-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-052-relationship-profile-option-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-054-relationship-profile-option-git-diff-check.txt`.
- Remaining open issues: Appendix B relationship matrix data and MEFF 4.0 XSD details are still external-source dependent.

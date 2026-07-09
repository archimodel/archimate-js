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

## 2026-07-08 loop 8

- Goal: enforce the C260-derived relationship-end multiplicity notation subset across all non-UI input paths.
- Implemented: added `lib/util/MultiplicityUtil.js` to validate and normalize positive integer, `*`, and finite `n..m` multiplicity values.
- Implemented: import hydration, relationship persistence, relationship replacement, and rendering now normalize multiplicity values before keeping or displaying them.
- Implemented: invalid or unconfirmed values such as `0`, `1..1`, `1..*`, `0..*`, negative ranges, and non-numeric text are ignored.
- Tests: added direct multiplicity notation coverage to `test/multiplicity.test.mjs` and updated source guards to require the new normalization path.
- Docs: updated README and `docs/archimate4/*` with the implemented notation guard and the remaining MEFF 4.0/XSD dependency.
- Verification: `npm run test:language` passed with 31 tests in `project_memory/runlogs/20260708-055-multiplicity-validator-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-056-multiplicity-validator-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-057-multiplicity-validator-git-diff-check.txt`; final post-log `git diff --check` passed in `project_memory/runlogs/20260708-058-multiplicity-validator-final-git-diff-check.txt`.
- Remaining open issues: Appendix B relationship matrix data and MEFF 4.0 XSD details are still external-source dependent.

## 2026-07-08 loop 9

- Goal: ensure ArchiMate 4 relationship editing constraints use the active language profile, not only popup menu display.
- Observation: C260 Appendix B and relationship table locations were confirmed from the supplied PDF in `project_memory/runlogs/20260708-059-pdf-outline-keyword-scan.txt`.
- Implemented: `ArchimateRules` now injects `languageProfile` and passes the active profile into `canConnect()` and `isRelationshipAllowed()` for reconnect validation.
- Implemented: `docs/archimate4/*` now record that popup relationship options and reconnect validation both use the active profile.
- Tests: added source-level coverage that connection rules route relationship checks through the active profile.
- Verification: `npm run test:language` passed with 32 tests in `project_memory/runlogs/20260708-060-profile-aware-rules-npm-test-language.txt`.
- Audit: first changed-file ESLint failed after `lib/features/rules/ArchimateRules.js` entered the lint gate, exposing pre-existing style issues in the touched file; see `project_memory/runlogs/20260708-061-profile-aware-rules-eslint-changed-js.txt`.
- Fix verification: changed-file ESLint passed after formatting the touched file in `project_memory/runlogs/20260708-062-profile-aware-rules-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-063-profile-aware-rules-git-diff-check.txt`; final post-log `git diff --check` passed in `project_memory/runlogs/20260708-064-profile-aware-rules-final-git-diff-check.txt`.
- Remaining open issues: Appendix B relationship matrix data and MEFF 4.0 XSD details are still external-source dependent.

## 2026-07-08 loop 10

- Goal: expose ArchiMate 4 junctions as relationship connectors without corrupting the C260-derived 42-element catalog.
- Implemented: added `AndJunction` and `OrJunction` to `archimate4-profile.json` under `connectors`, not `elements`.
- Implemented: profile-aware metadata lookup and palette generation now include `profile.connectors` in addition to `profile.elements`.
- Implemented: `ColorUtil` maps `Relationships` and legacy `Other` to concrete fill colors so junction connector shapes do not inherit undefined fill color.
- Tests: added coverage that ArchiMate 4 junction connectors remain outside the 42-element catalog while still available to profile metadata and palette code.
- Docs: updated README and `docs/archimate4/*` to record the connector-outside-element-catalog decision.
- Verification: `npm run test:language` passed with 34 tests in `project_memory/runlogs/20260708-065-archimate4-junction-connectors-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-066-archimate4-junction-connectors-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-067-archimate4-junction-connectors-git-diff-check.txt`.
- Note: `project_memory/runlogs/20260708-068-archimate4-junction-connectors-final-npm-test-language.txt` is a failed intermediary attempt to import `PaletteProvider` directly in Node tests; the attempt was reverted because the existing source uses bundler-style extensionless imports.
- Final verification: `npm run test:language` passed with 34 tests in `project_memory/runlogs/20260708-069-archimate4-junction-connectors-final-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-070-archimate4-junction-connectors-final-eslint-changed-js.txt`; final `git diff --check` passed in `project_memory/runlogs/20260708-071-archimate4-junction-connectors-final-git-diff-check.txt`.
- Remaining open issues: Appendix B relationship matrix data and MEFF 4.0 XSD details are still external-source dependent.

## 2026-07-08 loop 11

- Goal: implement the C260-derived rule that relationships joined through a junction must use the same relationship type.
- Source observation: PDF keyword scan recorded relevant C260 pages for junction and migration terms in `project_memory/runlogs/20260708-072-archimate4-pdf-keyword-pages.txt` without committing normative prose.
- Implemented: `JunctionUtil` now derives junction relationship type candidates from existing incoming/outgoing relationship connections.
- Implemented: popup relationship choices and reconnect validation now reject relationship types that conflict with the type already attached to a junction.
- Implemented: generic diagram connection type values are ignored in favor of `relationshipRef.type` when evaluating imported/existing relationship connections.
- Tests: added direct helper coverage for single-type, generic-connection, and mixed-type junction cases, plus source guards for reconnect validation.
- Verification: `npm run test:language` passed with 37 tests in `project_memory/runlogs/20260708-075-junction-relationship-type-guard-final-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-076-junction-relationship-type-guard-final-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-077-junction-relationship-type-guard-git-diff-check.txt`.
- Remaining open issues: direct endpoint validity through a junction still needs Appendix B relationship data or an external profile; MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 12

- Goal: enforce Junction endpoint-chain validity through the active relationship profile without embedding Appendix B table data.
- Implemented: `JunctionUtil` now checks direct endpoint validity for candidate relationships attached to a junction when the opposite side already has non-junction endpoints.
- Implemented: popup relationship choices and reconnect validation pass `isRelationshipAllowed(..., profile)` into the junction guard, so external Appendix B profiles influence endpoint-chain validation.
- Tests: added helper coverage for incoming candidates, outgoing candidates, endpoint-valid chains, endpoint-invalid chains, and active profile propagation.
- Verification: `npm run test:language` passed with 40 tests in `project_memory/runlogs/20260708-078-junction-endpoint-chain-guard-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-079-junction-endpoint-chain-guard-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-080-junction-endpoint-chain-guard-git-diff-check.txt`.
- Remaining open issues: final relationship truth still depends on official Appendix B data or an externally supplied profile; MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 13

- Goal: improve the externally supplied Appendix B relationship profile path without embedding licensed C260 table data.
- Source check: refreshed the official XSD directory snapshot in `project_memory/runlogs/20260708-081-archimate-xsd-directory-current.html`; candidate MEFF 4.0 XSD paths still returned 404 in `project_memory/runlogs/20260708-084-archimate-xsd-current-head-check.txt`.
- Implemented: `normalizeRelationshipProfile()` now accepts a JSON string profile, parses it, then runs the existing element and relationship-code validation path.
- Implemented: invalid JSON relationship profile text now fails with a clear ArchiMate 4 relationship profile parse error.
- Docs: README and `docs/archimate4/*` now state that host applications may pass a parsed object or JSON string.
- Verification: `npm run test:language` passed with 42 tests in `project_memory/runlogs/20260708-082-relationship-profile-json-string-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-083-relationship-profile-json-string-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-085-relationship-profile-json-string-git-diff-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 14

- Goal: correct the ArchiMate 3.x to 4.0 migration table against C260 Appendix E derived facts from the supplied PDF.
- Source check: a pypdf keyword scan of C260 pages 196-200 recorded only derived migration facts in `project_memory/runlogs/20260708-089-appendix-e-migration-source-check.txt`; no long verbatim C260 text was stored.
- Implemented: `Representation` now migrates to `DataObject` by default and warns that `Artifact` or `Material` may be more precise.
- Implemented: `Gap` now records `Deliverable` as an alternative replacement, and Business/Application/Technology Interaction rows record `Function` as an alternative to the default `Process`.
- Implemented: `ImplementationEvent` now preserves specialization metadata when migrating to `Event`.
- Tests: `test/migration.test.mjs` now directly imports and exercises the migration utility, verifying replacement types and warning alternatives rather than only checking source text.
- Docs: README and `docs/archimate4/*` now document the Appendix E migration correction.
- Verification: `npm run test:language` passed with 44 tests in `project_memory/runlogs/20260708-086-migration-appendix-e-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-087-migration-appendix-e-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-088-migration-appendix-e-git-diff-check.txt`; final diff/state check passed in `project_memory/runlogs/20260708-090-migration-appendix-e-final-diff-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 15

- Goal: implement a narrow C260 Appendix B.6 relationship-concept aggregation rule without embedding the Appendix B table.
- Source check: pypdf/pdfplumber checks of C260 pages 167-170 recorded only derived facts in `project_memory/runlogs/20260708-094-appendix-b6-relationship-concept-aggregation-source-check.txt`.
- Implemented: `JunctionUtil` now exposes a profile-gated ArchiMate 4 helper that allows `Grouping` and `Location` to aggregate relationship concepts, including relationship connections and `AndJunction` / `OrJunction`.
- Implemented: `ArchimateRules` uses the helper during connection create and reconnect validation.
- Implemented: `ConnectionMenuProvider` uses the helper when computing relationship type choices.
- Guardrail: `Plateau` and the rest of Appendix B.6 remain external profile/table-driven; the helper deliberately does not generalize the full table.
- Tests: added direct helper coverage and source guards for the rules/menu integration.
- Docs: README and `docs/archimate4/*` now describe the implemented narrow B.6 guard and remove the earlier over-broad Plateau aggregation wording.
- Verification: `npm run test:language` passed with 46 tests in `project_memory/runlogs/20260708-091-relationship-concept-aggregation-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-092-relationship-concept-aggregation-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-093-relationship-concept-aggregation-git-diff-check.txt`; final diff/state check passed in `project_memory/runlogs/20260708-095-relationship-concept-aggregation-final-diff-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 16

- Goal: persist ArchiMate 3.x specialization/profile migration intent through model properties, not only transient JavaScript fields.
- Source check: C260 specialization-profile pages and the supplied transcript were checked for derived facts; official 3.1 Model XSD was checked for `PropertyDefinitions` and confirmed `Specialization` appears as a relationship type, not a `BaseElement` attribute. See `project_memory/runlogs/20260708-101-specialization-profile-properties-source-check.txt`.
- Implemented: `migrateArchimate3ModelTo4()` now creates stable `PropertyDefinition` entries for `archimate-js:originalArchiMate3Type` and `archimate-js:specialization`.
- Implemented: migrated elements receive `Properties` entries pointing to those definitions, preserving the original 3.x type and specialization profile name in an exchange-friendly structure.
- Implemented: repeated migration calls update existing properties rather than duplicating them.
- Tests: added direct coverage for property definition creation, element property values, idempotency, and `preserveSpecializations: false`.
- Docs: README and `docs/archimate4/*` now state that migration specialization metadata is retained in model properties.
- Verification: `npm run test:language` passed with 48 tests in `project_memory/runlogs/20260708-098-specialization-profile-properties-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-099-specialization-profile-properties-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-100-specialization-profile-properties-git-diff-check.txt`; final diff/state check passed in `project_memory/runlogs/20260708-102-specialization-profile-properties-final-diff-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 17

- Goal: remove the ArchiMate 4 moddle descriptor endpoint limitation that prevented relationship concepts from being used as relationship or diagram connection endpoints.
- Source check: official ArchiMate 3.1 Model and Diagram XSDs were reachable and show endpoint attributes as ID references; the first regex attempt in `project_memory/runlogs/20260708-103-relationship-concept-descriptor-source-check.txt` was too narrow, and the corrected focused extraction is in `project_memory/runlogs/20260708-103b-relationship-concept-descriptor-xsd-snippets.txt`.
- Implemented: `lib/moddle/resources/archimate4.json` now uses `Concept` for `Relationship.source` / `Relationship.target` and `ViewElement` for `Connection.source` / `Connection.target`.
- Guardrail: `lib/moddle/resources/archimate3.json` is intentionally unchanged; tests assert it still uses `BaseElement` and `Node` endpoint constraints.
- Tests: `test/xml-roundtrip.test.mjs` parses descriptors and asserts the ArchiMate 4 abstract endpoint types plus the preserved ArchiMate 3 constraints.
- Docs: `docs/archimate4/*` now record the relationship concept descriptor guard and the XSD-derived endpoint rationale.
- Verification: `npm run test:language` passed with 51 tests in `project_memory/runlogs/20260708-104-relationship-concept-descriptor-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-105-relationship-concept-descriptor-eslint-changed-js.txt`; descriptor JSON parse passed in `project_memory/runlogs/20260708-106-relationship-concept-descriptor-json-parse.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-107-relationship-concept-descriptor-git-diff-check.txt`; final diff/state check passed in `project_memory/runlogs/20260708-108-relationship-concept-descriptor-final-diff-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 18

- Goal: make the external Appendix B relationship profile path capable of carrying C260 Appendix B.6 relationship-concept and junction-concept rows.
- Source check: C260 PDF Appendix B.6 keyword scan recorded only derived facts in `project_memory/runlogs/20260708-112-relationship-profile-concept-types-source-check.txt`.
- Implemented: `archimate4-relationships.js` now validates external profiles against ArchiMate 4 concepts, not just element types: elements, `AndJunction` / `OrJunction`, and relationship types are accepted as source/target keys.
- Tests: `test/relationship-rules.test.mjs` now verifies relationship concepts and junctions can appear in profile maps, and complete profiles must include relationship concept source rows.
- Docs: README and `docs/archimate4/*` now state that external profiles are validated against the full accepted ArchiMate 4 concept set.
- Verification: initial direct-module test import failed under Node's JSON import rules in `project_memory/runlogs/20260708-110-relationship-profile-concept-types-npm-test-language.txt`; the test was corrected to loader execution plus source guards. `npm run test:language` passed with 53 tests in `project_memory/runlogs/20260708-111-relationship-profile-concept-types-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-115-relationship-profile-concept-types-final-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-116-relationship-profile-concept-types-final-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-117-relationship-profile-concept-types-repo-lint-legacy.txt`; final state check passed in `project_memory/runlogs/20260708-118-relationship-profile-concept-types-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 19

- Goal: make complete external Appendix B relationship profiles detect missing source-target cells instead of silently treating omitted cells as disallowed relationships.
- Source check: C260 PDF Appendix B pages were scanned for derived source/target table facts in `project_memory/runlogs/20260708-121-relationship-profile-complete-targets-source-check.txt`.
- Implemented: `normalizeRelationshipProfile()` accepts `requireCompleteTargets` and validates every accepted source-target concept cell when enabled.
- Implemented: `setArchimate4RelationshipProfile()` enables `requireCompleteTargets` by default for the official replacement profile path.
- Implemented: blank row-array cells now preserve their source maps, so a complete profile can represent sources with no allowed outgoing relationships.
- Tests: added complete target-cell coverage checks for object and row-array profile shapes.
- Docs: README and `docs/archimate4/*` now document explicit empty cells for complete external profiles.
- Verification: `npm run test:language` passed with 55 tests in `project_memory/runlogs/20260708-124-relationship-profile-complete-targets-final-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-122-relationship-profile-complete-targets-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-123-relationship-profile-complete-targets-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-125-relationship-profile-complete-targets-repo-lint-legacy.txt`; final state check passed in `project_memory/runlogs/20260708-126-relationship-profile-complete-targets-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 20

- Goal: make the active ArchiMate 4 relationship profile completeness status observable to host applications.
- Implemented: `getArchimate4RelationshipProfileStatus()` now reports concept count, expected complete source-target cell count, load completeness flags, and complete source/target coverage indicators.
- Tests: `test/relationship-rules.test.mjs` now guards the status metadata surface while keeping direct `archimate4-relationships.js` imports out of Node tests because that module imports JSON without a Node assertion.
- Docs: README and `docs/archimate4/*` now state that callers can verify fallback vs externally loaded complete profile status.
- Verification: `npm run test:language` passed with 55 tests in `project_memory/runlogs/20260708-128-relationship-profile-status-metadata-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-129-relationship-profile-status-metadata-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-130-relationship-profile-status-metadata-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-131-relationship-profile-status-metadata-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-132-relationship-profile-status-metadata-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 21

- Goal: add implementation-defined C260 Chapter 14 language customization support without changing the standard 42-element ArchiMate 4 catalog.
- Source check: local C260 keyword scan recorded only derived language customization facts in `project_memory/runlogs/20260708-133-language-customization-source-scan.txt`; XSD availability was refreshed in `project_memory/runlogs/20260708-139-archimate-xsd-current-head-check.txt`.
- Implemented: `createLanguageProfile(version, customization)` and `archimateLanguageProfile` allow custom domains, attributes, and specialized element/connector metadata.
- Implemented: new custom concepts must declare `specializes`; relationship validation resolves specialized source and target concepts to their standard base concept, so custom specializations inherit base relationship constraints.
- Implemented: custom domain colors are used when creating shapes through the active language profile.
- Docs: README and `docs/archimate4/*` now document the implementation-defined customization contract and MEFF/XSD boundary.
- Verification: `npm run test:language` passed with 56 tests in `project_memory/runlogs/20260708-137-language-customization-profile-final-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-138-language-customization-profile-final-eslint-changed-js.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-140-language-customization-profile-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-141-language-customization-profile-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 22

- Goal: add C260 Chapter 13 viewpoint mechanism metadata support without embedding informative example viewpoint definitions as normative data.
- Source check: local C260 PDF keyword scan and official 3.1 View XSD checks recorded only derived facts in `project_memory/runlogs/20260708-142-viewpoint-mechanism-source-check.txt`.
- Implemented: ArchiMate 3 and ArchiMate 4 moddle descriptors now preserve `View.viewpoint`, `View.viewpointRef`, and a model-level viewpoint definition container with concerns, stakeholders, purpose, content, allowed element/relationship types, and modeling notes.
- Implemented: `archimateLanguageProfile.viewpoints` accepts implementation-defined viewpoint definitions, and purpose/content tokens are validated against the official 3.1 XSD-derived token sets.
- Tests: descriptor coverage was extended, and an actual `moddle-xml` test now verifies that `viewpointRef` resolves to a model-defined viewpoint.
- Docs: README and `docs/archimate4/*` now describe the supported viewpoint mechanism and the MEFF 4.0 XSD boundary.
- Verification: `npm run test:language` passed with 60 tests in `project_memory/runlogs/20260708-143-viewpoint-mechanism-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-144-viewpoint-mechanism-eslint-changed-js.txt`; descriptor JSON parse passed in `project_memory/runlogs/20260708-145-viewpoint-mechanism-descriptor-json-parse.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-146-viewpoint-mechanism-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-147-viewpoint-mechanism-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-148-viewpoint-mechanism-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 23

- Goal: prevent ArchiMate 4 profile pictogram references from silently falling back to the generic renderer object path.
- Source check: local C260 Appendix A / notation keyword scan recorded only derived facts in `project_memory/runlogs/20260708-155-archimate4-pictoref-source-check.txt`.
- Observation: initial gap check found 18 ArchiMate 4 profile `pictoRef` values missing from `lib/draw/PathMap.js`; see `project_memory/runlogs/20260708-149-archimate4-pictoref-gap-check.txt`.
- Implemented: `PathMap` now registers explicit aliases for every missing ArchiMate 4 `pictoRef`, using existing renderer paths while exact C260 vector artwork remains a source/licensing decision.
- Tests: `test/language-profile.test.mjs` now verifies that every ArchiMate 4 profile element and connector references a defined renderer path key.
- Docs: `docs/archimate4/sources.md` now records the pictogram coverage guard and artwork redistribution boundary.
- Verification: alias check passed with 0 missing refs in `project_memory/runlogs/20260708-150-archimate4-pictoref-alias-check.txt`; `npm run test:language` passed with 61 tests in `project_memory/runlogs/20260708-151-archimate4-pictoref-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-152-archimate4-pictoref-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-153-archimate4-pictoref-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-154-archimate4-pictoref-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-156-archimate4-pictoref-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 24

- Goal: correct the ArchiMate 4 `Deliverable` pictogram reference spelling while preserving legacy compatibility.
- Source check: local C260-derived catalog and PDF keyword scan recorded only derived facts in `project_memory/runlogs/20260708-162-archimate4-deliverable-pictoref-source-check.txt`.
- Observation: initial check found the ArchiMate 4 `Deliverable` profile entry using `PICTO_DELIVRABLE`; see `project_memory/runlogs/20260708-157-archimate4-deliverable-pictoref-gap-check.txt`.
- Implemented: `archimate4-profile.json` now uses `PICTO_DELIVERABLE`; `PathMap` defines that key and keeps `PICTO_DELIVRABLE` as a legacy alias for existing 3.x metadata.
- Tests: `test/language-profile.test.mjs` now verifies the ArchiMate 4 `Deliverable` pictogram reference spelling.
- Docs: `docs/archimate4/sources.md` now records the spelling guard and compatibility alias.
- Verification: fix check passed in `project_memory/runlogs/20260708-158-archimate4-deliverable-pictoref-fix-check.txt`; `npm run test:language` passed with 62 tests in `project_memory/runlogs/20260708-159-archimate4-deliverable-pictoref-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-160-archimate4-deliverable-pictoref-eslint-changed-js.txt`; JSON parse passed in `project_memory/runlogs/20260708-161-archimate4-deliverable-pictoref-json-parse.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-163-archimate4-deliverable-pictoref-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-164-archimate4-deliverable-pictoref-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-165-archimate4-deliverable-pictoref-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 25

- Goal: preserve ArchiMate 4 domain terminology in runtime shape metadata while keeping `layer` as a compatibility alias.
- Source/XSD check: current official XSD status was refreshed in `project_memory/runlogs/20260708-166-archimate-xsd-current-head-check.txt` and `project_memory/runlogs/20260708-167-archimate-xsd-current-link-scan.txt`; public MEFF 4.0 XSD candidates still returned 404 while the 3.1 model XSD returned 200.
- Observation: initial gap check found `ElementFactory` using the profile-derived value only as `layer`, with no `domain` metadata helper; see `project_memory/runlogs/20260708-168-domain-terminology-gap-check.txt`.
- Implemented: `ModelUtil.getDomainType()` returns profile domain metadata, and `ElementFactory` stores `domain` on created/imported shapes while retaining `layer` for existing renderer/extension compatibility.
- Implemented: default element color lookup now prefers `domain` and falls back to `layer`.
- Docs: `docs/archimate4/*` and `CHANGELOG.md` now record domain metadata preservation.
- Verification: `npm run test:language` passed with 63 tests in `project_memory/runlogs/20260708-169-domain-terminology-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-170-domain-terminology-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-171-domain-terminology-git-diff-check.txt`; fix check passed in `project_memory/runlogs/20260708-172-domain-terminology-fix-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-173-domain-terminology-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-174-domain-terminology-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 26

- Goal: make the external Appendix B profile path accept a header-row matrix array so a licensed relationship table can be supplied without committing it.
- Observation: initial check rejected matrix rows because relationship profile arrays only accepted row objects; see `project_memory/runlogs/20260708-175-appendix-b-matrix-profile-gap-check.txt`.
- Implemented: `relationship-profile-loader.js` now normalizes direct matrix arrays or `{ matrix }` profiles into the existing row-object source-target cell contract.
- Implemented: empty matrix cells count as present source-target cells for complete target validation while still representing disallowed relationships.
- Docs: README and `docs/archimate4/*` now document matrix input for host-supplied licensed Appendix B data.
- Verification: fix check passed in `project_memory/runlogs/20260708-176-appendix-b-matrix-profile-fix-check.txt`; `npm run test:language` passed with 64 tests in `project_memory/runlogs/20260708-177-appendix-b-matrix-profile-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-178-appendix-b-matrix-profile-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-179-appendix-b-matrix-profile-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-180-appendix-b-matrix-profile-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-181-appendix-b-matrix-profile-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 27

- Goal: make the external Appendix B profile path accept CSV/TSV matrix text so a licensed spreadsheet export can be supplied without committing it.
- Observation: initial check rejected `{ matrixText }` because object keys were interpreted as source concepts; see `project_memory/runlogs/20260708-182-appendix-b-matrix-text-gap-check.txt`.
- Implemented: `relationship-profile-loader.js` now accepts `{ matrixText, matrixDelimiter }`, detects TSV/CSV/semicolon delimiters, supports quoted CSV cells, and feeds parsed rows into the existing matrix normalization path.
- Implemented: JSON string profile handling remains unchanged; matrix text is available only through an object property so raw string profiles still mean JSON.
- Docs: README and `docs/archimate4/*` now document CSV/TSV matrix text input for host-supplied licensed Appendix B data.
- Verification: fix check passed in `project_memory/runlogs/20260708-183-appendix-b-matrix-text-fix-check.txt`; `npm run test:language` passed with 65 tests in `project_memory/runlogs/20260708-184-appendix-b-matrix-text-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-185-appendix-b-matrix-text-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-186-appendix-b-matrix-text-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-187-appendix-b-matrix-text-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-188-appendix-b-matrix-text-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 28

- Goal: separate ArchiMate 4 relationship connector editor grouping from the ArchiMate domain catalog.
- Observation: initial check found `AndJunction` and `OrJunction` carrying `domain: Relationships`; see `project_memory/runlogs/20260708-189-connector-domain-metadata-gap-check.txt`.
- Implemented: `archimate4-profile.json` now stores relationship connector grouping as `paletteGroup` and `colorGroup`, leaving `domain` absent for connectors.
- Implemented: `PaletteProvider` reads `paletteGroup` before domain/layer, and `ModelUtil.getLayerType()` falls back to `colorGroup` for legacy rendering/color paths.
- Docs: `docs/archimate4/*` now state that relationship connectors are not added to the ArchiMate domain catalog.
- Verification: fix check passed in `project_memory/runlogs/20260708-190-connector-domain-metadata-fix-check.txt`; `npm run test:language` passed with 65 tests in `project_memory/runlogs/20260708-191-connector-domain-metadata-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-192-connector-domain-metadata-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-193-connector-domain-metadata-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-194-connector-domain-metadata-repo-lint-legacy.txt`; final state check is recorded in `project_memory/runlogs/20260708-195-connector-domain-metadata-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD details remain external-source dependent.

## 2026-07-08 loop 29

- Goal: refresh official The Open Group XSD evidence for MEFF 4.0-dependent implementation decisions.
- Observation: `project_memory/runlogs/20260708-196-meff4-xsd-official-recheck.txt` records the official ArchiMate XSD directory and known 3.1 XSDs returning 200, while tested 4.0 directory/XSD candidates returned 404.
- Observation: `project_memory/runlogs/20260708-197-meff4-xsd-official-link-scan.txt` records the official directory links; 3.1 resources are listed and no `archimate4` or `4.0` XSD link is listed.
- Docs: `docs/archimate4/sources.md` and `docs/archimate4/official-specification.md` now record this current source state.
- Decision: keep ArchiMate 4 XML export marked experimental and keep MEFF 4.0 namespace, schema location, Junction serialization, and multiplicity attribute names as source-dependent open items.
- Verification: `npm run test:language` passed with 65 tests in `project_memory/runlogs/20260708-198-meff4-xsd-official-recheck-npm-test-language.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-199-meff4-xsd-official-recheck-git-diff-check.txt`; final state check is recorded in `project_memory/runlogs/20260708-200-meff4-xsd-official-recheck-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 30

- Goal: make ArchiMate 4 relationship profile status report actual explicit source-target cell coverage for host-supplied Appendix B profiles.
- Observation: the gap check in `project_memory/runlogs/20260708-201-relationship-profile-status-coverage-gap-check.txt` showed `completeTargetCoverage` was option-derived and `targetCellCount` was absent.
- Implemented: `relationship-profile-loader.js` now exposes coverage stats that count explicit target cells, including blank/disallowed cells in matrix input.
- Implemented: `getArchimate4RelationshipProfileStatus()` now reports actual `targetCellCount`, `completeSourceCoverage`, and `completeTargetCoverage` from parsed profile coverage.
- Docs: README and `docs/archimate4/*` now document actual target-cell coverage status metadata.
- Verification: fix check passed in `project_memory/runlogs/20260708-202-relationship-profile-status-coverage-fix-check.txt`; `npm run test:language` passed with 66 tests in `project_memory/runlogs/20260708-203-relationship-profile-status-coverage-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-204-relationship-profile-status-coverage-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-205-relationship-profile-status-coverage-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-206-relationship-profile-status-coverage-repo-lint-legacy.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 31

- Goal: preserve original ArchiMate 3.x domain metadata during 3.x to 4.0 migration for retired, merged, or moved concepts.
- Observation: the gap check in `project_memory/runlogs/20260708-208-migration-original-domain-gap-check.txt` showed `BusinessService` migrated to `Service` with original type and specialization metadata, but without `archimate-js:originalArchiMate3Domain`.
- Implemented: `retired-concepts.js` now records `originalDomain` for migration entries, including merged common-domain concepts and moved `Path`.
- Implemented: `migrateArchimate3ModelTo4()` now stores `originalArchiMate3Domain`, model property metadata, and warning `originalDomain` when metadata preservation is enabled.
- Docs: README and `docs/archimate4/*` now state that migration preserves original domain metadata.
- Verification: fix check passed in `project_memory/runlogs/20260708-209-migration-original-domain-fix-check.txt`; `npm run test:language` passed with 68 tests in `project_memory/runlogs/20260708-210-migration-original-domain-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-211-migration-original-domain-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-212-migration-original-domain-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-213-migration-original-domain-repo-lint-legacy.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 32

- Goal: let 3.x to 4.0 migration validate migrated relationship types against a host-supplied Appendix B-aware validator.
- Observation: the gap check in `project_memory/runlogs/20260708-215-migration-relationship-validation-gap-check.txt` showed a `Composition` relationship remained after `BusinessRole` was migrated to `Role`, with no relationship-level warning.
- Implemented: `migrateArchimate3ModelTo4()` now accepts `isRelationshipAllowed`, `relationshipProfile`, `invalidRelationshipReplacement`, and `replaceInvalidRelationships` options.
- Implemented: when a migrated relationship is disallowed by the supplied validator, migration records source/target/relationship details and replaces the relationship with `Association` by default.
- Docs: README and `docs/archimate4/*` now document external-profile-driven relationship migration validation.
- Verification: fix check passed in `project_memory/runlogs/20260708-216-migration-relationship-validation-fix-check.txt`; `npm run test:language` passed with 70 tests in `project_memory/runlogs/20260708-217-migration-relationship-validation-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-218-migration-relationship-validation-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-219-migration-relationship-validation-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-220-migration-relationship-validation-repo-lint-legacy.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 33

- Goal: align relationship-end multiplicity normalization with the C260 zero-to-unbounded notation.
- Observation: `project_memory/runlogs/20260708-222-multiplicity-zero-star-gap-check.txt` recorded the local C260 page hit and showed `0..*` was dropped by the current normalizer.
- Implemented: `normalizeRelationshipMultiplicity('0..*')` now canonicalizes to `*`, while non-zero unbounded ranges such as `1..*` and `2..*` remain rejected.
- Docs: README and `docs/archimate4/*` now document `0..*` as an input alias normalized to `*`.
- Verification: fix check passed in `project_memory/runlogs/20260708-223-multiplicity-zero-star-fix-check.txt`; `npm run test:language` passed with 70 tests in `project_memory/runlogs/20260708-224-multiplicity-zero-star-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-225-multiplicity-zero-star-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-226-multiplicity-zero-star-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-227-multiplicity-zero-star-repo-lint-legacy.txt`; final state check passed in `project_memory/runlogs/20260708-228-multiplicity-zero-star-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 34

- Goal: render and edit C260-derived Influence relationship modifier values.
- Observation: `project_memory/runlogs/20260708-229-influence-modifier-gap-check.txt` recorded the local C260 Influence modifier source check and showed the renderer still had a modifier TODO with no popup modifier actions.
- Implemented: Influence relationships now render modifier text from `modifier` or `typeOption` near the relationship midpoint.
- Implemented: the connection popup now includes positive and negative Influence modifier quick actions while preserving arbitrary host-supplied modifier values through relationship properties.
- Docs: README and `docs/archimate4/*` now document the Influence modifier guard.
- Verification: fix check passed in `project_memory/runlogs/20260708-230-influence-modifier-fix-check.txt`; `npm run test:language` passed with 72 tests in `project_memory/runlogs/20260708-231-influence-modifier-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-232-influence-modifier-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-233-influence-modifier-git-diff-check.txt`; repo-wide lint remains the expected legacy failure in `project_memory/runlogs/20260708-234-influence-modifier-repo-lint-legacy.txt`; final state check passed in `project_memory/runlogs/20260708-235-influence-modifier-final-state-check.txt`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 35

- Goal: render optional modeler-supplied Junction names while keeping the `AND` / `OR` marker visible.
- Observation: `project_memory/runlogs/20260708-236-junction-name-gap-check.txt` records local C260 page hits for junction/name terms and shows the current renderer only drew the `AND` / `OR` marker.
- Implemented: `lib/draw/ArchimateRenderer.js` now derives a separate junction display label, suppresses default marker/type names, and renders modeler-supplied junction names below the connector.
- Tests/docs: `test/relationship-rules.test.mjs`, README, and `docs/archimate4/*` now document and guard named junction rendering.
- Verification: fix check passed in `project_memory/runlogs/20260708-237-junction-name-fix-check.txt`; `npm run test:language` passed with 73 tests in `project_memory/runlogs/20260708-238-junction-name-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-239-junction-name-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-240-junction-name-git-diff-check.txt`; repo-wide lint remains the expected legacy failure with 4710 errors in `project_memory/runlogs/20260708-241-junction-name-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-junction-name-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 36

- Goal: use C260 direct/reverse relationship role names as popup menu labels while preserving relationship type values for editing.
- Observation: `project_memory/runlogs/20260708-244-relationship-role-label-gap-check.txt` showed `ConnectionOptions.js` kept role labels only as comments and rendered raw relationship type names; the file also had 243 single-file ESLint errors.
- Source correction: `project_memory/runlogs/20260708-254-relationship-role-label-table-line-check.txt` showed the C260 reverse labels for Composition, Aggregation, Assignment, and Specialization are `Composed in`, `Aggregated in`, `Has assigned`, and `Specialized by`, not the older source comments.
- Implemented: `lib/features/popup-menu/ConnectionOptions.js` now creates direct/reverse menu entries from executable C260 role labels and keeps `relationshipType` plus `target.type` as the standard relationship type.
- Implemented: menu entries are cloned per call before applying menu group names, and the touched file now passes ESLint.
- Tests/docs: `test/relationship-rules.test.mjs`, README, `docs/archimate4/*`, and `project_memory/audit/audit_registry.json` now guard relationship role labels and include `ConnectionOptions.js` in the ArchiMate 4 lint gate.
- Verification: fix check passed in `project_memory/runlogs/20260708-245-relationship-role-label-fix-check.txt`; `npm run test:language` passed with 74 tests in `project_memory/runlogs/20260708-246-relationship-role-label-npm-test-language.txt`; changed JS ESLint passed in `project_memory/runlogs/20260708-247-relationship-role-label-eslint-changed-js.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-248-relationship-role-label-eslint-archimate4-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-249-relationship-role-label-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4467 errors in `project_memory/runlogs/20260708-250-relationship-role-label-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-relationship-role-label-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 37

- Goal: preserve imported and edited relationship option attributes as explicit properties while retaining `typeOption` compatibility.
- Observation: `project_memory/runlogs/20260708-257-relationship-option-hydration-gap-check.txt` showed `Access`, `Association`, and `Influence` relationship refs hydrated several option values only into `typeOption`, while popup and renderer code sometimes read only explicit properties or only `typeOption`.
- Observation: the pre-commit source scan found `ConnectionUpdater` and `ReplaceRelationshipRefHandler` still preferred legacy `typeOption` on some persistence paths, especially the old `connection.modifier || connection.typeOption` fallback.
- Source note: `project_memory/runlogs/20260708-258-access-type-source-check.txt` confirmed Access examples and existing MEFF `accessType` scope, but exact Access-type table wording was not reliably recovered by PDF extraction; no new Access values were invented.
- Implemented: `ElementFactory` now hydrates `accessType`, `isDirected`, and `modifier` explicit connection properties alongside `typeOption`.
- Implemented: `ConnectionMenuProvider` and `ArchimateRenderer` now prefer explicit relationship option properties and fall back to `typeOption` only when the explicit property is absent.
- Implemented: `ConnectionUpdater` and `ReplaceRelationshipRefHandler` now persist relationship option attributes through create/update/replace paths using the same explicit-property-first helper logic.
- Tests/docs: `test/relationship-rules.test.mjs`, README, and `docs/archimate4/*` now guard relationship option hydration and persistence.
- Verification: fix check passed in `project_memory/runlogs/20260708-259-relationship-option-hydration-fix-check.txt`; persistence fix check passed in `project_memory/runlogs/20260708-266-relationship-option-persistence-fix-check.txt`; `npm run test:language` passed with 75 tests in `project_memory/runlogs/20260708-267-relationship-option-persistence-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-268-relationship-option-persistence-eslint-archimate4-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-269-relationship-option-persistence-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4467 errors in `project_memory/runlogs/20260708-270-relationship-option-persistence-repo-lint-legacy.txt`.
- Finalization: state trace passed in `project_memory/runlogs/20260708-264-relationship-option-hydration-final-state-check.txt`; final `git diff --check` passed in `project_memory/runlogs/20260708-265-relationship-option-hydration-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260708-relationship-option-hydration-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 38

- Goal: expose every standard ArchiMate 4 element in the palette, including Common composite `Grouping` and `Location`.
- Observation: `project_memory/runlogs/20260708-275-common-composite-palette-gap-check.txt` showed `Grouping` and `Location` were the only ArchiMate 4 elements with `palette: false`, and their Common Domain palette CSS classes were missing.
- Source checks: MEFF 4.0 XSD remains unavailable in `project_memory/runlogs/20260708-274-meff4-xsd-current-recheck.txt`; C260 PDF did not justify widening multiplicity notation to non-zero unbounded forms in `project_memory/runlogs/20260708-273-multiplicity-unbounded-range-source-check.txt`.
- Implemented: removed the legacy 3.x palette exclusion flag from ArchiMate 4 `Grouping` and `Location` while leaving ArchiMate 3.x profile behavior unchanged.
- Implemented: added `archimate-common-grouping` and `archimate-common-location` palette icon CSS aliases.
- Tests/docs: `test/language-profile.test.mjs`, README, and `docs/archimate4/*` now guard that all 42 standard ArchiMate 4 elements remain palette-visible.
- Verification: fix check passed in `project_memory/runlogs/20260708-276-common-composite-palette-fix-check.txt`; `npm run test:language` passed with 76 tests in `project_memory/runlogs/20260708-277-common-composite-palette-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-278-common-composite-palette-eslint-archimate4-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-279-common-composite-palette-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4467 errors in `project_memory/runlogs/20260708-280-common-composite-palette-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-common-composite-palette-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 39

- Goal: align ArchiMate 4 profile metadata with C260 standard spelling for `Stakeholder` and `Course of Action`.
- Observation: `project_memory/runlogs/20260708-283-archimate4-standard-spelling-gap-check.txt` showed local C260 text extraction finds `Stakeholder` and `Course of Action`, while `Stakholder` and `Course Of Action` were not found.
- Observation: the same gap check showed the ArchiMate 4 profile still used `PICTO_STAKHOLDER` for `Stakeholder` and `Course Of Action` as the `CourseOfAction` display label.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now uses `PICTO_STAKEHOLDER` and `Course of Action` for ArchiMate 4 metadata.
- Implemented: `lib/draw/PathMap.js` defines the correctly spelled `PICTO_STAKEHOLDER` alias and retains the older `PICTO_STAKHOLDER` alias for ArchiMate 3.x compatibility.
- Tests/docs: `test/language-profile.test.mjs` now guards the standard spelling and legacy alias; `docs/archimate4/*` records the source check and derived requirement.
- Verification: fix check passed in `project_memory/runlogs/20260708-284-archimate4-standard-spelling-fix-check.txt`; `npm run test:language` passed with 77 tests in `project_memory/runlogs/20260708-285-archimate4-standard-spelling-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-286-archimate4-standard-spelling-eslint-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-287-archimate4-standard-spelling-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4467 errors in `project_memory/runlogs/20260708-288-archimate4-standard-spelling-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-standard-spelling-metadata-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 40

- Goal: make the C260-derived 42-element catalog verify every ArchiMate 4 user-facing display label.
- Observation: `project_memory/runlogs/20260708-292-archimate4-display-name-catalog-gap-check.txt` showed local C260 text extraction found all 42 expected display labels, while `test/fixtures/archimate4-c260-element-catalog.json` did not yet guard display names.
- Observation: the same gap check showed the current ArchiMate 4 profile had no display-name mismatches, so this loop adds regression coverage rather than changing profile behavior.
- Implemented: `test/fixtures/archimate4-c260-element-catalog.json` now records a `displayNames` map for all 42 C260-derived elements.
- Implemented: `test/language-profile.test.mjs` now asserts each ArchiMate 4 profile `typeName` matches the catalog display name alongside domain and aspect.
- Docs: `docs/archimate4/sources.md` records that the C260-derived fixture now guards element identity, classification, and display labels.
- Verification: fix check passed in `project_memory/runlogs/20260708-293-archimate4-display-name-catalog-fix-check.txt`; `npm run test:language` passed with 77 tests in `project_memory/runlogs/20260708-294-archimate4-display-name-catalog-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-295-archimate4-display-name-catalog-eslint-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-296-archimate4-display-name-catalog-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4467 errors in `project_memory/runlogs/20260708-297-archimate4-display-name-catalog-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-display-name-catalog-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 41

- Goal: align ArchiMate 4 domain and aspect labels with C260-derived wording while preserving 3.x compatibility labels.
- Observation: `project_memory/runlogs/20260708-301-archimate4-domain-aspect-label-source-check.txt` found C260 text hits for `Implementation and Migration Domain`, `Active Structure`, and `Passive Structure`; `Implementation & Migration Domain` and `Physical Domain` were not found.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now uses `Implementation and Migration`, `Active Structure`, and `Passive Structure` for ArchiMate 4 metadata.
- Implemented: `test/fixtures/archimate4-c260-element-catalog.json` now records the C260-derived domain list and aspect list, and classification rows use the same label forms.
- Implemented: `lib/util/ColorUtil.js` adds a fallback color alias for `Implementation and Migration` while leaving the existing 3.x `Implementation & Migration` fallback unchanged.
- Tests/docs: `test/language-profile.test.mjs` now asserts ArchiMate 4 domain and aspect labels against the C260-derived fixture; `docs/archimate4/*` records the source check and label decision.
- Verification: fix check passed in `project_memory/runlogs/20260708-302-archimate4-domain-aspect-label-fix-check.txt`; `npm run test:language` passed with 77 tests in `project_memory/runlogs/20260708-303-archimate4-domain-aspect-label-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-304-archimate4-domain-aspect-label-eslint-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-305-archimate4-domain-aspect-label-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4467 errors in `project_memory/runlogs/20260708-306-archimate4-domain-aspect-label-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-domain-aspect-label-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 42

- Goal: add a direct guard for ArchiMate 3.x Physical concepts that moved into the ArchiMate 4 Technology Domain.
- Observation: `project_memory/runlogs/20260708-311-physical-domain-migration-gap-check.txt` showed ArchiMate 4 has no `Physical` domain entry, while `DistributionNetwork`, `Equipment`, `Facility`, and `Material` remain same-named ArchiMate 4 concepts under the Technology Domain.
- Observation: the same check showed migration behavior was already correct but indirectly covered: it preserved `Physical` as `archimate-js:originalArchiMate3Domain` and did not invent `originalArchiMate3Type` or `specialization`.
- Implemented: `test/migration.test.mjs` now directly asserts the four former Physical concepts keep their same type, store `Physical` as original-domain metadata, and avoid specialization/profile metadata.
- Docs: README and `docs/archimate4/*` now record that these 3.x Physical concepts are retained as ArchiMate 4 Technology Domain concepts while preserving the original domain.
- Verification: fix check passed in `project_memory/runlogs/20260708-312-physical-domain-migration-fix-check.txt`; `npm run test:language` passed with 78 tests in `project_memory/runlogs/20260708-313-physical-domain-migration-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-314-physical-domain-migration-eslint-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-315-physical-domain-migration-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4467 errors in `project_memory/runlogs/20260708-316-physical-domain-migration-repo-lint-legacy.txt`; final post-log checks passed in `project_memory/runlogs/20260708-317-physical-domain-migration-final-npm-test-language.txt`, `project_memory/runlogs/20260708-318-physical-domain-migration-final-eslint-gate.txt`, and `project_memory/runlogs/20260708-319-physical-domain-migration-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260708-physical-domain-migration-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 43

- Goal: make renderer pictogram lookup honor the active ArchiMate language profile.
- Observation: `project_memory/runlogs/20260708-321-renderer-profile-pictoref-gap-check.txt` showed `ArchimateRenderer` used `getPictoRef(elementType)` without injecting `languageProfile`, so rendering fell back to legacy `ModelUtil` metadata even when ArchiMate 4 profile metadata supplied spelling-corrected `pictoRef` values.
- Implemented: `lib/draw/ArchimateRenderer.js` now injects `languageProfile`, captures the active profile, and calls `getPictoRef(elementType, profile)`.
- Tests/docs: `test/language-profile.test.mjs` now guards renderer profile-aware pictogram lookup; README and `docs/archimate4/sources.md` record that renderer pictograms use the active profile.
- Verification: fix check passed in `project_memory/runlogs/20260708-322-renderer-profile-pictoref-fix-check.txt`; `npm run test:language` passed with 79 tests in `project_memory/runlogs/20260708-323-renderer-profile-pictoref-npm-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260708-324-renderer-profile-pictoref-eslint-changed.txt`; final `npm run test:language` passed in `project_memory/runlogs/20260708-325-renderer-profile-pictoref-final-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-326-renderer-profile-pictoref-final-eslint-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-327-renderer-profile-pictoref-final-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4467 errors in `project_memory/runlogs/20260708-328-renderer-profile-pictoref-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-renderer-profile-pictoref-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 44

- Goal: refresh official The Open Group XSD evidence for MEFF 4.0-dependent XML decisions.
- Observation: `project_memory/runlogs/20260708-330-official-xsd-directory-recheck.txt` shows the public ArchiMate XSD directory returned 200 and listed only 3.1 Model, Diagram, and View XSD links.
- Observation: no `4.0` or `archimate4` XSD link was listed, so MEFF 4.0 namespace, schema location, junction serialization, and multiplicity attribute names remain external-source dependent.
- Docs: `docs/archimate4/official-specification.md` now points to the current recheck runlog and keeps XML export marked experimental.
- Verification: `npm run test:language` passed with 79 tests in `project_memory/runlogs/20260708-331-meff4-xsd-current-recheck-npm-test-language.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-332-meff4-xsd-current-recheck-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260708-meff4-xsd-current-recheck-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 45

- Goal: provide browser-visible `Viewer` and `Editor` sample demo pages instead of only the font demo.
- Observation: `project_memory/runlogs/20260708-334-demo-build.txt` showed the repo had `webpack` but not `webpack-cli`, so the demo build script could not run reproducibly until `webpack-cli` was added.
- Implemented: added `demo/viewer.html`, `demo/editor.html`, `demo/demo.css`, `demo/src/*.js`, and `demo/webpack.config.cjs`; added `npm run demo:build`.
- Implemented: Viewer demo instantiates `Viewer`; Editor demo instantiates `Modeler`, shows the palette, and exposes Reset Sample / New Model actions.
- Implemented: sample canvas places 5 ArchiMate 4 concepts and 4 relationships, including an `AndJunction` and a Technology-domain `Equipment` concept.
- Rendering fix: Puppeteer found SVG `rx` / `ry` warnings for C260 aspect labels; `lib/draw/ArchimateRendererUtil.js` now maps `Active Structure`, `Passive Structure`, `Composite`, and `Motivation` to border metadata, and `test/language-profile.test.mjs` guards that ArchiMate 4 catalog aspects have renderer metadata.
- Verification: final build passed in `project_memory/runlogs/20260708-347-demo-final-build.txt`; `npm run test:language` passed with 79 tests in `project_memory/runlogs/20260708-340-demo-language-tests-after-test-fix.txt`; changed-file ESLint passed in `project_memory/runlogs/20260708-345-demo-eslint-changed-js-after-fix.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-346-demo-git-diff-check-after-eslint-fix.txt`; final Puppeteer smoke passed in `project_memory/runlogs/20260708-348-demo-final-puppeteer-smoke.txt`.
- Audit: `project_memory/audit/reports/20260708-viewer-editor-demo-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 46

- Goal: implement the C260 Appendix E-derived migration correction for `Path` aggregation relationships.
- Observation: `docs/archimate4/official-specification.md` already recorded the derived requirement that `Aggregation` from `Path` to a technology internal active structure element should become a reversed `Realization`, but `lib/migration/archimate3-to-4.js` only handled element migrations plus external-profile invalid-relationship replacement.
- Source check: `project_memory/runlogs/20260708-349-path-aggregation-migration-source-check.txt` found the Appendix E vicinity signals for `Path`, `Aggregation`, `Realization`, and technology internal active structure without storing verbatim C260 text.
- Implemented: `migrateArchimate3ModelTo4()` now corrects `Path` -> technology-internal-active-structure `Aggregation` relationships into reversed `Realization` relationships before external Appendix B validation.
- Implemented: migration warnings now record the original relationship type, replacement type, endpoint types, and `reversed: true` for this correction.
- Tests/docs: `test/migration.test.mjs` covers the direct `Path` -> `Node` case, a `TechnologyCollaboration` case after element migration to `Collaboration`, and a non-technology `BusinessCollaboration` case that must not be corrected; `docs/archimate4/*` records the implemented guard.
- Verification: `npm run test:language` passed with 81 tests in `project_memory/runlogs/20260708-350-path-aggregation-migration-npm-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260708-351-path-aggregation-migration-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-352-path-aggregation-migration-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260708-path-aggregation-migration-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 47

- Goal: implement a C260 Appendix E-derived warning for cross-domain service `Realization` migration.
- Observation: `docs/archimate4/official-specification.md` recorded that `Realization` between services of different former layers may need `Specialization` or `Aggregation` depending on modeling intent, but the migration utility preserved such relationships silently.
- Source check: `project_memory/runlogs/20260708-355-service-realization-migration-source-check.txt` found the Appendix E vicinity signals for `Service`, `Realization`, `Specialization`, and `Aggregation` without storing verbatim C260 text.
- Implemented: `migrateArchimate3ModelTo4()` now detects `Realization` between `Service` concepts that originated from different ArchiMate 3 domains and records a model-dependent warning with `Specialization` and `Aggregation` alternatives.
- Implemented: the relationship is preserved by default because the replacement choice depends on model intent; host tooling can suppress this warning path with `warnServiceRealizationAlternatives: false`.
- Tests/docs: `test/migration.test.mjs` covers cross-domain warning behavior, same-domain non-warning behavior, and the suppression option; `docs/archimate4/*` records the implemented guard.
- Verification: `npm run test:language` passed with 83 tests in `project_memory/runlogs/20260708-356-service-realization-migration-npm-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260708-357-service-realization-migration-eslint-changed-js.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-358-service-realization-migration-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260708-service-realization-migration-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 48

- Goal: add a regression guard that proves ArchiMate 3 to 4 migration coverage from the current profile catalogs.
- Observation: `project_memory/runlogs/20260708-366-migration-coverage-gap-check.txt` computed 24 ArchiMate 3 profile element types that are absent from the ArchiMate 4 element/connector catalog, and every type already had a migration row.
- Source check: `project_memory/runlogs/20260708-365-migration-coverage-source-check-display-names.txt` records a local licensed C260 display-name signal check without storing normative prose or tables.
- XSD check: `project_memory/runlogs/20260708-363-official-xsd-directory-recheck.txt` rechecked the official XSD directory at 2026-07-08T20:15:00+09:00 and found 3.1 XSD links only, with no discovered ArchiMate 4 XSD signal.
- Implemented: `test/migration.test.mjs` now dynamically compares the ArchiMate 3 profile against the ArchiMate 4 element/connector catalog and fails if any removed or merged 3.x type lacks an explicit migration row.
- Implemented: the same test fails if any default or alternative migration replacement points to a type absent from the ArchiMate 4 profile.
- Docs: `docs/archimate4/sources.md` and `docs/archimate4/official-specification.md` now record the migration coverage guard and refreshed XSD evidence.
- Verification: `npm run test:language` passed with 85 tests in `project_memory/runlogs/20260708-371-migration-coverage-final-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-372-migration-coverage-final-eslint-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-373-migration-coverage-final-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4431 errors in `project_memory/runlogs/20260708-374-migration-coverage-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-migration-coverage-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 49

- Goal: close the narrow Appendix B.6-derived gap where relationship-concept aggregation supported `Grouping` and `Location` but not `Plateau`.
- Source check: `project_memory/runlogs/20260708-379-plateau-relationship-concept-source-check.txt` recorded local licensed C260 keyword co-occurrence for `Plateau`, `Aggregation`, relationship, and junction context without copying normative prose or tables.
- Implemented: `lib/util/JunctionUtil.js` now includes `Plateau` in the ArchiMate 4 relationship-concept aggregators.
- Tests/docs: `test/multiplicity.test.mjs` now expects `Plateau` to return `Aggregation` for an `AndJunction` target in ArchiMate 4 mode; README and `docs/archimate4/*` record that the narrow helper covers `Grouping`, `Location`, and `Plateau`.
- Verification: `npm run test:language` passed with 85 tests in `project_memory/runlogs/20260708-384-plateau-relationship-concept-final-npm-test-language.txt`; ArchiMate 4 gate ESLint passed in `project_memory/runlogs/20260708-385-plateau-relationship-concept-final-eslint-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-386-plateau-relationship-concept-final-git-diff-check.txt`; repo-wide lint remains expected legacy failure with 4431 errors in `project_memory/runlogs/20260708-387-plateau-relationship-concept-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-plateau-relationship-concept-audit.md`.
- Remaining open issues: official Appendix B relationship data itself, exact C260 Appendix A vector artwork redistribution, and MEFF 4.0 XSD publication/supply remain external-source dependent.

## 2026-07-08 loop 50

- Goal: make the demo pages visible from the font demo and correct the Viewer/Editor samples so the screen shows ArchiMate 4 notation rather than ArchiMate 3.x-looking palette assets.
- Observation: `demo/viewer.html` and `demo/editor.html` already existed and returned HTTP 200, but `archimate-font/lib/demo.html` had no Viewer/Editor navigation and the Editor palette reused Business/Technology colored icons for ArchiMate 4 Common Domain entries.
- Implemented: added `demo/index.html`, added Viewer/Editor links to `archimate-font/lib/demo.html`, and added cache-busted demo CSS links.
- Implemented: `assets/palette-icons.css` now maps Common Domain entries to dedicated `common_*.svg` assets using the Common Domain color; `demo/src/sample-canvas.js` now shows `Role`, `Service`, `Path`, `Grouping`, `AndJunction`, `ApplicationComponent`, and `Equipment`.
- Tests: `test/language-profile.test.mjs` now guards Common Domain palette icons against regression to old Business/Technology assets and verifies the demo sample contains ArchiMate 4 Common Domain concepts.
- Verification: `npm run demo:build` passed in `project_memory/runlogs/20260708-404-demo-archimate4-notation-final-build.txt`; `npm run test:language` passed with 87 tests in `project_memory/runlogs/20260708-405-demo-archimate4-notation-final-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260708-406-demo-archimate4-notation-final-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-407-demo-archimate4-notation-final-git-diff-check.txt`.
- Browser verification: Editor smoke confirmed `ready`, 13 canvas elements, and Common palette entries using `common_*.svg` in `project_memory/runlogs/20260708-408-demo-archimate4-notation-final-browser-smoke.json`; Viewer smoke confirmed `ready` and the same sample labels in `project_memory/runlogs/20260708-409-demo-archimate4-notation-final-viewer-smoke.json`.
- Post-log verification: `npm run test:language` passed with 87 tests in `project_memory/runlogs/20260708-410-demo-archimate4-notation-post-log-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260708-411-demo-archimate4-notation-post-log-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-412-demo-archimate4-notation-post-log-git-diff-check.txt`; state JSON parsed in `project_memory/runlogs/20260708-413-demo-archimate4-notation-state-json-check.txt`; repo-wide lint remains the known legacy 4431-error backlog in `project_memory/runlogs/20260708-414-demo-archimate4-notation-repo-lint-legacy.txt`.
- Final record checks: `git diff --check` passed in `project_memory/runlogs/20260708-415-demo-archimate4-notation-final-final-git-diff-check.txt`; state JSON parsed in `project_memory/runlogs/20260708-416-demo-archimate4-notation-final-state-json-check.txt`.
- Audit: `project_memory/audit/reports/20260708-demo-archimate4-notation-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution remains unconfirmed, so the new Common icons are local visual cues rather than copied standard artwork; official Appendix B relationship data and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-08 loop 51

- Goal: use Fontello to create ArchiMate 4 element icons for `archimate-font`.
- Observation: `archimate-font/lib/config.json` was already a Fontello config with existing tool and relationship glyphs; Fontello CLI smoke passed against the existing config in `project_memory/runlogs/20260708-417-fontello-existing-cli-smoke.txt`.
- Implemented: generated 42 `archimate-element-*` custom Fontello glyphs from the local renderer pictogram paths and added source SVGs under `archimate-font/src/elements/`.
- Implemented: regenerated `archimate-font/lib/config.json`, CSS, demo HTML, and font binaries through Fontello; the demo keeps the Viewer and Editor links.
- Tests: `test/language-profile.test.mjs` now verifies every ArchiMate 4 profile element has a Fontello custom glyph, CSS rule, demo entry, SVG font glyph, and source SVG.
- Verification: `npm run test:language` passed with 88 tests in `project_memory/runlogs/20260708-425-fontello-archimate4-elements-test-language.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-426-fontello-archimate4-elements-git-diff-check.txt`.
- Browser verification: Font demo smoke confirmed 42 element glyph entries, Viewer/Editor links, and loaded `archimate-font` in `project_memory/runlogs/20260708-427-fontello-demo-browser-smoke.json`; screenshot pixel check confirmed representative glyphs rendered in `project_memory/runlogs/20260708-429-fontello-demo-pixel-check.json`.
- Final checks: `npm run test:language` passed with 88 tests in `project_memory/runlogs/20260708-430-fontello-archimate4-elements-final-test-language.txt`; test-file ESLint passed in `project_memory/runlogs/20260708-431-fontello-archimate4-elements-eslint-test-file.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-432-fontello-archimate4-elements-final-git-diff-check.txt`; state JSON parsed in `project_memory/runlogs/20260708-433-fontello-archimate4-elements-state-json-check.txt`.
- Audit: `project_memory/audit/reports/20260708-fontello-archimate4-elements-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution remains unconfirmed; these font icons are derived from existing local renderer pictogram paths rather than copied official artwork.

## 2026-07-08 loop 52

- Goal: make the Viewer/Editor demos and validation behavior depend on whether ArchiMate 3.x or 4.0 is selected.
- Observation: the palette item list was already profile-driven, but ArchiMate 4 entries still carried legacy SVG background images; `Importer` also logged element import failures without surfacing them to the caller.
- Implemented: demo pages now support `?version=3.2` and `?version=4.0`, update sidebar metadata and cross-links, and seed profile-specific samples.
- Implemented: ArchiMate 4 palette entries retain profile-specific semantic classes such as `archimate-common-role` and render with fixed-size SVG background images, while ArchiMate 3.x palette entries retain the existing SVG icons.
- Correction: direct injection of Fontello glyph classes into diagram-js palette cells was removed after browser verification showed the glyphs overflowed and distorted inside the 22px palette boxes; Fontello glyphs remain available in `archimate-font` for the font demo and downstream consumers.
- Implemented: `ElementFactory` rejects unavailable element and relationship types through the active language profile; `Importer` now propagates invalid element/connection import errors instead of swallowing them.
- Tests: `test/language-profile.test.mjs` now guards profile-selected demo samples, keeps Fontello glyph classes out of diagram-js palette cells, and checks active-profile rejection paths.
- Verification: `npm run demo:build` passed in `project_memory/runlogs/20260708-437-profile-versioned-demo-build.txt`; `npm run test:language` passed with 90 tests in `project_memory/runlogs/20260708-434-profile-versioned-demo-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260708-435-profile-versioned-demo-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260708-436-profile-versioned-demo-git-diff-check.txt`.
- Browser verification: 4.0 editor smoke confirmed `archimate-common-role` using `common_role.svg`, no injected Fontello palette classes, and 22px palette sizing; 3.x editor smoke confirmed Business Role using the existing SVG icon in `project_memory/runlogs/20260708-438-profile-versioned-demo-browser-smoke.json` and `project_memory/runlogs/20260708-441-profile-versioned-palette-visual-fix.json`.
- Error verification: browser smoke confirmed 3.x rejects `Role`, 4.0 rejects `BusinessRole`, and viewer import propagates an invalid profile concept error in `project_memory/runlogs/20260708-439-profile-boundary-error-browser-smoke.json`.
- Audit: `project_memory/audit/reports/20260708-profile-versioned-demo-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship data, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-08 loop 53

- Goal: answer and fix the user-observed palette behavior: `editor.html?version=3.2` should keep the original 3.x icons, `editor.html?version=4.0` should not show many repeated fallback icons, and the relationship arrow context-pad action should be clearer.
- Observation: `assets/palette-icons.css` mapped the missing ArchiMate 4 Motivation, Technology, Implementation and Migration, and junction fallback classes to shared assets (`business_object.svg` or `group.svg`), which made the 4.0 palette visually repetitive. 3.2 was already using the original `business_*` assets.
- Implemented: added 18 local SVG palette assets for the missing 4.0 fallback classes and changed `assets/palette-icons.css` so those classes use distinct SVGs. The 3.x `archimate-business-role` and `archimate-business-object` rules were left unchanged.
- Implemented: changed the context-pad relationship and note-connection titles to say that the action is started by dragging to another element.
- Tests: `test/language-profile.test.mjs` now verifies 3.x icon preservation, 4.0 fallback icon separation, local SVG presence, and the context-pad drag tooltip text.
- Verification: `npm run demo:build` passed in `project_memory/runlogs/20260708-442-palette-dedicated-icons-demo-build.txt`; `npm run test:language` passed with 92 tests in `project_memory/runlogs/20260708-443-palette-dedicated-icons-test-language.txt`; browser smoke passed in `project_memory/runlogs/20260708-445-palette-dedicated-icons-browser-smoke.json`; screenshots were saved to `project_memory/runlogs/20260708-448-palette-4-icons-crop.png` and `project_memory/runlogs/20260708-449-palette-3-icons-crop.png`; `git diff --check` passed in `project_memory/runlogs/20260708-450-palette-dedicated-icons-git-diff-check.txt`; registry ESLint gate passed in `project_memory/runlogs/20260708-451-palette-dedicated-icons-eslint-registry-gate.txt`.
- Known lint status: direct lint of `lib/features/context-pad/ContextPadProvider.js` still fails on pre-existing unused imports and formatting backlog, recorded in `project_memory/runlogs/20260708-444-palette-dedicated-icons-eslint-changed.txt`; repo-wide lint remains the known legacy failure, recorded in `project_memory/runlogs/20260708-452-palette-dedicated-icons-repo-lint-legacy.txt`.
- Audit: `project_memory/audit/reports/20260708-palette-dedicated-icons-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution remains unconfirmed, so these new SVGs are local visual cues rather than copied official standard artwork; official Appendix B relationship data and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 54

- Goal: verify and fix whether the right-side context-pad relationship arrow works by dragging it to a target element and releasing.
- Observation: source inspection confirmed the context-pad entries are drag actions (`dragstart: startConnect`) and no longer expose `click: startConnect`.
- Reproduction: direct Puppeteer mouse movement did not reliably fire the HTML5 `dragstart` event from the diagram-js context pad, so the smoke test triggered the same context-pad `dragstart` entry and then exercised the diagram-js connection drag lifecycle.
- Root cause 1: ArchiMate 4 active-profile validation rejected the internal diagram-js `Relationship` placeholder used while the user is choosing a final relationship type.
- Root cause 2: empty demo views could lack `viewElements`, causing connection creation to fail before the popup could be shown.
- Root cause 3: existing-relationship lookup assumed every source, target, and relationship endpoint was fully hydrated, which is not true during generic connection creation.
- Implemented: `ElementFactory` allows the internal `Relationship` placeholder while continuing to reject unavailable standard relationship types through the active profile.
- Implemented: `ConnectionUpdater` initializes missing view element collections before adding or checking a connection.
- Implemented: `RelationshipUtil.getExistingRelationships` now ignores missing sources, targets, and incomplete endpoint refs instead of throwing.
- Tests: `test/language-profile.test.mjs` now guards drag-only context-pad actions, internal relationship placeholder allowance, and view element initialization; `test/relationship-rules.test.mjs` guards incomplete relationship endpoint lookup.
- Browser/lifecycle verification: `project_memory/runlogs/20260709-019-context-pad-connect-lifecycle-smoke-pass.json` confirmed `beforeConnections: 6`, `afterConnections: 7`, `contextPadActions: ["dragstart"]`, and `popupOpen: true` for `Customer Role` to `Experience App`.
- Verification: `npm run demo:build` passed in `project_memory/runlogs/20260709-017-context-pad-drag-fix5-demo-build.txt`; `npm run test:language` passed with 93 tests in `project_memory/runlogs/20260709-022-context-pad-drag-final-test-language.txt`; registry ESLint gate passed in `project_memory/runlogs/20260709-023-context-pad-drag-final-eslint-registry-gate.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-024-context-pad-drag-final-git-diff-check.txt`.
- Post-record checks: `npm run test:language` passed again with 93 tests in `project_memory/runlogs/20260709-026-context-pad-drag-post-record-test-language.txt`; registry ESLint gate passed in `project_memory/runlogs/20260709-027-context-pad-drag-post-record-eslint-registry-gate.txt`; `aria_state.json` parsed in `project_memory/runlogs/20260709-028-context-pad-drag-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-029-context-pad-drag-post-record-git-diff-check.txt`.
- Final record checks: `git diff --check` passed in `project_memory/runlogs/20260709-030-context-pad-drag-final-final-git-diff-check.txt`; `aria_state.json` parsed in `project_memory/runlogs/20260709-031-context-pad-drag-final-state-json-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-025-context-pad-drag-repo-lint-legacy.txt` with 4413 existing errors.
- Audit: `project_memory/audit/reports/20260709-context-pad-drag-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship data, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 55

- Goal: continue C260-based ArchiMate 4 implementation by closing a language customization gap without embedding licensed Appendix B relationship tables.
- Source check: `project_memory/runlogs/20260709-032-c260-customization-specialization-scan.txt` scanned the local C260 PDF and recorded a derived signal that Chapter 14 includes specializations of relationships and junctions.
- XSD check: `project_memory/runlogs/20260709-039-official-xsd-directory-recheck.txt` refreshed the official XSD directory; it returned 200 with only 3.1 XSD links while 4.0 directory and Model/Diagram/View candidates returned 404.
- Red test: `project_memory/runlogs/20260709-033-relationship-specialization-red-test.txt` failed because relationship/junction specialization support and source-ledger trace were not present.
- Implemented: `createLanguageProfile()` now accepts custom relationship objects and validates that relationship objects declare `specializes` pointing to a known relationship.
- Implemented: `getBaseRelationshipTypeForProfile()` and `getProfileRelationship()` resolve custom relationship specializations to the standard base relationship.
- Implemented: relationship validation now checks the base relationship type, so a custom relationship such as a Flow specialization is allowed wherever the active profile allows `Flow`.
- Implemented: junction relationship type consistency now resolves custom relationship types to their standard base type before checking same-type junction chains.
- Docs: `docs/archimate4/sources.md` and `docs/archimate4/official-specification.md` now record relationship specialization behavior and the 2026-07-09 XSD recheck.
- Verification: `npm run test:language` passed with 94 tests in `project_memory/runlogs/20260709-035-relationship-specialization-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-036-relationship-specialization-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-037-relationship-specialization-git-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-038-relationship-specialization-demo-build.txt`.
- Final checks: `npm run test:language` passed again with 94 tests in `project_memory/runlogs/20260709-040-relationship-specialization-final-test-language.txt`; registry ESLint gate passed in `project_memory/runlogs/20260709-041-relationship-specialization-eslint-registry-gate.txt`; `aria_state.json` parsed in `project_memory/runlogs/20260709-042-relationship-specialization-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-043-relationship-specialization-final-git-diff-check.txt`.
- Final record checks: `git diff --check` passed in `project_memory/runlogs/20260709-045-relationship-specialization-final-final-git-diff-check.txt`; `aria_state.json` parsed in `project_memory/runlogs/20260709-046-relationship-specialization-final-state-json-check.txt`.
- Pre-commit check: `git diff --cached --check` initially found whitespace only in runlog artifacts; the affected runlogs were mechanically trimmed and re-staged before commit.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-044-relationship-specialization-repo-lint-legacy.txt` with 4413 existing errors.
- Audit: `project_memory/audit/reports/20260709-relationship-specialization-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 56

- Goal: close the editor/runtime gap left after adding custom relationship specialization validation: specialized relationships must be selectable and must behave like their base relationship.
- Source check: `project_memory/runlogs/20260709-049-c260-relationship-specialization-menu-source-scan.txt` rechecked the local C260 PDF and recorded Chapter 14 relationship/junction specialization signals without copying licensed prose.
- Red check: `project_memory/runlogs/20260709-047-relationship-specialization-menu-test-language.txt` failed because an existing source test still expected the old fixed `cloneRelationshipMenu(menu, menuName)` signature after the implementation became profile-aware.
- Implemented: `getRelationshipsAllowed()` now expands each allowed base relationship into custom relationship specializations from the active language profile.
- Implemented: connection popup menu generation now accepts a profile, resolves custom relationship metadata, and builds menu entries for specialized relationships using profile labels and base relationship icons when needed.
- Implemented: Access, Association, and Influence header actions preserve `element.type`, so toggling an option does not collapse a custom relationship back to the base standard type.
- Implemented: ElementFactory, ConnectionUpdater, ReplaceRelationshipRefHandler, and ArchimateRenderer resolve custom relationship types to their standard base relationship for option hydration, persistence, modifier rendering, and line notation fallback.
- Docs: `docs/archimate4/sources.md` and `docs/archimate4/official-specification.md` now record editor menu expansion and base behavior inheritance for custom relationship specializations.
- Verification: `npm run test:language` passed with 95 tests in `project_memory/runlogs/20260709-053-relationship-specialization-menu-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-054-relationship-specialization-menu-eslint-changed.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-055-relationship-specialization-menu-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-056-relationship-specialization-menu-git-diff-check.txt`.
- Final checks: `npm run test:language` passed with 95 tests in `project_memory/runlogs/20260709-057-relationship-specialization-menu-final-test-language.txt`; registry ESLint gate passed in `project_memory/runlogs/20260709-058-relationship-specialization-menu-final-eslint-registry-gate.txt`; `aria_state.json` parsed in `project_memory/runlogs/20260709-059-relationship-specialization-menu-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-060-relationship-specialization-menu-final-git-diff-check.txt`.
- Final record checks: `aria_state.json` parsed again in `project_memory/runlogs/20260709-062-relationship-specialization-menu-final-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-063-relationship-specialization-menu-final-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-061-relationship-specialization-menu-repo-lint-legacy.txt` with 4413 existing errors.
- Audit: `project_memory/audit/reports/20260709-relationship-specialization-menu-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 57

- Goal: close the ArchiMate 4 relationship-end multiplicity editor gap: storage/rendering accepted the C260-derived notation, but the popup UI only exposed fixed `source 1` and `target *` quick actions.
- Source check: `project_memory/runlogs/20260709-064-c260-multiplicity-ui-source-scan.txt` rechecked the local C260 PDF and recorded Chapter 5 multiplicity signals without copying licensed prose.
- Implemented: the ArchiMate 4 relationship popup now exposes custom source and target multiplicity actions in addition to the quick `source 1` and `target *` actions.
- Implemented: custom multiplicity input uses `isValidRelationshipMultiplicity()` and `normalizeRelationshipMultiplicity()` so positive integers, `*`, `0..*` alias, and finite `n..m` values follow the same guard used by import hydration, replacement, persistence, and rendering.
- Implemented: empty custom input clears that relationship end multiplicity; invalid input leaves the relationship unchanged.
- Docs: `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, `README.md`, and `CHANGELOG.md` now record custom multiplicity editing.
- Verification: `npm run test:language` passed with 96 tests in `project_memory/runlogs/20260709-065-multiplicity-custom-input-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-066-multiplicity-custom-input-eslint-changed.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-067-multiplicity-custom-input-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-068-multiplicity-custom-input-git-diff-check.txt`.
- Final checks: `npm run test:language` passed with 96 tests in `project_memory/runlogs/20260709-069-multiplicity-custom-input-final-test-language.txt`; registry ESLint gate passed in `project_memory/runlogs/20260709-070-multiplicity-custom-input-final-eslint-registry-gate.txt`; `aria_state.json` parsed in `project_memory/runlogs/20260709-071-multiplicity-custom-input-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-072-multiplicity-custom-input-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-073-multiplicity-custom-input-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed again in `project_memory/runlogs/20260709-074-multiplicity-custom-input-final-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-075-multiplicity-custom-input-final-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-multiplicity-custom-input-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 58

- Goal: continue C260-based ArchiMate 4 alignment by closing the Influence modifier editor gap: arbitrary modifier values were preserved and rendered, but the popup UI only offered fixed `+` and `-` quick actions.
- Source check: `project_memory/runlogs/20260709-076-c260-influence-modifier-source-scan.txt` scanned the local C260 PDF for Influence, strength, positive, and negative keyword signals without copying licensed prose.
- Implemented: the ArchiMate 4 Influence popup now exposes a custom modifier input in addition to the existing positive and negative quick actions.
- Implemented: custom modifier input trims arbitrary modeler-defined sign or strength values; empty input clears the modifier; cancel leaves the relationship unchanged.
- Guardrail: the custom modifier action is gated to ArchiMate 4 mode so existing ArchiMate 3.x positive/negative quick-action behavior remains unchanged.
- Docs: `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, `README.md`, and `CHANGELOG.md` now record custom Influence modifier editing.
- Verification: `npm run test:language` passed with 97 tests in `project_memory/runlogs/20260709-077-influence-custom-modifier-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-078-influence-custom-modifier-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-079-influence-custom-modifier-git-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-080-influence-custom-modifier-demo-build.txt`.
- Final checks: `npm run test:language` passed with 97 tests in `project_memory/runlogs/20260709-081-influence-custom-modifier-final-test-language.txt`; registry ESLint gate passed in `project_memory/runlogs/20260709-082-influence-custom-modifier-final-eslint-registry-gate.txt`; `aria_state.json` parsed in `project_memory/runlogs/20260709-083-influence-custom-modifier-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-084-influence-custom-modifier-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-085-influence-custom-modifier-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed again in `project_memory/runlogs/20260709-086-influence-custom-modifier-final-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-087-influence-custom-modifier-final-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-influence-custom-modifier-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 59

- Goal: implement a small, verifiable part of the C260 Appendix B derived relationship rules the user highlighted in the DR1/DR2 screenshots without embedding the full licensed relationship matrix.
- Source check: `project_memory/runlogs/20260709-088-c260-derived-relationship-source-scan.txt` scanned the local C260 PDF for DR1, DR2, specialization transitivity, weakest structural relationship, and structural relationship strength signals without copying licensed prose.
- Implemented: added `lib/util/DerivedRelationshipUtil.js` with host-callable `deriveRelationshipType()` and `deriveRelationship()` helpers.
- Implemented: DR1 derives `Specialization` from a two-step `Specialization` chain.
- Implemented: DR2 derives the weakest relationship in a two-step structural chain using the C260-derived order Realization, Assignment, Aggregation, Composition from weakest to strongest.
- Implemented: relationship specializations in a supplied language profile resolve to their base relationship before derivation; the helper returns candidate data and does not automatically mutate models.
- Public API: exported the derived relationship helpers from `index.js`.
- Tests: `test/derived-relationships.test.mjs` covers DR1, DR2, chain endpoint preservation, non-chain rejection, and custom relationship specialization resolution.
- Verification: initial `npm run test:language` failed in `project_memory/runlogs/20260709-089-derived-relationship-test-language.txt` due direct JSON import through the language profile loader; changed-file ESLint passed in `project_memory/runlogs/20260709-090-derived-relationship-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-091-derived-relationship-git-diff-check.txt`.
- Correction: removed the heavy language profile loader dependency from the new utility and used a local relationship-specialization resolver; a second `npm run test:language` still failed in `project_memory/runlogs/20260709-092-derived-relationship-test-language-pass.txt` because the new file imported `Concept` without a `.js` extension under direct Node ESM.
- Final verification: `npm run test:language` passed with 102 tests in `project_memory/runlogs/20260709-095-derived-relationship-test-language-pass2.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-096-derived-relationship-eslint-changed-pass2.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-097-derived-relationship-git-diff-check-pass2.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-098-derived-relationship-demo-build.txt`.
- Final checks: `npm run test:language` passed again with 102 tests in `project_memory/runlogs/20260709-099-derived-relationship-final-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-100-derived-relationship-final-eslint-registry-gate.txt`; `aria_state.json` parsed in `project_memory/runlogs/20260709-101-derived-relationship-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-102-derived-relationship-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-103-derived-relationship-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed again in `project_memory/runlogs/20260709-104-derived-relationship-final-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-105-derived-relationship-final-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-derived-relationship-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 60

- Goal: continue the C260 Appendix B derived relationship work by implementing the valid dependency and dynamic derivation rules DR3 through DR8 without embedding potential derivation rules or the full relationship matrix.
- Source check: `project_memory/runlogs/20260709-106-c260-derived-rule-headings-scan.txt` extracted DR headings and pages from the local C260 PDF; `project_memory/runlogs/20260709-111-c260-derived-relationship-dr3-dr8-summary.txt` records the non-verbatim implementation facts used for this loop.
- Red test: `project_memory/runlogs/20260709-107-derived-relationship-dr3-dr8-red-test.txt` failed because dependency/dynamic classification and DR3-DR8 helpers were not exported or implemented.
- Implemented: `DerivedRelationshipUtil` now classifies dependency relationships (`Serving`, `Access`, `Influence`, `Association`) and dynamic relationships (`Flow`, `Triggering`) with custom relationship specialization resolution.
- Implemented: `deriveRelationshipType()` now covers DR3-DR8 valid derivation type candidates in addition to DR1 and DR2.
- Implemented: `deriveRelationship()` now handles in-line structural-to-dependency, structural-to-dynamic, Triggering-to-structural, and Triggering transitivity chains, plus same-target opposite-direction dependency and Flow derivations.
- Public API: exported `isDependencyRelationshipType()` and `isDynamicRelationshipType()` from `index.js`.
- Tests: `test/derived-relationships.test.mjs` now covers DR3-DR8 type candidates, in-line object derivations, opposite-target derivations, and Triggering derivations.
- Verification: `npm run test:language` passed with 106 tests in `project_memory/runlogs/20260709-108-derived-relationship-dr3-dr8-test-language.txt`; scoped ESLint passed in `project_memory/runlogs/20260709-109-derived-relationship-dr3-dr8-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-110-derived-relationship-dr3-dr8-git-diff-check.txt`.
- Final checks: `npm run test:language` passed again with 106 tests in `project_memory/runlogs/20260709-112-derived-relationship-dr3-dr8-final-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-113-derived-relationship-dr3-dr8-final-eslint-registry-gate.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-114-derived-relationship-dr3-dr8-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-115-derived-relationship-dr3-dr8-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-116-derived-relationship-dr3-dr8-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed in `project_memory/runlogs/20260709-117-derived-relationship-dr3-dr8-final-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-118-derived-relationship-dr3-dr8-final-final-git-diff-check.txt`.
- Post-record checks: `aria_state.json` parsed again in `project_memory/runlogs/20260709-119-derived-relationship-dr3-dr8-post-record-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-120-derived-relationship-dr3-dr8-post-record-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-derived-relationship-dr3-dr8-audit.md`.
- Remaining open issues: potential derivation rules, exact C260 Appendix A vector artwork redistribution, official Appendix B relationship data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 61

- Goal: close the C260 Appendix B potential derivation rule gap by implementing PDR1 through PDR12 as explicit candidate helpers rather than automatic model mutations.
- Source check: `project_memory/runlogs/20260709-121-c260-potential-derivation-source-scan.txt`, `project_memory/runlogs/20260709-122-c260-potential-derivation-detail-scan.txt`, and `project_memory/runlogs/20260709-123-c260-dependency-strength-source-scan.txt` extracted the PDR endpoint patterns and dependency strength order from the local C260 PDF without committing verbatim tables.
- Source summary: `project_memory/runlogs/20260709-129-c260-potential-derivation-implementation-summary.txt` records the non-verbatim facts used for implementation.
- Red test: `project_memory/runlogs/20260709-124-potential-derivation-red-test.txt` failed because `derivePotentialRelationship()` and related dependency strength helpers were not exported or implemented.
- Implemented: `derivePotentialRelationship()` returns explicit `potential: true` candidates for PDR1 through PDR12 and never mutates the model automatically.
- Implemented: dependency relationship strength helpers use the C260-derived weakest-to-strongest order Association, Influence, Access, Serving.
- Implemented: PDR12 requires an external `isRelationshipAllowed(sourceType, targetType, relationshipType, profile)` validator before returning a Grouping-derived Realization or Assignment candidate.
- Public API: exported `derivePotentialRelationship()`, `getDependencyRelationshipStrength()`, `getWeakestDependencyRelationshipType()`, and `isDerivableRelationshipType()` from `index.js`.
- Tests: `test/derived-relationships.test.mjs` now covers PDR1-PDR12 endpoint patterns, dependency strength, and the PDR12 validator guard.
- Verification: `npm run test:language` passed with 111 tests in `project_memory/runlogs/20260709-126-potential-derivation-test-language-pass.txt`; scoped ESLint passed in `project_memory/runlogs/20260709-127-potential-derivation-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-128-potential-derivation-git-diff-check.txt`.
- Final checks: `npm run test:language` passed again with 111 tests in `project_memory/runlogs/20260709-130-potential-derivation-final-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-131-potential-derivation-final-eslint-registry-gate.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-132-potential-derivation-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-133-potential-derivation-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-134-potential-derivation-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed in `project_memory/runlogs/20260709-135-potential-derivation-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-136-potential-derivation-final-final-git-diff-check.txt`.
- Post-record checks: `aria_state.json` parsed again in `project_memory/runlogs/20260709-137-potential-derivation-post-record-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-138-potential-derivation-post-record-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-potential-derivation-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 62

- Goal: close the C260 Appendix B valid derivation chain gap by adding a host-callable helper for ordered in-line relationship chains.
- Source check: `project_memory/runlogs/20260709-139-c260-chain-derivation-source-scan.txt` confirmed that C260 describes structural chains, structural/dependency chains, and triggering discovery through combined rules without copying licensed prose.
- Source summary: `project_memory/runlogs/20260709-144-c260-chain-derivation-implementation-summary.txt` records the non-verbatim implementation facts used for this loop.
- Red test: `project_memory/runlogs/20260709-140-chain-derivation-red-test.txt` failed because `deriveRelationshipChain()` was not exported or implemented.
- Implemented: `deriveRelationshipChain()` folds ordered in-line valid derivation chains by repeatedly applying the existing pair derivation rules.
- Implemented: chain candidates preserve all original relationship ids in `derivedFrom` and pairwise rule labels in `derivationRules`.
- Boundary: the helper is not a generic graph search and does not implicitly apply opposite-direction or potential derivation rules.
- Public API: exported `deriveRelationshipChain()` from `index.js`.
- Tests: `test/derived-relationships.test.mjs` now covers structural weakest chains, dependency transfer through structural chains, triggering chains, and rejection of incomplete chains.
- Verification: `npm run test:language` passed with 114 tests in `project_memory/runlogs/20260709-141-chain-derivation-test-language.txt`; scoped ESLint passed in `project_memory/runlogs/20260709-142-chain-derivation-eslint-changed.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-143-chain-derivation-git-diff-check.txt`.
- Final checks: `npm run test:language` passed again with 114 tests in `project_memory/runlogs/20260709-145-chain-derivation-final-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-146-chain-derivation-final-eslint-registry-gate.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-147-chain-derivation-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-148-chain-derivation-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-149-chain-derivation-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed in `project_memory/runlogs/20260709-150-chain-derivation-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-151-chain-derivation-final-final-git-diff-check.txt`.
- Post-record checks: `aria_state.json` parsed again in `project_memory/runlogs/20260709-152-chain-derivation-post-record-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-153-chain-derivation-post-record-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-chain-derivation-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 63

- Goal: strengthen the external Appendix B replacement path by exposing exact coverage gaps for host-supplied ArchiMate 4 relationship profiles.
- Red test: `project_memory/runlogs/20260709-154-profile-coverage-report-red-test.txt` failed because a relationship profile coverage report API did not exist.
- Implemented: `getRelationshipProfileCoverageReport()` now reports counts plus `missingSourceTypes` and `missingTargetCells`, while `getRelationshipProfileCoverageStats()` preserves the previous count-only shape.
- Implemented: `getArchimate4RelationshipProfileStatus()` now includes `missingSourceCount` and `missingTargetCellCount`, and `getArchimate4RelationshipProfileCoverageReport()` returns the detailed active-profile gap report through the public entrypoint.
- Boundary: the API reports transcription coverage for a host-supplied licensed Appendix B profile; it still does not embed the official Appendix B matrix in the repository.
- Docs: README and `docs/archimate4` now describe the status counts and detailed coverage report.
- Verification: `npm run test:language` passed with 115 tests in `project_memory/runlogs/20260709-162-profile-coverage-report-final-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-163-profile-coverage-report-final-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-164-profile-coverage-report-final-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-165-profile-coverage-report-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-161-profile-coverage-report-repo-lint-legacy.txt` with 4413 existing errors.
- Audit: `project_memory/audit/reports/20260709-profile-coverage-report-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 64

- Goal: tighten C260 Chapter 13 viewpoint support by validating custom viewpoint allowed element and relationship type lists against the active language profile.
- Source check: `project_memory/runlogs/20260709-168-c260-viewpoint-type-validation-source-check.txt` records a C260 PDF keyword pass and a non-verbatim implementation fact for viewpoint purpose/content and allowed type metadata.
- Red test: `project_memory/runlogs/20260709-169-viewpoint-type-validation-red-test.txt` failed because viewpoint validation did not receive the active profile and did not validate `allowedElementTypes` or `allowedRelationshipTypes`.
- Implemented: `mergeViewpoints()` now calls `validateViewpoint(viewpoint, profile)` after custom elements, connectors, and relationships have been merged.
- Implemented: custom viewpoints reject `allowedElementTypes` not found in the active profile concepts and `allowedRelationshipTypes` not found in the active profile relationships; array entries may be strings or objects with a `type` field.
- Docs: README and `docs/archimate4` now state that custom viewpoint purpose/content and allowed type names are profile-validated.
- Verification: `npm run test:language` passed with 115 tests in `project_memory/runlogs/20260709-171-viewpoint-type-validation-test-language-pass.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-172-viewpoint-type-validation-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-173-viewpoint-type-validation-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-174-viewpoint-type-validation-git-diff-check.txt`.
- Final record checks: `aria_state.json` parsed in `project_memory/runlogs/20260709-176-viewpoint-type-validation-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-177-viewpoint-type-validation-final-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-175-viewpoint-type-validation-repo-lint-legacy.txt` with 4413 existing errors.
- Audit: `project_memory/audit/reports/20260709-viewpoint-type-validation-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 65

- Goal: expose a machine-readable ArchiMate 4 implementation status so host tooling can distinguish implemented support, experimental exchange behavior, and external-source blockers.
- Current external recheck: `project_memory/runlogs/20260709-178-meff4-xsd-current-recheck.txt` confirms the official public XSD directory still lists 3.1 links only, while tested 4.0 directory and Model XSD candidate URLs returned 404.
- Red test: `project_memory/runlogs/20260709-179-implementation-status-red-test.txt` failed because the ArchiMate 4 profile did not expose conformance metadata and no implementation status API existed.
- Implemented: `archimate4-profile.json` now carries conformance metadata for C260 source, 42-element catalog completion, external Appendix B relationship matrix requirement, experimental MEFF 4 exchange boundary, and local icon coverage boundary.
- Implemented: `getArchimate4ImplementationStatus()` returns the 4.0 profile version, namespace, element catalog count/completeness, relationship connector types, active relationship profile status, exchange/icon boundaries, and external blockers.
- Public API: exported `getArchimate4ImplementationStatus()` from `index.js`.
- Docs: README and `docs/archimate4` now describe the status API and record the refreshed MEFF 4 XSD recheck.
- Verification: `npm run test:language` passed with 116 tests in `project_memory/runlogs/20260709-180-implementation-status-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-181-implementation-status-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-182-implementation-status-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-183-implementation-status-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-184-implementation-status-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed in `project_memory/runlogs/20260709-185-implementation-status-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-186-implementation-status-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-implementation-status-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 66

- Goal: make the ArchiMate 4 implementation status audit complete enough to track C260 conformance requirements per required and optional clause.
- Source check: `project_memory/runlogs/20260709-187-c260-viewpoint-standard-scan.txt` located Chapter 13 and Appendix C viewpoint references; `project_memory/runlogs/20260709-188-c260-conformance-shall-scan.txt` located the conformance shall/may clauses without copying normative prose.
- Red test: `project_memory/runlogs/20260709-189-conformance-requirements-red-test.txt` failed because `profile.conformance.requirements` and the status summary were missing.
- Implemented: `archimate4-profile.json` now records five `shall` requirement entries and one `may` example-viewpoint entry with statuses for implemented, implementation-defined, local-renderer, optional, and external-profile-required support.
- Implemented: `getArchimate4ImplementationStatus()` now returns `conformanceRequirements` with the raw requirement items plus summary counts for required and optional clauses.
- Docs: README, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` now describe the conformance requirement map and its external-blocker semantics.
- Verification: `npm run test:language` passed with 117 tests in `project_memory/runlogs/20260709-190-conformance-requirements-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-191-conformance-requirements-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-192-conformance-requirements-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-193-conformance-requirements-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-194-conformance-requirements-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed in `project_memory/runlogs/20260709-195-conformance-requirements-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-196-conformance-requirements-final-git-diff-check.txt`.
- Post-record checks: `aria_state.json` parsed again in `project_memory/runlogs/20260709-197-conformance-requirements-post-record-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-198-conformance-requirements-post-record-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-conformance-requirements-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 67

- Goal: tighten the C260 Chapter 14 language customization profile mechanism by validating typed profile attributes against the active language profile.
- Source check: `project_memory/runlogs/20260709-199-c260-language-customization-scan.txt` located Chapter 14 customization/profile/specialization signals; `project_memory/runlogs/20260709-200-c260-profile-attribute-detail-scan.txt` recorded that profile attributes are typed and assigned to model concepts.
- Red test attempt: `project_memory/runlogs/20260709-201-profile-attribute-validation-red-test.txt` failed early because a direct test import hit Node JSON import-attribute behavior. The test was converted to the existing source-level contract style used by this suite.
- Red test: `project_memory/runlogs/20260709-202-profile-attribute-validation-red-test.txt` failed because profile attribute validation markers and documentation were missing.
- Implemented: `PROFILE_ATTRIBUTE_TYPES` now defines implementation-supported profile attribute types for `archimateLanguageProfile.attributes`.
- Implemented: `mergeAttributes()` now validates each profile attribute object, requiring `concept`, `name`, and `type`; the target concept must resolve to an active element, connector, or relationship, and the attribute type must be supported.
- Docs: README, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` now describe the profile attribute contract.
- Verification: `npm run test:language` passed with 118 tests in `project_memory/runlogs/20260709-203-profile-attribute-validation-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-204-profile-attribute-validation-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-205-profile-attribute-validation-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-206-profile-attribute-validation-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-207-profile-attribute-validation-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed in `project_memory/runlogs/20260709-208-profile-attribute-validation-state-json-check.txt`; `git diff --check` passed again in `project_memory/runlogs/20260709-209-profile-attribute-validation-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-profile-attribute-validation-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 68

- Goal: expose ArchiMate 4 source coverage status so host tooling can distinguish local evidence from external-source gaps.
- Source check: `project_memory/runlogs/20260709-210-w262-publication-status-check.txt` recorded the official W262 publication page as reachable with a free PDF edition that requires login; the W262 PDF itself remains absent locally.
- Red test: `project_memory/runlogs/20260709-211-source-coverage-status-red-test.txt` failed because `profile.conformance.sourceCoverage` did not exist.
- Implemented: `archimate4-profile.json` now records source coverage for local C260, W262, the launch transcript, Appendix B relationship matrix, MEFF 4.0 XSD, and Appendix A artwork-rights boundary.
- Implemented: `getArchimate4ImplementationStatus()` now exposes summarized source coverage with local/external counts plus missing required and missing companion source lists.
- Docs: README and `docs/archimate4` now describe source coverage status and the W262 local-availability boundary.
- Verification: `npm run test:language` passed with 119 tests in `project_memory/runlogs/20260709-212-source-coverage-status-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-213-source-coverage-status-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-214-source-coverage-status-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-215-source-coverage-status-git-diff-check.txt`; JSON parse passed in `project_memory/runlogs/20260709-216-source-coverage-status-json-parse.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-217-source-coverage-status-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` parsed in `project_memory/runlogs/20260709-218-source-coverage-status-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-219-source-coverage-status-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-source-coverage-status-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 69

- Goal: complete the implementation-defined C260 profile attribute path by exposing host-callable value normalization and validation for typed profile attributes.
- Source check: `project_memory/runlogs/20260709-221-c260-profile-attribute-value-scan.txt` records non-verbatim Chapter 14 signals for typed profile attributes and the observed basic type set.
- Red test: `project_memory/runlogs/20260709-222-profile-attribute-value-red-test.txt` failed because `ProfileAttributeUtil` and `getProfileAttributesForConcept()` were missing.
- Implemented: `lib/util/ProfileAttributeUtil.js` now validates and normalizes String, Integer, Real, Boolean, Currency, Date, URL, Time, and Structure values for profile attributes.
- Implemented: `getProfileAttributesForConcept()` returns profile attributes for a concept or relationship and its specialization lineage; the package entrypoint exports this helper plus `normalizeProfileAttributeValue()` and `isProfileAttributeValueValid()`.
- Audit registry: scoped ESLint now includes `lib/util/ProfileAttributeUtil.js`.
- Docs: README and `docs/archimate4` now document profile attribute value normalization and validation as implementation-supported host tooling.
- Verification: `npm run test:language` passed with 121 tests in `project_memory/runlogs/20260709-223-profile-attribute-value-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-224-profile-attribute-value-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-225-profile-attribute-value-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-226-profile-attribute-value-git-diff-check.txt`; JSON check passed in `project_memory/runlogs/20260709-227-profile-attribute-value-json-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-228-profile-attribute-value-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` and `audit_registry.json` parsed in `project_memory/runlogs/20260709-229-profile-attribute-value-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-230-profile-attribute-value-final-git-diff-check.txt` and again after record updates in `project_memory/runlogs/20260709-231-profile-attribute-value-post-record-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-profile-attribute-value-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 70

- Goal: complete the implementation-defined C260 profile attribute path by allowing host tooling to persist typed profile attribute values through the existing ArchiMate model property structure.
- Init/state: PowerShell, git status, repo root, and branch were recorded in `project_memory/runlogs/20260709-232-init-environment-check.txt`; pre-loop state remained clean except untracked runlogs.
- Source check: `project_memory/runlogs/20260709-233-c260-profile-attribute-property-scan.txt` records non-verbatim Chapter 14/profile-attribute and property-model signals from the local C260 PDF.
- Red test: `project_memory/runlogs/20260709-234-profile-attribute-property-red-test.txt` failed because `getProfileAttributePropertyValue()` and `setProfileAttributePropertyValue()` were missing.
- Implemented: `lib/util/ModelPropertyUtil.js` now centralizes reusable `PropertyDefinition` and per-concept `Properties` write/read helpers.
- Implemented: `lib/util/ProfileAttributeUtil.js` now exposes profile attribute property naming, serialization, parsing, set, and get helpers; `Structure` values are serialized as JSON strings and read back through the declared profile attribute type.
- Refactor: `lib/migration/archimate3-to-4.js` now reuses `setModelProperty()` for existing migration metadata, preserving the previous model property behavior while removing duplicate helper code.
- Public API: `lib/metamodel/languages/index.js` and `index.js` now export the new profile attribute property helpers.
- Docs and audit: README, `docs/archimate4`, `test/language-profile.test.mjs`, and `project_memory/audit/audit_registry.json` now cover the property-persistence helpers.
- Verification: `npm run test:language` passed with 123 tests in `project_memory/runlogs/20260709-236-profile-attribute-property-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-237-profile-attribute-property-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-238-profile-attribute-property-demo-build.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-239-profile-attribute-property-git-diff-check.txt`; JSON check passed in `project_memory/runlogs/20260709-240-profile-attribute-property-json-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-241-profile-attribute-property-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: `aria_state.json` and `audit_registry.json` parsed in `project_memory/runlogs/20260709-242-profile-attribute-property-state-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-243-profile-attribute-property-final-git-diff-check.txt` with only the existing line-ending warning for `project_memory/state/aria_state.json`.
- Audit: `project_memory/audit/reports/20260709-profile-attribute-property-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 71

- Goal: close a moddle descriptor completeness gap for model organization trees while preserving the current ArchiMate 3.x descriptor behavior.
- Source scan: `project_memory/runlogs/20260709-246-c260-gap-scan.txt` identified organization/folder support as an implementation gap candidate; `project_memory/runlogs/20260709-247-official-xsd-organization-source-check.txt` records non-verbatim public 3.1 schema identifiers for nested organization items and identifier references.
- Red test: `project_memory/runlogs/20260709-248-organization-descriptor-red-test.txt` failed because `Model.organizationsNode` referenced the undefined `Organizations` type and organization-tree parsing had no target descriptor type.
- Implemented: `lib/moddle/resources/archimate.json`, `archimate3.json`, and `archimate4.json` now define `Organizations` and recursive `Organization` descriptor types.
- Implemented: `Organization` can carry inherited name/documentation data, nested organization entries, and an optional `identifierRef` reference to a model concept.
- Tests: `test/xml-roundtrip.test.mjs` now verifies that all descriptor complex-type references resolve and that ArchiMate 4 organization trees resolve through moddle XML.
- Docs: README and `docs/archimate4` now describe organization tree retention and keep the exact ArchiMate 4 XML element-name boundary tied to the unavailable MEFF 4.0 XSD.
- Verification: `npm run test:language` passed with 126 tests in `project_memory/runlogs/20260709-250-organization-descriptor-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-251-organization-descriptor-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-252-organization-descriptor-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-253-organization-descriptor-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-255-organization-descriptor-git-diff-check-pass.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-256-organization-descriptor-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: descriptor/state/audit JSON parsed in `project_memory/runlogs/20260709-257-organization-descriptor-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-258-organization-descriptor-final-git-diff-check.txt` with only the existing line-ending warning for `project_memory/state/aria_state.json`.
- Post-record checks: `aria_state.json` and `audit_registry.json` parsed in `project_memory/runlogs/20260709-259-organization-descriptor-post-record-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-260-organization-descriptor-post-record-git-diff-check.txt` with only the existing line-ending warning for `project_memory/state/aria_state.json`.
- Audit: `project_memory/audit/reports/20260709-organization-descriptor-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 72

- Goal: implement the C260 Appendix B.4 restrictions that constrain DR/PDR derived relationship candidates after the rule tables produce a candidate.
- Source scan: `project_memory/runlogs/20260709-263-c260-outline-gap-scan.txt` identified B.4 as a derivation-related gap candidate; `project_memory/runlogs/20260709-264-c260-derivation-restrictions-scan.txt` records non-verbatim page and keyword signals for the restriction section.
- Red test: `project_memory/runlogs/20260709-265-derivation-restrictions-red-test.txt` failed as expected because `deriveRelationship()` and `derivePotentialRelationship()` returned candidates that the B.4 restriction tests expected to reject.
- Implemented: `lib/util/DerivedRelationshipUtil.js` now applies a profile-aware restriction filter when an ArchiMate 4 profile with endpoint domain/aspect metadata is supplied.
- Implemented: the guard classifies Common/Business/Application/Technology as Core, relationship types/connectors as Relationships, and passive structure from profile aspect metadata; it rejects source-target, third-element, Relationship-domain, Access, Influence, and passive-structure restricted candidates.
- Tests: `test/derived-relationships.test.mjs` now covers source-target restrictions, joined third-element restrictions, Relationship-domain restrictions, and potential relationship restriction filtering.
- Verification: `npm run test:language` passed with 130 tests in `project_memory/runlogs/20260709-266-derivation-restrictions-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-267-derivation-restrictions-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-268-derivation-restrictions-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-269-derivation-restrictions-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-270-derivation-restrictions-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-271-derivation-restrictions-repo-lint-legacy.txt` with 4413 existing errors.
- Audit: `project_memory/audit/reports/20260709-derivation-restrictions-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 73

- Goal: make Access relationship option editing explicit for every supported local `accessType` value, including the unspecified/`None` notation.
- Source scan: `project_memory/runlogs/20260709-274-c260-next-gap-scan.txt` identified Chapter 5 relationship option terms; `project_memory/runlogs/20260709-277-c260-access-type-source-scan.txt` records a focused non-verbatim Access/read/write/unspecified scan.
- Red test: `project_memory/runlogs/20260709-275-access-type-actions-red-test.txt` failed because the connection popup did not expose `set-access-type-none`.
- Implemented: `lib/features/popup-menu/ConnectionMenuProvider.js` now exposes `set-access-type-none`, `set-access-type-read`, `set-access-type-write`, and `set-access-type-readwrite`.
- Implemented: missing `accessType` and explicit `None` are treated as the active `None` option; existing Read, Write, and ReadWrite marker behavior and persistence remain unchanged.
- Tests/docs: `test/relationship-rules.test.mjs`, README, and `docs/archimate4` now guard and describe the explicit Access type actions without embedding C260 prose or Appendix B table data.
- Verification: focused relationship tests passed in `project_memory/runlogs/20260709-276-access-type-actions-relationship-rules-test.txt`; `npm run test:language` passed with 131 tests in `project_memory/runlogs/20260709-278-access-type-actions-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-279-access-type-actions-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-280-access-type-actions-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-281-access-type-actions-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-282-access-type-actions-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-283-access-type-actions-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-284-access-type-actions-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-285-access-type-actions-final-git-diff-check.txt` with only the existing line-ending warning for `project_memory/state/aria_state.json`.
- Audit: `project_memory/audit/reports/20260709-access-type-actions-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 74

- Goal: make Association relationship direction editing explicit for both undirected and directed notation.
- Source scan: `project_memory/runlogs/20260709-286-c260-association-direction-source-scan.txt` records a focused non-verbatim C260 Chapter 5 Association/directed/undirected scan.
- Red test: `project_memory/runlogs/20260709-287-association-direction-actions-red-test.txt` failed because the connection popup did not expose `set-association-undirected`.
- Implemented: `lib/features/popup-menu/ConnectionMenuProvider.js` now exposes `set-association-undirected` and `set-association-directed` while keeping the underlying relationship type as `Association`.
- Implemented: directed state continues to persist through `isDirected`, with the existing renderer and legacy `typeOption` fallback unchanged.
- Tests/docs: `test/relationship-rules.test.mjs`, README, and `docs/archimate4` now guard and describe the explicit Association direction actions without embedding C260 prose or Appendix B table data.
- Verification: focused relationship tests passed in `project_memory/runlogs/20260709-288-association-direction-actions-relationship-rules-test.txt`; `npm run test:language` passed with 132 tests in `project_memory/runlogs/20260709-289-association-direction-actions-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-290-association-direction-actions-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-291-association-direction-actions-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-292-association-direction-actions-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-293-association-direction-actions-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-294-association-direction-actions-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-295-association-direction-actions-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-296-association-direction-actions-final-git-diff-check.txt` with only the existing line-ending warning for `project_memory/state/aria_state.json`.
- Audit: `project_memory/audit/reports/20260709-association-direction-actions-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 75

- Goal: preserve C260-derived visual nesting notation when importing nested `Node` view elements.
- Source scan: `project_memory/runlogs/20260709-297-c260-nesting-notation-source-scan.txt` records a non-verbatim C260 Chapter 3.7 nesting/visual notation scan.
- Red test: `project_memory/runlogs/20260709-298-nested-node-import-red-test.txt` failed because nested view nodes were added to the root and linked to parents with `shape.host`.
- Implemented: `lib/import/Importer.js` now recurses with the current parent shape and adds each nested view node under that parent shape.
- Implemented: the obsolete root-shape recursion and `shape.host` assignment path was removed, so imported diagram containment reflects the nested view `Node` structure.
- Tests/docs: `test/importer.test.mjs`, README, and `docs/archimate4` now guard and describe view nesting import preservation without treating visual nesting as relationship semantics.
- Audit registry: scoped ESLint now includes `lib/import/Importer.js`.
- Verification: focused importer test passed in `project_memory/runlogs/20260709-299-nested-node-import-test.txt`; `npm run test:language` passed with 133 tests in `project_memory/runlogs/20260709-300-nested-node-import-test-language.txt`; focused Importer/test ESLint passed in `project_memory/runlogs/20260709-302-nested-node-import-eslint-importer-pass.txt`; updated registry scoped ESLint passed in `project_memory/runlogs/20260709-308-nested-node-import-eslint-registry-updated.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-303-nested-node-import-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-304-nested-node-import-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-305-nested-node-import-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-307-nested-node-import-repo-lint-legacy.txt` with 4413 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-309-nested-node-import-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-310-nested-node-import-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-nested-node-import-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 76

- Goal: preserve C260-derived visual nesting notation during editor attachment updates and later XML save.
- Source scan: `project_memory/runlogs/20260709-311-c260-nesting-persistence-source-scan.txt` records a non-verbatim C260 Chapter 3.7 visual nesting/notation scan.
- Red test: `project_memory/runlogs/20260709-312-view-nesting-attachment-red-test.txt` failed because `AttachmentBehavior` directly pushed nodes into parent arrays, lacked duplicate checks, and set `$parent` from `shape.host`.
- Implemented: `lib/features/modeling/behavior/AttachmentBehavior.js` now removes the moved `Node` view element from the old parent collection and adds it once to the active parent collection.
- Implemented: root-level nodes persist under `View.viewElements`; nested nodes persist under parent `Node.nodes`; the view node `$parent` is set to the same parent business object used for serialization.
- Tests/docs: `test/view-nesting.test.mjs`, README, and `docs/archimate4` now guard and describe import plus editing preservation for view node nesting.
- Audit registry: scoped ESLint now includes `lib/features/modeling/behavior/AttachmentBehavior.js`.
- Verification: focused test passed in `project_memory/runlogs/20260709-313-view-nesting-attachment-test.txt` and again after lint cleanup in `project_memory/runlogs/20260709-316-view-nesting-attachment-test-after-lint-fix.txt`; focused ESLint passed in `project_memory/runlogs/20260709-317-view-nesting-attachment-eslint-pass.txt`; `npm run test:language` passed with 134 tests in `project_memory/runlogs/20260709-318-view-nesting-attachment-test-language.txt`; updated registry scoped ESLint passed in `project_memory/runlogs/20260709-319-view-nesting-attachment-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-320-view-nesting-attachment-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-321-view-nesting-attachment-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-322-view-nesting-attachment-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-323-view-nesting-attachment-repo-lint-legacy.txt` with 4383 existing errors after the touched attachment file cleanup.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-324-view-nesting-attachment-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-325-view-nesting-attachment-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-view-nesting-attachment-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 77

- Goal: align the ArchiMate 4 `Grouping` renderer outline with the C260 Appendix A notation while preserving ArchiMate 3.x behavior.
- Source evidence: `project_memory/runlogs/20260709-326-c260-appendix-a-grouping-page-scan.txt` and `project_memory/runlogs/20260709-327-c260-appendix-a-grouping-visual-check.txt` record the non-verbatim Appendix A page and visual check.
- Red test: `project_memory/runlogs/20260709-328-grouping-renderer-red-test.txt` failed because `ArchimateRenderer` had no ArchiMate 4-specific `Grouping` outline handling.
- Implemented: `lib/draw/ArchimateRenderer.js` now gates `Grouping` outline behavior on ArchiMate 4 profiles, rendering it as a dashed, unfilled rectangle while keeping ArchiMate 3.x rendering unchanged.
- Implemented: ArchiMate 4 `Grouping` pictogram fill now remains visible against the unfilled outline.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the renderer notation boundary without embedding Appendix A vector artwork.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-329-grouping-renderer-test.txt`; `npm run test:language` passed in `project_memory/runlogs/20260709-330-grouping-renderer-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-331-grouping-renderer-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-332-grouping-renderer-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-333-grouping-renderer-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-334-grouping-renderer-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-335-grouping-renderer-repo-lint-legacy.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-grouping-renderer-notation-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 78

- Goal: align the ArchiMate 4 `AndJunction` and `OrJunction` renderer markers with the C260 Appendix A notation while preserving ArchiMate 3.x behavior.
- Source evidence: `project_memory/runlogs/20260709-338-c260-appendix-a-junction-page-scan.txt`, `project_memory/runlogs/20260709-339-c260-appendix-a-junction-render.txt`, and `project_memory/runlogs/20260709-340-c260-appendix-a-junction-visual-check.txt` record the non-verbatim Appendix A page and visual check.
- Red test: `project_memory/runlogs/20260709-341-junction-renderer-red-test.txt` failed because `ArchimateRenderer` had no ArchiMate 4-specific junction marker handling.
- Implemented: `lib/draw/ArchimateRenderer.js` now renders ArchiMate 4 `AndJunction` as a filled dot and `OrJunction` as an unfilled ring.
- Preserved: ArchiMate 3.x keeps the legacy `AND` / `OR` text marker, and optional modeler-supplied junction names still render below the connector.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Junction renderer notation boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-342-junction-renderer-test.txt`; `npm run test:language` passed with 136 tests in `project_memory/runlogs/20260709-343-junction-renderer-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-344-junction-renderer-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-345-junction-renderer-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-346-junction-renderer-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-347-junction-renderer-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-348-junction-renderer-repo-lint-legacy.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-junction-renderer-notation-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 79

- Goal: align the ArchiMate 4 Motivation element body shape with the C260 Appendix A notation while preserving ArchiMate 3.x behavior.
- Source evidence: `project_memory/runlogs/20260709-351-c260-appendix-a-motivation-render.txt` and `project_memory/runlogs/20260709-352-c260-appendix-a-motivation-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-353-motivation-renderer-red-test.txt` failed because `ArchimateRenderer` and `ArchimateRendererUtil` had no ArchiMate 4-specific Motivation body path.
- Implemented: `lib/draw/ArchimateRendererUtil.js` now exposes `getChamferedRectPath()` and `lib/draw/ArchimateRenderer.js` uses it to draw ArchiMate 4 Motivation elements with clipped/chamfered body corners.
- Preserved: ArchiMate 3.x Motivation elements keep the existing rectangle body rendering.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Motivation renderer notation boundary.
- Audit registry: scoped ESLint now includes `lib/draw/ArchimateRendererUtil.js`.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-354-motivation-renderer-test.txt`; `npm run test:language` passed with 137 tests in `project_memory/runlogs/20260709-355-motivation-renderer-test-language.txt`; original registry scoped ESLint passed in `project_memory/runlogs/20260709-356-motivation-renderer-eslint-registry.txt`; updated registry scoped ESLint passed with `ArchimateRendererUtil.js` included in `project_memory/runlogs/20260709-361-motivation-renderer-eslint-registry-updated.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-357-motivation-renderer-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-358-motivation-renderer-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-359-motivation-renderer-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-360-motivation-renderer-repo-lint-legacy.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-motivation-renderer-notation-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 80

- Goal: replace the ArchiMate 4 `Location` renderer pictogram fallback with a C260 Appendix A-derived location-pin path.
- Source evidence: `project_memory/runlogs/20260709-364-c260-appendix-a-location-render.txt` and `project_memory/runlogs/20260709-365-c260-appendix-a-location-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-366-location-pictogram-red-test.txt` failed because `PICTO_LOCATION` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_LOCATION` pin-shaped path and removes the generic object alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Location renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-367-location-pictogram-test.txt`; `npm run test:language` passed with 138 tests in `project_memory/runlogs/20260709-368-location-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-369-location-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-370-location-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-371-location-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-372-location-pictogram-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-373-location-pictogram-repo-lint-legacy.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-location-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 81

- Goal: replace the ArchiMate 4 `Distribution Network` renderer pictogram fallback with a C260 Appendix A-derived bidirectional-arrow path.
- Source evidence: `project_memory/runlogs/20260709-377-c260-appendix-a-distribution-network-render.txt` and `project_memory/runlogs/20260709-378-c260-appendix-a-distribution-network-visual-check.txt` record the Appendix A page render and non-verbatim visual check. `project_memory/runlogs/20260709-376-c260-appendix-a-distribution-network-render.txt` records the initial Poppler wrapper path failure before rerunning the Poppler binary directly.
- Red test: `project_memory/runlogs/20260709-379-distribution-network-pictogram-red-test.txt` failed because `PICTO_DISTRIBUTION_NETWORK` was still aliased to `PICTO_COMMUNICATION_NETWORK`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_DISTRIBUTION_NETWORK` bidirectional-arrow path and removes the Communication Network alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Distribution Network renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-380-distribution-network-pictogram-test.txt`; `npm run test:language` passed with 139 tests in `project_memory/runlogs/20260709-381-distribution-network-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-382-distribution-network-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-383-distribution-network-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-384-distribution-network-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-385-distribution-network-pictogram-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-386-distribution-network-pictogram-repo-lint-legacy.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-distribution-network-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 82

- Goal: replace the ArchiMate 4 `Material` renderer pictogram fallback with a C260 Appendix A-derived hexagonal path.
- Source evidence: `project_memory/runlogs/20260709-389-c260-appendix-a-material-render.txt` and `project_memory/runlogs/20260709-390-c260-appendix-a-material-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-391-material-pictogram-red-test.txt` failed because `PICTO_MATERIAL` was still aliased to `PICTO_ARTIFACT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_MATERIAL` hexagonal path and removes the Artifact alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Material renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-392-material-pictogram-test.txt`; `npm run test:language` passed with 140 tests in `project_memory/runlogs/20260709-393-material-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-394-material-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-395-material-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-396-material-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-397-material-pictogram-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-398-material-pictogram-repo-lint-legacy.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-material-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 83

- Goal: replace the ArchiMate 4 `Facility` renderer pictogram fallback with a C260 Appendix A-derived factory-shaped path.
- Source evidence: `project_memory/runlogs/20260709-401-c260-appendix-a-facility-render.txt` and `project_memory/runlogs/20260709-402-c260-appendix-a-facility-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-403-facility-pictogram-red-test.txt` failed because `PICTO_FACILITY` was still aliased to `PICTO_NODE`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_FACILITY` factory-shaped path and removes the Node alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Facility renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-404-facility-pictogram-test.txt`; `npm run test:language` passed with 141 tests in `project_memory/runlogs/20260709-405-facility-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-406-facility-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-407-facility-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-408-facility-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-409-facility-pictogram-git-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-410-facility-pictogram-repo-lint-legacy.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-facility-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 84

- Goal: replace the ArchiMate 4 `Equipment` renderer pictogram fallback with a C260 Appendix A-derived gear-shaped path.
- Source evidence: `project_memory/runlogs/20260709-413-c260-appendix-a-equipment-render.txt` and `project_memory/runlogs/20260709-414-c260-appendix-a-equipment-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-415-equipment-pictogram-red-test.txt` failed because `PICTO_EQUIPMENT` was still aliased to `PICTO_DEVICE`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_EQUIPMENT` gear-shaped path and removes the Device alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Equipment renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-416-equipment-pictogram-test.txt`; `npm run test:language` passed with 142 tests in `project_memory/runlogs/20260709-417-equipment-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-418-equipment-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-419-equipment-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-420-equipment-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-421-equipment-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-422-equipment-pictogram-repo-lint.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-equipment-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 85

- Goal: replace the ArchiMate 4 `Work Package` renderer pictogram fallback with a C260 Appendix A-derived loop-arrow path.
- Source evidence: `project_memory/runlogs/20260709-427-c260-appendix-a-work-package-render.txt` and `project_memory/runlogs/20260709-428-c260-appendix-a-work-package-visual-check.txt` record the Appendix A page render and non-verbatim visual check. `project_memory/runlogs/20260709-426-c260-appendix-a-work-package-render.txt` records the failed Poppler wrapper attempt before using the actual Poppler executable.
- Red test: `project_memory/runlogs/20260709-429-work-package-pictogram-red-test.txt` failed because `PICTO_WORK_PACKAGE` was still aliased to `PICTO_PROCESS`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_WORK_PACKAGE` loop-arrow path and removes the Process alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Work Package renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-430-work-package-pictogram-test.txt`; `npm run test:language` passed with 143 tests in `project_memory/runlogs/20260709-431-work-package-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-432-work-package-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-433-work-package-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-434-work-package-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-435-work-package-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-436-work-package-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-439-work-package-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-440-work-package-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-work-package-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 86

- Goal: replace the ArchiMate 4 `Deliverable` renderer pictogram fallback with a C260 Appendix A-derived wavy-bottom document path.
- Source evidence: `project_memory/runlogs/20260709-442-c260-appendix-a-deliverable-render.txt` and `project_memory/runlogs/20260709-443-c260-appendix-a-deliverable-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-444-deliverable-pictogram-red-test.txt` failed because `PICTO_DELIVERABLE` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_DELIVERABLE` wavy-bottom document path, removes the generic object alias, and keeps the legacy misspelled `PICTO_DELIVRABLE` alias pointed at the corrected path.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Deliverable renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-445-deliverable-pictogram-test.txt`; `npm run test:language` passed with 144 tests in `project_memory/runlogs/20260709-446-deliverable-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-447-deliverable-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-448-deliverable-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-449-deliverable-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-450-deliverable-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-451-deliverable-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-452-deliverable-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-453-deliverable-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-deliverable-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 87

- Goal: replace the ArchiMate 4 `Plateau` renderer pictogram fallback with a C260 Appendix A-derived stacked horizontal bars path.
- Source evidence: `project_memory/runlogs/20260709-455-c260-appendix-a-plateau-render.txt` and `project_memory/runlogs/20260709-456-c260-appendix-a-plateau-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-457-plateau-pictogram-red-test.txt` failed because `PICTO_PLATEAU` was still aliased to `PICTO_PRODUCT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_PLATEAU` stacked horizontal bars path and removes the Product alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Plateau renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-458-plateau-pictogram-test.txt`; `npm run test:language` passed with 145 tests in `project_memory/runlogs/20260709-459-plateau-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-460-plateau-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-461-plateau-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-462-plateau-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-463-plateau-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-464-plateau-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-465-plateau-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-466-plateau-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-plateau-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 88

- Goal: replace the ArchiMate 4 `Stakeholder` renderer pictogram fallback with a C260 Appendix A-derived horizontal cylinder path.
- Source evidence: `project_memory/runlogs/20260709-468-c260-appendix-a-stakeholder-render.txt` and `project_memory/runlogs/20260709-469-c260-appendix-a-stakeholder-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-470-stakeholder-pictogram-red-test.txt` failed because `PICTO_STAKEHOLDER` was still aliased to `PICTO_ACTOR`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_STAKEHOLDER` horizontal cylinder path and keeps the legacy misspelled `PICTO_STAKHOLDER` alias pointed at the corrected path.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Stakeholder renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-471-stakeholder-pictogram-test.txt`; `npm run test:language` passed with 146 tests in `project_memory/runlogs/20260709-472-stakeholder-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-473-stakeholder-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-474-stakeholder-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-475-stakeholder-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-476-stakeholder-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-477-stakeholder-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-478-stakeholder-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-479-stakeholder-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-stakeholder-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 89

- Goal: replace the ArchiMate 4 `Driver` renderer pictogram fallback with a C260 Appendix A-derived wheel/spoke path.
- Source evidence: `project_memory/runlogs/20260709-480-c260-appendix-a-driver-render.txt` and `project_memory/runlogs/20260709-481-c260-appendix-a-driver-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-482-driver-pictogram-red-test.txt` failed because `PICTO_DRIVER` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_DRIVER` wheel/spoke path and removes the generic object alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Driver renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-483-driver-pictogram-test.txt`; `npm run test:language` passed with 147 tests in `project_memory/runlogs/20260709-484-driver-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-485-driver-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-486-driver-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-487-driver-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-488-driver-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-489-driver-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-490-driver-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-491-driver-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-driver-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 90

- Goal: replace the ArchiMate 4 `Assessment` renderer pictogram fallback with a C260 Appendix A-derived magnifying-glass path.
- Source evidence: `project_memory/runlogs/20260709-492-c260-appendix-a-assessment-render.txt` and `project_memory/runlogs/20260709-493-c260-appendix-a-assessment-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-494-assessment-pictogram-red-test.txt` failed because `PICTO_ASSESSMENT` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_ASSESSMENT` magnifying-glass path and removes the generic object alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Assessment renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-495-assessment-pictogram-test.txt`; `npm run test:language` passed with 148 tests in `project_memory/runlogs/20260709-496-assessment-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-497-assessment-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-498-assessment-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-499-assessment-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-500-assessment-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-501-assessment-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-502-assessment-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-503-assessment-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-assessment-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 91

- Goal: replace the ArchiMate 4 `Goal` renderer pictogram fallback with a C260 Appendix A-derived target/bullseye path.
- Source evidence: `project_memory/runlogs/20260709-504-c260-appendix-a-goal-render.txt` and `project_memory/runlogs/20260709-505-c260-appendix-a-goal-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-506-goal-pictogram-red-test.txt` failed because `PICTO_GOAL` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_GOAL` target/bullseye path and removes the generic object alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Goal renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-507-goal-pictogram-test.txt`; `npm run test:language` passed with 149 tests in `project_memory/runlogs/20260709-508-goal-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-509-goal-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-510-goal-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-511-goal-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-512-goal-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-513-goal-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-514-goal-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-515-goal-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-goal-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 92

- Goal: replace the ArchiMate 4 `Outcome` renderer pictogram fallback with a C260 Appendix A-derived target/bullseye-with-arrow path.
- Source evidence: `project_memory/runlogs/20260709-516-c260-appendix-a-outcome-render.txt` and `project_memory/runlogs/20260709-517-c260-appendix-a-outcome-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-518-outcome-pictogram-red-test.txt` failed because `PICTO_OUTCOME` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_OUTCOME` target/bullseye-with-arrow path and removes the generic object alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Outcome renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-519-outcome-pictogram-test.txt`; `npm run test:language` passed with 150 tests in `project_memory/runlogs/20260709-520-outcome-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-521-outcome-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-522-outcome-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-523-outcome-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-524-outcome-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-525-outcome-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-526-outcome-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-527-outcome-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-outcome-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 93

- Goal: replace the ArchiMate 4 `Principle` renderer pictogram fallback with a C260 Appendix A-derived rounded-square exclamation path.
- Source evidence: `project_memory/runlogs/20260709-528-c260-appendix-a-principle-render.txt` and `project_memory/runlogs/20260709-529-c260-appendix-a-principle-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-530-principle-pictogram-red-test.txt` failed because `PICTO_PRINCIPLE` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_PRINCIPLE` rounded-square exclamation path and removes the generic object alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Principle renderer pictogram boundary.
- Verification: focused renderer notation test passed in `project_memory/runlogs/20260709-531-principle-pictogram-test.txt`; `npm run test:language` passed with 151 tests in `project_memory/runlogs/20260709-532-principle-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-533-principle-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-534-principle-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-535-principle-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-536-principle-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-537-principle-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-538-principle-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-539-principle-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-principle-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 94

- Goal: replace the ArchiMate 4 `Requirement` renderer pictogram fallback with a C260 Appendix A-derived parallelogram path.
- Source evidence: `project_memory/runlogs/20260709-540-c260-appendix-a-requirement-render.txt` and `project_memory/runlogs/20260709-541-c260-appendix-a-requirement-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-542-requirement-pictogram-red-test.txt` failed because `PICTO_REQUIREMENT` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_REQUIREMENT` parallelogram path and removes the generic object alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Requirement renderer pictogram boundary.
- Verification: focused renderer notation test passed with 18 tests in `project_memory/runlogs/20260709-543-requirement-pictogram-test.txt`; `npm run test:language` passed with 152 tests in `project_memory/runlogs/20260709-544-requirement-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-545-requirement-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-546-requirement-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-547-requirement-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-548-requirement-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-549-requirement-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-552-requirement-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-553-requirement-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-requirement-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 95

- Goal: replace the ArchiMate 4 `Meaning` and `Value` renderer pictogram fallbacks with C260 Appendix A-derived thought-cloud and oval paths.
- Source evidence: `project_memory/runlogs/20260709-554-c260-appendix-a-meaning-value-render.txt` and `project_memory/runlogs/20260709-555-c260-appendix-a-meaning-value-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-556-meaning-value-pictogram-red-test.txt` failed because `PICTO_MEANING` and `PICTO_VALUE` were still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines locally-authored `PICTO_MEANING` thought-cloud and `PICTO_VALUE` oval paths and removes both generic object aliases.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Meaning and Value renderer pictogram boundary.
- Verification: focused renderer notation test passed with 20 tests in `project_memory/runlogs/20260709-557-meaning-value-pictogram-test.txt`; `npm run test:language` passed with 154 tests in `project_memory/runlogs/20260709-558-meaning-value-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-559-meaning-value-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-560-meaning-value-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-561-meaning-value-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-562-meaning-value-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-563-meaning-value-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-566-meaning-value-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-567-meaning-value-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-meaning-value-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 96

- Goal: replace the ArchiMate 4 `Grouping` renderer pictogram fallback with a C260 Appendix A-derived dashed-rectangle path.
- Source evidence: `project_memory/runlogs/20260709-568-c260-appendix-a-grouping-pictogram-render.txt` and `project_memory/runlogs/20260709-569-c260-appendix-a-grouping-pictogram-visual-check.txt` record the Appendix A page render and non-verbatim visual check.
- Red test: `project_memory/runlogs/20260709-570-grouping-pictogram-red-test.txt` failed because `PICTO_GROUPING` was still aliased to `PICTO_OBJECT`.
- Implemented: `lib/draw/PathMap.js` now defines a locally-authored `PICTO_GROUPING` dashed-rectangle line path and removes the generic object alias.
- Tests/docs: `test/renderer-notation.test.mjs`, README, and `docs/archimate4` now guard and describe the Grouping renderer pictogram boundary.
- Verification: focused renderer notation test passed with 21 tests in `project_memory/runlogs/20260709-571-grouping-pictogram-test.txt`; `npm run test:language` passed with 155 tests in `project_memory/runlogs/20260709-572-grouping-pictogram-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-573-grouping-pictogram-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-574-grouping-pictogram-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-575-grouping-pictogram-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-576-grouping-pictogram-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-577-grouping-pictogram-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-580-grouping-pictogram-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-581-grouping-pictogram-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-grouping-pictogram-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 97

- Goal: make ArchiMate 4 pictogram coverage machine-auditable after replacing all profile generic-object aliases.
- Red test: `project_memory/runlogs/20260709-582-pictogram-coverage-status-red-test.txt` failed because `archimate4-profile.json` did not expose `profilePictogramCoverage`, `genericObjectAliasCount`, or legacy compatibility alias metadata.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now reports `profilePictogramCoverage: dedicated-local-paths`, `genericObjectAliasCount: 0`, and the two legacy misspelled compatibility aliases; `docs/archimate4` and README now describe this status boundary.
- Tests/docs: `test/language-profile.test.mjs` now verifies that every non-`PICTO_OBJECT` ArchiMate 4 profile pictogram uses a dedicated `PathMap` entry and that no `PICTO_*` entry aliases to `PICTO_OBJECT`.
- Verification: focused language-profile test passed with 28 tests in `project_memory/runlogs/20260709-583-pictogram-coverage-status-test.txt`; `npm run test:language` passed with 156 tests in `project_memory/runlogs/20260709-584-pictogram-coverage-status-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-585-pictogram-coverage-status-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-586-pictogram-coverage-status-demo-build.txt`; JSON check passed in `project_memory/runlogs/20260709-587-pictogram-coverage-status-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-588-pictogram-coverage-status-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-589-pictogram-coverage-status-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-592-pictogram-coverage-status-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-593-pictogram-coverage-status-final-git-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-pictogram-coverage-status-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 98

- Goal: make the original ArchiMate 4 implementation plan safe to use as a handoff artifact after the branch has moved beyond the unchecked task list.
- Implemented: `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now has a `Current Execution Status` section that maps M0-M5 to current implementation evidence and separates external-source blockers from implementation omissions.
- Tests/docs: `test/language-profile.test.mjs` now guards that the plan keeps the current execution boundary, `getArchimate4ImplementationStatus()` handoff, and Appendix B / MEFF 4.0 XSD / W262 / Appendix A artwork-rights open items visible.
- Verification: focused language-profile test passed in `project_memory/runlogs/20260709-594-plan-execution-status-test.txt`; `npm run test:language` passed with 157 tests in `project_memory/runlogs/20260709-595-plan-execution-status-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-596-plan-execution-status-eslint.txt`; JSON check passed in `project_memory/runlogs/20260709-597-plan-execution-status-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-598-plan-execution-status-diff-check.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-599-plan-execution-status-eslint-registry.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-601-plan-execution-status-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-600-plan-execution-status-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-604-plan-execution-status-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-605-plan-execution-status-final-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-plan-execution-status-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 99

- Goal: refresh the official XSD directory evidence and make the MEFF 4.0 XSD blocker machine-auditable in the ArchiMate 4 implementation status.
- Source check: `project_memory/runlogs/20260709-606-meff4-xsd-current-recheck.txt` records the official `https://www.opengroup.org/xsd/archimate/` result as HTTP 200 with only 3.1 Model/View/Diagram XSD links; tested 4.0 directory and Model/Diagram/View XSD candidate URLs returned 404.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records the XSD evidence in `sourceCoverage.meff4Xsd`, including `lastCheckedAt`, `lastRunlogPath`, `directoryStatusCode`, discovered 3.1 XSD links, `official4XsdDiscovered: false`, and candidate 4.0 status codes.
- Tests/docs: `test/language-profile.test.mjs`, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` now guard and describe the refreshed MEFF 4.0 XSD evidence.
- Verification: focused language-profile test passed in `project_memory/runlogs/20260709-607-meff4-xsd-evidence-test.txt`; `npm run test:language` passed with 157 tests in `project_memory/runlogs/20260709-608-meff4-xsd-evidence-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-609-meff4-xsd-evidence-eslint-registry.txt`; JSON check passed in `project_memory/runlogs/20260709-610-meff4-xsd-evidence-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-611-meff4-xsd-evidence-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-612-meff4-xsd-evidence-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-613-meff4-xsd-evidence-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-614-meff4-xsd-evidence-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-615-meff4-xsd-evidence-final-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-meff4-xsd-evidence-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 100

- Goal: make the Appendix B source-coverage boundary precise and machine-auditable without embedding the licensed relationship table.
- Red test: `project_memory/runlogs/20260709-616-appendix-b-source-coverage-red-test.txt` failed because `sourceCoverage.appendixBRelationshipMatrix` did not distinguish reviewed C260 source evidence from the absent redistributable profile artifact.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records that C260 was reviewed locally, no redistributable Appendix B profile artifact is present, and the external relationship profile loader plus status and coverage report APIs are implemented.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` now guard and describe that distinction.
- Verification: focused source-coverage test passed in `project_memory/runlogs/20260709-617-appendix-b-source-coverage-test.txt`; `npm run test:language` passed with 157 tests in `project_memory/runlogs/20260709-618-appendix-b-source-coverage-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-619-appendix-b-source-coverage-eslint-registry.txt`; JSON check passed in `project_memory/runlogs/20260709-620-appendix-b-source-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-621-appendix-b-source-coverage-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-622-appendix-b-source-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-623-appendix-b-source-coverage-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-624-appendix-b-source-coverage-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-625-appendix-b-source-coverage-final-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-appendix-b-source-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 101

- Goal: make W262 companion paper availability auditable without confusing it with missing C260 implementation evidence.
- Source check: `project_memory/runlogs/20260709-626-w262-local-source-search.txt` records a recursive filename search under `C:\Users\syska\Downloads` and `C:\Users\syska\.codex\attachments`; no W262 or ArchiMate 4 motivation PDF candidates were found, and the publication page returned HTTP 200.
- Red test: `project_memory/runlogs/20260709-627-w262-source-coverage-red-test.txt` failed because `sourceCoverage.w262` did not expose publication status or local-search evidence.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records W262 publication status, latest local search timestamp, search runlog path, scoped search roots/patterns, and an empty matched-file list.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` now guard and describe the W262 source-coverage evidence.
- Verification: focused source-coverage test passed in `project_memory/runlogs/20260709-628-w262-source-coverage-test.txt`; `npm run test:language` passed with 157 tests in `project_memory/runlogs/20260709-629-w262-source-coverage-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-630-w262-source-coverage-eslint-registry.txt`; JSON check passed in `project_memory/runlogs/20260709-631-w262-source-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-632-w262-source-coverage-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-633-w262-source-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-634-w262-source-coverage-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-635-w262-source-coverage-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-636-w262-source-coverage-final-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-w262-source-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 102

- Goal: make the ArchiMate 4 official-conformance claim boundary machine-auditable from `getArchimate4ImplementationStatus()`.
- Red tests: `project_memory/runlogs/20260709-637-conformance-readiness-red-test.txt` showed that runtime importing the JSON-backed language index is unsuitable under the current Node import-attributes setup; `project_memory/runlogs/20260709-638-conformance-readiness-red-test.txt` then failed because `profile.conformance.readiness` did not exist.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `conformance.readiness` with `officialConformanceClaimable: false`, the external blocker ids, and required-before-claim actions for Appendix B, MEFF 4.0 XSD, and Appendix A artwork rights.
- Implemented: `lib/metamodel/languages/index.js` now returns `conformanceReadiness` from `getArchimate4ImplementationStatus()`, including official claimability, reason, blocker ids, implemented/external-blocked shall counts, missing required source ids, and missing companion source ids.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` now guard and describe the conformance-readiness boundary so implemented local coverage is not mistaken for an official conformance claim.
- Verification: focused readiness test passed with 158 tests in `project_memory/runlogs/20260709-639-conformance-readiness-test.txt`; `npm run test:language` passed with 158 tests in `project_memory/runlogs/20260709-640-conformance-readiness-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-641-conformance-readiness-eslint-registry.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-643-conformance-readiness-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-644-conformance-readiness-demo-build.txt`; JSON parse recheck passed in `project_memory/runlogs/20260709-646-conformance-readiness-json-recheck.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-645-conformance-readiness-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-647-conformance-readiness-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-648-conformance-readiness-final-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-conformance-readiness-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 103

- Goal: make the ArchiMate 4 42-element catalog status auditable by exact element identity, not only by element count.
- Red test: `project_memory/runlogs/20260709-650-element-catalog-status-red-test.txt` failed because `profile.conformance.elementCatalog.expectedTypes` was absent and `getArchimate4ImplementationStatus()` did not expose exact catalog drift fields.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records the C260-derived `elementCatalog.expectedTypes` list for all 42 standard elements.
- Implemented: `lib/metamodel/languages/index.js` now summarizes `elementCatalog.actualTypes`, `missingTypes`, `extraTypes`, `actualCount`, and `complete`, so a 42-item but wrong-type catalog cannot appear complete.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` now guard and describe the exact catalog status boundary.
- Verification: focused status test passed with 158 tests in `project_memory/runlogs/20260709-651-element-catalog-status-test.txt`; `npm run test:language` passed with 158 tests in `project_memory/runlogs/20260709-652-element-catalog-status-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-653-element-catalog-status-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-654-element-catalog-status-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-655-element-catalog-status-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-656-element-catalog-status-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-657-element-catalog-status-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-658-element-catalog-status-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-659-element-catalog-status-final-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-element-catalog-status-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 104

- Goal: make the ArchiMate 4 relationship connector status auditable by exact type identity for `AndJunction` and `OrJunction`.
- Red test: `project_memory/runlogs/20260709-661-relationship-connector-status-red-test.txt` failed because `profile.conformance.relationshipConnectors` was absent and `getArchimate4ImplementationStatus()` did not expose a relationship connector catalog summarizer.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `relationshipConnectors.expectedTypes` for `AndJunction` and `OrJunction`, with an outside-element-catalog boundary and MEFF 4.0 representation marked source-dependent.
- Implemented: `lib/metamodel/languages/index.js` now uses shared catalog summarization for elements and relationship connectors, so `getArchimate4ImplementationStatus().relationshipConnectors` exposes `expectedTypes`, `actualTypes`, `missingTypes`, `extraTypes`, `actualCount`, and `complete` while preserving the previous `types` status alias.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now guard and describe the connector exact-status boundary.
- Verification: focused status test passed with 158 tests in `project_memory/runlogs/20260709-662-relationship-connector-status-test.txt`; `npm run test:language` passed with 158 tests in `project_memory/runlogs/20260709-663-relationship-connector-status-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-664-relationship-connector-status-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-665-relationship-connector-status-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-666-relationship-connector-status-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-667-relationship-connector-status-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-668-relationship-connector-status-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-669-relationship-connector-status-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-670-relationship-connector-status-final-diff-check.txt`; runlog whitespace trim recorded in `project_memory/runlogs/20260709-671-relationship-connector-status-runlog-trim.txt` and `project_memory/runlogs/20260709-672-relationship-connector-status-final-runlog-trim.txt`.
- Audit: `project_memory/audit/reports/20260709-relationship-connector-status-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 105

- Goal: make the C260-derived ArchiMate 4 conformance requirement map auditable by exact shall/may requirement identity, not only by counts.
- Red test: `project_memory/runlogs/20260709-675-conformance-requirement-catalog-red-test.txt` failed because `profile.conformance.requirementCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `requirementCatalog.expectedShallIds` and `expectedMayIds` for the five required C260 conformance clauses and the informative example-viewpoint may clause.
- Implemented: `lib/metamodel/languages/index.js` now summarizes `conformanceRequirements.expectedIds`, `actualIds`, `missingIds`, `extraIds`, and per-level shall/may exact status while preserving existing implemented/external-blocked/bundled counts.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now guard and describe the exact requirement-status boundary.
- Verification: focused status test passed with 158 tests in `project_memory/runlogs/20260709-676-conformance-requirement-catalog-test.txt`; `npm run test:language` passed with 158 tests in `project_memory/runlogs/20260709-677-conformance-requirement-catalog-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-678-conformance-requirement-catalog-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-679-conformance-requirement-catalog-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-680-conformance-requirement-catalog-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-681-conformance-requirement-catalog-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-682-conformance-requirement-catalog-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-683-conformance-requirement-catalog-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-684-conformance-requirement-catalog-final-diff-check.txt`; runlog whitespace trim recorded in `project_memory/runlogs/20260709-685-conformance-requirement-catalog-runlog-trim.txt`; pre-commit JSON/diff checks passed in `project_memory/runlogs/20260709-686-conformance-requirement-catalog-precommit-json-check.txt` and `project_memory/runlogs/20260709-687-conformance-requirement-catalog-precommit-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-conformance-requirement-catalog-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 106

- Goal: make the ArchiMate 4 source-evidence ledger auditable by exact source identity, not only by source counts.
- Red test: `project_memory/runlogs/20260709-688-source-coverage-catalog-red-test.txt` failed because `profile.conformance.sourceCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `sourceCoverageCatalog.expectedSourceIds`, `requiredSourceIds`, and `companionSourceIds` for C260, W262, launch transcript, Appendix B relationship matrix, MEFF 4.0 XSD, and Appendix A artwork-rights coverage.
- Implemented: `lib/metamodel/languages/index.js` now summarizes `sourceCoverage.expectedSourceIds`, `actualSourceIds`, `missingSourceIds`, `extraSourceIds`, `expectedCount`, and `complete` while preserving existing local/external and missing required/companion source summaries.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now guard and describe the exact source-coverage status boundary.
- Verification: the first focused test in `project_memory/runlogs/20260709-689-source-coverage-catalog-test.txt` exposed an abbreviated docs property-name mismatch; the corrected focused test passed with 158 tests in `project_memory/runlogs/20260709-690-source-coverage-catalog-focused-test.txt`; `npm run test:language` passed with 158 tests in `project_memory/runlogs/20260709-691-source-coverage-catalog-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-692-source-coverage-catalog-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-695-source-coverage-catalog-json-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-696-source-coverage-catalog-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-697-source-coverage-catalog-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-698-source-coverage-catalog-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-699-source-coverage-catalog-final-diff-check.txt`; pre-commit JSON/diff checks passed in `project_memory/runlogs/20260709-701-source-coverage-catalog-precommit-json-check.txt` and `project_memory/runlogs/20260709-700-source-coverage-catalog-precommit-diff-check.txt`; runlog whitespace trim recorded in `project_memory/runlogs/20260709-702-source-coverage-catalog-runlog-trim.txt`.
- Audit: `project_memory/audit/reports/20260709-source-coverage-catalog-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 107

- Goal: make ArchiMate 4 external blocker identity auditable by exact blocker id across readiness, requirements, and source coverage.
- Red test: `project_memory/runlogs/20260709-704-external-blocker-catalog-red-test.txt` failed because `profile.conformance.externalBlockerCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `externalBlockerCatalog.expectedIds` for `officialAppendixBRelationshipMatrix`, `officialMeff4Xsd`, and `exactAppendixAArtworkRights`.
- Implemented: `lib/metamodel/languages/index.js` now derives `externalBlockerCatalog.expectedIds`, `actualIds`, `missingIds`, `extraIds`, per-source blocker lists, and `complete` from profile readiness, conformance requirements, and source coverage while preserving the existing `externalBlockers` array as `actualIds`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now guard and describe exact blocker-id coverage.
- Verification: the first focused test in `project_memory/runlogs/20260709-705-external-blocker-catalog-focused-test.txt` exposed the now-removed hard-coded blocker-id expectation in `lib/metamodel/languages/index.js`; the corrected focused test passed with 158 tests in `project_memory/runlogs/20260709-706-external-blocker-catalog-focused-test.txt`; `npm run test:language` passed with 158 tests in `project_memory/runlogs/20260709-707-external-blocker-catalog-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-708-external-blocker-catalog-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-709-external-blocker-catalog-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-710-external-blocker-catalog-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-711-external-blocker-catalog-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-712-external-blocker-catalog-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-713-external-blocker-catalog-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-714-external-blocker-catalog-final-diff-check.txt`; runlog whitespace trim recorded in `project_memory/runlogs/20260709-715-external-blocker-catalog-runlog-trim.txt`; pre-commit JSON/diff checks passed in `project_memory/runlogs/20260709-716-external-blocker-catalog-precommit-json-check.txt` and `project_memory/runlogs/20260709-717-external-blocker-catalog-precommit-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-external-blocker-catalog-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 108

- Goal: make the official-conformance readiness action list auditable by exact external blocker id.
- Red test: `project_memory/runlogs/20260709-720-readiness-action-catalog-red-test.txt` failed because `profile.conformance.readiness.requiredBeforeClaimBlockerIds` and `requiredBeforeClaimByBlocker` were absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now maps each required-before-claim action to `officialAppendixBRelationshipMatrix`, `officialMeff4Xsd`, and `exactAppendixAArtworkRights` while preserving the existing `requiredBeforeClaim` action list.
- Implemented: `lib/metamodel/languages/index.js` now exposes `conformanceReadiness.requiredBeforeClaimBlockerIds`, `actualRequiredBeforeClaimBlockerIds`, `missingRequiredBeforeClaimBlockerIds`, `extraRequiredBeforeClaimBlockerIds`, and `requiredBeforeClaimByBlocker` from `getArchimate4ImplementationStatus()`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now guard and describe blocker-specific readiness actions.
- Verification: focused readiness test passed with 158 tests in `project_memory/runlogs/20260709-721-readiness-action-catalog-focused-test.txt`; `npm run test:language` passed with 158 tests in `project_memory/runlogs/20260709-722-readiness-action-catalog-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-723-readiness-action-catalog-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-724-readiness-action-catalog-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-725-readiness-action-catalog-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-726-readiness-action-catalog-demo-build.txt`.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-728-readiness-action-catalog-final-json-check.txt`; working-tree diff check passed in `project_memory/runlogs/20260709-729-readiness-action-catalog-final-diff-check.txt`; staged diff check passed in `project_memory/runlogs/20260709-730-readiness-action-catalog-precommit-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-727-readiness-action-catalog-repo-lint.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-readiness-action-catalog-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 109

- Goal: refresh the official MEFF 4.0 XSD evidence before relying on the current external-source blocker.
- Source check: `project_memory/runlogs/20260709-731-meff4-xsd-latest-recheck.txt` records the official `https://www.opengroup.org/xsd/archimate/` result as HTTP 200 with only 3.1 Model/View/Diagram XSD links; tested 4.0 directory, Model/Diagram/View XSD, `archimate4.xsd`, and `archimate4_ModelExchangeFile.xsd` candidate URLs returned 404.
- Red test: `project_memory/runlogs/20260709-732-meff4-xsd-latest-red-test.txt` failed because `sourceCoverage.meff4Xsd.lastRunlogPath` still pointed at `project_memory/runlogs/20260709-606-meff4-xsd-current-recheck.txt`.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records the latest official XSD directory recheck in `sourceCoverage.meff4Xsd`, including the extra tested `archimate4.xsd` and `archimate4_ModelExchangeFile.xsd` candidate URLs.
- Tests/docs: `test/language-profile.test.mjs`, `docs/archimate4/sources.md`, and `docs/archimate4/official-specification.md` now guard and describe the latest MEFF 4.0 XSD evidence.
- Verification: focused source-coverage test passed with 158 tests in `project_memory/runlogs/20260709-733-meff4-xsd-latest-focused-test.txt`; `npm run test:language` passed with 158 tests in `project_memory/runlogs/20260709-734-meff4-xsd-latest-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-735-meff4-xsd-latest-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-736-meff4-xsd-latest-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-737-meff4-xsd-latest-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-738-meff4-xsd-latest-demo-build.txt`.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-740-meff4-xsd-latest-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-741-meff4-xsd-latest-final-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-739-meff4-xsd-latest-repo-lint.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-meff4-xsd-latest-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 110

- Goal: make the residual ArchiMate 4 implementation gaps auditable as one exact catalog, so official-conformance blockers and the W262 companion-source gap are not confused with implemented C260 requirements.
- Red test: `project_memory/runlogs/20260709-742-remaining-gap-catalog-red-test.txt` failed because `profile.conformance.gapCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `gapCatalog.expectedIds` and `gaps` for `officialAppendixBRelationshipMatrix`, `officialMeff4Xsd`, `exactAppendixAArtworkRights`, and `w262CompanionPaper`.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().remainingGaps` with expected/actual/missing/extra ids, official-conformance blocker alignment, companion-source gap alignment, and unresolved gap ids.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now guard and describe the exact remaining-gap status boundary.
- Verification: focused remaining-gap test passed with 159 tests in `project_memory/runlogs/20260709-743-remaining-gap-catalog-focused-test.txt`; `npm run test:language` passed with 159 tests in `project_memory/runlogs/20260709-744-remaining-gap-catalog-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-745-remaining-gap-catalog-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-746-remaining-gap-catalog-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-747-remaining-gap-catalog-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-748-remaining-gap-catalog-demo-build.txt`.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-752-remaining-gap-catalog-final-json-check.txt`; `git diff --check` passed with only the existing state JSON line-ending warning in `project_memory/runlogs/20260709-753-remaining-gap-catalog-final-diff-check.txt`.
- Additional evidence: direct Node ESM import of `lib/metamodel/languages/index.js` failed in `project_memory/runlogs/20260709-750-remaining-gap-catalog-status-api.txt` because existing JSON imports require import attributes under Node 24; profile-level gap identity was verified with CommonJS JSON reading in `project_memory/runlogs/20260709-751-remaining-gap-catalog-profile-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-749-remaining-gap-catalog-repo-lint.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-remaining-gap-catalog-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 111

- Goal: make broad C260 chapter and appendix coverage auditable by exact section identity, not only by individual feature and blocker catalogs.
- Source check: `project_memory/runlogs/20260709-756-c260-outline-current-audit.txt` extracted the current local C260 PDF metadata and outline, including chapters 3 through 14 plus Appendices A, B, C, and E.
- Red test: `project_memory/runlogs/20260709-757-section-coverage-red-test.txt` failed because `profile.conformance.sectionCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `sectionCoverageCatalog.expectedIds` and `sectionCoverage` for the reviewed C260 language chapters and implementation-relevant appendices.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().sectionCoverage` with expected/actual/missing/extra ids, external-dependent section ids, optional section ids, and implemented section ids.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now guard and describe exact C260 section coverage.
- Verification: focused section-coverage test passed with 160 tests in `project_memory/runlogs/20260709-758-section-coverage-focused-test.txt`; `npm run test:language` passed with 160 tests in `project_memory/runlogs/20260709-759-section-coverage-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-760-section-coverage-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-761-section-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-762-section-coverage-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-763-section-coverage-demo-build.txt`.
- Additional evidence: profile-level section identity was verified in `project_memory/runlogs/20260709-765-section-coverage-profile-check.txt`, including the two external-dependent sections and one optional section.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-766-section-coverage-final-json-check.txt`; `git diff --check` passed with only the existing state JSON line-ending warning in `project_memory/runlogs/20260709-767-section-coverage-final-diff-check.txt`; staged diff check passed in `project_memory/runlogs/20260709-769-section-coverage-staged-diff-check.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-764-section-coverage-repo-lint.txt` with 4383 existing errors.
- Audit: `project_memory/audit/reports/20260709-section-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 112

- Goal: align the C260 section coverage catalog with the existing conformance requirement and external blocker catalogs, so section coverage cannot reference unregistered ids.
- Red test: `project_memory/runlogs/20260709-770-section-coverage-reference-red-test.txt` failed because `sectionCoverageCatalog.expectedRequirementIds` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `sectionCoverageCatalog.expectedRequirementIds`, `sectionCoverageCatalog.expectedExternalBlockerIds`, and the `language-structure` section's `requirementId`.
- Implemented: `lib/metamodel/languages/index.js` now passes conformance requirement and external blocker summaries into `summarizeSectionCoverage()` and exposes requirement/blocker alignment fields including `missingRequirementReferenceIds` and `missingExternalBlockerReferenceIds`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and `docs/superpowers/plans/2026-07-08-archimate-4-support.md` now guard and describe section requirement/blocker reference alignment.
- Focused verification: `project_memory/runlogs/20260709-771-section-coverage-reference-focused-test.txt` passed for the section coverage identity test.
- Verification: `npm run test:language` passed with 160 tests in `project_memory/runlogs/20260709-772-section-coverage-reference-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-773-section-coverage-reference-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-774-section-coverage-reference-json-check.txt`; `git diff --check` passed with the existing state JSON CRLF warning in `project_memory/runlogs/20260709-775-section-coverage-reference-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-776-section-coverage-reference-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-777-section-coverage-reference-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-778-section-coverage-reference-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-779-section-coverage-reference-final-diff-check.txt`; staged diff check passed in `project_memory/runlogs/20260709-780-section-coverage-reference-staged-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-section-coverage-reference-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 113

- Goal: make the XML boundary stronger by proving internal read/write/read round-trip coverage for the current 3.x and experimental 4.0 descriptors while keeping official MEFF 4.0 conformance blocked on the official XSD.
- Red test: `project_memory/runlogs/20260709-781-xml-roundtrip-exchange-format-red-test.txt` failed because `exchangeFormat.internalRoundTripTested` was absent; the same run also showed the new 3.x and 4.0 internal fixture round-trip checks already passed.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `exchangeFormat.internalRoundTripTested`, `internalRoundTripRunlogPath`, and `officialConformanceClaimable: false`.
- Tests/docs: `test/xml-roundtrip.test.mjs` now performs descriptor read/write/read checks for the 3.x and 4.0 minimal fixtures; `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now describe the internal round-trip versus official MEFF 4.0 boundary.
- Focused verification: `project_memory/runlogs/20260709-781-xml-roundtrip-exchange-format-test.txt` passed with 3 tests.
- Verification: `npm run test:language` passed with 162 tests in `project_memory/runlogs/20260709-782-xml-internal-roundtrip-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-783-xml-internal-roundtrip-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-784-xml-internal-roundtrip-json-check.txt`; `git diff --check` passed with the existing state JSON CRLF warning in `project_memory/runlogs/20260709-785-xml-internal-roundtrip-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-786-xml-internal-roundtrip-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-787-xml-internal-roundtrip-repo-lint.txt` with 4383 existing errors.
- Final record checks: JSON parsed in `project_memory/runlogs/20260709-788-xml-internal-roundtrip-final-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-789-xml-internal-roundtrip-final-diff-check.txt`; staged diff check passed in `project_memory/runlogs/20260709-790-xml-internal-roundtrip-staged-diff-check.txt`.
- Audit: `project_memory/audit/reports/20260709-xml-internal-roundtrip-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 114

- Goal: make the ArchiMate 4 implementation status API directly executable from Node ESM audit tooling without loading the browser/webpack package root.
- Red test: `project_memory/runlogs/20260709-791-status-api-node-esm-red-test.txt` failed because the language status API dependency path imported JSON profiles without Node ESM import attributes.
- Implemented: `lib/metamodel/languages/index.js` and `lib/metamodel/languages/archimate4-relationships.js` now use JSON import attributes for profile JSON imports and explicit `.js` specifiers for local source imports on the status API path.
- Implemented: `lib/util/ModelUtil.js` and the legacy relationship map modules now use explicit `.js` specifiers where the status API path resolves through the fallback relationship map data; one trailing blank-line whitespace issue in `lib/metamodel/ImpMigRelationshipMap.js` was removed instead of broad generated-map reformatting.
- Tests/docs: `test/language-profile.test.mjs` now verifies direct Node ESM import of `getArchimate4ImplementationStatus()` from `lib/metamodel/languages/index.js`; README and `docs/archimate4/sources.md` document that Node audit tooling should use that path while the package root remains the browser/webpack-oriented entry point.
- Focused verification: `project_memory/runlogs/20260709-792-status-api-node-esm-focused-test.txt` passed for the direct Node ESM status API test.
- Verification: `npm run test:language` passed with 163 tests in `project_memory/runlogs/20260709-793-status-api-node-esm-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-794-status-api-node-esm-eslint-registry.txt`; relationship map syntax lint passed with legacy generated-map indentation disabled in `project_memory/runlogs/20260709-794b-status-api-node-esm-relationship-map-eslint.txt`; JSON parse check passed in `project_memory/runlogs/20260709-795-status-api-node-esm-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-796-status-api-node-esm-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-797-status-api-node-esm-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-798-status-api-node-esm-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-status-api-node-esm-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 115

- Goal: make exact C260 section coverage start at the actual reviewed C260 outline, including Chapter 1 Introduction/Conformance and Chapter 2 Definitions rather than only Chapter 3 and later implementation-heavy chapters.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` re-extracted the current local C260 PDF outline and confirmed Chapter 1 Introduction and Chapter 2 Definitions before Chapter 3 Language Structure.
- Red test: `project_memory/runlogs/20260709-807-c260-preface-section-coverage-red-test.txt` failed because `sectionCoverageCatalog.expectedIds` did not include `introduction-and-conformance` or `definitions`.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now sets `sectionCoverageCatalog.sourceRunlogPath` to the current outline extraction, raises `expectedCount` to 18, and tracks `introduction-and-conformance` and `definitions` as explicit section coverage entries.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now describe and guard the Chapter 1/2 section coverage boundary.
- Focused verification: `project_memory/runlogs/20260709-808-c260-preface-section-coverage-focused-test.txt` passed for the section coverage identity test; `project_memory/runlogs/20260709-809-c260-preface-section-coverage-status.json` shows expectedCount 18, no missing ids, no extra ids, and complete true.
- Verification: `npm run test:language` passed with 163 tests in `project_memory/runlogs/20260709-810-c260-preface-section-coverage-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-811-c260-preface-section-coverage-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-812-c260-preface-section-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-813-c260-preface-section-coverage-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-814-c260-preface-section-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-815-c260-preface-section-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-preface-section-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 116

- Goal: make C260 Chapter 2 Definitions auditable by exact vocabulary identity rather than only by the broad `definitions` section id.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` already confirms the 16 Chapter 2 definition headings from 2.1 through 2.16.
- Red test: `project_memory/runlogs/20260709-820-c260-definition-vocabulary-red-test.txt` failed because `definitionCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `definitionCoverageCatalog` and `definitionCoverage` for the 16 Chapter 2 definition headings without copying definition prose.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().definitionCoverage` with expected/actual/missing/extra ids, `missingDefinitionIds`, `extraDefinitionIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 2 vocabulary boundary.
- Focused verification: `project_memory/runlogs/20260709-821-c260-definition-vocabulary-focused-test.txt` passed for the definition vocabulary identity test; `project_memory/runlogs/20260709-822-c260-definition-vocabulary-status.json` shows expectedCount 16, actualCount 16, no missing definition ids, no extra definition ids, and complete true.
- Verification: `npm run test:language` passed with 164 tests in `project_memory/runlogs/20260709-823-c260-definition-vocabulary-test-language.txt`; registry scoped ESLint passed in `project_memory/runlogs/20260709-824-c260-definition-vocabulary-eslint-registry.txt`; JSON parse check passed in `project_memory/runlogs/20260709-825-c260-definition-vocabulary-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-826-c260-definition-vocabulary-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-827-c260-definition-vocabulary-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-828-c260-definition-vocabulary-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-definition-vocabulary-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 117

- Goal: make C260 Chapter 1 Introduction/Conformance auditable by exact outline identity rather than only by the broad `introduction-and-conformance` section id.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` already confirms the six Chapter 1 headings from 1.1 through 1.6.
- Red test: `project_memory/runlogs/20260709-833-c260-introduction-coverage-red-test.txt` failed because `introductionCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `introductionCoverageCatalog` and `introductionCoverage` for the six Chapter 1 subsection headings without copying introductory prose.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().introductionCoverage` with expected/actual/missing/extra ids, `missingIntroductionIds`, `extraIntroductionIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 1 outline boundary.
- Focused verification: `project_memory/runlogs/20260709-834-c260-introduction-coverage-focused-test.txt` passed for the introduction coverage identity test; `project_memory/runlogs/20260709-835-c260-introduction-coverage-status.json` shows expectedCount 6, actualCount 6, no missing introduction ids, no extra introduction ids, and complete true.
- Verification: `npm run test:language` passed in `project_memory/runlogs/20260709-836-c260-introduction-coverage-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-837-c260-introduction-coverage-eslint-registry.txt`; full registry scoped ESLint passed in `project_memory/runlogs/20260709-837b-c260-introduction-coverage-eslint-registry-full.txt`; JSON parse check passed in `project_memory/runlogs/20260709-838-c260-introduction-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-839-c260-introduction-coverage-diff-check.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-840-c260-introduction-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-841-c260-introduction-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-introduction-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 118

- Goal: make C260 Chapter 3 Language Structure auditable by exact outline identity rather than only by the broad `language-structure` section id.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` confirms the Chapter 3 outline from 3.1 through 3.8, including the nested 3.2.1/3.2.2 and 3.4.1 through 3.4.4 headings.
- Red test: `project_memory/runlogs/20260709-845-c260-language-structure-coverage-red-test.txt` failed because `languageStructureCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `languageStructureCoverageCatalog` and `languageStructureCoverage` for the fourteen Chapter 3 outline headings without copying language-structure prose.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().languageStructureCoverage` with expected/actual/missing/extra ids, `missingLanguageStructureIds`, `extraLanguageStructureIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 3 Language Structure outline boundary.
- Focused verification: `project_memory/runlogs/20260709-846-c260-language-structure-coverage-focused-test.txt` passed for the language structure coverage identity test; `project_memory/runlogs/20260709-847-c260-language-structure-coverage-status.json` shows expectedCount 14, actualCount 14, no missing language-structure ids, no extra language-structure ids, and complete true.
- Verification: `npm run test:language` passed with 166 tests in `project_memory/runlogs/20260709-848-c260-language-structure-coverage-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-849-c260-language-structure-coverage-eslint-changed.txt`; JSON parse check passed in `project_memory/runlogs/20260709-850-c260-language-structure-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-851-c260-language-structure-coverage-diff-check.txt`; full registry scoped ESLint passed in `project_memory/runlogs/20260709-852-c260-language-structure-coverage-eslint-registry-full.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-853-c260-language-structure-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-854-c260-language-structure-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-language-structure-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 119

- Goal: make C260 Chapter 4 Common Domain auditable by exact outline identity rather than only by the broad `common-domain` section id.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` confirms the Chapter 4 outline from 4.1 through 4.4, including Role, Collaboration, Path, Service, Process, Function, Event, Grouping, and Location headings.
- Red test: `project_memory/runlogs/20260709-858-c260-common-domain-coverage-red-test.txt` failed because `commonDomainCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `commonDomainCoverageCatalog` and `commonDomainCoverage` for the thirteen Chapter 4 outline headings without copying Common Domain prose.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().commonDomainCoverage` with expected/actual/missing/extra ids, `missingCommonDomainIds`, `extraCommonDomainIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 4 Common Domain outline boundary.
- Focused verification: `project_memory/runlogs/20260709-859-c260-common-domain-coverage-focused-test.txt` passed for the Common Domain coverage identity test; `project_memory/runlogs/20260709-860-c260-common-domain-coverage-status.json` shows expectedCount 13, actualCount 13, no missing Common Domain ids, no extra Common Domain ids, and complete true.
- Verification: `npm run test:language` passed with 167 tests in `project_memory/runlogs/20260709-861-c260-common-domain-coverage-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-862-c260-common-domain-coverage-eslint-changed.txt`; JSON parse check passed in `project_memory/runlogs/20260709-863-c260-common-domain-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-864-c260-common-domain-coverage-diff-check.txt`; full registry scoped ESLint passed in `project_memory/runlogs/20260709-865-c260-common-domain-coverage-eslint-registry-full.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-866-c260-common-domain-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-867-c260-common-domain-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-common-domain-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 120

- Goal: make C260 Chapter 5 Relationships and Junctions auditable by exact outline identity rather than only by the broad `relationships-and-junctions` section id.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` confirms the Chapter 5 outline from 5.1 through 5.8, including relationship categories, individual relationship headings, Junctions, Multiplicity, Summary, and Derivation headings.
- Red test: `project_memory/runlogs/20260709-871-c260-relationships-junctions-coverage-red-test.txt` failed because `relationshipsAndJunctionsCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `relationshipsAndJunctionsCoverageCatalog` and `relationshipsAndJunctionsCoverage` for the twenty-four Chapter 5 outline headings without copying relationship prose or Appendix B matrix data.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().relationshipsAndJunctionsCoverage` with expected/actual/missing/extra ids, `missingRelationshipsAndJunctionsIds`, `extraRelationshipsAndJunctionsIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 5 Relationships and Junctions outline boundary.
- Focused verification: `project_memory/runlogs/20260709-872-c260-relationships-junctions-coverage-focused-test.txt` passed for the Relationships and Junctions coverage identity test; `project_memory/runlogs/20260709-873-c260-relationships-junctions-coverage-status.json` shows expectedCount 24, actualCount 24, no missing Relationships and Junctions ids, no extra Relationships and Junctions ids, and complete true.
- Verification: `npm run test:language` passed with 168 tests in `project_memory/runlogs/20260709-874-c260-relationships-junctions-coverage-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-875-c260-relationships-junctions-coverage-eslint-changed.txt`; JSON parse check passed in `project_memory/runlogs/20260709-876-c260-relationships-junctions-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-877-c260-relationships-junctions-coverage-diff-check.txt`; full registry scoped ESLint passed in `project_memory/runlogs/20260709-878-c260-relationships-junctions-coverage-eslint-registry-full.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-879-c260-relationships-junctions-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-880-c260-relationships-junctions-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-relationships-junctions-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 121

- Goal: make C260 Chapter 6 Motivation Domain auditable by exact outline identity rather than only by broad Motivation element support.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` confirms the Chapter 6 outline from 6.1 through 6.7, including Stakeholder, Driver, Assessment, Goal, Outcome, Principle, Requirement, Meaning, Value, summary, and relationships-with-other-domains headings.
- Red test: `project_memory/runlogs/20260709-884-c260-motivation-domain-coverage-red-test.txt` failed because `motivationDomainCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `motivationDomainCoverageCatalog` and `motivationDomainCoverage` for the nineteen Chapter 6 outline headings without copying Motivation Domain prose.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().motivationDomainCoverage` with expected/actual/missing/extra ids, `missingMotivationDomainIds`, `extraMotivationDomainIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 6 Motivation Domain outline boundary.
- Focused verification: `project_memory/runlogs/20260709-885-c260-motivation-domain-coverage-focused-test.txt` passed for the Motivation Domain coverage identity test; `project_memory/runlogs/20260709-886-c260-motivation-domain-coverage-status.json` shows expectedCount 19, actualCount 19, no missing Motivation Domain ids, no extra Motivation Domain ids, and complete true.
- Verification: `npm run test:language` passed with 169 tests in `project_memory/runlogs/20260709-887-c260-motivation-domain-coverage-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-888-c260-motivation-domain-coverage-eslint-changed.txt`; JSON parse check passed in `project_memory/runlogs/20260709-889-c260-motivation-domain-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-890-c260-motivation-domain-coverage-diff-check.txt`; full registry scoped ESLint passed in `project_memory/runlogs/20260709-891-c260-motivation-domain-coverage-eslint-registry-full.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-892-c260-motivation-domain-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-893-c260-motivation-domain-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-motivation-domain-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 122

- Goal: make C260 Chapter 7 Strategy Domain auditable by exact outline identity rather than only by broad Strategy element support.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` confirms the Chapter 7 outline from 7.1 through 7.6, including Resource, Capability, Value Stream, Course of Action, examples, summary, and relationships-with-other-domains headings.
- Red test: `project_memory/runlogs/20260709-897-c260-strategy-domain-coverage-red-test.txt` failed because `strategyDomainCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `strategyDomainCoverageCatalog` and `strategyDomainCoverage` for the ten Chapter 7 outline headings without copying Strategy Domain prose.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().strategyDomainCoverage` with expected/actual/missing/extra ids, `missingStrategyDomainIds`, `extraStrategyDomainIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 7 Strategy Domain outline boundary.
- Focused verification: `project_memory/runlogs/20260709-898-c260-strategy-domain-coverage-focused-test.txt` passed for the Strategy Domain coverage identity test; `project_memory/runlogs/20260709-899-c260-strategy-domain-coverage-status.json` shows expectedCount 10, actualCount 10, no missing Strategy Domain ids, no extra Strategy Domain ids, and complete true.
- Verification: `npm run test:language` passed with 170 tests in `project_memory/runlogs/20260709-900-c260-strategy-domain-coverage-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-901-c260-strategy-domain-coverage-eslint-changed.txt`; JSON parse check passed in `project_memory/runlogs/20260709-902-c260-strategy-domain-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-903-c260-strategy-domain-coverage-diff-check.txt`; full registry scoped ESLint passed in `project_memory/runlogs/20260709-904-c260-strategy-domain-coverage-eslint-registry-full.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-905-c260-strategy-domain-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-906-c260-strategy-domain-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-strategy-domain-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 123

- Goal: make C260 Chapter 8 Business Domain auditable by exact outline identity rather than only by broad Business element support.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` confirms the Chapter 8 outline from 8.1 through 8.5, including Business Actor, Business Interface, Business Object, Product, examples, and summary headings.
- Red test: `project_memory/runlogs/20260709-910-c260-business-domain-coverage-red-test.txt` failed because `businessDomainCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `businessDomainCoverageCatalog` and `businessDomainCoverage` for the twelve Chapter 8 outline headings without copying Business Domain prose.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().businessDomainCoverage` with expected/actual/missing/extra ids, `missingBusinessDomainIds`, `extraBusinessDomainIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 8 Business Domain outline boundary.
- Focused verification: `project_memory/runlogs/20260709-911-c260-business-domain-coverage-focused-test.txt` passed for the Business Domain coverage identity test; `project_memory/runlogs/20260709-912-c260-business-domain-coverage-status.json` shows expectedCount 12, actualCount 12, no missing Business Domain ids, no extra Business Domain ids, and complete true.
- Verification: `npm run test:language` passed with 171 tests in `project_memory/runlogs/20260709-913-c260-business-domain-coverage-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-914-c260-business-domain-coverage-eslint-changed.txt`; JSON parse check passed in `project_memory/runlogs/20260709-915-c260-business-domain-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-916-c260-business-domain-coverage-diff-check.txt`; full registry scoped ESLint passed in `project_memory/runlogs/20260709-917-c260-business-domain-coverage-eslint-registry-full.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-918-c260-business-domain-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-919-c260-business-domain-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-business-domain-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

## 2026-07-09 loop 124

- Goal: make C260 Chapter 9 Application Domain auditable by exact outline identity rather than only by broad Application element support.
- Source check: `project_memory/runlogs/20260709-805-c260-outline-current-extract.txt` confirms the Chapter 9 outline from 9.1 through 9.4, including Application Component, Application Interface, Data Object, examples, and summary headings.
- Red test: `project_memory/runlogs/20260709-923-c260-application-domain-coverage-red-test.txt` failed because `applicationDomainCoverageCatalog` was absent.
- Implemented: `lib/metamodel/languages/archimate4-profile.json` now records `applicationDomainCoverageCatalog` and `applicationDomainCoverage` for the nine Chapter 9 outline headings without copying Application Domain prose.
- Implemented: `lib/metamodel/languages/index.js` now exposes `getArchimate4ImplementationStatus().applicationDomainCoverage` with expected/actual/missing/extra ids, `missingApplicationDomainIds`, `extraApplicationDomainIds`, `actualCount`, and `complete`.
- Tests/docs: `test/language-profile.test.mjs`, README, `docs/archimate4/sources.md`, `docs/archimate4/official-specification.md`, and the implementation plan now guard and describe the exact Chapter 9 Application Domain outline boundary.
- Focused verification: `project_memory/runlogs/20260709-924-c260-application-domain-coverage-focused-test.txt` passed for the Application Domain coverage identity test; `project_memory/runlogs/20260709-925-c260-application-domain-coverage-status.json` shows expectedCount 9, actualCount 9, no missing Application Domain ids, no extra Application Domain ids, and complete true.
- Verification: `npm run test:language` passed with 172 tests in `project_memory/runlogs/20260709-926-c260-application-domain-coverage-test-language.txt`; changed-file ESLint passed in `project_memory/runlogs/20260709-927-c260-application-domain-coverage-eslint-changed.txt`; JSON parse check passed in `project_memory/runlogs/20260709-928-c260-application-domain-coverage-json-check.txt`; `git diff --check` passed in `project_memory/runlogs/20260709-929-c260-application-domain-coverage-diff-check.txt`; full registry scoped ESLint passed in `project_memory/runlogs/20260709-930-c260-application-domain-coverage-eslint-registry-full.txt`; `npm run demo:build` passed in `project_memory/runlogs/20260709-931-c260-application-domain-coverage-demo-build.txt`.
- Known lint status: repo-wide `npm run lint` remains the expected legacy failure, recorded in `project_memory/runlogs/20260709-932-c260-application-domain-coverage-repo-lint.txt` with 4382 existing errors.
- Audit: `project_memory/audit/reports/20260709-c260-application-domain-coverage-audit.md`.
- Remaining open issues: exact C260 Appendix A vector artwork redistribution, official Appendix B relationship matrix data, W262 PDF local availability, and MEFF 4.0 XSD remain external-source dependent.

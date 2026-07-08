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

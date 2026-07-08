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

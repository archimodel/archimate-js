# ArchiMate 4 Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `archimate-js` が既存の ArchiMate 3.x import/export/modeling を壊さず、ArchiMate 4.0 の言語プロファイル、XML 入出力、関係制約、移行警告、パレット表示を扱えるようにする。

**Architecture:** 現在は `lib/metamodel/Concept.js`、`lib/util/ModelUtil.js`、`lib/metamodel/*RelationshipMap.js`、`lib/moddle/resources/archimate.json` に ArchiMate 3 系の前提が直書きされている。対応方針は、3.x を既定値として残しつつ、`archimateVersion` によって言語プロファイル、moddle descriptor、パレット、関係制約、移行処理を切り替える構造にする。ArchiMate 4 の標準差分は仕様由来データとして隔離し、UI/描画コードから直接参照しない。

**Tech Stack:** JavaScript ES modules, diagram-js, moddle, moddle-xml, Node.js built-in test runner, PowerShell.

## Current Execution Status

Last reviewed against the current branch on 2026-07-09.

This original plan is retained as the implementation brief. Its step checkboxes below are historical
and should not be used alone as current progress. Use the implementation evidence in
`docs/archimate4/official-specification.md`, `docs/archimate4/sources.md`,
`project_memory/state/aria_state.json`, `project_memory/logs/worklog.md`, and the branch commits as
the current source of truth.
External-source evidence for W262 and MEFF 4.0 XSD was refreshed on 2026-07-10T03:35:00+09:00 in
`project_memory/runlogs/20260710-0173-external-source-current-recheck.json`.
Local ArchiMate-related PDF inventory was refreshed on 2026-07-09T21:10:00+09:00 in
`project_memory/runlogs/20260709-2110-local-archimate-pdf-identification.json`; it identifies local
C260 and ArchiMate 4 license PDFs and confirms no W262 candidate among those local PDFs.
Local ArchiMate 4 Non-Commercial License boundary evidence was recorded on 2026-07-09T21:25:00+09:00
in `project_memory/runlogs/20260709-2125-archimate4-ncl-license-boundary.json`; it is sanitized and
does not clear the Appendix B redistributable-profile blocker or Appendix A exact-artwork-rights blocker.
The current M0-M5 completion audit is executable via `scripts/audit_archimate4_completion.mjs`; the
latest run is recorded in `project_memory/runlogs/20260709-1030-archimate4-completion-audit.json`.
The C260 coverage ledger audit is executable via `scripts/audit_archimate4_c260_coverage.mjs`; it
checks section, aggregate, outline-assignment, Appendix F derived-token, and source-runlog evidence
without copying specification prose or Appendix B relationship tables.

Implemented and verified on the current branch:

- M0 Source Gate: C260 local PDF and launch transcript are recorded; W262, MEFF 4.0 XSD, Appendix B
  relationship matrix redistribution, and exact Appendix A artwork rights remain explicit external
  blockers.
- M1 Runtime Boundary: `archimateVersion` selects versioned language profiles; ArchiMate 3.x remains
  the default; ArchiMate 4 exposes the C260-derived 42-element catalog and relationship connectors.
- M2 XML Boundary: moddle descriptors and model templates are version-aware, and 3.x/4.0 minimal
  fixtures have internal read/write/read round-trip coverage. ArchiMate 4 exchange remains
  experimental until an official MEFF 4.0 XSD is available.
- M3 Semantics: relationship validation routes through the active profile; host-supplied Appendix B
  profiles are supported as nested data, rows, matrices, CSV/TSV text, or JSON strings; migration and
  derivation helpers are implemented from non-verbatim C260-derived requirements where redistribution
  permits; model-level diagnostics now check catalog/profile/multiplicity/junction/view-reference
  consistency without embedding Appendix B table data.
- M4 Modeling UX: the palette, renderer, relationship options, multiplicity editing/persistence,
  junction behavior, profile customization, viewpoint metadata, nested view nodes, organization tree
  descriptors, Appendix C example viewpoint informative catalog, and local Appendix A-derived
  pictogram paths are implemented for ArchiMate 4 mode. The Viewer and Editor demos also surface the
  host-facing conformance report so official blockers and companion gaps are visible in 4.0 mode,
  while 3.x mode stays marked as not applicable.
- M5 Release Readiness: README, CHANGELOG, source ledger, implementation specification, runlogs, and
  audit reports document the opt-in status, compatibility behavior, verification commands, and
  conformance boundaries.

Current machine-readable status is exposed by `getArchimate4ImplementationStatus()`. The element
catalog status reports `expectedTypes`, `actualTypes`, `missingTypes`, and `extraTypes` for exact
C260 type-coverage auditing. Relationship connector status reports the same exact fields for
`AndJunction` and `OrJunction` outside the 42-element catalog. Conformance requirement status reports
`expectedIds`, `actualIds`, `missingIds`, and `extraIds` for the C260-derived shall/may map.
Optional Appendix C example viewpoints are tracked through `conformanceRequirements.may.notBundled`
and must not become official conformance blockers or missing required sources.
Relationship profile status reports `sourceScope`, so default compatibility fallback, explicitly
global external profiles, and viewer/modeler-constructor scoped profiles can be distinguished; a
later 4.0 viewer/modeler constructed without `archimate4RelationshipProfile` resets only the
constructor-scoped profile back to fallback.
Conformance readiness reports `requiredBeforeClaimByBlocker`,
`missingRequiredBeforeClaimBlockerIds`, and `extraRequiredBeforeClaimBlockerIds` so every
official-claim prerequisite remains aligned to an external blocker id.
Model validation status reports `expectedCheckIds`, `actualCheckIds`, `missingCheckIds`, and
`extraCheckIds` for the host-callable model diagnostics that cover concept container structure, element catalog membership,
retired ArchiMate 3 concepts, relationship catalog, endpoint references, and endpoint type support, active profile checks,
multiplicity notation, junction consistency, view tree structure, view viewpoint string attributes and references, Viewpoints container structure, viewpoint
definitions including purpose/content token-field structure and allowed-type string entries, relationship option field types, present IdObject
id and xsi:type string values, view node element references, view element label string values and geometry, view connection relationship references, endpoint references,
endpoint-to-relationship alignment, waypoint geometry, and view `style`/`font`/`color` values including invalid
`font.style` `plain` combinations, model-defined and
profile-defined viewpoint allowed-type application to View contents, stakeholder/concern and
modeling-note structure, BaseObject name/documentation string fields, organization tree structure and identifier
references, PropertyDefinitions / Properties container structure, property definition structure and references, present property value string structure, and
profile attribute property values.
Remaining gap status reports `expectedIds`, `actualIds`, `missingIds`, and `extraIds` for the
residual official-conformance blockers plus the W262 companion-source gap.
`getArchimate4ConformanceReport()` derives a flattened host-facing report from the same status
boundary, preserving blocker ids, missing required sources, required-before-claim actions, and
companion gaps so UI and audit tools do not need to reconstruct official conformance readiness
manually.
Section coverage status reports `expectedIds`, `actualIds`, `missingIds`, `extraIds`, `statusKeyIds`,
`missingRequirementReferenceIds`, `missingExternalBlockerReferenceIds`, and
`missingStatusKeyReferenceIds` for the reviewed C260 chapter and appendix outline, including Chapter
1 Introduction/Conformance and Chapter 2 Definitions, so broad specification coverage and its
conformance/blocker/status-key references cannot drift silently.
Introduction coverage status reports `expectedIds`, `actualIds`, `missingIntroductionIds`, and
`extraIntroductionIds` for the C260 Chapter 1 outline so Introduction/Conformance subsections cannot
drift silently.
It also reports `introductionCoverage.requirementSourceIds`,
`introductionCoverage.referenceOnlyIds`, `introductionCoverage.missingRequirementSourceIds`, and
`introductionCoverage.missingReferenceOnlyIds` so only the Conformance subsection is treated as the
Chapter 1 requirement source while Objective, Overview, Normative References, Terminology, and Future
Directions remain reference-only status items outside source gaps, remaining gaps, and official
conformance blockers.
Definition coverage status reports `expectedIds`, `actualIds`, `missingDefinitionIds`, and
`extraDefinitionIds` for the C260 Chapter 2 vocabulary without copying definition prose.
Language structure coverage status reports `expectedIds`, `actualIds`,
`missingLanguageStructureIds`, and `extraLanguageStructureIds` for the C260 Chapter 3 outline so
language-structure subsections cannot drift silently.
Common domain coverage status reports `expectedIds`, `actualIds`, `missingCommonDomainIds`, and
`extraCommonDomainIds` for the C260 Chapter 4 outline so Common Domain subsection and element
headings cannot drift silently.
Relationships and junctions coverage status reports `expectedIds`, `actualIds`,
`missingRelationshipsAndJunctionsIds`, and `extraRelationshipsAndJunctionsIds` for the C260 Chapter
5 outline so relationship, junction, multiplicity, and derivation subsection headings cannot drift
silently while Appendix B matrix data remains external.
Motivation domain coverage status reports `expectedIds`, `actualIds`, `missingMotivationDomainIds`,
and `extraMotivationDomainIds` for the C260 Chapter 6 outline so Motivation subsection and element
headings cannot drift silently.
Strategy domain coverage status reports `expectedIds`, `actualIds`, `missingStrategyDomainIds`, and
`extraStrategyDomainIds` for the C260 Chapter 7 outline so Strategy subsection and element headings
cannot drift silently.
Business domain coverage status reports `expectedIds`, `actualIds`, `missingBusinessDomainIds`, and
`extraBusinessDomainIds` for the C260 Chapter 8 outline so Business subsection and element headings
cannot drift silently.
Application domain coverage status reports `expectedIds`, `actualIds`,
`missingApplicationDomainIds`, and `extraApplicationDomainIds` for the C260 Chapter 9 outline so
Application subsection and element headings cannot drift silently.
Technology domain coverage status reports `expectedIds`, `actualIds`,
`missingTechnologyDomainIds`, and `extraTechnologyDomainIds` for the C260 Chapter 10 outline so
Technology subsection and element headings cannot drift silently.
Relationships between core domains coverage status reports `expectedIds`, `actualIds`,
`missingRelationshipsBetweenCoreDomainsIds`, and `extraRelationshipsBetweenCoreDomainsIds` for the
C260 Chapter 11 outline so cross-domain relationship subsection headings cannot drift silently.
Implementation and migration domain coverage status reports `expectedIds`, `actualIds`,
`missingImplementationAndMigrationDomainIds`, and `extraImplementationAndMigrationDomainIds` for
the C260 Chapter 12 outline so Implementation and Migration subsection and element headings cannot
drift silently.
Stakeholders architecture views viewpoints coverage status reports `expectedIds`, `actualIds`,
`missingStakeholdersArchitectureViewsViewpointsIds`, and
`extraStakeholdersArchitectureViewsViewpointsIds` for the C260 Chapter 13 outline so stakeholder,
architecture view, and viewpoint subsection headings cannot drift silently.
Language customization mechanisms coverage status reports `expectedIds`, `actualIds`,
`missingLanguageCustomizationMechanismsIds`, and `extraLanguageCustomizationMechanismsIds` for the
C260 Chapter 14 outline so attribute-extension and specialization subsection headings cannot drift
silently.
Profile attribute type status reports `expectedC260TypeNames`, `actualC260TypeNames`,
`missingC260TypeNames`, `implementationAdditionalTypeNames`, and `unexpectedAdditionalTypeNames` so
C260-derived basic/example profile attribute types and implementation-defined additions remain
separate and auditable.
Appendix A notation coverage status reports `expectedIds`, `actualIds`,
`missingAppendixANotationIds`, and `extraAppendixANotationIds` for the C260 Appendix A outline so
notation summary subsection headings cannot drift silently while exact artwork rights remain
external.
Appendix B relationships coverage status reports `expectedIds`, `actualIds`,
`missingAppendixBRelationshipsIds`, and `extraAppendixBRelationshipsIds` for the C260 Appendix B
outline so derivation, restriction, table, and relationship-between-relationships subsection
headings cannot drift silently while relationship table data remains external.
Appendix C example viewpoints coverage status reports `expectedIds`, `actualIds`,
`missingAppendixCExampleViewpointsIds`, and `extraAppendixCExampleViewpointsIds` for the C260
Appendix C outline so example viewpoint subsection headings cannot drift silently.
Appendix D standards guidance coverage status reports `expectedIds`, `actualIds`,
`missingAppendixDStandardsGuidanceIds`, `extraAppendixDStandardsGuidanceIds`,
`appendixDStandardsGuidanceCoverage.referenceOnlyIds`, and
`appendixDStandardsGuidanceCoverage.missingReferenceOnlyIds` for the C260 Appendix D outline so
related-standards and guidance-document subsection headings cannot drift silently or be confused
with source gaps, remaining gaps, readiness blockers, or official conformance blockers.
Appendix E version changes coverage status reports `expectedIds`, `actualIds`,
`missingAppendixEVersionChangesIds`, `extraAppendixEVersionChangesIds`,
`appendixEVersionChangesCoverage.historicalReferenceIds`, and
`appendixEVersionChangesCoverage.migrationSourceIds` for the C260 Appendix E outline so
version-change subsection headings cannot drift silently, while E.1-E.3 remain historical references
and E.4 remains the ArchiMate 4 migration source boundary outside external source gaps, remaining
gaps, readiness blockers, and official conformance blockers.
Appendix F acronym coverage status reports `expectedIds`, `actualIds`,
`missingAppendixFAcronymIds`, `extraAppendixFAcronymIds`,
`appendixFAcronymsCoverage.vocabularyOnlyIds`, and
`appendixFAcronymsCoverage.missingVocabularyOnlyIds` for the C260 Appendix F acronym-token list so
acronym vocabulary cannot drift silently without copying acronym expansions or Appendix F prose, and
without being confused with language sections, source gaps, remaining gaps, readiness blockers, or
official conformance blockers.
Document artifact coverage status reports `expectedIds`, `actualIds`,
`missingDocumentArtifactIds`, `extraDocumentArtifactIds`, `documentArtifactCoverage.nonImplementationIds`,
and `documentArtifactCoverage.missingNonImplementationIds` for C260 front matter and Index outline
artifacts so the non-implementation reference boundary cannot drift silently or be confused with
language section coverage, source gaps, remaining gaps, or official conformance blockers.
Aggregate C260 coverage status reports `expectedCoverageIds`, `actualCoverageIds`,
`incompleteCoverageIds`, `rawDuplicateIds`, and `qualifiedDuplicateCount` so every tracked C260
coverage group can be audited together without hiding repeated raw heading ids across chapters.
C260 source alignment status reports `outlineSourceItemCount`, `outlineCoveredItemCount`,
`missingOutlineCoverageIds`, `nonOutlineDerivedCoverageIds`, and `aggregateItemCountDelta` so the
253-entry PDF outline source is reconciled with the 284-item aggregate coverage total through the 31
Appendix F derived acronym tokens.
C260 outline assignment status reports `expectedOutlineCoverageCounts`, `actualOutlineCoverageCounts`,
`missingOutlineCoverageCountIds`, and `outlineCoverageCountDeltas` so every PDF-outline-derived
coverage group is audited against its assigned source count rather than only the aggregate total.
C260 coverage source evidence status reports `coverageSourceRunlogPaths`,
`missingSourceRunlogCoverageIds`, and `sourceRunlogPathDeltas` so every tracked C260 coverage group
stays tied to a recorded source-extraction runlog.
Implementation-status completion API scan evidence is recorded in
`project_memory/runlogs/20260710-0450-status-completion-api-scan.json`; it currently reports 49
top-level status keys, 40 `complete` summaries, no incomplete summaries, and the section coverage
status-key guard arrays including `exampleViewpointCatalog`. The same completion state is exposed directly through
`getArchimate4ImplementationStatus().implementationCompletion`.
The scan is reproducibly generated by `scripts/write_archimate4_status_completion_scan.mjs`.
External blocker status reports `expectedIds`, `actualIds`, `missingIds`, and `extraIds` for exact
blocker-id auditing across readiness, requirements, and source coverage. The source coverage status
reports `expectedSourceIds`, `actualSourceIds`, `missingSourceIds`, and `extraSourceIds` for exact
source-ledger auditing. The iconography status reports `profilePictogramCoverage:
dedicated-local-paths`, `genericObjectAliasCount: 0`, and only the legacy misspelled compatibility
aliases `PICTO_DELIVRABLE` / `PICTO_STAKHOLDER`.

Current unresolved items are external-source dependent rather than implementation omissions:

- Official Appendix B relationship matrix data or redistribution approval is still required for final
  embedded relationship-matrix conformance.
- Official MEFF 4.0 XSD is still required before claiming official XML exchange conformance.
- W262 is still not present locally; it is tracked as a companion source.
- Exact Appendix A vector artwork redistribution rights remain unconfirmed; renderer and palette
  assets use locally authored paths instead.

## Global Constraints

- 既定動作は現行の ArchiMate 3.x と同じにする。
- `new Modeler({ archimateVersion: '4.0' })` と `new Viewer({ archimateVersion: '4.0' })` で 4.0 を選択できるようにする。
- 4.0 の仕様データは The Open Group の ArchiMate 4 Specification C260 と、必要に応じて W262 の変更理由を根拠にする。
- C260 由来の関係マトリクスや変換表をリポジトリへ再配布してよいか確認してから、派生データをコミットする。
- 4.0 の Model Exchange File Format XSD が入手できない場合、4.0 XML export は `experimental` として扱い、README に公式 conformance ではないことを明記する。
- すべての実装タスクは `npm run test:language`、`npm run lint`、最小 XML round-trip を通してから完了とする。

---

## Confirmed Inputs

- Official release signal: The Open Group announcement page for ArchiMate 4 and the licensed-downloads page identify Version 4 as the latest release from April 2026.
- Official exchange-format scope: The Open Group Model Exchange File Format page says the exchange format is the standard file format for exchanging ArchiMate models between tools and is mandatory for certified tools.
- Publicly visible ArchiMate 4 changes to plan around:
  - Common Domain added, with a shift from layer-centric wording toward domains.
  - Layer-specific behavior concepts are consolidated into generic `Service`, `Process`, `Function`, and `Event`.
  - `BusinessInteraction`, `ApplicationInteraction`, `TechnologyInteraction`, `Constraint`, `Contract`, `Gap`, and `Representation` are removed.
  - `ImplementationEvent` is replaced by generic `Event`.
  - `Path` moves into the Common Domain.
  - Relationship multiplicity is added on relationship ends, except where endpoints are junctions.
  - Migration can preserve old 3.x meaning through specialization profiles.

## Repository Observations

- `lib/moddle/resources/archimate.json` hardcodes `name: "archimate3_model"` and namespace `http://www.opengroup.org/xsd/archimate/3.0/`.
- `lib/Modeler.js` creates a new model with a 3.0 namespace and a 3.1 schema location.
- `lib/metamodel/Concept.js` contains 3.x element constants, including concepts removed in ArchiMate 4.
- `lib/util/ModelUtil.js` merges element maps and relationship maps into one global `FULL_ELEMENT_MAP`, so the current runtime has no language-version boundary.
- `lib/metamodel/*RelationshipMap.js` encode the ArchiMate relationship matrix as many JavaScript `Map` objects.
- `lib/features/palette/PaletteProvider.js` exposes Strategy, Business, Application, and Technology only; it does not expose Motivation, Physical, Implementation & Migration, or Other/Common groups even though some are defined.
- No `test/` directory exists, and `package.json` has no `test` script even though `all` runs `run-s lint test`.

## File Structure

- Create `docs/archimate4/sources.md`: records C260/W262/MEFF source status, license decision, namespace/schema-location decision, and implementation assumptions.
- Create `test/language-profile.test.mjs`: Node built-in tests for profile loading, retired concept filtering, default compatibility, and migration warning behavior.
- Create `test/migration.test.mjs`: migration tests for 3.x retired and merged concepts.
- Create `test/xml-roundtrip.test.mjs`: import/export tests for minimal ArchiMate 3.x and 4.0 models.
- Create `test/fixtures/archimate3-minimal.xml`: current minimal 3.x model fixture.
- Create `test/fixtures/archimate4-minimal.xml`: minimal 4.0 model fixture after namespace/XSD decision is recorded.
- Create `lib/metamodel/languages/archimate3-profile.json`: current 3.x concept metadata extracted from existing code.
- Create `lib/metamodel/languages/archimate4-profile.json`: 4.0 concept metadata verified against C260.
- Create `lib/metamodel/languages/index.js`: profile loader and version normalization.
- Create `lib/metamodel/languages/archimate3-relationships.js`: adapter around current relationship maps.
- Create `lib/metamodel/languages/archimate4-relationships.js`: 4.0 relationship rules verified against C260 Appendix B.
- Create `lib/metamodel/languages/retired-concepts.js`: exact 3.x to 4.0 migration mapping and warnings.
- Create `lib/migration/archimate3-to-4.js`: model-tree migration utility.
- Modify `package.json`: add executable tests without introducing a test framework dependency.
- Modify `lib/moddle/index.js`: choose the descriptor package by `archimateVersion`.
- Modify `lib/moddle/resources/archimate.json`: rename or replace with a 3.x descriptor after splitting descriptors.
- Create `lib/moddle/resources/archimate3.json`: copy of current descriptor with current namespace.
- Create `lib/moddle/resources/archimate4.json`: 4.0 descriptor including multiplicity attributes once MEFF 4 attribute names are confirmed.
- Modify `lib/BaseViewer.js`: carry `archimateVersion` into `_createModdle()` and expose a `languageProfile` service.
- Modify `lib/Modeler.js`: generate new-model XML from a version-aware template helper.
- Create `lib/moddle/templateModel.js`: version-aware XML template builder.
- Modify `lib/util/ModelUtil.js`: move global map reads behind profile-aware accessors.
- Modify `lib/util/RelationshipUtil.js`: read allowed relationships from the active profile and avoid crashes for missing maps.
- Modify `lib/features/palette/PaletteProvider.js`: render palette groups from the active profile.
- Modify `lib/util/ColorUtil.js`: add Common Domain color and profile-driven domain color lookup.
- Modify `lib/draw/PathMap.js`: add or alias pictograms for generic 4.0 concepts.
- Modify `lib/draw/ArchimateRenderer.js`: render multiplicity labels on relationship ends.
- Modify `lib/features/popup-menu/ConnectionMenuProvider.js`: edit source/target multiplicity values for 4.0 relationships.
- Modify `lib/features/modeling/ConnectionUpdater.js`: persist multiplicity and preserve existing `accessType`, `isDirected`, and `modifier` behavior.
- Modify `lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js`: carry multiplicity when a relationship ref is replaced.
- Modify `README.md`: document version selection, 3.x compatibility, 4.0 status, and conformance limitations.
- Modify `CHANGELOG.md`: add the ArchiMate 4 support entry after implementation.

---

### Task 1: Source Ledger and Test Harness

**Files:**
- Create: `docs/archimate4/sources.md`
- Create: `test/language-profile.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: current repository with no tests.
- Produces: `npm run test:language`, failing tests that define the expected profile boundary.

- [ ] **Step 1: Write the source ledger**

Create `docs/archimate4/sources.md`:

```markdown
# ArchiMate 4 Source Ledger

## Required Sources

- ArchiMate 4 Specification, The Open Group, Document C260, April 2026.
- The Motivation for Changes in the ArchiMate 4 Specification, The Open Group White Paper W262, April 2026.
- The Open Group ArchiMate Model Exchange File Format page and any ArchiMate 4 XSD available under `https://www.opengroup.org/xsd/archimate/`.

## Source Access Decision

- C260 and W262 must be available to the implementer before Task 4 starts.
- The implementer must record whether the relationship matrix and migration mappings can be redistributed in this MIT package.
- If redistribution is not allowed, `archimate4-relationships.js` must load a user-provided profile package instead of embedding C260-derived tables.

## Current Public Release Notes Captured

- ArchiMate 4 is the latest version released in April 2026.
- The language shifts from layer-centric wording toward domains and adds the Common Domain.
- Layer-specific behavior concepts are consolidated into generic Service, Process, Function, and Event.
- Retired concepts include BusinessInteraction, ApplicationInteraction, TechnologyInteraction, Constraint, Contract, Gap, and Representation.
- ImplementationEvent is replaced by generic Event.
- Path is in the Common Domain.
- Relationship multiplicity is added on relationship ends, except where connected to junctions.

## XML Exchange Decision

- `archimateVersion: "3.2"` continues to write the current 3.x namespace until a separate 3.2 descriptor is introduced.
- `archimateVersion: "4.0"` writes the ArchiMate 4 namespace and schema only after the corresponding MEFF 4 XSD is confirmed.
- If the MEFF 4 XSD is not available, export is marked experimental in README and tests assert only internal round-trip behavior.
```

- [ ] **Step 2: Add failing language profile tests**

Create `test/language-profile.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readJson(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8');
  return JSON.parse(text);
}

test('archimate 3 profile keeps retired 3.x concepts for compatibility', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate3-profile.json');
  const types = new Set(profile.elements.map((element) => element.type));

  assert.equal(profile.version, '3.2');
  assert.equal(types.has('BusinessInteraction'), true);
  assert.equal(types.has('ApplicationInteraction'), true);
  assert.equal(types.has('TechnologyInteraction'), true);
  assert.equal(types.has('Constraint'), true);
  assert.equal(types.has('Contract'), true);
  assert.equal(types.has('Gap'), true);
  assert.equal(types.has('Representation'), true);
});

test('archimate 4 profile removes retired 3.x concepts', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const types = new Set(profile.elements.map((element) => element.type));

  assert.equal(profile.version, '4.0');
  assert.equal(types.has('BusinessInteraction'), false);
  assert.equal(types.has('ApplicationInteraction'), false);
  assert.equal(types.has('TechnologyInteraction'), false);
  assert.equal(types.has('Constraint'), false);
  assert.equal(types.has('Contract'), false);
  assert.equal(types.has('Gap'), false);
  assert.equal(types.has('Representation'), false);
  assert.equal(types.has('ImplementationEvent'), false);
  assert.equal(types.has('Service'), true);
  assert.equal(types.has('Process'), true);
  assert.equal(types.has('Function'), true);
  assert.equal(types.has('Event'), true);
  assert.equal(types.has('Path'), true);
});

test('archimate 4 profile exposes Common Domain', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const domains = new Set(profile.domains.map((domain) => domain.name));

  assert.equal(domains.has('Common'), true);
  assert.equal(domains.has('Business'), true);
  assert.equal(domains.has('Application'), true);
  assert.equal(domains.has('Technology'), true);
});
```

- [ ] **Step 3: Add executable test scripts**

Modify `package.json` scripts:

```json
{
  "scripts": {
    "all": "run-s lint test",
    "lint": "eslint .",
    "test": "npm run test:language",
    "test:language": "node --test test/*.test.mjs"
  }
}
```

- [ ] **Step 4: Run test to verify it fails for the right reason**

Run:

```powershell
npm run test:language
```

Expected: FAIL with `ENOENT` for `lib/metamodel/languages/archimate3-profile.json` or `archimate4-profile.json`.

- [ ] **Step 5: Commit**

```powershell
git add docs/archimate4/sources.md test/language-profile.test.mjs package.json
git commit -m "test: add archimate language profile harness"
```

---

### Task 2: Versioned Language Profiles

**Files:**
- Create: `lib/metamodel/languages/archimate3-profile.json`
- Create: `lib/metamodel/languages/archimate4-profile.json`
- Create: `lib/metamodel/languages/index.js`
- Modify: `lib/metamodel/Concept.js`
- Modify: `lib/util/ColorUtil.js`

**Interfaces:**
- Consumes: tests from Task 1.
- Produces: `getLanguageProfile(version)`, `normalizeArchimateVersion(version)`, and profile JSON consumed by later tasks.

- [ ] **Step 1: Create the 3.x profile from existing constants**

Create `lib/metamodel/languages/archimate3-profile.json` with version `3.2`, namespace `http://www.opengroup.org/xsd/archimate/3.0/`, and one element entry for each current element in `Concept.js`. Preserve the current `layer`, `aspect`, `typeName`, `className`, and `pictoRef` values from `ModelUtil.js`.

The first entries must be:

```json
{
  "version": "3.2",
  "namespace": "http://www.opengroup.org/xsd/archimate/3.0/",
  "schemaLocation": "http://www.opengroup.org/xsd/archimate/3.1/archimate3_Diagram.xsd",
  "domains": [
    { "name": "Motivation", "color": "#CCCCFF" },
    { "name": "Strategy", "color": "#F5DEAA" },
    { "name": "Business", "color": "#FFFFB5" },
    { "name": "Application", "color": "#B5FFFF" },
    { "name": "Technology", "color": "#C9E7B7" },
    { "name": "Physical", "color": "#C9E7B7" },
    { "name": "Implementation & Migration", "color": "#FFE0E0" },
    { "name": "Other", "color": "#FFFFFF" }
  ],
  "retired": [],
  "elements": [
    {
      "type": "BusinessActor",
      "domain": "Business",
      "aspect": "Active structure",
      "typeName": "Business Actor",
      "className": "archimate-business-actor",
      "pictoRef": "PICTO_ACTOR"
    }
  ],
  "relationships": [
    "Composition",
    "Aggregation",
    "Assignment",
    "Realization",
    "Association",
    "Influence",
    "Access",
    "Serving",
    "Triggering",
    "Flow",
    "Specialization"
  ]
}
```

- [ ] **Step 2: Create the ArchiMate 4 profile**

Create `lib/metamodel/languages/archimate4-profile.json` with version `4.0`. Populate the full element list from C260. The profile must include the public-release constraints already tested in Task 1 and must mark migrated 3.x concepts in `retired`.

Use this exact structure:

```json
{
  "version": "4.0",
  "namespace": "http://www.opengroup.org/xsd/archimate/4.0/",
  "schemaLocation": "",
  "domains": [
    { "name": "Common", "color": "#D9D3C8" },
    { "name": "Motivation", "color": "#CCCCFF" },
    { "name": "Strategy", "color": "#F5DEAA" },
    { "name": "Business", "color": "#FFFFB5" },
    { "name": "Application", "color": "#B5FFFF" },
    { "name": "Technology", "color": "#C9E7B7" },
    { "name": "Implementation & Migration", "color": "#FFE0E0" }
  ],
  "retired": [
    "BusinessInteraction",
    "ApplicationInteraction",
    "TechnologyInteraction",
    "Constraint",
    "Contract",
    "Gap",
    "Representation",
    "ImplementationEvent"
  ],
  "elements": [
    {
      "type": "Service",
      "domain": "Common",
      "aspect": "Behavior",
      "typeName": "Service",
      "className": "archimate-common-service",
      "pictoRef": "PICTO_SERVICE"
    },
    {
      "type": "Process",
      "domain": "Common",
      "aspect": "Behavior",
      "typeName": "Process",
      "className": "archimate-common-process",
      "pictoRef": "PICTO_PROCESS"
    },
    {
      "type": "Function",
      "domain": "Common",
      "aspect": "Behavior",
      "typeName": "Function",
      "className": "archimate-common-function",
      "pictoRef": "PICTO_FUNCTION"
    },
    {
      "type": "Event",
      "domain": "Common",
      "aspect": "Behavior",
      "typeName": "Event",
      "className": "archimate-common-event",
      "pictoRef": "PICTO_EVENT"
    },
    {
      "type": "Path",
      "domain": "Common",
      "aspect": "Active structure",
      "typeName": "Path",
      "className": "archimate-common-path",
      "pictoRef": "PICTO_PATH"
    }
  ],
  "relationships": [
    "Composition",
    "Aggregation",
    "Assignment",
    "Realization",
    "Association",
    "Influence",
    "Access",
    "Serving",
    "Triggering",
    "Flow",
    "Specialization"
  ]
}
```

Before signing off this step, expand `elements` to the complete C260 element set and record the source decision in `docs/archimate4/sources.md`.

- [ ] **Step 3: Add the profile loader**

Create `lib/metamodel/languages/index.js`:

```js
import archimate3Profile from './archimate3-profile.json';
import archimate4Profile from './archimate4-profile.json';

export const DEFAULT_ARCHIMATE_VERSION = '3.2';

const PROFILES = new Map([
  [ '3', archimate3Profile ],
  [ '3.0', archimate3Profile ],
  [ '3.1', archimate3Profile ],
  [ '3.2', archimate3Profile ],
  [ '4', archimate4Profile ],
  [ '4.0', archimate4Profile ]
]);

export function normalizeArchimateVersion(version) {
  if (version === undefined || version === null || version === '') {
    return DEFAULT_ARCHIMATE_VERSION;
  }

  const normalized = String(version);

  if (!PROFILES.has(normalized)) {
    throw new Error(`Unsupported ArchiMate version: ${normalized}`);
  }

  return PROFILES.get(normalized).version;
}

export function getLanguageProfile(version) {
  const normalized = normalizeArchimateVersion(version);
  return PROFILES.get(normalized);
}
```

- [ ] **Step 4: Add Common Domain constants**

Modify `lib/metamodel/Concept.js` to add version-neutral constants used by ArchiMate 4. Use non-breaking names so existing imports remain valid:

```js
export const COMMON_ROLE = 'Role',
    COMMON_COLLABORATION = 'Collaboration',
    COMMON_INTERFACE = 'Interface',
    COMMON_SERVICE = 'Service',
    COMMON_PROCESS = 'Process',
    COMMON_FUNCTION = 'Function',
    COMMON_EVENT = 'Event',
    COMMON_PATH = 'Path';

export const DOMAIN_COMMON = 'Common';
```

- [ ] **Step 5: Add Common Domain color**

Modify `lib/util/ColorUtil.js`:

```js
export const COLOR_DOMAIN_COMMON = '#D9D3C8';
```

Add it to `COLOR_LAYER_MAP` using `DOMAIN_COMMON` after importing it from `Concept.js`.

- [ ] **Step 6: Run tests**

Run:

```powershell
npm run test:language
npm run lint
```

Expected: PASS for the Task 1 profile tests; lint either passes or reports only pre-existing repository issues. Any new lint error in files touched by this task must be fixed in this task.

- [ ] **Step 7: Commit**

```powershell
git add lib/metamodel/languages lib/metamodel/Concept.js lib/util/ColorUtil.js docs/archimate4/sources.md
git commit -m "feat: add versioned archimate language profiles"
```

---

### Task 3: Profile-Aware Runtime Accessors

**Files:**
- Modify: `lib/util/ModelUtil.js`
- Modify: `lib/util/RelationshipUtil.js`
- Modify: `lib/BaseViewer.js`
- Create: `lib/core/languageProfile.js`
- Modify: `lib/core/index.js`

**Interfaces:**
- Consumes: `getLanguageProfile(version)` from Task 2.
- Produces: `languageProfile` diagram-js service and profile-aware `getTypeName`, `getLayerType`, `getAspectType`, `getPictoRef`, and relationship lookups.

- [ ] **Step 1: Add a language profile service**

Create `lib/core/languageProfile.js`:

```js
import { getLanguageProfile } from '../metamodel/languages';

export default function LanguageProfile(config) {
  const version = config && config.archimateVersion;
  this.profile = getLanguageProfile(version);
}

LanguageProfile.$inject = [ 'config' ];

LanguageProfile.prototype.get = function() {
  return this.profile;
};
```

- [ ] **Step 2: Register the service**

Modify `lib/core/index.js` to add:

```js
import LanguageProfile from './languageProfile';
```

and register:

```js
languageProfile: [ 'type', LanguageProfile ],
```

- [ ] **Step 3: Carry `archimateVersion` into diagram config**

Modify `BaseViewer.prototype._init` in `lib/BaseViewer.js` so `diagramOptions` includes:

```js
config: assign({}, options.config, {
  archimateVersion: options.archimateVersion
})
```

Keep every existing option in `diagramOptions` unchanged.

- [ ] **Step 4: Add profile-aware helpers without breaking current callers**

Modify `lib/util/ModelUtil.js` to add helper functions:

```js
export function getProfileElementMap(profile) {
  return new Map((profile.elements || []).map((element) => [ element.type, element ]));
}

export function getProfileElement(elementType, profile) {
  if (!profile) {
    return FULL_ELEMENT_MAP.get(elementType);
  }

  return getProfileElementMap(profile).get(elementType);
}
```

Then update `getLayerType`, `getAspectType`, `getTypeName`, and `getPictoRef` so each accepts optional `profile`:

```js
export function getTypeName(elementType, profile) {
  const element = getProfileElement(elementType, profile);
  return element && element.typeName;
}
```

Apply the same pattern to the other accessors.

- [ ] **Step 5: Guard relationship lookup failures**

Modify `lib/util/RelationshipUtil.js` so `isRelationshipAllowed()` returns `false` instead of throwing when `getRelationshipMap(sourceType)` returns `undefined`:

```js
var sourceRelationshipMap = getRelationshipMap(sourceType);

if (!sourceRelationshipMap) {
  return false;
}
```

- [ ] **Step 6: Run focused tests**

Run:

```powershell
npm run test:language
npm run lint
```

Expected: PASS for language tests. Lint must not report new issues from `lib/core/languageProfile.js`, `lib/core/index.js`, `lib/BaseViewer.js`, `lib/util/ModelUtil.js`, or `lib/util/RelationshipUtil.js`.

- [ ] **Step 7: Commit**

```powershell
git add lib/core/languageProfile.js lib/core/index.js lib/BaseViewer.js lib/util/ModelUtil.js lib/util/RelationshipUtil.js
git commit -m "feat: route metamodel access through language profiles"
```

---

### Task 4: Versioned Moddle Descriptors and New Model Templates

**Files:**
- Create: `lib/moddle/resources/archimate3.json`
- Create: `lib/moddle/resources/archimate4.json`
- Modify: `lib/moddle/resources/archimate.json`
- Modify: `lib/moddle/index.js`
- Create: `lib/moddle/templateModel.js`
- Modify: `lib/Modeler.js`
- Create: `test/xml-roundtrip.test.mjs`
- Create: `test/fixtures/archimate3-minimal.xml`
- Create: `test/fixtures/archimate4-minimal.xml`

**Interfaces:**
- Consumes: profile loader and source ledger.
- Produces: version-selected moddle package and version-selected new-model XML.

- [ ] **Step 1: Split the current descriptor**

Copy the current `lib/moddle/resources/archimate.json` contents into `lib/moddle/resources/archimate3.json` unchanged except for formatting. Keep `lib/moddle/resources/archimate.json` as a compatibility re-export only if existing imports need it.

- [ ] **Step 2: Create the 4.0 descriptor**

Create `lib/moddle/resources/archimate4.json` by starting from `archimate3.json`, changing:

```json
{
  "name": "archimate4_model",
  "uri": "http://www.opengroup.org/xsd/archimate/4.0/",
  "prefix": "archimate"
}
```

In the `Relationship` type, add multiplicity properties after the existing `target` property. Use the final attribute names from the MEFF 4 XSD. If the XSD is unavailable, use these internal names and mark export experimental:

```json
{
  "name": "sourceMultiplicity",
  "type": "String",
  "isAttr": true
},
{
  "name": "targetMultiplicity",
  "type": "String",
  "isAttr": true
}
```

- [ ] **Step 3: Select descriptor by version**

Modify `lib/moddle/index.js`:

```js
import Archimate3Descriptors from './resources/archimate3.json';
import Archimate4Descriptors from './resources/archimate4.json';
import { normalizeArchimateVersion } from '../metamodel/languages';

export default function(additionalPackages, options) {
  const version = normalizeArchimateVersion(options && options.archimateVersion);
  const descriptor = version === '4.0' ? Archimate4Descriptors : Archimate3Descriptors;

  var packages = {
    archimate: descriptor
  };

  var pks = assign({}, packages, additionalPackages);

  return new Moddle(pks, options);
}
```

- [ ] **Step 4: Pass version into moddle creation**

Modify `BaseViewer.prototype._createModdle()` in `lib/BaseViewer.js`:

```js
var moddle = new Moddle(moddleOptions, {
  archimateVersion: options.archimateVersion
});
```

- [ ] **Step 5: Extract template generation**

Create `lib/moddle/templateModel.js`:

```js
import { getLanguageProfile } from '../metamodel/languages';

export function createTemplateModelXml(version) {
  const profile = getLanguageProfile(version);
  const schemaLocation = profile.schemaLocation
    ? ` xsi:schemaLocation="${profile.namespace} ${profile.schemaLocation}"`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<archimate:Model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="${profile.namespace}"${schemaLocation}>
  <name>New model</name>
  <documentation></documentation>
  <archimate:Elements>
  </archimate:Elements>
  <archimate:Views>
    <archimate:Diagrams>
      <archimate:View>
        <name>Default View</name>
        <documentation></documentation>
      </archimate:View>
    </archimate:Diagrams>
  </archimate:Views>
  <archimate:PropertyDefinitions>
  </archimate:PropertyDefinitions>
</archimate:Model>`;
}
```

- [ ] **Step 6: Use template generation in Modeler**

Modify `lib/Modeler.js`:

```js
import { createTemplateModelXml } from './moddle/templateModel';
```

Then replace `templateModel` usage:

```js
Modeler.prototype.createNewModel = function() {
  return this.importXML(createTemplateModelXml(this._archimateVersion), 0, true);
}
```

Set `this._archimateVersion` in the constructor:

```js
export default function Modeler(options) {
  this._archimateVersion = options && options.archimateVersion;
  BaseModeler.call(this, options);
}
```

- [ ] **Step 7: Add XML round-trip tests**

Create `test/xml-roundtrip.test.mjs` with a structural test for template XML:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('archimate 3 fixture keeps current namespace', async () => {
  const xml = await readFile(new URL('./fixtures/archimate3-minimal.xml', import.meta.url), 'utf8');
  assert.match(xml, /http:\/\/www\.opengroup\.org\/xsd\/archimate\/3\.0\//);
});

test('archimate 4 fixture uses archimate 4 namespace', async () => {
  const xml = await readFile(new URL('./fixtures/archimate4-minimal.xml', import.meta.url), 'utf8');
  assert.match(xml, /http:\/\/www\.opengroup\.org\/xsd\/archimate\/4\.0\//);
});
```

- [ ] **Step 8: Run tests**

Run:

```powershell
npm run test:language
npm run lint
```

Expected: PASS for language and XML fixture tests. If JSON import requires bundler support, move descriptor selection tests to file-content assertions in `test/xml-roundtrip.test.mjs` and record that decision in `docs/archimate4/sources.md`.

- [ ] **Step 9: Commit**

```powershell
git add lib/moddle test docs/archimate4/sources.md lib/BaseViewer.js lib/Modeler.js
git commit -m "feat: add versioned archimate XML descriptors"
```

---

### Task 5: ArchiMate 4 Relationship Rules

**Files:**
- Create: `lib/metamodel/languages/archimate4-relationships.js`
- Create: `lib/metamodel/languages/archimate3-relationships.js`
- Modify: `lib/metamodel/languages/index.js`
- Modify: `lib/util/RelationshipUtil.js`
- Create: `test/relationship-rules.test.mjs`

**Interfaces:**
- Consumes: profile loader and C260 Appendix B.
- Produces: `getRelationshipsAllowed(source, target, excluded, profile)` and `isRelationshipAllowed(source, target, relation, profile)`.

- [ ] **Step 1: Wrap current 3.x relationship maps**

Create `lib/metamodel/languages/archimate3-relationships.js` that exports:

```js
import { FULL_ELEMENT_MAP } from '../../util/ModelUtil';

export function getArchimate3RelationshipMap(elementType) {
  const entry = FULL_ELEMENT_MAP.get(elementType);
  return entry && entry.relationshipMap;
}
```

- [ ] **Step 2: Create the 4.0 relationship module**

Create `lib/metamodel/languages/archimate4-relationships.js` with an explicit data structure:

```js
const RELATIONSHIPS = new Map();

export function getArchimate4RelationshipMap(elementType) {
  return RELATIONSHIPS.get(elementType);
}

export function setArchimate4RelationshipMapForTests(elementType, relationships) {
  RELATIONSHIPS.set(elementType, relationships);
}
```

Then populate `RELATIONSHIPS` from C260 Appendix B after the license decision in `docs/archimate4/sources.md` says redistribution is allowed. If redistribution is not allowed, replace the `RELATIONSHIPS` initialization with a loader that reads a user-provided package path from `options.archimate4RelationshipProfilePath`.

- [ ] **Step 3: Route by profile version**

Modify `lib/metamodel/languages/index.js`:

```js
import { getArchimate3RelationshipMap } from './archimate3-relationships';
import { getArchimate4RelationshipMap } from './archimate4-relationships';

export function getRelationshipMapForProfile(elementType, profile) {
  if (profile && profile.version === '4.0') {
    return getArchimate4RelationshipMap(elementType);
  }

  return getArchimate3RelationshipMap(elementType);
}
```

- [ ] **Step 4: Update RelationshipUtil**

Modify `getRelationshipsAllowed()` and `isRelationshipAllowed()` signatures:

```js
export function getRelationshipsAllowed(sourceElementType, targetElementType, excludedRelationType, profile) {
```

Use:

```js
var sourceRelationshipMap = getRelationshipMapForProfile(sourceElementType, profile);
```

Retain current behavior when `profile` is omitted.

- [ ] **Step 5: Add relationship tests**

Create `test/relationship-rules.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readJson(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8');
  return JSON.parse(text);
}

test('archimate 4 relationship profile has no retired source or target concepts', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const retired = new Set(profile.retired);
  const elements = new Set(profile.elements.map((element) => element.type));

  for (const type of retired) {
    assert.equal(elements.has(type), false, `${type} must not be an ArchiMate 4 element`);
  }
});
```

Extend this test with two C260-confirmed allowed relationships and two C260-confirmed disallowed relationships after Task 5 Step 2 is populated.

- [ ] **Step 6: Run tests**

Run:

```powershell
npm run test:language
npm run lint
```

Expected: PASS. If the 4.0 relationship map cannot be redistributed, PASS means the external-loader path is tested with a small local synthetic profile, not with the C260 matrix.

- [ ] **Step 7: Commit**

```powershell
git add lib/metamodel/languages lib/util/RelationshipUtil.js test/relationship-rules.test.mjs docs/archimate4/sources.md
git commit -m "feat: add profile-aware relationship rules"
```

---

### Task 6: 3.x to 4.0 Migration Utility

**Files:**
- Create: `lib/metamodel/languages/retired-concepts.js`
- Create: `lib/migration/archimate3-to-4.js`
- Create: `test/migration.test.mjs`
- Modify: `index.js`

**Interfaces:**
- Consumes: ArchiMate 4 profile and C260/W262 migration guidance.
- Produces: `migrateArchimate3ModelTo4(model, options)` and warning records.

- [ ] **Step 1: Define exact migration actions**

Create `lib/metamodel/languages/retired-concepts.js`:

```js
export const ARCHIMATE_3_TO_4_MIGRATIONS = new Map([
  [ 'BusinessInteraction', { replacement: 'Process', preserveSpecialization: true, warning: 'BusinessInteraction was retired; migrated to Process specialization.' } ],
  [ 'ApplicationInteraction', { replacement: 'Process', preserveSpecialization: true, warning: 'ApplicationInteraction was retired; migrated to Process specialization.' } ],
  [ 'TechnologyInteraction', { replacement: 'Process', preserveSpecialization: true, warning: 'TechnologyInteraction was retired; migrated to Process specialization.' } ],
  [ 'Constraint', { replacement: 'Requirement', preserveSpecialization: true, warning: 'Constraint was retired; migrated to Requirement specialization.' } ],
  [ 'Contract', { replacement: 'BusinessObject', preserveSpecialization: true, warning: 'Contract was retired; migrated to BusinessObject specialization.' } ],
  [ 'Gap', { replacement: 'Assessment', preserveSpecialization: true, warning: 'Gap was retired; migrated to Assessment specialization; verify whether Deliverable is more precise for this model.' } ],
  [ 'Representation', { replacement: 'BusinessObject', preserveSpecialization: true, warning: 'Representation was retired; migrated to BusinessObject specialization; verify whether DataObject or Material is more precise for this model.' } ],
  [ 'ImplementationEvent', { replacement: 'Event', preserveSpecialization: false, warning: 'ImplementationEvent was retired; migrated to Event.' } ],
  [ 'BusinessService', { replacement: 'Service', preserveSpecialization: true, warning: 'BusinessService was merged into Service with original domain preserved.' } ],
  [ 'ApplicationService', { replacement: 'Service', preserveSpecialization: true, warning: 'ApplicationService was merged into Service with original domain preserved.' } ],
  [ 'TechnologyService', { replacement: 'Service', preserveSpecialization: true, warning: 'TechnologyService was merged into Service with original domain preserved.' } ],
  [ 'BusinessProcess', { replacement: 'Process', preserveSpecialization: true, warning: 'BusinessProcess was merged into Process with original domain preserved.' } ],
  [ 'ApplicationProcess', { replacement: 'Process', preserveSpecialization: true, warning: 'ApplicationProcess was merged into Process with original domain preserved.' } ],
  [ 'TechnologyProcess', { replacement: 'Process', preserveSpecialization: true, warning: 'TechnologyProcess was merged into Process with original domain preserved.' } ],
  [ 'BusinessFunction', { replacement: 'Function', preserveSpecialization: true, warning: 'BusinessFunction was merged into Function with original domain preserved.' } ],
  [ 'ApplicationFunction', { replacement: 'Function', preserveSpecialization: true, warning: 'ApplicationFunction was merged into Function with original domain preserved.' } ],
  [ 'TechnologyFunction', { replacement: 'Function', preserveSpecialization: true, warning: 'TechnologyFunction was merged into Function with original domain preserved.' } ],
  [ 'BusinessEvent', { replacement: 'Event', preserveSpecialization: true, warning: 'BusinessEvent was merged into Event with original domain preserved.' } ],
  [ 'ApplicationEvent', { replacement: 'Event', preserveSpecialization: true, warning: 'ApplicationEvent was merged into Event with original domain preserved.' } ],
  [ 'TechnologyEvent', { replacement: 'Event', preserveSpecialization: true, warning: 'TechnologyEvent was merged into Event with original domain preserved.' } ],
  [ 'TechnologyPath', { replacement: 'Path', preserveSpecialization: false, warning: 'TechnologyPath moved to the Common Domain as Path.' } ]
]);
```

Before committing, verify every mapping against C260 Appendix E.4 and W262. If C260 uses a different replacement for a row, update this file and record the exact section in `docs/archimate4/sources.md`.

- [ ] **Step 2: Implement migration utility**

Create `lib/migration/archimate3-to-4.js`:

```js
import { ARCHIMATE_3_TO_4_MIGRATIONS } from '../metamodel/languages/retired-concepts';

export function migrateArchimate3ModelTo4(model, options = {}) {
  const warnings = [];
  const preserveSpecializations = options.preserveSpecializations !== false;

  const elementsNode = model && model.elementsNode;
  const elements = elementsNode && elementsNode.baseElements || [];

  for (const element of elements) {
    const migration = ARCHIMATE_3_TO_4_MIGRATIONS.get(element.type);

    if (!migration) {
      continue;
    }

    const originalType = element.type;
    element.type = migration.replacement;

    if (migration.preserveSpecialization && preserveSpecializations) {
      element.originalArchiMate3Type = originalType;
      element.specialization = originalType;
    }

    warnings.push({
      elementId: element.id,
      originalType,
      replacementType: migration.replacement,
      message: migration.warning
    });
  }

  return { model, warnings };
}
```

- [ ] **Step 3: Export migration utility**

Modify `index.js`:

```js
export { migrateArchimate3ModelTo4 } from './lib/migration/archimate3-to-4';
```

- [ ] **Step 4: Add migration tests**

Create `test/migration.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';

import { ARCHIMATE_3_TO_4_MIGRATIONS } from '../lib/metamodel/languages/retired-concepts.js';

test('migration table covers retired public ArchiMate 4 concepts', () => {
  for (const type of [
    'BusinessInteraction',
    'ApplicationInteraction',
    'TechnologyInteraction',
    'Constraint',
    'Contract',
    'Gap',
    'Representation',
    'ImplementationEvent'
  ]) {
    assert.equal(ARCHIMATE_3_TO_4_MIGRATIONS.has(type), true, `${type} needs a migration action`);
  }
});
```

If Node cannot import project ES modules without package-level ESM changes, convert this test to read `retired-concepts.js` as text and assert the mapping keys. Do not set `"type": "module"` in `package.json` unless the bundling impact is tested separately.

- [ ] **Step 5: Run tests**

Run:

```powershell
npm run test:language
npm run lint
```

Expected: PASS. Migration tests must verify the mapping table keys at minimum.

- [ ] **Step 6: Commit**

```powershell
git add lib/metamodel/languages/retired-concepts.js lib/migration/archimate3-to-4.js test/migration.test.mjs index.js docs/archimate4/sources.md
git commit -m "feat: add archimate 3 to 4 migration utility"
```

---

### Task 7: Palette, Icons, and Rendering

**Files:**
- Modify: `lib/features/palette/PaletteProvider.js`
- Modify: `assets/palette-icons.css`
- Modify: `lib/draw/PathMap.js`
- Modify: `lib/draw/ArchimateRenderer.js`
- Modify: `lib/util/ColorUtil.js`

**Interfaces:**
- Consumes: active `languageProfile`.
- Produces: palette groups from the selected profile and visible multiplicity labels for 4.0 relationships.

- [ ] **Step 1: Inject language profile into PaletteProvider**

Modify constructor injection:

```js
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool, translate,
    popupMenu, languageProfile) {
```

Add `languageProfile` to `$inject`:

```js
'languageProfile'
```

Store:

```js
this._languageProfile = languageProfile;
```

- [ ] **Step 2: Generate palette entries from profile**

Replace the fixed `STRATEGY_ELEMENT_MAP`, `BUSINESS_ELEMENT_MAP`, `APPLICATION_ELEMENT_MAP`, and `TECHNOLOGY_ELEMENT_MAP` loops with:

```js
const profile = this._languageProfile.get();

profile.elements.forEach((value) => {
  if (value.palette === false) {
    return;
  }

  const propName = 'create.' + value.className;
  var action = {};
  action[propName] = createPopupAction(value.type, {
    layer: value.domain,
    className: value.className,
    typeName: value.typeName
  });
  assign(actions, action);
});
```

- [ ] **Step 3: Add CSS aliases for Common Domain entries**

Modify `assets/palette-icons.css` by adding aliases that reuse existing SVGs:

```css
.archimate-common-service {
background-image: url("./icons/business_service.svg");
background-repeat: no-repeat;
background-size: 18px 18px;
background-position: center;
margin: 4px 0px 0px 4px;
width: 22px !important;
height: 22px !important;
}

.archimate-common-service:hover {
background-color: lightgrey;
}
```

Repeat the same block for `.archimate-common-process`, `.archimate-common-function`, `.archimate-common-event`, and `.archimate-common-path`, using the current process/function/event/path icons.

- [ ] **Step 4: Render relationship multiplicity**

Modify `lib/draw/ArchimateRenderer.js` inside `renderArchimateConnection()` after `drawLine()` is created:

```js
var line = drawLine(parentGfx, connection.waypoints, attrs);

if (connection.sourceMultiplicity) {
  renderLabel(parentGfx, connection.sourceMultiplicity, {
    box: {
      x: connection.waypoints[0].x + 6,
      y: connection.waypoints[0].y + 6,
      width: 40,
      height: 16
    },
    style: { fill: DEFAULT_TEXT_COLOR }
  });
}

if (connection.targetMultiplicity) {
  var last = connection.waypoints[connection.waypoints.length - 1];
  renderLabel(parentGfx, connection.targetMultiplicity, {
    box: {
      x: last.x - 46,
      y: last.y + 6,
      width: 40,
      height: 16
    },
    style: { fill: DEFAULT_TEXT_COLOR }
  });
}

return line;
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm run test:language
npm run lint
```

Expected: PASS. Lint must not report unused imports left from removing fixed palette map loops.

- [ ] **Step 6: Commit**

```powershell
git add lib/features/palette/PaletteProvider.js assets/palette-icons.css lib/draw/ArchimateRenderer.js lib/draw/PathMap.js lib/util/ColorUtil.js
git commit -m "feat: render archimate 4 palette and multiplicity"
```

---

### Task 8: Relationship Multiplicity Editing and Persistence

**Files:**
- Modify: `lib/features/popup-menu/ConnectionMenuProvider.js`
- Modify: `lib/features/modeling/ConnectionUpdater.js`
- Modify: `lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js`
- Modify: `lib/features/modeling/ElementFactory.js`
- Create: `test/multiplicity.test.mjs`

**Interfaces:**
- Consumes: moddle relationship multiplicity properties from Task 4.
- Produces: relationship end multiplicity values that survive connection edits and XML save.

- [ ] **Step 1: Carry multiplicity from relationshipRef into connection attrs**

Modify `setAttrsRelationshipRef()` in `ElementFactory.js`:

```js
assign(attrs, {
  sourceMultiplicity: relationshipRef && relationshipRef.sourceMultiplicity,
  targetMultiplicity: relationshipRef && relationshipRef.targetMultiplicity
});
```

- [ ] **Step 2: Persist multiplicity in ConnectionUpdater**

Modify `lib/features/modeling/ConnectionUpdater.js` near the existing cleanup of `modifier`, `accessType`, and `isDirected`:

```js
delete relationship.sourceMultiplicity;
delete relationship.targetMultiplicity;
```

Then assign:

```js
if (connection.sourceMultiplicity) {
  relationship.sourceMultiplicity = connection.sourceMultiplicity;
}

if (connection.targetMultiplicity) {
  relationship.targetMultiplicity = connection.targetMultiplicity;
}
```

- [ ] **Step 3: Preserve multiplicity on relationship replacement**

Modify `ReplaceRelationshipRefHandler.js` so new relationship refs copy:

```js
newRelationshipRef.sourceMultiplicity = connection.sourceMultiplicity;
newRelationshipRef.targetMultiplicity = connection.targetMultiplicity;
```

and restore:

```js
connection.sourceMultiplicity = newRelationshipRef.sourceMultiplicity;
connection.targetMultiplicity = newRelationshipRef.targetMultiplicity;
```

- [ ] **Step 4: Add simple multiplicity menu entries**

Add two actions to `ConnectionMenuProvider.js` header entries:

```js
{
  id: 'set-source-multiplicity-1',
  label: 'source 1',
  className: 'archimate-multiplicity-source-1',
  action: function(event, entry) {
    modeling.updateProperties(element, {
      sourceMultiplicity: '1'
    });
  }
},
{
  id: 'set-target-multiplicity-star',
  label: 'target *',
  className: 'archimate-multiplicity-target-star',
  action: function(event, entry) {
    modeling.updateProperties(element, {
      targetMultiplicity: '*'
    });
  }
}
```

Keep this deliberately small. A richer editor can follow after persistence and rendering are proven.

- [ ] **Step 5: Add persistence tests**

Create `test/multiplicity.test.mjs` with text-level assertions if full diagram-js setup is not available:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('relationship descriptor contains multiplicity attributes', async () => {
  const descriptor = await readFile(new URL('../lib/moddle/resources/archimate4.json', import.meta.url), 'utf8');
  assert.match(descriptor, /sourceMultiplicity/);
  assert.match(descriptor, /targetMultiplicity/);
});

test('connection updater persists multiplicity fields', async () => {
  const source = await readFile(new URL('../lib/features/modeling/ConnectionUpdater.js', import.meta.url), 'utf8');
  assert.match(source, /sourceMultiplicity/);
  assert.match(source, /targetMultiplicity/);
});
```

- [ ] **Step 6: Run tests**

Run:

```powershell
npm run test:language
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add lib/features/popup-menu/ConnectionMenuProvider.js lib/features/modeling/ConnectionUpdater.js lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js lib/features/modeling/ElementFactory.js test/multiplicity.test.mjs
git commit -m "feat: persist archimate relationship multiplicity"
```

---

### Task 9: Documentation and Compatibility Release Notes

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/archimate4/sources.md`

**Interfaces:**
- Consumes: completed implementation and test logs.
- Produces: user-facing version-selection documentation and conformance boundaries.

- [ ] **Step 1: Update README usage**

Add:

```markdown
## ArchiMate Version Selection

`archimate-js` defaults to the current ArchiMate 3.x behavior.

```js
import Modeler from 'archimate-js/lib/Modeler';

const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: '4.0'
});
```

Use `archimateVersion: '4.0'` to create and edit ArchiMate 4 models. Existing 3.x models continue to import without requiring migration.

## ArchiMate 4 Notes

- ArchiMate 4 support uses versioned language profiles.
- Retired 3.x concepts are hidden from the 4.0 palette.
- 3.x to 4.0 migration preserves original type information when the replacement would otherwise lose modeling intent.
- Relationship multiplicity is supported on relationship ends.
- Official XML conformance depends on the availability and redistribution rights of the ArchiMate 4 Model Exchange File Format XSD.
```

- [ ] **Step 2: Update changelog**

Add:

```markdown
## Unreleased

- Added versioned ArchiMate language profiles with opt-in ArchiMate 4.0 support.
- Preserved existing ArchiMate 3.x behavior as the default.
- Added ArchiMate 3.x to 4.0 migration warnings for retired and merged concepts.
- Added relationship multiplicity storage and rendering for ArchiMate 4.0.
```

- [ ] **Step 3: Final verification**

Run:

```powershell
npm run test:language
npm run lint
npm run all
```

Expected: PASS for `test:language`. `npm run all` must pass once `test` exists. If `lint` reports legacy errors outside changed files, record the exact failing files and lines in `docs/archimate4/sources.md` and fix changed-file lint errors before commit.

- [ ] **Step 4: Commit**

```powershell
git add README.md CHANGELOG.md docs/archimate4/sources.md
git commit -m "docs: document archimate 4 support"
```

---

## Milestones

1. **M0 Source Gate:** `docs/archimate4/sources.md` confirms C260/W262 access, MEFF/XSD status, and redistribution policy.
2. **M1 Runtime Boundary:** 3.x and 4.0 language profiles load through a common API; current 3.x behavior remains default.
3. **M2 XML Boundary:** moddle descriptors and new-model templates are version-aware.
4. **M3 Semantics:** 4.0 relationship rules and migration mapping are implemented from verified standard data.
5. **M4 Modeling UX:** palette, icons, multiplicity editing, rendering, and persistence work under `archimateVersion: '4.0'`.
6. **M5 Release Readiness:** README/CHANGELOG explain opt-in status, compatibility, migration warnings, and conformance boundaries.

## Risks

- **Specification licensing:** ArchiMate 4 normative matrices may not be redistributable in an MIT package. The source gate decides whether tables are embedded or loaded from a user-provided profile.
- **MEFF timing:** If The Open Group has not published ArchiMate 4 exchange XSDs, internal 4.0 modeling can be implemented before official XML conformance.
- **Current architecture coupling:** Existing maps are global singletons. Task 3 must keep old callers working while adding profile-aware paths.
- **Migration ambiguity:** `Gap` and `Representation` can require modeler judgment. The migration utility must warn and preserve original type information instead of silently losing intent.
- **Test environment:** The repo has no current test harness. The first test layer uses Node file-level tests and can be expanded to browser/diagram-js tests after profile logic is stable.

## Source Links

- The Open Group announcement: https://www.opengroup.org/The-Open-Group-Announces-ArchiMate%C2%AE-4-Specification
- The Open Group licensed downloads: https://www.opengroup.org/archimate-licensed-downloads
- The Open Group Model Exchange File Format: https://www.opengroup.org/open-group-archimate-model-exchange-file-format
- The Open Group XSD directory: https://www.opengroup.org/xsd/archimate/
- Secondary change analysis with C260/W262 references: https://4m4.it/longforms/archimate_4_and_the_cartography_of_complexity/

## Self-Review

- Spec coverage: The plan covers source/legal gate, profile split, moddle/XML split, relationship rules, migration, palette/rendering, multiplicity persistence, tests, and docs.
- Placeholder scan: The plan avoids implementation placeholders; any standard-derived data is explicitly blocked on C260/W262 access and redistribution decision.
- Type consistency: Public version values are consistently `3.2` and `4.0`; new APIs use `archimateVersion`, `getLanguageProfile`, and `migrateArchimate3ModelTo4`.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-08-archimate-4-support.md`. Two execution options:

**1. Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

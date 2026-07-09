# archimate-js

Create an ArchiMate® diagrams modeler builds on [diagram-js](https://github.com/bpmn-io/diagram-js) modeler engine from [bpmn.io](https://bpmn.io/) project.

ArchiMate® is a registered trademark of [The Open Group](https://www.opengroup.org/archimate-forum/archimate-overview).

## Features

* Create/modify ArchiMate® models and views
* Import/export ArchiMate® model in XML format

## ArchiMate Version Selection

`archimate-js` defaults to the existing ArchiMate 3.x behavior.

```js
import Modeler from 'archimate-js/lib/Modeler';

const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: '4.0'
});
```

Use `archimateVersion: '4.0'` to create and edit ArchiMate 4 models. Existing 3.x models continue to import without requiring migration.

If you have a licensed ArchiMate 4 Appendix B relationship profile, pass it when constructing the viewer or modeler:

```js
const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: '4.0',
  archimate4RelationshipProfile: appendixBRelationshipProfile
});
```

The supplied profile may be an object, a JSON string, a row array, a header-row matrix array, or `{ matrixText }` CSV/TSV text loaded by the host application. It is validated against the ArchiMate 4 concept set, including elements, relationship connectors, and relationship types, before replacing the bundled compatibility fallback. Complete profiles must include every source-target cell, using an empty value for cells with no allowed relationship.

Use `getArchimate4RelationshipProfileStatus()` to confirm whether the active relationship profile is still the compatibility fallback or an external profile that passed complete source and target-cell validation. The status includes `targetCellCount`, `expectedTargetCellCount`, `missingSourceCount`, `missingTargetCellCount`, and optional `sourceMetadata` so hosts can audit that blank Appendix B cells were explicitly supplied rather than omitted and tie the loaded data to a host-controlled source id or hash. Use `getArchimate4RelationshipProfileCoverageReport()` when the host needs the specific missing source types or source-target cells.

Profiles passed through the `archimate4RelationshipProfile` constructor option are viewer/modeler scoped. A later ArchiMate 4 viewer or modeler created without that option resets any previous constructor-scoped profile to the compatibility fallback, so the default 4.0 editor does not inherit a previous licensed profile by accident. Hosts that intentionally want a process-wide active profile can call `setArchimate4RelationshipProfile(profile)` directly and can clear it with `resetArchimate4RelationshipProfile()`.

Use `getArchimate4ImplementationStatus()` to inspect the current ArchiMate 4 implementation boundary. It reports the implemented 42-element catalog, active relationship profile status, experimental MEFF 4 exchange status, local icon coverage including generic object alias count, C260 conformance requirement status, C260 section coverage status, Appendix C example viewpoint catalog status, source coverage status, conformance readiness, remaining gap identity, and the external blockers that must be resolved before official conformance can be claimed.

Use `getArchimate4ConformanceReport()` when a host needs a flattened official-conformance report. It preserves the Appendix B profile, MEFF 4.0 XSD, and Appendix A artwork-rights blockers, separates the W262 companion gap, and lists the required action for each blocker without allowing local implementation coverage to be mistaken for an official conformance claim.

The bundled Viewer and Editor demos display the same flattened report in ArchiMate 4 mode. In ArchiMate 3.x mode the panel is marked not applicable, preserving the existing 3.x compatibility boundary.

For Node-based audit tooling that does not load the browser viewer bundle, import `getArchimate4ImplementationStatus()` or `getArchimate4ConformanceReport()` from `archimate-js/lib/metamodel/languages/index.js`. The package root remains the browser and webpack-oriented entry point.

Use `getArchimate4ExampleViewpointCatalog()` to list the C260 Appendix C example viewpoint groups and viewpoint names as an informative reference catalog. It exposes the Appendix C outline headings only; it does not bundle full viewpoint definitions, allowed-element filters, or normative relationship constraints.

Run `node scripts/audit_archimate4_completion.mjs --out project_memory/runlogs/<file>.json` to map the current status API to the plan's M0-M5 milestones and to verify that referenced runlogs resolve. The audit is expected to pass while still reporting the official Appendix B, MEFF 4.0 XSD, Appendix A artwork-rights, and W262 companion-source gaps.

Run `node scripts/audit_archimate4_c260_coverage.mjs --out project_memory/runlogs/<file>.json` to verify the C260 book-derived coverage ledger specifically. It checks the 20 section groups, 22 tracked coverage groups, 284 aggregate coverage items, the 253-entry PDF outline assignment, the 31 Appendix F derived tokens, and the recorded source-extraction runlogs without copying specification prose or Appendix B relationship tables.

The Appendix B source-coverage entry distinguishes the reviewed local C260 source from the absent redistributable Appendix B profile artifact. The loader, validation, status, and coverage report APIs are implemented; the normative matrix data must still be supplied by the host or by an approved redistributable source package.

The W262 source-coverage entry records the latest scripted local Downloads/attachments search, local ArchiMate PDF inventory, and publication-page status so hosts can distinguish a missing companion paper from local C260 specification or license files.

The local ArchiMate 4 Non-Commercial License files are tracked as license-boundary context only. They do not clear the Appendix B redistributable-profile blocker or the Appendix A exact-artwork-rights blocker.

Implementation-defined ArchiMate language customization can be supplied with `archimateLanguageProfile`. New custom concepts must declare the standard concept they specialize so relationship rules can fall back to the base concept. Profile attributes require a supported ArchiMate concept and typed value definition. Host tooling can use `getProfileAttributesForConcept()`, `normalizeProfileAttributeValue()`, and `isProfileAttributeValueValid()` to retrieve applicable profile attributes and validate implementation-supported typed values. Profile attribute values can also be stored as model `Properties` through `setProfileAttributePropertyValue()` and read back through `getProfileAttributePropertyValue()`.

```js
const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: '4.0',
  archimateLanguageProfile: {
    version: '4.0',
    domains: [
      { name: 'Risk', color: '#E8D7FF' }
    ],
    elements: [
      {
        type: 'RiskEvent',
        specializes: 'Event',
        domain: 'Risk',
        aspect: 'Behavior',
        typeName: 'Risk Event',
        className: 'archimate-risk-event',
        pictoRef: 'PICTO_EVENT'
      }
    ],
    attributes: [
      { concept: 'RiskEvent', name: 'severity', type: 'String' }
    ],
    viewpoints: [
      {
        id: 'risk-summary',
        name: 'Risk Summary',
        viewpointPurpose: [ 'Deciding' ],
        viewpointContent: [ 'Overview' ],
        allowedElementTypes: [ 'RiskEvent', 'Assessment' ],
        allowedRelationshipTypes: [ 'Association', 'Influence' ]
      }
    ]
  }
});
```

## ArchiMate 4 Notes

* ArchiMate 4 support uses versioned language profiles.
* Implementation-defined language customization can add domains, attributes, and specialized concepts through `archimateLanguageProfile`.
* Profile attributes require `concept`, `name`, and `type`; the concept must resolve to an active element, connector, or relationship in the customized profile.
* Profile attribute values can be normalized and validated for the implementation-supported types `String`, `Number`, `Integer`, `Real`, `Boolean`, `Currency`, `Date`, `URL`, `Time`, and `Structure`.
* Implementation status includes `profileAttributeTypes.expectedC260TypeNames`, `profileAttributeTypes.actualC260TypeNames`, `profileAttributeTypes.missingC260TypeNames`, and `profileAttributeTypes.unexpectedAdditionalTypeNames` so the C260 basic/example profile attribute types and implementation-defined additions are audited explicitly.
* Profile attribute value helpers store values as reusable model `PropertyDefinition` entries named `archimate-js:profileAttribute:<concept>:<name>` plus per-concept `Properties`, preserving typed values without adding non-standard element fields; model validation checks reusable `PropertyDefinition` entry structure, present `Property.value` string values, and resolves `Property.propertyDefinitionRef` id references before profile attribute value checks.
* Viewpoint metadata can be retained on views through `viewpoint` or `viewpointRef`, and custom viewpoint definitions can be supplied in `archimateLanguageProfile.viewpoints`; viewpoint purpose/content values and allowed element/relationship types are validated against the active profile and applied to referenced View contents through either model-defined `viewpointRef` or profile-defined `viewpoint` names.
* Implementation status includes `viewpointMechanism.expectedFeatureIds`, `viewpointMechanism.actualFeatureIds`, `viewpointMechanism.missingFeatureIds`, and `viewpointMechanism.extraFeatureIds` so the C260 viewpoint mechanism support surface is audited by exact feature identity.
* Implementation status includes `stakeholderConcerns.expectedFeatureIds`, `stakeholderConcerns.actualFeatureIds`, `stakeholderConcerns.missingFeatureIds`, and `stakeholderConcerns.extraFeatureIds` so C260 stakeholder/concern support is audited from the descriptor surface.
* Implementation status includes `viewpointClassification.expectedPurposeNames`, `viewpointClassification.actualPurposeNames`, `viewpointClassification.missingPurposeNames`, `viewpointClassification.expectedContentNames`, `viewpointClassification.actualContentNames`, and `viewpointClassification.missingContentNames` so C260 viewpoint purpose/content classification tokens are audited explicitly.
* View node nesting is preserved during import and editing by adding nested `Node` view elements under their parent diagram shape.
* Model organization trees can be retained through `organizationsNode`, with nested `Organization` entries and optional references back to model concepts; model validation checks those `identifierRef` values against active model concepts.
* Retired 3.x concepts are hidden from the 4.0 palette, while all 42 standard ArchiMate 4 elements remain available.
* 3.x to 4.0 migration preserves original type and original domain information when the replacement would otherwise lose modeling intent.
* 3.x Physical concepts are retained as ArchiMate 4 Technology Domain concepts while preserving `Physical` as original-domain metadata.
* Migration also stores preserved specialization and original-domain metadata in model properties for exchange-friendly retention.
* 3.x to 4.0 migration warnings include alternative replacement types for ambiguous C260 Appendix E rows.
* 3.x to 4.0 migration can validate migrated relationships with a host-supplied Appendix B relationship validator and warn or replace invalid relationship types.
* Junctions are exposed as relationship connectors without counting them as ArchiMate 4 elements.
* Junction-connected relationships are constrained to the same relationship type and checked against the active relationship profile for direct endpoint validity.
* `getArchimate4RelationshipProfileCoverageReport()` lists missing Appendix B source rows and source-target cells for the active profile, allowing hosts to verify licensed profile transcription without committing the table.
* In ArchiMate 4 mode, junction connectors render as the Appendix A dot/ring markers, and an optional modeler-supplied name renders below the connector; ArchiMate 3.x keeps the legacy `AND`/`OR` text marker.
* Relationship popup labels use the C260 direct/reverse role names while retaining the underlying relationship type for editing.
* Renderer pictograms use the active language profile `pictoRef`, including ArchiMate 4 spelling-corrected entries and custom specialized concepts.
* The ArchiMate 4 `Stakeholder` renderer pictogram uses a dedicated locally-authored cylinder path instead of the actor/person pictogram.
* The ArchiMate 4 `Driver` renderer pictogram uses a dedicated locally-authored wheel path instead of the generic object pictogram.
* The ArchiMate 4 `Assessment` renderer pictogram uses a dedicated locally-authored magnifying-glass path instead of the generic object pictogram.
* The ArchiMate 4 `Goal` renderer pictogram uses a dedicated locally-authored target path instead of the generic object pictogram.
* The ArchiMate 4 `Outcome` renderer pictogram uses a dedicated locally-authored target-arrow path instead of the generic object pictogram.
* The ArchiMate 4 `Principle` renderer pictogram uses a dedicated locally-authored exclamation path instead of the generic object pictogram.
* The ArchiMate 4 `Requirement` renderer pictogram uses a dedicated locally-authored parallelogram path instead of the generic object pictogram.
* The ArchiMate 4 `Value` renderer pictogram uses a dedicated locally-authored oval path instead of the generic object pictogram.
* The ArchiMate 4 `Meaning` renderer pictogram uses a dedicated locally-authored thought-cloud path instead of the generic object pictogram.
* The ArchiMate 4 `Location` renderer pictogram uses a dedicated locally-authored pin path instead of the legacy generic object pictogram.
* The ArchiMate 4 `Distribution Network` renderer pictogram uses a dedicated locally-authored bidirectional arrow path instead of the Communication Network node-link pictogram.
* The ArchiMate 4 `Material` renderer pictogram uses a dedicated locally-authored hexagon path instead of the Artifact document pictogram.
* The ArchiMate 4 `Facility` renderer pictogram uses a dedicated locally-authored factory path instead of the Node cube pictogram.
* The ArchiMate 4 `Equipment` renderer pictogram uses a dedicated locally-authored gear path instead of the Device monitor pictogram.
* The ArchiMate 4 `Work Package` renderer pictogram uses a dedicated locally-authored loop-arrow path instead of the Process horizontal arrow pictogram.
* The ArchiMate 4 `Deliverable` renderer pictogram uses a dedicated locally-authored wavy-bottom document path instead of the generic object pictogram.
* The ArchiMate 4 `Plateau` renderer pictogram uses a dedicated locally-authored stacked-bars path instead of the Product folder pictogram.
* The ArchiMate 4 `Grouping` renderer pictogram uses a dedicated locally-authored dashed-rectangle path instead of the generic object pictogram.
* In ArchiMate 4 mode, Motivation elements render with clipped/chamfered body corners from the Appendix A notation summary while ArchiMate 3.x keeps the existing rectangle body behavior.
* In ArchiMate 4 mode, `Grouping` renders with a dashed, unfilled outline to match the Appendix A notation boundary while exact Appendix A vector artwork remains externally source-dependent.
* ArchiMate 4 `Grouping`, `Location`, and `Plateau` can aggregate relationship concepts, including relationships and junctions.
* `deriveRelationship()` and `deriveRelationshipType()` expose C260-derived DR1-DR8 valid relationship derivations for host tooling, including specialization transitivity, weakest structural derivation, dependency/dynamic derivation, Flow opposite-direction derivation, and Triggering transitivity.
* `deriveRelationship()` and `derivePotentialRelationship()` apply C260 Appendix B.4 derivation restrictions when an ArchiMate 4 profile with endpoint domain/aspect metadata is supplied.
* `deriveRelationshipChain()` folds ordered in-line valid derivation chains and records the original relationship ids plus pairwise rule labels.
* `derivePotentialRelationship()` exposes C260-derived PDR1-PDR12 as explicit `potential: true` candidates. PDR12 requires an external relationship validator because it depends on whether the derived endpoint pair is allowed by the active metamodel/profile.
* Imported and edited Access, Association, and Influence relationship options use explicit `accessType`, `isDirected`, and `modifier` properties while retaining `typeOption` compatibility. The relationship popup exposes explicit Access type actions for `None`, `Read`, `Write`, and `ReadWrite`, and explicit Association direction actions for undirected and directed notation.
* Influence relationship modifiers are preserved and rendered; the ArchiMate 4 popup includes quick actions for positive/negative influence and a custom sign/strength modifier input.
* Relationship multiplicity is supported on relationship ends with positive integer, `*` / `0..*`, or finite `n..m` notation, except where an end is connected to a junction. `0..*` is normalized to the canonical `*` value, and the ArchiMate 4 relationship popup can edit custom source/target multiplicity values.
* `validateArchimate4Model(model, options)` and `validateArchimateModel(model, options)` expose model-level diagnostics for unsupported 3.x/4.0 concepts, retired ArchiMate 3 concepts, relationship endpoint/type support, active relationship profile checks, multiplicity notation, junction relationship consistency, view viewpoint references, view node `elementRef` references and geometry, view connection `relationshipRef`, endpoint references, endpoint-to-relationship alignment, waypoint geometry, and view `style`/`font`/`color` values including invalid `font.style` `plain` combinations, viewpoint purpose/content, allowed-type, stakeholder/concern, and `modelingNotes` structure, model-defined and profile-defined viewpoint allowed-type application to View contents, organization `identifierRef` references, reusable `PropertyDefinition` structure, `Property.propertyDefinitionRef` references, present `Property.value` string structure, and profile attribute property values.
* `getArchimate4ImplementationStatus()` exposes machine-readable status for implemented, experimental, optional, source-coverage, and external-source-dependent ArchiMate 4 areas.
* `getArchimate4ConformanceReport()` exposes a flattened official-conformance report with blocker ids, missing required sources, required-before-claim actions, remaining gap ids, and companion gaps derived from the current implementation status.
* Implementation status includes `elementCatalog.expectedTypes`, `elementCatalog.actualTypes`, `elementCatalog.missingTypes`, and `elementCatalog.extraTypes` so the 42-element C260 catalog is audited by exact type identity, not only by count.
* Implementation status includes `relationshipConnectors.expectedTypes`, `relationshipConnectors.actualTypes`, `relationshipConnectors.missingTypes`, and `relationshipConnectors.extraTypes` so `AndJunction` and `OrJunction` coverage is audited outside the 42-element catalog.
* Implementation status includes `conformanceRequirements.expectedIds`, `conformanceRequirements.actualIds`, `conformanceRequirements.missingIds`, and `conformanceRequirements.extraIds` so the C260 shall/may requirement map is audited by exact requirement identity.
* Implementation status includes `conformanceRequirements.may.notBundled` so the optional, informative Appendix C example viewpoints remain visible without being treated as official conformance blockers or required sources.
* Implementation status includes `conformanceReadiness.officialConformanceClaimable`; it remains `false` while official Appendix B, MEFF 4.0 XSD, or exact Appendix A artwork-rights blockers remain.
* Implementation status includes `conformanceReadiness.requiredBeforeClaimByBlocker`, `conformanceReadiness.missingRequiredBeforeClaimBlockerIds`, and `conformanceReadiness.extraRequiredBeforeClaimBlockerIds` so every official-claim prerequisite remains tied to an external blocker id.
* Implementation status includes `remainingGaps.expectedIds`, `remainingGaps.actualIds`, `remainingGaps.missingIds`, and `remainingGaps.extraIds` so official-conformance blockers and companion-source gaps remain visible as one exact residual gap catalog.
* Implementation status includes `sectionCoverage.expectedIds`, `sectionCoverage.actualIds`, `sectionCoverage.missingIds`, `sectionCoverage.extraIds`, `sectionCoverage.statusKeyIds`, `sectionCoverage.missingRequirementReferenceIds`, `sectionCoverage.missingExternalBlockerReferenceIds`, and `sectionCoverage.missingStatusKeyReferenceIds` so C260 chapter and appendix coverage, including Introduction/Conformance and Definitions, is audited by exact section identity and cannot reference unregistered conformance requirements, external blockers, or status API keys.
* Implementation status includes `introductionCoverage.expectedIds`, `introductionCoverage.actualIds`, `introductionCoverage.missingIntroductionIds`, `introductionCoverage.extraIntroductionIds`, `introductionCoverage.requirementSourceIds`, and `introductionCoverage.referenceOnlyIds` so the C260 Chapter 1 Introduction/Conformance outline is audited by exact subsection identity while reference-only introductory subsections stay out of conformance blockers and required-source gaps.
* Implementation status includes `definitionCoverage.expectedIds`, `definitionCoverage.actualIds`, `definitionCoverage.missingDefinitionIds`, and `definitionCoverage.extraDefinitionIds` so the C260 Chapter 2 definition vocabulary is audited by exact term identity without copying the definition prose.
* Implementation status includes `languageStructureCoverage.expectedIds`, `languageStructureCoverage.actualIds`, `languageStructureCoverage.missingLanguageStructureIds`, and `languageStructureCoverage.extraLanguageStructureIds` so the C260 Chapter 3 Language Structure outline is audited by exact subsection identity.
* Implementation status includes `commonDomainCoverage.expectedIds`, `commonDomainCoverage.actualIds`, `commonDomainCoverage.missingCommonDomainIds`, and `commonDomainCoverage.extraCommonDomainIds` so the C260 Chapter 4 Common Domain outline is audited by exact subsection and element-heading identity.
* Implementation status includes `relationshipsAndJunctionsCoverage.expectedIds`, `relationshipsAndJunctionsCoverage.actualIds`, `relationshipsAndJunctionsCoverage.missingRelationshipsAndJunctionsIds`, and `relationshipsAndJunctionsCoverage.extraRelationshipsAndJunctionsIds` so the C260 Chapter 5 Relationships and Junctions outline is audited by exact subsection identity while Appendix B matrix data remains externally supplied.
* Implementation status includes `motivationDomainCoverage.expectedIds`, `motivationDomainCoverage.actualIds`, `motivationDomainCoverage.missingMotivationDomainIds`, and `motivationDomainCoverage.extraMotivationDomainIds` so the C260 Chapter 6 Motivation Domain outline is audited by exact subsection and element-heading identity.
* Implementation status includes `strategyDomainCoverage.expectedIds`, `strategyDomainCoverage.actualIds`, `strategyDomainCoverage.missingStrategyDomainIds`, and `strategyDomainCoverage.extraStrategyDomainIds` so the C260 Chapter 7 Strategy Domain outline is audited by exact subsection and element-heading identity.
* Implementation status includes `businessDomainCoverage.expectedIds`, `businessDomainCoverage.actualIds`, `businessDomainCoverage.missingBusinessDomainIds`, and `businessDomainCoverage.extraBusinessDomainIds` so the C260 Chapter 8 Business Domain outline is audited by exact subsection and element-heading identity.
* Implementation status includes `applicationDomainCoverage.expectedIds`, `applicationDomainCoverage.actualIds`, `applicationDomainCoverage.missingApplicationDomainIds`, and `applicationDomainCoverage.extraApplicationDomainIds` so the C260 Chapter 9 Application Domain outline is audited by exact subsection and element-heading identity.
* Implementation status includes `technologyDomainCoverage.expectedIds`, `technologyDomainCoverage.actualIds`, `technologyDomainCoverage.missingTechnologyDomainIds`, and `technologyDomainCoverage.extraTechnologyDomainIds` so the C260 Chapter 10 Technology Domain outline is audited by exact subsection and element-heading identity.
* Implementation status includes `relationshipsBetweenCoreDomainsCoverage.expectedIds`, `relationshipsBetweenCoreDomainsCoverage.actualIds`, `relationshipsBetweenCoreDomainsCoverage.missingRelationshipsBetweenCoreDomainsIds`, and `relationshipsBetweenCoreDomainsCoverage.extraRelationshipsBetweenCoreDomainsIds` so the C260 Chapter 11 Relationships Between Core Domains outline is audited by exact subsection identity.
* Implementation status includes `implementationAndMigrationDomainCoverage.expectedIds`, `implementationAndMigrationDomainCoverage.actualIds`, `implementationAndMigrationDomainCoverage.missingImplementationAndMigrationDomainIds`, and `implementationAndMigrationDomainCoverage.extraImplementationAndMigrationDomainIds` so the C260 Chapter 12 Implementation and Migration Domain outline is audited by exact subsection and element-heading identity.
* Implementation status includes `stakeholdersArchitectureViewsViewpointsCoverage.expectedIds`, `stakeholdersArchitectureViewsViewpointsCoverage.actualIds`, `stakeholdersArchitectureViewsViewpointsCoverage.missingStakeholdersArchitectureViewsViewpointsIds`, and `stakeholdersArchitectureViewsViewpointsCoverage.extraStakeholdersArchitectureViewsViewpointsIds` so the C260 Chapter 13 Stakeholders, Architecture Views, and Viewpoints outline is audited by exact subsection identity.
* Implementation status includes `languageCustomizationMechanismsCoverage.expectedIds`, `languageCustomizationMechanismsCoverage.actualIds`, `languageCustomizationMechanismsCoverage.missingLanguageCustomizationMechanismsIds`, and `languageCustomizationMechanismsCoverage.extraLanguageCustomizationMechanismsIds` so the C260 Chapter 14 Language Customization Mechanisms outline is audited by exact subsection identity.
* Implementation status includes `appendixANotationCoverage.expectedIds`, `appendixANotationCoverage.actualIds`, `appendixANotationCoverage.missingAppendixANotationIds`, and `appendixANotationCoverage.extraAppendixANotationIds` so the C260 Appendix A Summary of Language Notation outline is audited by exact subsection identity while exact artwork rights remain externally source-dependent.
* Implementation status includes `appendixBRelationshipsCoverage.expectedIds`, `appendixBRelationshipsCoverage.actualIds`, `appendixBRelationshipsCoverage.missingAppendixBRelationshipsIds`, and `appendixBRelationshipsCoverage.extraAppendixBRelationshipsIds` so the C260 Appendix B Relationships outline is audited by exact subsection identity while relationship table data remains externally supplied.
* Implementation status includes `appendixCExampleViewpointsCoverage.expectedIds`, `appendixCExampleViewpointsCoverage.actualIds`, `appendixCExampleViewpointsCoverage.missingAppendixCExampleViewpointsIds`, and `appendixCExampleViewpointsCoverage.extraAppendixCExampleViewpointsIds` so the C260 Appendix C Example Viewpoints outline is audited by exact subsection identity.
* Implementation status includes `appendixDStandardsGuidanceCoverage.expectedIds`, `appendixDStandardsGuidanceCoverage.actualIds`, `appendixDStandardsGuidanceCoverage.missingAppendixDStandardsGuidanceIds`, `appendixDStandardsGuidanceCoverage.extraAppendixDStandardsGuidanceIds`, `appendixDStandardsGuidanceCoverage.referenceOnlyIds`, and `appendixDStandardsGuidanceCoverage.missingReferenceOnlyIds` so the C260 Appendix D Relationship to Other Standards, Specifications, and Guidance Documents outline is audited by exact subsection identity while related standards and guidance references stay out of source gaps, remaining gaps, and official conformance blockers.
* Implementation status includes `appendixEVersionChangesCoverage.expectedIds`, `appendixEVersionChangesCoverage.actualIds`, `appendixEVersionChangesCoverage.missingAppendixEVersionChangesIds`, `appendixEVersionChangesCoverage.extraAppendixEVersionChangesIds`, `appendixEVersionChangesCoverage.historicalReferenceIds`, and `appendixEVersionChangesCoverage.migrationSourceIds` so the C260 Appendix E version-change outline is audited by exact subsection identity while E.1-E.3 remain historical references and E.4 remains the migration source boundary outside official conformance blockers.
* Implementation status includes `appendixFAcronymsCoverage.expectedIds`, `appendixFAcronymsCoverage.actualIds`, `appendixFAcronymsCoverage.missingAppendixFAcronymIds`, `appendixFAcronymsCoverage.extraAppendixFAcronymIds`, `appendixFAcronymsCoverage.vocabularyOnlyIds`, and `appendixFAcronymsCoverage.missingVocabularyOnlyIds` so the C260 Appendix F acronym tokens are audited by exact identity without copying acronym expansions and without mixing vocabulary tokens into language sections, source gaps, remaining gaps, or official conformance blockers.
* Implementation status includes `documentArtifactCoverage.expectedIds`, `documentArtifactCoverage.actualIds`, `documentArtifactCoverage.missingDocumentArtifactIds`, `documentArtifactCoverage.extraDocumentArtifactIds`, `documentArtifactCoverage.nonImplementationIds`, and `documentArtifactCoverage.missingNonImplementationIds` so C260 front matter and Index outline artifacts are audited as non-implementation references instead of being mixed into language section coverage, source gaps, remaining gaps, or official conformance blockers.
* Implementation status includes `c260CoverageAggregate.expectedCoverageIds`, `c260CoverageAggregate.incompleteCoverageIds`, `c260CoverageAggregate.rawDuplicateIds`, and `c260CoverageAggregate.qualifiedDuplicateCount` so all C260 coverage groups are auditable together without hiding repeated raw heading ids across chapters.
* Implementation status includes `c260SourceAlignment.outlineSourceItemCount`, `c260SourceAlignment.outlineCoveredItemCount`, `c260SourceAlignment.nonOutlineDerivedCoverageIds`, and `c260SourceAlignment.aggregateItemCountDelta` so the 253-entry C260 PDF outline source is reconciled with the aggregate 284-item coverage total through the 31 Appendix F derived acronym tokens.
* Implementation status includes `c260SourceAlignment.expectedOutlineCoverageCounts`, `c260SourceAlignment.actualOutlineCoverageCounts`, and `c260SourceAlignment.outlineCoverageCountDeltas` so each PDF-outline-derived coverage group is audited by assigned item count.
* Implementation status includes `c260CoverageSourceEvidence.coverageSourceRunlogPaths`, `c260CoverageSourceEvidence.missingSourceRunlogCoverageIds`, and `c260CoverageSourceEvidence.sourceRunlogPathDeltas` so each C260 coverage group remains tied to a recorded source-extraction runlog.
* Implementation status includes `implementationCompletion.topKeys`, `implementationCompletion.completeSummaryCount`, `implementationCompletion.incompleteSummaryCount`, and `implementationCompletion.incompleteSummaryPaths` so the API exposes its own completion scan.
* Implementation status includes `modelValidation.expectedCheckIds`, `modelValidation.actualCheckIds`, `modelValidation.missingCheckIds`, and `modelValidation.extraCheckIds` so model-level diagnostic coverage remains auditable while Appendix B table data stays externally supplied.
* Implementation status includes `exampleViewpointCatalog.expectedGroupCount`, `exampleViewpointCatalog.groupCount`, `exampleViewpointCatalog.expectedViewpointCount`, and `exampleViewpointCatalog.viewpointCount` so the informative Appendix C catalog remains audited without bundling viewpoint definitions.
* The current implementation-status completion API scan is recorded in `project_memory/runlogs/20260710-0127-status-completion-api-scan.json`; it records 49 top-level status keys, 40 `complete` summaries, no incomplete summaries, and the section coverage status-key guard arrays including `exampleViewpointCatalog`.
* Implementation status includes `externalBlockerCatalog.expectedIds`, `externalBlockerCatalog.actualIds`, `externalBlockerCatalog.missingIds`, and `externalBlockerCatalog.extraIds` so blocker identity stays aligned across readiness, requirements, and source coverage.
* Implementation status includes `sourceCoverage.expectedSourceIds`, `sourceCoverage.actualSourceIds`, `sourceCoverage.missingSourceIds`, and `sourceCoverage.extraSourceIds` so the source-evidence ledger is audited by exact source identity.
* Implementation status includes source coverage for the local C260 PDF, local launch transcript, W262 companion paper availability, Appendix B relationship matrix, MEFF 4.0 XSD, and Appendix A artwork-rights boundary.
* Implementation status includes `exchangeFormat.internalRoundTripTested`, `exchangeFormat.internalRoundTripRunlogPath`, and `exchangeFormat.officialConformanceClaimable` so the internal ArchiMate 4 XML read/write/read coverage stays separate from official MEFF 4.0 conformance.
* Official XML conformance depends on the availability and redistribution rights of the ArchiMate 4 Model Exchange File Format XSD and C260-derived relationship matrix.
* The bundled 4.0 relationship rules are compatibility-derived fallback data until the official source package is supplied.

## Demo

Run `npm run demo:build`, then open `demo/index.html` from the local static server. The Viewer and
Editor demos load an ArchiMate 4 sample with Common Domain `Role`, `Service`, `Path`, and `Grouping`
notation. The Editor palette uses dedicated Common Domain icons instead of the old Business or
Technology colored assets for those consolidated ArchiMate 4 concepts.

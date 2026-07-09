# ArchiMate 4 Implementation Specification

This document is an implementation specification derived from the licensed ArchiMate 4 Specification
(The Open Group Standard C260, April 2026) and the supplied ArchiMate 4 launch transcript. It is not
a reproduction of the C260 text or relationship tables. Use the licensed source for normative wording.

## Source Status

- Normative source reviewed: local licensed PDF `C:\Users\syska\Downloads\978940181474E.pdf`.
- PDF metadata: title `ArchiMate 4 Specification`, author `The Open Group`, document number C260,
  published April 2026, 207 PDF pages.
- Supporting source reviewed: launch transcript
  `C:\Users\syska\.codex\attachments\eab35e75-10d5-4e1d-854e-3cc8feb4496c\pasted-text.txt`.
- W262 companion paper status: The Open Group publication page for W262 is reachable and lists a free
  PDF download that requires login; the PDF is not yet present locally. The latest page and local
  Downloads/attachments check is recorded in
  `project_memory/runlogs/20260709-201226-external-source-current-recheck.json`; it detected the W262
  title, 22-page metadata, 2026-04-27 publication metadata, and found no matching local W262 PDF.
- Local ArchiMate PDF inventory status: `project_memory/runlogs/20260709-2110-local-archimate-pdf-identification.json`
  identifies the local 207-page C260 PDF, C260 samples, and ArchiMate 4 Non-Commercial License files,
  and records no W262 candidate among those local PDFs.
- Public MEFF 4.0 XSD status remains unresolved in this workspace. The public XSD directory checked
  earlier exposed 3.1/3.2 resources, not a confirmed 4.0 schema.
- Appendix B source status is split deliberately: the licensed local C260 source has been reviewed,
  the external relationship profile loader and coverage report APIs are implemented, and no
  redistributable Appendix B profile artifact is committed.
- Local ArchiMate 4 Non-Commercial License boundary status:
  `project_memory/runlogs/20260709-2125-archimate4-ncl-license-boundary.json` records sanitized
  keyword facts only and does not clear the Appendix B redistributable-profile blocker or the Appendix
  A exact-artwork-rights blocker.

## Conformance Requirements For This Repository

An ArchiMate 4 implementation in this repository must support:

- The ArchiMate 4 element set and standard iconography from the language chapters and Appendix A.
- The viewpoint mechanism and language customization mechanism.
- The allowed relationship rules from Appendix B.
- The ArchiMate 4 domain terminology. UI and docs should use "domain" rather than the old
  layer-centric language when `archimateVersion` is `4.0`.

Example viewpoints are informative, so they are not required for editor conformance.

`archimate4-profile.json` must keep a machine-readable C260 conformance requirement map with the
five required clauses represented as `shall` entries and the example viewpoint clause represented as a
`may` entry. `getArchimate4ImplementationStatus()` must surface that map with summary counts so
formal support, implementation-defined support, optional support, and external blockers are not
collapsed into one ambiguous "supported" flag.
The status must also expose exact requirement identity fields (`expectedIds`, `actualIds`,
`missingIds`, and `extraIds`) so a count-preserving but wrong shall/may map cannot appear complete.
The optional Appendix C example viewpoints must remain visible as
`conformanceRequirements.may.notBundled` without entering `remainingGaps`,
`conformanceReadiness.blockers`, or required source coverage.

`getArchimate4ImplementationStatus()` must also surface source coverage metadata. This keeps the
local C260 PDF and launch transcript, the missing W262 companion paper, the external Appendix B
relationship matrix, the MEFF 4.0 XSD, and Appendix A artwork-rights boundary visible to host tools.
The status must expose exact source identity fields (`sourceCoverage.expectedSourceIds`,
`sourceCoverage.actualSourceIds`, `sourceCoverage.missingSourceIds`, and
`sourceCoverage.extraSourceIds`) so a count-preserving but wrong source ledger cannot appear
complete.
It must also expose `conformanceReadiness.officialConformanceClaimable` so host tools cannot mistake
implemented local coverage for a complete official conformance claim while external blockers remain.
It must expose `conformanceReadiness.requiredBeforeClaimByBlocker`,
`conformanceReadiness.missingRequiredBeforeClaimBlockerIds`, and
`conformanceReadiness.extraRequiredBeforeClaimBlockerIds` so every prerequisite for an official
conformance claim stays aligned to an external blocker id.
It must expose exact remaining-gap identity fields (`remainingGaps.expectedIds`,
`remainingGaps.actualIds`, `remainingGaps.missingIds`, and `remainingGaps.extraIds`) and alignment
fields such as `missingOfficialConformanceGapIds` and `missingCompanionGapSourceIds`, so external
conformance blockers and companion-source gaps cannot drift silently.
It must expose exact C260 section coverage fields (`sectionCoverage.expectedIds`,
`sectionCoverage.actualIds`, `sectionCoverage.missingIds`, `sectionCoverage.extraIds`,
`sectionCoverage.missingRequirementReferenceIds`, and
`sectionCoverage.missingExternalBlockerReferenceIds`) so the implementation boundary remains
traceable to the reviewed C260 chapter and appendix outline without allowing unregistered
requirement or blocker references. The exact section coverage must include Chapter 1
Introduction/Conformance and Chapter 2 Definitions as status-tracked sections, even though they are
not element-catalog chapters.
It must expose exact C260 Chapter 1 Introduction/Conformance outline fields
(`introductionCoverage.expectedIds`, `introductionCoverage.actualIds`,
`introductionCoverage.missingIntroductionIds`, and `introductionCoverage.extraIntroductionIds`) so
the implementation can track introductory, conformance, normative-reference, terminology, and
future-direction coverage by subsection identity.
It must also expose Chapter 1 boundary fields (`introductionCoverage.requirementSourceIds`,
`introductionCoverage.referenceOnlyIds`, `introductionCoverage.missingRequirementSourceIds`, and
`introductionCoverage.missingReferenceOnlyIds`) so only Conformance is treated as the requirement
source while the Objective, Overview, Normative References, Terminology, and Future Directions
subsections remain reference-only and cannot become source gaps, remaining gaps, or official
conformance blockers.
It must expose exact C260 Chapter 2 definition vocabulary fields (`definitionCoverage.expectedIds`,
`definitionCoverage.actualIds`, `definitionCoverage.missingDefinitionIds`, and
`definitionCoverage.extraDefinitionIds`) so the implementation can track the standard terminology
by term identity without embedding copied definition prose.
It must expose exact C260 Chapter 3 Language Structure outline fields
(`languageStructureCoverage.expectedIds`, `languageStructureCoverage.actualIds`,
`languageStructureCoverage.missingLanguageStructureIds`, and
`languageStructureCoverage.extraLanguageStructureIds`) so the implementation can track language
design, domains, aspects, top-level structure, structure/behavior concepts, abstraction, notation,
nesting, and color/cue coverage by subsection identity.
It must expose exact C260 Chapter 4 Common Domain outline fields
(`commonDomainCoverage.expectedIds`, `commonDomainCoverage.actualIds`,
`commonDomainCoverage.missingCommonDomainIds`, and `commonDomainCoverage.extraCommonDomainIds`) so
the implementation can track Common active structure, behavior, composite, element, and summary
coverage by subsection and element-heading identity.
It must expose exact C260 Chapter 5 Relationships and Junctions outline fields
(`relationshipsAndJunctionsCoverage.expectedIds`, `relationshipsAndJunctionsCoverage.actualIds`,
`relationshipsAndJunctionsCoverage.missingRelationshipsAndJunctionsIds`, and
`relationshipsAndJunctionsCoverage.extraRelationshipsAndJunctionsIds`) so the implementation can
track relationship categories, individual relationship headings, junctions, multiplicity, summaries,
and derivation coverage by subsection identity while keeping Appendix B matrix data external.
It must expose exact C260 Chapter 6 Motivation Domain outline fields
(`motivationDomainCoverage.expectedIds`, `motivationDomainCoverage.actualIds`,
`motivationDomainCoverage.missingMotivationDomainIds`, and
`motivationDomainCoverage.extraMotivationDomainIds`) so the implementation can track Motivation
metamodel, element groups, individual Motivation elements, examples, summaries, and other-domain
relationship coverage by subsection and element-heading identity.
It must expose exact C260 Chapter 7 Strategy Domain outline fields
(`strategyDomainCoverage.expectedIds`, `strategyDomainCoverage.actualIds`,
`strategyDomainCoverage.missingStrategyDomainIds`, and
`strategyDomainCoverage.extraStrategyDomainIds`) so the implementation can track Strategy metamodel,
structure elements, behavior elements, examples, summaries, and other-domain relationship coverage
by subsection and element-heading identity.
It must expose exact C260 Chapter 8 Business Domain outline fields
(`businessDomainCoverage.expectedIds`, `businessDomainCoverage.actualIds`,
`businessDomainCoverage.missingBusinessDomainIds`, and
`businessDomainCoverage.extraBusinessDomainIds`) so the implementation can track Business structure
metamodel, active structure, passive structure, composite elements, examples, and summaries by
subsection and element-heading identity.
It must expose exact C260 Chapter 9 Application Domain outline fields
(`applicationDomainCoverage.expectedIds`, `applicationDomainCoverage.actualIds`,
`applicationDomainCoverage.missingApplicationDomainIds`, and
`applicationDomainCoverage.extraApplicationDomainIds`) so the implementation can track Application
structure metamodel, active structure, passive structure, examples, and summaries by subsection and
element-heading identity.
It must expose exact C260 Chapter 10 Technology Domain outline fields
(`technologyDomainCoverage.expectedIds`, `technologyDomainCoverage.actualIds`,
`technologyDomainCoverage.missingTechnologyDomainIds`, and
`technologyDomainCoverage.extraTechnologyDomainIds`) so the implementation can track Technology
metamodel, active structure, passive structure, examples, and summaries by subsection and
element-heading identity.
It must expose exact C260 Chapter 11 Relationships Between Core Domains outline fields
(`relationshipsBetweenCoreDomainsCoverage.expectedIds`,
`relationshipsBetweenCoreDomainsCoverage.actualIds`,
`relationshipsBetweenCoreDomainsCoverage.missingRelationshipsBetweenCoreDomainsIds`, and
`relationshipsBetweenCoreDomainsCoverage.extraRelationshipsBetweenCoreDomainsIds`) so the
implementation can track cross-domain relationship example coverage by subsection identity.
It must expose exact C260 Chapter 12 Implementation and Migration Domain outline fields
(`implementationAndMigrationDomainCoverage.expectedIds`,
`implementationAndMigrationDomainCoverage.actualIds`,
`implementationAndMigrationDomainCoverage.missingImplementationAndMigrationDomainIds`, and
`implementationAndMigrationDomainCoverage.extraImplementationAndMigrationDomainIds`) so the
implementation can track Implementation and Migration metamodel, element, example, summary, and
relationship-with-domains coverage by subsection and element-heading identity.
It must expose exact C260 Chapter 13 Stakeholders, Architecture Views, and Viewpoints outline fields
(`stakeholdersArchitectureViewsViewpointsCoverage.expectedIds`,
`stakeholdersArchitectureViewsViewpointsCoverage.actualIds`,
`stakeholdersArchitectureViewsViewpointsCoverage.missingStakeholdersArchitectureViewsViewpointsIds`,
and `stakeholdersArchitectureViewsViewpointsCoverage.extraStakeholdersArchitectureViewsViewpointsIds`)
so the implementation can track stakeholder, architecture view, viewpoint mechanism, and example
viewpoint coverage by subsection identity.
It must expose exact C260 Chapter 14 Language Customization Mechanisms outline fields
(`languageCustomizationMechanismsCoverage.expectedIds`,
`languageCustomizationMechanismsCoverage.actualIds`,
`languageCustomizationMechanismsCoverage.missingLanguageCustomizationMechanismsIds`, and
`languageCustomizationMechanismsCoverage.extraLanguageCustomizationMechanismsIds`) so the
implementation can track attribute-extension and specialization coverage by subsection identity.
It must expose exact C260 Appendix A Summary of Language Notation outline fields
(`appendixANotationCoverage.expectedIds`, `appendixANotationCoverage.actualIds`,
`appendixANotationCoverage.missingAppendixANotationIds`, and
`appendixANotationCoverage.extraAppendixANotationIds`) so the implementation can track notation
summary coverage by subsection identity while preserving the external-source boundary for exact
artwork redistribution rights.
It must expose exact C260 Appendix B Relationships outline fields
(`appendixBRelationshipsCoverage.expectedIds`, `appendixBRelationshipsCoverage.actualIds`,
`appendixBRelationshipsCoverage.missingAppendixBRelationshipsIds`, and
`appendixBRelationshipsCoverage.extraAppendixBRelationshipsIds`) so the implementation can track
derivation, restriction, relationship-table, and relationship-between-relationships coverage by
subsection identity while preserving the external-source boundary for relationship table data.
It must expose exact C260 Appendix C Example Viewpoints outline fields
(`appendixCExampleViewpointsCoverage.expectedIds`,
`appendixCExampleViewpointsCoverage.actualIds`,
`appendixCExampleViewpointsCoverage.missingAppendixCExampleViewpointsIds`, and
`appendixCExampleViewpointsCoverage.extraAppendixCExampleViewpointsIds`) so the implementation can
track example viewpoint coverage by subsection identity.
It must expose exact C260 Appendix D Relationship to Other Standards, Specifications, and Guidance
Documents outline fields (`appendixDStandardsGuidanceCoverage.expectedIds`,
`appendixDStandardsGuidanceCoverage.actualIds`,
`appendixDStandardsGuidanceCoverage.missingAppendixDStandardsGuidanceIds`, and
`appendixDStandardsGuidanceCoverage.extraAppendixDStandardsGuidanceIds`) so the implementation can
track standards and guidance relationship coverage by subsection identity.
It must expose `appendixDStandardsGuidanceCoverage.referenceOnlyIds` and
`appendixDStandardsGuidanceCoverage.missingReferenceOnlyIds` so Appendix D related-standard and
guidance references are tracked as reference-only coverage rather than source coverage,
remaining gaps, readiness blockers, or official conformance blockers.
It must expose exact C260 Appendix E Changes from Version 2.1 to This Document outline fields
(`appendixEVersionChangesCoverage.expectedIds`, `appendixEVersionChangesCoverage.actualIds`,
`appendixEVersionChangesCoverage.missingAppendixEVersionChangesIds`, and
`appendixEVersionChangesCoverage.extraAppendixEVersionChangesIds`) so the implementation can track
version-change coverage by subsection identity.
It must expose `appendixEVersionChangesCoverage.historicalReferenceIds`,
`appendixEVersionChangesCoverage.migrationSourceIds`,
`appendixEVersionChangesCoverage.missingHistoricalReferenceIds`, and
`appendixEVersionChangesCoverage.missingMigrationSourceIds` so E.1-E.3 are tracked as historical
references while E.4 is tracked as the ArchiMate 4 migration source boundary, without either class
being confused with external source gaps, remaining gaps, readiness blockers, or official
conformance blockers.
It must expose exact C260 Appendix F Acronyms token fields
(`appendixFAcronymsCoverage.expectedIds`, `appendixFAcronymsCoverage.actualIds`,
`appendixFAcronymsCoverage.missingAppendixFAcronymIds`, and
`appendixFAcronymsCoverage.extraAppendixFAcronymIds`) so the implementation can track acronym
coverage by token identity without copying acronym expansions or Appendix F prose.
It must expose `appendixFAcronymsCoverage.vocabularyOnlyIds` and
`appendixFAcronymsCoverage.missingVocabularyOnlyIds` so acronym tokens remain vocabulary-only
coverage rather than language sections, source coverage, remaining gaps, readiness blockers, or
official conformance blockers.
It must expose exact C260 document artifact fields (`documentArtifactCoverage.expectedIds`,
`documentArtifactCoverage.actualIds`, `documentArtifactCoverage.missingDocumentArtifactIds`,
`documentArtifactCoverage.extraDocumentArtifactIds`, `documentArtifactCoverage.nonImplementationIds`,
and `documentArtifactCoverage.missingNonImplementationIds`) so C260 front matter and Index outline
artifacts are tracked as non-implementation references rather than mixed into ArchiMate language
section coverage, source gaps, remaining gaps, or official conformance blockers.
It must expose aggregate C260 coverage fields (`c260CoverageAggregate.expectedCoverageIds`,
`c260CoverageAggregate.incompleteCoverageIds`, `c260CoverageAggregate.rawDuplicateIds`, and
`c260CoverageAggregate.qualifiedDuplicateCount`) so all C260 coverage groups can be audited together
without hiding repeated raw heading ids across chapters.
It must expose C260 source alignment fields (`c260SourceAlignment.outlineSourceItemCount`,
`c260SourceAlignment.outlineCoveredItemCount`, `c260SourceAlignment.missingOutlineCoverageIds`,
`c260SourceAlignment.nonOutlineDerivedCoverageIds`, and `c260SourceAlignment.aggregateItemCountDelta`)
so the full PDF outline source count remains reconciled with derived non-outline coverage such as
Appendix F acronym tokens.
It must expose C260 outline assignment fields
(`c260SourceAlignment.expectedOutlineCoverageCounts`,
`c260SourceAlignment.actualOutlineCoverageCounts`,
`c260SourceAlignment.missingOutlineCoverageCountIds`, and
`c260SourceAlignment.outlineCoverageCountDeltas`) so each outline-derived coverage group is checked
against its source-assigned count.
It must expose C260 coverage source evidence fields
(`c260CoverageSourceEvidence.coverageSourceRunlogPaths`,
`c260CoverageSourceEvidence.missingSourceRunlogCoverageIds`, and
`c260CoverageSourceEvidence.sourceRunlogPathDeltas`) so every C260 coverage group remains tied to a
recorded source-extraction runlog.
The status must expose implementation completion scan fields
(`implementationCompletion.topKeys`, `implementationCompletion.completeSummaryCount`,
`implementationCompletion.incompleteSummaryCount`, and `implementationCompletion.incompleteSummaryPaths`).
The current implementation-status completion API scan is recorded in
`project_memory/runlogs/20260709-2043-status-completion-api-scan.json`; it records 47 top-level
status keys, 38 `complete` summaries, and no incomplete summaries, with an empty stderr companion log.
The status must expose exact blocker identity fields (`externalBlockerCatalog.expectedIds`,
`externalBlockerCatalog.actualIds`, `externalBlockerCatalog.missingIds`, and
`externalBlockerCatalog.extraIds`) so readiness, requirement, and source-coverage blocker ids cannot
drift silently.

## Language Structure

ArchiMate 4 organizes concepts by domains and aspects.

Core domains:

- Common
- Business
- Application
- Technology

Additional domains:

- Motivation
- Strategy
- Implementation and Migration

Aspects remain:

- Active Structure
- Behavior
- Passive Structure
- Composite
- Motivation

Default color cues from the specification may be used for UI consistency but do not carry formal
semantics.

## Language Customization

C260 requires support for language customization mechanisms in an implementation-defined manner.
For this repository, the supported mechanism is an `archimateLanguageProfile` option accepted by the
viewer/modeler configuration and by `createLanguageProfile(version, customization)`.

Supported customization data:

- Additional or overridden domain metadata, including color.
- Additional concept attributes retained on the active language profile for host tooling. Profile
  attributes must declare `concept`, `name`, and `type`; the concept must resolve to an active
  element, connector, or relationship in the customized profile.
  Host tooling can retrieve applicable attributes through `getProfileAttributesForConcept()` and can
  normalize or validate implementation-supported typed values through `normalizeProfileAttributeValue()`
  and `isProfileAttributeValueValid()`.
  The implementation-supported C260 basic types include `String`, `Boolean`, `Date`, and `Number`;
  C260 example/profile table types such as `Real`, `Currency`, `Time`, and `Integer` are also tracked.
  Implementation status must expose exact profile attribute type fields
  (`profileAttributeTypes.expectedC260TypeNames`, `profileAttributeTypes.actualC260TypeNames`,
  `profileAttributeTypes.missingC260TypeNames`, and
  `profileAttributeTypes.unexpectedAdditionalTypeNames`) so C260-derived basic/example attribute
  types and implementation-defined additions cannot drift silently.
  Behavior is guarded by
  `project_memory/runlogs/20260709-1206-profile-attribute-customization-behavior-test-language.txt`:
  attributes on standard and specialized element/relationship concepts are returned through the
  specialization lineage, while retired concepts, unsupported types, and missing names are rejected.
- Profile attribute values may be persisted through `setProfileAttributePropertyValue()`, which writes
  a reusable `PropertyDefinition` named `archimate-js:profileAttribute:<concept>:<name>` and a
  per-concept `Property` value. `getProfileAttributePropertyValue()` reads the stored string value back
  through the declared profile attribute type.
- Specialized element or connector metadata. New custom concepts must declare `specializes` and point
  to an existing standard concept or connector.
- Specialized relationship metadata. New custom relationship objects may declare `specializes` and
  point to an existing standard relationship type.

Runtime behavior:

- Palette and element metadata are read from the active customized profile.
- Shape metadata preserves the active profile `domain` for ArchiMate 4 concepts while retaining the
  legacy `layer` property as a compatibility alias.
- The ArchiMate 4 palette exposes every standard element in the 42-element catalog, including Common
  composite elements `Grouping` and `Location`.
- ArchiMate 4 Common Domain palette entries must use Common-colored visual assets and must not reuse
  the old Business or Technology colored palette icons for consolidated concepts such as `Role`,
  `Service`, `Process`, `Function`, `Event`, and `Path`.
- Default element color uses custom domain colors when supplied.
- Relationship validation resolves custom specialized concepts to their standard base concept, so a
  `RiskEvent` specializing `Event` inherits the base `Event` relationship constraints.
- Relationship validation resolves custom specialized relationships to their standard base
  relationship, so a `MaterialFlow` specializing `Flow` is allowed wherever the active relationship
  profile allows `Flow`.
- Relationship option menus include specialized relationships whenever their standard base
  relationship is allowed by the active relationship profile. Menu labels may come from
  `directLabel`, `reverseLabel`, `label`, or `typeName` on the custom relationship metadata.
- Specialized relationships inherit base relationship rendering and editable option behavior. For
  example, an `Influence` specialization can render a modifier, an `Access` specialization can retain
  access direction, and an `Association` specialization can retain directed association state.
- This does not embed Appendix B relationship table data; external Appendix B profiles remain the
  authoritative path for exact standard relationship rules.

## Viewpoint Mechanism

C260 requires support for the viewpoint mechanism. Example viewpoints are informative, so this
repository does not embed a fixed list of example viewpoint definitions as normative data.

Supported mechanism:

- `View` can retain a built-in viewpoint name in `viewpoint`.
- `View` can retain a reference to a model-defined viewpoint definition in `viewpointRef`.
- `Views` can retain a `Viewpoints` container with viewpoint definitions, concerns, stakeholders,
  purpose, content, allowed element types, allowed relationship types, and modeling notes.
- `archimateLanguageProfile.viewpoints` can supply implementation-defined viewpoint definitions for
  host tooling. Supported purpose values are `Designing`, `Deciding`, and `Informing`; supported
  content values are `Details`, `Coherence`, and `Overview`.
- `getArchimate4ImplementationStatus().stakeholderConcerns` must expose expected, actual, missing,
  and extra stakeholder/concern feature ids derived from the ArchiMate 4 moddle descriptor, so C260
  Chapter 13.2 support remains auditable separately from the broader viewpoint mechanism.
- `getArchimate4ImplementationStatus().viewpointMechanism` must expose expected, actual, missing,
  and extra viewpoint-mechanism feature ids, with actual features derived from the ArchiMate 4
  moddle descriptor, so the C260 Chapter 13 mechanism is not represented by a single unverified
  `implemented` label.
- `getArchimate4ImplementationStatus().viewpointClassification` must expose the expected, actual,
  missing, and unexpected C260 viewpoint purpose/content classification tokens so viewpoint
  mechanism support cannot drift silently from the C260 Chapter 13 token set.
- Custom viewpoint definitions must validate allowed element and relationship types against the active
  language profile, including implementation-defined specialized concepts and relationships.
- Behavior is guarded by `project_memory/runlogs/20260709-1199-viewpoint-customization-behavior-test-language.txt`:
  valid custom viewpoint definitions are accepted, while unsupported purpose/content and unsupported or
  malformed allowed type entries are rejected.

The MEFF 4.0 XSD is still required before claiming official ArchiMate 4 exchange conformance for this
serialization surface.

## View Nesting

C260 allows visual nesting as a notation technique. The importer and editor must preserve nested
`Node` view elements as diagram parent-child shapes and as `Node.nodes` children in the view model, so
the visual containment survives model loading and later save operations. The nested notation remains
visual; relationship semantics are still handled by explicit relationships and the active relationship
profile.

## Model Organization Tree

C260 references model organization support as part of model structuring. Until the MEFF 4.0 XSD is
available, this repository uses the public ArchiMate 3.1 model schema structure as the conservative
exchange reference for local descriptor support.

Implemented support:

- `Model.organizationsNode` resolves to a concrete `Organizations` descriptor type in the current,
  3.x, and 4.0 moddle descriptors.
- `Organizations` can contain repeated `Organization` entries.
- `Organization` can carry a name, documentation, nested organizations, and an optional
  `identifierRef` reference to a model concept.

## Element Catalog

The official ArchiMate 4 element count is 42. The implementation profile must match this count for
language elements, excluding relationship types.

| Domain | Aspect | Element Types |
| --- | --- | --- |
| Common | Active Structure | `Role`, `Collaboration`, `Path` |
| Common | Behavior | `Service`, `Process`, `Function`, `Event` |
| Common | Composite | `Grouping`, `Location` |
| Motivation | Motivation | `Stakeholder`, `Driver`, `Assessment`, `Goal`, `Outcome`, `Principle`, `Requirement`, `Meaning`, `Value` |
| Strategy | Active Structure | `Resource` |
| Strategy | Behavior | `Capability`, `ValueStream`, `CourseOfAction` |
| Business | Active Structure | `BusinessActor`, `BusinessInterface` |
| Business | Passive Structure | `BusinessObject` |
| Business | Composite | `Product` |
| Application | Active Structure | `ApplicationComponent`, `ApplicationInterface` |
| Application | Passive Structure | `DataObject` |
| Technology | Active Structure | `Node`, `TechnologyInterface`, `Device`, `SystemSoftware`, `Equipment`, `Facility`, `CommunicationNetwork`, `DistributionNetwork` |
| Technology | Passive Structure | `Artifact`, `Material` |
| Implementation and Migration | Behavior | `WorkPackage` |
| Implementation and Migration | Passive Structure | `Deliverable` |
| Implementation and Migration | Composite | `Plateau` |

Implementation notes:

- There is no generic `Interface` element in the ArchiMate 4 element catalog.
- `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` remain domain-specific
  elements and must not be migrated to a generic `Interface`.
- `Path` is a Common Domain active structure element.
- `Grouping` and `Location` are Common Domain composite elements.
- `Stakeholder` must use a cylinder renderer pictogram in ArchiMate 4 mode, not the
  Business Actor or actor/person pictogram fallback.
- `Driver` must use a wheel-shaped renderer pictogram in ArchiMate 4 mode, not the generic object
  pictogram fallback.
- `Assessment` must use a magnifying-glass renderer pictogram in ArchiMate 4 mode, not the generic
  object pictogram fallback.
- `Goal` must use a target/bullseye renderer pictogram in ArchiMate 4 mode, not the generic object
  pictogram fallback.
- `Outcome` must use a target/bullseye-with-arrow renderer pictogram in ArchiMate 4 mode, not the
  generic object pictogram fallback.
- `Principle` must use a rounded-square exclamation renderer pictogram in ArchiMate 4 mode, not the
  generic object pictogram fallback.
- `Requirement` must use a parallelogram renderer pictogram in ArchiMate 4 mode, not the generic
  object pictogram fallback.
- `Value` must use an oval renderer pictogram in ArchiMate 4 mode, not the generic object pictogram
  fallback.
- `Meaning` must use a thought-cloud renderer pictogram in ArchiMate 4 mode, not the generic object
  pictogram fallback.
- `Location` must use a location-pin renderer pictogram in ArchiMate 4 mode, not the legacy generic
  object pictogram fallback.
- `DistributionNetwork` must use a bidirectional-arrow renderer pictogram in ArchiMate 4 mode, not
  the `CommunicationNetwork` node-link pictogram fallback.
- `Material` must use a hexagonal renderer pictogram in ArchiMate 4 mode, not the `Artifact`
  document pictogram fallback.
- `Facility` must use a factory-shaped renderer pictogram in ArchiMate 4 mode, not the `Node`
  cube pictogram fallback.
- `Equipment` must use a gear-shaped renderer pictogram in ArchiMate 4 mode, not the `Device`
  monitor pictogram fallback.
- `WorkPackage` must use a loop-arrow renderer pictogram in ArchiMate 4 mode, not the `Process`
  horizontal arrow pictogram fallback.
- `Deliverable` must use a wavy-bottom document renderer pictogram in ArchiMate 4 mode, not the
  generic object pictogram fallback.
- `Plateau` must use a stacked-bars renderer pictogram in ArchiMate 4 mode, not the `Product`
  folder pictogram fallback.
- `Grouping` must use a dashed-rectangle renderer pictogram in ArchiMate 4 mode, not the generic
  object pictogram fallback.
- `sourceCoverage.appendixAArtworkRights` must keep the difference between locally-authored renderer
  paths and exact Appendix A vector artwork explicit. The latest local pictogram audit is recorded in
  `project_memory/runlogs/20260709-1189-appendix-a-artwork-rights-pictogram-audit.json`; local
  dedicated path coverage is complete, no profile pictogram is implemented as a `PICTO_OBJECT` alias,
  and exact Appendix A artwork redistribution rights remain unconfirmed.
- In ArchiMate 4 mode, the renderer must draw `Grouping` as a dashed, unfilled outline. ArchiMate
  3.x rendering remains unchanged, and exact Appendix A vector artwork remains outside the repository
  until the source and redistribution boundary is resolved.
- In ArchiMate 4 mode, Motivation elements must draw with clipped/chamfered body corners matching
  the Appendix A notation summary. ArchiMate 3.x rendering remains unchanged.
- Standard display labels preserve source casing, including `Course of Action`.

## Relationships And Junctions

ArchiMate 4 relationship types are:

- Structural: `Composition`, `Aggregation`, `Assignment`, `Realization`
- Dependency: `Serving`, `Access`, `Influence`
- Dynamic: `Triggering`, `Flow`
- Other: `Association`, `Specialization`

Junction requirements:

- The ArchiMate 4 language defines `Junction` as a connector between relationships, not as a normal
  relationship.
- A junction connects two or more relationships of the same relationship type.
- A chain through a junction is only valid when a direct relationship of the same type would be valid
  between the endpoint concepts.
- Junctions may represent and-semantics or or-semantics. The modeler may name a junction to make
  inclusive/exclusive choice intent clearer.
- `Grouping`, `Location`, and `Plateau` may aggregate relationship concepts, including relationships
  and junctions.
- Multiplicity must not be applied to a relationship end connected to a junction.

Implementation note:

- ArchiMate 3.1 MEFF exposes `AndJunction` and `OrJunction` element type values. ArchiMate 4 C260
  describes the modeling concept as `Junction`; the exact MEFF 4.0 exchange representation must be
  confirmed from the official MEFF 4.0 XSD before changing XML serialization.
- The editor exposes `AndJunction` and `OrJunction` as relationship connector metadata outside the
  42-element ArchiMate 4 catalog until the MEFF 4.0 exchange representation is confirmed.
- Relationship connectors are not part of the ArchiMate 4 domain catalog. Runtime metadata uses
  `paletteGroup` and `colorGroup` for editor grouping and color fallback instead of assigning a
  domain.
- In ArchiMate 4 mode, `AndJunction` renders as a filled dot and `OrJunction` renders as an unfilled
  ring. ArchiMate 3.x keeps the legacy `AND` or `OR` text marker, and an optional
  modeler-supplied junction name renders below the connector.
- Relationship popup labels use the C260 direct/reverse relationship role names while retaining the
  underlying relationship type for replacement and persistence.
- Relationship option attributes are preserved separately from the relationship type. Imported and
  edited `Access`, `Association`, and `Influence` relationships use explicit `accessType`,
  `isDirected`, and `modifier` properties while retaining legacy `typeOption` compatibility.
- Access relationship editing must expose every supported access type as an explicit action:
  unspecified/`None`, `Read`, `Write`, and `ReadWrite`. `None` is a first-class popup action, not only
  a side effect of toggling a selected marker off.
- Association relationship editing must expose undirected and directed notation as explicit actions,
  with directed state stored in `isDirected`.
- Influence relationships can carry a modeler-defined sign or strength modifier. The implementation
  preserves arbitrary modifier values, renders them near the connection, and offers common positive
  and negative modifier actions plus a custom modifier input in the ArchiMate 4 popup. Empty custom
  input clears the modifier.
- Derived relationship rules are available as host-callable utilities. DR1 derives `Specialization`
  from a two-step `Specialization` chain. DR2 derives the weakest structural relationship from a
  two-step structural chain, using the order Realization, Assignment, Aggregation, Composition from
  weakest to strongest. DR3-DR8 cover the valid dependency and dynamic derivations that can be
  derived without embedding the full Appendix B matrix, including same-target opposite-direction
  derivations for dependency relationships and Flow. `deriveRelationshipChain()` applies the valid
  in-line rules transitively over ordered relationship chains and preserves the source relationship ids
  plus pairwise rule labels. PDR1-PDR12 are exposed through `derivePotentialRelationship()` as
  `potential: true` candidates; PDR12 requires an external relationship validator before a candidate
  is returned. The utilities return candidates and do not automatically mutate the model.
- When an ArchiMate 4 profile with endpoint domain and aspect metadata is supplied, derivation
  candidates are filtered through the C260 Appendix B.4 restrictions. The guard covers cross-domain
  Motivation, Strategy, Core, Implementation and Migration, Relationship-domain endpoints, passive
  structure endpoints, Access targets, Influence targets, and the joined third-element restrictions.
- The ArchiMate 4 moddle descriptor must allow relationship concepts as relationship endpoints and
  relationship view elements as diagram connection endpoints. It does this with abstract endpoint
  constraints: `Concept` for `Relationship.source` / `Relationship.target`, and `ViewElement` for
  `Connection.source` / `Connection.target`. The ArchiMate 3 descriptor keeps the existing narrower
  constraints.

## Multiplicity

ArchiMate 4 adds multiplicity attributes on relationship ends.

Allowed notation for a relationship end:

- A positive integer `n`, meaning exactly `n`.
- `*`, equivalent to `0..*`.
- `n..m`, where `n` and `m` are non-negative integers and `m > n`.

Implementation requirements:

- Store multiplicity separately for the source end and target end.
- Render multiplicity labels near the relationship ends.
- The ArchiMate 4 relationship popup must allow editing the full supported notation, not only fixed
  quick values. Empty input clears the end multiplicity; invalid input leaves the relationship
  unchanged.
- Reject or ignore multiplicity on any end connected to a junction.
- Normalize `0..*` to canonical `*` because C260 defines `*` as the zero-to-unbounded end.
- Reject or ignore multiplicity strings outside the allowed notation above.
- Do not assume `1..*` is valid unless MEFF 4.0 or another normative source confirms it.

## ArchiMate 3.2 To 4.0 Migration Rules

Removed elements:

- `BusinessInteraction`
- `ApplicationInteraction`
- `TechnologyInteraction`
- `Constraint`
- `Contract`
- `Gap`
- `Representation`

Replacement guidance:

- `Constraint` -> specialization of `Requirement`.
- `Contract` -> specialization of `BusinessObject`.
- `Gap` -> specialization of `Assessment` or `Deliverable`.
- `Representation` -> specialization of `DataObject`, `Artifact`, or `Material`.
- `BusinessInteraction`, `ApplicationInteraction`, `TechnologyInteraction` -> specialization of
  `Function` or `Process`.
- `ImplementationEvent` -> specialization of `Event`.
- Layer/domain-specific behavior elements -> specialization of the generic counterpart:
  `Service`, `Process`, `Function`, or `Event`.
- `BusinessRole` -> `Role`.
- Business, application, and technology collaborations -> `Collaboration`.
- Migration metadata should preserve the original ArchiMate 3.x domain for merged or moved concepts
  so the old modeling intent remains available after replacement with a common-domain concept.
- ArchiMate 3.x Physical elements `DistributionNetwork`, `Equipment`, `Facility`, and `Material`
  are modeled as Technology Domain elements in ArchiMate 4; migration should preserve `Physical` as
  the original ArchiMate 3.x domain without inventing a specialization.

Do not migrate:

- `BusinessInterface`
- `ApplicationInterface`
- `TechnologyInterface`

Relationship migration guidance:

- If a 3.2 relationship is no longer allowed by Appendix B, replace it with `Association` unless a more
  specific replacement is stated below.
- Aggregation from `Path` to a technology internal active structure element should be replaced by a
  realization from the active structure element to `Path`.
- Realization between services of different former layers may be replaced by specialization or
  aggregation depending on modeling intent.
- Because the Appendix B matrix is not embedded in this repository, relationship migration validation
  is driven by a host-supplied relationship validator. When supplied, it checks the migrated endpoint
  types and can replace invalid relationships with `Association` while recording a warning.

## Relationship Matrix Requirement

Appendix B is normative for allowed relationships. The current compatibility-derived relationship
fallback in `lib/metamodel/languages/archimate4-relationships.js` is insufficient for final ArchiMate 4
conformance.

`archimate4-profile.json` records the current Appendix B source-coverage boundary. The local C260
source has been reviewed for implementation needs, but `localSourcePresent: false` means the
redistributable Appendix B relationship profile artifact is absent. The implemented code path is the
external profile loader plus `getArchimate4RelationshipProfileStatus()` and
`getArchimate4RelationshipProfileCoverageReport()`.

Required implementation direction:

- Load a dedicated official ArchiMate 4 relationship profile from Appendix B through
  `setArchimate4RelationshipProfile(profile)` or the `archimate4RelationshipProfile` constructor
  option, or replace the fallback with derived non-verbatim data after redistribution rights are
  confirmed.
- Do not commit a verbatim copy of the licensed Appendix B tables unless redistribution rights are
  explicitly confirmed.
- Keep tests focused on derived facts: no retired elements in source/target sets, interfaces preserved,
  junction restrictions, and matrix replacement point behavior.

External profile contract:

- Accepted shapes are a nested object, a `Map` of source-to-target maps, row arrays, header-row matrix
  arrays, `{ matrixText }` CSV/TSV text, or a JSON string containing one of those structures.
- Source and target concept types must be members of the C260-derived concept set: the 42-element
  catalog, the exposed relationship connectors, or the ArchiMate relationship types.
- Relationship values may use the local one-letter codes (`s`, `c`, `g`, `i`, `r`, `v`, `a`, `n`, `t`,
  `f`, `o`) or relationship names.
- The default public loader requires source coverage for every ArchiMate 4 concept accepted by the
  external profile contract; sources with no outgoing relationships must still be represented with an
  empty target map.
- The default public loader also requires complete target-cell coverage for each source. A cell with no
  allowed relationship must be explicitly present as empty data so accidental omissions are caught.
- `getArchimate4RelationshipProfileStatus()` must expose whether the active relationship profile is
  still the compatibility fallback or an external profile loaded with complete source and target-cell
  validation.
- Profile status must report the actual explicit `targetCellCount` as well as
  `expectedTargetCellCount`, so hosts can distinguish a complete Appendix B table with blank cells
  from a sparse profile that only contains allowed relationships.
- Profile status must also report missing source and target-cell counts. Detailed missing source rows
  and source-target cells are available through `getArchimate4RelationshipProfileCoverageReport()` so
  a host can audit a licensed Appendix B transcription without this repository embedding the table.
- Profile status must expose optional scalar `sourceMetadata` for host-controlled source ids, version,
  URI, hash, generation time, and supplier values while ignoring nested metadata, so a loaded
  licensed Appendix B artifact remains auditable without copying table text into status output.
- Profile status must expose `sourceScope` so hosts can distinguish the compatibility fallback,
  process-wide profiles set through `setArchimate4RelationshipProfile(profile)`, and profiles supplied
  for a specific viewer/modeler constructor.
- A later ArchiMate 4 viewer/modeler constructed without `archimate4RelationshipProfile` must reset a
  previous constructor-scoped profile to the compatibility fallback, while preserving an explicitly
  process-wide profile.
- Unknown elements such as generic `Interface` or retired 3.x concepts must be rejected.

## XML And MEFF Requirements

The editor can expose ArchiMate 4 modeling semantics before MEFF 4.0 is confirmed, but XML export
must stay marked experimental until the official exchange schema is available. The local 3.x and
4.0 descriptors are internally round-trip tested through read/write/read XML coverage; this is not an
official MEFF 4.0 conformance claim.

Open decisions:

- ArchiMate 4 namespace and schema location.
- MEFF 4.0 element type for `Junction` versus `AndJunction` / `OrJunction`.
- MEFF 4.0 attribute names for relationship-end multiplicity.
- Whether relationship matrix data can be redistributed in source form.

Latest official XSD recheck:

- On 2026-07-08T19:30:52+09:00, the official ArchiMate XSD directory returned 200 and listed only
  `3.1/archimate3_Diagram.xsd`, `3.1/archimate3_Model.xsd`, and `3.1/archimate3_View.xsd` as XSD
  links; no `archimate4` or `4.0` XSD links were listed.
- The current recheck is recorded in
  `project_memory/runlogs/20260708-330-official-xsd-directory-recheck.txt`. Keep XML export
  experimental until this changes or a supplied official XSD is available.
- On 2026-07-08T20:15:00+09:00, the same official directory was rechecked and again listed only the
  3.1 Model, Diagram, and View XSD links. The refreshed runlog is
  `project_memory/runlogs/20260708-363-official-xsd-directory-recheck.txt`.
- On 2026-07-09, the same official directory was rechecked again and still listed only 3.1 XSD links;
  tested 4.0 directory and Model/Diagram/View XSD candidate URLs returned 404. The refreshed runlog is
  `project_memory/runlogs/20260709-039-official-xsd-directory-recheck.txt`.
- On 2026-07-09, the current official directory evidence was refreshed again in
  `project_memory/runlogs/20260709-606-meff4-xsd-current-recheck.txt`. The directory returned 200 and
  listed the 3.1 Model, View, and Diagram XSD links. Tested 4.0 directory and Model/Diagram/View XSD
  candidate URLs returned 404. The ArchiMate 4 implementation status records this evidence in
  `sourceCoverage.meff4Xsd`.
- On 2026-07-09, the current official directory evidence was refreshed again in
  `project_memory/runlogs/20260709-731-meff4-xsd-latest-recheck.txt`. The directory returned 200 and
  still listed only the 3.1 Model, View, and Diagram XSD links. Tested 4.0 directory,
  Model/Diagram/View XSD, `archimate4.xsd`, and `archimate4_ModelExchangeFile.xsd` candidate URLs
  returned 404. The ArchiMate 4 implementation status now records this latest evidence in
  `sourceCoverage.meff4Xsd`.
- On 2026-07-09T15:09:21+09:00, the official directory evidence was refreshed again in
  `project_memory/runlogs/20260709-1167-meff4-xsd-continuation-recheck.json`. The directory returned
  200 and still listed only the 3.1 Diagram, Model, and View XSD links. Tested 4.0 directory,
  Model/Diagram/View XSD, `archimate4.xsd`, and `archimate4_ModelExchangeFile.xsd` candidate URLs
  returned 404, while the 3.1 Model XSD baseline returned 200. The ArchiMate 4 implementation status
  recorded this evidence in `sourceCoverage.meff4Xsd`.
- On 2026-07-09T17:28:55+09:00, the official directory evidence was refreshed again in
  `project_memory/runlogs/20260709-1343-external-source-continuation-recheck.json`. The directory
  returned 200 and still listed only the 3.1 Diagram, Model, and View XSD links. Tested 4.0
  directory, `archimate4_*`, `archimate4.xsd`, `archimate4_ModelExchangeFile.xsd`, and `archimate_*`
  candidate URLs returned 404, while the 3.1 Model XSD baseline returned 200. The ArchiMate 4
  implementation status recorded this evidence in `sourceCoverage.meff4Xsd`.
- On 2026-07-09T20:12:26+09:00, the official directory evidence was refreshed again in
  `project_memory/runlogs/20260709-201226-external-source-current-recheck.json`. The directory
  returned 200 and still listed only the 3.1 Diagram, Model, and View XSD links. Tested 4.0
  directory, `archimate4_*`, `archimate4.xsd`, `archimate4_ModelExchangeFile.xsd`, and `archimate_*`
  candidate URLs returned 404, while the 3.1 Model XSD baseline returned 200. The ArchiMate 4
  implementation status records this latest evidence in `sourceCoverage.meff4Xsd`.

## Implementation Status And Remaining Gaps

The `archimate4-profile.json` element catalog must remain aligned with the 42-element catalog above.
In particular:

- Generic `Interface` must not be exposed as an ArchiMate 4 element.
- `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` must remain available.
- Migration must preserve those three interface types.
- Tests must assert the official 42-element catalog.
- `AndJunction` and `OrJunction` must remain available as relationship connectors without being counted
  as ArchiMate 4 elements.
- `getArchimate4ImplementationStatus()` must report the implemented catalog, active relationship
  profile status, experimental exchange-format boundary, icon coverage boundary, generic object alias
  count, conformance readiness, and external blockers so callers do not mistake compatibility fallback
  support for complete official conformance.
- `getArchimate4ImplementationStatus().elementCatalog` must expose `expectedTypes`, `actualTypes`,
  `missingTypes`, and `extraTypes` so exact C260 catalog drift is visible even if the element count is
  still 42.
- `getArchimate4ImplementationStatus().relationshipConnectors` must expose `expectedTypes`,
  `actualTypes`, `missingTypes`, and `extraTypes` for `AndJunction` and `OrJunction` outside the
  42-element catalog while MEFF 4.0 connector serialization remains source-dependent.

The relationship rules remain a fallback:

- Replace compatibility-derived maps with an official Appendix B profile or external licensed data
  loader.
- Confirm XML serialization details after MEFF 4.0 XSD is available.

Implemented relationship rule wiring:

- Popup relationship choices and reconnect validation both read allowed relationships through the active
  language profile.
- When an external ArchiMate 4 relationship profile is loaded, `connection.reconnect` checks use that
  profile instead of the legacy ArchiMate 3.x relationship map.
- Popup relationship choices and reconnect validation now restrict junction-connected relationships to
  the same relationship type when the junction already has an established relationship type.
- If a junction already has conflicting relationship types, no further junction relationship type is
  offered until the model is corrected.
- When a candidate relationship is connected to a junction and the opposite side already has a
  non-junction endpoint, the editor checks whether the same relationship type is valid directly
  between those endpoint concepts through the active relationship profile.
- Influence relationship modifiers are rendered from `modifier` or `typeOption`, and the ArchiMate 4
  popup can set common positive or negative influence values or a custom modeler-defined sign/strength
  value.
- Access relationship options are rendered from `accessType` or legacy `typeOption`, and the popup
  now presents explicit `None`, `Read`, `Write`, and `ReadWrite` actions while preserving the same
  relationship type value.
- Association direction is rendered from `isDirected` or legacy `typeOption`, and the popup now
  presents explicit undirected and directed actions instead of a single toggle.
- `deriveRelationshipType()` and `deriveRelationship()` implement C260-derived DR1-DR8 valid
  derivations for host tooling. `deriveRelationshipChain()` folds ordered in-line valid derivation
  chains. `derivePotentialRelationship()` implements PDR1-PDR12 as explicit potential candidates.
  With an ArchiMate 4 profile, derived and potential candidates are rejected when C260 Appendix B.4
  forbids the derived source, target, relationship type, or joined third element. Automatic model
  mutation remains out of the core editor.

Implemented multiplicity guard:

- Relationship-end multiplicity is suppressed for connections whose source or target is `AndJunction`
  or `OrJunction`.
- Relationship-end multiplicity is normalized to the C260-derived notation subset: positive integer,
  `*`, `0..*` canonicalized to `*`, or finite `n..m` ranges where `m > n`.
- Values outside that subset, including `1..*` and other non-zero unbounded ranges, are ignored until
  a normative source confirms an expanded notation.
- The popup exposes source and target custom multiplicity input actions in ArchiMate 4 mode. Those
  actions use the same central validator as import hydration, replacement, persistence, and rendering.
- The guard applies during popup-menu editing, relationship replacement, model persistence, import
  attribute hydration, and rendering.

Implemented migration guard:

- `Representation` migration defaults to `DataObject` and reports `Artifact` and `Material` as
  alternative replacement types.
- `Gap` migration defaults to `Assessment` and reports `Deliverable` as an alternative replacement
  type.
- Business, application, and technology interaction migrations default to `Process` and report
  `Function` as an alternative replacement type.
- `ImplementationEvent` migration preserves the original type as specialization metadata when
  migrating to `Event`.
- Migrated specialization metadata is stored both as direct runtime fields and as model `Properties`
  backed by `PropertyDefinition` entries, preserving the original ArchiMate 3 type and original domain
  through the existing exchange-format extension mechanism.
- `Path` to technology-internal-active-structure `Aggregation` relationships are migrated to reversed
  `Realization` relationships, with an explicit relationship warning.
- `Realization` between `Service` concepts that came from different ArchiMate 3 domains is preserved
  but reported with `Specialization` and `Aggregation` as model-dependent alternatives.
- Migration coverage is checked dynamically against the current profiles: every ArchiMate 3 profile
  element type absent from the ArchiMate 4 element/connector catalog must have an explicit migration
  row, and every default or alternative replacement must resolve to an ArchiMate 4 profile type.
- Migrated relationship types can be checked through an externally supplied Appendix B-aware validator.
  Invalid relationships are warned and, by default, replaced with `Association`.

Implemented relationship-concept aggregation guard:

- In ArchiMate 4 mode, `Grouping`, `Location`, and `Plateau` can create or keep `Aggregation`
  relationships to relationship concepts, including relationship connections and `AndJunction` /
  `OrJunction`.
- The helper is intentionally narrower than the full Appendix B.6 table because the complete
  relationship table is still supplied externally.

Implemented demo notation guard:

- `demo/viewer.html` and `demo/editor.html` load an ArchiMate 4 sample that visibly uses Common
  Domain `Role`, `Service`, `Path`, and `Grouping` elements rather than ArchiMate 3.x
  layer-specific equivalents.
- `assets/palette-icons.css` maps the ArchiMate 4 Common Domain palette entries to dedicated
  Common-colored `common_*.svg` assets. The test suite prevents these entries from regressing to
  old Business or Technology colored palette assets.

## Source Trace

- C260 Chapter 1: conformance requirements.
- C260 Chapter 3: domains, aspects, colors, and notation cues.
- C260 Chapter 4: Common Domain.
- C260 Chapter 5: relationships, junctions, multiplicity.
- C260 Chapters 6-12: domain element summaries.
- C260 Appendix A: notation summary.
- C260 Appendix B: normative relationship rules and tables.
- C260 Appendix E: changes from ArchiMate 3.2 to ArchiMate 4.
- Launch transcript: corroborates simplification from 60 to 42 concepts, domain terminology,
  behavior consolidation, retired concepts, and multiplicity as the main new feature.

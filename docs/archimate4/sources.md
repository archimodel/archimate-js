# ArchiMate 4 Source Ledger

## Required Sources

- ArchiMate 4 Specification, The Open Group, Document C260, April 2026.
- The Motivation for Changes in the ArchiMate 4 Specification, The Open Group White Paper W262, April 2026.
- The Open Group ArchiMate Model Exchange File Format page and any ArchiMate 4 XSD available under `https://www.opengroup.org/xsd/archimate/`.
- ArchiMate 4 launch transcript supplied by the user.

## Source Access Decision

- C260 is now present locally as `C:\Users\syska\Downloads\978940181474E.pdf` and was reviewed on
  2026-07-08.
- The C260 conformance shall/may source scan is recorded in
  `project_memory/runlogs/20260709-188-c260-conformance-shall-scan.txt`.
- The supplied launch transcript is present locally at
  `C:\Users\syska\.codex\attachments\eab35e75-10d5-4e1d-854e-3cc8feb4496c\pasted-text.txt`.
- C260 is a licensed copyrighted publication; this repository records a derived implementation
  specification and source trace, not copied normative prose or verbatim relationship tables.
- W262 is published by The Open Group as a free PDF download that requires login. The latest
  publication-page and local-source check is recorded in
  `project_memory/runlogs/20260709-1017-external-source-latest-recheck.json`; it detected the W262
  title, free PDF/login markers, 22-page metadata, and 2026-04-27 publication metadata, while the
  recursive filename search under `C:\Users\syska\Downloads` and
  `C:\Users\syska\.codex\attachments` still found no local W262 or ArchiMate 4 motivation PDF
  candidates.
- A local ArchiMate-related PDF inventory is recorded in
  `project_memory/runlogs/20260709-2110-local-archimate-pdf-identification.json`; it identifies the
  local 207-page C260 PDF, C260 samples, and ArchiMate 4 Non-Commercial License files, and confirms no
  W262 candidate among those local PDFs.
- The Open Group licensed-downloads page confirms Version 4 was released in April 2026.
- The Open Group exchange-format page confirms the Model Exchange File Format is the standard interchange format.
- Because any ArchiMate 4 XSD was not available locally, XML conformance remains experimental until the official MEFF 4.0 schema is supplied.
- Because redistribution rights for Appendix B relationship tables are not confirmed, this repository
  does not embed the Appendix B matrix. `setArchimate4RelationshipProfile(profile)` is the replacement
  point for a user-supplied licensed relationship profile or derived non-verbatim implementation data.
- The local C260 source has been reviewed for Appendix B implementation needs, but a redistributable
  Appendix B profile artifact is still not present in this repository.
  `sourceCoverage.appendixBRelationshipMatrix.localSourcePresent` therefore means "redistributable
  profile artifact present", not "licensed C260 source reviewed".
- A sanitized local ArchiMate 4 Non-Commercial License keyword boundary is recorded in
  `project_memory/runlogs/20260709-2125-archimate4-ncl-license-boundary.json`. It does not contain raw
  license text and does not clear the Appendix B redistributable-profile blocker or the Appendix A
  exact-artwork-rights blocker.
- `getArchimate4ImplementationStatus()` exposes the current implementation boundary as machine-readable
  metadata, including implemented areas, experimental MEFF 4 exchange status, and external blockers.
- Node-based audit tooling can import `getArchimate4ImplementationStatus()` directly from
  `lib/metamodel/languages/index.js`; the package root remains the browser and webpack-oriented entry
  point.
- `getArchimate4ImplementationStatus().elementCatalog` reports expected, actual, missing, and extra
  type lists for the C260-derived 42-element catalog, so hosts can audit exact type coverage rather
  than only the element count.
- `getArchimate4ImplementationStatus().relationshipConnectors` reports expected, actual, missing, and
  extra type lists for `AndJunction` and `OrJunction` outside the element catalog.
- `getArchimate4ImplementationStatus()` also exposes `conformanceReadiness`, including
  `officialConformanceClaimable: false`, blocker ids, missing required source ids, and missing
  companion source ids while external sources remain unresolved.
- `getArchimate4ImplementationStatus().conformanceReadiness` reports
  `requiredBeforeClaimByBlocker`, `missingRequiredBeforeClaimBlockerIds`, and
  `extraRequiredBeforeClaimBlockerIds` so each official-claim prerequisite remains tied to an
  external blocker id.
- `getArchimate4ImplementationStatus().remainingGaps` reports `remainingGaps.expectedIds`,
  `remainingGaps.actualIds`, `remainingGaps.missingIds`, `remainingGaps.extraIds`,
  `missingOfficialConformanceGapIds`, and `missingCompanionGapSourceIds` so unresolved official
  conformance blockers and companion-source gaps remain visible in one exact residual gap catalog.
- `getArchimate4ImplementationStatus().sectionCoverage` reports `sectionCoverage.expectedIds`,
  `sectionCoverage.actualIds`, `sectionCoverage.missingIds`, `sectionCoverage.extraIds`,
  `sectionCoverage.statusKeyIds`, `sectionCoverage.missingRequirementReferenceIds`,
  `sectionCoverage.missingExternalBlockerReferenceIds`,
  `sectionCoverage.missingStatusKeyReferenceIds`, `externalDependentIds`, and `optionalIds` so C260
  chapter and appendix coverage remains visible by exact section identity while rejecting
  unregistered conformance requirement, external blocker, or status API key references. The exact
  section list starts at Chapter 1 and includes the Introduction/Conformance and Definitions
  chapters, not only the implementation-heavy language chapters.
- `getArchimate4ImplementationStatus().introductionCoverage` reports
  `introductionCoverage.expectedIds`, `introductionCoverage.actualIds`,
  `introductionCoverage.missingIntroductionIds`, and
  `introductionCoverage.extraIntroductionIds` so the Chapter 1 Introduction/Conformance outline
  remains visible by exact subsection identity.
- `getArchimate4ImplementationStatus().introductionCoverage` also reports
  `introductionCoverage.requirementSourceIds`, `introductionCoverage.referenceOnlyIds`,
  `introductionCoverage.missingRequirementSourceIds`, and
  `introductionCoverage.missingReferenceOnlyIds` so Chapter 1 Conformance remains the requirement
  source while Objective, Overview, Normative References, Terminology, and Future Directions remain
  reference-only status items outside source gaps, remaining gaps, and official conformance blockers.
  The Chapter 1 outline was rechecked from the local C260 PDF in
  `project_memory/runlogs/20260709-192610-c260-chapter1-outline-check.json`.
- `getArchimate4ImplementationStatus().definitionCoverage` reports
  `definitionCoverage.expectedIds`, `definitionCoverage.actualIds`,
  `definitionCoverage.missingDefinitionIds`, and `definitionCoverage.extraDefinitionIds` so the
  Chapter 2 definition vocabulary remains visible by exact term identity without copying the
  definition prose.
- `getArchimate4ImplementationStatus().languageStructureCoverage` reports
  `languageStructureCoverage.expectedIds`, `languageStructureCoverage.actualIds`,
  `languageStructureCoverage.missingLanguageStructureIds`, and
  `languageStructureCoverage.extraLanguageStructureIds` so the Chapter 3 Language Structure outline
  remains visible by exact subsection identity.
- `getArchimate4ImplementationStatus().commonDomainCoverage` reports
  `commonDomainCoverage.expectedIds`, `commonDomainCoverage.actualIds`,
  `commonDomainCoverage.missingCommonDomainIds`, and `commonDomainCoverage.extraCommonDomainIds`
  so the Chapter 4 Common Domain outline remains visible by exact subsection and element-heading
  identity.
- `getArchimate4ImplementationStatus().relationshipsAndJunctionsCoverage` reports
  `relationshipsAndJunctionsCoverage.expectedIds`, `relationshipsAndJunctionsCoverage.actualIds`,
  `relationshipsAndJunctionsCoverage.missingRelationshipsAndJunctionsIds`, and
  `relationshipsAndJunctionsCoverage.extraRelationshipsAndJunctionsIds` so the Chapter 5
  Relationships and Junctions outline remains visible by exact subsection identity while the
  normative Appendix B matrix remains externally supplied.
- `getArchimate4ImplementationStatus().motivationDomainCoverage` reports
  `motivationDomainCoverage.expectedIds`, `motivationDomainCoverage.actualIds`,
  `motivationDomainCoverage.missingMotivationDomainIds`, and
  `motivationDomainCoverage.extraMotivationDomainIds` so the Chapter 6 Motivation Domain outline
  remains visible by exact subsection and element-heading identity.
- `getArchimate4ImplementationStatus().strategyDomainCoverage` reports
  `strategyDomainCoverage.expectedIds`, `strategyDomainCoverage.actualIds`,
  `strategyDomainCoverage.missingStrategyDomainIds`, and
  `strategyDomainCoverage.extraStrategyDomainIds` so the Chapter 7 Strategy Domain outline remains
  visible by exact subsection and element-heading identity.
- `getArchimate4ImplementationStatus().businessDomainCoverage` reports
  `businessDomainCoverage.expectedIds`, `businessDomainCoverage.actualIds`,
  `businessDomainCoverage.missingBusinessDomainIds`, and
  `businessDomainCoverage.extraBusinessDomainIds` so the Chapter 8 Business Domain outline remains
  visible by exact subsection and element-heading identity.
- `getArchimate4ImplementationStatus().applicationDomainCoverage` reports
  `applicationDomainCoverage.expectedIds`, `applicationDomainCoverage.actualIds`,
  `applicationDomainCoverage.missingApplicationDomainIds`, and
  `applicationDomainCoverage.extraApplicationDomainIds` so the Chapter 9 Application Domain outline
  remains visible by exact subsection and element-heading identity.
- `getArchimate4ImplementationStatus().technologyDomainCoverage` reports
  `technologyDomainCoverage.expectedIds`, `technologyDomainCoverage.actualIds`,
  `technologyDomainCoverage.missingTechnologyDomainIds`, and
  `technologyDomainCoverage.extraTechnologyDomainIds` so the Chapter 10 Technology Domain outline
  remains visible by exact subsection and element-heading identity.
- `getArchimate4ImplementationStatus().relationshipsBetweenCoreDomainsCoverage` reports
  `relationshipsBetweenCoreDomainsCoverage.expectedIds`,
  `relationshipsBetweenCoreDomainsCoverage.actualIds`,
  `relationshipsBetweenCoreDomainsCoverage.missingRelationshipsBetweenCoreDomainsIds`, and
  `relationshipsBetweenCoreDomainsCoverage.extraRelationshipsBetweenCoreDomainsIds` so the Chapter
  11 Relationships Between Core Domains outline remains visible by exact subsection identity.
- `getArchimate4ImplementationStatus().implementationAndMigrationDomainCoverage` reports
  `implementationAndMigrationDomainCoverage.expectedIds`,
  `implementationAndMigrationDomainCoverage.actualIds`,
  `implementationAndMigrationDomainCoverage.missingImplementationAndMigrationDomainIds`, and
  `implementationAndMigrationDomainCoverage.extraImplementationAndMigrationDomainIds` so the
  Chapter 12 Implementation and Migration Domain outline remains visible by exact subsection and
  element-heading identity.
- `getArchimate4ImplementationStatus().stakeholdersArchitectureViewsViewpointsCoverage` reports
  `stakeholdersArchitectureViewsViewpointsCoverage.expectedIds`,
  `stakeholdersArchitectureViewsViewpointsCoverage.actualIds`,
  `stakeholdersArchitectureViewsViewpointsCoverage.missingStakeholdersArchitectureViewsViewpointsIds`,
  and `stakeholdersArchitectureViewsViewpointsCoverage.extraStakeholdersArchitectureViewsViewpointsIds`
  so the Chapter 13 Stakeholders, Architecture Views, and Viewpoints outline remains visible by
  exact subsection identity.
- `getArchimate4ImplementationStatus().languageCustomizationMechanismsCoverage` reports
  `languageCustomizationMechanismsCoverage.expectedIds`,
  `languageCustomizationMechanismsCoverage.actualIds`,
  `languageCustomizationMechanismsCoverage.missingLanguageCustomizationMechanismsIds`, and
  `languageCustomizationMechanismsCoverage.extraLanguageCustomizationMechanismsIds` so the Chapter
  14 Language Customization Mechanisms outline remains visible by exact subsection identity.
- `getArchimate4ImplementationStatus().appendixANotationCoverage` reports
  `appendixANotationCoverage.expectedIds`, `appendixANotationCoverage.actualIds`,
  `appendixANotationCoverage.missingAppendixANotationIds`, and
  `appendixANotationCoverage.extraAppendixANotationIds` so the Appendix A Summary of Language
  Notation outline remains visible by exact subsection identity while exact artwork rights remain
  externally source-dependent.
- `getArchimate4ImplementationStatus().appendixBRelationshipsCoverage` reports
  `appendixBRelationshipsCoverage.expectedIds`, `appendixBRelationshipsCoverage.actualIds`,
  `appendixBRelationshipsCoverage.missingAppendixBRelationshipsIds`, and
  `appendixBRelationshipsCoverage.extraAppendixBRelationshipsIds` so the Appendix B Relationships
  outline remains visible by exact subsection identity while relationship table data remains
  externally supplied.
- `getArchimate4ImplementationStatus().appendixCExampleViewpointsCoverage` reports
  `appendixCExampleViewpointsCoverage.expectedIds`,
  `appendixCExampleViewpointsCoverage.actualIds`,
  `appendixCExampleViewpointsCoverage.missingAppendixCExampleViewpointsIds`, and
  `appendixCExampleViewpointsCoverage.extraAppendixCExampleViewpointsIds` so the Appendix C Example
  Viewpoints outline remains visible by exact subsection identity.
- `getArchimate4ExampleViewpointCatalog()` exposes those Appendix C outline headings as an
  informative-reference catalog grouped by C260 Appendix C subsection. It intentionally does not
  bundle full viewpoint definitions, allowed-element filters, or normative relationship constraints.
- `getArchimate4ImplementationStatus().appendixDStandardsGuidanceCoverage` reports
  `appendixDStandardsGuidanceCoverage.expectedIds`,
  `appendixDStandardsGuidanceCoverage.actualIds`,
  `appendixDStandardsGuidanceCoverage.missingAppendixDStandardsGuidanceIds`, and
  `appendixDStandardsGuidanceCoverage.extraAppendixDStandardsGuidanceIds` so the Appendix D
  Relationship to Other Standards, Specifications, and Guidance Documents outline remains visible by
  exact subsection identity.
- The same status reports `appendixDStandardsGuidanceCoverage.referenceOnlyIds` and
  `appendixDStandardsGuidanceCoverage.missingReferenceOnlyIds` so Appendix D related-standard and
  guidance references remain visible without becoming source coverage entries, remaining gaps,
  readiness blockers, or official conformance blockers. The Appendix D reference boundary was
  rechecked from the local C260 PDF in
  `project_memory/runlogs/20260709-1944-c260-appendix-d-reference-boundary-check.json`.
- `getArchimate4ImplementationStatus().appendixEVersionChangesCoverage` reports
  `appendixEVersionChangesCoverage.expectedIds`,
  `appendixEVersionChangesCoverage.actualIds`,
  `appendixEVersionChangesCoverage.missingAppendixEVersionChangesIds`, and
  `appendixEVersionChangesCoverage.extraAppendixEVersionChangesIds` so the Appendix E version-change
  outline remains visible by exact subsection identity.
- The same status reports `appendixEVersionChangesCoverage.historicalReferenceIds`,
  `appendixEVersionChangesCoverage.migrationSourceIds`,
  `appendixEVersionChangesCoverage.missingHistoricalReferenceIds`, and
  `appendixEVersionChangesCoverage.missingMigrationSourceIds` so E.1-E.3 remain historical references
  while E.4 is the ArchiMate 4 migration source boundary, with neither classification becoming an
  external source gap, remaining gap, readiness blocker, or official conformance blocker. The Appendix
  E boundary was rechecked from the local C260 PDF in
  `project_memory/runlogs/20260709-2037-c260-appendix-e-version-change-boundary-check.json`.
- `getArchimate4ImplementationStatus().appendixFAcronymsCoverage` reports
  `appendixFAcronymsCoverage.expectedIds`,
  `appendixFAcronymsCoverage.actualIds`,
  `appendixFAcronymsCoverage.missingAppendixFAcronymIds`, and
  `appendixFAcronymsCoverage.extraAppendixFAcronymIds` so the Appendix F acronym tokens remain
  visible by exact identity without copying acronym expansions or Appendix F prose.
- The same status reports `appendixFAcronymsCoverage.vocabularyOnlyIds` and
  `appendixFAcronymsCoverage.missingVocabularyOnlyIds` so Appendix F acronym tokens remain
  vocabulary-only coverage rather than language sections, source coverage entries, remaining gaps,
  readiness blockers, or official conformance blockers. The Appendix F vocabulary boundary was
  rechecked from the local C260 PDF in
  `project_memory/runlogs/20260709-2018-c260-appendix-f-vocabulary-boundary-check.json`.
- `getArchimate4ImplementationStatus().documentArtifactCoverage` reports
  `documentArtifactCoverage.expectedIds`,
  `documentArtifactCoverage.actualIds`,
  `documentArtifactCoverage.missingDocumentArtifactIds`,
  `documentArtifactCoverage.extraDocumentArtifactIds`, `documentArtifactCoverage.nonImplementationIds`,
  and `documentArtifactCoverage.missingNonImplementationIds` so C260 front matter and Index outline
  artifacts remain visible as non-implementation document artifacts rather than ArchiMate language
  sections, source gaps, remaining gaps, or official conformance blockers. The document-artifact
  boundary was rechecked from the local C260 PDF in
  `project_memory/runlogs/20260709-1948-c260-document-artifact-boundary-check.json`.
- `getArchimate4ImplementationStatus().c260CoverageAggregate` reports
  `c260CoverageAggregate.expectedCoverageIds`,
  `c260CoverageAggregate.incompleteCoverageIds`,
  `c260CoverageAggregate.rawDuplicateIds`, and
  `c260CoverageAggregate.qualifiedDuplicateCount` so all C260 coverage groups can be audited
  together while repeated raw heading ids remain visible and qualified coverage ids stay unique.
- `getArchimate4ImplementationStatus().c260SourceAlignment` reports
  `c260SourceAlignment.outlineSourceItemCount`,
  `c260SourceAlignment.outlineCoveredItemCount`,
  `c260SourceAlignment.nonOutlineDerivedCoverageIds`, and
  `c260SourceAlignment.aggregateItemCountDelta` so the 253-entry C260 PDF outline source remains
  reconciled with the aggregate 284-item coverage total through the 31 Appendix F derived acronym
  tokens.
- `getArchimate4ImplementationStatus().c260SourceAlignment` also reports
  `c260SourceAlignment.expectedOutlineCoverageCounts`,
  `c260SourceAlignment.actualOutlineCoverageCounts`, and
  `c260SourceAlignment.outlineCoverageCountDeltas` so each PDF-outline-derived coverage group is
  checked against its assigned source count rather than only the aggregate total.
- `getArchimate4ImplementationStatus().c260CoverageSourceEvidence` reports
  `c260CoverageSourceEvidence.coverageSourceRunlogPaths`,
  `c260CoverageSourceEvidence.missingSourceRunlogCoverageIds`, and
  `c260CoverageSourceEvidence.sourceRunlogPathDeltas` so each C260 coverage group remains tied to a
  recorded source-extraction runlog.
- `getArchimate4ImplementationStatus().implementationCompletion` reports
  `implementationCompletion.topKeys`, `implementationCompletion.completeSummaryCount`,
  `implementationCompletion.incompleteSummaryCount`, and
  `implementationCompletion.incompleteSummaryPaths` so the API exposes its own completion scan.
- `getArchimate4ImplementationStatus().modelValidation` reports `modelValidation.expectedCheckIds`,
  `modelValidation.actualCheckIds`, `modelValidation.missingCheckIds`, and
  `modelValidation.extraCheckIds` so model-level validation coverage remains auditable without
  embedding the Appendix B relationship matrix.
- `getArchimate4ImplementationStatus().exampleViewpointCatalog` reports the Appendix C informative
  reference catalog with expected/actual group and viewpoint counts, while keeping bundled viewpoint
  definitions and normative relationship constraints explicitly false.
- `scripts/audit_archimate4_completion.mjs` maps the current
  `getArchimate4ImplementationStatus()` output to the plan's M0-M5 milestones, verifies referenced
  runlog paths resolve, and leaves official conformance unclaimable while the external source and
  rights blockers remain present.
- `scripts/audit_archimate4_c260_coverage.mjs` verifies the C260 book-derived coverage ledger
  independently from the milestone audit. It checks the 20 section groups, 22 tracked coverage
  groups, 284 aggregate coverage items, the 253-entry PDF outline assignment, the 31 Appendix F
  derived acronym tokens, and the recorded source-extraction runlogs while preserving the external
  Appendix B matrix, MEFF 4.0 XSD, Appendix A artwork-rights, and W262 boundaries.
- The current implementation-status completion API scan is recorded in
  `project_memory/runlogs/20260709-1080-status-completion-api-scan.json`; it records 49 top-level
  status keys, 40 `complete` summaries, no incomplete summaries, and the section coverage
  status-key guard arrays including `exampleViewpointCatalog`. The companion stderr log is empty so
  the runlog can be parsed by audit tooling without warning-text cleanup.
- `getArchimate4ImplementationStatus().externalBlockerCatalog` reports
  `externalBlockerCatalog.expectedIds`, `externalBlockerCatalog.actualIds`,
  `externalBlockerCatalog.missingIds`, and `externalBlockerCatalog.extraIds` so readiness,
  requirement, and source-coverage blocker ids remain aligned.
- C260 conformance requirements are represented per shall/may clause in the ArchiMate 4 profile
  metadata so required, optional, implemented, and externally blocked support can be audited without
  treating fallback data as final conformance.
- `getArchimate4ImplementationStatus().conformanceRequirements` reports expected, actual, missing,
  and extra requirement ids for the C260-derived shall/may requirement map.
- `getArchimate4ImplementationStatus().conformanceRequirements.may.notBundled` records the optional
  Appendix C example viewpoint support as not bundled and informative, while keeping it out of
  `remainingGaps`, `conformanceReadiness.blockers`, and `sourceCoverage`.
- `getArchimate4ImplementationStatus()` also exposes source coverage metadata so local source
  evidence, externally supplied normative data, and missing companion sources are distinguishable.
- `getArchimate4ImplementationStatus().sourceCoverage` reports `sourceCoverage.expectedSourceIds`,
  `sourceCoverage.actualSourceIds`, `sourceCoverage.missingSourceIds`, and
  `sourceCoverage.extraSourceIds` so a count-preserving but wrong source ledger cannot appear
  complete.

## Current Public Release Notes Captured

- ArchiMate 4 is the latest version released in April 2026.
- The language shifts from layer-centric wording toward domains and adds the Common Domain.
- Layer-specific behavior concepts are consolidated into generic Service, Process, Function, and Event.
- Publicly described retired concepts include BusinessInteraction, ApplicationInteraction, TechnologyInteraction, Constraint, Contract, Gap, and Representation.
- ImplementationEvent is replaced by generic Event.
- Path is in the Common Domain.
- Relationship multiplicity is added on relationship ends, except where connected to junctions.
- Migration can preserve old ArchiMate 3.x meaning through specialization profiles.

## C260-Derived Implementation Facts

- The official ArchiMate 4 language element catalog contains 42 elements.
- There is no generic `Interface` element in the ArchiMate 4 element catalog.
- `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` remain domain-specific elements.
- ArchiMate 4 C260 describes `Junction` as a relationship connector concept; the MEFF 4.0 exchange representation is still pending XSD confirmation.
- See `docs/archimate4/official-specification.md` for the derived implementation specification and gap list.

## C260 Profile Correction

- `lib/metamodel/languages/archimate4-profile.json` is now tested against the C260-derived
  42-element catalog in `test/fixtures/archimate4-c260-element-catalog.json`.
- The C260-derived element catalog fixture also records standard display labels for all 42 elements
  and tests each ArchiMate 4 profile `typeName` against those labels.
- A local C260 domain/aspect label check is recorded in
  `project_memory/runlogs/20260708-301-archimate4-domain-aspect-label-source-check.txt`.
- The ArchiMate 4 profile now uses the C260 label forms `Implementation and Migration`,
  `Active Structure`, and `Passive Structure`; the older `Implementation & Migration` and
  lower-case aspect labels remain only where ArchiMate 3.x compatibility metadata requires them.
- Generic `Interface` was removed from the ArchiMate 4 profile surface.
- Domain-specific `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` are preserved
  as ArchiMate 4 elements and are not migrated to a generic interface.
- `AndJunction` and `OrJunction` are exposed as ArchiMate 4 relationship connector metadata outside
  the 42-element catalog so the editor can create and render junction connectors while MEFF 4.0 XML
  naming remains unresolved.
- The connector metadata is also recorded as a two-type status catalog so missing or extra junction
  connector types are visible in `getArchimate4ImplementationStatus()`.
- Relationship connector metadata deliberately uses editor-oriented `paletteGroup` and `colorGroup`
  values rather than adding a non-standard ArchiMate domain.

## Pictogram Coverage Guard

- A local C260 Appendix A / notation keyword scan is recorded in
  `project_memory/runlogs/20260708-155-archimate4-pictoref-source-check.txt`.
- `lib/draw/PathMap.js` now defines every `pictoRef` used by the ArchiMate 4 profile and relationship
  connector metadata.
- No ArchiMate 4 profile pictogram is currently satisfied through a `PICTO_OBJECT` alias. Concepts
  whose standard pictogram is the object shape may still reference the direct `PICTO_OBJECT` renderer
  path, while other profile `pictoRef` values use locally-authored renderer paths.
- `test/language-profile.test.mjs` verifies that every ArchiMate 4 profile concept has a renderer
  `PathMap` entry and that non-`PICTO_OBJECT` profile pictograms are dedicated entries rather than
  generic object aliases.
- `getArchimate4ImplementationStatus()` exposes `profilePictogramCoverage`,
  `genericObjectAliasCount`, and legacy compatibility aliases in the iconography status so callers can
  distinguish local renderer coverage from exact Appendix A vector-artwork confirmation.
- `sourceCoverage.appendixAArtworkRights` records the latest local pictogram audit in
  `project_memory/runlogs/20260709-1189-appendix-a-artwork-rights-pictogram-audit.json`: all
  non-`PICTO_OBJECT` profile pictogram references have local `PathMap` entries, no profile pictogram
  is implemented as a `PICTO_OBJECT` alias, and exact Appendix A artwork redistribution rights remain
  unconfirmed.
- The ArchiMate 4 `Deliverable` profile entry uses the correctly spelled `PICTO_DELIVERABLE`
  reference. The older misspelled `PICTO_DELIVRABLE` key remains in `PathMap` only as a legacy
  compatibility alias for existing 3.x profile metadata.
- A local C260 term check is recorded in
  `project_memory/runlogs/20260708-283-archimate4-standard-spelling-gap-check.txt`.
- The ArchiMate 4 `Stakeholder` profile entry uses the correctly spelled `PICTO_STAKEHOLDER`
  reference. The older misspelled `PICTO_STAKHOLDER` key remains in `PathMap` only as a legacy
  compatibility alias for existing 3.x profile metadata.
- A local C260 Appendix A rendered visual check for `Stakeholder` pictogram notation is recorded in
  `project_memory/runlogs/20260709-468-c260-appendix-a-stakeholder-render.txt` and
  `project_memory/runlogs/20260709-469-c260-appendix-a-stakeholder-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_STAKEHOLDER` actor/person alias with
  a locally-authored horizontal cylinder path while retaining the legacy `PICTO_STAKHOLDER` alias as
  compatibility.
- A local C260 Appendix A rendered visual check for `Driver` pictogram notation is recorded in
  `project_memory/runlogs/20260709-480-c260-appendix-a-driver-render.txt` and
  `project_memory/runlogs/20260709-481-c260-appendix-a-driver-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_DRIVER` generic object alias with a
  locally-authored wheel/spoke path.
- A local C260 Appendix A rendered visual check for `Assessment` pictogram notation is recorded in
  `project_memory/runlogs/20260709-492-c260-appendix-a-assessment-render.txt` and
  `project_memory/runlogs/20260709-493-c260-appendix-a-assessment-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_ASSESSMENT` generic object alias with
  a locally-authored magnifying-glass path.
- A local C260 Appendix A rendered visual check for `Goal` pictogram notation is recorded in
  `project_memory/runlogs/20260709-504-c260-appendix-a-goal-render.txt` and
  `project_memory/runlogs/20260709-505-c260-appendix-a-goal-visual-check.txt`. The derived renderer
  requirement is limited to replacing the local `PICTO_GOAL` generic object alias with a
  locally-authored target/bullseye path.
- A local C260 Appendix A rendered visual check for `Outcome` pictogram notation is recorded in
  `project_memory/runlogs/20260709-516-c260-appendix-a-outcome-render.txt` and
  `project_memory/runlogs/20260709-517-c260-appendix-a-outcome-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_OUTCOME` generic object alias with a
  locally-authored target/bullseye-with-arrow path.
- A local C260 Appendix A rendered visual check for `Principle` pictogram notation is recorded in
  `project_memory/runlogs/20260709-528-c260-appendix-a-principle-render.txt` and
  `project_memory/runlogs/20260709-529-c260-appendix-a-principle-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_PRINCIPLE` generic object alias with
  a locally-authored rounded-square exclamation path.
- A local C260 Appendix A rendered visual check for `Requirement` pictogram notation is recorded in
  `project_memory/runlogs/20260709-540-c260-appendix-a-requirement-render.txt` and
  `project_memory/runlogs/20260709-541-c260-appendix-a-requirement-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_REQUIREMENT` generic object alias
  with a locally-authored parallelogram path.
- A local C260 Appendix A rendered visual check for `Meaning` and `Value` pictogram notation is
  recorded in `project_memory/runlogs/20260709-554-c260-appendix-a-meaning-value-render.txt` and
  `project_memory/runlogs/20260709-555-c260-appendix-a-meaning-value-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_MEANING` and `PICTO_VALUE` generic
  object aliases with locally-authored thought-cloud and oval paths.
- The ArchiMate 4 `CourseOfAction` display label is `Course of Action`, matching the standard
  capitalization captured from C260.
- `ArchimateRenderer` resolves pictograms through the active language profile, so ArchiMate 4
  spelling-corrected `pictoRef` entries and implementation-defined specialized concepts do not fall
  back to the legacy 3.x `ModelUtil` metadata.
- A local C260 Appendix A page scan and rendered visual check for `Grouping` notation are recorded in
  `project_memory/runlogs/20260709-326-c260-appendix-a-grouping-page-scan.txt` and
  `project_memory/runlogs/20260709-327-c260-appendix-a-grouping-visual-check.txt`. The derived
  renderer requirement is limited to a dashed, unfilled ArchiMate 4 `Grouping` outline; exact Appendix
  A vector artwork remains source/rights dependent.
- A local C260 Appendix A rendered visual check for `Grouping` pictogram notation is recorded in
  `project_memory/runlogs/20260709-568-c260-appendix-a-grouping-pictogram-render.txt` and
  `project_memory/runlogs/20260709-569-c260-appendix-a-grouping-pictogram-visual-check.txt`. The
  derived renderer requirement is limited to replacing the local `PICTO_GROUPING` generic object
  alias with a locally-authored dashed-rectangle line path.
- A local C260 Appendix A page scan and rendered visual check for junction notation are recorded in
  `project_memory/runlogs/20260709-338-c260-appendix-a-junction-page-scan.txt` and
  `project_memory/runlogs/20260709-340-c260-appendix-a-junction-visual-check.txt`. The derived
  renderer requirement is limited to ArchiMate 4 `AndJunction` as a filled dot and `OrJunction` as an
  unfilled ring while preserving ArchiMate 3.x text marker rendering.
- A local C260 Appendix A rendered visual check for Motivation body notation is recorded in
  `project_memory/runlogs/20260709-351-c260-appendix-a-motivation-render.txt` and
  `project_memory/runlogs/20260709-352-c260-appendix-a-motivation-visual-check.txt`. The derived
  renderer requirement is limited to ArchiMate 4 Motivation elements using clipped/chamfered body
  corners while preserving ArchiMate 3.x rectangle body rendering.
- A local C260 Appendix A rendered visual check for `Location` pictogram notation is recorded in
  `project_memory/runlogs/20260709-364-c260-appendix-a-location-render.txt` and
  `project_memory/runlogs/20260709-365-c260-appendix-a-location-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_LOCATION` generic object alias with a
  locally-authored location-pin path.
- A local C260 Appendix A rendered visual check for `Distribution Network` pictogram notation is
  recorded in `project_memory/runlogs/20260709-377-c260-appendix-a-distribution-network-render.txt`
  and `project_memory/runlogs/20260709-378-c260-appendix-a-distribution-network-visual-check.txt`.
  The derived renderer requirement is limited to replacing the local
  `PICTO_DISTRIBUTION_NETWORK` Communication Network alias with a locally-authored bidirectional-arrow
  path.
- A local C260 Appendix A rendered visual check for `Material` pictogram notation is recorded in
  `project_memory/runlogs/20260709-389-c260-appendix-a-material-render.txt` and
  `project_memory/runlogs/20260709-390-c260-appendix-a-material-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_MATERIAL` Artifact alias with a
  locally-authored hexagonal path.
- A local C260 Appendix A rendered visual check for `Facility` pictogram notation is recorded in
  `project_memory/runlogs/20260709-401-c260-appendix-a-facility-render.txt` and
  `project_memory/runlogs/20260709-402-c260-appendix-a-facility-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_FACILITY` Node alias with a
  locally-authored factory-shaped path.
- A local C260 Appendix A rendered visual check for `Equipment` pictogram notation is recorded in
  `project_memory/runlogs/20260709-413-c260-appendix-a-equipment-render.txt` and
  `project_memory/runlogs/20260709-414-c260-appendix-a-equipment-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_EQUIPMENT` Device alias with a
  locally-authored gear-shaped path.
- A local C260 Appendix A rendered visual check for `Work Package` pictogram notation is recorded in
  `project_memory/runlogs/20260709-427-c260-appendix-a-work-package-render.txt` and
  `project_memory/runlogs/20260709-428-c260-appendix-a-work-package-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_WORK_PACKAGE` Process alias with a
  locally-authored loop-arrow path.
- A local C260 Appendix A rendered visual check for `Deliverable` pictogram notation is recorded in
  `project_memory/runlogs/20260709-442-c260-appendix-a-deliverable-render.txt` and
  `project_memory/runlogs/20260709-443-c260-appendix-a-deliverable-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_DELIVERABLE` generic object alias
  with a locally-authored wavy-bottom document path while retaining the legacy `PICTO_DELIVRABLE`
  alias as compatibility.
- A local C260 Appendix A rendered visual check for `Plateau` pictogram notation is recorded in
  `project_memory/runlogs/20260709-455-c260-appendix-a-plateau-render.txt` and
  `project_memory/runlogs/20260709-456-c260-appendix-a-plateau-visual-check.txt`. The derived
  renderer requirement is limited to replacing the local `PICTO_PLATEAU` Product alias with a
  locally-authored stacked horizontal bars path.

## Language Customization Mechanism

- A local C260 Chapter 14 keyword scan is recorded in
  `project_memory/runlogs/20260708-133-language-customization-source-scan.txt`.
- A refreshed local C260 Chapter 14 scan is recorded in
  `project_memory/runlogs/20260709-032-c260-customization-specialization-scan.txt`; it records a
  derived source signal for Specializations of Relationships and Junctions without copying the table.
- A follow-up local C260 Chapter 14 keyword scan is recorded in
  `project_memory/runlogs/20260709-049-c260-relationship-specialization-menu-source-scan.txt`; it
  confirms the same relationship/junction specialization signal used for editor menu behavior.
- A local C260 Chapter 14 profile attribute scan is recorded in
  `project_memory/runlogs/20260709-200-c260-profile-attribute-detail-scan.txt`; it confirms that
  profile attributes are typed and assigned to model concepts.
- A follow-up local C260 Chapter 14 and property-model scan is recorded in
  `project_memory/runlogs/20260709-233-c260-profile-attribute-property-scan.txt`; it keeps the
  derived implementation boundary non-verbatim and ties attribute values to the existing model
  `PropertyDefinition` / `Properties` structure.
- A C260 Chapter 14 profile attribute type token scan is recorded in
  `project_memory/runlogs/20260709-1243-c260-profile-attribute-type-token-scan.txt`; it supports the
  exact profile attribute type status without copying profile table prose.
- The implementation-defined customization path is `archimateLanguageProfile` on viewer/modeler
  options, or direct use of `createLanguageProfile(version, customization)`.
- Custom profiles may add or override domains, retain custom attribute definitions, and add specialized
  elements, connectors, or relationships.
- Profile attributes are validated as C260 typed attributes: each entry must name an active element,
  connector, or relationship concept and use an implementation-supported attribute type.
- Behavioral coverage is recorded in
  `project_memory/runlogs/20260709-1206-profile-attribute-customization-behavior-test-language.txt`:
  custom profile attributes are accepted for active standard and specialized element/relationship
  concepts, inherited through the specialization lineage, and rejected for retired ArchiMate 3.x
  concepts, unsupported attribute types, or missing attribute names.
- Profile attribute values can be normalized and validated through `normalizeProfileAttributeValue()`
  and `isProfileAttributeValueValid()` for the implementation-supported basic type set recorded from
  the local C260 scan, including the C260 basic `Number` type.
  `getProfileAttributesForConcept()` returns attributes for a concept and its specialization lineage.
- `getArchimate4ImplementationStatus().profileAttributeTypes` reports
  `profileAttributeTypes.expectedC260TypeNames`, `profileAttributeTypes.actualC260TypeNames`,
  `profileAttributeTypes.missingC260TypeNames`, and
  `profileAttributeTypes.unexpectedAdditionalTypeNames`, separating C260 basic/example attribute
  types from implementation-defined additions such as `URL` and `Structure`.
- `getArchimate4ImplementationStatus().viewpointClassification` reports
  `viewpointClassification.expectedPurposeNames`, `viewpointClassification.actualPurposeNames`,
  `viewpointClassification.missingPurposeNames`, `viewpointClassification.expectedContentNames`,
  `viewpointClassification.actualContentNames`, and
  `viewpointClassification.missingContentNames`, tying the supported C260 viewpoint purpose/content
  classification tokens to
  `project_memory/runlogs/20260709-1268-c260-viewpoint-classification-token-scan.txt`.
- `getArchimate4ImplementationStatus().viewpointMechanism` reports
  `viewpointMechanism.expectedFeatureIds`, `viewpointMechanism.actualFeatureIds`,
  `viewpointMechanism.missingFeatureIds`, and `viewpointMechanism.extraFeatureIds`, deriving actual
  feature coverage from the ArchiMate 4 moddle descriptor and tying C260 token evidence to
  `project_memory/runlogs/20260709-1284-c260-viewpoint-mechanism-feature-scan.txt`.
- `getArchimate4ImplementationStatus().stakeholderConcerns` reports
  `stakeholderConcerns.expectedFeatureIds`, `stakeholderConcerns.actualFeatureIds`,
  `stakeholderConcerns.missingFeatureIds`, and `stakeholderConcerns.extraFeatureIds`, deriving
  stakeholder/concern support from the ArchiMate 4 moddle descriptor and tying C260 token evidence to
  `project_memory/runlogs/20260709-1299-c260-stakeholder-concern-feature-scan.txt`.
- Profile attribute values can also be written to model `Properties` through
  `setProfileAttributePropertyValue()` and read through `getProfileAttributePropertyValue()`. The
  helper creates reusable `PropertyDefinition` entries named
  `archimate-js:profileAttribute:<concept>:<name>` and serializes `Structure` values as JSON strings
  because the local MEFF property value field is string-based.
- New custom concepts must declare `specializes`; relationship validation resolves specialized source
  and target concepts to their standard base concept before consulting the active relationship profile.
- New custom relationship objects may declare `specializes` to point to a standard ArchiMate
  relationship. Relationship validation resolves the custom relationship to that base type before
  consulting the active relationship profile, so Appendix B data does not need to be duplicated for
  every relationship specialization.
- Editor relationship menus now expand an allowed base relationship into any custom relationship
  specializations present in the active language profile, and the renderer/modeling handlers resolve
  those custom relationships back to the base relationship for line notation and editable options.
- This implements language customization without changing the 42-element standard catalog or embedding
  the licensed Appendix B matrix.

## Domain Terminology Metadata

- C260 shifts the language structure from ArchiMate 3 layer-centric terminology to domains.
- 4.0 shape creation now keeps `domain` metadata from the active language profile while retaining the
  existing `layer` property as a compatibility alias for renderer and extension code that still reads it.
- Domain colors are resolved from `domain` first when available, then the legacy `layer` value.
- The ArchiMate 4 palette exposes all 42 standard elements. `Grouping` and `Location` are Common
  composite elements and are no longer hidden by the legacy 3.x palette exclusion flag.
- The Viewer and Editor demos now use a visible ArchiMate 4 Common Domain sample and the Editor
  palette maps Common Domain entries to Common-colored `common_*.svg` assets, guarded by
  `test/language-profile.test.mjs`.

## Viewpoint Mechanism

- A local C260 Chapter 13 keyword scan and official 3.1 View XSD check are summarized in
  `project_memory/runlogs/20260708-142-viewpoint-mechanism-source-check.txt`.
- The implementation preserves viewpoint metadata in the local moddle descriptors: `View.viewpoint`,
  `View.viewpointRef`, and a model-level `Views.viewpointsNode` container.
- Viewpoint definitions can carry concerns, stakeholders, purpose, content, allowed element types,
  allowed relationship types, and modeling notes.
- `archimateLanguageProfile.viewpoints` can supply implementation-defined viewpoint definitions for
  host tooling, with purpose/content token validation.
- Custom viewpoint definitions validate allowed element and relationship types against the active profile,
  including custom specialized concepts and relationships already merged into that profile.
- Behavioral coverage is recorded in
  `project_memory/runlogs/20260709-1199-viewpoint-customization-behavior-test-language.txt`: a custom
  viewpoint with valid purpose/content and allowed element/relationship types is accepted, while an
  unsupported purpose, retired ArchiMate 3.x element type, unknown relationship type, and malformed
  type entry are rejected.
- Example viewpoints remain informative and are not embedded as normative data.

## View Nesting Notation

- A local C260 Chapter 3.7 nesting keyword scan is recorded in
  `project_memory/runlogs/20260709-297-c260-nesting-notation-source-scan.txt`.
- A follow-up local C260 Chapter 3.7 visual nesting persistence scan is recorded in
  `project_memory/runlogs/20260709-311-c260-nesting-persistence-source-scan.txt`.
- Imported nested `Node` view elements are now added under their parent diagram shape instead of being
  added to the root and marked with `host`. This preserves the visual nesting notation while keeping
  relationship semantics explicit.
- Edited nested `Node` view elements are stored once in the active parent container: root view
  `viewElements` for root-level nodes or parent `Node.nodes` for nested nodes. The editor updates the
  view node `$parent` to match that serialization parent and avoids duplicate entries.

## Model Organization Tree

- A public ArchiMate 3.1 Model/View XSD organization check is recorded in
  `project_memory/runlogs/20260709-247-official-xsd-organization-source-check.txt`; it records only
  schema identifiers and derived facts.
- The local current, 3.x, and 4.0 moddle descriptors now resolve the existing
  `Model.organizationsNode` reference to concrete `Organizations` and `Organization` types.
- Organization entries can be nested and can optionally reference a model concept through
  `identifierRef`. The ArchiMate 4 XML surface remains experimental until the MEFF 4.0 XSD confirms
  exact element names.

## Appendix E Migration Correction

- C260 Appendix E guidance is reflected in `lib/metamodel/languages/retired-concepts.js`.
- `Representation` now migrates to `DataObject` by default while warning that `Artifact` or `Material`
  may be more precise for a specific model.
- `Gap` records `Deliverable` as an alternative replacement to the default `Assessment`.
- Business, application, and technology interactions default to `Process` while warning that `Function`
  may be more precise.
- `ImplementationEvent` now preserves specialization information when migrating to `Event`.
- Migration now stores the original ArchiMate 3 type and specialization profile name in model
  `Properties`, using reusable `PropertyDefinition` entries, so the information is not limited to
  transient JavaScript fields.
- Migration also stores `archimate-js:originalArchiMate3Domain` for retired, merged, or moved concepts
  when the source domain is important to preserving the ArchiMate 3.x modeling intent.
- ArchiMate 3.x Physical concepts `DistributionNetwork`, `Equipment`, `Facility`, and `Material`
  now have a direct migration guard: they remain same-named ArchiMate 4 Technology Domain concepts
  while storing `Physical` as `archimate-js:originalArchiMate3Domain`, without creating a
  specialization profile. The behavior check is recorded in
  `project_memory/runlogs/20260708-311-physical-domain-migration-gap-check.txt`.
- A local C260 Appendix E vicinity keyword check for the Path aggregation relationship correction is
  recorded in `project_memory/runlogs/20260708-349-path-aggregation-migration-source-check.txt`.
- `migrateArchimate3ModelTo4()` now converts `Path` to technology-internal-active-structure
  `Aggregation` relationships into reversed `Realization` relationships and records an explicit
  relationship migration warning.
- A local C260 Appendix E vicinity keyword check for cross-domain service `Realization` relationships
  is recorded in `project_memory/runlogs/20260708-355-service-realization-migration-source-check.txt`.
- `migrateArchimate3ModelTo4()` now warns when `Realization` remains between `Service` concepts that
  came from different ArchiMate 3 domains, preserving the relationship while reporting
  `Specialization` and `Aggregation` as model-dependent alternatives.
- Relationship migration validation remains external-profile driven: hosts can pass an Appendix B-aware
  `isRelationshipAllowed` validator into `migrateArchimate3ModelTo4()` to warn on migrated relationships
  that are no longer valid and replace them with `Association` by default.
- A C260 Appendix E display-name signal check is recorded in
  `project_memory/runlogs/20260708-365-migration-coverage-source-check-display-names.txt`.
- `test/migration.test.mjs` now computes the set of ArchiMate 3 profile element types that are absent
  from the ArchiMate 4 element/connector catalog and requires every such type to have an explicit
  migration row. The current derived set contains 24 types and all are covered.
- The same test also asserts every default or alternative migration replacement resolves to an
  ArchiMate 4 profile type, preventing migration rows from pointing at removed or misspelled concepts.
- `test/migration.test.mjs` directly exercises the migration utility so replacement and warning data
  are verified, not only present in source text.

## Appendix B Relationship Profile Loading

- The default ArchiMate 4 relationship rules remain compatibility-derived from the existing 3.x maps
  until a licensed Appendix B profile artifact is supplied.
- `archimate4-profile.json` records this as `sourceCoverage.appendixBRelationshipMatrix`: C260 has
  been reviewed locally, the external profile loader and coverage report APIs are implemented, and the
  redistributable Appendix B profile artifact is still not present.
- `lib/metamodel/languages/relationship-profile-loader.js` validates external relationship profiles
  against the C260-derived concept set: the 42-element catalog, `AndJunction` / `OrJunction`
  relationship connectors, and the 11 supported relationship types.
- The public entrypoint exports `setArchimate4RelationshipProfile(profile)` and
  `getArchimate4RelationshipProfileStatus()`.
- `Modeler` and `Viewer` construction also accepts `archimate4RelationshipProfile` when
  `archimateVersion` is `4.0`, so licensed Appendix B data can be supplied at startup.
- Constructor-supplied profiles are marked as viewer/modeler scoped. A later ArchiMate 4 constructor
  call without `archimate4RelationshipProfile` resets a previous constructor-scoped profile back to
  the compatibility fallback, while a profile set explicitly through the public
  `setArchimate4RelationshipProfile(profile)` API remains process-wide until reset.
- The profile can be supplied as a parsed object or a JSON string loaded by the host application; this
  keeps file-system access outside the browser-oriented package while still supporting licensed local
  artifacts.
- The profile can also be supplied as row objects or a header-row matrix array, allowing a licensed
  Appendix B table to be transformed by the host without committing the table itself.
- For spreadsheet exports, a host can pass `{ matrixText, matrixDelimiter }` with CSV/TSV content; the
  parser keeps complete source-target cell validation and does not store the licensed table in this repository.
- The loader rejects generic `Interface`, retired 3.x concepts, and unknown relationship codes before
  replacing the active relationship map.
- Complete external profiles must include source rows for relationship connectors and relationship
  types, not only element types, so C260 Appendix B.6 relationship-concept rules can be supplied.
- The default replacement path also requires every source-target cell to be present. Empty cells may
  use an empty string, null, or an empty relationship array, but omitted cells fail validation so table
  transcription gaps are not silently treated as disallowed relationships.
- `getArchimate4RelationshipProfileStatus()` reports the active source, accepted concept count,
  explicit target-cell count, expected source-target cell count, missing source/target-cell counts,
  and actual complete source/target coverage booleans for the loaded profile.
- The same status API exposes optional `sourceMetadata` copied from the host-supplied profile or load
  options. Only scalar audit fields such as source id, version, URI, hash, generation time, and
  supplier are retained; nested objects are ignored so licensed table text is not leaked into status.
- The status API also exposes `sourceScope`, allowing hosts to distinguish the compatibility fallback,
  a process-wide external profile, and a constructor-scoped external profile.
- `getArchimate4RelationshipProfileCoverageReport()` returns the same coverage metadata plus the
  specific missing source types and missing source-target cells, allowing hosts to audit licensed
  Appendix B profile transcription without committing the table.
- Relationship popup options and reconnect validation both call the profile-aware relationship lookup,
  so an external Appendix B profile affects editing constraints as well as menu display.

## Relationship Role Label Guard

- C260 lists direct and reverse role names for each core relationship type.
- `lib/features/popup-menu/ConnectionOptions.js` now uses those role names as user-facing popup
  labels instead of raw relationship type names.
- Menu entries keep the underlying relationship type in `relationshipType` and `target.type`, so
  replacement and persistence still operate on the standard relationship type value.

## Relationship Option Hydration Guard

- C260 describes relationship options separately from the core relationship type, including directed
  association examples and modifier values on influence relationships.
- PDF text extraction did not reliably recover exact Access-type wording in this run, but C260
  examples and existing MEFF attributes require preserving `accessType` without inventing new values.
- Imported and edited `Access`, `Association`, and `Influence` relationship refs now use explicit
  `accessType`, `isDirected`, and `modifier` connection properties while retaining `typeOption` as a
  legacy compatibility alias.
- Popup active-state, renderer marker logic, relationshipRef replacement, and connection update
  persistence now prefer the explicit property and fall back to `typeOption` only when the explicit
  property is absent.
- A focused C260 Chapter 5 Access keyword scan is recorded in
  `project_memory/runlogs/20260709-277-c260-access-type-source-scan.txt`.
- The Access popup now exposes explicit actions for the supported local `accessType` values:
  `None`, `Read`, `Write`, and `ReadWrite`. This makes the unspecified Access notation selectable
  directly instead of requiring users to toggle another Access option off.
- A focused C260 Chapter 5 Association/direction keyword scan is recorded in
  `project_memory/runlogs/20260709-286-c260-association-direction-source-scan.txt`.
- The Association popup now exposes explicit undirected and directed actions backed by `isDirected`,
  while retaining the same relationship type value and legacy `typeOption` compatibility.

## Junction Multiplicity Guard

- C260 requires relationship-end multiplicity to be omitted when a relationship end is connected to a
  junction.
- `lib/util/JunctionUtil.js` centralizes the `AndJunction` / `OrJunction` detection used by the editor.
- Multiplicity editing, persistence, import hydration, and rendering now call that guard before keeping
  or displaying source/target multiplicity values.

## Junction Name Rendering Guard

- C260 allows a modeler-visible name on a junction when that helps clarify the relationship grouping
  or choice semantics.
- `lib/draw/ArchimateRenderer.js` renders ArchiMate 4 junction connector markers as a filled dot for
  `AndJunction` and an unfilled ring for `OrJunction`, while preserving the legacy ArchiMate 3.x
  `AND` / `OR` text marker.
- A separate optional junction name still renders below the connector.
- Default marker text and official type names are suppressed as external labels so unnamed junctions
  do not duplicate `AND`, `OR`, `And Junction`, or `Or Junction`.

## Junction Relationship Type Guard

- C260 requires relationships joined through a junction to use the same relationship type.
- `lib/util/JunctionUtil.js` now also derives junction relationship type candidates from existing
  incoming/outgoing junction connections.
- Popup relationship choices and reconnect validation reject a relationship type that conflicts with
  the existing type attached to the junction.
- Existing diagram connections use `relationshipRef.type` before generic diagram connection type values,
  so imported connections are evaluated by their actual ArchiMate relationship type.
- Junction endpoint-chain validity is now checked through the active relationship profile: incoming
  candidates are compared against outgoing endpoints and outgoing candidates against incoming endpoints
  using the same relationship type.
- The endpoint check improves conformance when an external Appendix B profile is loaded, while the
  default fallback remains compatibility-derived until official data can be supplied.

## Relationship Concept Aggregation Guard

- C260 Appendix B.6 covers additional relationship rules for grouping, location, plateau,
  relationships, and junctions.
- A local C260 Appendix B.6 keyword co-occurrence check for `Plateau`, `Aggregation`, relationship,
  and junction context is recorded in
  `project_memory/runlogs/20260708-379-plateau-relationship-concept-source-check.txt`.
- The currently implemented derived rule is intentionally narrow: in ArchiMate 4 mode, `Grouping`,
  `Location`, and `Plateau` may create or keep an `Aggregation` relationship to relationship concepts,
  including relationship connections and `AndJunction` / `OrJunction`.
- The rest of the Appendix B.6 table still depends on the external Appendix B profile path rather than
  a committed verbatim table.

## Relationship Concept Descriptor Guard

- The public ArchiMate 3.1 Model and Diagram XSDs express relationship and diagram connection
  endpoints as ID references, while the local moddle descriptor adds implementation-level type
  constraints.
- The ArchiMate 4 moddle descriptor now uses the shared abstract endpoint types needed for relationship
  concepts: `Relationship.source` and `Relationship.target` reference `Concept`, while
  `Connection.source` and `Connection.target` reference `ViewElement`.
- The ArchiMate 3 descriptor is intentionally unchanged and remains constrained to `BaseElement` for
  relationships and `Node` for diagram connections.

## Derived Relationship Rule Guard

- A local C260 Appendix B derivation keyword scan is recorded in
  `project_memory/runlogs/20260709-088-c260-derived-relationship-source-scan.txt`.
  The DR heading scan for this pass is recorded in
  `project_memory/runlogs/20260709-106-c260-derived-rule-headings-scan.txt`, with the
  non-verbatim implementation summary in
  `project_memory/runlogs/20260709-111-c260-derived-relationship-dr3-dr8-summary.txt`.
- DR1 specialization transitivity is implemented by `deriveRelationshipType()` and
  `deriveRelationship()`: a two-step `Specialization` chain derives a `Specialization` relationship.
- DR2 structural derivation is implemented for the C260 strength order Realization, Assignment,
  Aggregation, Composition. A two-step structural chain derives the weakest relationship type in
  that pair.
- DR3-DR8 valid derivations are implemented for dependency and dynamic relationships: structural
  plus dependency, structural plus dynamic, Triggering plus structural, and Triggering transitivity.
  The object-level helper also handles the C260 same-target opposite-direction cases for dependency
  relationships and Flow.
- `deriveRelationshipChain()` applies the valid in-line rules transitively across ordered chains. It
  collapses structural chains to the weakest relationship, can transfer dependency/dynamic
  relationships through structural chains, and records the original relationship ids plus pairwise
  derivation rule labels. It is not a graph search and does not apply opposite-direction or potential
  rules implicitly.
- PDR1-PDR12 potential derivations are implemented by `derivePotentialRelationship()` as explicit
  `potential: true` candidates. They cover specialization transfer, structural/dependency source-side
  transfer, dependency weakest derivation, Flow/Triggering potential derivation, and the Grouping
  aggregation rule. PDR12 requires an external `isRelationshipAllowed()` validator because C260
  conditions it on whether the metamodel allows the derived endpoint pair.
- C260 Appendix B.4 derivation restrictions are applied when an ArchiMate 4 profile is supplied. The
  implementation classifies endpoint types from profile domain/aspect metadata, treats relationship
  types and relationship connectors as the Relationships domain, and rejects restricted derived and
  potential candidates rather than treating every DR/PDR table match as allowed.
- Custom relationship specializations supplied through a language profile resolve to their standard
  base relationship before applying the derivation rules.
- This utility returns derivation candidates for host tooling. It does not embed the full Appendix B
  relationship table and does not automatically mutate a model.
- Source evidence for the restriction guard is recorded in
  `project_memory/runlogs/20260709-264-c260-derivation-restrictions-scan.txt`.
- Source evidence for the potential rules is recorded in
  `project_memory/runlogs/20260709-121-c260-potential-derivation-source-scan.txt`,
  `project_memory/runlogs/20260709-122-c260-potential-derivation-detail-scan.txt`,
  `project_memory/runlogs/20260709-123-c260-dependency-strength-source-scan.txt`, and the
  non-verbatim implementation summary
  `project_memory/runlogs/20260709-129-c260-potential-derivation-implementation-summary.txt`.
- Source evidence for chain derivation is recorded in
  `project_memory/runlogs/20260709-139-c260-chain-derivation-source-scan.txt`, with the
  non-verbatim implementation summary in
  `project_memory/runlogs/20260709-144-c260-chain-derivation-implementation-summary.txt`.

## Influence Modifier Guard

- A local C260 Influence keyword scan is recorded in
  `project_memory/runlogs/20260709-076-c260-influence-modifier-source-scan.txt`.
- C260 describes Influence as able to carry modeler-defined sign and/or strength values, with the
  default being unspecified.
- The local descriptor and relationship replacement path already preserve `modifier`; the renderer now
  displays it for Influence relationships.
- The ArchiMate 4 popup provides positive and negative quick actions plus a custom modifier input.
  Empty custom input clears the modifier, and arbitrary trimmed values are retained for modeler-defined
  sign or strength notation.

## Multiplicity Notation Guard

- A local C260 Chapter 5 multiplicity keyword scan is recorded in
  `project_memory/runlogs/20260709-064-c260-multiplicity-ui-source-scan.txt`.
- C260 defines the relationship-end multiplicity notation as a positive integer, `*`, or a finite
  `n..m` range where both bounds are non-negative integers and `m > n`.
- C260 describes `*` as the zero-to-unbounded end; this implementation accepts `0..*` as an input
  alias and normalizes it to the canonical `*` value.
- `lib/util/MultiplicityUtil.js` centralizes validation and normalization for import hydration,
  persistence, relationship replacement, and rendering.
- The ArchiMate 4 popup now exposes custom source and target multiplicity input actions in addition
  to the quick `source 1` and `target *` actions. Empty input clears the multiplicity; invalid input
  is ignored without changing the relationship.
- `1..*` and other non-zero unbounded range forms remain rejected until MEFF 4.0 or another normative
  source confirms they are valid exchange values.

## Model Validation Diagnostics

- `lib/validation/archimate4-model.js` exposes `validateArchimate4Model(model, options)` and
  `validateArchimateModel(model, options)` for host tooling that needs a structured diagnostic pass
  before import, editing, migration review, or export.
- The validator checks element catalog membership, ArchiMate 3 concepts retired or merged in
  ArchiMate 4, relationship type membership, relationship endpoint membership, active relationship
  profile allowance, multiplicity notation, multiplicity on junction-connected ends, mixed
  relationship types at a junction, and direct relationship validity for chains through a junction.
- The validator does not embed Appendix B relationship table data. By default it uses the active
  relationship profile path; hosts can pass `isRelationshipAllowed` when validating against a licensed
  Appendix B profile outside the repository.
- The 3.x path remains available through `validateArchimateModel(model, { archimateVersion: '3.2' })`
  so 4.0-only concepts can be reported when a model is intentionally checked against ArchiMate 3.x.

## XML Exchange Decision

- `archimateVersion: "3.2"` continues to write the current 3.x namespace.
- `archimateVersion: "4.0"` writes an internal ArchiMate 4 namespace and source/target multiplicity attributes.
- 4.0 XML export is marked experimental until the corresponding ArchiMate 4 Model Exchange File Format XSD is confirmed.
- Internal XML read/write/read coverage for the 3.x and 4.0 minimal fixtures is recorded in
  `project_memory/runlogs/20260709-781-xml-roundtrip-exchange-format-test.txt`. This proves the local
  descriptors can round-trip the current fixtures; it does not prove official MEFF 4.0 conformance.

## Current XSD Directory Check

- Checked `https://www.opengroup.org/xsd/archimate/` on 2026-07-08, then refreshed the check during
  loop 13.
- Refreshed again during loop 21 in
  `project_memory/runlogs/20260708-139-archimate-xsd-current-head-check.txt`; candidate 4.0 URLs
  still returned 404 while the known 3.1 Model XSD returned 200.
- Refreshed again on 2026-07-08T17:53:09+09:00 in
  `project_memory/runlogs/20260708-196-meff4-xsd-official-recheck.txt` and
  `project_memory/runlogs/20260708-197-meff4-xsd-official-link-scan.txt`; the official directory
  returned 200 and listed 3.1 XSD links, while tested 4.0 directory and XSD candidates returned 404
  and no `archimate4` or `4.0` link was listed.
- The directory returned links for ArchiMate 3.1 model/view/diagram schemas, examples, and related
  pages.
- `https://www.opengroup.org/xsd/archimate/4.0/` returned 404.
- `https://www.opengroup.org/xsd/archimate/4.0/archimate4_Model.xsd` returned 404.
- `https://www.opengroup.org/xsd/archimate/4.0/archimate_Model.xsd` returned 404.
- `https://www.opengroup.org/xsd/archimate/3.1/archimate3_Model.xsd` returned 200 and remains the
  public XSD reference currently covered by local tests.
- Refreshed again on 2026-07-09 in `project_memory/runlogs/20260709-178-meff4-xsd-current-recheck.txt`;
  the public directory returned 200 with 3.1 links only, while the tested 4.0 directory and Model XSD
  candidates returned 404.
- Refreshed again on 2026-07-08T20:15:00+09:00 in
  `project_memory/runlogs/20260708-363-official-xsd-directory-recheck.txt`; the official directory
  returned 200 and listed 3.1 Model, Diagram, and View XSD links, with no discovered `archimate4` or
  `4.0` XSD signal.
- Refreshed again on 2026-07-09 in
  `project_memory/runlogs/20260709-039-official-xsd-directory-recheck.txt`; the official directory
  returned 200 and still listed only 3.1 XSD links, while tested 4.0 directory and Model/Diagram/View
  candidates returned 404.
- Refreshed again on 2026-07-09 in
  `project_memory/runlogs/20260709-606-meff4-xsd-current-recheck.txt`; the official directory returned
  200 and listed `3.1/archimate3_Model.xsd`, `3.1/archimate3_View.xsd`, and
  `3.1/archimate3_Diagram.xsd`. Tested 4.0 directory and Model/Diagram/View XSD candidate URLs
  returned 404. `archimate4-profile.json` records this check in `sourceCoverage.meff4Xsd` so host
  tooling can audit the exact evidence behind the experimental MEFF 4 status.
- Refreshed again on 2026-07-09 in
  `project_memory/runlogs/20260709-731-meff4-xsd-latest-recheck.txt`; the official directory returned
  200 and still listed only the 3.1 Model, View, and Diagram XSD links. Tested 4.0 directory,
  Model/Diagram/View XSD, `archimate4.xsd`, and `archimate4_ModelExchangeFile.xsd` candidate URLs
  returned 404. `archimate4-profile.json` now records this latest check in
  `sourceCoverage.meff4Xsd`.
- Refreshed again on 2026-07-09T14:12:30+09:00 in
  `project_memory/runlogs/20260709-1079-meff4-xsd-latest-recheck.txt`; the official directory and
  3.1 directory returned 200, while tested 4.0 directory, Model/Diagram/View XSD, `archimate4.xsd`,
  and `archimate4_ModelExchangeFile.xsd` candidate URLs returned 404. `archimate4-profile.json`
  records this latest check in `sourceCoverage.meff4Xsd`.
- Refreshed again on 2026-07-09T15:09:21+09:00 in
  `project_memory/runlogs/20260709-1167-meff4-xsd-continuation-recheck.json`; the official directory
  returned 200 and listed only the 3.1 Diagram, Model, and View XSD links. Tested 4.0 directory,
  Model/Diagram/View XSD, `archimate4.xsd`, and `archimate4_ModelExchangeFile.xsd` candidate URLs
  returned 404, while the 3.1 Model XSD baseline returned 200. `archimate4-profile.json` recorded
  this check in `sourceCoverage.meff4Xsd`.
- Refreshed again on 2026-07-09T17:28:55+09:00 in
  `project_memory/runlogs/20260709-1343-external-source-continuation-recheck.json`; the official
  directory returned 200 and still listed only the 3.1 Diagram, Model, and View XSD links. Tested
  4.0 directory, `archimate4_*`, `archimate4.xsd`, `archimate4_ModelExchangeFile.xsd`, and
  `archimate_*` candidate URLs returned 404, while the 3.1 Model XSD baseline returned 200.
  `archimate4-profile.json` recorded this check in `sourceCoverage.meff4Xsd`.
- Refreshed again on 2026-07-09T20:12:26+09:00 in
  `project_memory/runlogs/20260709-201226-external-source-current-recheck.json`; the official
  directory returned 200 and still listed only the 3.1 Diagram, Model, and View XSD links. Tested
  4.0 directory, `archimate4_*`, `archimate4.xsd`, `archimate4_ModelExchangeFile.xsd`, and
  `archimate_*` candidate URLs returned 404, while the 3.1 Model XSD baseline returned 200.
  `archimate4-profile.json` recorded this check in `sourceCoverage.meff4Xsd`.
- Refreshed again on 2026-07-09T22:35:00+09:00 in
  `project_memory/runlogs/20260709-1017-external-source-latest-recheck.json` using
  `scripts/check_archimate4_external_sources.mjs`; the official directory returned 200 and still
  listed only the 3.1 Diagram, Model, and View XSD links. Tested 4.0 directory, `archimate4_*`,
  `archimate4.xsd`, `archimate4_ModelExchangeFile.xsd`, and `archimate_*` candidate URLs returned
  404, while the 3.1 Model XSD baseline returned 200. `archimate4-profile.json` records this latest
  check in `sourceCoverage.meff4Xsd`.

## Local ArchiMate PDF Inventory

- `project_memory/runlogs/20260709-2110-local-archimate-pdf-identification.json` records a sanitized
  local PDF inventory for ArchiMate-related files under Downloads.
- The inventory classifies the full local C260 file as the 207-page `ArchiMate 4 Specification`,
  records the local C260 sample files separately, and classifies the `ArchiMate4_NCLv.1_ff` PDFs as
  ArchiMate 4 Non-Commercial License documents.
- The same inventory records `w262Matched: false`, so the current W262 companion gap is not caused by
  misclassifying the local C260 or license PDFs.

## Local ArchiMate 4 License Boundary

- `project_memory/runlogs/20260709-2125-archimate4-ncl-license-boundary.json` records sanitized
  keyword presence for local ArchiMate 4 Non-Commercial License PDFs without storing license prose.
- The boundary keeps `sourceCoverage.appendixBRelationshipMatrix.localLicenseBoundaryClearsBlocker`
  and `sourceCoverage.appendixAArtworkRights.localLicenseBoundaryClearsBlocker` false.
- Therefore the local NCL files are tracked as license context, not as a redistributable Appendix B
  relationship profile or an approved Appendix A artwork source.

## ArchiMate 3.1 XSD Verification

- `https://www.opengroup.org/xsd/archimate/` publishes ArchiMate 3.1/3.2 exchange resources.
- `https://www.opengroup.org/xsd/archimate/3.1/archimate3_Model.xsd` exposes `ElementTypeEnum` with 62 values.
- The local ArchiMate 3 profile is tested against that enum via `test/fixtures/archimate3-element-type-enum.json`.
- `AndJunction` and `OrJunction` are modeled with their official XSD type values, not display labels with spaces.

## Verification Notes

- Baseline `npm test` failed before implementation because no `test` script existed.
- Local setup used `npm install --package-lock=false`; no lockfile was introduced.
- `npm audit` reported five high severity issues in existing dependency versions. No forced dependency upgrade was applied because this task is focused on ArchiMate 4 behavior and `npm audit fix --force` would be a breaking dependency change.
- `npm run test:language` passed with 16 tests after profile, XML, migration, relationship, and multiplicity coverage were added.
- Changed-file lint passed with `npx eslint` over the ArchiMate 4 implementation files and tests.
- Repository-wide `npm run lint` still fails on legacy files and pre-existing formatting/env issues outside this implementation scope; final `npm run all` reported 4847 lint errors before reaching tests, see `project_memory/runlogs/20260708-012-final-npm-run-all.txt`.
- `npm run all` inherits the repository-wide lint failure; use `npm run test:language` plus changed-file lint for the current ArchiMate 4 verification gate until the legacy lint backlog is cleaned.

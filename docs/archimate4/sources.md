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
- W262 is published by The Open Group as a free PDF download that requires login. The current
  publication-page check is recorded in `project_memory/runlogs/20260709-210-w262-publication-status-check.txt`.
  The W262 PDF itself is still not present in this workspace.
- The Open Group licensed-downloads page confirms Version 4 was released in April 2026.
- The Open Group exchange-format page confirms the Model Exchange File Format is the standard interchange format.
- Because any ArchiMate 4 XSD was not available locally, XML conformance remains experimental until the official MEFF 4.0 schema is supplied.
- Because redistribution rights for Appendix B relationship tables are not confirmed, this repository
  does not embed the Appendix B matrix. `setArchimate4RelationshipProfile(profile)` is the replacement
  point for a user-supplied licensed relationship profile or derived non-verbatim implementation data.
- `getArchimate4ImplementationStatus()` exposes the current implementation boundary as machine-readable
  metadata, including implemented areas, experimental MEFF 4 exchange status, and external blockers.
- C260 conformance requirements are represented per shall/may clause in the ArchiMate 4 profile
  metadata so required, optional, implemented, and externally blocked support can be audited without
  treating fallback data as final conformance.
- `getArchimate4ImplementationStatus()` also exposes source coverage metadata so local source
  evidence, externally supplied normative data, and missing companion sources are distinguishable.

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
- Relationship connector metadata deliberately uses editor-oriented `paletteGroup` and `colorGroup`
  values rather than adding a non-standard ArchiMate domain.

## Pictogram Coverage Guard

- A local C260 Appendix A / notation keyword scan is recorded in
  `project_memory/runlogs/20260708-155-archimate4-pictoref-source-check.txt`.
- `lib/draw/PathMap.js` now defines every `pictoRef` used by the ArchiMate 4 profile and relationship
  connector metadata.
- Some ArchiMate 4 profile pictograms currently use explicit aliases to existing renderer paths rather
  than embedded C260 vector artwork. This prevents silent fallback to a generic object path while
  avoiding redistribution of standard artwork before the exact licensing/source decision is resolved.
- `test/language-profile.test.mjs` verifies that every ArchiMate 4 profile concept has a renderer
  `PathMap` entry.
- The ArchiMate 4 `Deliverable` profile entry uses the correctly spelled `PICTO_DELIVERABLE`
  reference. The older misspelled `PICTO_DELIVRABLE` key remains in `PathMap` only as a legacy
  compatibility alias for existing 3.x profile metadata.
- A local C260 term check is recorded in
  `project_memory/runlogs/20260708-283-archimate4-standard-spelling-gap-check.txt`.
- The ArchiMate 4 `Stakeholder` profile entry uses the correctly spelled `PICTO_STAKEHOLDER`
  reference. The older misspelled `PICTO_STAKHOLDER` key remains in `PathMap` only as a legacy
  compatibility alias for existing 3.x profile metadata.
- The ArchiMate 4 `CourseOfAction` display label is `Course of Action`, matching the standard
  capitalization captured from C260.
- `ArchimateRenderer` resolves pictograms through the active language profile, so ArchiMate 4
  spelling-corrected `pictoRef` entries and implementation-defined specialized concepts do not fall
  back to the legacy 3.x `ModelUtil` metadata.

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
- The implementation-defined customization path is `archimateLanguageProfile` on viewer/modeler
  options, or direct use of `createLanguageProfile(version, customization)`.
- Custom profiles may add or override domains, retain custom attribute definitions, and add specialized
  elements, connectors, or relationships.
- Profile attributes are validated as C260 typed attributes: each entry must name an active element,
  connector, or relationship concept and use an implementation-supported attribute type.
- Profile attribute values can be normalized and validated through `normalizeProfileAttributeValue()`
  and `isProfileAttributeValueValid()` for the implementation-supported basic type set recorded from
  the local C260 scan. `getProfileAttributesForConcept()` returns attributes for a concept and its
  specialization lineage.
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
- `lib/metamodel/languages/relationship-profile-loader.js` validates external relationship profiles
  against the C260-derived concept set: the 42-element catalog, `AndJunction` / `OrJunction`
  relationship connectors, and the 11 supported relationship types.
- The public entrypoint exports `setArchimate4RelationshipProfile(profile)` and
  `getArchimate4RelationshipProfileStatus()`.
- `Modeler` and `Viewer` construction also accepts `archimate4RelationshipProfile` when
  `archimateVersion` is `4.0`, so licensed Appendix B data can be supplied at startup.
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
- `lib/draw/ArchimateRenderer.js` keeps the `AND` / `OR` marker as the connector marker and renders
  a separate optional junction name below the connector.
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

## XML Exchange Decision

- `archimateVersion: "3.2"` continues to write the current 3.x namespace.
- `archimateVersion: "4.0"` writes an internal ArchiMate 4 namespace and source/target multiplicity attributes.
- 4.0 XML export is marked experimental until the corresponding ArchiMate 4 Model Exchange File Format XSD is confirmed.

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

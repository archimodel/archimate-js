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
- Public MEFF 4.0 XSD status remains unresolved in this workspace. The public XSD directory checked
  earlier exposed 3.1/3.2 resources, not a confirmed 4.0 schema.

## Conformance Requirements For This Repository

An ArchiMate 4 implementation in this repository must support:

- The ArchiMate 4 element set and standard iconography from the language chapters and Appendix A.
- The viewpoint mechanism and language customization mechanism.
- The allowed relationship rules from Appendix B.
- The ArchiMate 4 domain terminology. UI and docs should use "domain" rather than the old
  layer-centric language when `archimateVersion` is `4.0`.

Example viewpoints are informative, so they are not required for editor conformance.

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
- Additional concept attributes retained on the active language profile for host tooling.
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

The MEFF 4.0 XSD is still required before claiming official ArchiMate 4 exchange conformance for this
serialization surface.

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
- Named junctions keep their `AND` or `OR` marker inside the connector and render the optional
  modeler-supplied name below the connector.
- Relationship popup labels use the C260 direct/reverse relationship role names while retaining the
  underlying relationship type for replacement and persistence.
- Relationship option attributes are preserved separately from the relationship type. Imported and
  edited `Access`, `Association`, and `Influence` relationships use explicit `accessType`,
  `isDirected`, and `modifier` properties while retaining legacy `typeOption` compatibility.
- Influence relationships can carry a modeler-defined sign or strength modifier. The implementation
  preserves arbitrary modifier values, renders them near the connection, and offers common positive
  and negative modifier actions in the popup.
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
- Unknown elements such as generic `Interface` or retired 3.x concepts must be rejected.

## XML And MEFF Requirements

The editor can expose ArchiMate 4 modeling semantics before MEFF 4.0 is confirmed, but XML export
must stay marked experimental until the official exchange schema is available.

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

## Implementation Status And Remaining Gaps

The `archimate4-profile.json` element catalog must remain aligned with the 42-element catalog above.
In particular:

- Generic `Interface` must not be exposed as an ArchiMate 4 element.
- `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` must remain available.
- Migration must preserve those three interface types.
- Tests must assert the official 42-element catalog.
- `AndJunction` and `OrJunction` must remain available as relationship connectors without being counted
  as ArchiMate 4 elements.

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
- Influence relationship modifiers are rendered from `modifier` or `typeOption`, and the popup can
  set common positive or negative influence values while retaining arbitrary modeler-defined values
  supplied through relationship properties.

Implemented multiplicity guard:

- Relationship-end multiplicity is suppressed for connections whose source or target is `AndJunction`
  or `OrJunction`.
- Relationship-end multiplicity is normalized to the C260-derived notation subset: positive integer,
  `*`, `0..*` canonicalized to `*`, or finite `n..m` ranges where `m > n`.
- Values outside that subset, including `1..*` and other non-zero unbounded ranges, are ignored until
  a normative source confirms an expanded notation.
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

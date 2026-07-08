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
- Implementation & Migration

Aspects remain:

- Active structure
- Behavior
- Passive structure
- Composite
- Motivation

Default color cues from the specification may be used for UI consistency but do not carry formal
semantics.

## Element Catalog

The official ArchiMate 4 element count is 42. The implementation profile must match this count for
language elements, excluding relationship types.

| Domain | Aspect | Element Types |
| --- | --- | --- |
| Common | Active structure | `Role`, `Collaboration`, `Path` |
| Common | Behavior | `Service`, `Process`, `Function`, `Event` |
| Common | Composite | `Grouping`, `Location` |
| Motivation | Motivation | `Stakeholder`, `Driver`, `Assessment`, `Goal`, `Outcome`, `Principle`, `Requirement`, `Meaning`, `Value` |
| Strategy | Active structure | `Resource` |
| Strategy | Behavior | `Capability`, `ValueStream`, `CourseOfAction` |
| Business | Active structure | `BusinessActor`, `BusinessInterface` |
| Business | Passive structure | `BusinessObject` |
| Business | Composite | `Product` |
| Application | Active structure | `ApplicationComponent`, `ApplicationInterface` |
| Application | Passive structure | `DataObject` |
| Technology | Active structure | `Node`, `TechnologyInterface`, `Device`, `SystemSoftware`, `Equipment`, `Facility`, `CommunicationNetwork`, `DistributionNetwork` |
| Technology | Passive structure | `Artifact`, `Material` |
| Implementation & Migration | Behavior | `WorkPackage` |
| Implementation & Migration | Passive structure | `Deliverable` |
| Implementation & Migration | Composite | `Plateau` |

Implementation notes:

- There is no generic `Interface` element in the ArchiMate 4 element catalog.
- `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` remain domain-specific
  elements and must not be migrated to a generic `Interface`.
- `Path` is a Common Domain active structure element.
- `Grouping` and `Location` are Common Domain composite elements.

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
- A junction may be aggregated in a `Plateau`, `Grouping`, or `Location`.
- Multiplicity must not be applied to a relationship end connected to a junction.

Implementation note:

- ArchiMate 3.1 MEFF exposes `AndJunction` and `OrJunction` element type values. ArchiMate 4 C260
  describes the modeling concept as `Junction`; the exact MEFF 4.0 exchange representation must be
  confirmed from the official MEFF 4.0 XSD before changing XML serialization.

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

- Accepted shapes are a nested object, a `Map` of source-to-target maps, or row arrays.
- Source and target element types must be members of the C260-derived 42-element catalog.
- Relationship values may use the local one-letter codes (`s`, `c`, `g`, `i`, `r`, `v`, `a`, `n`, `t`,
  `f`, `o`) or relationship names.
- The default public loader requires source coverage for every ArchiMate 4 element; sources with no
  outgoing relationships must still be represented with an empty target map.
- Unknown elements such as generic `Interface` or retired 3.x concepts must be rejected.

## XML And MEFF Requirements

The editor can expose ArchiMate 4 modeling semantics before MEFF 4.0 is confirmed, but XML export
must stay marked experimental until the official exchange schema is available.

Open decisions:

- ArchiMate 4 namespace and schema location.
- MEFF 4.0 element type for `Junction` versus `AndJunction` / `OrJunction`.
- MEFF 4.0 attribute names for relationship-end multiplicity.
- Whether relationship matrix data can be redistributed in source form.

## Implementation Status And Remaining Gaps

The `archimate4-profile.json` element catalog must remain aligned with the 42-element catalog above.
In particular:

- Generic `Interface` must not be exposed as an ArchiMate 4 element.
- `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` must remain available.
- Migration must preserve those three interface types.
- Tests must assert the official 42-element catalog.

The relationship rules remain a fallback:

- Replace compatibility-derived maps with an official Appendix B profile or external licensed data
  loader.
- Confirm XML serialization details after MEFF 4.0 XSD is available.

Implemented relationship rule wiring:

- Popup relationship choices and reconnect validation both read allowed relationships through the active
  language profile.
- When an external ArchiMate 4 relationship profile is loaded, `connection.reconnect` checks use that
  profile instead of the legacy ArchiMate 3.x relationship map.

Implemented multiplicity guard:

- Relationship-end multiplicity is suppressed for connections whose source or target is `AndJunction`
  or `OrJunction`.
- Relationship-end multiplicity is normalized to the C260-derived notation subset: positive integer,
  `*`, or finite `n..m` ranges where `m > n`.
- Values outside that subset, including `1..*`, are ignored until a normative source confirms an
  expanded notation.
- The guard applies during popup-menu editing, relationship replacement, model persistence, import
  attribute hydration, and rendering.

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

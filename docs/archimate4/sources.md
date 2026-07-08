# ArchiMate 4 Source Ledger

## Required Sources

- ArchiMate 4 Specification, The Open Group, Document C260, April 2026.
- The Motivation for Changes in the ArchiMate 4 Specification, The Open Group White Paper W262, April 2026.
- The Open Group ArchiMate Model Exchange File Format page and any ArchiMate 4 XSD available under `https://www.opengroup.org/xsd/archimate/`.
- ArchiMate 4 launch transcript supplied by the user.

## Source Access Decision

- C260 is now present locally as `C:\Users\syska\Downloads\978940181474E.pdf` and was reviewed on
  2026-07-08.
- The supplied launch transcript is present locally at
  `C:\Users\syska\.codex\attachments\eab35e75-10d5-4e1d-854e-3cc8feb4496c\pasted-text.txt`.
- C260 is a licensed copyrighted publication; this repository records a derived implementation
  specification and source trace, not copied normative prose or verbatim relationship tables.
- W262 is still not present in this workspace.
- The Open Group licensed-downloads page confirms Version 4 was released in April 2026.
- The Open Group exchange-format page confirms the Model Exchange File Format is the standard interchange format.
- Because any ArchiMate 4 XSD was not available locally, XML conformance remains experimental until the official MEFF 4.0 schema is supplied.
- Because redistribution rights for Appendix B relationship tables are not confirmed, this repository
  does not embed the Appendix B matrix. `setArchimate4RelationshipProfile(profile)` is the replacement
  point for a user-supplied licensed relationship profile or derived non-verbatim implementation data.

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
- Generic `Interface` was removed from the ArchiMate 4 profile surface.
- Domain-specific `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` are preserved
  as ArchiMate 4 elements and are not migrated to a generic interface.
- `AndJunction` and `OrJunction` are exposed as ArchiMate 4 relationship connector metadata outside
  the 42-element catalog so the editor can create and render junction connectors while MEFF 4.0 XML
  naming remains unresolved.

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

## Language Customization Mechanism

- A local C260 Chapter 14 keyword scan is recorded in
  `project_memory/runlogs/20260708-133-language-customization-source-scan.txt`.
- The implementation-defined customization path is `archimateLanguageProfile` on viewer/modeler
  options, or direct use of `createLanguageProfile(version, customization)`.
- Custom profiles may add or override domains, retain custom attribute definitions, and add specialized
  elements or connectors.
- New custom concepts must declare `specializes`; relationship validation resolves specialized source
  and target concepts to their standard base concept before consulting the active relationship profile.
- This implements language customization without changing the 42-element standard catalog or embedding
  the licensed Appendix B matrix.

## Viewpoint Mechanism

- A local C260 Chapter 13 keyword scan and official 3.1 View XSD check are summarized in
  `project_memory/runlogs/20260708-142-viewpoint-mechanism-source-check.txt`.
- The implementation preserves viewpoint metadata in the local moddle descriptors: `View.viewpoint`,
  `View.viewpointRef`, and a model-level `Views.viewpointsNode` container.
- Viewpoint definitions can carry concerns, stakeholders, purpose, content, allowed element types,
  allowed relationship types, and modeling notes.
- `archimateLanguageProfile.viewpoints` can supply implementation-defined viewpoint definitions for
  host tooling, with purpose/content token validation.
- Example viewpoints remain informative and are not embedded as normative data.

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
- The loader rejects generic `Interface`, retired 3.x concepts, and unknown relationship codes before
  replacing the active relationship map.
- Complete external profiles must include source rows for relationship connectors and relationship
  types, not only element types, so C260 Appendix B.6 relationship-concept rules can be supplied.
- The default replacement path also requires every source-target cell to be present. Empty cells may
  use an empty string, null, or an empty relationship array, but omitted cells fail validation so table
  transcription gaps are not silently treated as disallowed relationships.
- `getArchimate4RelationshipProfileStatus()` reports the active source, accepted concept count,
  expected source-target cell count, and whether complete source and target-cell validation was
  required for the loaded profile.
- Relationship popup options and reconnect validation both call the profile-aware relationship lookup,
  so an external Appendix B profile affects editing constraints as well as menu display.

## Junction Multiplicity Guard

- C260 requires relationship-end multiplicity to be omitted when a relationship end is connected to a
  junction.
- `lib/util/JunctionUtil.js` centralizes the `AndJunction` / `OrJunction` detection used by the editor.
- Multiplicity editing, persistence, import hydration, and rendering now call that guard before keeping
  or displaying source/target multiplicity values.

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
- The currently implemented derived rule is intentionally narrow: in ArchiMate 4 mode, `Grouping` and
  `Location` may create or keep an `Aggregation` relationship to relationship concepts, including
  relationship connections and `AndJunction` / `OrJunction`.
- `Plateau` and the rest of the Appendix B.6 table still depend on the external Appendix B profile path
  rather than a committed verbatim table.

## Relationship Concept Descriptor Guard

- The public ArchiMate 3.1 Model and Diagram XSDs express relationship and diagram connection
  endpoints as ID references, while the local moddle descriptor adds implementation-level type
  constraints.
- The ArchiMate 4 moddle descriptor now uses the shared abstract endpoint types needed for relationship
  concepts: `Relationship.source` and `Relationship.target` reference `Concept`, while
  `Connection.source` and `Connection.target` reference `ViewElement`.
- The ArchiMate 3 descriptor is intentionally unchanged and remains constrained to `BaseElement` for
  relationships and `Node` for diagram connections.

## Multiplicity Notation Guard

- C260 defines the relationship-end multiplicity notation as a positive integer, `*`, or a finite
  `n..m` range where both bounds are non-negative integers and `m > n`.
- `lib/util/MultiplicityUtil.js` centralizes validation and normalization for import hydration,
  persistence, relationship replacement, and rendering.
- `1..*` and other infinite range forms remain rejected until MEFF 4.0 or another normative source
  confirms they are valid exchange values.

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
- The directory returned links for ArchiMate 3.1 model/view/diagram schemas, examples, and related
  pages.
- `https://www.opengroup.org/xsd/archimate/4.0/` returned 404.
- `https://www.opengroup.org/xsd/archimate/4.0/archimate4_Model.xsd` returned 404.
- `https://www.opengroup.org/xsd/archimate/4.0/archimate_Model.xsd` returned 404.
- `https://www.opengroup.org/xsd/archimate/3.1/archimate3_Model.xsd` returned 200 and remains the
  public XSD reference currently covered by local tests.

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

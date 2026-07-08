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

## Appendix B Relationship Profile Loading

- The default ArchiMate 4 relationship rules remain compatibility-derived from the existing 3.x maps
  until a licensed Appendix B profile artifact is supplied.
- `lib/metamodel/languages/relationship-profile-loader.js` validates external relationship profiles
  against the C260-derived 42-element catalog and the 11 supported relationship types.
- The public entrypoint exports `setArchimate4RelationshipProfile(profile)` and
  `getArchimate4RelationshipProfileStatus()`.
- `Modeler` and `Viewer` construction also accepts `archimate4RelationshipProfile` when
  `archimateVersion` is `4.0`, so licensed Appendix B data can be supplied at startup.
- The loader rejects generic `Interface`, retired 3.x concepts, and unknown relationship codes before
  replacing the active relationship map.

## Junction Multiplicity Guard

- C260 requires relationship-end multiplicity to be omitted when a relationship end is connected to a
  junction.
- `lib/util/JunctionUtil.js` centralizes the `AndJunction` / `OrJunction` detection used by the editor.
- Multiplicity editing, persistence, import hydration, and rendering now call that guard before keeping
  or displaying source/target multiplicity values.

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

- Checked `https://www.opengroup.org/xsd/archimate/` on 2026-07-08.
- The directory returned links for ArchiMate 3.1 model/view/diagram schemas, examples, and related
  pages.
- `https://www.opengroup.org/xsd/archimate/4.0/` returned 404.
- `https://www.opengroup.org/xsd/archimate/4.0/archimate4_Model.xsd` returned 404.
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

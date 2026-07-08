# ArchiMate 4 Source Ledger

## Required Sources

- ArchiMate 4 Specification, The Open Group, Document C260, April 2026.
- The Motivation for Changes in the ArchiMate 4 Specification, The Open Group White Paper W262, April 2026.
- The Open Group ArchiMate Model Exchange File Format page and any ArchiMate 4 XSD available under `https://www.opengroup.org/xsd/archimate/`.

## Source Access Decision

- C260 and W262 are not present in this workspace.
- The Open Group licensed-downloads page confirms Version 4 was released in April 2026.
- The Open Group exchange-format page confirms the Model Exchange File Format is the standard interchange format.
- Because the normative C260 relationship matrix and any ArchiMate 4 XSD were not available locally, this implementation embeds a compatibility-derived ArchiMate 4 fallback and documents XML/relationship conformance as experimental until the official source package is supplied.
- If redistribution is not allowed or a more exact official matrix is required, `lib/metamodel/languages/archimate4-relationships.js` is the replacement point for a user-supplied official relationship profile.

## Current Public Release Notes Captured

- ArchiMate 4 is the latest version released in April 2026.
- The language shifts from layer-centric wording toward domains and adds the Common Domain.
- Layer-specific behavior concepts are consolidated into generic Service, Process, Function, and Event.
- Publicly described retired concepts include BusinessInteraction, ApplicationInteraction, TechnologyInteraction, Constraint, Contract, Gap, and Representation.
- ImplementationEvent is replaced by generic Event.
- Path is in the Common Domain.
- Relationship multiplicity is added on relationship ends, except where connected to junctions.
- Migration can preserve old ArchiMate 3.x meaning through specialization profiles.

## XML Exchange Decision

- `archimateVersion: "3.2"` continues to write the current 3.x namespace.
- `archimateVersion: "4.0"` writes an internal ArchiMate 4 namespace and source/target multiplicity attributes.
- 4.0 XML export is marked experimental until the corresponding ArchiMate 4 Model Exchange File Format XSD is confirmed.

## Verification Notes

- Baseline `npm test` failed before implementation because no `test` script existed.
- Local setup used `npm install --package-lock=false`; no lockfile was introduced.
- `npm audit` reported five high severity issues in existing dependency versions. No forced dependency upgrade was applied because this task is focused on ArchiMate 4 behavior and `npm audit fix --force` would be a breaking dependency change.
- `npm run test:language` passed with 16 tests after profile, XML, migration, relationship, and multiplicity coverage were added.
- Changed-file lint passed with `npx eslint` over the ArchiMate 4 implementation files and tests.
- Repository-wide `npm run lint` still fails on legacy files and pre-existing formatting/env issues outside this implementation scope; final `npm run all` reported 4847 lint errors before reaching tests, see `project_memory/runlogs/20260708-012-final-npm-run-all.txt`.
- `npm run all` inherits the repository-wide lint failure; use `npm run test:language` plus changed-file lint for the current ArchiMate 4 verification gate until the legacy lint backlog is cleaned.

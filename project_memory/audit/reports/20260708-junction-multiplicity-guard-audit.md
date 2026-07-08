# Junction Multiplicity Guard Audit

- Date: 2026-07-08
- Loop: 6
- Scope: ArchiMate 4 rule that relationship-end multiplicity is not applied to ends connected to a junction.

## Commands

- `npm run test:language`
  - Log: `project_memory/runlogs/20260708-047-junction-multiplicity-npm-test-language.txt`
  - Result: pass, 30 tests
- `npx eslint ... test/*.test.mjs`
  - Log: `project_memory/runlogs/20260708-048-junction-multiplicity-eslint-changed-js.txt`
  - Result: pass
- `git diff --check`
  - Log: `project_memory/runlogs/20260708-049-junction-multiplicity-git-diff-check.txt`
  - Result: pass

## Assertions Covered

- `lib/util/JunctionUtil.js` detects `AndJunction` / `OrJunction` at direct element type and imported
  `businessObject.elementRef.type` locations.
- Connection popup multiplicity entries are hidden when either relationship end is connected to a
  junction.
- `ConnectionUpdater` does not persist source or target multiplicity on junction-connected relationships.
- `ReplaceRelationshipRefHandler` removes source and target multiplicity from relationship and diagram
  connection state when the connection is junction-connected.
- `ElementFactory` and `ArchimateRenderer` suppress multiplicity hydration and labels on
  junction-connected relationships.

## Remaining Issues

- This audit does not resolve the official MEFF 4.0 representation of `Junction`; the public 4.0 XSD
  remains unavailable.
- Appendix B relationship matrix data still requires a licensed external artifact or redistributable
  derived data.

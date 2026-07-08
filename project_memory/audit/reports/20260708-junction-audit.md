# 2026-07-08 Junction Audit

## Scope

- Add official ArchiMate 3.1 XSD `ElementTypeEnum` fixture coverage.
- Align ArchiMate 3 profile and implementation with `AndJunction` / `OrJunction`.
- Keep ArchiMate 4 source/XSD work pending until official material is supplied.

## Source Verification

- Command log: `project_memory/runlogs/20260708-021-official-31-xsd-element-type-enum.txt`
- Source: `https://www.opengroup.org/xsd/archimate/3.1/archimate3_Model.xsd`
- Result: HTTP 200, `ElementTypeEnum` count 62.
- Required values present: `AndJunction`, `OrJunction`.

## Implementation Verification

- `test/fixtures/archimate3-element-type-enum.json` records the 62 official 3.1 element type values.
- `test/archimate3-xsd-profile.test.mjs` checks exact profile-to-XSD enum equality and verifies junction implementation uses official XSD element names as model types.
- `lib/metamodel/Concept.js` now defines `AndJunction` and `OrJunction` as official model type values.
- `lib/util/ModelUtil.js`, `lib/features/modeling/ElementFactory.js`, `lib/draw/ArchimateRenderer.js`, `lib/draw/PathMap.js`, and `assets/palette-icons.css` expose junction metadata, sizing, rendering, pictograms, and palette classes.

## Audit Commands

- `npm run test:language`
  - Log: `project_memory/runlogs/20260708-023-junction-final2-npm-test-language.txt`
  - Result: pass, 19 tests.
- `npx eslint lib/metamodel/Concept.js lib/util/ModelUtil.js lib/features/modeling/ElementFactory.js lib/draw/PathMap.js lib/draw/ArchimateRenderer.js test/language-profile.test.mjs test/archimate3-xsd-profile.test.mjs`
  - Log: `project_memory/runlogs/20260708-024-junction-final2-eslint-js-changed-files.txt`
  - Result: pass.
- `git diff --check`
  - Log: `project_memory/runlogs/20260708-025-junction-final2-git-diff-check.txt`
  - Result: pass.

## Result

Pass. The ArchiMate 3 profile now matches the official 3.1 `ElementTypeEnum` fixture, and `AndJunction` / `OrJunction` are usable as profile-visible connector elements with official XSD type names.

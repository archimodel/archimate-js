# 2026-07-08 ArchiMate 4 Connector Domain Metadata Audit

- loop_id: 28
- stage: connector_domain_metadata_verified
- change_type: bugfix
- scope: keep ArchiMate 4 relationship connector UI grouping separate from the ArchiMate domain catalog.

## Source Trace

- C260-derived implementation notes identify `Junction` as a relationship connector concept, not a normal ArchiMate language element.
- The ArchiMate 4 profile keeps `AndJunction` and `OrJunction` outside the 42-element catalog while MEFF 4.0 XSD details remain pending.
- Initial gap check is recorded in `project_memory/runlogs/20260708-189-connector-domain-metadata-gap-check.txt`.

## Implemented Surface

- `lib/metamodel/languages/archimate4-profile.json` no longer assigns a `domain` to `AndJunction` or `OrJunction`.
- Relationship connector editor metadata now uses `paletteGroup` and `colorGroup` with the value `Relationships`.
- `lib/features/palette/PaletteProvider.js` uses `paletteGroup` before element domain/layer grouping.
- `lib/util/ModelUtil.js` keeps legacy `layer` compatibility by falling back to `colorGroup` after layer/domain.
- `test/language-profile.test.mjs` asserts connector domain absence and palette/color grouping.

## Checks

- FAIL-THEN-FIXED: initial gap check in `project_memory/runlogs/20260708-189-connector-domain-metadata-gap-check.txt` found connector `domain` fields.
- PASS: fix check in `project_memory/runlogs/20260708-190-connector-domain-metadata-fix-check.txt` confirms connector domain fields are absent and palette/color groups are present.
- PASS: `npm run test:language` in `project_memory/runlogs/20260708-191-connector-domain-metadata-npm-test-language.txt` passed with 65 tests.
- PASS: changed-file ESLint in `project_memory/runlogs/20260708-192-connector-domain-metadata-eslint-changed-js.txt` exited 0.
- PASS: `git diff --check` in `project_memory/runlogs/20260708-193-connector-domain-metadata-git-diff-check.txt` exited 0.
- EXPECTED LEGACY FAIL: repo-wide `npm run lint` in `project_memory/runlogs/20260708-194-connector-domain-metadata-repo-lint-legacy.txt` exited 1 on existing unrelated lint violations.
- PASS: final state check is recorded in `project_memory/runlogs/20260708-195-connector-domain-metadata-final-state-check.txt`.

## Decision

- ArchiMate 4 relationship connectors remain creatable and renderable in the editor without expanding the standard ArchiMate domain catalog.

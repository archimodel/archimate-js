# 20260709 viewpoint type validation audit

## Scope

- Validate custom ArchiMate viewpoint `allowedElementTypes` and `allowedRelationshipTypes` against the active language profile.
- Preserve existing viewpoint purpose/content token validation.
- Keep example viewpoints informative and avoid embedding fixed example viewpoint sets.

## Source Check

- Local C260 PDF keyword/source check:
  - `project_memory/runlogs/20260709-168-c260-viewpoint-type-validation-source-check.txt`
- Non-verbatim source-derived implementation fact:
  - Viewpoint definitions carry purpose/content metadata and may constrain allowed element and relationship types.
  - Custom viewpoint definitions should reject unsupported purpose/content tokens and reject allowed element or relationship type names absent from the active ArchiMate profile.

## Commands

- Red test: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-169-viewpoint-type-validation-red-test.txt`
  - Result: fail, expected. Viewpoint type validation was not implemented.
- Language tests: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-171-viewpoint-type-validation-test-language-pass.txt`
  - Result: pass, 115 tests.
- Scoped lint: `npx eslint index.js lib/BaseViewer.js lib/core/index.js lib/core/languageProfile.js lib/metamodel/languages/index.js lib/metamodel/languages/archimate3-relationships.js lib/metamodel/languages/archimate4-relationships.js lib/metamodel/languages/relationship-profile-loader.js lib/metamodel/languages/retired-concepts.js lib/migration/archimate3-to-4.js lib/moddle/index.js lib/moddle/templateModel.js lib/features/palette/PaletteProvider.js lib/features/modeling/ElementFactory.js lib/features/modeling/ConnectionUpdater.js lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js lib/features/popup-menu/ConnectionMenuProvider.js lib/features/popup-menu/ConnectionOptions.js lib/features/rules/ArchimateRules.js lib/draw/PathMap.js lib/draw/ArchimateRenderer.js lib/util/ModelUtil.js lib/util/RelationshipUtil.js lib/util/JunctionUtil.js lib/util/DerivedRelationshipUtil.js lib/util/MultiplicityUtil.js lib/util/ColorUtil.js test/*.test.mjs`
  - Log: `project_memory/runlogs/20260709-172-viewpoint-type-validation-eslint-registry.txt`
  - Result: pass.
- Demo build: `npm run demo:build`
  - Log: `project_memory/runlogs/20260709-173-viewpoint-type-validation-demo-build.txt`
  - Result: pass.
- Whitespace check: `git diff --check`
  - Log: `project_memory/runlogs/20260709-174-viewpoint-type-validation-git-diff-check.txt`
  - Result: pass.
- Repository-wide lint: `npm run lint`
  - Log: `project_memory/runlogs/20260709-175-viewpoint-type-validation-repo-lint-legacy.txt`
  - Result: expected legacy failure, 4413 errors outside this feature gate.

## Result

Pass for the scoped ArchiMate 4 implementation gate.

The remaining blockers are external-source dependent: official Appendix B data redistribution, MEFF 4.0 XSD availability, W262 availability, and exact Appendix A vector artwork redistribution.

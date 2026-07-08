# 20260709 profile coverage report audit

## Scope

- Add a machine-readable coverage gap report for ArchiMate 4 relationship profiles supplied by the host.
- Preserve the existing count-only coverage stats API.
- Keep Appendix B matrix data external and do not commit licensed relationship tables.

## Commands

- Red test: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-154-profile-coverage-report-red-test.txt`
  - Result: fail, expected. Missing coverage report export.
- Language tests: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-162-profile-coverage-report-final-test-language.txt`
  - Result: pass, 115 tests.
- Scoped lint: `npx eslint index.js lib/BaseViewer.js lib/core/index.js lib/core/languageProfile.js lib/metamodel/languages/index.js lib/metamodel/languages/archimate3-relationships.js lib/metamodel/languages/archimate4-relationships.js lib/metamodel/languages/relationship-profile-loader.js lib/metamodel/languages/retired-concepts.js lib/migration/archimate3-to-4.js lib/moddle/index.js lib/moddle/templateModel.js lib/features/palette/PaletteProvider.js lib/features/modeling/ElementFactory.js lib/features/modeling/ConnectionUpdater.js lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js lib/features/popup-menu/ConnectionMenuProvider.js lib/features/popup-menu/ConnectionOptions.js lib/features/rules/ArchimateRules.js lib/draw/PathMap.js lib/draw/ArchimateRenderer.js lib/util/ModelUtil.js lib/util/RelationshipUtil.js lib/util/JunctionUtil.js lib/util/DerivedRelationshipUtil.js lib/util/MultiplicityUtil.js lib/util/ColorUtil.js test/*.test.mjs`
  - Log: `project_memory/runlogs/20260709-163-profile-coverage-report-final-eslint-registry.txt`
  - Result: pass.
- Demo build: `npm run demo:build`
  - Log: `project_memory/runlogs/20260709-164-profile-coverage-report-final-demo-build.txt`
  - Result: pass.
- Whitespace check: `git diff --check`
  - Log: `project_memory/runlogs/20260709-165-profile-coverage-report-final-git-diff-check.txt`
  - Result: pass.
- Repository-wide lint: `npm run lint`
  - Log: `project_memory/runlogs/20260709-161-profile-coverage-report-repo-lint-legacy.txt`
  - Result: expected legacy failure, 4413 errors outside this feature gate.

## Result

Pass for the scoped ArchiMate 4 implementation gate.

The remaining blockers are external-source dependent: official Appendix B data redistribution, MEFF 4.0 XSD availability, W262 availability, and exact Appendix A vector artwork redistribution.

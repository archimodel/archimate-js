# Viewpoint Customization Behavior Audit

- Date: 2026-07-09
- Scope: verify the C260 viewpoint mechanism customization behavior exposed through `archimateLanguageProfile.viewpoints`.
- Result: pass with MEFF 4.0 exchange conformance still external-source dependent.

## Evidence

- Behavioral language-profile test: `project_memory/runlogs/20260709-1199-viewpoint-customization-behavior-test-language.txt`.
  - A custom viewpoint with valid purpose/content tokens and allowed element/relationship types was accepted.
  - Unsupported purpose values were rejected.
  - Retired ArchiMate 3.x element types were rejected in ArchiMate 4 viewpoint allowed types.
  - Unknown relationship types and malformed allowed-type entries were rejected.
- Final language-profile test: `project_memory/runlogs/20260709-1200-viewpoint-customization-test-language-pass.txt`.
- Changed-file ESLint: `project_memory/runlogs/20260709-1201-viewpoint-customization-eslint-changed.txt`.
- Diff check: `project_memory/runlogs/20260709-1202-viewpoint-customization-diff-check.txt`.
- Demo build: `project_memory/runlogs/20260709-1203-viewpoint-customization-demo-build.txt`.
- Repo-wide lint: `project_memory/runlogs/20260709-1204-viewpoint-customization-repo-lint.txt`.
  - This remains the known legacy failure with 4382 existing errors.
- Staged diff check: `project_memory/runlogs/20260709-1205-viewpoint-customization-staged-diff-check.txt`.

## Conclusion

The viewpoint mechanism is now covered by direct behavior tests, not only source-text assertions.
Custom viewpoint definitions validate C260-derived purpose/content token sets and active-profile
element and relationship type boundaries. Example viewpoints remain informative and are not bundled
as normative data.

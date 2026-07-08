# 20260709 profile attribute validation audit

## Scope

- Validate implementation-defined ArchiMate profile attribute definitions against the active language profile.
- Preserve ArchiMate 3.x behavior while tightening ArchiMate 4 language customization input.
- Record C260 Chapter 14 source evidence without copying normative prose.

## Source Check

- Chapter 14 language customization scan: `project_memory/runlogs/20260709-199-c260-language-customization-scan.txt`
- Profile attribute detail scan: `project_memory/runlogs/20260709-200-c260-profile-attribute-detail-scan.txt`

## Commands

- Red test attempt: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-201-profile-attribute-validation-red-test.txt`
  - Result: fail. The first test attempted a direct import of the language profile module and hit Node JSON import-attribute behavior before reaching the intended assertion.
- Red test: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-202-profile-attribute-validation-red-test.txt`
  - Result: fail, expected. Profile attribute validation markers were missing.
- Language tests: `npm run test:language`
  - Log: `project_memory/runlogs/20260709-203-profile-attribute-validation-test-language.txt`
  - Result: pass, 118 tests.
- Scoped lint: `npx eslint ... test/*.test.mjs`
  - Log: `project_memory/runlogs/20260709-204-profile-attribute-validation-eslint-registry.txt`
  - Result: pass.
- Demo build: `npm run demo:build`
  - Log: `project_memory/runlogs/20260709-205-profile-attribute-validation-demo-build.txt`
  - Result: pass.
- Whitespace check: `git diff --check`
  - Log: `project_memory/runlogs/20260709-206-profile-attribute-validation-git-diff-check.txt`
  - Result: pass.
- Repository-wide lint: `npm run lint`
  - Log: `project_memory/runlogs/20260709-207-profile-attribute-validation-repo-lint-legacy.txt`
  - Result: expected legacy failure, 4413 errors outside this feature gate.

## Result

Pass for the scoped ArchiMate 4 profile attribute validation gate.

Remaining blockers are unchanged: official Appendix B data redistribution, MEFF 4.0 XSD availability, W262 availability, and exact Appendix A vector artwork redistribution.

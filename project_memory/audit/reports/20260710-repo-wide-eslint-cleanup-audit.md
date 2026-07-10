# Repository-wide ESLint Cleanup Audit

- Date: 2026-07-10
- Scope: remove the repository-wide ESLint legacy baseline after the user requested `eslint --fix` plus program repair.
- Result: pass.

## Changes

- Ran `npm run lint -- --fix`, reducing the previous 4382-error repo-wide baseline to 53 remaining errors.
- Removed unused imports, variables, and inactive BPMN-derived helper functions that were not part of the active ArchiMate layout path.
- Fixed program-level lint issues by importing missing ArchiMate constants, declaring `oldViewElement`, restoring `LabelUtil`'s logger import, and correcting `UpdatePropertiesHandler` to use `element.businessObject`.
- Updated `audit.lint.repo_legacy` to `audit.lint.repo_clean` so repository-wide `npm run lint` is now a passing gate.

## Evidence

- ESLint fix run: `project_memory/runlogs/20260710-0700-repo-eslint-fix.txt`
- Remaining-error pass 1: `project_memory/runlogs/20260710-0701-repo-eslint-after-manual-pass1.txt`
- Repository-wide ESLint pass: `project_memory/runlogs/20260710-0702-repo-eslint-after-manual-pass2.txt`
- Language tests: `project_memory/runlogs/20260710-0703-eslint-fix-test-language.txt`
- Demo build: `project_memory/runlogs/20260710-0704-eslint-fix-demo-build.txt`
- Diff whitespace check: `project_memory/runlogs/20260710-0705-eslint-fix-diff-check.txt`
- Full npm gate: `project_memory/runlogs/20260710-0706-eslint-fix-npm-all.txt`
- Completion audit: `project_memory/runlogs/20260710-0707-eslint-fix-completion-audit.json`
- C260 coverage audit: `project_memory/runlogs/20260710-0708-eslint-fix-c260-coverage-audit.json`
- Post-log JSON check: `project_memory/runlogs/20260710-0709-eslint-cleanup-json-check.txt`
- Post-log diff whitespace check: `project_memory/runlogs/20260710-0710-eslint-cleanup-diff-check.txt`
- Final npm gate: `project_memory/runlogs/20260710-0711-eslint-cleanup-final-npm-all.txt`

## Residual Risk

- The patch intentionally includes broad mechanical formatting changes from `eslint --fix`.
- Historical runlogs and audit reports still mention the old 4382-error baseline as past evidence; current registry and state now point to the clean ESLint gate.

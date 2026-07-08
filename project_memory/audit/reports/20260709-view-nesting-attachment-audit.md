# Audit: View Nesting Attachment Persistence

- Date: 2026-07-09
- Loop: 76
- Scope: C260-derived visual nesting notation preservation during editor attachment updates.
- Result: pass

## Source Evidence

- `project_memory/runlogs/20260709-311-c260-nesting-persistence-source-scan.txt` records a non-verbatim C260 Chapter 3.7 visual nesting and notation keyword scan.
- This builds on the prior import-side source scan in `project_memory/runlogs/20260709-297-c260-nesting-notation-source-scan.txt`.

## Red Test

- `project_memory/runlogs/20260709-312-view-nesting-attachment-red-test.txt` failed because `AttachmentBehavior` directly pushed view nodes into parent arrays, did not guard against duplicate entries, and set `$parent` from `shape.host` instead of the active serialization parent.

## Implementation

- `lib/features/modeling/behavior/AttachmentBehavior.js` now removes a moved `Node` view element from the old root `viewElements` or parent `Node.nodes` collection before adding it to the new parent.
- The add path now stores root-level nodes in `View.viewElements` and nested nodes in `Node.nodes`, with duplicate checks.
- The view node `$parent` is set to the actual parent business object used for serialization.
- `test/view-nesting.test.mjs` guards the attachment persistence boundary.
- README and `docs/archimate4` now describe view nesting preservation during import and editing.
- `project_memory/audit/audit_registry.json` now includes `lib/features/modeling/behavior/AttachmentBehavior.js` in the scoped ESLint gate.

## Verification

- `project_memory/runlogs/20260709-313-view-nesting-attachment-test.txt`: focused view nesting attachment test passed after implementation.
- `project_memory/runlogs/20260709-316-view-nesting-attachment-test-after-lint-fix.txt`: focused test still passed after ESLint cleanup.
- `project_memory/runlogs/20260709-317-view-nesting-attachment-eslint-pass.txt`: focused ESLint for `AttachmentBehavior.js` and `test/view-nesting.test.mjs` passed.
- `project_memory/runlogs/20260709-318-view-nesting-attachment-test-language.txt`: `npm run test:language` passed with 134 tests.
- `project_memory/runlogs/20260709-319-view-nesting-attachment-eslint-registry.txt`: updated registry scoped ESLint passed with `AttachmentBehavior.js` included.
- `project_memory/runlogs/20260709-320-view-nesting-attachment-demo-build.txt`: `npm run demo:build` passed.
- `project_memory/runlogs/20260709-321-view-nesting-attachment-json-check.txt`: JSON parse checks passed.
- `project_memory/runlogs/20260709-322-view-nesting-attachment-git-diff-check.txt`: `git diff --check` passed.
- `project_memory/runlogs/20260709-323-view-nesting-attachment-repo-lint-legacy.txt`: repo-wide lint remains the known legacy failure, now recorded with 4383 errors after the touched attachment file was cleaned up.
- `project_memory/runlogs/20260709-324-view-nesting-attachment-final-json-check.txt`: final JSON parse checks passed after state/worklog/audit updates.
- `project_memory/runlogs/20260709-325-view-nesting-attachment-final-git-diff-check.txt`: final `git diff --check` passed.

## Remaining External Blockers

- Official Appendix B relationship matrix data remains external-source dependent.
- MEFF 4.0 XSD remains unavailable from the public XSD directory checks.
- Exact Appendix A artwork redistribution rights remain unconfirmed.

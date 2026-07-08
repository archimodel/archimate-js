# 20260708 Demo ArchiMate 4 Notation Audit

## Scope

- Verify the Viewer and Editor demos are reachable from the existing font demo.
- Verify the Editor palette uses ArchiMate 4 Common Domain visual assets instead of old Business or
  Technology colored assets for consolidated Common concepts.
- Verify the sample canvas visibly contains ArchiMate 4 Common Domain elements.

## Evidence

- Build: `project_memory/runlogs/20260708-404-demo-archimate4-notation-final-build.txt`
- Language tests: `project_memory/runlogs/20260708-405-demo-archimate4-notation-final-test-language.txt`
- Changed-file lint: `project_memory/runlogs/20260708-406-demo-archimate4-notation-final-eslint-changed.txt`
- Whitespace audit: `project_memory/runlogs/20260708-407-demo-archimate4-notation-final-git-diff-check.txt`
- Editor browser smoke: `project_memory/runlogs/20260708-408-demo-archimate4-notation-final-browser-smoke.json`
- Viewer browser smoke: `project_memory/runlogs/20260708-409-demo-archimate4-notation-final-viewer-smoke.json`
- Post-log language tests: `project_memory/runlogs/20260708-410-demo-archimate4-notation-post-log-test-language.txt`
- Post-log changed-file lint: `project_memory/runlogs/20260708-411-demo-archimate4-notation-post-log-eslint-changed.txt`
- Post-log whitespace audit: `project_memory/runlogs/20260708-412-demo-archimate4-notation-post-log-git-diff-check.txt`
- State JSON parse: `project_memory/runlogs/20260708-413-demo-archimate4-notation-state-json-check.txt`
- Repo-wide lint status: `project_memory/runlogs/20260708-414-demo-archimate4-notation-repo-lint-legacy.txt`
- Final whitespace audit: `project_memory/runlogs/20260708-415-demo-archimate4-notation-final-final-git-diff-check.txt`
- Final state JSON parse: `project_memory/runlogs/20260708-416-demo-archimate4-notation-final-state-json-check.txt`

## Result

Pass.

- `npm run demo:build` compiled `viewer.bundle.js` and `editor.bundle.js`.
- `npm run test:language` passed 87 tests.
- Changed-file ESLint passed for `demo/src/sample-canvas.js` and `test/language-profile.test.mjs`.
- `git diff --check` passed.
- Browser smoke confirmed the Editor reached `ready`, rendered 13 diagram elements, and exposed
  Common Domain palette entries using `common_role.svg`, `common_path.svg`, `common_service.svg`,
  `common_grouping.svg`, and `common_location.svg`.
- Browser smoke confirmed the Viewer reached `ready` and rendered the same ArchiMate 4 Common
  Domain sample labels.
- Final post-log `npm run test:language` passed 87 tests, state JSON parsed, and repo-wide lint
  remained at the known legacy 4431-error baseline outside this feature gate.
- Final whitespace and state JSON checks passed after updating the LDD/ADD records.

## Remaining Gaps

- Exact C260 Appendix A vector artwork redistribution remains unconfirmed. The new Common palette
  assets are simple local visual cues using the existing Common color, not a verbatim Appendix A
  artwork import.

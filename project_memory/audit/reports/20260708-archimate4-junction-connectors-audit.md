# ArchiMate 4 Junction Connector Audit

## Scope

- Keep the C260-derived ArchiMate 4 element catalog at exactly 42 elements.
- Expose `AndJunction` and `OrJunction` as relationship connector metadata outside the element catalog.
- Ensure profile-aware palette and metadata lookup include connector metadata.
- Avoid undefined fill colors for ArchiMate 4 relationship connectors and legacy Other concepts.

## Required Behavior

- `archimate4-profile.json` has `elements.length === 42`.
- `AndJunction` and `OrJunction` are not members of `profile.elements`.
- `AndJunction` and `OrJunction` are available under `profile.connectors`.
- `PaletteProvider` builds entries from `profile.elements` plus `profile.connectors`.
- `ModelUtil` profile metadata lookup uses `profile.elements` plus `profile.connectors`.
- `ColorUtil` maps `Relationships` and `Other` to a concrete fill color.

## Evidence

- `project_memory/runlogs/20260708-065-archimate4-junction-connectors-npm-test-language.txt`: `npm run test:language` passed with 34 tests.
- `project_memory/runlogs/20260708-066-archimate4-junction-connectors-eslint-changed-js.txt`: changed-file ESLint passed.
- `project_memory/runlogs/20260708-067-archimate4-junction-connectors-git-diff-check.txt`: `git diff --check` passed.
- `project_memory/runlogs/20260708-068-archimate4-junction-connectors-final-npm-test-language.txt`: failed intermediary attempt to import `PaletteProvider` directly in Node tests; reverted because the existing source uses bundler-style extensionless imports.
- `project_memory/runlogs/20260708-069-archimate4-junction-connectors-final-npm-test-language.txt`: final `npm run test:language` passed with 34 tests.
- `project_memory/runlogs/20260708-070-archimate4-junction-connectors-final-eslint-changed-js.txt`: final changed-file ESLint passed.
- `project_memory/runlogs/20260708-071-archimate4-junction-connectors-final-git-diff-check.txt`: final `git diff --check` passed.

## Result

pass

## Remaining Gaps

- MEFF 4.0 XSD is still required to confirm whether exchange serialization should use `Junction`, `AndJunction` / `OrJunction`, or another schema representation.
- Appendix B relationship matrix data still requires a licensed artifact or redistributable derived profile.

# Context Pad Drag Audit - 2026-07-09

## Scope

- User question: whether the right-side context-pad arrow works by dragging to a target element and releasing.
- Target demo: `http://127.0.0.1:4174/demo/editor.html?version=4.0`.
- Code paths: `ContextPadProvider`, `ElementFactory`, `ConnectionUpdater`, and `RelationshipUtil`.

## Result

PASS with repo-wide legacy lint recorded.

The verified lifecycle creates a generic internal `Relationship` view connection from the selected source to the target element and opens the relationship selection popup.

## Evidence

- `project_memory/runlogs/20260709-019-context-pad-connect-lifecycle-smoke-pass.json`
  - title: `Drag to another element to create a relationship`
  - source: `Customer Role` (`Role`)
  - target: `Experience App` (`ApplicationComponent`)
  - context pad actions: `dragstart`
  - connection count: `beforeConnections: 6`, `afterConnections: 7`
  - popup: `popupOpen: true`
- `project_memory/runlogs/20260709-017-context-pad-drag-fix5-demo-build.txt`
  - `npm run demo:build` passed.
- `project_memory/runlogs/20260709-022-context-pad-drag-final-test-language.txt`
  - `npm run test:language` passed with 93 tests.
- `project_memory/runlogs/20260709-026-context-pad-drag-post-record-test-language.txt`
  - `npm run test:language` passed again after updating LDD/ADD records.
- `project_memory/runlogs/20260709-023-context-pad-drag-final-eslint-registry-gate.txt`
  - registry ESLint gate passed.
- `project_memory/runlogs/20260709-027-context-pad-drag-post-record-eslint-registry-gate.txt`
  - registry ESLint gate passed again after updating LDD/ADD records.
- `project_memory/runlogs/20260709-024-context-pad-drag-final-git-diff-check.txt`
  - `git diff --check` passed.
- `project_memory/runlogs/20260709-028-context-pad-drag-state-json-check.txt`
  - `aria_state.json` parsed successfully.
- `project_memory/runlogs/20260709-029-context-pad-drag-post-record-git-diff-check.txt`
  - `git diff --check` passed after updating LDD/ADD records.
- `project_memory/runlogs/20260709-030-context-pad-drag-final-final-git-diff-check.txt`
  - final `git diff --check` passed.
- `project_memory/runlogs/20260709-031-context-pad-drag-final-state-json-check.txt`
  - final `aria_state.json` parse check passed.
- `project_memory/runlogs/20260709-025-context-pad-drag-repo-lint-legacy.txt`
  - repo-wide `npm run lint` remains the expected legacy failure with 4413 existing errors.

## Root Cause

1. The active ArchiMate profile validator rejected the internal diagram-js `Relationship` placeholder used while dragging before the final relationship type is selected.
2. Empty demo views could have no `viewElements` collection, so creating a new connection failed before popup selection.
3. Relationship lookup assumed fully hydrated endpoints, which is not guaranteed during generic connection creation.

## Fix

- `ElementFactory` permits internal `Relationship` and `Line` view connection placeholders while keeping active-profile rejection for standard relationship types.
- `ConnectionUpdater` initializes `view.viewElements` before checking or appending connection view elements.
- `RelationshipUtil.getExistingRelationships` returns an empty set for missing or incomplete endpoints instead of throwing.
- Context-pad relationship and note connection entries are drag-only and no longer advertise a click action.

## Residual Risk

- Direct Puppeteer mouse movement did not reliably fire the HTML5 `dragstart` event from the context pad. The smoke test therefore triggers the same context-pad `dragstart` action and verifies the downstream diagram-js connection lifecycle.
- Final relationship legality still depends on the active profile and the relationship type selected in the popup.

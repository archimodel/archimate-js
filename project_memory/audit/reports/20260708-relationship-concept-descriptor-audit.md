# Relationship Concept Descriptor Audit

- Date: 2026-07-08
- Loop: 17
- Scope: ArchiMate 4 moddle endpoint descriptors, XML roundtrip descriptor tests, and ArchiMate 4 source notes.

## Source Trace

- Official ArchiMate XSD directory was checked at `https://www.opengroup.org/xsd/archimate/`.
- ArchiMate 3.1 Model and Diagram XSDs were reachable.
- Corrected focused extraction confirmed that 3.1 relationship and diagram connection endpoints are represented as ID references in XSD. See `project_memory/runlogs/20260708-103b-relationship-concept-descriptor-xsd-snippets.txt`.
- ArchiMate 4 XSD URLs remain unavailable at the checked 4.0 paths; this remains an open issue.

## Checks

| Check | Command | Evidence | Result |
| --- | --- | --- | --- |
| Language tests | `npm run test:language` | `project_memory/runlogs/20260708-104-relationship-concept-descriptor-npm-test-language.txt` | pass, 51 tests |
| Changed JS lint | `npx eslint test\xml-roundtrip.test.mjs` | `project_memory/runlogs/20260708-105-relationship-concept-descriptor-eslint-changed-js.txt` | pass |
| Descriptor JSON parse | `node -e "...JSON.parse..."` | `project_memory/runlogs/20260708-106-relationship-concept-descriptor-json-parse.txt` | pass |
| Whitespace diff check | `git diff --check` | `project_memory/runlogs/20260708-107-relationship-concept-descriptor-git-diff-check.txt` | pass |
| Final state check | `git diff --check` plus state JSON parse | `project_memory/runlogs/20260708-108-relationship-concept-descriptor-final-diff-state-check.txt` | pass |

## Decision

- ArchiMate 4 descriptor endpoints are widened to the local abstract types required to represent relationship concepts.
- ArchiMate 3 descriptor behavior is preserved and covered by regression tests.
- Full Appendix B relationship truth and MEFF 4.0 serialization remain external-source dependent.

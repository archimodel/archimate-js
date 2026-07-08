# Language Customization Profile Audit

- Date: 2026-07-08
- Loop: 21
- Scope: C260 Chapter 14 implementation-defined ArchiMate language customization support.

## Source Trace

- The local licensed C260 PDF was scanned for Chapter 14 language customization and specialization profile scope.
- Derived facts only are recorded in `project_memory/runlogs/20260708-133-language-customization-source-scan.txt`.
- The current official XSD availability was refreshed in `project_memory/runlogs/20260708-139-archimate-xsd-current-head-check.txt`; candidate 4.0 URLs still returned 404 while the 3.1 Model XSD returned 200.

## Checks

| Check | Command | Evidence | Result |
| --- | --- | --- | --- |
| Language tests | `npm run test:language` | `project_memory/runlogs/20260708-137-language-customization-profile-final-npm-test-language.txt` | pass, 56 tests |
| Changed JS lint | `npx eslint index.js lib\core\languageProfile.js lib\metamodel\languages\index.js lib\util\RelationshipUtil.js lib\util\ColorUtil.js lib\features\modeling\ElementFactory.js test\language-profile.test.mjs` | `project_memory/runlogs/20260708-138-language-customization-profile-final-eslint-changed-js.txt` | pass |
| XSD status refresh | candidate 4.0 and known 3.1 HEAD requests | `project_memory/runlogs/20260708-139-archimate-xsd-current-head-check.txt` | 4.0 candidates 404, 3.1 Model XSD 200 |
| Repo-wide legacy lint status | `npm run lint` | `project_memory/runlogs/20260708-140-language-customization-profile-repo-lint-legacy.txt` | expected legacy failure, exit code 1 |
| Final state check | `git diff --check` plus state JSON parse | `project_memory/runlogs/20260708-141-language-customization-profile-final-state-check.txt` | pass |

## Decision

- `archimateLanguageProfile` is the implementation-defined customization path for domains, attributes, and specialized element or connector metadata.
- New custom concepts must declare `specializes`, and relationship validation resolves custom specialized source and target concepts to their standard base concept.
- This improves C260 Chapter 14 support without changing the 42-element ArchiMate 4 catalog or embedding licensed Appendix B relationship data.

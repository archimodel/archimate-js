# 2026-07-08 ArchiMate 4 Specification Audit

## Scope

- Review the supplied ArchiMate 4 licensed PDF and launch transcript.
- Convert source findings into a non-verbatim implementation specification.
- Identify conformance gaps in the current experimental ArchiMate 4 implementation.

## Sources

- PDF: `C:\Users\syska\Downloads\978940181474E.pdf`
  - Title: ArchiMate 4 Specification
  - Author: The Open Group
  - Document: C260, April 2026
  - Page count observed: 207
- Transcript: `C:\Users\syska\.codex\attachments\eab35e75-10d5-4e1d-854e-3cc8feb4496c\pasted-text.txt`

## Derived Artifacts

- `docs/archimate4/official-specification.md`
- `docs/archimate4/sources.md`
- `project_memory/runlogs/20260708-026-archimate4-pdf-extract.txt`
- `project_memory/runlogs/20260708-027-archimate4-source-facts.txt`
- `project_memory/runlogs/20260708-028-archimate4-spec-npm-test-language.txt`
- `project_memory/runlogs/20260708-029-archimate4-spec-git-diff-check.txt`
- `project_memory/runlogs/20260708-030-archimate4-spec-copyright-scan.txt`
- `project_memory/runlogs/20260708-031-archimate4-spec-final-git-diff-check.txt`

## Findings

- ArchiMate 4 has 42 language elements.
- `BusinessInterface`, `ApplicationInterface`, and `TechnologyInterface` remain domain-specific.
- A generic `Interface` element is not part of the ArchiMate 4 element catalog.
- C260 describes `Junction` as a single connector concept; MEFF 4.0 exchange representation still requires XSD confirmation.
- Relationship multiplicity is allowed on relationship ends, except ends connected to junctions.
- Appendix B remains normative for relationships; relationship table redistribution rights are not confirmed.

## Current Implementation Gaps

- `lib/metamodel/languages/archimate4-profile.json` currently includes generic `Interface` and omits domain-specific interfaces.
- `lib/metamodel/languages/retired-concepts.js` currently migrates domain-specific interfaces to `Interface`, which conflicts with the C260-derived catalog.
- `lib/metamodel/languages/archimate4-relationships.js` is still compatibility-derived fallback data.
- XML/MEFF 4.0 conformance remains experimental until the official XSD is available.

## Result

Pass for specification extraction.

Verification:

- `npm run test:language`: pass, 19 tests.
- `git diff --check`: pass.
- Final post-audit `git diff --check`: pass.
- Copyright watermark scan over `docs` and `project_memory`: pass.

The implementation must be corrected in a follow-up change before ArchiMate 4 profile conformance can be claimed.

# 2026-07-08 MEFF 4.0 XSD Recheck Audit

- loop_id: 29
- stage: meff4_xsd_official_recheck_recorded
- change_type: documentation
- scope: refresh official The Open Group ArchiMate XSD availability evidence for MEFF 4.0-dependent implementation decisions.

## Source Trace

- Official directory checked: `https://www.opengroup.org/xsd/archimate/`.
- URL status checks are recorded in `project_memory/runlogs/20260708-196-meff4-xsd-official-recheck.txt`.
- Directory link scan is recorded in `project_memory/runlogs/20260708-197-meff4-xsd-official-link-scan.txt`.

## Observed Facts

- The ArchiMate XSD directory returned 200 OK.
- The known ArchiMate 3.1 Model and Diagram XSD URLs returned 200 OK.
- The tested ArchiMate 4.0 directory and XSD candidate URLs returned 404.
- The directory link scan showed ArchiMate 3.1 links and no 4.0 or `archimate4` links.

## Decision

- Keep ArchiMate 4 XML export marked experimental.
- Keep MEFF 4.0 namespace, schema location, Junction serialization, and multiplicity attribute names as source-dependent open items.
- Do not replace the local internal ArchiMate 4 namespace/schema assumptions until the official MEFF 4.0 XSD is published or supplied.
- Final state check is recorded in `project_memory/runlogs/20260708-200-meff4-xsd-official-recheck-final-state-check.txt`.

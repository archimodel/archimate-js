# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

* `FEAT`: added versioned ArchiMate language profiles with opt-in ArchiMate 4.0 support.
* `CORE`: preserved existing ArchiMate 3.x behavior as the default.
* `CORE`: added ArchiMate 3.x to 4.0 migration warnings for retired and merged concepts.
* `FEAT`: added relationship multiplicity storage and rendering for ArchiMate 4.0.
* `FEAT`: added ArchiMate 4 popup actions for custom source and target relationship multiplicity values.
* `FEAT`: added ArchiMate 4 popup input for custom Influence sign/strength modifiers.
* `FEAT`: added host-callable derived relationship helpers for C260 DR1 through DR8 valid derivations.
* `FEAT`: added host-callable chain derivation for ordered valid relationship chains.
* `FEAT`: added host-callable potential derived relationship helpers for C260 PDR1 through PDR12.
* `CORE`: aligned the ArchiMate 3 profile with the official 3.1 `ElementTypeEnum`, including `AndJunction` and `OrJunction`.
* `CORE`: aligned the ArchiMate 4 profile with the C260 42-element catalog, preserving domain-specific interfaces.
* `CORE`: added ArchiMate 4 junction relationship type and endpoint-chain guards for popup choices and reconnect validation.
* `CORE`: preserved ArchiMate 4 domain metadata on created shapes while retaining the legacy `layer` compatibility attribute.
* `CORE`: added ArchiMate 4 language customization, viewpoint metadata, and pictogram coverage guards.
* `CORE`: exposed the C260 Appendix C example viewpoint headings as an informative reference catalog.
* `CORE`: exposed the Appendix C informative catalog through `getArchimate4ImplementationStatus().exampleViewpointCatalog`.
* `CORE`: added model-level ArchiMate validation diagnostics for 3.x/4.0 profile mismatches, retired concepts, relationship rules, multiplicity, and junction consistency.
* `CORE`: extended model-level ArchiMate 4 diagnostics to validate view viewpoint references, view node concept references and geometry, view connection concept references, endpoints, endpoint-to-relationship alignment, waypoint geometry, view style/font/color values including invalid `font.style` `plain` combinations, model-defined and profile-defined viewpoint allowed-type application to View contents, viewpoint stakeholder/concern and modeling-note structure, organization identifier references, property definition structure and references, viewpoint definitions, and profile attribute property values.
* `CORE`: classified C260 Appendix D standards and guidance headings as reference-only coverage outside ArchiMate 4 source gaps and conformance blockers.
* `CORE`: classified C260 Appendix E version-change headings as historical references and the ArchiMate 4 migration source boundary.
* `CORE`: classified C260 Appendix F acronym tokens as vocabulary-only coverage outside ArchiMate 4 section coverage, source gaps, and conformance blockers.
* `DOCS`: refreshed current W262 and MEFF 4.0 XSD source evidence while keeping official conformance blocked on missing external sources.
* `DOCS`: added sanitized local ArchiMate PDF inventory evidence for C260 and W262 source classification.
* `DOCS`: added sanitized ArchiMate 4 license-boundary evidence for Appendix A/B source blockers.
* `CORE`: exposed the ArchiMate 4 implementation completion scan through `getArchimate4ImplementationStatus()`.
* `DOCS`: refreshed the ArchiMate 4 implementation-status completion scan evidence.
* `DOCS`: documented the experimental XML/relationship conformance boundary until official C260/MEFF 4 source data is supplied.
* `CORE`: linked C260 section coverage entries to implementation status API keys so chapter and appendix coverage cannot drift from exposed status summaries.
* `DOCS`: refreshed the implementation-status completion scan after adding section status-key guards.
* `DOCS`: added a scripted external-source recheck for W262 and MEFF 4.0 XSD evidence.
* `DOCS`: added a reusable ArchiMate 4 completion audit script for M0-M5 milestone verification.
* `DOCS`: added a reusable C260 coverage audit script for book-derived section, aggregate, outline, and source-runlog evidence.

## 0.0.4

* `FEAT`: text properties supported
   * Vertical alignment
   * Horizontal alignment
   * Bold
* `CORE`: all ArchiMate elements from Strategy, Business, Application and Technolgy layers supported
* `CORE`: all ArchiMate relationships supported except Junction

## 0.0.3

Initial release

* `FEAT`: create Note
* `CORE`: ArchiMate elements supported
    * Bussiness layer : Actor, Interface, Function, Process
    * Application layer : Interface, Function, Process
    * Technology layer : Interface, Function, Process
* `CORE`: ArchiMate relationships supported
    * Association

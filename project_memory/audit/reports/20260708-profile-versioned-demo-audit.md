# 2026-07-08 Profile-Versioned Demo Audit

## Result

PASS

## Scope

- ArchiMate 3.x versus 4.0 demo profile selection.
- Editor palette icon rendering by selected profile.
- Guard that Fontello glyph classes are not injected directly into diagram-js palette cells.
- Active-profile rejection for concepts and relationships outside the selected profile.
- Importer error propagation when display import encounters an invalid profile concept.

## Evidence

- `project_memory/runlogs/20260708-434-profile-versioned-demo-test-language.txt`
- `project_memory/runlogs/20260708-435-profile-versioned-demo-eslint-changed.txt`
- `project_memory/runlogs/20260708-436-profile-versioned-demo-git-diff-check.txt`
- `project_memory/runlogs/20260708-437-profile-versioned-demo-build.txt`
- `project_memory/runlogs/20260708-438-profile-versioned-demo-browser-smoke.json`
- `project_memory/runlogs/20260708-439-profile-boundary-error-browser-smoke.json`
- `project_memory/runlogs/20260708-441-profile-versioned-palette-visual-fix.json`

## Notes

- ArchiMate 4.0 palette entries retain semantic profile class names such as `archimate-common-role` and render through fixed-size SVG background images.
- Fontello element glyph classes remain available in `archimate-font`, but they are not injected directly into diagram-js palette cells because those font glyphs overflow the 22px palette boxes.
- ArchiMate 3.x palette entries keep the existing SVG background-image classes.
- `ElementFactory` rejects unavailable element and relationship types through the active language profile.
- `Importer` now propagates element/connection import failures instead of logging and continuing.

## Remaining External Dependencies

- Official ArchiMate 4 Appendix B relationship matrix remains external-profile driven.
- MEFF 4.0 XSD details remain dependent on the official XSD becoming available or being supplied.
- Exact C260 Appendix A vector artwork redistribution remains unconfirmed; current Fontello glyphs come from local renderer pictogram paths and fallback local shapes.

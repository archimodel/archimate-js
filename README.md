# archimate-js

Create an ArchiMate® diagrams modeler builds on [diagram-js](https://github.com/bpmn-io/diagram-js) modeler engine from [bpmn.io](https://bpmn.io/) project.

ArchiMate® is a registered trademark of [The Open Group](https://www.opengroup.org/archimate-forum/archimate-overview).

## Features

* Create/modify ArchiMate® models and views
* Import/export ArchiMate® model in XML format

## ArchiMate Version Selection

`archimate-js` defaults to the existing ArchiMate 3.x behavior.

```js
import Modeler from 'archimate-js/lib/Modeler';

const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: '4.0'
});
```

Use `archimateVersion: '4.0'` to create and edit ArchiMate 4 models. Existing 3.x models continue to import without requiring migration.

If you have a licensed ArchiMate 4 Appendix B relationship profile, pass it when constructing the viewer or modeler:

```js
const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: '4.0',
  archimate4RelationshipProfile: appendixBRelationshipProfile
});
```

The supplied profile may be an object, a JSON string, a row array, a header-row matrix array, or `{ matrixText }` CSV/TSV text loaded by the host application. It is validated against the ArchiMate 4 concept set, including elements, relationship connectors, and relationship types, before replacing the bundled compatibility fallback. Complete profiles must include every source-target cell, using an empty value for cells with no allowed relationship.

Use `getArchimate4RelationshipProfileStatus()` to confirm whether the active relationship profile is still the compatibility fallback or an external profile that passed complete source and target-cell validation. The status includes `targetCellCount` and `expectedTargetCellCount` so hosts can audit that blank Appendix B cells were explicitly supplied rather than omitted.

Implementation-defined ArchiMate language customization can be supplied with `archimateLanguageProfile`. New custom concepts must declare the standard concept they specialize so relationship rules can fall back to the base concept:

```js
const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: '4.0',
  archimateLanguageProfile: {
    version: '4.0',
    domains: [
      { name: 'Risk', color: '#E8D7FF' }
    ],
    elements: [
      {
        type: 'RiskEvent',
        specializes: 'Event',
        domain: 'Risk',
        aspect: 'Behavior',
        typeName: 'Risk Event',
        className: 'archimate-risk-event',
        pictoRef: 'PICTO_EVENT'
      }
    ],
    attributes: [
      { concept: 'RiskEvent', name: 'severity', type: 'String' }
    ],
    viewpoints: [
      {
        id: 'risk-summary',
        name: 'Risk Summary',
        viewpointPurpose: [ 'Deciding' ],
        viewpointContent: [ 'Overview' ],
        allowedElementTypes: [ 'RiskEvent', 'Assessment' ],
        allowedRelationshipTypes: [ 'Association', 'Influence' ]
      }
    ]
  }
});
```

## ArchiMate 4 Notes

* ArchiMate 4 support uses versioned language profiles.
* Implementation-defined language customization can add domains, attributes, and specialized concepts through `archimateLanguageProfile`.
* Viewpoint metadata can be retained on views through `viewpoint` or `viewpointRef`, and custom viewpoint definitions can be supplied in `archimateLanguageProfile.viewpoints`.
* Retired 3.x concepts are hidden from the 4.0 palette, while all 42 standard ArchiMate 4 elements remain available.
* 3.x to 4.0 migration preserves original type and original domain information when the replacement would otherwise lose modeling intent.
* 3.x Physical concepts are retained as ArchiMate 4 Technology Domain concepts while preserving `Physical` as original-domain metadata.
* Migration also stores preserved specialization and original-domain metadata in model properties for exchange-friendly retention.
* 3.x to 4.0 migration warnings include alternative replacement types for ambiguous C260 Appendix E rows.
* 3.x to 4.0 migration can validate migrated relationships with a host-supplied Appendix B relationship validator and warn or replace invalid relationship types.
* Junctions are exposed as relationship connectors without counting them as ArchiMate 4 elements.
* Junction-connected relationships are constrained to the same relationship type and checked against the active relationship profile for direct endpoint validity.
* Named junctions keep the `AND`/`OR` marker visible and render the optional modeler-supplied name below the connector.
* Relationship popup labels use the C260 direct/reverse role names while retaining the underlying relationship type for editing.
* Renderer pictograms use the active language profile `pictoRef`, including ArchiMate 4 spelling-corrected entries and custom specialized concepts.
* ArchiMate 4 `Grouping`, `Location`, and `Plateau` can aggregate relationship concepts, including relationships and junctions.
* `deriveRelationship()` and `deriveRelationshipType()` expose C260-derived DR1-DR8 valid relationship derivations for host tooling, including specialization transitivity, weakest structural derivation, dependency/dynamic derivation, Flow opposite-direction derivation, and Triggering transitivity.
* Imported and edited Access, Association, and Influence relationship options use explicit `accessType`, `isDirected`, and `modifier` properties while retaining `typeOption` compatibility.
* Influence relationship modifiers are preserved and rendered; the ArchiMate 4 popup includes quick actions for positive/negative influence and a custom sign/strength modifier input.
* Relationship multiplicity is supported on relationship ends with positive integer, `*` / `0..*`, or finite `n..m` notation, except where an end is connected to a junction. `0..*` is normalized to the canonical `*` value, and the ArchiMate 4 relationship popup can edit custom source/target multiplicity values.
* Official XML conformance depends on the availability and redistribution rights of the ArchiMate 4 Model Exchange File Format XSD and C260-derived relationship matrix.
* The bundled 4.0 relationship rules are compatibility-derived fallback data until the official source package is supplied.

## Demo

Run `npm run demo:build`, then open `demo/index.html` from the local static server. The Viewer and
Editor demos load an ArchiMate 4 sample with Common Domain `Role`, `Service`, `Path`, and `Grouping`
notation. The Editor palette uses dedicated Common Domain icons instead of the old Business or
Technology colored assets for those consolidated ArchiMate 4 concepts.

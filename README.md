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

The supplied profile is validated against the ArchiMate 4 element catalog before replacing the bundled compatibility fallback.

## ArchiMate 4 Notes

* ArchiMate 4 support uses versioned language profiles.
* Retired 3.x concepts are hidden from the 4.0 palette.
* 3.x to 4.0 migration preserves original type information when the replacement would otherwise lose modeling intent.
* Relationship multiplicity is supported on relationship ends, except where an end is connected to a junction.
* Official XML conformance depends on the availability and redistribution rights of the ArchiMate 4 Model Exchange File Format XSD and C260-derived relationship matrix.
* The bundled 4.0 relationship rules are compatibility-derived fallback data until the official source package is supplied.

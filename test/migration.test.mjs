import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  migrateArchimate3ModelTo4,
  ORIGINAL_ARCHIMATE3_TYPE_PROPERTY,
  SPECIALIZATION_PROPERTY
} from '../lib/migration/archimate3-to-4.js';
import { ARCHIMATE_3_TO_4_MIGRATIONS } from '../lib/metamodel/languages/retired-concepts.js';

test('migration table covers retired public ArchiMate 4 concepts', async () => {
  const source = await readFile(new URL('../lib/metamodel/languages/retired-concepts.js', import.meta.url), 'utf8');

  for (const type of [
    'BusinessInteraction',
    'ApplicationInteraction',
    'TechnologyInteraction',
    'Constraint',
    'Contract',
    'Gap',
    'Representation',
    'ImplementationEvent'
  ]) {
    assert.equal(source.includes("[ '" + type + "'"), true, `${type} needs a migration action`);
  }
});

test('migration table preserves ArchiMate 4 domain-specific interfaces', async () => {
  const source = await readFile(new URL('../lib/metamodel/languages/retired-concepts.js', import.meta.url), 'utf8');

  for (const type of [
    'BusinessInterface',
    'ApplicationInterface',
    'TechnologyInterface'
  ]) {
    assert.equal(source.includes("[ '" + type + "'"), false, `${type} remains an ArchiMate 4 element`);
  }

  assert.doesNotMatch(source, /replacement: 'Interface'/);
});

test('migration table does not introduce a generic ArchiMate 4 Interface element', async () => {
  const profile = await readFile(new URL('../lib/metamodel/languages/archimate4-profile.json', import.meta.url), 'utf8');

  assert.doesNotMatch(profile, /"type": "Interface"/);
});

test('migration utility preserves specialization information', async () => {
  const source = await readFile(new URL('../lib/migration/archimate3-to-4.js', import.meta.url), 'utf8');

  assert.match(source, /originalArchiMate3Type/);
  assert.match(source, /specialization/);
  assert.match(source, /warnings\.push/);
});

test('migration table records C260-derived ambiguous replacement candidates', () => {
  assert.equal(ARCHIMATE_3_TO_4_MIGRATIONS.get('Representation').replacement, 'DataObject');
  assert.deepEqual(
    ARCHIMATE_3_TO_4_MIGRATIONS.get('Representation').alternativeReplacements,
    [ 'Artifact', 'Material' ]
  );
  assert.deepEqual(
    ARCHIMATE_3_TO_4_MIGRATIONS.get('Gap').alternativeReplacements,
    [ 'Deliverable' ]
  );
  assert.deepEqual(
    ARCHIMATE_3_TO_4_MIGRATIONS.get('BusinessInteraction').alternativeReplacements,
    [ 'Function' ]
  );
  assert.equal(ARCHIMATE_3_TO_4_MIGRATIONS.get('ImplementationEvent').preserveSpecialization, true);
});

test('migration utility reports alternative replacement types for ambiguous C260 rows', () => {
  const model = {
    elementsNode: {
      baseElements: [
        { id: 'representation-1', type: 'Representation' },
        { id: 'event-1', type: 'ImplementationEvent' }
      ]
    }
  };

  const result = migrateArchimate3ModelTo4(model);

  assert.equal(model.elementsNode.baseElements[0].type, 'DataObject');
  assert.equal(model.elementsNode.baseElements[0].specialization, 'Representation');
  assert.deepEqual(result.warnings[0].alternativeReplacementTypes, [ 'Artifact', 'Material' ]);

  assert.equal(model.elementsNode.baseElements[1].type, 'Event');
  assert.equal(model.elementsNode.baseElements[1].specialization, 'ImplementationEvent');
});

test('migration utility stores specialization profile metadata as model properties', () => {
  const model = {
    elementsNode: {
      baseElements: [
        { id: 'contract-1', type: 'Contract' }
      ]
    }
  };

  migrateArchimate3ModelTo4(model);
  migrateArchimate3ModelTo4(model);

  const definitions = model.propertyDefinitionsNode.propertyDefinitions;
  const definitionNames = definitions.map((definition) => definition.name);
  const properties = model.elementsNode.baseElements[0].propertiesNode.properties;

  assert.equal(model.elementsNode.baseElements[0].type, 'BusinessObject');
  assert.deepEqual(definitionNames, [
    ORIGINAL_ARCHIMATE3_TYPE_PROPERTY,
    SPECIALIZATION_PROPERTY
  ]);
  assert.deepEqual(properties.map((property) => property.value), [
    'Contract',
    'Contract'
  ]);
  assert.equal(properties.length, 2);
});

test('migration utility can skip specialization profile metadata', () => {
  const model = {
    elementsNode: {
      baseElements: [
        { id: 'contract-1', type: 'Contract' }
      ]
    }
  };

  migrateArchimate3ModelTo4(model, { preserveSpecializations: false });

  assert.equal(model.elementsNode.baseElements[0].type, 'BusinessObject');
  assert.equal(model.elementsNode.baseElements[0].propertiesNode, undefined);
  assert.equal(model.propertyDefinitionsNode, undefined);
});

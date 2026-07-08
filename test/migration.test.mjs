import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  migrateArchimate3ModelTo4,
  ORIGINAL_ARCHIMATE3_DOMAIN_PROPERTY,
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
  assert.equal(ARCHIMATE_3_TO_4_MIGRATIONS.get('Representation').originalDomain, 'Business');
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

test('migration table records original domains for merged common-domain concepts', () => {
  assert.equal(ARCHIMATE_3_TO_4_MIGRATIONS.get('BusinessService').originalDomain, 'Business');
  assert.equal(ARCHIMATE_3_TO_4_MIGRATIONS.get('ApplicationProcess').originalDomain, 'Application');
  assert.equal(ARCHIMATE_3_TO_4_MIGRATIONS.get('TechnologyFunction').originalDomain, 'Technology');
  assert.equal(ARCHIMATE_3_TO_4_MIGRATIONS.get('Path').originalDomain, 'Technology');
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
  assert.equal(model.elementsNode.baseElements[0].originalArchiMate3Domain, 'Business');
  assert.deepEqual(result.warnings[0].alternativeReplacementTypes, [ 'Artifact', 'Material' ]);
  assert.equal(result.warnings[0].originalDomain, 'Business');

  assert.equal(model.elementsNode.baseElements[1].type, 'Event');
  assert.equal(model.elementsNode.baseElements[1].specialization, 'ImplementationEvent');
  assert.equal(model.elementsNode.baseElements[1].originalArchiMate3Domain, 'Implementation & Migration');
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
    SPECIALIZATION_PROPERTY,
    ORIGINAL_ARCHIMATE3_DOMAIN_PROPERTY
  ]);
  assert.deepEqual(properties.map((property) => property.value), [
    'Contract',
    'Contract',
    'Business'
  ]);
  assert.equal(properties.length, 3);
});

test('migration utility stores original domain for merged behavior concepts', () => {
  const model = {
    elementsNode: {
      baseElements: [
        { id: 'business-service-1', type: 'BusinessService' },
        { id: 'path-1', type: 'Path' }
      ]
    }
  };

  const result = migrateArchimate3ModelTo4(model);
  const service = model.elementsNode.baseElements[0];
  const path = model.elementsNode.baseElements[1];

  assert.equal(service.type, 'Service');
  assert.equal(service.originalArchiMate3Domain, 'Business');
  assert.equal(path.type, 'Path');
  assert.equal(path.originalArchiMate3Domain, 'Technology');
  assert.equal(result.warnings[0].originalDomain, 'Business');
  assert.equal(result.warnings[1].originalDomain, 'Technology');
});

test('migration utility preserves original physical domain for technology-domain concepts', () => {
  const physicalTypes = [ 'DistributionNetwork', 'Equipment', 'Facility', 'Material' ];
  const model = {
    elementsNode: {
      baseElements: physicalTypes.map((type, index) => ({ id: 'physical-' + index, type }))
    }
  };

  const result = migrateArchimate3ModelTo4(model);

  assert.deepEqual(
    model.propertyDefinitionsNode.propertyDefinitions.map((definition) => definition.name),
    [ ORIGINAL_ARCHIMATE3_DOMAIN_PROPERTY ]
  );

  physicalTypes.forEach((type, index) => {
    const element = model.elementsNode.baseElements[index];
    const warning = result.warnings[index];
    const properties = element.propertiesNode.properties;

    assert.equal(element.type, type);
    assert.equal(element.originalArchiMate3Domain, 'Physical');
    assert.equal(element.originalArchiMate3Type, undefined);
    assert.equal(element.specialization, undefined);
    assert.equal(properties.length, 1);
    assert.equal(properties[0].propertyDefinitionRef.name, ORIGINAL_ARCHIMATE3_DOMAIN_PROPERTY);
    assert.equal(properties[0].value, 'Physical');
    assert.equal(warning.originalType, type);
    assert.equal(warning.replacementType, type);
    assert.equal(warning.originalDomain, 'Physical');
  });
});

test('migration utility can replace invalid relationships with an external profile validator', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'BusinessRole' };
  const relationship = {
    id: 'relationship-1',
    type: 'Composition',
    source: actor,
    target: role
  };
  const profile = { version: '4.0' };
  const calls = [];
  const model = {
    elementsNode: {
      baseElements: [ actor, role ]
    },
    relationshipsNode: {
      relationships: [ relationship ]
    }
  };

  const result = migrateArchimate3ModelTo4(model, {
    relationshipProfile: profile,
    isRelationshipAllowed(sourceType, targetType, relationshipType, activeProfile) {
      calls.push({ sourceType, targetType, relationshipType, activeProfile });

      return false;
    }
  });
  const relationshipWarning = result.warnings.find((warning) => warning.relationshipId === 'relationship-1');

  assert.deepEqual(calls, [
    {
      sourceType: 'BusinessActor',
      targetType: 'Role',
      relationshipType: 'Composition',
      activeProfile: profile
    }
  ]);
  assert.equal(relationship.type, 'Association');
  assert.equal(relationshipWarning.originalType, 'Composition');
  assert.equal(relationshipWarning.replacementType, 'Association');
  assert.equal(relationshipWarning.sourceType, 'BusinessActor');
  assert.equal(relationshipWarning.targetType, 'Role');
  assert.match(relationshipWarning.message, /replaced with Association/);
});

test('migration utility can warn without replacing invalid relationships', () => {
  const relationship = {
    id: 'relationship-1',
    type: 'Composition',
    source: { id: 'source-1', type: 'BusinessActor' },
    target: { id: 'target-1', type: 'Role' }
  };
  const model = {
    relationshipsNode: {
      relationships: [ relationship ]
    }
  };

  const result = migrateArchimate3ModelTo4(model, {
    replaceInvalidRelationships: false,
    isRelationshipAllowed() {
      return false;
    }
  });
  const relationshipWarning = result.warnings.find((warning) => warning.relationshipId === 'relationship-1');

  assert.equal(relationship.type, 'Composition');
  assert.equal(relationshipWarning.replacementType, 'Association');
  assert.match(relationshipWarning.message, /recommended replacement is Association/);
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

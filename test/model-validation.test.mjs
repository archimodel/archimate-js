import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  validateArchimate4Model,
  validateArchimateModel
} from '../lib/validation/archimate4-model.js';

function diagnosticCodes(result) {
  return result.diagnostics.map((diagnostic) => diagnostic.code);
}

function findDiagnostic(result, code) {
  return result.diagnostics.find((diagnostic) => diagnostic.code === code);
}

test('archimate 4 model validation reports retired ArchiMate 3 element types', () => {
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        { id: 'service-1', type: 'BusinessService' }
      ]
    }
  });
  const diagnostic = findDiagnostic(result, 'retired-element-type');

  assert.equal(result.valid, false);
  assert.equal(result.errorCount, 1);
  assert.equal(diagnostic.elementId, 'service-1');
  assert.equal(diagnostic.type, 'BusinessService');
  assert.equal(diagnostic.replacementType, 'Service');
  assert.equal(diagnostic.originalDomain, 'Business');
});

test('archimate model validation can detect 4.0 concepts in a 3.x profile', () => {
  const result = validateArchimateModel({
    elementsNode: {
      baseElements: [
        { id: 'common-service-1', type: 'Service' }
      ]
    }
  }, {
    archimateVersion: '3.2'
  });
  const diagnostic = findDiagnostic(result, 'unsupported-element-type');

  assert.equal(result.valid, false);
  assert.equal(result.archimateVersion, '3.2');
  assert.equal(diagnostic.elementId, 'common-service-1');
  assert.equal(diagnostic.type, 'Service');
  assert.equal(diagnostic.archimateVersion, '3.2');
});

test('archimate 4 model validation reports unsupported relationship types and endpoints', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const unsupported = { id: 'legacy-1', type: 'BusinessInteraction' };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [ actor, unsupported ]
    },
    relationshipsNode: {
      relationships: [
        {
          id: 'relationship-1',
          type: 'MaterialFlow',
          source: actor,
          target: unsupported
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });

  assert.equal(result.valid, false);
  assert.deepEqual(diagnosticCodes(result), [
    'retired-element-type',
    'unsupported-relationship-type',
    'unsupported-relationship-endpoint-type'
  ]);
  assert.equal(findDiagnostic(result, 'unsupported-relationship-type').relationshipType, 'MaterialFlow');
  assert.equal(findDiagnostic(result, 'unsupported-relationship-endpoint-type').endpoint, 'target');
});

test('archimate 4 model validation can call an active relationship validator', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'Role' };
  const calls = [];
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [ actor, role ]
    },
    relationshipsNode: {
      relationships: [
        {
          id: 'relationship-1',
          type: 'Assignment',
          source: actor,
          target: role
        }
      ]
    }
  }, {
    isRelationshipAllowed(sourceType, targetType, relationshipType, profile) {
      calls.push({ sourceType, targetType, relationshipType, version: profile.version });

      return false;
    }
  });

  assert.equal(result.valid, false);
  assert.deepEqual(calls, [
    {
      sourceType: 'BusinessActor',
      targetType: 'Role',
      relationshipType: 'Assignment',
      version: '4.0'
    }
  ]);
  assert.equal(findDiagnostic(result, 'disallowed-relationship').relationshipId, 'relationship-1');
});

test('archimate 4 model validation rejects invalid or junction multiplicity', () => {
  const junction = { id: 'junction-1', type: 'OrJunction' };
  const role = { id: 'role-1', type: 'Role' };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [ junction, role ]
    },
    relationshipsNode: {
      relationships: [
        {
          id: 'relationship-1',
          type: 'Flow',
          source: junction,
          target: role,
          sourceMultiplicity: '1',
          targetMultiplicity: '1..*'
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });

  assert.equal(result.valid, false);
  assert.deepEqual(diagnosticCodes(result), [
    'source-junction-multiplicity',
    'invalid-target-multiplicity',
    'target-junction-multiplicity'
  ]);
});

test('archimate 4 model validation reports mixed relationship types at a junction', () => {
  const source = { id: 'source-1', type: 'BusinessActor' };
  const junction = { id: 'junction-1', type: 'AndJunction' };
  const target = { id: 'target-1', type: 'Role' };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [ source, junction, target ]
    },
    relationshipsNode: {
      relationships: [
        {
          id: 'relationship-1',
          type: 'Assignment',
          source: source,
          target: junction
        },
        {
          id: 'relationship-2',
          type: 'Flow',
          source: junction,
          target: target
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const diagnostic = findDiagnostic(result, 'mixed-junction-relationship-types');

  assert.equal(result.valid, false);
  assert.deepEqual(diagnostic.relationshipTypes, [ 'Assignment', 'Flow' ]);
  assert.deepEqual(diagnostic.relationshipIds, [ 'relationship-1', 'relationship-2' ]);
});

test('archimate 4 model validation is exported from the package root', async () => {
  const source = await readFile(new URL('../index.js', import.meta.url), 'utf8');

  assert.match(source, /validateArchimate4Model/);
  assert.match(source, /validateArchimateModel/);
  assert.match(source, /lib\/validation\/archimate4-model/);
});

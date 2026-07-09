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

test('archimate 4 model validation reports invalid viewpoint definitions', () => {
  const result = validateArchimate4Model({
    views: {
      viewpointsNode: {
        viewpoints: [
          {
            id: 'viewpoint-1',
            viewpointPurpose: 'Planning',
            viewpointContent: [ 'Overview', 'DeepDive' ],
            allowedElementTypes: [
              'BusinessActor',
              'BusinessInteraction',
              {}
            ],
            allowedRelationshipTypes: [
              'Association',
              { type: 'UnknownRelationship' },
              {}
            ],
            concerns: [
              null,
              {
                label: 42,
                documentation: false,
                stakeholdersNode: {
                  stakeholders: [
                    'missing-object',
                    {
                      label: 100
                    }
                  ]
                }
              }
            ]
          }
        ]
      },
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewpointRef: 'missing-viewpoint'
          },
          {
            id: 'view-2',
            viewpointRef: {}
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('unsupported-viewpoint-purpose'), true);
  assert.equal(codes.includes('unsupported-viewpoint-content'), true);
  assert.equal(codes.includes('unsupported-viewpoint-element-type'), true);
  assert.equal(codes.includes('invalid-viewpoint-element-type-entry'), true);
  assert.equal(codes.includes('unsupported-viewpoint-relationship-type'), true);
  assert.equal(codes.includes('invalid-viewpoint-relationship-type-entry'), true);
  assert.equal(codes.includes('unknown-viewpoint-reference'), true);
  assert.equal(codes.includes('invalid-viewpoint-reference'), true);
  assert.equal(codes.includes('invalid-viewpoint-concern-entry'), true);
  assert.equal(codes.includes('invalid-concern-label'), true);
  assert.equal(codes.includes('invalid-concern-documentation'), true);
  assert.equal(codes.includes('invalid-stakeholder-entry'), true);
  assert.equal(codes.includes('invalid-stakeholder-label'), true);
  assert.equal(findDiagnostic(result, 'unsupported-viewpoint-purpose').viewpointId, 'viewpoint-1');
  assert.equal(findDiagnostic(result, 'unknown-viewpoint-reference').viewId, 'view-1');
});

test('archimate 4 model validation accepts valid viewpoint definitions', () => {
  const result = validateArchimate4Model({
    views: {
      viewpoints: [
        {
          id: 'viewpoint-1',
          viewpointPurpose: 'Deciding',
          viewpointContent: [ 'Overview', 'Coherence' ],
          allowedElementTypes: [
            'BusinessActor',
            { type: 'Role' }
          ],
          allowedRelationshipTypes: 'Association Flow',
          concerns: [
            {
              label: 'Risk concern',
              documentation: 'Risk view concern',
              stakeholdersNode: {
                stakeholders: [
                  {
                    label: 'Architecture Board'
                  }
                ]
              }
            }
          ]
        }
      ],
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewpointRef: 'viewpoint-1'
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.diagnostics, []);
});

test('archimate 4 model validation reports invalid view element references', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const legacyElement = { id: 'legacy-1', type: 'BusinessInteraction' };
  const relationship = {
    id: 'relationship-1',
    type: 'Association',
    source: actor,
    target: actor
  };
  const unsupportedRelationship = {
    id: 'relationship-2',
    type: 'MaterialFlow',
    source: actor,
    target: actor
  };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        actor,
        legacyElement
      ]
    },
    relationshipsNode: {
      relationships: [
        relationship,
        unsupportedRelationship
      ]
    },
    views: {
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewElements: [
              {
                id: 'node-missing',
                elementRef: 'missing-element'
              },
              {
                id: 'node-relationship',
                elementRef: 'relationship-1'
              },
              {
                id: 'node-invalid',
                elementRef: {}
              },
              {
                id: 'node-parent',
                nodes: [
                  {
                    id: 'node-retired',
                    elementRef: 'legacy-1'
                  }
                ]
              },
              {
                id: 'connection-missing',
                relationshipRef: 'missing-relationship'
              },
              {
                id: 'connection-element',
                relationshipRef: 'actor-1'
              },
              {
                id: 'connection-invalid',
                relationshipRef: {}
              },
              {
                id: 'connection-unsupported',
                relationshipRef: 'relationship-2'
              }
            ]
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('retired-element-type'), true);
  assert.equal(codes.includes('unsupported-relationship-type'), true);
  assert.equal(codes.includes('unknown-view-element-reference'), true);
  assert.equal(codes.includes('invalid-view-element-reference'), true);
  assert.equal(codes.includes('unsupported-view-element-reference-type'), true);
  assert.equal(codes.includes('unknown-view-relationship-reference'), true);
  assert.equal(codes.includes('invalid-view-relationship-reference'), true);
  assert.equal(codes.includes('unsupported-view-relationship-reference-type'), true);
  assert.equal(findDiagnostic(result, 'unknown-view-element-reference').viewElementId, 'node-missing');
  assert.equal(findDiagnostic(result, 'invalid-view-relationship-reference').viewElementId, 'connection-invalid');
});

test('archimate 4 model validation accepts valid view element references', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'Role' };
  const relationship = {
    id: 'relationship-1',
    type: 'Association',
    source: actor,
    target: role
  };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        actor,
        role
      ]
    },
    relationshipsNode: {
      relationships: [
        relationship
      ]
    },
    views: {
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewElements: [
              {
                id: 'node-actor',
                elementRef: 'actor-1'
              },
              {
                id: 'node-role-parent',
                nodes: [
                  {
                    id: 'node-role',
                    elementRef: role
                  }
                ]
              },
              {
                id: 'connection-1',
                relationshipRef: 'relationship-1'
              }
            ]
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.diagnostics, []);
});

test('archimate 4 model validation reports invalid profile attribute properties', () => {
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        {
          id: 'risk-event-1',
          type: 'RiskEvent',
          propertiesNode: {
            properties: [
              {
                propertyDefinitionRef: {
                  name: 'archimate-js:profileAttribute:RiskEvent:severity'
                },
                value: 'high'
              },
              {
                propertyDefinitionRef: {
                  name: 'archimate-js:profileAttribute:RiskEvent:unknown'
                },
                value: 'x'
              }
            ]
          }
        }
      ]
    }
  }, {
    customization: {
      version: '4.0',
      elements: [
        {
          type: 'RiskEvent',
          specializes: 'Event',
          domain: 'Common',
          aspect: 'behavior',
          className: 'event',
          typeName: 'Risk Event'
        }
      ],
      attributes: [
        {
          concept: 'RiskEvent',
          name: 'severity',
          type: 'Integer'
        }
      ]
    },
    validateRelationshipRules: false
  });

  assert.equal(result.valid, false);
  assert.equal(findDiagnostic(result, 'invalid-profile-attribute-value').conceptId, 'risk-event-1');
  assert.equal(findDiagnostic(result, 'invalid-profile-attribute-value').attributeType, 'Integer');
  assert.equal(findDiagnostic(result, 'unsupported-profile-attribute').propertyName, 'archimate-js:profileAttribute:RiskEvent:unknown');
});

test('archimate 4 model validation is exported from the package root', async () => {
  const source = await readFile(new URL('../index.js', import.meta.url), 'utf8');

  assert.match(source, /validateArchimate4Model/);
  assert.match(source, /validateArchimateModel/);
  assert.match(source, /lib\/validation\/archimate4-model/);
});

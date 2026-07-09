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

test('archimate 4 model validation reports invalid base object name and documentation fields', () => {
  const actor = {
    id: 'actor-1',
    type: 'BusinessActor',
    name: 42,
    documentation: false
  };
  const role = { id: 'role-1', type: 'Role' };
  const result = validateArchimate4Model({
    id: 'model-1',
    name: 9,
    documentation: [],
    elementsNode: {
      baseElements: [
        actor,
        role
      ]
    },
    relationshipsNode: {
      relationships: [
        {
          id: 'relationship-1',
          type: 'Association',
          source: actor,
          target: role,
          name: [],
          documentation: {}
        }
      ]
    },
    views: {
      viewpointsNode: {
        viewpoints: [
          {
            id: 'viewpoint-1',
            name: {},
            documentation: []
          }
        ]
      },
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            name: false,
            documentation: 1
          }
        ]
      }
    },
    organizationsNode: {
      organizations: [
        {
          id: 'organization-1',
          name: 123,
          documentation: [],
          identifierRef: 'actor-1'
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);
  const invalidNameDiagnostics = result.diagnostics.filter((diagnostic) => {
    return diagnostic.code === 'invalid-base-object-name';
  });
  const invalidDocumentationDiagnostics = result.diagnostics.filter((diagnostic) => {
    return diagnostic.code === 'invalid-base-object-documentation';
  });

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-base-object-name'), true);
  assert.equal(codes.includes('invalid-base-object-documentation'), true);
  assert.equal(invalidNameDiagnostics.length, 6);
  assert.equal(invalidDocumentationDiagnostics.length, 6);
  assert.equal(invalidNameDiagnostics[0].field, 'name');
  assert.equal(invalidDocumentationDiagnostics[0].field, 'documentation');
});

test('archimate 4 model validation rejects invalid xsi type fields', () => {
  const actor = {
    id: 'actor-1',
    type: 'BusinessActor',
    'xsi:type': false
  };
  const role = { id: 'role-1', type: 'Role' };
  const relationship = {
    id: 'relationship-1',
    type: 'Association',
    source: actor,
    target: role,
    'xsi:type': 42
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
                elementRef: actor,
                'xsi:type': []
              }
            ]
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });
  const conceptDiagnostics = result.diagnostics.filter((diagnostic) => {
    return diagnostic.code === 'invalid-concept-xsi-type';
  });
  const viewElementDiagnostic = findDiagnostic(result, 'invalid-view-element-xsi-type');

  assert.equal(result.valid, false);
  assert.equal(conceptDiagnostics.length, 2);
  assert.equal(conceptDiagnostics[0].field, 'xsi:type');
  assert.equal(conceptDiagnostics[0].valueType, 'boolean');
  assert.equal(conceptDiagnostics[1].valueType, 'number');
  assert.equal(viewElementDiagnostic.viewElementId, 'node-actor');
  assert.equal(viewElementDiagnostic.valueType, 'object');
});

test('archimate 4 model validation reports invalid present IdObject ids', () => {
  const actor = { id: 42, type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'Role' };
  const result = validateArchimate4Model({
    id: false,
    elementsNode: {
      baseElements: [
        actor,
        role
      ]
    },
    relationshipsNode: {
      relationships: [
        {
          id: {},
          type: 'Association',
          source: actor,
          target: role
        }
      ]
    },
    views: {
      viewpointsNode: {
        viewpoints: [
          {
            id: []
          }
        ]
      },
      diagrams: {
        viewsList: [
          {
            id: 0,
            viewElements: [
              {
                id: 99,
                elementRef: actor
              }
            ]
          }
        ]
      }
    },
    organizationsNode: {
      organizations: [
        {
          id: ''
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const diagnostics = result.diagnostics.filter((diagnostic) => {
    return diagnostic.code === 'invalid-id-object-id';
  });

  assert.equal(result.valid, false);
  assert.equal(diagnostics.length, 7);
  assert.deepEqual(diagnostics.map((diagnostic) => diagnostic.ownerKind), [
    'model',
    'element',
    'relationship',
    'viewpoint',
    'view',
    'organization',
    'viewElement'
  ]);
  assert.equal(diagnostics[0].field, 'id');
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

test('archimate 4 model validation reports invalid concept container structure', () => {
  const invalidElementsNodeResult = validateArchimate4Model({
    elementsNode: 'not-an-elements-node'
  }, {
    validateRelationshipRules: false
  });
  const invalidElementListResult = validateArchimate4Model({
    elementsNode: {
      baseElements: 'not-an-element-list'
    }
  }, {
    validateRelationshipRules: false
  });
  const invalidElementEntryResult = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        null,
        'not-an-element'
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const invalidRelationshipsNodeResult = validateArchimate4Model({
    relationshipsNode: 'not-a-relationships-node'
  }, {
    validateRelationshipRules: false
  });
  const invalidRelationshipListResult = validateArchimate4Model({
    relationshipsNode: {
      relationships: 'not-a-relationship-list'
    }
  }, {
    validateRelationshipRules: false
  });
  const invalidRelationshipEntryResult = validateArchimate4Model({
    relationshipsNode: {
      relationships: [
        null,
        'not-a-relationship'
      ]
    }
  }, {
    validateRelationshipRules: false
  });

  assert.equal(invalidElementsNodeResult.valid, false);
  assert.equal(diagnosticCodes(invalidElementsNodeResult).includes('invalid-elements-node'), true);

  assert.equal(invalidElementListResult.valid, false);
  assert.equal(diagnosticCodes(invalidElementListResult).includes('invalid-element-list'), true);

  assert.equal(invalidElementEntryResult.valid, false);
  assert.equal(diagnosticCodes(invalidElementEntryResult).includes('invalid-element-entry'), true);
  assert.equal(invalidElementEntryResult.diagnostics.filter((diagnostic) => {
    return diagnostic.code === 'invalid-element-entry';
  }).length, 2);

  assert.equal(invalidRelationshipsNodeResult.valid, false);
  assert.equal(diagnosticCodes(invalidRelationshipsNodeResult).includes('invalid-relationships-node'), true);

  assert.equal(invalidRelationshipListResult.valid, false);
  assert.equal(diagnosticCodes(invalidRelationshipListResult).includes('invalid-relationship-list'), true);

  assert.equal(invalidRelationshipEntryResult.valid, false);
  assert.equal(diagnosticCodes(invalidRelationshipEntryResult).includes('invalid-relationship-entry'), true);
  assert.equal(invalidRelationshipEntryResult.diagnostics.filter((diagnostic) => {
    return diagnostic.code === 'invalid-relationship-entry';
  }).length, 2);
});

test('archimate 4 model validation reports invalid and unknown relationship endpoint references', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'Role' };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [ actor, role ]
    },
    relationshipsNode: {
      relationships: [
        {
          id: 'relationship-invalid-source',
          type: 'Assignment',
          source: {},
          target: role
        },
        {
          id: 'relationship-unknown-target',
          type: 'Association',
          source: actor,
          target: 'missing-concept'
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-relationship-source-reference'), true);
  assert.equal(codes.includes('unknown-relationship-target-reference'), true);
  assert.equal(findDiagnostic(result, 'invalid-relationship-source-reference').relationshipId, 'relationship-invalid-source');
  assert.equal(findDiagnostic(result, 'unknown-relationship-target-reference').referenceId, 'missing-concept');
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

test('archimate 4 model validation reports invalid relationship option fields', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'Role' };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [ actor, role ]
    },
    relationshipsNode: {
      relationships: [
        {
          id: 'access-1',
          type: 'Access',
          source: actor,
          target: role,
          accessType: false
        },
        {
          id: 'association-1',
          type: 'Association',
          source: actor,
          target: role,
          isDirected: 'true'
        },
        {
          id: 'influence-1',
          type: 'Influence',
          source: actor,
          target: role,
          modifier: 7
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-relationship-access-type'), true);
  assert.equal(codes.includes('invalid-relationship-is-directed'), true);
  assert.equal(codes.includes('invalid-relationship-modifier'), true);
  assert.equal(findDiagnostic(result, 'invalid-relationship-access-type').relationshipId, 'access-1');
  assert.equal(findDiagnostic(result, 'invalid-relationship-is-directed').field, 'isDirected');
  assert.equal(findDiagnostic(result, 'invalid-relationship-modifier').valueType, 'number');
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

test('archimate 4 model validation rejects invalid view viewpoint attributes', () => {
  const result = validateArchimate4Model({
    views: {
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewpoint: 123
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });
  const diagnostic = findDiagnostic(result, 'invalid-view-viewpoint');

  assert.equal(result.valid, false);
  assert.equal(diagnostic.viewId, 'view-1');
  assert.equal(diagnostic.field, 'viewpoint');
  assert.equal(diagnostic.valueType, 'number');
});

test('archimate 4 model validation rejects non-string viewpoint allowed type entries', () => {
  const result = validateArchimate4Model({
    views: {
      viewpointsNode: {
        viewpoints: [
          {
            id: 'viewpoint-1',
            allowedElementTypes: [
              {
                type: 7
              }
            ],
            allowedRelationshipTypes: [
              {
                type: false
              }
            ]
          },
          {
            id: 'viewpoint-2',
            allowedElementTypes: 42
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-viewpoint-element-type-entry'), true);
  assert.equal(codes.includes('invalid-viewpoint-relationship-type-entry'), true);
  assert.equal(codes.includes('unsupported-viewpoint-element-type'), false);
  assert.equal(findDiagnostic(result, 'invalid-viewpoint-element-type-entry').valueType, 'number');
  assert.equal(findDiagnostic(result, 'invalid-viewpoint-relationship-type-entry').valueType, 'boolean');
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
          ],
          modelingNotes: [
            {
              type: 'usage',
              documentation: 'Use this viewpoint for risk overview reviews.'
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

test('archimate 4 model validation reports invalid viewpoint modeling notes', () => {
  const result = validateArchimate4Model({
    views: {
      viewpoints: [
        {
          id: 'viewpoint-invalid-list',
          modelingNotes: 'not-an-array'
        },
        {
          id: 'viewpoint-invalid-entry',
          modelingNotes: [
            null,
            {
              type: 42,
              documentation: false
            }
          ]
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-viewpoint-modeling-note-list'), true);
  assert.equal(codes.includes('invalid-viewpoint-modeling-note-entry'), true);
  assert.equal(codes.includes('invalid-modeling-note-type'), true);
  assert.equal(codes.includes('invalid-modeling-note-documentation'), true);
  assert.equal(findDiagnostic(result, 'invalid-viewpoint-modeling-note-list').viewpointId, 'viewpoint-invalid-list');
});

test('archimate 4 model validation reports invalid view tree structure', () => {
  const result = validateArchimate4Model({
    views: {
      diagrams: {
        viewsList: [
          'not-a-view',
          {
            id: 'view-invalid-elements',
            viewElements: 'not-a-view-element-list'
          },
          {
            id: 'view-invalid-node-children',
            viewElements: [
              {
                id: 'node-invalid-children',
                nodes: [
                  null,
                  'not-a-node'
                ]
              },
              {
                id: 'node-invalid-node-list',
                nodes: 'not-a-node-list'
              }
            ]
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });
  const invalidViewListResult = validateArchimate4Model({
    views: {
      diagrams: {
        viewsList: 'not-a-view-list'
      }
    }
  }, {
    validateRelationshipRules: false
  });
  const invalidDiagramsResult = validateArchimate4Model({
    views: {
      diagrams: 'not-a-diagrams-node'
    }
  }, {
    validateRelationshipRules: false
  });
  const invalidViewsResult = validateArchimate4Model({
    views: 'not-a-views-node'
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-view-entry'), true);
  assert.equal(codes.includes('invalid-view-element-list'), true);
  assert.equal(codes.includes('invalid-view-node-list'), true);
  assert.equal(codes.includes('invalid-view-node-entry'), true);
  assert.equal(findDiagnostic(result, 'invalid-view-element-list').viewId, 'view-invalid-elements');
  assert.equal(findDiagnostic(result, 'invalid-view-node-list').viewElementId, 'node-invalid-node-list');
  assert.equal(findDiagnostic(result, 'invalid-view-node-entry').viewElementId, 'node-invalid-children');

  assert.equal(invalidViewListResult.valid, false);
  assert.equal(diagnosticCodes(invalidViewListResult).includes('invalid-view-list'), true);

  assert.equal(invalidDiagramsResult.valid, false);
  assert.equal(diagnosticCodes(invalidDiagramsResult).includes('invalid-diagrams-node'), true);

  assert.equal(invalidViewsResult.valid, false);
  assert.equal(diagnosticCodes(invalidViewsResult).includes('invalid-views-node'), true);
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

test('archimate 4 model validation reports invalid view connection endpoint references', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const relationship = {
    id: 'relationship-1',
    type: 'Association',
    source: actor,
    target: actor
  };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        actor
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
                id: 'connection-invalid-source',
                relationshipRef: 'relationship-1',
                source: {},
                target: 'node-actor'
              },
              {
                id: 'connection-missing-target',
                relationshipRef: 'relationship-1',
                source: 'node-actor',
                target: 'missing-node'
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
  assert.equal(codes.includes('invalid-view-connection-source-reference'), true);
  assert.equal(codes.includes('unknown-view-connection-target-reference'), true);
  assert.equal(findDiagnostic(result, 'invalid-view-connection-source-reference').viewElementId, 'connection-invalid-source');
  assert.equal(findDiagnostic(result, 'unknown-view-connection-target-reference').referenceId, 'missing-node');
});

test('archimate 4 model validation reports view connection endpoint concept mismatches', () => {
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
                id: 'node-role',
                elementRef: 'role-1'
              },
              {
                id: 'connection-reversed',
                relationshipRef: 'relationship-1',
                source: 'node-role',
                target: 'node-actor'
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
  assert.equal(codes.includes('view-connection-source-concept-mismatch'), true);
  assert.equal(codes.includes('view-connection-target-concept-mismatch'), true);
  assert.equal(findDiagnostic(result, 'view-connection-source-concept-mismatch').expectedConceptId, 'actor-1');
  assert.equal(findDiagnostic(result, 'view-connection-target-concept-mismatch').actualConceptId, 'actor-1');
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
                relationshipRef: 'relationship-1',
                source: 'node-actor',
                target: 'node-role'
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

test('archimate 4 model validation reports invalid view node geometry', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        actor
      ]
    },
    views: {
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewElements: [
              {
                id: 'node-invalid-position',
                elementRef: 'actor-1',
                x: -1,
                y: 'not-a-number'
              },
              {
                id: 'node-invalid-size',
                elementRef: 'actor-1',
                w: 0,
                h: -20
              }
            ]
          }
        ]
      }
    }
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-view-node-x'), true);
  assert.equal(codes.includes('invalid-view-node-y'), true);
  assert.equal(codes.includes('invalid-view-node-width'), true);
  assert.equal(codes.includes('invalid-view-node-height'), true);
  assert.equal(findDiagnostic(result, 'invalid-view-node-x').viewElementId, 'node-invalid-position');
  assert.equal(findDiagnostic(result, 'invalid-view-node-width').value, 0);
});

test('archimate 4 model validation reports invalid view connection waypoint geometry', () => {
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
                id: 'node-role',
                elementRef: 'role-1'
              },
              {
                id: 'connection-1',
                relationshipRef: 'relationship-1',
                source: 'node-actor',
                target: 'node-role',
                waypointsNode: {
                  waypoints: [
                    { x: -1, y: 'not-a-number' },
                    { x: 10.5, y: 20 },
                    { x: 10, y: 20, original: { x: '', y: -4 } }
                  ]
                }
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
  assert.equal(codes.includes('invalid-view-connection-waypoint-x'), true);
  assert.equal(codes.includes('invalid-view-connection-waypoint-y'), true);
  assert.equal(findDiagnostic(result, 'invalid-view-connection-waypoint-x').viewElementId, 'connection-1');
  assert.equal(findDiagnostic(result, 'invalid-view-connection-waypoint-x').waypointIndex, 0);
  assert.equal(findDiagnostic(result, 'invalid-view-connection-waypoint-y').value, 'not-a-number');
});

test('archimate 4 model validation reports invalid view element label values', () => {
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        { id: 'actor-1', type: 'BusinessActor' }
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
                elementRef: 'actor-1',
                label: 42
              }
            ]
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });

  assert.equal(result.valid, false);
  assert.equal(findDiagnostic(result, 'invalid-view-element-label').viewElementId, 'node-actor');
  assert.equal(findDiagnostic(result, 'invalid-view-element-label').value, 42);
});

test('archimate 4 model validation reports invalid view style values', () => {
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        { id: 'actor-1', type: 'BusinessActor' }
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
                elementRef: 'actor-1',
                style: {
                  lineWidth: 0,
                  fillColor: { r: -1, g: 256, b: 'blue', a: 101 },
                  lineColor: 'not-a-color',
                  font: {
                    size: 10.25,
                    style: 'bold shadow',
                    color: { r: 20, g: 20 }
                  }
                }
              },
              {
                id: 'node-style',
                style: 'not-a-style'
              },
              {
                id: 'node-plain-style',
                style: {
                  font: {
                    style: 'plain bold'
                  }
                }
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
  assert.equal(codes.includes('invalid-view-style'), true);
  assert.equal(codes.includes('invalid-view-style-line-width'), true);
  assert.equal(codes.includes('invalid-view-style-color-channel'), true);
  assert.equal(codes.includes('invalid-view-style-color-alpha'), true);
  assert.equal(codes.includes('invalid-view-style-line-color'), true);
  assert.equal(codes.includes('invalid-view-style-font-size'), true);
  assert.equal(codes.includes('invalid-view-style-font-style'), true);
  assert.equal(codes.includes('invalid-view-style-font-plain-combination'), true);
  assert.equal(codes.includes('missing-view-style-color-channel'), true);
  assert.equal(findDiagnostic(result, 'invalid-view-style-line-width').viewElementId, 'node-actor');
  assert.equal(findDiagnostic(result, 'invalid-view-style-line-color').stylePath, 'style.lineColor');
  assert.equal(findDiagnostic(result, 'invalid-view-style-font-style').value, 'shadow');
  assert.equal(findDiagnostic(result, 'invalid-view-style-font-plain-combination').viewElementId, 'node-plain-style');
  assert.equal(findDiagnostic(result, 'missing-view-style-color-channel').stylePath, 'style.font.color.b');
  assert.equal(findDiagnostic(result, 'invalid-view-style').viewElementId, 'node-style');
});

test('archimate 4 model validation reports view content outside viewpoint allowed types', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'Role' };
  const association = {
    id: 'association-1',
    type: 'Association',
    source: actor,
    target: role
  };
  const flow = {
    id: 'flow-1',
    type: 'Flow',
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
        association,
        flow
      ]
    },
    views: {
      viewpointsNode: {
        viewpoints: [
          {
            id: 'viewpoint-1',
            allowedElementTypes: [
              'Role'
            ],
            allowedRelationshipTypes: [
              'Flow'
            ]
          }
        ]
      },
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewpointRef: 'viewpoint-1',
            viewElements: [
              {
                id: 'node-actor',
                elementRef: 'actor-1'
              },
              {
                id: 'node-role',
                elementRef: 'role-1'
              },
              {
                id: 'connection-association',
                relationshipRef: 'association-1'
              },
              {
                id: 'connection-flow',
                relationshipRef: 'flow-1'
              }
            ]
          }
        ]
      }
    }
  }, {
    validateRelationshipRules: false
  });
  const elementDiagnostic = findDiagnostic(result, 'view-node-outside-viewpoint-element-types');
  const relationshipDiagnostic = findDiagnostic(result, 'view-connection-outside-viewpoint-relationship-types');

  assert.equal(result.valid, false);
  assert.equal(elementDiagnostic.viewId, 'view-1');
  assert.equal(elementDiagnostic.viewElementId, 'node-actor');
  assert.equal(elementDiagnostic.viewpointId, 'viewpoint-1');
  assert.equal(elementDiagnostic.elementType, 'BusinessActor');
  assert.deepEqual(elementDiagnostic.allowedElementTypes, [ 'Role' ]);
  assert.equal(relationshipDiagnostic.viewId, 'view-1');
  assert.equal(relationshipDiagnostic.viewElementId, 'connection-association');
  assert.equal(relationshipDiagnostic.viewpointId, 'viewpoint-1');
  assert.equal(relationshipDiagnostic.relationshipType, 'Association');
  assert.deepEqual(relationshipDiagnostic.allowedRelationshipTypes, [ 'Flow' ]);
});

test('archimate 4 model validation accepts view content allowed by its viewpoint', () => {
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
      viewpoints: [
        {
          id: 'viewpoint-1',
          allowedElementTypes: 'BusinessActor Role',
          allowedRelationshipTypes: 'Association'
        }
      ],
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewpointRef: 'viewpoint-1',
            viewElements: [
              {
                id: 'node-actor',
                elementRef: actor
              },
              {
                id: 'node-role',
                elementRef: 'role-1'
              },
              {
                id: 'connection-1',
                relationshipRef: relationship
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

test('archimate 4 model validation applies profile viewpoints named by View.viewpoint', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'Role' };
  const association = {
    id: 'association-1',
    type: 'Association',
    source: actor,
    target: role
  };
  const flow = {
    id: 'flow-1',
    type: 'Flow',
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
        association,
        flow
      ]
    },
    views: {
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewpoint: 'profile-viewpoint-1',
            viewElements: [
              {
                id: 'node-actor',
                elementRef: 'actor-1'
              },
              {
                id: 'node-role',
                elementRef: 'role-1'
              },
              {
                id: 'connection-association',
                relationshipRef: 'association-1'
              },
              {
                id: 'connection-flow',
                relationshipRef: 'flow-1'
              }
            ]
          }
        ]
      }
    }
  }, {
    customization: {
      viewpoints: [
        {
          id: 'profile-viewpoint-1',
          allowedElementTypes: [
            'Role'
          ],
          allowedRelationshipTypes: [
            'Flow'
          ]
        }
      ]
    },
    validateRelationshipRules: false
  });
  const elementDiagnostic = findDiagnostic(result, 'view-node-outside-viewpoint-element-types');
  const relationshipDiagnostic = findDiagnostic(result, 'view-connection-outside-viewpoint-relationship-types');

  assert.equal(result.valid, false);
  assert.equal(elementDiagnostic.viewId, 'view-1');
  assert.equal(elementDiagnostic.viewpointId, 'profile-viewpoint-1');
  assert.equal(elementDiagnostic.elementType, 'BusinessActor');
  assert.deepEqual(elementDiagnostic.allowedElementTypes, [ 'Role' ]);
  assert.equal(relationshipDiagnostic.viewId, 'view-1');
  assert.equal(relationshipDiagnostic.viewpointId, 'profile-viewpoint-1');
  assert.equal(relationshipDiagnostic.relationshipType, 'Association');
  assert.deepEqual(relationshipDiagnostic.allowedRelationshipTypes, [ 'Flow' ]);
});

test('archimate 4 model validation keeps unknown View.viewpoint names as metadata', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const result = validateArchimate4Model({
    elementsNode: {
      baseElements: [
        actor
      ]
    },
    views: {
      diagrams: {
        viewsList: [
          {
            id: 'view-1',
            viewpoint: 'informative-name-only',
            viewElements: [
              {
                id: 'node-actor',
                elementRef: 'actor-1'
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

test('archimate 4 model validation reports invalid organization identifier references', () => {
  const actor = { id: 'actor-1', type: 'BusinessActor' };
  const role = { id: 'role-1', type: 'Role' };
  const legacyElement = { id: 'legacy-1', type: 'BusinessInteraction' };
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
        role,
        legacyElement
      ]
    },
    relationshipsNode: {
      relationships: [
        relationship
      ]
    },
    organizationsNode: {
      organizations: [
        {
          id: 'organization-invalid',
          identifierRef: {}
        },
        {
          id: 'organization-missing',
          identifierRef: 'missing-concept'
        },
        {
          id: 'organization-relationship',
          identifierRef: 'relationship-1'
        },
        {
          id: 'organization-parent',
          organizations: [
            {
              id: 'organization-legacy',
              identifierRef: 'legacy-1'
            }
          ]
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const invalidDiagnostic = findDiagnostic(result, 'invalid-organization-identifier-reference');
  const unknownDiagnostic = findDiagnostic(result, 'unknown-organization-identifier-reference');
  const unsupportedDiagnostic = findDiagnostic(result, 'unsupported-organization-identifier-reference-type');

  assert.equal(result.valid, false);
  assert.equal(invalidDiagnostic.organizationId, 'organization-invalid');
  assert.equal(unknownDiagnostic.organizationId, 'organization-missing');
  assert.equal(unknownDiagnostic.identifierRefId, 'missing-concept');
  assert.equal(unsupportedDiagnostic.organizationId, 'organization-legacy');
  assert.equal(unsupportedDiagnostic.identifierRefId, 'legacy-1');
  assert.equal(unsupportedDiagnostic.conceptType, 'BusinessInteraction');
  assert.equal(diagnosticCodes(result).includes('unknown-organization-identifier-reference'), true);
});

test('archimate 4 model validation reports invalid organization tree structure', () => {
  const invalidNodeResult = validateArchimate4Model({
    organizationsNode: 'not-an-organizations-node'
  }, {
    validateRelationshipRules: false
  });
  const invalidEntryResult = validateArchimate4Model({
    organizationsNode: {
      organizations: [
        'not-an-organization',
        {
          id: 'organization-parent',
          organizations: 'not-an-organization-list'
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const invalidNodeDiagnostic = findDiagnostic(invalidNodeResult, 'invalid-organizations-node');
  const invalidEntryCodes = diagnosticCodes(invalidEntryResult);

  assert.equal(invalidNodeResult.valid, false);
  assert.equal(invalidNodeDiagnostic.valueType, 'string');
  assert.equal(invalidEntryResult.valid, false);
  assert.equal(invalidEntryCodes.includes('invalid-organization-entry'), true);
  assert.equal(invalidEntryCodes.includes('invalid-organization-list'), true);
  assert.equal(findDiagnostic(invalidEntryResult, 'invalid-organization-list').parentOrganizationId, 'organization-parent');
});

test('archimate 4 model validation accepts organization references to model concepts', () => {
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
    organizationsNode: {
      organizations: [
        {
          id: 'organization-actor',
          identifierRef: 'actor-1',
          organizations: [
            {
              id: 'organization-relationship',
              identifierRef: relationship
            }
          ]
        },
        {
          id: 'organization-unclassified'
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.diagnostics, []);
});

test('archimate 4 model validation reports invalid property definition lists', () => {
  const result = validateArchimate4Model({
    propertyDefinitionsNode: {
      propertyDefinitions: 'not-an-array'
    }
  }, {
    validateRelationshipRules: false
  });
  const diagnostic = findDiagnostic(result, 'invalid-property-definition-list');

  assert.equal(result.valid, false);
  assert.equal(diagnostic.propertyDefinitionsNodePresent, true);
});

test('archimate 4 model validation reports invalid property definition entries', () => {
  const result = validateArchimate4Model({
    propertyDefinitionsNode: {
      propertyDefinitions: [
        null,
        {
          id: 42,
          name: false,
          type: []
        },
        {
          name: 'missing-id'
        }
      ]
    }
  }, {
    validateRelationshipRules: false
  });
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-property-definition-entry'), true);
  assert.equal(codes.includes('invalid-property-definition-id'), true);
  assert.equal(codes.includes('invalid-property-definition-name'), true);
  assert.equal(codes.includes('invalid-property-definition-type'), true);
});

test('archimate 4 model validation reports invalid property definition references', () => {
  const result = validateArchimate4Model({
    propertyDefinitionsNode: {
      propertyDefinitions: [
        {
          id: 'pd-severity',
          name: 'archimate-js:profileAttribute:RiskEvent:severity',
          type: 'Integer'
        }
      ]
    },
    elementsNode: {
      baseElements: [
        {
          id: 'risk-event-1',
          type: 'RiskEvent',
          propertiesNode: {
            properties: [
              {
                propertyDefinitionRef: 'pd-severity',
                value: 7
              },
              {
                propertyDefinitionRef: 'pd-severity',
                value: 'high'
              },
              {
                propertyDefinitionRef: 'missing-definition',
                value: 'x'
              },
              {
                propertyDefinitionRef: {},
                value: 'x'
              },
              {
                value: 'x'
              }
            ]
          }
        },
        {
          id: 'risk-event-invalid-properties',
          type: 'RiskEvent',
          propertiesNode: {
            properties: 'not-an-array'
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
  const codes = diagnosticCodes(result);

  assert.equal(result.valid, false);
  assert.equal(codes.includes('invalid-profile-attribute-value'), true);
  assert.equal(codes.includes('unknown-property-definition-reference'), true);
  assert.equal(codes.includes('invalid-property-definition-reference'), true);
  assert.equal(codes.includes('missing-property-definition-reference'), true);
  assert.equal(codes.includes('invalid-properties-list'), true);
  assert.equal(codes.includes('invalid-property-value'), true);
  assert.equal(findDiagnostic(result, 'invalid-profile-attribute-value').propertyName, 'archimate-js:profileAttribute:RiskEvent:severity');
  assert.equal(findDiagnostic(result, 'unknown-property-definition-reference').propertyDefinitionId, 'missing-definition');
  assert.equal(findDiagnostic(result, 'invalid-property-value').propertyIndex, 0);
});

test('archimate 4 model validation accepts property definition references by id', () => {
  const result = validateArchimate4Model({
    propertyDefinitionsNode: {
      propertyDefinitions: [
        {
          id: 'pd-severity',
          name: 'archimate-js:profileAttribute:RiskEvent:severity',
          type: 'Integer'
        }
      ]
    },
    elementsNode: {
      baseElements: [
        {
          id: 'risk-event-1',
          type: 'RiskEvent',
          propertiesNode: {
            properties: [
              {
                propertyDefinitionRef: 'pd-severity',
                value: '4'
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

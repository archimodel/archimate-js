import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  canApplyRelationshipMultiplicity,
  getJunctionRelationshipTypeCandidates,
  isJunctionRelationshipTypeAllowed,
  isRelationshipConnectedToJunction
} from '../lib/util/JunctionUtil.js';
import {
  isValidRelationshipMultiplicity,
  normalizeRelationshipMultiplicity
} from '../lib/util/MultiplicityUtil.js';

test('relationship descriptor contains multiplicity attributes', async () => {
  const descriptor = await readFile(new URL('../lib/moddle/resources/archimate4.json', import.meta.url), 'utf8');

  assert.match(descriptor, /sourceMultiplicity/);
  assert.match(descriptor, /targetMultiplicity/);
});

test('element factory carries multiplicity from relationship refs', async () => {
  const source = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');

  assert.match(source, /canApplyRelationshipMultiplicity\(attrs\)/);
  assert.match(source, /normalizeRelationshipMultiplicity\(relationshipRef\.sourceMultiplicity\)/);
  assert.match(source, /normalizeRelationshipMultiplicity\(relationshipRef\.targetMultiplicity\)/);
});

test('connection updater persists relationship multiplicity fields', async () => {
  const source = await readFile(new URL('../lib/features/modeling/ConnectionUpdater.js', import.meta.url), 'utf8');

  assert.match(source, /delete relationship\.sourceMultiplicity/);
  assert.match(source, /canApplyRelationshipMultiplicity\(connection\)/);
  assert.match(source, /normalizeRelationshipMultiplicity\(connection\.sourceMultiplicity\)/);
  assert.match(source, /normalizeRelationshipMultiplicity\(connection\.targetMultiplicity\)/);
});

test('relationship replacement preserves editable multiplicity properties', async () => {
  const source = await readFile(new URL('../lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js', import.meta.url), 'utf8');

  assert.match(source, /sourceMultiplicity/);
  assert.match(source, /targetMultiplicity/);
  assert.match(source, /isRelationshipProperties/);
  assert.match(source, /applyRelationshipProperties/);
});

test('connection popup exposes ArchiMate 4 multiplicity actions', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');

  assert.match(source, /set-source-multiplicity-1/);
  assert.match(source, /set-target-multiplicity-star/);
  assert.match(source, /profile\.version !== '4\.0'/);
});

test('connection popup hides multiplicity actions on junction-connected relationships', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');

  assert.match(source, /canApplyRelationshipMultiplicity\(element\)/);
});

test('renderer displays relationship end multiplicities', async () => {
  const source = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(source, /connection\.sourceMultiplicity/);
  assert.match(source, /connection\.targetMultiplicity/);
  assert.match(source, /renderLabel\(parentGfx, sourceMultiplicity/);
});

test('relationship multiplicity notation follows the C260-derived subset', () => {
  assert.equal(isValidRelationshipMultiplicity('1'), true);
  assert.equal(isValidRelationshipMultiplicity('*'), true);
  assert.equal(isValidRelationshipMultiplicity('0..1'), true);
  assert.equal(isValidRelationshipMultiplicity('2..5'), true);
  assert.equal(normalizeRelationshipMultiplicity(' 2..5 '), '2..5');

  assert.equal(isValidRelationshipMultiplicity('0'), false);
  assert.equal(isValidRelationshipMultiplicity('1..1'), false);
  assert.equal(isValidRelationshipMultiplicity('1..*'), false);
  assert.equal(isValidRelationshipMultiplicity('0..*'), false);
  assert.equal(isValidRelationshipMultiplicity('-1..1'), false);
  assert.equal(isValidRelationshipMultiplicity('00..1'), false);
  assert.equal(normalizeRelationshipMultiplicity('abc'), '');
});

test('junction-connected relationships cannot carry multiplicity', () => {
  const regularConnection = {
    source: { type: 'BusinessActor' },
    target: { type: 'Role' }
  };
  const directJunctionConnection = {
    source: { type: 'AndJunction' },
    target: { type: 'Role' }
  };
  const importedJunctionConnection = {
    source: {
      businessObject: {
        elementRef: { type: 'OrJunction' }
      }
    },
    target: { type: 'Role' }
  };

  assert.equal(canApplyRelationshipMultiplicity(regularConnection), true);
  assert.equal(isRelationshipConnectedToJunction(directJunctionConnection), true);
  assert.equal(isRelationshipConnectedToJunction(importedJunctionConnection), true);
  assert.equal(canApplyRelationshipMultiplicity(directJunctionConnection), false);
  assert.equal(canApplyRelationshipMultiplicity(importedJunctionConnection), false);
});

test('junction relationship candidates follow existing relationship type', () => {
  const junction = {
    type: 'AndJunction',
    incoming: [
      { type: 'Serving' }
    ],
    outgoing: []
  };

  assert.deepEqual(getJunctionRelationshipTypeCandidates(
    { type: 'BusinessActor' },
    junction
  ), [ 'Serving' ]);
  assert.equal(isJunctionRelationshipTypeAllowed({ type: 'BusinessActor' }, junction, 'Serving'), true);
  assert.equal(isJunctionRelationshipTypeAllowed({ type: 'BusinessActor' }, junction, 'Flow'), false);
});

test('junction endpoint chain allows candidates only when direct endpoints allow the same relationship', () => {
  const profile = { version: '4.0' };
  const endpointAllowed = (sourceType, targetType, relationshipType, activeProfile) => {
    assert.equal(activeProfile, profile);

    return sourceType === 'BusinessActor' &&
      targetType === 'Role' &&
      relationshipType === 'Assignment';
  };
  const target = { type: 'Role' };
  const junction = {
    type: 'AndJunction',
    incoming: [],
    outgoing: [
      {
        type: 'Relationship',
        target: target,
        businessObject: {
          relationshipRef: { type: 'Assignment' }
        }
      }
    ]
  };

  assert.deepEqual(getJunctionRelationshipTypeCandidates(
    { type: 'BusinessActor' },
    junction,
    null,
    endpointAllowed,
    profile
  ), [ 'Assignment' ]);
  assert.equal(isJunctionRelationshipTypeAllowed(
    { type: 'BusinessActor' },
    junction,
    'Assignment',
    null,
    endpointAllowed,
    profile
  ), true);
});

test('junction endpoint chain rejects candidates when direct endpoints disallow the same relationship', () => {
  const endpointAllowed = (sourceType, targetType, relationshipType) => {
    return sourceType === 'BusinessActor' &&
      targetType === 'Role' &&
      relationshipType === 'Assignment';
  };
  const junction = {
    type: 'AndJunction',
    incoming: [],
    outgoing: [
      {
        type: 'Relationship',
        target: { type: 'Role' },
        businessObject: {
          relationshipRef: { type: 'Composition' }
        }
      }
    ]
  };

  assert.deepEqual(getJunctionRelationshipTypeCandidates(
    { type: 'BusinessActor' },
    junction,
    null,
    endpointAllowed
  ), []);
  assert.equal(isJunctionRelationshipTypeAllowed(
    { type: 'BusinessActor' },
    junction,
    'Composition',
    null,
    endpointAllowed
  ), false);
});

test('junction endpoint chain validates outgoing candidates against incoming endpoints', () => {
  const endpointAllowed = (sourceType, targetType, relationshipType) => {
    return sourceType === 'BusinessActor' &&
      targetType === 'Role' &&
      relationshipType === 'Assignment';
  };
  const source = { type: 'BusinessActor' };
  const junction = {
    type: 'AndJunction',
    incoming: [
      {
        type: 'Relationship',
        source: source,
        businessObject: {
          relationshipRef: { type: 'Assignment' }
        }
      }
    ],
    outgoing: []
  };

  assert.deepEqual(getJunctionRelationshipTypeCandidates(
    junction,
    { type: 'Role' },
    null,
    endpointAllowed
  ), [ 'Assignment' ]);
});

test('junction relationship candidates prefer relationshipRef type over generic connection type', () => {
  const junction = {
    type: 'AndJunction',
    incoming: [
      {
        type: 'Relationship',
        businessObject: {
          relationshipRef: { type: 'Assignment' }
        }
      }
    ],
    outgoing: []
  };

  assert.deepEqual(getJunctionRelationshipTypeCandidates(
    { type: 'BusinessActor' },
    junction
  ), [ 'Assignment' ]);
});

test('junction relationship candidates reject mixed existing relationship types', () => {
  const junction = {
    type: 'OrJunction',
    incoming: [
      { type: 'Serving' },
      { type: 'Flow' }
    ],
    outgoing: []
  };

  assert.deepEqual(getJunctionRelationshipTypeCandidates(
    { type: 'BusinessActor' },
    junction
  ), []);
  assert.equal(isJunctionRelationshipTypeAllowed({ type: 'BusinessActor' }, junction, 'Serving'), false);
});

test('multiplicity is suppressed across import, replacement, and rendering for junction ends', async () => {
  const elementFactory = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');
  const replaceHandler = await readFile(new URL('../lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js', import.meta.url), 'utf8');
  const renderer = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(elementFactory, /canApplyRelationshipMultiplicity\(attrs\)/);
  assert.match(replaceHandler, /delete relationship\.sourceMultiplicity/);
  assert.match(replaceHandler, /delete connection\.sourceMultiplicity/);
  assert.match(renderer, /canRenderMultiplicity && normalizeRelationshipMultiplicity\(connection\.sourceMultiplicity\)/);
  assert.match(renderer, /canRenderMultiplicity && normalizeRelationshipMultiplicity\(connection\.targetMultiplicity\)/);
});

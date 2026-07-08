import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  getRelationshipProfileCoverageStats,
  getRelationshipProfileStats,
  normalizeRelationshipProfile,
  parseRelationshipProfile
} from '../lib/metamodel/languages/relationship-profile-loader.js';

async function readJson(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8');
  return JSON.parse(text);
}

test('archimate 4 relationship profile has no retired source or target concepts', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const retired = new Set(profile.retired);
  const elements = new Set(profile.elements.map((element) => element.type));

  for (const type of retired) {
    assert.equal(elements.has(type), false, `${type} must not be an ArchiMate 4 element`);
  }
});

test('archimate 4 relationship fallback is compatibility-derived and replaceable', async () => {
  const source = await readFile(new URL('../lib/metamodel/languages/archimate4-relationships.js', import.meta.url), 'utf8');
  const loaderSource = await readFile(new URL('../lib/metamodel/languages/relationship-profile-loader.js', import.meta.url), 'utf8');
  const entrypoint = await readFile(new URL('../index.js', import.meta.url), 'utf8');
  const baseViewer = await readFile(new URL('../lib/BaseViewer.js', import.meta.url), 'utf8');

  assert.match(source, /buildFallbackRelationships/);
  assert.match(source, /setArchimate4RelationshipProfile/);
  assert.match(source, /normalizeRelationshipProfile/);
  assert.match(source, /VALID_ARCHIMATE4_CONCEPT_TYPES/);
  assert.match(source, /archimate4Profile\.connectors/);
  assert.match(source, /archimate4Profile\.relationships/);
  assert.match(source, /requireCompleteTargets: true/);
  assert.match(loaderSource, /parseRelationshipProfile/);
  assert.match(loaderSource, /assertCompleteTargetCoverage/);
  assert.match(source, /getArchimate4RelationshipProfileStatus/);
  assert.match(source, /RELATIONSHIP_PROFILE_OPTIONS/);
  assert.match(source, /getRelationshipProfileCoverageStats/);
  assert.match(source, /targetCellCount/);
  assert.match(source, /conceptCount/);
  assert.match(source, /expectedTargetCellCount/);
  assert.match(source, /completeSourceCoverage/);
  assert.match(source, /completeTargetCoverage/);
  assert.doesNotMatch(source, /completeTargetCoverage:\s*RELATIONSHIP_PROFILE_OPTIONS\.requireCompleteTargets/);
  assert.match(source, /toArchimate4Type/);
  assert.match(entrypoint, /setArchimate4RelationshipProfile/);
  assert.match(entrypoint, /getArchimate4RelationshipProfileStatus/);
  assert.match(baseViewer, /archimate4RelationshipProfile/);
  assert.match(baseViewer, /normalizeArchimateVersion\(options\.archimateVersion\) !== '4\.0'/);
  assert.match(baseViewer, /setArchimate4RelationshipProfile\(/);
});

test('connection rules evaluate relationships through the active language profile', async () => {
  const source = await readFile(new URL('../lib/features/rules/ArchimateRules.js', import.meta.url), 'utf8');

  assert.match(source, /ArchimateRules\(eventBus, languageProfile\)/);
  assert.match(source, /ArchimateRules\.\$inject = \[ 'eventBus', 'languageProfile' \]/);
  assert.match(source, /this\._languageProfile = languageProfile/);
  assert.match(source, /var profile = this\._languageProfile && this\._languageProfile\.get\(\)/);
  assert.match(source, /getRelationshipConceptAggregationType\(source, target, profile\)/);
  assert.match(source, /canConnect\(source, target, connection, profile\)/);
  assert.match(source, /isRelationshipConnectedToJunction\(\{ source: source, target: target \}\)/);
  assert.match(source, /isJunctionRelationshipTypeAllowed\(source, target, connection\.type, connection, isRelationshipAllowed, profile\)/);
  assert.match(source, /isRelationshipAllowed\(source\.type, target\.type, connection\.type, profile\)/);
});

test('connection popup includes ArchiMate 4 relationship-concept aggregation helper', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');

  assert.match(source, /getRelationshipConceptAggregationType\(source, target, profile\)/);
  assert.match(source, /return aggregationType !== excludedRelationType \? \[ aggregationType \] : \[\]/);
});

test('archimate 4 relationship profile loader accepts object maps with names and codes', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role',
    'Service'
  ]);
  const maps = normalizeRelationshipProfile({
    sources: {
      BusinessActor: {
        Role: [ 'Assignment', 'Serving', 'i' ],
        Service: 'v'
      },
      Role: {},
      Service: {}
    }
  }, validTypes, { requireComplete: true });

  assert.equal(maps.get('BusinessActor').get('Role'), 'iv');
  assert.equal(maps.get('BusinessActor').get('Service'), 'v');
  assert.deepEqual(getRelationshipProfileStats(maps), {
    sourceCount: 3,
    relationshipCount: 2
  });
});

test('archimate 4 relationship profile loader accepts JSON string profiles', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role',
    'Service'
  ]);
  const profileText = JSON.stringify({
    sources: {
      BusinessActor: {
        Role: [ 'Assignment' ]
      },
      Role: {},
      Service: {}
    }
  });
  const maps = normalizeRelationshipProfile(profileText, validTypes, { requireComplete: true });

  assert.equal(maps.get('BusinessActor').get('Role'), 'i');
});

test('archimate 4 relationship profile loader reports invalid JSON strings clearly', () => {
  assert.throws(() => parseRelationshipProfile('{bad json'), /relationship profile JSON could not be parsed/);
});

test('archimate 4 relationship profile loader accepts row arrays', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);
  const maps = normalizeRelationshipProfile([
    { source: 'BusinessActor', target: 'Role', relationships: 'Assignment Specialization' },
    { sourceType: 'Role', targetType: 'BusinessActor', allowed: 'o' }
  ], validTypes, { requireComplete: false });

  assert.equal(maps.get('BusinessActor').get('Role'), 'is');
  assert.equal(maps.get('Role').get('BusinessActor'), 'o');
});

test('archimate 4 relationship profile loader accepts matrix arrays', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);
  const maps = normalizeRelationshipProfile({
    matrix: [
      [ 'source', 'BusinessActor', 'Role' ],
      [ 'BusinessActor', '', 'Assignment' ],
      [ 'Role', 'Association', '' ]
    ]
  }, validTypes, {
    requireComplete: true,
    requireCompleteTargets: true
  });

  assert.equal(maps.get('BusinessActor').get('Role'), 'i');
  assert.equal(maps.get('Role').get('BusinessActor'), 'o');
  assert.equal(maps.get('Role').has('Role'), false);
});

test('archimate 4 relationship profile coverage stats count explicit target cells', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);
  const completeStats = getRelationshipProfileCoverageStats({
    matrix: [
      [ 'source', 'BusinessActor', 'Role' ],
      [ 'BusinessActor', '', 'Assignment' ],
      [ 'Role', 'Association', '' ]
    ]
  }, validTypes);
  const partialStats = getRelationshipProfileCoverageStats({
    BusinessActor: {
      Role: 'Assignment'
    },
    Role: {}
  }, validTypes);

  assert.deepEqual(completeStats, {
    sourceCount: 2,
    targetCellCount: 4,
    expectedSourceCount: 2,
    expectedTargetCellCount: 4,
    completeSourceCoverage: true,
    completeTargetCoverage: true
  });
  assert.equal(partialStats.sourceCount, 2);
  assert.equal(partialStats.targetCellCount, 1);
  assert.equal(partialStats.completeSourceCoverage, true);
  assert.equal(partialStats.completeTargetCoverage, false);
});

test('archimate 4 relationship profile loader accepts matrix text', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);
  const tsvMaps = normalizeRelationshipProfile({
    matrixText: 'source\tBusinessActor\tRole\nBusinessActor\t\tAssignment\nRole\tAssociation\t'
  }, validTypes, {
    requireComplete: true,
    requireCompleteTargets: true
  });
  const csvMaps = normalizeRelationshipProfile({
    matrixText: 'source,BusinessActor,Role\nBusinessActor,,Assignment\nRole,Association,""',
    matrixDelimiter: ','
  }, validTypes, {
    requireComplete: true,
    requireCompleteTargets: true
  });

  assert.equal(tsvMaps.get('BusinessActor').get('Role'), 'i');
  assert.equal(tsvMaps.get('Role').get('BusinessActor'), 'o');
  assert.equal(csvMaps.get('BusinessActor').get('Role'), 'i');
  assert.equal(csvMaps.get('Role').get('BusinessActor'), 'o');
});

test('archimate 4 relationship profile accepts relationship concepts and junctions', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const validTypes = new Set(getArchimate4RelationshipProfileConceptTypes(profile));

  const maps = normalizeRelationshipProfile({
    Grouping: {
      Aggregation: 'Aggregation',
      AndJunction: 'Aggregation'
    },
    Aggregation: {
      Location: 'Aggregation'
    },
    AndJunction: {
      BusinessActor: 'Association'
    }
  }, validTypes, { requireComplete: false });

  assert.equal(maps.get('Grouping').get('Aggregation'), 'g');
  assert.equal(maps.get('Grouping').get('AndJunction'), 'g');
  assert.equal(maps.get('Aggregation').get('Location'), 'g');
  assert.equal(maps.get('AndJunction').get('BusinessActor'), 'o');
});

test('archimate 4 complete relationship profile can require every target cell', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);
  const maps = normalizeRelationshipProfile({
    BusinessActor: {
      BusinessActor: '',
      Role: 'Assignment'
    },
    Role: {
      BusinessActor: '',
      Role: ''
    }
  }, validTypes, {
    requireComplete: true,
    requireCompleteTargets: true
  });

  assert.equal(maps.get('BusinessActor').get('Role'), 'i');
  assert.equal(maps.get('Role').size, 0);

  assert.throws(() => normalizeRelationshipProfile({
    BusinessActor: {
      Role: 'Assignment'
    },
    Role: {
      BusinessActor: '',
      Role: ''
    }
  }, validTypes, {
    requireComplete: true,
    requireCompleteTargets: true
  }), /missing target element: BusinessActor -> BusinessActor/);
});

test('archimate 4 row-array profiles keep blank complete sources', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);
  const maps = normalizeRelationshipProfile([
    { source: 'BusinessActor', target: 'BusinessActor', relationships: '' },
    { source: 'BusinessActor', target: 'Role', relationships: 'Assignment' },
    { source: 'Role', target: 'BusinessActor', relationships: '' },
    { source: 'Role', target: 'Role', relationships: '' }
  ], validTypes, {
    requireComplete: true,
    requireCompleteTargets: true
  });

  assert.equal(maps.has('Role'), true);
  assert.equal(maps.get('Role').size, 0);
});

test('archimate 4 complete relationship profile requires relationship concept sources', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const validTypes = new Set(getArchimate4RelationshipProfileConceptTypes(profile));
  const sources = {};

  for (const concept of profile.elements.map((element) => element.type)) {
    sources[concept] = {};
  }

  assert.throws(() => normalizeRelationshipProfile({ sources }, validTypes, {
    requireComplete: true
  }), /missing source element: AndJunction/);
});

test('archimate 4 relationship profile loader rejects retired or generic element types', () => {
  const validTypes = new Set([
    'BusinessInterface',
    'Role'
  ]);

  assert.throws(() => normalizeRelationshipProfile({
    Interface: { Role: 'Assignment' }
  }, validTypes), /Unknown ArchiMate 4 source element: Interface/);

  assert.throws(() => normalizeRelationshipProfile({
    BusinessInterface: { BusinessInteraction: 'Serving' }
  }, validTypes), /Unknown ArchiMate 4 target element: BusinessInteraction/);
});

test('archimate 4 relationship profile loader rejects unknown relationship codes', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);

  assert.throws(() => normalizeRelationshipProfile({
    BusinessActor: { Role: 'x' }
  }, validTypes), /Unsupported ArchiMate 4 relationship code "x"/);
});

test('archimate 4 relationship profile loader can require complete source coverage', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);

  assert.throws(() => normalizeRelationshipProfile({
    BusinessActor: { Role: 'Assignment' }
  }, validTypes, { requireComplete: true }), /missing source element: Role/);
});

function getArchimate4RelationshipProfileConceptTypes(profile) {
  return profile.elements.map((element) => element.type).concat(
    profile.connectors.map((connector) => connector.type),
    profile.relationships
  );
}

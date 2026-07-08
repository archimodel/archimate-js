import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  getRelationshipProfileCoverageReport,
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
  assert.match(source, /getArchimate4RelationshipProfileCoverageReport/);
  assert.match(source, /RELATIONSHIP_PROFILE_OPTIONS/);
  assert.match(source, /getRelationshipProfileCoverageReport/);
  assert.match(source, /targetCellCount/);
  assert.match(source, /missingSourceCount/);
  assert.match(source, /missingTargetCellCount/);
  assert.match(source, /conceptCount/);
  assert.match(source, /expectedTargetCellCount/);
  assert.match(source, /completeSourceCoverage/);
  assert.match(source, /completeTargetCoverage/);
  assert.doesNotMatch(source, /completeTargetCoverage:\s*RELATIONSHIP_PROFILE_OPTIONS\.requireCompleteTargets/);
  assert.match(source, /toArchimate4Type/);
  assert.match(entrypoint, /setArchimate4RelationshipProfile/);
  assert.match(entrypoint, /getArchimate4RelationshipProfileStatus/);
  assert.match(entrypoint, /getArchimate4RelationshipProfileCoverageReport/);
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

test('existing relationship lookup ignores incomplete relationship endpoints', async () => {
  const source = await readFile(new URL('../lib/util/RelationshipUtil.js', import.meta.url), 'utf8');

  assert.match(source, /element\.source && element\.target/);
  assert.match(source, /if \(!source \|\| !target\) \{\n {4}return \[\];/);
  assert.match(source, /source\.businessObject\.elementRef && source\.businessObject\.elementRef\.id/);
  assert.match(source, /source\.businessObject\.relationshipRef && source\.businessObject\.relationshipRef\.id/);
  assert.match(source, /target\.businessObject\.relationshipRef && target\.businessObject\.relationshipRef\.id/);
  assert.match(source, /if \(!sourceRefId \|\| !targetRefId\) \{\n {4}return existingRelationships;/);
});

test('connection popup includes ArchiMate 4 relationship-concept aggregation helper', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');

  assert.match(source, /getRelationshipConceptAggregationType\(source, target, profile\)/);
  assert.match(source, /return aggregationType !== excludedRelationType \? \[ aggregationType \] : \[\]/);
});

test('connection popup labels relationships with C260 role names', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionOptions.js', import.meta.url), 'utf8');

  for (const label of [
    'Composed of',
    'Composed in',
    'Aggregates',
    'Aggregated in',
    'Assigned to',
    'Has assigned',
    'Realizes',
    'Realized by',
    'Serves',
    'Served by',
    'Accesses',
    'Accessed by',
    'Influences',
    'Influenced by',
    'Associated to',
    'Associated from',
    'Triggers',
    'Triggered by',
    'Flows to',
    'Flows from',
    'Specializes',
    'Specialized by'
  ]) {
    assert.equal(source.includes(`'${label}'`), true, `${label} role label must be present`);
  }

  assert.match(source, /relationshipType: relationshipType/);
  assert.match(source, /cloneRelationshipMenu\(\s*menu,\s*menuName,\s*relationshipType,\s*relationshipDefinition,\s*direct\s*\)/);
  assert.match(source, /relationshipDefinition\.directLabel/);
  assert.match(source, /relationshipDefinition\.reverseLabel/);
  assert.doesNotMatch(source, /label:\s*RELATIONSHIP_/);
  assert.equal(source.includes("'Part of'"), false);
  assert.equal(source.includes("'Aggregated by'"), false);
  assert.equal(source.includes("'Assigned from'"), false);
  assert.equal(source.includes("'Specialization of'"), false);
});

test('connection popup exposes influence modifier actions', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');

  assert.match(source, /RELATIONSHIP_INFLUENCE/);
  assert.match(source, /_getInfluenceModifier/);
  assert.match(source, /set-influence-modifier-positive/);
  assert.match(source, /set-influence-modifier-negative/);
  assert.match(source, /modifier: entry\.active \? '' : entry\.options\.modifier/);
});

test('connection popup exposes explicit Access type actions', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');

  for (const entryId of [
    'set-access-type-none',
    'set-access-type-read',
    'set-access-type-write',
    'set-access-type-readwrite'
  ]) {
    assert.equal(source.includes(`id: '${entryId}'`), true, `${entryId} must be present`);
  }

  assert.match(source, /RELATIONSHIP_ACCESS_NONE/);
  assert.match(source, /var isNone = !accessType \|\| accessType === RELATIONSHIP_ACCESS_NONE/);
  assert.match(source, /title: translate\('None'\)/);
  assert.match(source, /accessType: RELATIONSHIP_ACCESS_NONE/);
  assert.match(source, /active: isNone/);
});

test('connection popup exposes ArchiMate 4 custom influence modifier input', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');

  assert.match(source, /set-influence-modifier-custom/);
  assert.match(source, /profile && profile\.version === '4\.0'/);
  assert.match(source, /readInfluenceModifierValue/);
  assert.match(source, /window\.prompt/);
  assert.match(source, /Use a sign or strength value/);
  assert.match(source, /modifier: value/);
  assert.match(source, /return String\(value\)\.trim\(\)/);
});

test('renderer displays influence modifier labels', async () => {
  const source = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(source, /RELATIONSHIP_INFLUENCE/);
  assert.match(source, /getInfluenceModifier\(connection\)/);
  assert.match(source, /renderLabel\(parentGfx, modifier/);
  assert.doesNotMatch(source, /TODO vbo add modifier management/);
});

test('relationship option attributes hydrate, persist and render explicit properties', async () => {
  const elementFactory = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');
  const connectionUpdater = await readFile(new URL('../lib/features/modeling/ConnectionUpdater.js', import.meta.url), 'utf8');
  const replaceHandler = await readFile(new URL('../lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js', import.meta.url), 'utf8');
  const popupProvider = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');
  const renderer = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(elementFactory, /accessType: relationshipRef && relationshipRef\.accessType/);
  assert.match(elementFactory, /isDirected: relationshipRef && relationshipRef\.isDirected/);
  assert.match(elementFactory, /modifier: relationshipRef && relationshipRef\.modifier/);
  assert.match(connectionUpdater, /getRelationshipOptionValue\(connection, 'modifier'\)/);
  assert.match(connectionUpdater, /getRelationshipOptionValue\(connection, 'accessType'\)/);
  assert.match(connectionUpdater, /getRelationshipOptionValue\(connection, 'isDirected'\)/);
  assert.doesNotMatch(connectionUpdater, /connection\.modifier \|\| connection\.typeOption/);
  assert.match(replaceHandler, /getRelationshipPropertyValue\(properties, connection, 'modifier'\)/);
  assert.match(replaceHandler, /setConnectionRelationshipOption\(connection, 'isDirected', newRelationshipRef\.isDirected\)/);
  assert.match(popupProvider, /getRelationshipOptionValue\(element, 'accessType'\)/);
  assert.match(popupProvider, /getRelationshipFlagValue\(element, 'isDirected'\)/);
  assert.match(popupProvider, /getRelationshipOptionValue\(element, 'modifier'\)/);
  assert.match(renderer, /var accessType = getAccessType\(connection\)/);
  assert.match(renderer, /if \(isAssociationDirected\(connection\)\)/);
  assert.match(renderer, /getRelationshipOptionValue\(connection, 'modifier'\)/);
  assert.match(renderer, /if \(value !== undefined && value !== null\)/);
  assert.match(renderer, /return value === true \|\| value === 'true'/);
});

test('renderer preserves optional junction names outside the marker', async () => {
  const source = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(source, /function getJunctionDisplayLabel\(shape, elementType\)/);
  assert.match(source, /label === 'AND' \|\| label === 'OR'/);
  assert.match(source, /var junctionLabel = getJunctionDisplayLabel\(shape, elementType\)/);
  assert.match(source, /renderLabel\(parentGfx, junctionLabel/);
  assert.match(source, /y: shape\.height \+ 2/);
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

test('archimate 4 relationship profile coverage report lists missing sources and target cells', () => {
  const validTypes = new Set([
    'BusinessActor',
    'Role'
  ]);
  const report = getRelationshipProfileCoverageReport({
    BusinessActor: {
      Role: 'Assignment'
    }
  }, validTypes);

  assert.deepEqual(report.missingSourceTypes, [ 'Role' ]);
  assert.deepEqual(report.missingTargetCells, [
    { source: 'BusinessActor', target: 'BusinessActor' },
    { source: 'Role', target: 'BusinessActor' },
    { source: 'Role', target: 'Role' }
  ]);
  assert.equal(report.missingSourceCount, 1);
  assert.equal(report.missingTargetCellCount, 3);
  assert.equal(report.completeSourceCoverage, false);
  assert.equal(report.completeTargetCoverage, false);
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

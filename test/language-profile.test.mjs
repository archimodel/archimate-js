import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readJson(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8');
  return JSON.parse(text);
}

test('archimate 3 profile keeps retired 3.x concepts for compatibility', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate3-profile.json');
  const types = new Set(profile.elements.map((element) => element.type));

  assert.equal(profile.version, '3.2');
  assert.equal(types.has('BusinessInteraction'), true);
  assert.equal(types.has('ApplicationInteraction'), true);
  assert.equal(types.has('TechnologyInteraction'), true);
  assert.equal(types.has('Constraint'), true);
  assert.equal(types.has('Contract'), true);
  assert.equal(types.has('Gap'), true);
  assert.equal(types.has('Representation'), true);
  assert.equal(types.has('AndJunction'), true);
  assert.equal(types.has('OrJunction'), true);
});

test('archimate 4 profile removes retired 3.x concepts', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const types = new Set(profile.elements.map((element) => element.type));

  assert.equal(profile.version, '4.0');
  assert.equal(types.has('BusinessInteraction'), false);
  assert.equal(types.has('ApplicationInteraction'), false);
  assert.equal(types.has('TechnologyInteraction'), false);
  assert.equal(types.has('Constraint'), false);
  assert.equal(types.has('Contract'), false);
  assert.equal(types.has('Gap'), false);
  assert.equal(types.has('Representation'), false);
  assert.equal(types.has('ImplementationEvent'), false);
  assert.equal(types.has('Interface'), false);
  assert.equal(types.has('Service'), true);
  assert.equal(types.has('Process'), true);
  assert.equal(types.has('Function'), true);
  assert.equal(types.has('Event'), true);
  assert.equal(types.has('Path'), true);
  assert.equal(types.has('BusinessInterface'), true);
  assert.equal(types.has('ApplicationInterface'), true);
  assert.equal(types.has('TechnologyInterface'), true);
});

test('archimate 4 profile exposes Common Domain', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const domains = new Set(profile.domains.map((domain) => domain.name));

  assert.equal(domains.has('Common'), true);
  assert.equal(domains.has('Business'), true);
  assert.equal(domains.has('Application'), true);
  assert.equal(domains.has('Technology'), true);
});

test('archimate 4 profile matches the C260 element catalog', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const officialCatalog = await readJson('./fixtures/archimate4-c260-element-catalog.json');

  assert.equal(officialCatalog.elements.length, 42);
  assert.equal(profile.elements.length, 42);
  assert.deepEqual(
    profile.elements.map((element) => element.type).sort(),
    officialCatalog.elements.slice().sort()
  );

  const elements = new Map(profile.elements.map((element) => [ element.type, element ]));

  for (const [ type, classification ] of Object.entries(officialCatalog.classifications)) {
    assert.equal(elements.get(type).domain, classification.domain, `${type} domain`);
    assert.equal(elements.get(type).aspect, classification.aspect, `${type} aspect`);
  }
});

test('archimate 4 exposes relationship junction connectors outside the element catalog', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const elements = new Set(profile.elements.map((element) => element.type));
  const connectors = new Map(profile.connectors.map((connector) => [ connector.type, connector ]));

  assert.equal(profile.elements.length, 42);
  assert.equal(elements.has('AndJunction'), false);
  assert.equal(elements.has('OrJunction'), false);
  assert.equal(connectors.get('AndJunction').typeName, 'And Junction');
  assert.equal(connectors.get('OrJunction').typeName, 'Or Junction');
  assert.notEqual(connectors.get('AndJunction').palette, false);
  assert.notEqual(connectors.get('OrJunction').palette, false);
});

test('profile-aware metadata and palette include relationship junction connectors', async () => {
  const modelUtil = await readFile(new URL('../lib/util/ModelUtil.js', import.meta.url), 'utf8');
  const colorUtil = await readFile(new URL('../lib/util/ColorUtil.js', import.meta.url), 'utf8');
  const paletteProvider = await readFile(new URL('../lib/features/palette/PaletteProvider.js', import.meta.url), 'utf8');

  assert.match(modelUtil, /\(profile\.elements \|\| \[\]\)\.concat\(profile\.connectors \|\| \[\]\)/);
  assert.match(colorUtil, /\['Relationships', COLOR_DOMAIN_RELATIONSHIPS\]/);
  assert.match(paletteProvider, /getPaletteConcepts\(profile\)/);
  assert.match(paletteProvider, /\(profile\.elements \|\| \[\]\)\.concat\(profile\.connectors \|\| \[\]\)/);
});

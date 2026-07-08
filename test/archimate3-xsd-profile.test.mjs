import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readJson(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8');
  return JSON.parse(text);
}

async function readText(path) {
  return readFile(new URL(path, import.meta.url), 'utf8');
}

test('archimate 3 profile matches official 3.1 ElementTypeEnum', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate3-profile.json');
  const officialEnum = await readJson('./fixtures/archimate3-element-type-enum.json');

  assert.equal(officialEnum.source, 'https://www.opengroup.org/xsd/archimate/3.1/archimate3_Model.xsd');
  assert.equal(officialEnum.values.length, 62);

  assert.deepEqual(
    profile.elements.map((element) => element.type).sort(),
    officialEnum.values.slice().sort()
  );
});

test('archimate 3 profile exposes relationship junction connector elements', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate3-profile.json');
  const elements = new Map(profile.elements.map((element) => [ element.type, element ]));

  assert.equal(elements.get('AndJunction').typeName, 'And Junction');
  assert.equal(elements.get('OrJunction').typeName, 'Or Junction');
  assert.notEqual(elements.get('AndJunction').palette, false);
  assert.notEqual(elements.get('OrJunction').palette, false);
});

test('junction implementation uses official xsd element names as model types', async () => {
  const conceptSource = await readText('../lib/metamodel/Concept.js');
  const modelUtilSource = await readText('../lib/util/ModelUtil.js');
  const factorySource = await readText('../lib/features/modeling/ElementFactory.js');
  const rendererSource = await readText('../lib/draw/ArchimateRenderer.js');

  assert.match(conceptSource, /OTHER_AND_JUNCTION = 'AndJunction'/);
  assert.match(conceptSource, /OTHER_OR_JUNCTION = 'OrJunction'/);
  assert.match(conceptSource, /RELATIONSHIP_JUNCTION_AND = OTHER_AND_JUNCTION/);
  assert.match(conceptSource, /RELATIONSHIP_JUNCTION_OR = OTHER_OR_JUNCTION/);

  assert.match(modelUtilSource, /\[CX\.RELATIONSHIP_JUNCTION_AND,[^\n]*typeName: 'And Junction'/);
  assert.match(modelUtilSource, /\[CX\.RELATIONSHIP_JUNCTION_OR,[^\n]*typeName: 'Or Junction'/);

  assert.match(factorySource, /RELATIONSHIP_JUNCTION_AND \|\| elementType === RELATIONSHIP_JUNCTION_OR/);
  assert.match(rendererSource, /elementType === RELATIONSHIP_JUNCTION_AND \|\| elementType === RELATIONSHIP_JUNCTION_OR/);
});

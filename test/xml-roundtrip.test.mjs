import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readDescriptor(path) {
  const descriptor = await readFile(new URL(path, import.meta.url), 'utf8');

  return JSON.parse(descriptor);
}

function findType(descriptor, name) {
  return descriptor.types.find((type) => type.name === name);
}

function findProperty(type, name) {
  return type.properties.find((property) => property.name === name);
}

test('archimate 3 fixture keeps current namespace', async () => {
  const xml = await readFile(new URL('./fixtures/archimate3-minimal.xml', import.meta.url), 'utf8');

  assert.match(xml, /http:\/\/www\.opengroup\.org\/xsd\/archimate\/3\.0\//);
});

test('archimate 4 fixture uses archimate 4 namespace', async () => {
  const xml = await readFile(new URL('./fixtures/archimate4-minimal.xml', import.meta.url), 'utf8');

  assert.match(xml, /http:\/\/www\.opengroup\.org\/xsd\/archimate\/4\.0\//);
});

test('archimate 4 descriptor stores relationship multiplicity fields', async () => {
  const descriptor = await readFile(new URL('../lib/moddle/resources/archimate4.json', import.meta.url), 'utf8');

  assert.match(descriptor, /sourceMultiplicity/);
  assert.match(descriptor, /targetMultiplicity/);
});

test('archimate 4 descriptor allows relationships between relationship concepts', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate4.json');
  const relationship = findType(descriptor, 'Relationship');

  assert.equal(findProperty(relationship, 'source').type, 'Concept');
  assert.equal(findProperty(relationship, 'target').type, 'Concept');
});

test('archimate 4 descriptor allows connections to relationship view elements', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate4.json');
  const connection = findType(descriptor, 'Connection');

  assert.equal(findProperty(connection, 'source').type, 'ViewElement');
  assert.equal(findProperty(connection, 'target').type, 'ViewElement');
});

test('archimate 3 descriptor keeps existing endpoint constraints', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate3.json');
  const relationship = findType(descriptor, 'Relationship');
  const connection = findType(descriptor, 'Connection');

  assert.equal(findProperty(relationship, 'source').type, 'BaseElement');
  assert.equal(findProperty(relationship, 'target').type, 'BaseElement');
  assert.equal(findProperty(connection, 'source').type, 'Node');
  assert.equal(findProperty(connection, 'target').type, 'Node');
});

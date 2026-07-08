import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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

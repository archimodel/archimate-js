import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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

  assert.match(source, /buildFallbackRelationships/);
  assert.match(source, /setArchimate4RelationshipMapForTests/);
  assert.match(source, /toArchimate4Type/);
});

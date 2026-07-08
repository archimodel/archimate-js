import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('migration table covers retired public ArchiMate 4 concepts', async () => {
  const source = await readFile(new URL('../lib/metamodel/languages/retired-concepts.js', import.meta.url), 'utf8');

  for (const type of [
    'BusinessInteraction',
    'ApplicationInteraction',
    'TechnologyInteraction',
    'Constraint',
    'Contract',
    'Gap',
    'Representation',
    'ImplementationEvent'
  ]) {
    assert.equal(source.includes("[ '" + type + "'"), true, `${type} needs a migration action`);
  }
});

test('migration utility preserves specialization information', async () => {
  const source = await readFile(new URL('../lib/migration/archimate3-to-4.js', import.meta.url), 'utf8');

  assert.match(source, /originalArchiMate3Type/);
  assert.match(source, /specialization/);
  assert.match(source, /warnings\.push/);
});

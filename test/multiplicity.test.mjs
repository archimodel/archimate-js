import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('relationship descriptor contains multiplicity attributes', async () => {
  const descriptor = await readFile(new URL('../lib/moddle/resources/archimate4.json', import.meta.url), 'utf8');

  assert.match(descriptor, /sourceMultiplicity/);
  assert.match(descriptor, /targetMultiplicity/);
});

test('element factory carries multiplicity from relationship refs', async () => {
  const source = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');

  assert.match(source, /sourceMultiplicity: relationshipRef && relationshipRef\.sourceMultiplicity/);
  assert.match(source, /targetMultiplicity: relationshipRef && relationshipRef\.targetMultiplicity/);
});

test('connection updater persists relationship multiplicity fields', async () => {
  const source = await readFile(new URL('../lib/features/modeling/ConnectionUpdater.js', import.meta.url), 'utf8');

  assert.match(source, /delete relationship\.sourceMultiplicity/);
  assert.match(source, /relationship\.sourceMultiplicity = connection\.sourceMultiplicity/);
  assert.match(source, /relationship\.targetMultiplicity = connection\.targetMultiplicity/);
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

test('renderer displays relationship end multiplicities', async () => {
  const source = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(source, /connection\.sourceMultiplicity/);
  assert.match(source, /connection\.targetMultiplicity/);
  assert.match(source, /renderLabel\(parentGfx, connection\.sourceMultiplicity/);
});

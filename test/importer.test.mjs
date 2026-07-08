import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('importer preserves nested view nodes as diagram parent-child shapes', async () => {
  const source = await readFile(new URL('../lib/import/Importer.js', import.meta.url), 'utf8');

  assert.match(source, /function exploreNodeTree\(viewElement, parentShape\)/);
  assert.match(source, /var shape = ArchimateImporter\.addElement\(viewElement, parentShape\)/);
  assert.match(source, /exploreNodeTree\(node, shape\)/);
  assert.doesNotMatch(source, /shape\.host = parentShape/);
  assert.doesNotMatch(source, /function exploreNodeTree\(viewElement, parentShape, rootShape\)/);
});

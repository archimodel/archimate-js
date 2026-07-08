import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('renderer draws ArchiMate 4 Grouping as a dashed unfilled outline', async () => {
  const source = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(source, /OTHER_GROUPING/);
  assert.match(source, /function isArchimate4Profile\(profile\)/);
  assert.match(source, /function getShapeRectAttrs\(shape, elementType\)/);
  assert.match(source, /isArchimate4Profile\(profile\) && elementType === OTHER_GROUPING/);
  assert.match(source, /fill: 'none'/);
  assert.match(source, /strokeDasharray: '3,3'/);
  assert.match(source, /fill: getShapePictogramFill\(shape, elementType\)/);
});

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

test('renderer draws ArchiMate 4 junction connectors as dot and ring markers', async () => {
  const source = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(source, /function getJunctionCircleAttrs\(shape, elementType\)/);
  assert.match(source, /elementType === RELATIONSHIP_JUNCTION_AND/);
  assert.match(source, /fill: DEFAULT_STROKE_COLOR,\s+stroke: DEFAULT_STROKE_COLOR/);
  assert.match(source, /elementType === RELATIONSHIP_JUNCTION_OR/);
  assert.match(source, /fill: 'none',\s+stroke: DEFAULT_STROKE_COLOR/);
  assert.match(source, /if \(!isArchimate4Profile\(profile\)\) {\s+renderLabel\(parentGfx, elementType === RELATIONSHIP_JUNCTION_AND \? 'AND' : 'OR'/);
});

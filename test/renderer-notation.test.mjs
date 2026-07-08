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

test('renderer draws ArchiMate 4 Motivation elements with chamfered bodies', async () => {
  const rendererSource = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');
  const utilSource = await readFile(new URL('../lib/draw/ArchimateRendererUtil.js', import.meta.url), 'utf8');

  assert.match(rendererSource, /getChamferedRectPath/);
  assert.match(rendererSource, /function isArchimate4MotivationShape\(shape\)/);
  assert.match(rendererSource, /isArchimate4Profile\(profile\) && shape\.aspect === 'Motivation'/);
  assert.match(rendererSource, /drawShapePath\(parentGfx, getChamferedRectPath\(/);
  assert.match(rendererSource, /drawRect\(parentGfx, shape\.width, shape\.height, borderRadius, attrs\)/);
  assert.match(utilSource, /export function getChamferedRectPath\(shape, chamfer\)/);
});

test('renderer uses a dedicated ArchiMate 4 Location pin pictogram path', async () => {
  const pathMap = await readFile(new URL('../lib/draw/PathMap.js', import.meta.url), 'utf8');

  assert.match(pathMap, /'PICTO_LOCATION': \{/);
  assert.doesNotMatch(pathMap, /'PICTO_LOCATION': 'PICTO_OBJECT'/);
  assert.match(pathMap, /c -4 -4 -4 -9 0 -13/);
});

test('renderer uses a dedicated ArchiMate 4 Distribution Network arrow pictogram path', async () => {
  const pathMap = await readFile(new URL('../lib/draw/PathMap.js', import.meta.url), 'utf8');

  assert.match(pathMap, /'PICTO_DISTRIBUTION_NETWORK': \{/);
  assert.doesNotMatch(pathMap, /'PICTO_DISTRIBUTION_NETWORK': 'PICTO_COMMUNICATION_NETWORK'/);
  assert.match(pathMap, /m 1\.5 9 l 4 -4 m -4 4 l 4 4/);
});

test('renderer uses a dedicated ArchiMate 4 Material hexagon pictogram path', async () => {
  const pathMap = await readFile(new URL('../lib/draw/PathMap.js', import.meta.url), 'utf8');

  assert.match(pathMap, /'PICTO_MATERIAL': \{/);
  assert.doesNotMatch(pathMap, /'PICTO_MATERIAL': 'PICTO_ARTIFACT'/);
  assert.match(pathMap, /m 8\.5 1\.5 l 7 4/);
});

test('renderer uses a dedicated ArchiMate 4 Facility factory pictogram path', async () => {
  const pathMap = await readFile(new URL('../lib/draw/PathMap.js', import.meta.url), 'utf8');

  assert.match(pathMap, /'PICTO_FACILITY': \{/);
  assert.doesNotMatch(pathMap, /'PICTO_FACILITY': 'PICTO_NODE'/);
  assert.match(pathMap, /m 1\.5 16\.5 l 0 -7 l 4 3/);
});

test('renderer uses a dedicated ArchiMate 4 Equipment gear pictogram path', async () => {
  const pathMap = await readFile(new URL('../lib/draw/PathMap.js', import.meta.url), 'utf8');

  assert.match(pathMap, /'PICTO_EQUIPMENT': \{/);
  assert.doesNotMatch(pathMap, /'PICTO_EQUIPMENT': 'PICTO_DEVICE'/);
  assert.match(pathMap, /m 7\.5 10 a 1 1 90 0 0 8 0/);
});

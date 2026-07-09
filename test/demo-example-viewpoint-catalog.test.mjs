import assert from 'assert/strict';
import fs from 'fs';
import test from 'node:test';

import {
  getArchimate4ExampleViewpointCatalog
} from '../lib/metamodel/languages/index.js';

const sampleCanvas = fs.readFileSync('demo/src/sample-canvas.js', 'utf8');
const editorHtml = fs.readFileSync('demo/editor.html', 'utf8');
const viewerHtml = fs.readFileSync('demo/viewer.html', 'utf8');
const demoCss = fs.readFileSync('demo/demo.css', 'utf8');

test('demo viewer and editor expose the Appendix C example viewpoint catalog', () => {
  assert.match(sampleCanvas, /getArchimate4ExampleViewpointCatalog/);
  assert.match(sampleCanvas, /function renderExampleViewpointCatalog/);
  assert.match(sampleCanvas, /catalog\.groupCount/);
  assert.match(sampleCanvas, /catalog\.viewpointCount/);
  assert.match(sampleCanvas, /catalog\.groups/);
  assert.match(sampleCanvas, /renderExampleViewpointCatalog\(profile\)/);

  for (const html of [ editorHtml, viewerHtml ]) {
    assert.match(html, /id="example-viewpoint-state"/);
    assert.match(html, /id="example-viewpoint-groups"/);
    assert.match(html, /id="example-viewpoint-count"/);
    assert.match(html, /id="example-viewpoint-list"/);
  }

  assert.match(demoCss, /\.demo-example-viewpoints/);
  assert.match(demoCss, /\.demo-example-viewpoint-list/);
});

test('Appendix C example viewpoint catalog remains informative only', () => {
  const catalog = getArchimate4ExampleViewpointCatalog();

  assert.equal(catalog.status, 'informative-reference-catalog');
  assert.equal(catalog.groupCount, 4);
  assert.equal(catalog.viewpointCount, 25);
  assert.equal(catalog.bundledViewpointDefinitions, false);
  assert.equal(catalog.normativeRelationshipConstraints, false);
});

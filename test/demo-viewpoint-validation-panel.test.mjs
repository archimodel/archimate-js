import assert from 'assert/strict';
import fs from 'fs';
import test from 'node:test';

const sampleCanvas = fs.readFileSync('demo/src/sample-canvas.js', 'utf8');
const editorHtml = fs.readFileSync('demo/editor.html', 'utf8');
const viewerHtml = fs.readFileSync('demo/viewer.html', 'utf8');
const demoCss = fs.readFileSync('demo/demo.css', 'utf8');

test('demo viewer and editor expose model-defined viewpoint validation', () => {
  assert.match(sampleCanvas, /validateArchimate4Model/);
  assert.match(sampleCanvas, /function renderViewpointValidation/);
  assert.match(sampleCanvas, /createDemoViewpointValidationModel/);
  assert.match(sampleCanvas, /renderViewpointValidation\(profile\)/);
  assert.match(sampleCanvas, /viewpointPurpose: 'Deciding'/);
  assert.match(sampleCanvas, /viewpointContent: 'Overview'/);
  assert.match(sampleCanvas, /allowedElementTypes: \[ 'Role', 'Service' \]/);
  assert.match(sampleCanvas, /allowedRelationshipTypes: \[ 'Serving' \]/);

  for (const html of [ editorHtml, viewerHtml ]) {
    assert.match(html, /id="viewpoint-validation-state"/);
    assert.match(html, /id="viewpoint-validation-definition"/);
    assert.match(html, /id="viewpoint-validation-scope"/);
    assert.match(html, /id="viewpoint-validation-diagnostics"/);
  }

  assert.match(demoCss, /\.demo-viewpoint-validation/);
});

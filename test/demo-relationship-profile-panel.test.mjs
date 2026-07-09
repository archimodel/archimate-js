import assert from 'assert/strict';
import fs from 'fs';
import test from 'node:test';

const sampleCanvas = fs.readFileSync('demo/src/sample-canvas.js', 'utf8');
const editorSource = fs.readFileSync('demo/src/editor.js', 'utf8');
const editorHtml = fs.readFileSync('demo/editor.html', 'utf8');
const demoCss = fs.readFileSync('demo/demo.css', 'utf8');

test('editor demo exposes an Appendix B relationship profile import panel', () => {
  assert.match(editorHtml, /id="relationship-profile-input"/);
  assert.match(editorHtml, /id="load-relationship-profile"/);
  assert.match(editorHtml, /id="reset-relationship-profile"/);
  assert.match(editorHtml, /id="relationship-profile-state"/);
  assert.match(editorHtml, /id="relationship-profile-cells"/);
  assert.match(editorHtml, /id="relationship-profile-missing"/);

  assert.match(editorSource, /setArchimate4RelationshipProfile/);
  assert.match(editorSource, /resetArchimate4RelationshipProfile/);
  assert.match(editorSource, /buildRelationshipProfileInput/);
  assert.match(editorSource, /matrixText: text/);
  assert.match(editorSource, /requireCompleteTargets: true/);
  assert.match(editorSource, /renderRelationshipProfileStatus/);

  assert.match(sampleCanvas, /getArchimate4RelationshipProfileStatus/);
  assert.match(sampleCanvas, /function renderRelationshipProfileStatus/);
  assert.match(sampleCanvas, /status\.targetCellCount/);
  assert.match(sampleCanvas, /status\.expectedTargetCellCount/);
  assert.match(sampleCanvas, /status\.missingSourceCount/);
  assert.match(sampleCanvas, /status\.missingTargetCellCount/);
  assert.match(sampleCanvas, /ArchiMate 3\.x compatibility mode/);

  assert.match(demoCss, /\.demo-relationship-profile/);
  assert.match(demoCss, /\.demo-profile-input/);
});

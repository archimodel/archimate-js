import assert from 'assert/strict';
import fs from 'fs';
import test from 'node:test';

import {
  getArchimate4ConformanceReport
} from '../lib/metamodel/languages/index.js';

const sampleCanvas = fs.readFileSync('demo/src/sample-canvas.js', 'utf8');
const editorHtml = fs.readFileSync('demo/editor.html', 'utf8');
const viewerHtml = fs.readFileSync('demo/viewer.html', 'utf8');
const demoCss = fs.readFileSync('demo/demo.css', 'utf8');

test('demo viewer and editor expose the ArchiMate 4 conformance report panel', () => {
  assert.match(sampleCanvas, /getArchimate4ConformanceReport/);
  assert.match(sampleCanvas, /function renderConformanceReport/);
  assert.match(sampleCanvas, /report\.officialConformanceClaimable/);
  assert.match(sampleCanvas, /report\.requiredBeforeClaim/);
  assert.match(sampleCanvas, /report\.missingRequiredSources/);
  assert.match(sampleCanvas, /ArchiMate 3\.x compatibility mode/);

  for (const html of [ editorHtml, viewerHtml ]) {
    assert.match(html, /id="conformance-state"/);
    assert.match(html, /id="conformance-summary"/);
    assert.match(html, /id="conformance-required"/);
    assert.match(html, /id="conformance-companion"/);
    assert.match(html, /id="conformance-actions"/);
  }

  assert.match(demoCss, /\.demo-conformance/);
  assert.match(demoCss, /overflow-wrap: anywhere/);
});

test('demo conformance panel source stays aligned with the flattened report boundary', () => {
  const report = getArchimate4ConformanceReport();

  assert.equal(report.status, 'blocked');
  assert.deepEqual(report.blockerIds, [
    'officialAppendixBRelationshipMatrix',
    'officialMeff4Xsd',
    'exactAppendixAArtworkRights'
  ]);
  assert.deepEqual(report.missingRequiredSources, [
    'appendixBRelationshipMatrix',
    'meff4Xsd',
    'appendixAArtworkRights'
  ]);
  assert.deepEqual(report.missingCompanionSources, []);
  assert.equal(report.requiredBeforeClaim.length, 3);
});

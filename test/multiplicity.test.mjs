import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  canApplyRelationshipMultiplicity,
  isRelationshipConnectedToJunction
} from '../lib/util/JunctionUtil.js';

test('relationship descriptor contains multiplicity attributes', async () => {
  const descriptor = await readFile(new URL('../lib/moddle/resources/archimate4.json', import.meta.url), 'utf8');

  assert.match(descriptor, /sourceMultiplicity/);
  assert.match(descriptor, /targetMultiplicity/);
});

test('element factory carries multiplicity from relationship refs', async () => {
  const source = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');

  assert.match(source, /sourceMultiplicity: canApplyMultiplicity && relationshipRef && relationshipRef\.sourceMultiplicity/);
  assert.match(source, /targetMultiplicity: canApplyMultiplicity && relationshipRef && relationshipRef\.targetMultiplicity/);
});

test('connection updater persists relationship multiplicity fields', async () => {
  const source = await readFile(new URL('../lib/features/modeling/ConnectionUpdater.js', import.meta.url), 'utf8');

  assert.match(source, /delete relationship\.sourceMultiplicity/);
  assert.match(source, /canApplyRelationshipMultiplicity\(connection\) && connection\.sourceMultiplicity/);
  assert.match(source, /canApplyRelationshipMultiplicity\(connection\) && connection\.targetMultiplicity/);
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

test('connection popup hides multiplicity actions on junction-connected relationships', async () => {
  const source = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');

  assert.match(source, /canApplyRelationshipMultiplicity\(element\)/);
});

test('renderer displays relationship end multiplicities', async () => {
  const source = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(source, /connection\.sourceMultiplicity/);
  assert.match(source, /connection\.targetMultiplicity/);
  assert.match(source, /renderLabel\(parentGfx, connection\.sourceMultiplicity/);
});

test('junction-connected relationships cannot carry multiplicity', () => {
  const regularConnection = {
    source: { type: 'BusinessActor' },
    target: { type: 'Role' }
  };
  const directJunctionConnection = {
    source: { type: 'AndJunction' },
    target: { type: 'Role' }
  };
  const importedJunctionConnection = {
    source: {
      businessObject: {
        elementRef: { type: 'OrJunction' }
      }
    },
    target: { type: 'Role' }
  };

  assert.equal(canApplyRelationshipMultiplicity(regularConnection), true);
  assert.equal(isRelationshipConnectedToJunction(directJunctionConnection), true);
  assert.equal(isRelationshipConnectedToJunction(importedJunctionConnection), true);
  assert.equal(canApplyRelationshipMultiplicity(directJunctionConnection), false);
  assert.equal(canApplyRelationshipMultiplicity(importedJunctionConnection), false);
});

test('multiplicity is suppressed across import, replacement, and rendering for junction ends', async () => {
  const elementFactory = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');
  const replaceHandler = await readFile(new URL('../lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js', import.meta.url), 'utf8');
  const renderer = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(elementFactory, /canApplyRelationshipMultiplicity\(attrs\)/);
  assert.match(replaceHandler, /delete relationship\.sourceMultiplicity/);
  assert.match(replaceHandler, /delete connection\.sourceMultiplicity/);
  assert.match(renderer, /canRenderMultiplicity && connection\.sourceMultiplicity/);
  assert.match(renderer, /canRenderMultiplicity && connection\.targetMultiplicity/);
});

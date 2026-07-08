import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('attachment behavior persists visual nesting without duplicate view nodes', async () => {
  const source = await readFile(new URL('../lib/features/modeling/behavior/AttachmentBehavior.js', import.meta.url), 'utf8');

  assert.match(source, /function addNodeToParent\(parentBusinessObject, node\)/);
  assert.match(source, /function removeNodeFromParent\(parentBusinessObject, node\)/);
  assert.match(source, /node\.\$parent = parentBusinessObject/);
  assert.match(source, /if \(nodes\.indexOf\(node\) === -1\) \{/);
  assert.doesNotMatch(source, /shape\.businessObject\.\$parent = shape\.host && shape\.host\.businessObject/);
  assert.doesNotMatch(source, /newHost\.businessObject\.nodes\.push\(shape\.businessObject\)/);
  assert.doesNotMatch(source, /newHost\.businessObject\.viewElements\.push\(shape\.businessObject\)/);
});

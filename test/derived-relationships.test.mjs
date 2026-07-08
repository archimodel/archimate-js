import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveRelationship,
  deriveRelationshipType,
  getStructuralRelationshipStrength,
  getWeakestStructuralRelationshipType,
  isStructuralRelationshipType
} from '../lib/util/DerivedRelationshipUtil.js';

test('derived relationship DR1 applies specialization transitivity', () => {
  assert.equal(deriveRelationshipType('Specialization', 'Specialization'), 'Specialization');
  assert.equal(deriveRelationshipType('Specialization', 'Assignment'), null);
  assert.equal(deriveRelationshipType('Serving', 'Specialization'), null);
});

test('derived relationship DR2 returns the weakest structural relationship', () => {
  assert.equal(isStructuralRelationshipType('Composition'), true);
  assert.equal(isStructuralRelationshipType('Aggregation'), true);
  assert.equal(isStructuralRelationshipType('Assignment'), true);
  assert.equal(isStructuralRelationshipType('Realization'), true);
  assert.equal(isStructuralRelationshipType('Serving'), false);

  assert.equal(getStructuralRelationshipStrength('Realization'), 0);
  assert.equal(getStructuralRelationshipStrength('Assignment'), 1);
  assert.equal(getStructuralRelationshipStrength('Aggregation'), 2);
  assert.equal(getStructuralRelationshipStrength('Composition'), 3);

  assert.equal(getWeakestStructuralRelationshipType('Composition', 'Aggregation'), 'Aggregation');
  assert.equal(getWeakestStructuralRelationshipType('Aggregation', 'Assignment'), 'Assignment');
  assert.equal(getWeakestStructuralRelationshipType('Assignment', 'Realization'), 'Realization');
  assert.equal(getWeakestStructuralRelationshipType('Serving', 'Realization'), null);
});

test('derived relationship preserves source and target across a relationship chain', () => {
  const source = { id: 'a' };
  const intermediate = { id: 'b' };
  const target = { id: 'c' };
  const first = {
    id: 'rel-1',
    type: 'Composition',
    source,
    target: intermediate
  };
  const second = {
    id: 'rel-2',
    type: 'Assignment',
    source: intermediate,
    target
  };

  assert.deepEqual(deriveRelationship(first, second), {
    type: 'Assignment',
    source,
    target,
    derived: true,
    derivedFrom: [ 'rel-1', 'rel-2' ],
    derivationRule: 'structural-weakest'
  });
});

test('derived relationship rejects non-chain endpoints', () => {
  const first = {
    id: 'rel-1',
    type: 'Composition',
    source: { id: 'a' },
    target: { id: 'b' }
  };
  const second = {
    id: 'rel-2',
    type: 'Assignment',
    source: { id: 'x' },
    target: { id: 'c' }
  };

  assert.equal(deriveRelationship(first, second), null);
});

test('derived relationship resolves custom relationship specializations to base types', () => {
  const profile = {
    relationships: [
      {
        type: 'ProductOwnership',
        label: 'Product Ownership',
        specializes: 'Assignment'
      }
    ]
  };

  assert.equal(deriveRelationshipType('ProductOwnership', 'Composition', profile), 'Assignment');
});

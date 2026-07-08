import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveRelationship,
  deriveRelationshipType,
  getStructuralRelationshipStrength,
  getWeakestStructuralRelationshipType,
  isDependencyRelationshipType,
  isDynamicRelationshipType,
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

test('derived relationship DR3 to DR8 derive dependency and dynamic relationships', () => {
  assert.equal(isDependencyRelationshipType('Serving'), true);
  assert.equal(isDependencyRelationshipType('Access'), true);
  assert.equal(isDependencyRelationshipType('Influence'), true);
  assert.equal(isDependencyRelationshipType('Association'), true);
  assert.equal(isDependencyRelationshipType('Flow'), false);

  assert.equal(isDynamicRelationshipType('Flow'), true);
  assert.equal(isDynamicRelationshipType('Triggering'), true);
  assert.equal(isDynamicRelationshipType('Serving'), false);

  assert.equal(deriveRelationshipType('Assignment', 'Serving'), 'Serving');
  assert.equal(deriveRelationshipType('Composition', 'Access'), 'Access');
  assert.equal(deriveRelationshipType('Aggregation', 'Flow'), 'Flow');
  assert.equal(deriveRelationshipType('Realization', 'Triggering'), 'Triggering');
  assert.equal(deriveRelationshipType('Triggering', 'Composition'), 'Triggering');
  assert.equal(deriveRelationshipType('Triggering', 'Triggering'), 'Triggering');
  assert.equal(deriveRelationshipType('Serving', 'Assignment'), null);
});

test('derived relationship applies inline structural dependency and dynamic rules', () => {
  const source = { id: 'a' };
  const intermediate = { id: 'b' };
  const target = { id: 'c' };

  assert.deepEqual(deriveRelationship({
    id: 'rel-1',
    type: 'Assignment',
    source,
    target: intermediate
  }, {
    id: 'rel-2',
    type: 'Serving',
    source: intermediate,
    target
  }), {
    type: 'Serving',
    source,
    target,
    derived: true,
    derivedFrom: [ 'rel-1', 'rel-2' ],
    derivationRule: 'structural-dependency'
  });

  assert.deepEqual(deriveRelationship({
    id: 'rel-3',
    type: 'Composition',
    source,
    target: intermediate
  }, {
    id: 'rel-4',
    type: 'Flow',
    source: intermediate,
    target
  }), {
    type: 'Flow',
    source,
    target,
    derived: true,
    derivedFrom: [ 'rel-3', 'rel-4' ],
    derivationRule: 'structural-dynamic'
  });
});

test('derived relationship applies opposing structural dependency and flow rules', () => {
  const source = { id: 'a' };
  const sharedTarget = { id: 'b' };
  const dependencySource = { id: 'c' };

  assert.deepEqual(deriveRelationship({
    id: 'rel-1',
    type: 'Aggregation',
    source,
    target: sharedTarget
  }, {
    id: 'rel-2',
    type: 'Serving',
    source: dependencySource,
    target: sharedTarget
  }), {
    type: 'Serving',
    source: dependencySource,
    target: source,
    derived: true,
    derivedFrom: [ 'rel-1', 'rel-2' ],
    derivationRule: 'opposing-structural-dependency'
  });

  assert.deepEqual(deriveRelationship({
    id: 'rel-3',
    type: 'Composition',
    source,
    target: sharedTarget
  }, {
    id: 'rel-4',
    type: 'Flow',
    source: dependencySource,
    target: sharedTarget
  }), {
    type: 'Flow',
    source: dependencySource,
    target: source,
    derived: true,
    derivedFrom: [ 'rel-3', 'rel-4' ],
    derivationRule: 'opposing-structural-flow'
  });
});

test('derived relationship applies triggering in-line rules', () => {
  const source = { id: 'a' };
  const intermediate = { id: 'b' };
  const target = { id: 'c' };

  assert.deepEqual(deriveRelationship({
    id: 'rel-1',
    type: 'Triggering',
    source,
    target: intermediate
  }, {
    id: 'rel-2',
    type: 'Realization',
    source: intermediate,
    target
  }), {
    type: 'Triggering',
    source,
    target,
    derived: true,
    derivedFrom: [ 'rel-1', 'rel-2' ],
    derivationRule: 'triggering-structural'
  });

  assert.deepEqual(deriveRelationship({
    id: 'rel-3',
    type: 'Triggering',
    source,
    target: intermediate
  }, {
    id: 'rel-4',
    type: 'Triggering',
    source: intermediate,
    target
  }), {
    type: 'Triggering',
    source,
    target,
    derived: true,
    derivedFrom: [ 'rel-3', 'rel-4' ],
    derivationRule: 'triggering-transitivity'
  });
});

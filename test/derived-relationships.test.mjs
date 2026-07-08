import test from 'node:test';
import assert from 'node:assert/strict';
import {
  derivePotentialRelationship,
  deriveRelationship,
  deriveRelationshipType,
  getDependencyRelationshipStrength,
  getStructuralRelationshipStrength,
  getWeakestDependencyRelationshipType,
  getWeakestStructuralRelationshipType,
  isDerivableRelationshipType,
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

test('potential derived relationship exposes dependency strength order', () => {
  assert.equal(getDependencyRelationshipStrength('Association'), 0);
  assert.equal(getDependencyRelationshipStrength('Influence'), 1);
  assert.equal(getDependencyRelationshipStrength('Access'), 2);
  assert.equal(getDependencyRelationshipStrength('Serving'), 3);
  assert.equal(getDependencyRelationshipStrength('Flow'), -1);

  assert.equal(getWeakestDependencyRelationshipType('Serving', 'Access'), 'Access');
  assert.equal(getWeakestDependencyRelationshipType('Influence', 'Association'), 'Association');
  assert.equal(getWeakestDependencyRelationshipType('Flow', 'Access'), null);

  assert.equal(isDerivableRelationshipType('Composition'), true);
  assert.equal(isDerivableRelationshipType('Serving'), true);
  assert.equal(isDerivableRelationshipType('Flow'), true);
  assert.equal(isDerivableRelationshipType('Specialization'), false);
});

test('potential derived relationship applies PDR1 to PDR4 specialization rules', () => {
  const specialized = { id: 'a' };
  const general = { id: 'b' };
  const other = { id: 'c' };

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-1-specialization',
    type: 'Specialization',
    source: specialized,
    target: general
  }, {
    id: 'pdr-1-other',
    type: 'Serving',
    source: general,
    target: other
  }), {
    type: 'Serving',
    source: specialized,
    target: other,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-1-specialization', 'pdr-1-other' ],
    derivationRule: 'potential-specialization-outgoing'
  });

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-2-specialization',
    type: 'Specialization',
    source: specialized,
    target: general
  }, {
    id: 'pdr-2-other',
    type: 'Access',
    source: other,
    target: general
  }), {
    type: 'Access',
    source: other,
    target: specialized,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-2-specialization', 'pdr-2-other' ],
    derivationRule: 'potential-specialization-incoming'
  });

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-3-specialization',
    type: 'Specialization',
    source: specialized,
    target: general
  }, {
    id: 'pdr-3-other',
    type: 'Flow',
    source: specialized,
    target: other
  }), {
    type: 'Flow',
    source: general,
    target: other,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-3-specialization', 'pdr-3-other' ],
    derivationRule: 'potential-specialization-source-outgoing'
  });

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-4-specialization',
    type: 'Specialization',
    source: specialized,
    target: general
  }, {
    id: 'pdr-4-other',
    type: 'Triggering',
    source: other,
    target: specialized
  }), {
    type: 'Triggering',
    source: other,
    target: general,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-4-specialization', 'pdr-4-other' ],
    derivationRule: 'potential-specialization-source-incoming'
  });
});

test('potential derived relationship applies PDR5 to PDR7 dependency rules', () => {
  const source = { id: 'a' };
  const structuralTarget = { id: 'b' };
  const dependencySource = { id: 'c' };
  const dependencyTarget = { id: 'd' };

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-5-structural',
    type: 'Composition',
    source,
    target: structuralTarget
  }, {
    id: 'pdr-5-dependency',
    type: 'Serving',
    source: dependencySource,
    target: source
  }), {
    type: 'Serving',
    source: dependencySource,
    target: structuralTarget,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-5-structural', 'pdr-5-dependency' ],
    derivationRule: 'potential-structural-dependency-incoming'
  });

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-6-structural',
    type: 'Aggregation',
    source,
    target: structuralTarget
  }, {
    id: 'pdr-6-dependency',
    type: 'Access',
    source,
    target: dependencyTarget
  }), {
    type: 'Access',
    source: structuralTarget,
    target: dependencyTarget,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-6-structural', 'pdr-6-dependency' ],
    derivationRule: 'potential-structural-dependency-outgoing'
  });

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-7-dependency-a',
    type: 'Serving',
    source,
    target: structuralTarget
  }, {
    id: 'pdr-7-dependency-b',
    type: 'Influence',
    source: structuralTarget,
    target: dependencyTarget
  }), {
    type: 'Influence',
    source,
    target: dependencyTarget,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-7-dependency-a', 'pdr-7-dependency-b' ],
    derivationRule: 'potential-dependency-weakest'
  });
});

test('potential derived relationship applies PDR8 to PDR11 dynamic rules', () => {
  const source = { id: 'a' };
  const intermediate = { id: 'b' };
  const target = { id: 'c' };

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-8-flow',
    type: 'Flow',
    source,
    target: intermediate
  }, {
    id: 'pdr-8-structural',
    type: 'Realization',
    source: intermediate,
    target
  }), {
    type: 'Flow',
    source,
    target,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-8-flow', 'pdr-8-structural' ],
    derivationRule: 'potential-flow-structural'
  });

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-9-structural',
    type: 'Assignment',
    source,
    target: intermediate
  }, {
    id: 'pdr-9-dynamic',
    type: 'Triggering',
    source,
    target
  }), {
    type: 'Triggering',
    source: intermediate,
    target,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-9-structural', 'pdr-9-dynamic' ],
    derivationRule: 'potential-structural-dynamic-outgoing'
  });

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-10-flow-a',
    type: 'Flow',
    source,
    target: intermediate
  }, {
    id: 'pdr-10-flow-b',
    type: 'Flow',
    source: intermediate,
    target
  }), {
    type: 'Flow',
    source,
    target,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-10-flow-a', 'pdr-10-flow-b' ],
    derivationRule: 'potential-flow-transitivity'
  });

  assert.deepEqual(derivePotentialRelationship({
    id: 'pdr-11-triggering',
    type: 'Triggering',
    source,
    target: intermediate
  }, {
    id: 'pdr-11-structural',
    type: 'Composition',
    source: target,
    target: intermediate
  }), {
    type: 'Triggering',
    source,
    target,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-11-triggering', 'pdr-11-structural' ],
    derivationRule: 'potential-triggering-structural-incoming'
  });
});

test('potential derived relationship applies PDR12 grouping rule only when allowed', () => {
  const grouping = { id: 'group', type: 'Grouping' };
  const part = { id: 'part', type: 'ApplicationComponent' };
  const target = { id: 'target', type: 'ApplicationService' };
  const aggregation = {
    id: 'pdr-12-aggregation',
    type: 'Aggregation',
    source: grouping,
    target: part
  };
  const assignment = {
    id: 'pdr-12-assignment',
    type: 'Assignment',
    source: grouping,
    target
  };

  assert.equal(derivePotentialRelationship(aggregation, assignment), null);
  assert.equal(derivePotentialRelationship(aggregation, assignment, {
    isRelationshipAllowed() {
      return false;
    }
  }), null);

  assert.deepEqual(derivePotentialRelationship(aggregation, assignment, {
    isRelationshipAllowed(sourceType, targetType, relationshipType) {
      return sourceType === 'ApplicationComponent' &&
        targetType === 'ApplicationService' &&
        relationshipType === 'Assignment';
    }
  }), {
    type: 'Assignment',
    source: part,
    target,
    derived: true,
    potential: true,
    derivedFrom: [ 'pdr-12-aggregation', 'pdr-12-assignment' ],
    derivationRule: 'potential-grouping-aggregation'
  });
});

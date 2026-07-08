import test from 'node:test';
import assert from 'node:assert/strict';
import {
  derivePotentialRelationship,
  deriveRelationship,
  deriveRelationshipChain,
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

const archimate4RestrictionProfile = {
  version: '4.0',
  elements: [
    { type: 'ApplicationComponent', domain: 'Application', aspect: 'Active Structure' },
    { type: 'DataObject', domain: 'Application', aspect: 'Passive Structure' },
    { type: 'Goal', domain: 'Motivation', aspect: 'Motivation' },
    { type: 'Resource', domain: 'Strategy', aspect: 'Active Structure' },
    { type: 'WorkPackage', domain: 'Implementation and Migration', aspect: 'Behavior' },
    { type: 'Grouping', domain: 'Common', aspect: 'Composite' },
    { type: 'Location', domain: 'Common', aspect: 'Composite' },
    { type: 'Plateau', domain: 'Implementation and Migration', aspect: 'Composite' }
  ],
  connectors: [
    { type: 'AndJunction', paletteGroup: 'Relationships', aspect: 'Connector' }
  ],
  relationships: [
    'Composition',
    'Aggregation',
    'Assignment',
    'Realization',
    'Association',
    'Influence',
    'Access',
    'Serving',
    'Triggering',
    'Flow',
    'Specialization'
  ]
};

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

test('derived relationship chain collapses structural chains to the weakest relationship', () => {
  const a = { id: 'a' };
  const b = { id: 'b' };
  const c = { id: 'c' };
  const d = { id: 'd' };

  assert.deepEqual(deriveRelationshipChain([
    {
      id: 'chain-1',
      type: 'Composition',
      source: a,
      target: b
    },
    {
      id: 'chain-2',
      type: 'Aggregation',
      source: b,
      target: c
    },
    {
      id: 'chain-3',
      type: 'Realization',
      source: c,
      target: d
    }
  ]), {
    type: 'Realization',
    source: a,
    target: d,
    derived: true,
    derivedFrom: [ 'chain-1', 'chain-2', 'chain-3' ],
    derivationRule: 'structural-weakest',
    derivationRules: [ 'structural-weakest', 'structural-weakest' ]
  });
});

test('derived relationship chain transfers dependency and triggering through structural chains', () => {
  const a = { id: 'a' };
  const b = { id: 'b' };
  const c = { id: 'c' };
  const d = { id: 'd' };

  assert.deepEqual(deriveRelationshipChain([
    {
      id: 'dep-1',
      type: 'Composition',
      source: a,
      target: b
    },
    {
      id: 'dep-2',
      type: 'Aggregation',
      source: b,
      target: c
    },
    {
      id: 'dep-3',
      type: 'Serving',
      source: c,
      target: d
    }
  ]), {
    type: 'Serving',
    source: a,
    target: d,
    derived: true,
    derivedFrom: [ 'dep-1', 'dep-2', 'dep-3' ],
    derivationRule: 'structural-dependency',
    derivationRules: [ 'structural-weakest', 'structural-dependency' ]
  });

  assert.deepEqual(deriveRelationshipChain([
    {
      id: 'trg-1',
      type: 'Triggering',
      source: a,
      target: b
    },
    {
      id: 'trg-2',
      type: 'Composition',
      source: b,
      target: c
    },
    {
      id: 'trg-3',
      type: 'Triggering',
      source: c,
      target: d
    }
  ]), {
    type: 'Triggering',
    source: a,
    target: d,
    derived: true,
    derivedFrom: [ 'trg-1', 'trg-2', 'trg-3' ],
    derivationRule: 'triggering-transitivity',
    derivationRules: [ 'triggering-structural', 'triggering-transitivity' ]
  });
});

test('derived relationship chain rejects incomplete chains', () => {
  assert.equal(deriveRelationshipChain([]), null);
  assert.equal(deriveRelationshipChain([
    {
      id: 'single',
      type: 'Composition',
      source: { id: 'a' },
      target: { id: 'b' }
    }
  ]), null);
  assert.equal(deriveRelationshipChain([
    {
      id: 'broken-1',
      type: 'Composition',
      source: { id: 'a' },
      target: { id: 'b' }
    },
    {
      id: 'broken-2',
      type: 'Serving',
      source: { id: 'x' },
      target: { id: 'c' }
    }
  ]), null);
});

test('derived relationships apply C260 Appendix B.4 source and target restrictions when profile metadata is present', () => {
  const source = { id: 'app-source', type: 'ApplicationComponent' };
  const intermediate = { id: 'app-mid', type: 'ApplicationComponent' };
  const motivation = { id: 'goal', type: 'Goal' };
  const passiveSource = { id: 'data-source', type: 'DataObject' };
  const passiveIntermediate = { id: 'data-mid', type: 'DataObject' };
  const passiveTarget = { id: 'data-target', type: 'DataObject' };

  assert.equal(deriveRelationship({
    id: 'restricted-flow-1',
    type: 'Aggregation',
    source,
    target: intermediate
  }, {
    id: 'restricted-flow-2',
    type: 'Flow',
    source: intermediate,
    target: motivation
  }, archimate4RestrictionProfile), null);

  assert.deepEqual(deriveRelationship({
    id: 'allowed-influence-1',
    type: 'Aggregation',
    source,
    target: intermediate
  }, {
    id: 'allowed-influence-2',
    type: 'Influence',
    source: intermediate,
    target: motivation
  }, archimate4RestrictionProfile), {
    type: 'Influence',
    source,
    target: motivation,
    derived: true,
    derivedFrom: [ 'allowed-influence-1', 'allowed-influence-2' ],
    derivationRule: 'structural-dependency'
  });

  assert.equal(deriveRelationship({
    id: 'restricted-passive-1',
    type: 'Aggregation',
    source: passiveSource,
    target: passiveIntermediate
  }, {
    id: 'restricted-passive-2',
    type: 'Assignment',
    source: passiveIntermediate,
    target: passiveTarget
  }, archimate4RestrictionProfile), null);

  assert.equal(deriveRelationship({
    id: 'restricted-access-1',
    type: 'Aggregation',
    source,
    target: intermediate
  }, {
    id: 'restricted-access-2',
    type: 'Access',
    source: intermediate,
    target: { id: 'not-passive', type: 'ApplicationComponent' }
  }, archimate4RestrictionProfile), null);
});

test('derived relationships apply C260 Appendix B.4 third-element restrictions when profile metadata is present', () => {
  const source = { id: 'app-source', type: 'ApplicationComponent' };
  const strategyJoin = { id: 'resource', type: 'Resource' };
  const motivation = { id: 'goal', type: 'Goal' };
  const implementationSource = { id: 'work-package', type: 'WorkPackage' };
  const coreJoin = { id: 'core-join', type: 'ApplicationComponent' };
  const groupingJoin = { id: 'grouping-join', type: 'Grouping' };

  assert.equal(deriveRelationship({
    id: 'restricted-third-1',
    type: 'Aggregation',
    source,
    target: strategyJoin
  }, {
    id: 'restricted-third-2',
    type: 'Influence',
    source: strategyJoin,
    target: motivation
  }, archimate4RestrictionProfile), null);

  assert.equal(deriveRelationship({
    id: 'allowed-third-1',
    type: 'Realization',
    source: implementationSource,
    target: coreJoin
  }, {
    id: 'allowed-third-2',
    type: 'Realization',
    source: coreJoin,
    target: motivation
  }, archimate4RestrictionProfile).type, 'Realization');

  assert.equal(deriveRelationship({
    id: 'restricted-grouping-third-1',
    type: 'Realization',
    source: implementationSource,
    target: groupingJoin
  }, {
    id: 'restricted-grouping-third-2',
    type: 'Realization',
    source: groupingJoin,
    target: motivation
  }, archimate4RestrictionProfile), null);
});

test('derived relationships apply C260 Appendix B.4 relationship-domain restrictions when profile metadata is present', () => {
  const grouping = { id: 'grouping', type: 'Grouping' };
  const source = { id: 'app-source', type: 'ApplicationComponent' };
  const intermediate = { id: 'app-mid', type: 'ApplicationComponent' };
  const relationshipConcept = { id: 'relationship-concept', type: 'Flow' };

  assert.equal(deriveRelationship({
    id: 'relationship-target-allowed-1',
    type: 'Aggregation',
    source: grouping,
    target: source
  }, {
    id: 'relationship-target-allowed-2',
    type: 'Aggregation',
    source,
    target: relationshipConcept
  }, archimate4RestrictionProfile).type, 'Aggregation');

  assert.equal(deriveRelationship({
    id: 'relationship-target-restricted-1',
    type: 'Aggregation',
    source,
    target: intermediate
  }, {
    id: 'relationship-target-restricted-2',
    type: 'Aggregation',
    source: intermediate,
    target: relationshipConcept
  }, archimate4RestrictionProfile), null);

  assert.equal(deriveRelationship({
    id: 'relationship-source-restricted-1',
    type: 'Aggregation',
    source: relationshipConcept,
    target: intermediate
  }, {
    id: 'relationship-source-restricted-2',
    type: 'Aggregation',
    source: intermediate,
    target: source
  }, archimate4RestrictionProfile), null);
});

test('potential derived relationships apply C260 Appendix B.4 restrictions when profile metadata is present', () => {
  const source = { id: 'app-source', type: 'ApplicationComponent' };
  const intermediate = { id: 'app-mid', type: 'ApplicationComponent' };
  const motivation = { id: 'goal', type: 'Goal' };

  assert.equal(derivePotentialRelationship({
    id: 'restricted-potential-1',
    type: 'Aggregation',
    source,
    target: intermediate
  }, {
    id: 'restricted-potential-2',
    type: 'Triggering',
    source,
    target: motivation
  }, {
    profile: archimate4RestrictionProfile
  }), null);
});

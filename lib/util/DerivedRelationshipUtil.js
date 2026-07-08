import {
  OTHER_GROUPING,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_ASSOCIATION,
  RELATIONSHIP_COMPOSITION,
  RELATIONSHIP_FLOW,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_SERVING,
  RELATIONSHIP_SPECIALIZATION,
  RELATIONSHIP_TRIGGERING
} from '../metamodel/Concept.js';

const STRUCTURAL_RELATIONSHIPS_BY_STRENGTH = [
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_COMPOSITION
];
const DEPENDENCY_RELATIONSHIPS_BY_STRENGTH = [
  RELATIONSHIP_ASSOCIATION,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_SERVING
];
const DYNAMIC_RELATIONSHIPS = [
  RELATIONSHIP_TRIGGERING,
  RELATIONSHIP_FLOW
];
const GROUPING_POTENTIAL_RELATIONSHIPS = [
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_ASSIGNMENT
];
const DEPENDENCY_RELATIONSHIPS = [
  RELATIONSHIP_SERVING,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_ASSOCIATION
];

export function isStructuralRelationshipType(relationshipType, profile) {
  return getStructuralRelationshipStrength(relationshipType, profile) !== -1;
}

export function isDependencyRelationshipType(relationshipType, profile) {
  return DEPENDENCY_RELATIONSHIPS.indexOf(getBaseRelationshipType(relationshipType, profile)) !== -1;
}

export function isDynamicRelationshipType(relationshipType, profile) {
  return DYNAMIC_RELATIONSHIPS.indexOf(getBaseRelationshipType(relationshipType, profile)) !== -1;
}

export function isDerivableRelationshipType(relationshipType, profile) {
  return isStructuralRelationshipType(relationshipType, profile) ||
    isDependencyRelationshipType(relationshipType, profile) ||
    isDynamicRelationshipType(relationshipType, profile);
}

export function getStructuralRelationshipStrength(relationshipType, profile) {
  var baseRelationshipType = getBaseRelationshipType(getRelationshipType(relationshipType), profile);

  return STRUCTURAL_RELATIONSHIPS_BY_STRENGTH.indexOf(baseRelationshipType);
}

export function getDependencyRelationshipStrength(relationshipType, profile) {
  var baseRelationshipType = getBaseRelationshipType(getRelationshipType(relationshipType), profile);

  return DEPENDENCY_RELATIONSHIPS_BY_STRENGTH.indexOf(baseRelationshipType);
}

export function getWeakestStructuralRelationshipType(firstRelationshipType, secondRelationshipType, profile) {
  var firstStrength = getStructuralRelationshipStrength(firstRelationshipType, profile),
      secondStrength = getStructuralRelationshipStrength(secondRelationshipType, profile);

  if (firstStrength === -1 || secondStrength === -1) {
    return null;
  }

  return STRUCTURAL_RELATIONSHIPS_BY_STRENGTH[Math.min(firstStrength, secondStrength)];
}

export function getWeakestDependencyRelationshipType(firstRelationshipType, secondRelationshipType, profile) {
  var firstStrength = getDependencyRelationshipStrength(firstRelationshipType, profile),
      secondStrength = getDependencyRelationshipStrength(secondRelationshipType, profile);

  if (firstStrength === -1 || secondStrength === -1) {
    return null;
  }

  return DEPENDENCY_RELATIONSHIPS_BY_STRENGTH[Math.min(firstStrength, secondStrength)];
}

export function deriveRelationshipType(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      secondRelationshipType = getRelationshipType(secondRelationship);

  if (!firstRelationshipType || !secondRelationshipType) {
    return null;
  }

  var candidate = getInLineDerivationCandidate(firstRelationshipType, secondRelationshipType, profile);

  return candidate && candidate.type || null;
}

export function deriveRelationship(firstRelationship, secondRelationship, profile) {
  if (!isRelationshipObject(firstRelationship) || !isRelationshipObject(secondRelationship)) {
    return null;
  }

  if (isRelationshipChain(firstRelationship, secondRelationship)) {
    var inLineCandidate = getInLineDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (inLineCandidate) {
      return createDerivedRelationship(inLineCandidate, firstRelationship, secondRelationship,
        firstRelationship.source, secondRelationship.target);
    }
  }

  if (isRelationshipOpposingTarget(firstRelationship, secondRelationship)) {
    var opposingTargetCandidate = getOpposingTargetDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (opposingTargetCandidate) {
      return createDerivedRelationship(opposingTargetCandidate, firstRelationship, secondRelationship,
        secondRelationship.source, firstRelationship.source);
    }
  }

  return null;
}

export function deriveRelationshipChain(relationships, profile) {
  if (!Array.isArray(relationships) || relationships.length < 2) {
    return null;
  }

  var currentRelationship = relationships[0],
      derivedFrom = getDerivedFrom(currentRelationship),
      derivationRules = [];

  for (var i = 1; i < relationships.length; i++) {
    var nextRelationship = relationships[i],
        derivedRelationship = deriveRelationship(currentRelationship, nextRelationship, profile);

    if (!derivedRelationship) {
      return null;
    }

    derivedFrom = derivedFrom.concat(getDerivedFrom(nextRelationship));
    derivationRules = derivationRules.concat(derivedRelationship.derivationRule);
    currentRelationship = Object.assign({}, derivedRelationship, {
      derivedFrom: derivedFrom,
      derivationRules: derivationRules
    });
  }

  return currentRelationship;
}

export function derivePotentialRelationship(firstRelationship, secondRelationship, options) {
  if (!isRelationshipObject(firstRelationship) || !isRelationshipObject(secondRelationship)) {
    return null;
  }

  var normalizedOptions = normalizePotentialOptions(options),
      profile = normalizedOptions.profile;

  if (isRelationshipChain(firstRelationship, secondRelationship)) {
    var inLineCandidate = getInLinePotentialDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (inLineCandidate) {
      return createPotentialDerivedRelationship(inLineCandidate, firstRelationship, secondRelationship,
        firstRelationship.source, secondRelationship.target);
    }
  }

  if (isRelationshipOpposingTarget(firstRelationship, secondRelationship)) {
    var opposingTargetCandidate = getOpposingTargetPotentialDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (opposingTargetCandidate) {
      return createPotentialDerivedRelationship(opposingTargetCandidate, firstRelationship, secondRelationship,
        opposingTargetCandidate.sourceEndpoint === 'first-source' ? firstRelationship.source : secondRelationship.source,
        opposingTargetCandidate.targetEndpoint === 'second-source' ? secondRelationship.source : firstRelationship.source);
    }
  }

  if (isRelationshipSameSource(firstRelationship, secondRelationship)) {
    var sameSourceCandidate = getSameSourcePotentialDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (sameSourceCandidate) {
      return createPotentialDerivedRelationship(sameSourceCandidate, firstRelationship, secondRelationship,
        firstRelationship.target, secondRelationship.target);
    }
  }

  if (isRelationshipFirstSourceSecondTarget(firstRelationship, secondRelationship)) {
    var firstSourceSecondTargetCandidate =
      getFirstSourceSecondTargetPotentialDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (firstSourceSecondTargetCandidate) {
      return createPotentialDerivedRelationship(firstSourceSecondTargetCandidate, firstRelationship, secondRelationship,
        secondRelationship.source, firstRelationship.target);
    }
  }

  var groupingCandidate = getGroupingPotentialDerivationCandidate(firstRelationship, secondRelationship, normalizedOptions);

  if (groupingCandidate) {
    return createPotentialDerivedRelationship(groupingCandidate, firstRelationship, secondRelationship,
      firstRelationship.target, secondRelationship.target);
  }

  return null;
}

function getInLinePotentialDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstBaseRelationshipType = getBaseRelationshipType(getRelationshipType(firstRelationship), profile),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile),
      weakestDependencyType = getWeakestDependencyRelationshipType(firstRelationship, secondRelationship, profile);

  if (firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
      isDerivableRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-specialization-outgoing'
    };
  }

  if (weakestDependencyType) {
    return {
      type: weakestDependencyType,
      rule: 'potential-dependency-weakest'
    };
  }

  if (firstBaseRelationshipType === RELATIONSHIP_FLOW && isStructuralRelationshipType(secondRelationshipType, profile)) {
    return {
      type: RELATIONSHIP_FLOW,
      rule: 'potential-flow-structural'
    };
  }

  if (firstBaseRelationshipType === RELATIONSHIP_FLOW && secondBaseRelationshipType === RELATIONSHIP_FLOW) {
    return {
      type: RELATIONSHIP_FLOW,
      rule: 'potential-flow-transitivity'
    };
  }

  return null;
}

function getOpposingTargetPotentialDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstBaseRelationshipType = getBaseRelationshipType(getRelationshipType(firstRelationship), profile),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
      isDerivableRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-specialization-incoming'
    };
  }

  if (firstBaseRelationshipType === RELATIONSHIP_TRIGGERING &&
      isStructuralRelationshipType(secondRelationshipType, profile)) {
    return {
      type: RELATIONSHIP_TRIGGERING,
      rule: 'potential-triggering-structural-incoming',
      sourceEndpoint: 'first-source',
      targetEndpoint: 'second-source'
    };
  }

  return null;
}

function getSameSourcePotentialDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      firstBaseRelationshipType = getBaseRelationshipType(firstRelationshipType, profile),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
      isDerivableRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-specialization-source-outgoing'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) &&
      isDependencyRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-structural-dependency-outgoing'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) &&
      isDynamicRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-structural-dynamic-outgoing'
    };
  }

  return null;
}

function getFirstSourceSecondTargetPotentialDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      firstBaseRelationshipType = getBaseRelationshipType(firstRelationshipType, profile),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
      isDerivableRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-specialization-source-incoming'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) &&
      isDependencyRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-structural-dependency-incoming'
    };
  }

  return null;
}

function getGroupingPotentialDerivationCandidate(firstRelationship, secondRelationship, options) {
  var profile = options.profile,
      firstBaseRelationshipType = getBaseRelationshipType(getRelationshipType(firstRelationship), profile),
      secondBaseRelationshipType = getBaseRelationshipType(getRelationshipType(secondRelationship), profile);

  if (
    firstBaseRelationshipType !== RELATIONSHIP_AGGREGATION ||
    getEndpointType(firstRelationship.source) !== OTHER_GROUPING ||
    !isRelationshipSameSource(firstRelationship, secondRelationship) ||
    GROUPING_POTENTIAL_RELATIONSHIPS.indexOf(secondBaseRelationshipType) === -1
  ) {
    return null;
  }

  if (!isRelationshipAllowed(options, firstRelationship.target, secondRelationship.target, secondBaseRelationshipType)) {
    return null;
  }

  return {
    type: secondBaseRelationshipType,
    rule: 'potential-grouping-aggregation'
  };
}

function getInLineDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      secondRelationshipType = getRelationshipType(secondRelationship),
      firstBaseRelationshipType = getBaseRelationshipType(firstRelationshipType, profile),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (
    firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
    secondBaseRelationshipType === RELATIONSHIP_SPECIALIZATION
  ) {
    return {
      type: RELATIONSHIP_SPECIALIZATION,
      rule: 'specialization-transitivity'
    };
  }

  var weakestStructuralType = getWeakestStructuralRelationshipType(firstRelationshipType, secondRelationshipType, profile);

  if (weakestStructuralType) {
    return {
      type: weakestStructuralType,
      rule: 'structural-weakest'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) && isDependencyRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'structural-dependency'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) && isDynamicRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'structural-dynamic'
    };
  }

  if (
    firstBaseRelationshipType === RELATIONSHIP_TRIGGERING &&
    isStructuralRelationshipType(secondRelationshipType, profile)
  ) {
    return {
      type: RELATIONSHIP_TRIGGERING,
      rule: 'triggering-structural'
    };
  }

  if (
    firstBaseRelationshipType === RELATIONSHIP_TRIGGERING &&
    secondBaseRelationshipType === RELATIONSHIP_TRIGGERING
  ) {
    return {
      type: RELATIONSHIP_TRIGGERING,
      rule: 'triggering-transitivity'
    };
  }

  return null;
}

function getOpposingTargetDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (!isStructuralRelationshipType(firstRelationshipType, profile)) {
    return null;
  }

  if (isDependencyRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'opposing-structural-dependency'
    };
  }

  if (secondBaseRelationshipType === RELATIONSHIP_FLOW) {
    return {
      type: RELATIONSHIP_FLOW,
      rule: 'opposing-structural-flow'
    };
  }

  return null;
}

function createDerivedRelationship(candidate, firstRelationship, secondRelationship, source, target) {
  return {
    type: candidate.type,
    source: source,
    target: target,
    derived: true,
    derivedFrom: [ firstRelationship.id, secondRelationship.id ].filter(Boolean),
    derivationRule: candidate.rule
  };
}

function createPotentialDerivedRelationship(candidate, firstRelationship, secondRelationship, source, target) {
  var derivedRelationship = createDerivedRelationship(candidate, firstRelationship, secondRelationship, source, target);

  derivedRelationship.potential = true;

  return derivedRelationship;
}

function getDerivedFrom(relationship) {
  if (!relationship) {
    return [];
  }

  if (Array.isArray(relationship.derivedFrom) && relationship.derivedFrom.length) {
    return relationship.derivedFrom.slice();
  }

  return relationship.id ? [ relationship.id ] : [];
}

function normalizePotentialOptions(options) {
  if (!options) {
    return {
      profile: null,
      isRelationshipAllowed: null
    };
  }

  if (options.profile || options.isRelationshipAllowed) {
    return options;
  }

  return {
    profile: options,
    isRelationshipAllowed: null
  };
}

function getBaseRelationshipType(relationshipType, profile) {
  var currentType = relationshipType;
  var visited = new Set();

  while (currentType && !visited.has(currentType)) {
    visited.add(currentType);

    var relationship = getProfileRelationship(currentType, profile);

    if (!relationship || !relationship.specializes) {
      return currentType;
    }

    currentType = relationship.specializes;
  }

  return relationshipType;
}

function getRelationshipType(relationship) {
  return isRelationshipObject(relationship) ? relationship.type : relationship;
}

function getProfileRelationship(relationshipType, profile) {
  var relationships = profile && profile.relationships || [];

  for (const relationship of relationships) {
    var relationshipDefinition = typeof relationship === 'string' ?
      { type: relationship } :
      relationship;

    if (relationshipDefinition && relationshipDefinition.type === relationshipType) {
      return relationshipDefinition;
    }
  }

  return null;
}

function isRelationshipObject(relationship) {
  return relationship && typeof relationship === 'object';
}

function isRelationshipChain(firstRelationship, secondRelationship) {
  var firstTargetId = getEndpointId(firstRelationship.target),
      secondSourceId = getEndpointId(secondRelationship.source);

  return Boolean(firstTargetId && secondSourceId && firstTargetId === secondSourceId);
}

function isRelationshipOpposingTarget(firstRelationship, secondRelationship) {
  var firstTargetId = getEndpointId(firstRelationship.target),
      secondTargetId = getEndpointId(secondRelationship.target);

  return Boolean(firstTargetId && secondTargetId && firstTargetId === secondTargetId);
}

function isRelationshipSameSource(firstRelationship, secondRelationship) {
  var firstSourceId = getEndpointId(firstRelationship.source),
      secondSourceId = getEndpointId(secondRelationship.source);

  return Boolean(firstSourceId && secondSourceId && firstSourceId === secondSourceId);
}

function isRelationshipFirstSourceSecondTarget(firstRelationship, secondRelationship) {
  var firstSourceId = getEndpointId(firstRelationship.source),
      secondTargetId = getEndpointId(secondRelationship.target);

  return Boolean(firstSourceId && secondTargetId && firstSourceId === secondTargetId);
}

function isRelationshipAllowed(options, source, target, relationshipType) {
  if (typeof options.isRelationshipAllowed !== 'function') {
    return false;
  }

  return !!options.isRelationshipAllowed(
    getEndpointType(source),
    getEndpointType(target),
    relationshipType,
    options.profile
  );
}

function getEndpointId(endpoint) {
  if (!endpoint) {
    return null;
  }

  if (endpoint.id) {
    return endpoint.id;
  }

  if (endpoint.elementRef && endpoint.elementRef.id) {
    return endpoint.elementRef.id;
  }

  if (endpoint.relationshipRef && endpoint.relationshipRef.id) {
    return endpoint.relationshipRef.id;
  }

  return null;
}

function getEndpointType(endpoint) {
  if (!endpoint) {
    return null;
  }

  if (endpoint.type) {
    return endpoint.type;
  }

  if (endpoint.elementRef && endpoint.elementRef.type) {
    return endpoint.elementRef.type;
  }

  if (endpoint.relationshipRef && endpoint.relationshipRef.type) {
    return endpoint.relationshipRef.type;
  }

  return null;
}

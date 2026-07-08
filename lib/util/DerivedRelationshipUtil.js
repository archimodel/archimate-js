import {
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
const DEPENDENCY_RELATIONSHIPS = [
  RELATIONSHIP_SERVING,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_ASSOCIATION
];
const DYNAMIC_RELATIONSHIPS = [
  RELATIONSHIP_TRIGGERING,
  RELATIONSHIP_FLOW
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

export function getStructuralRelationshipStrength(relationshipType, profile) {
  var baseRelationshipType = getBaseRelationshipType(relationshipType, profile);

  return STRUCTURAL_RELATIONSHIPS_BY_STRENGTH.indexOf(baseRelationshipType);
}

export function getWeakestStructuralRelationshipType(firstRelationshipType, secondRelationshipType, profile) {
  var firstStrength = getStructuralRelationshipStrength(firstRelationshipType, profile),
      secondStrength = getStructuralRelationshipStrength(secondRelationshipType, profile);

  if (firstStrength === -1 || secondStrength === -1) {
    return null;
  }

  return STRUCTURAL_RELATIONSHIPS_BY_STRENGTH[Math.min(firstStrength, secondStrength)];
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

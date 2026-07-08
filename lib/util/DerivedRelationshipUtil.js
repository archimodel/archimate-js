import {
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_COMPOSITION,
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_SPECIALIZATION
} from '../metamodel/Concept.js';

const STRUCTURAL_RELATIONSHIPS_BY_STRENGTH = [
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_COMPOSITION
];

export function isStructuralRelationshipType(relationshipType, profile) {
  return getStructuralRelationshipStrength(relationshipType, profile) !== -1;
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

  var firstBaseRelationshipType = getBaseRelationshipType(firstRelationshipType, profile),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (
    firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
    secondBaseRelationshipType === RELATIONSHIP_SPECIALIZATION
  ) {
    return RELATIONSHIP_SPECIALIZATION;
  }

  return getWeakestStructuralRelationshipType(firstRelationshipType, secondRelationshipType, profile);
}

export function deriveRelationship(firstRelationship, secondRelationship, profile) {
  var derivedType = deriveRelationshipType(firstRelationship, secondRelationship, profile);

  if (!derivedType || !isRelationshipObject(firstRelationship) || !isRelationshipObject(secondRelationship)) {
    return null;
  }

  if (!isRelationshipChain(firstRelationship, secondRelationship)) {
    return null;
  }

  return {
    type: derivedType,
    source: firstRelationship.source,
    target: secondRelationship.target,
    derived: true,
    derivedFrom: [ firstRelationship.id, secondRelationship.id ].filter(Boolean),
    derivationRule: derivedType === RELATIONSHIP_SPECIALIZATION ?
      'specialization-transitivity' :
      'structural-weakest'
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

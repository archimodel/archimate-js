import {
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_ASSOCIATION,
  RELATIONSHIP_COMPOSITION,
  RELATIONSHIP_FLOW,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_JUNCTION_AND,
  RELATIONSHIP_JUNCTION_OR,
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_SERVING,
  RELATIONSHIP_SPECIALIZATION,
  RELATIONSHIP_TRIGGERING,
  IMP_MIG_PLATEAU,
  OTHER_GROUPING,
  OTHER_LOCATION
} from '../metamodel/Concept.js';

const ARCHIMATE_RELATIONSHIP_TYPES = [
  RELATIONSHIP_COMPOSITION,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_ASSOCIATION,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_SERVING,
  RELATIONSHIP_TRIGGERING,
  RELATIONSHIP_FLOW,
  RELATIONSHIP_SPECIALIZATION
];

const RELATIONSHIP_CONCEPT_AGGREGATORS = [
  OTHER_GROUPING,
  OTHER_LOCATION,
  IMP_MIG_PLATEAU
];

export function isRelationshipJunctionType(type) {
  return type === RELATIONSHIP_JUNCTION_AND || type === RELATIONSHIP_JUNCTION_OR;
}

export function isRelationshipJunctionElement(element) {
  var businessObject = element && element.businessObject,
      elementRef = businessObject && businessObject.elementRef;

  return isRelationshipJunctionType(element && element.type) ||
    isRelationshipJunctionType(elementRef && elementRef.type);
}

export function isRelationshipConnectedToJunction(connection) {
  return isRelationshipJunctionElement(connection && connection.source) ||
    isRelationshipJunctionElement(connection && connection.target);
}

export function isRelationshipConceptAggregator(element) {
  return RELATIONSHIP_CONCEPT_AGGREGATORS.indexOf(getConceptType(element)) !== -1;
}

export function isRelationshipConcept(element) {
  return isRelationshipJunctionElement(element) ||
    ARCHIMATE_RELATIONSHIP_TYPES.indexOf(getConceptType(element)) !== -1;
}

export function getRelationshipConceptAggregationType(source, target, profile) {
  if (!profile || profile.version !== '4.0') {
    return null;
  }

  if (!isRelationshipConceptAggregator(source) || !isRelationshipConcept(target)) {
    return null;
  }

  return RELATIONSHIP_AGGREGATION;
}

export function canApplyRelationshipMultiplicity(connection) {
  return !isRelationshipConnectedToJunction(connection);
}

export function getJunctionRelationshipTypeCandidates(source, target, exceptConnection, relationshipAllowed, profile) {
  var types = getExistingJunctionRelationshipTypes(source, target, exceptConnection);

  if (!types) {
    return [];
  }

  if (!types.length) {
    types = ARCHIMATE_RELATIONSHIP_TYPES.slice();
  }

  return types.filter(function(relationshipType) {
    return isJunctionEndpointChainAllowed(source, target, relationshipType, exceptConnection, relationshipAllowed, profile);
  });
}

export function isJunctionRelationshipTypeAllowed(source, target, relationshipType, exceptConnection, relationshipAllowed, profile) {
  if (!isRelationshipJunctionElement(source) && !isRelationshipJunctionElement(target)) {
    return true;
  }

  if (!relationshipType) {
    return true;
  }

  var candidates = getJunctionRelationshipTypeCandidates(source, target, exceptConnection, relationshipAllowed, profile);

  return candidates.indexOf(relationshipType) !== -1;
}

export function isJunctionEndpointChainAllowed(source, target, relationshipType, exceptConnection, relationshipAllowed, profile) {
  if (!relationshipAllowed || !relationshipType) {
    return true;
  }

  var endpointPairs = getJunctionEndpointPairs(source, target, exceptConnection);

  for (const pair of endpointPairs) {
    if (!relationshipAllowed(pair.sourceType, pair.targetType, relationshipType, profile)) {
      return false;
    }
  }

  return true;
}

function getExistingJunctionRelationshipTypes(source, target, exceptConnection) {
  var junctions = [];

  if (isRelationshipJunctionElement(source)) {
    junctions.push(source);
  }

  if (isRelationshipJunctionElement(target) && target !== source) {
    junctions.push(target);
  }

  if (!junctions.length) {
    return [];
  }

  var allTypes = [];

  for (const junction of junctions) {
    var types = getRelationshipTypesConnectedToJunction(junction, exceptConnection);

    if (hasConflictingTypes(types)) {
      return null;
    }

    allTypes = allTypes.concat(types);
  }

  var uniqueTypes = unique(allTypes);

  if (hasConflictingTypes(uniqueTypes)) {
    return null;
  }

  return uniqueTypes;
}

function getRelationshipTypesConnectedToJunction(junction, exceptConnection) {
  var connections = (junction.incoming || []).concat(junction.outgoing || []),
      types = [];

  for (const connection of connections) {
    if (connection === exceptConnection) {
      continue;
    }

    var type = getRelationshipType(connection);

    if (type) {
      types.push(type);
    }
  }

  return unique(types);
}

function getJunctionEndpointPairs(source, target, exceptConnection) {
  var pairs = [];

  if (isRelationshipJunctionElement(target) && !isRelationshipJunctionElement(source)) {
    pairs = pairs.concat(getPairsForIncomingJunctionCandidate(source, target, exceptConnection));
  }

  if (isRelationshipJunctionElement(source) && !isRelationshipJunctionElement(target)) {
    pairs = pairs.concat(getPairsForOutgoingJunctionCandidate(source, target, exceptConnection));
  }

  return pairs;
}

function getPairsForIncomingJunctionCandidate(source, junction, exceptConnection) {
  var sourceType = getElementType(source),
      pairs = [];

  for (const connection of junction.outgoing || []) {
    if (connection === exceptConnection) {
      continue;
    }

    var targetType = getElementType(connection.target);

    if (sourceType && targetType && !isRelationshipJunctionElement(connection.target)) {
      pairs.push({ sourceType: sourceType, targetType: targetType });
    }
  }

  return pairs;
}

function getPairsForOutgoingJunctionCandidate(junction, target, exceptConnection) {
  var targetType = getElementType(target),
      pairs = [];

  for (const connection of junction.incoming || []) {
    if (connection === exceptConnection) {
      continue;
    }

    var sourceType = getElementType(connection.source);

    if (sourceType && targetType && !isRelationshipJunctionElement(connection.source)) {
      pairs.push({ sourceType: sourceType, targetType: targetType });
    }
  }

  return pairs;
}

function getElementType(element) {
  return getConceptType(element);
}

function getConceptType(element) {
  var businessObject = element && element.businessObject,
      elementRef = businessObject && businessObject.elementRef,
      relationshipRef = businessObject && businessObject.relationshipRef;

  return elementRef && elementRef.type ||
    relationshipRef && relationshipRef.type ||
    element && element.type;
}

function getRelationshipType(connection) {
  var businessObject = connection && connection.businessObject,
      relationshipRef = businessObject && businessObject.relationshipRef,
      type = relationshipRef && relationshipRef.type || connection && connection.type;

  return ARCHIMATE_RELATIONSHIP_TYPES.indexOf(type) !== -1 ? type : null;
}

function unique(values) {
  var result = [];

  for (const value of values) {
    if (result.indexOf(value) === -1) {
      result.push(value);
    }
  }

  return result;
}

function hasConflictingTypes(types) {
  return types.length > 1;
}

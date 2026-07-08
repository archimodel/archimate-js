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
  RELATIONSHIP_TRIGGERING
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

export function canApplyRelationshipMultiplicity(connection) {
  return !isRelationshipConnectedToJunction(connection);
}

export function getJunctionRelationshipTypeCandidates(source, target, exceptConnection) {
  var types = getExistingJunctionRelationshipTypes(source, target, exceptConnection);

  if (!types) {
    return [];
  }

  if (!types.length) {
    return ARCHIMATE_RELATIONSHIP_TYPES.slice();
  }

  return types;
}

export function isJunctionRelationshipTypeAllowed(source, target, relationshipType, exceptConnection) {
  if (!isRelationshipJunctionElement(source) && !isRelationshipJunctionElement(target)) {
    return true;
  }

  if (!relationshipType) {
    return true;
  }

  var candidates = getJunctionRelationshipTypeCandidates(source, target, exceptConnection);

  return candidates.indexOf(relationshipType) !== -1;
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

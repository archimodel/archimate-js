import {
  RELATIONSHIP_JUNCTION_AND,
  RELATIONSHIP_JUNCTION_OR
} from '../metamodel/Concept.js';

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

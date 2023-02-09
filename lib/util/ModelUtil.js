import * as CX from "../metamodel/Concept"
import * as BX from "../metamodel/BusinessRelationship";

export const VIEW = 'root',
  NOTE = 'archimate:Note';

const RELATIONSHIP_SET = new Set([
  CX.RELATIONSHIP_ACCESS,
  CX.RELATIONSHIP_AGGREGATION,
  CX.RELATIONSHIP_ASSIGNMENT,
  CX.RELATIONSHIP_ASSOCIATION,
  CX.RELATIONSHIP_COMPOSITION,
  CX.RELATIONSHIP_FLOW,
  CX.RELATIONSHIP_INFLUENCE,
  CX.RELATIONSHIP_REALIZATION,
  CX.RELATIONSHIP_SERVING,
  CX.RELATIONSHIP_SPECIALIZATION,
  CX.RELATIONSHIP_TRIGGERING
]);

const LAYER_TYPE_SET = new Set([
  CX.LAYER_MOTIVATION,
  CX.LAYER_STRATEGY,
  CX.LAYER_BUSINESS,
  CX.LAYER_APPLICATION,
  CX.LAYER_TECHNOLOGY,
  CX.LAYER_PHYSICAL,
  CX.LAYER_IMP_MIG,
  CX.LAYER_OTHER
]);

/* const ASPECT_TYPE_SET = new Set([
  CX.ASPECT_PASSIVE,
  CX.ASPECT_BEHAVIOR,
  CX.ASPECT_ACTIVE,
  CX.ASPECT_MOTIVATION
]);*/

const ELEMENT_TYPE_MAP = new Map([
  [NOTE, {typeName: 'Note'}],
  [VIEW, {typeName: 'View'}],
  [CX.RELATIONSHIP_JUNCTION_AND, {typeName: 'And Junction'}],
  [CX.RELATIONSHIP_JUNCTION_OR, {typeName: 'Or Junction'}],
  [CX.BUSINESS_ACTOR, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_ACTIVE, typeName: 'Business Actor', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_ACTOR}],
  [CX.BUSINESS_COLLABORATION, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_ACTIVE, typeName: 'Business Collaboration', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_COLLABORATION}],
  [CX.BUSINESS_EVENT, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Event', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_EVENT}],
  [CX.BUSINESS_FUNCTION, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Function', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_FUNCTION}],
  [CX.BUSINESS_INTERACTION, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Interaction', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_INTERACTION}],
  [CX.BUSINESS_INTERFACE, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_ACTIVE, typeName: 'Business Interface', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_INTERFACE}],
  [CX.BUSINESS_OBJECT, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Business Object', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_OBJECT}],
  [CX.BUSINESS_PROCESS, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Process', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_PROCESS}],
  [CX.BUSINESS_ROLE, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_ACTIVE, typeName: 'Business Role', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_ROLE}],
  [CX.BUSINESS_SERVICE, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Service', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_SERVICE}],
  [CX.BUSINESS_CONTRACT, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Contract', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_CONTRACT}],
  [CX.BUSINESS_PRODUCT, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Product', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_PRODUCT}],
  [CX.BUSINESS_REPRESENTATION, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Representation'}],
  [CX.APPLICATION_INTERFACE, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_ACTIVE, typeName: 'Application Interface'}],
  [CX.APPLICATION_FUNCTION, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Function'}],
  [CX.APPLICATION_PROCESS, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Process'}],
  [CX.TECHNOLOGY_INTERFACE, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Technology Interface'}],
  [CX.TECHNOLOGY_FUNCTION, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Function'}],
  [CX.TECHNOLOGY_PROCESS, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Process'}]
]);

const BASE_ELEMENT_TYPE_SET = new Set([
  CX.BUSINESS_ACTOR, CX.BUSINESS_INTERFACE, CX.BUSINESS_FUNCTION, CX.BUSINESS_PROCESS,
  CX.APPLICATION_INTERFACE, CX.APPLICATION_FUNCTION, CX.APPLICATION_PROCESS,
  CX.TECHNOLOGY_INTERFACE, CX.TECHNOLOGY_FUNCTION, CX.TECHNOLOGY_PROCESS
]);

export function isBaseElementType(baseElementType) {
  return baseElementType && BASE_ELEMENT_TYPE_SET.has(baseElementType);
}

export function isRelationshipType(relationshipType) {
  return relationshipType && RELATIONSHIP_SET.has(relationshipType);
}

export function isLayerType(layerType) {
  return layerType && LAYER_TYPE_SET.has(layerType);
}

export function getLayerType(baseElementType) {
  var layer = null;

  if (isBaseElementType(baseElementType)) {
    layer = ELEMENT_TYPE_MAP.get(baseElementType).layer;
  }
  return layer;
}

export function getAspectType(baseElementType) {
  var aspect = null;

  if (isBaseElementType(baseElementType)) {
    aspect = ELEMENT_TYPE_MAP.get(baseElementType).aspect;
  }
  return aspect;
}

export function getTypeName(elementType) {
  var typeName = null;

  if (elementType && ELEMENT_TYPE_MAP.has(elementType)) {
    typeName = ELEMENT_TYPE_MAP.get(elementType).typeName;
  }
  return typeName;
}

export function getRelationshipMap(elementType) {
  var relationshipMap = null;
  
  if (elementType && ELEMENT_TYPE_MAP.has(elementType)) {
    relationshipMap = ELEMENT_TYPE_MAP.get(elementType).relationshipMap;
  }
  return relationshipMap;
}

/**
 * Is an element of the given Archimate type?
 *
 * @param  {djs.model.Base|ModdleElement} element
 * @param  {String} type
 *
 * @return {Boolean}
 */
export function is(element, type) {
  // var bo = getBusinessObject(element);
  // var bo = getElementRef(element)
  return element && (typeof element.$instanceOf === 'function') && element.$instanceOf(type);
}


export function isViewElementType(element, type) {
  var viewElement = getViewElement(element)
  return viewElement && (typeof viewElement.$instanceOf === 'function') && viewElement.$instanceOf(type);

}

/**
 * Return the business object for a given element.
 *
 * @param  {djs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}

export function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}
 */
/**
 * Return the di object for a given element.
 *
 * @param  {djs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}

 export function getDiObject(element) {
  return (element && element.diObject) || element;
}
 */

/**
 * Return the Archimate Element object (ElementRef) from the Element's table
 * for a Shape element object. 
 *
 * @param  {djs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}
 */
 export function getElementRef(element) {
  var viewElement = getViewElement(element);

  return (viewElement && viewElement.elementRef) || null;

    // return (element && element.businessObject) || element;
}

/**
 * Return the ViewElement object for a Shape element object.
 *
 * @param  {djs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}
 */
 export function getViewElement(element) {

  return (element && element.businessObject) || null;

    // return (element && element.diObject) || element;
}
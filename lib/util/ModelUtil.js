export const VIEW = 'root',
  NOTE = 'archimate:Note',
  BUSINESS_ACTOR = 'BusinessActor',
  BUSINESS_INTERFACE = 'BusinessInterface',
  BUSINESS_FUNCTION = 'BusinessFunction',
  BUSINESS_PROCESS = 'BusinessProcess',
  APPLICATION_INTERFACE = 'ApplicationInterface',
  APPLICATION_FUNCTION = 'ApplicationFunction',
  APPLICATION_PROCESS = 'ApplicationProcess',
  TECHNOLOGY_INTERFACE = 'TechnologyInterface',
  TECHNOLOGY_FUNCTION = 'TechnologyFunction',
  TECHNOLOGY_PROCESS = 'TechnologyProcess';

export const LAYER_STRATEGY = 'Strategy',
  LAYER_BUSINESS = 'Business',
  LAYER_APPLICATION = 'Application',
  LAYER_TECHNOLOGY = 'Technology',
  LAYER_SUB_PHYSICAL = 'Physical',
//  LAYER_IMPL_MIG = 'Implementation & Migration',
  LAYER_SUB_IMPLEMENTATION = 'Implementation',
  LAYER_SUB_MIGRATION = 'Migration',
  LAYER_MOTIVATION = 'Motivation';

const LAYER_TYPE_SET = new Set([
  LAYER_STRATEGY,
  LAYER_BUSINESS,
  LAYER_APPLICATION,
  LAYER_TECHNOLOGY,
  LAYER_SUB_PHYSICAL,
  LAYER_SUB_IMPLEMENTATION,
  LAYER_SUB_MIGRATION,
  LAYER_MOTIVATION
])

export var ASPECT_PASSIVE = 'Passive structure',
  ASPECT_BEHAVIOR = 'Behavior',
  ASPECT_ACTIVE = 'Active structure',
  ASPECT_MOTIVATION = 'Motivation';

const ASPECT_TYPE_SET = new Set([
  ASPECT_PASSIVE,
  ASPECT_BEHAVIOR,
  ASPECT_ACTIVE,
  ASPECT_MOTIVATION
]);

const ELEMENT_TYPE_MAP = new Map([
  [BUSINESS_ACTOR, {layer: LAYER_BUSINESS, aspect: ASPECT_ACTIVE, typeName: 'Business Actor'}],
  [BUSINESS_INTERFACE, {layer: LAYER_BUSINESS, aspect: ASPECT_ACTIVE, typeName: 'Business Interface'}],
  [BUSINESS_FUNCTION, {layer: LAYER_BUSINESS, aspect: ASPECT_BEHAVIOR, typeName: 'Business Function'}],
  [BUSINESS_PROCESS, {layer: LAYER_BUSINESS, aspect: ASPECT_BEHAVIOR, typeName: 'Business Process'}],
  [APPLICATION_INTERFACE, {layer: LAYER_APPLICATION, aspect: ASPECT_ACTIVE, typeName: 'Application Interface'}],
  [APPLICATION_FUNCTION, {layer: LAYER_APPLICATION, aspect: ASPECT_BEHAVIOR, typeName: 'Application Function'}],
  [APPLICATION_PROCESS, {layer: LAYER_APPLICATION, aspect: ASPECT_BEHAVIOR, typeName: 'Application Process'}],
  [TECHNOLOGY_INTERFACE, {layer: LAYER_TECHNOLOGY, aspect: ASPECT_ACTIVE, typeName: 'Technology Interface'}],
  [TECHNOLOGY_FUNCTION, {layer: LAYER_TECHNOLOGY, aspect: ASPECT_BEHAVIOR, typeName: 'Technology Function'}],
  [TECHNOLOGY_PROCESS, {layer: LAYER_TECHNOLOGY, aspect: ASPECT_BEHAVIOR, typeName: 'Technology Process'}],
  [NOTE, {typeName: 'Note'}],
  [VIEW, {typeName: 'View'}]
]);

const BASE_ELEMENT_TYPE_SET = new Set([
  BUSINESS_ACTOR, BUSINESS_INTERFACE, BUSINESS_FUNCTION, BUSINESS_PROCESS,
  APPLICATION_INTERFACE, APPLICATION_FUNCTION, APPLICATION_PROCESS,
  TECHNOLOGY_INTERFACE, TECHNOLOGY_FUNCTION, TECHNOLOGY_PROCESS
])

export function isBaseElementType(baseElementType) {
  return baseElementType && BASE_ELEMENT_TYPE_SET.has(baseElementType);
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
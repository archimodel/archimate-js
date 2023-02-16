import * as CX from "../metamodel/Concept";
import * as RX from "../metamodel/RelationshipRelationshipMap";
import * as BX from "../metamodel/BusinessRelationshipMap";
import * as AX from "../metamodel/ApplicationRelationshipMap";
import * as TX from "../metamodel/TechnologyRelationshipMap";
import * as PX from "../metamodel/PhysicalRelationshipMap";
import * as MX from "../metamodel/MotivationRelationshipMap";
import * as IX from "../metamodel/ImpMigRelationshipMap";
import * as SX from "../metamodel/StrategyRelationshipMap";
import * as OX from "../metamodel/OtherRelationshipMap";

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
  [CX.RELATIONSHIP_ACCESS, {typeName: 'Access', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_ACCESS}],
  [CX.RELATIONSHIP_AGGREGATION, {typeName: 'Aggregation', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_AGGREGATION}],
  [CX.RELATIONSHIP_ASSIGNMENT, {typeName: 'Assignment', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_ASSIGNMENT}],
  [CX.RELATIONSHIP_ASSOCIATION, {typeName: 'Association', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_ASSOCIATION}],
  [CX.RELATIONSHIP_COMPOSITION, {typeName: 'Composition', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_COMPOSITION}],
  [CX.RELATIONSHIP_FLOW, {typeName: 'Flow', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_FLOW}],
  [CX.RELATIONSHIP_INFLUENCE, {typeName: 'Influence', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_INFLUENCE}],
  [CX.RELATIONSHIP_JUNCTION_AND, {typeName: 'And Junction', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_JUNCTION_AND}],
  [CX.RELATIONSHIP_JUNCTION_OR, {typeName: 'Or Junction', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_JUNCTION_OR}],
  [CX.RELATIONSHIP_REALIZATION, {typeName: 'Realization', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_REALIZATION}],
  [CX.RELATIONSHIP_SERVING, {typeName: 'Serving', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_SERVING}],
  [CX.RELATIONSHIP_SPECIALIZATION, {typeName: 'Specialization', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_SPECIALIZATION}],
  [CX.RELATIONSHIP_TRIGGERING, {typeName: 'Triggering', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_TRIGGERING}],
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
  [CX.BUSINESS_REPRESENTATION, {layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Representation', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_REPRESENTATION}],
  [CX.APPLICATION_COLLABORATION, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_ACTIVE, typeName: 'Application Collaboration', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_COLLABORATION}],
  [CX.APPLICATION_COMPONENT, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_ACTIVE, typeName: 'Application Component', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_COMPONENT}],
  [CX.APPLICATION_EVENT, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Event', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_EVENT}],
  [CX.APPLICATION_FUNCTION, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Function', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_FUNCTION}],
  [CX.APPLICATION_INTERACTION, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Interaction', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_INTERACTION}],
  [CX.APPLICATION_INTERFACE, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_ACTIVE, typeName: 'Application Interface', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_INTERFACE}],
  [CX.APPLICATION_PROCESS, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Process', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_PROCESS}],
  [CX.APPLICATION_SERVICE, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Service', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_SERVICE}],
  [CX.APPLICATION_DATA_OBJECT, {layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_PASSIVE, typeName: 'Data Object', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_DATA_OBJECT}],
  [CX.TECHNOLOGY_ARTIFACT, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_PASSIVE, typeName: 'Artifact', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_ARTIFACT}],
  [CX.TECHNOLOGY_COMMUNICATION_NETWORK, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Communication Network', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_COMMUNICATION_NETWORK}],
  [CX.TECHNOLOGY_DEVICE, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Device', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_DEVICE}],
  [CX.TECHNOLOGY_NODE, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Node', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_NODE}],
  [CX.TECHNOLOGY_PATH, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Path', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_PATH}],
  [CX.TECHNOLOGY_SYSTEM_SOFTWARE, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'System Software', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_SYSTEM_SOFTWARE}],
  [CX.TECHNOLOGY_COLLABORATION, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Technology Collaboration', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_COLLABORATION}],
  [CX.TECHNOLOGY_EVENT, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Event', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_EVENT}],
  [CX.TECHNOLOGY_FUNCTION, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Function', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_FUNCTION}],
  [CX.TECHNOLOGY_INTERACTION, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Interaction', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_INTERACTION}],
  [CX.TECHNOLOGY_INTERFACE, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Technology Interface', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_INTERFACE}],
  [CX.TECHNOLOGY_PROCESS, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Process', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_PROCESS}],
  [CX.TECHNOLOGY_SERVICE, {layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Service', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_SERVICE}],
  [CX.PHYSICAL_DISTRIBUTION_NETWORK, {layer: CX.LAYER_PHYSICAL, aspect: CX.ASPECT_ACTIVE, typeName: 'Distribution Network', relationshipMap: PX.RELATIONSHIPS_ALLOWED_FROM_PHYSICAL_DISTRIBUTION_NETWORK}],
  [CX.PHYSICAL_EQUIPMENT, {layer: CX.LAYER_PHYSICAL, aspect: CX.ASPECT_ACTIVE, typeName: 'Equipment', relationshipMap: PX.RELATIONSHIPS_ALLOWED_FROM_PHYSICAL_EQUIPMENT}],
  [CX.PHYSICAL_FACILITY, {layer: CX.LAYER_PHYSICAL, aspect: CX.ASPECT_ACTIVE, typeName: 'Facility', relationshipMap: PX.RELATIONSHIPS_ALLOWED_FROM_PHYSICAL_FACILITY}],
  [CX.PHYSICAL_MATERIAL, {layer: CX.LAYER_PHYSICAL, aspect: CX.ASPECT_ACTIVE, typeName: 'Material', relationshipMap: PX.RELATIONSHIPS_ALLOWED_FROM_PHYSICAL_MATERIAL}],
  [CX.STRATEGY_CAPABILITY, {layer: CX.LAYER_STRATEGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Capability', relationshipMap: SX.RELATIONSHIPS_ALLOWED_FROM_STRATEGY_CAPABILITY}],
  [CX.STRATEGY_COURSE_OF_ACTION, {layer: CX.LAYER_STRATEGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Course Of Action', relationshipMap: SX.RELATIONSHIPS_ALLOWED_FROM_STRATEGY_COURSE_OF_ACTION}],
  [CX.STRATEGY_RESOURCE, {layer: CX.LAYER_STRATEGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Resource', relationshipMap: SX.RELATIONSHIPS_ALLOWED_FROM_STRATEGY_RESOURCE}],
  [CX.STRATEGY_VALUE_STREAM, {layer: CX.LAYER_STRATEGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Value Stream', relationshipMap: SX.RELATIONSHIPS_ALLOWED_FROM_STRATEGY_VALUE_STREAM}],
  [CX.MOTIVATION_ASSESSMENT, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Assessment', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_ASSESSMENT}],
  [CX.MOTIVATION_CONSTRAINT, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Constraint', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_CONSTRAINT}],
  [CX.MOTIVATION_DRIVER, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Driver', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_DRIVER}],
  [CX.MOTIVATION_GOAL, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Goal', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_GOAL}],
  [CX.MOTIVATION_MEANING, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Meaning', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_MEANING}],
  [CX.MOTIVATION_OUTCOME, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Outcome', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_OUTCOME}],
  [CX.MOTIVATION_PRINCIPLE, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Principle', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_PRINCIPLE}],
  [CX.MOTIVATION_REQUIREMENT, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Requirement', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_REQUIREMENT}],
  [CX.MOTIVATION_STAKEHOLDER, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Stakeholder', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_STAKEHOLDER}],
  [CX.MOTIVATION_VALUE, {layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Value', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_VALUE}],
  [CX.IMP_MIG_DELIVERABLE, {layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_ACTIVE, typeName: 'Deliverable', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_DELIVRABLE}],
  [CX.IMP_MIG_GAP, {layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_ACTIVE, typeName: 'Gap', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_GAP}],
  [CX.IMP_MIG_IMPLEMENTATION_EVENT, {layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Implementation Event', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_IMPLEMENTATION_EVENT}],
  [CX.IMP_MIG_PLATEAU, {layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_ACTIVE, typeName: 'Plateau', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_PLATEAU}],
  [CX.IMP_MIG_WORK_PACKAGE, {layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Work Package', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_WORK_PACKAGE}],
  [CX.OTHER_GROUPING, {layer: CX.LAYER_OTHER, aspect: CX.ASPECT_ACTIVE, typeName: 'Grouping', relationshipMap: OX.RELATIONSHIPS_ALLOWED_FROM_OTHER_GROUPING}],
  [CX.OTHER_LOCATION, {layer: CX.LAYER_OTHER, aspect: CX.ASPECT_ACTIVE, typeName: 'Location', relationshipMap: OX.RELATIONSHIPS_ALLOWED_FROM_OTHER_LOCATION}]
]);

/*const BASE_ELEMENT_TYPE_SET = new Set([
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
*/

export function isLayerType(layerType) {
  return layerType && LAYER_TYPE_SET.has(layerType);
}

export function getLayerType(elementType) {
  return ELEMENT_TYPE_MAP.get(elementType) && ELEMENT_TYPE_MAP.get(elementType).layer;
}

export function getAspectType(elementType) {
  return ELEMENT_TYPE_MAP.get(elementType) && ELEMENT_TYPE_MAP.get(elementType).aspect;
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
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

export const RELATIONSHIP_ELEMENT_MAP = new Map([
  [CX.RELATIONSHIP_ACCESS, {className: 'archimate-relation-access', typeName: 'Access', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_ACCESS}],
  [CX.RELATIONSHIP_AGGREGATION, {className: 'archimate-relation-aggregation', typeName: 'Aggregation', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_AGGREGATION}],
  [CX.RELATIONSHIP_ASSIGNMENT, {className: 'archimate-relation-assignment', typeName: 'Assignment', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_ASSIGNMENT}],
  [CX.RELATIONSHIP_ASSOCIATION, {className: 'archimate-relation-association', typeName: 'Association', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_ASSOCIATION}],
  [CX.RELATIONSHIP_COMPOSITION, {className: 'archimate-relation-composition', typeName: 'Composition', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_COMPOSITION}],
  [CX.RELATIONSHIP_FLOW, {className: 'archimate-relation-flow', typeName: 'Flow', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_FLOW}],
  [CX.RELATIONSHIP_INFLUENCE, {className: 'archimate-relation-influence', typeName: 'Influence', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_INFLUENCE}],
  [CX.RELATIONSHIP_JUNCTION_AND, {className: 'archimate-relation-and-junction', typeName: 'And Junction', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_JUNCTION_AND}],
  [CX.RELATIONSHIP_JUNCTION_OR, {className: 'archimate-relation-or-junction', typeName: 'Or Junction', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_JUNCTION_OR}],
  [CX.RELATIONSHIP_REALIZATION, {className: 'archimate-relation-realization', typeName: 'Realization', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_REALIZATION}],
  [CX.RELATIONSHIP_SERVING, {className: 'archimate-relation-serving', typeName: 'Serving', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_SERVING}],
  [CX.RELATIONSHIP_SPECIALIZATION, {className: 'archimate-relation-specialization', typeName: 'Specialization', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_SPECIALIZATION}],
  [CX.RELATIONSHIP_TRIGGERING, {className: 'archimate-relation-triggering', typeName: 'Triggering', relationshipMap: RX.RELATIONSHIPS_ALLOWED_FROM_RELATIONSHIP_TRIGGERING}],
]);
  
export const STRATEGY_ELEMENT_MAP = new Map([
  [CX.STRATEGY_RESOURCE, { className: 'archimate-strategy-resource', layer: CX.LAYER_STRATEGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Resource', relationshipMap: SX.RELATIONSHIPS_ALLOWED_FROM_STRATEGY_RESOURCE}],
  [CX.STRATEGY_CAPABILITY, { className: 'archimate-strategy-capability', layer: CX.LAYER_STRATEGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Capability', relationshipMap: SX.RELATIONSHIPS_ALLOWED_FROM_STRATEGY_CAPABILITY}],
  [CX.STRATEGY_VALUE_STREAM, { className: 'archimate-strategy-value-stream', layer: CX.LAYER_STRATEGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Value Stream', relationshipMap: SX.RELATIONSHIPS_ALLOWED_FROM_STRATEGY_VALUE_STREAM}],
  [CX.STRATEGY_COURSE_OF_ACTION, { className: 'archimate-strategy-course-of-action', layer: CX.LAYER_STRATEGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Course Of Action', relationshipMap: SX.RELATIONSHIPS_ALLOWED_FROM_STRATEGY_COURSE_OF_ACTION}],
]);

export const BUSINESS_ELEMENT_MAP = new Map([
  [CX.BUSINESS_ACTOR, { className: 'archimate-business-actor', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_ACTIVE, typeName: 'Business Actor', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_ACTOR}],
  [CX.BUSINESS_ROLE, { className: 'archimate-business-role', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_ACTIVE, typeName: 'Business Role', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_ROLE}],
  [CX.BUSINESS_COLLABORATION, { className: 'archimate-business-collaboration', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_ACTIVE, typeName: 'Business Collaboration', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_COLLABORATION}],
  [CX.BUSINESS_INTERFACE, { className: 'archimate-business-interface', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_ACTIVE, typeName: 'Business Interface', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_INTERFACE}],
  [CX.BUSINESS_PROCESS, { className: 'archimate-business-process', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Process', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_PROCESS}],
  [CX.BUSINESS_FUNCTION, { className: 'archimate-business-function', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Function', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_FUNCTION}],
  [CX.BUSINESS_INTERACTION, { className: 'archimate-business-interaction', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Interaction', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_INTERACTION}],
  [CX.BUSINESS_EVENT, { className: 'archimate-business-event', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Event', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_EVENT}],
  [CX.BUSINESS_SERVICE, { className: 'archimate-business-service', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Business Service', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_SERVICE}],
  [CX.BUSINESS_OBJECT, { className: 'archimate-business-object', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Business Object', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_OBJECT}],
  [CX.BUSINESS_CONTRACT, { className: 'archimate-business-contract', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Contract', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_CONTRACT}],
  [CX.BUSINESS_REPRESENTATION, { className: 'archimate-business-representation', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Representation', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_REPRESENTATION}],
  [CX.BUSINESS_PRODUCT, { className: 'archimate-business-product', layer: CX.LAYER_BUSINESS, aspect: CX.ASPECT_PASSIVE, typeName: 'Product', relationshipMap: BX.RELATIONSHIPS_ALLOWED_FROM_BUSINESS_PRODUCT}],
]);

export const APPLICATION_ELEMENT_MAP = new Map([
  [CX.APPLICATION_COMPONENT, { className: 'archimate-application-component', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_ACTIVE, typeName: 'Application Component', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_COMPONENT}],
  [CX.APPLICATION_COLLABORATION, { className: 'archimate-application-collaboration', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_ACTIVE, typeName: 'Application Collaboration', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_COLLABORATION}],
  [CX.APPLICATION_INTERFACE, { className: 'archimate-application-interface', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_ACTIVE, typeName: 'Application Interface', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_INTERFACE}],
  [CX.APPLICATION_FUNCTION, { className: 'archimate-application-function', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Function', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_FUNCTION}],
  [CX.APPLICATION_INTERACTION, { className: 'archimate-application-interaction', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Interaction', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_INTERACTION}],
  [CX.APPLICATION_PROCESS, { className: 'archimate-application-process', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Process', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_PROCESS}],
  [CX.APPLICATION_EVENT, { className: 'archimate-application-event', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Event', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_EVENT}],
  [CX.APPLICATION_SERVICE, { className: 'archimate-application-service', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Application Service', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_SERVICE}],
  [CX.APPLICATION_DATA_OBJECT, { className: 'archimate-application-data-object', layer: CX.LAYER_APPLICATION, aspect: CX.ASPECT_PASSIVE, typeName: 'Data Object', relationshipMap: AX.RELATIONSHIPS_ALLOWED_FROM_APPLICATION_DATA_OBJECT}],
]);

export const TECHNOLOGY_ELEMENT_MAP = new Map([
  [CX.TECHNOLOGY_ARTIFACT, { className: 'archimate-technology-artifact', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_PASSIVE, typeName: 'Artifact', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_ARTIFACT}],
  [CX.TECHNOLOGY_COMMUNICATION_NETWORK, { className: 'archimate-technology-communication-network', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Communication Network', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_COMMUNICATION_NETWORK}],
  [CX.TECHNOLOGY_DEVICE, { className: 'archimate-technology-device', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Device', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_DEVICE}],
  [CX.TECHNOLOGY_NODE, { className: 'archimate-technology-node', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Node', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_NODE}],
  [CX.TECHNOLOGY_PATH, { className: 'archimate-technology-path', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Path', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_PATH}],
  [CX.TECHNOLOGY_SYSTEM_SOFTWARE, { className: 'archimate-technology-system-software', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'System Software', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_SYSTEM_SOFTWARE}],
  [CX.TECHNOLOGY_COLLABORATION, { className: 'archimate-technology-collaboration', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Technology Collaboration', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_COLLABORATION}],
  [CX.TECHNOLOGY_EVENT, { className: 'archimate-technology-event', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Event', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_EVENT}],
  [CX.TECHNOLOGY_FUNCTION, { className: 'archimate-technology-function', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Function', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_FUNCTION}],
  [CX.TECHNOLOGY_INTERACTION, { className: 'archimate-technology-interaction', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Interaction', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_INTERACTION}],
  [CX.TECHNOLOGY_INTERFACE, { className: 'archimate-technology-interface', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_ACTIVE, typeName: 'Technology Interface', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_INTERFACE}],
  [CX.TECHNOLOGY_PROCESS, { className: 'archimate-technology-process', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Process', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_PROCESS}],
  [CX.TECHNOLOGY_SERVICE, { className: 'archimate-technology-service', layer: CX.LAYER_TECHNOLOGY, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Technology Service', relationshipMap: TX.RELATIONSHIPS_ALLOWED_FROM_TECHNOLOGY_SERVICE}],
]);

export const PHYSICAL_ELEMENT_MAP = new Map([
  [CX.PHYSICAL_DISTRIBUTION_NETWORK, { className: 'archimate-physical-distribution-network', layer: CX.LAYER_PHYSICAL, aspect: CX.ASPECT_ACTIVE, typeName: 'Distribution Network', relationshipMap: PX.RELATIONSHIPS_ALLOWED_FROM_PHYSICAL_DISTRIBUTION_NETWORK}],
  [CX.PHYSICAL_EQUIPMENT, { className: 'archimate-physical-equipment', layer: CX.LAYER_PHYSICAL, aspect: CX.ASPECT_ACTIVE, typeName: 'Equipment', relationshipMap: PX.RELATIONSHIPS_ALLOWED_FROM_PHYSICAL_EQUIPMENT}],
  [CX.PHYSICAL_FACILITY, { className: 'archimate-physical-facility', layer: CX.LAYER_PHYSICAL, aspect: CX.ASPECT_ACTIVE, typeName: 'Facility', relationshipMap: PX.RELATIONSHIPS_ALLOWED_FROM_PHYSICAL_FACILITY}],
  [CX.PHYSICAL_MATERIAL, { className: 'archimate-physical-material', layer: CX.LAYER_PHYSICAL, aspect: CX.ASPECT_ACTIVE, typeName: 'Material', relationshipMap: PX.RELATIONSHIPS_ALLOWED_FROM_PHYSICAL_MATERIAL}],
]);

export const MOTIVATION_ELEMENT_MAP = new Map([
  [CX.MOTIVATION_ASSESSMENT, { className: 'archimate-motivation-assessment', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Assessment', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_ASSESSMENT}],
  [CX.MOTIVATION_CONSTRAINT, { className: 'archimate-motivation-constraint', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Constraint', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_CONSTRAINT}],
  [CX.MOTIVATION_DRIVER, { className: 'archimate-motivation-driver', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Driver', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_DRIVER}],
  [CX.MOTIVATION_GOAL, { className: 'archimate-motivation-goal', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Goal', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_GOAL}],
  [CX.MOTIVATION_MEANING, { className: 'archimate-motivation-meaning', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Meaning', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_MEANING}],
  [CX.MOTIVATION_OUTCOME, { className: 'archimate-motivation-outcome', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Outcome', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_OUTCOME}],
  [CX.MOTIVATION_PRINCIPLE, { className: 'archimate-motivation-principale', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Principle', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_PRINCIPLE}],
  [CX.MOTIVATION_REQUIREMENT, { className: 'archimate-motivation-requirement', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Requirement', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_REQUIREMENT}],
  [CX.MOTIVATION_STAKEHOLDER, { className: 'archimate-motivation-stakeholder', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Stakeholder', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_STAKEHOLDER}],
  [CX.MOTIVATION_VALUE, { className: 'archimate-motivation-value', layer: CX.LAYER_MOTIVATION, aspect: CX.ASPECT_MOTIVATION , typeName: 'Value', relationshipMap: MX.RELATIONSHIPS_ALLOWED_FROM_MOTIVATION_VALUE}],
]);

export const IMP_MIG_ELEMENT_MAP = new Map([
  [CX.IMP_MIG_DELIVERABLE, { className: 'archimate-imp-mig-deliverable', layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_ACTIVE, typeName: 'Deliverable', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_DELIVRABLE}],
  [CX.IMP_MIG_GAP, { className: 'archimate-imp-mig-gap', layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_ACTIVE, typeName: 'Gap', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_GAP}],
  [CX.IMP_MIG_IMPLEMENTATION_EVENT, { className: 'archimate-imp-mig-implementation-event', layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Implementation Event', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_IMPLEMENTATION_EVENT}],
  [CX.IMP_MIG_PLATEAU, { className: 'archimate-imp-mig-plateau', layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_ACTIVE, typeName: 'Plateau', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_PLATEAU}],
  [CX.IMP_MIG_WORK_PACKAGE, { className: 'archimate-imp-mig-work-package', layer: CX.LAYER_IMP_MIG, aspect: CX.ASPECT_BEHAVIOR, typeName: 'Work Package', relationshipMap: IX.RELATIONSHIPS_ALLOWED_FROM_IMP_MIG_WORK_PACKAGE}],
]);

export const OTHER_ELEMENT_MAP = new Map([
  [CX.OTHER_GROUPING, { className: 'archimate-other-grouping', layer: CX.LAYER_OTHER, aspect: CX.ASPECT_ACTIVE, typeName: 'Grouping', relationshipMap: OX.RELATIONSHIPS_ALLOWED_FROM_OTHER_GROUPING}],
  [CX.OTHER_LOCATION, { className: 'archimate-other-location', layer: CX.LAYER_OTHER, aspect: CX.ASPECT_ACTIVE, typeName: 'Location', relationshipMap: OX.RELATIONSHIPS_ALLOWED_FROM_OTHER_LOCATION}]
]);

export const ELEMENT_MAP = new Map([
  [NOTE, { className: 'archimate-tool-note', typeName: 'Note'}],
  [VIEW, { className: 'archimate-other-view', typeName: 'View'}],
]);

export const FULL_ELEMENT_MAP = new Map([
  ...STRATEGY_ELEMENT_MAP,
  ...BUSINESS_ELEMENT_MAP,
  ...APPLICATION_ELEMENT_MAP,
  ...TECHNOLOGY_ELEMENT_MAP,
  ...PHYSICAL_ELEMENT_MAP,
  ...MOTIVATION_ELEMENT_MAP,
  ...IMP_MIG_ELEMENT_MAP,
  ...OTHER_ELEMENT_MAP,
  ...RELATIONSHIP_ELEMENT_MAP,
  ...ELEMENT_MAP
]);

export function getLayerType(elementType) {
  return elementType && FULL_ELEMENT_MAP.get(elementType) && FULL_ELEMENT_MAP.get(elementType).layer;
}

export function getAspectType(elementType) {
  return elementType && FULL_ELEMENT_MAP.get(elementType) && FULL_ELEMENT_MAP.get(elementType).aspect;
}

export function getTypeName(elementType) {
  return elementType && FULL_ELEMENT_MAP.has(elementType) && FULL_ELEMENT_MAP.get(elementType).typeName;
}

export function getRelationshipMap(elementType) {
  return elementType && FULL_ELEMENT_MAP.has(elementType) && FULL_ELEMENT_MAP.get(elementType).relationshipMap;
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

/*
export function isViewElementType(element, type) {
  var viewElement = getViewElement(element)
  return viewElement && (typeof viewElement.$instanceOf === 'function') && viewElement.$instanceOf(type);

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
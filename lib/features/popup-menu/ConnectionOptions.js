import { RELATIONSHIP_ACCESS, RELATIONSHIP_AGGREGATION, 
  RELATIONSHIP_ASSIGNMENT, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_COMPOSITION, 
  RELATIONSHIP_FLOW, RELATIONSHIP_INFLUENCE,RELATIONSHIP_REALIZATION, 
  RELATIONSHIP_SERVING, RELATIONSHIP_SPECIALIZATION, RELATIONSHIP_TRIGGERING } from "../../metamodel/Concept";
  
import { getRelationshipMap } from "../../util/ModelUtil";
import { logger } from "../../util/Logger";

const s = RELATIONSHIP_SPECIALIZATION,
    c = RELATIONSHIP_COMPOSITION,
    g = RELATIONSHIP_AGGREGATION,
    i = RELATIONSHIP_ASSIGNMENT,
    r = RELATIONSHIP_REALIZATION,
    v = RELATIONSHIP_SERVING,
    a = RELATIONSHIP_ACCESS,
    n = RELATIONSHIP_INFLUENCE,
    t = RELATIONSHIP_TRIGGERING,
    f = RELATIONSHIP_FLOW,
    o = RELATIONSHIP_ASSOCIATION;

const RELATIONSHIP_MENU_MAP = new Map([
    [RELATIONSHIP_COMPOSITION, {
        label: RELATIONSHIP_COMPOSITION,
        actionName: 'composition-connect-start',
        className: 'archimate-relation-composition',
        target: {
          type: 'bpmn:StartEvent',
          eventDefinitionType: 'bpmn:MessageEventDefinition'
        }
    }],
    [RELATIONSHIP_AGGREGATION, {
        label: RELATIONSHIP_AGGREGATION,
        actionName: 'aggregation-connect-start',
        className: 'archimate-relation-aggregation',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_ASSIGNMENT, {
        label: RELATIONSHIP_ASSIGNMENT,
        actionName: 'assignement-connect-start',
        className: 'archimate-relation-assignment',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_REALIZATION, {
        label: RELATIONSHIP_REALIZATION,
        actionName: 'realization-connect-start',
        className: 'archimate-relation-realization',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_SERVING, {
        label: RELATIONSHIP_SERVING,
        actionName: 'serving-connect-start',
        className: 'archimate-relation-serving',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_ACCESS, {
        label: RELATIONSHIP_ACCESS,
        actionName: 'access-connect-start',
        className: 'archimate-relation-access',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_INFLUENCE, {
        label: RELATIONSHIP_INFLUENCE,
        actionName: 'influence-connect-start',
        className: 'archimate-relation-influence',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_ASSOCIATION, {
        label: RELATIONSHIP_ASSOCIATION,
        actionName: 'association-connect-start',
        className: 'archimate-relation-association',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_TRIGGERING, {
        label: RELATIONSHIP_TRIGGERING,
        actionName: 'triggering-connect-start',
        className: 'archimate-relation-triggering',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_FLOW, {
        label: RELATIONSHIP_FLOW,
        actionName: 'flow-connect-start',
        className: 'archimate-relation-flow',
        target: {
          type: 'bpmn:StartEvent'
        }
    }],
    [RELATIONSHIP_SPECIALIZATION, {
        label: RELATIONSHIP_SPECIALIZATION,
        actionName: 'specialization-connect-start',
        className: 'archimate-relation-specialization',
        target: {
          type: 'bpmn:StartEvent'
        }
    }]
]);

export function getRelationshipsAllowed(sourceElementType, targetElementType) {
    var relationshipsAllowed = [];

    if (sourceElementType && targetElementType) {
      var sourceRelationshipMap = getRelationshipMap(sourceElementType);
      var relationshipsAllowedString = sourceRelationshipMap.get(targetElementType);;
      var menuDef = null;
      for (const char of relationshipsAllowedString) {
          menuDef = eval('RELATIONSHIP_MENU_MAP.get('+char+')');
          relationshipsAllowed.push(menuDef);
      }
    }
    return relationshipsAllowed;
}


  
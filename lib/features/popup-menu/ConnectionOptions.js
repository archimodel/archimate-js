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

const groupDirect = {
          id: 'group-direct',
          name: 'Direct connection'
        },
      groupReverse = {
          id: 'group-reverse',
          name: 'Reverse connection'
      };

const RELATIONSHIP_MENU_MAP = new Map([
    [RELATIONSHIP_COMPOSITION, {
        group: groupDirect,
        label: 'Composed of',
        actionName: 'composition-connect',
        className: 'archimate-relation-composition',
        target: {
          type: RELATIONSHIP_COMPOSITION,
        }
    }],
    [RELATIONSHIP_AGGREGATION, {
        group: groupDirect,
        label: 'Aggregates',
        actionName: 'aggregation-connect',
        className: 'archimate-relation-aggregation',
        target: {
          type: RELATIONSHIP_AGGREGATION,
        }
    }],
    [RELATIONSHIP_ASSIGNMENT, {
        group: groupDirect,
        label: 'Assigned to',
        actionName: 'assignement-connect',
        className: 'archimate-relation-assignment',
        target: {
          type: RELATIONSHIP_ASSIGNMENT
        }
    }],
    [RELATIONSHIP_REALIZATION, {
        group: groupDirect,
        label: 'Realizes',
        actionName: 'realization-connect',
        className: 'archimate-relation-realization',
        target: {
          type: RELATIONSHIP_REALIZATION
        }
    }],
    [RELATIONSHIP_SERVING, {
        group: groupDirect,
        label: 'Serves',
        actionName: 'serving-connect',
        className: 'archimate-relation-serving',
        target: {
          type: RELATIONSHIP_SERVING
        }
    }],
    [RELATIONSHIP_ACCESS, {
        group: groupDirect,
        label: 'Accesses',
        actionName: 'access-connect',
        className: 'archimate-relation-access',
        target: {
          type: RELATIONSHIP_ACCESS
        }
    }],
    [RELATIONSHIP_INFLUENCE, {
        group: groupDirect,
        label: 'Influences',
        actionName: 'influence-connect',
        className: 'archimate-relation-influence',
        target: {
          type: RELATIONSHIP_INFLUENCE
        }
    }],
    [RELATIONSHIP_ASSOCIATION, {
        group: groupDirect,
        label: 'Associated to',
        actionName: 'association-connect',
        className: 'archimate-relation-association',
        target: {
          type: RELATIONSHIP_ASSOCIATION
        }
    }],
    [RELATIONSHIP_TRIGGERING, {
        group: groupDirect,
        label: 'Triggers',
        actionName: 'triggering-connect',
        className: 'archimate-relation-triggering',
        target: {
          type: RELATIONSHIP_TRIGGERING
        }
    }],
    [RELATIONSHIP_FLOW, {
        group: groupDirect,
        label: 'Flows to',
        actionName: 'flow-connect',
        className: 'archimate-relation-flow',
        target: {
          type: RELATIONSHIP_FLOW
        }
    }],
    [RELATIONSHIP_SPECIALIZATION, {
        group: groupDirect,
        label: 'Specializes',
        actionName: 'specialization-connect',
        className: 'archimate-relation-specialization',
        target: {
          type: RELATIONSHIP_SPECIALIZATION
        }
    }]
]);

const REVERSE_RELATIONSHIP_MENU_MAP = new Map([
  [RELATIONSHIP_COMPOSITION, {
      group: groupReverse,
      label: 'Part of',
      actionName: 'composition-connect-reverse',
      className: 'archimate-relation-composition',
      target: {
        type: RELATIONSHIP_COMPOSITION,
        reverse: true
      }
  }],
  [RELATIONSHIP_AGGREGATION, {
      group: groupReverse,
      label: 'Aggregated by',
      actionName: 'aggregation-connect-reverse',
      className: 'archimate-relation-aggregation',
      target: {
        type: RELATIONSHIP_AGGREGATION,
        reverse: true
      }
  }],
  [RELATIONSHIP_ASSIGNMENT, {
      group: groupReverse,
      label: 'Assigned from',
      actionName: 'assignement-connect-reverse',
      className: 'archimate-relation-assignment',
      target: {
        type: RELATIONSHIP_ASSIGNMENT,
        reverse: true
      }
  }],
  [RELATIONSHIP_REALIZATION, {
      group: groupReverse,
      label: 'Realized by',
      actionName: 'realization-connect-reverse',
      className: 'archimate-relation-realization',
      target: {
        type: RELATIONSHIP_REALIZATION,
        reverse: true
      }
  }],
  [RELATIONSHIP_SERVING, {
      group: groupReverse,
      label: 'Served by',
      actionName: 'serving-connect-reverse',
      className: 'archimate-relation-serving',
      target: {
        type: RELATIONSHIP_SERVING,
        reverse: true
      }
  }],
  [RELATIONSHIP_ACCESS, {
      group: groupReverse,
      label: 'Accessed by',
      actionName: 'access-connect-reverse',
      className: 'archimate-relation-access',
      target: {
        type: RELATIONSHIP_ACCESS,
        reverse: true
      }
  }],
  [RELATIONSHIP_INFLUENCE, {
      group: groupReverse,
      label: 'Influenced by',
      actionName: 'influence-connect-reverse',
      className: 'archimate-relation-influence',
      target: {
        type: RELATIONSHIP_INFLUENCE,
        reverse: true
      }
  }],
  [RELATIONSHIP_ASSOCIATION, {
      group: groupReverse,
      label: 'Associated from',
      actionName: 'association-connect-reverse',
      className: 'archimate-relation-association',
      target: {
        type: RELATIONSHIP_ASSOCIATION,
        reverse: true
      }
  }],
  [RELATIONSHIP_TRIGGERING, {
      group: groupReverse,
      label: 'Triggered by',
      actionName: 'triggering-connect-reverse',
      className: 'archimate-relation-triggering',
      target: {
        type: RELATIONSHIP_TRIGGERING,
        reverse: true
      }
  }],
  [RELATIONSHIP_FLOW, {
      group: groupReverse,
      label: 'Flows from',
      actionName: 'flow-connect-reverse',
      className: 'archimate-relation-flow',
      target: {
        type: RELATIONSHIP_FLOW,
        reverse: true
      }
  }],
  [RELATIONSHIP_SPECIALIZATION, {
      group: groupReverse,
      label: 'Specialization of',
      actionName: 'specialization-connect-reverse',
      className: 'archimate-relation-specialization',
      target: {
        type: RELATIONSHIP_SPECIALIZATION,
        reverse: true
      }
  }]
]);

export function getRelationshipsAllowed(sourceElementType, targetElementType) {
  var relationshipsAllowed = [];

  if (sourceElementType && targetElementType) {
    var sourceRelationshipMap = getRelationshipMap(sourceElementType);
    var relationshipsAllowedString = sourceRelationshipMap.get(targetElementType);
    if (relationshipsAllowedString) {
      var menuDef = null;
      for (const char of relationshipsAllowedString) {
          menuDef = eval('RELATIONSHIP_MENU_MAP.get('+char+')');
          relationshipsAllowed.push(menuDef);
      }
    }
  }
  return relationshipsAllowed;
}

export function getReverseRelationshipsAllowed(sourceElementType, targetElementType) {
  var reverseRelationshipsAllowed = [];

  if (sourceElementType && targetElementType) {
    var sourceRelationshipMap = getRelationshipMap(targetElementType);
    var relationshipsAllowedString = sourceRelationshipMap.get(sourceElementType);
    if (relationshipsAllowedString) {
      var menuDef = null;
      for (const char of relationshipsAllowedString) {
          menuDef = eval('REVERSE_RELATIONSHIP_MENU_MAP.get('+char+')');
          reverseRelationshipsAllowed.push(menuDef);
      }
    }
  }
  return reverseRelationshipsAllowed;
}

export function isRelationshipAllowed(sourceType, targetType, relationshipType) {

  if (sourceType && targetType) {
    var sourceRelationshipMap = getRelationshipMap(sourceType);
    var relationshipsAllowedString = sourceRelationshipMap.get(targetType);

    var relationship = null;
    for (const char of relationshipsAllowedString) {
        relationship = eval(char);
        if (relationship === relationshipType) {
          return true;
        }
    }
  }
  return false;

}
  
import { RELATIONSHIP_ACCESS, RELATIONSHIP_AGGREGATION, 
  RELATIONSHIP_ASSIGNMENT, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_COMPOSITION, 
  RELATIONSHIP_FLOW, RELATIONSHIP_INFLUENCE,RELATIONSHIP_REALIZATION, 
  RELATIONSHIP_SERVING, RELATIONSHIP_SPECIALIZATION, RELATIONSHIP_TRIGGERING } from "../../metamodel/Concept";

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
          name: 'New direct connection'
        },
      groupReverse = {
          id: 'group-reverse',
          name: 'New reverse connection'
      };

const RELATIONSHIP_MENU_MAP = new Map([
    [RELATIONSHIP_COMPOSITION, {
        group: groupDirect,
        label: RELATIONSHIP_COMPOSITION, //'Composed of',
        actionName: 'composition-connect',
        className: 'archimate-relation-composition',
        target: {
          type: RELATIONSHIP_COMPOSITION,
        }
    }],
    [RELATIONSHIP_AGGREGATION, {
        group: groupDirect,
        label: RELATIONSHIP_AGGREGATION, //'Aggregates',
        actionName: 'aggregation-connect',
        className: 'archimate-relation-aggregation',
        target: {
          type: RELATIONSHIP_AGGREGATION,
        }
    }],
    [RELATIONSHIP_ASSIGNMENT, {
        group: groupDirect,
        label: RELATIONSHIP_ASSIGNMENT, //'Assigned to',
        actionName: 'assignement-connect',
        className: 'archimate-relation-assignment',
        target: {
          type: RELATIONSHIP_ASSIGNMENT
        }
    }],
    [RELATIONSHIP_REALIZATION, {
        group: groupDirect,
        label: RELATIONSHIP_REALIZATION, //'Realizes',
        actionName: 'realization-connect',
        className: 'archimate-relation-realization',
        target: {
          type: RELATIONSHIP_REALIZATION
        }
    }],
    [RELATIONSHIP_SERVING, {
        group: groupDirect,
        label: RELATIONSHIP_SERVING, //'Serves',
        actionName: 'serving-connect',
        className: 'archimate-relation-serving',
        target: {
          type: RELATIONSHIP_SERVING
        }
    }],
    [RELATIONSHIP_ACCESS, {
        group: groupDirect,
        label: RELATIONSHIP_ACCESS, //'Accesses',
        actionName: 'access-connect',
        className: 'archimate-relation-access',
        target: {
          type: RELATIONSHIP_ACCESS
        }
    }],
    [RELATIONSHIP_INFLUENCE, {
        group: groupDirect,
        label: RELATIONSHIP_INFLUENCE, //'Influences',
        actionName: 'influence-connect',
        className: 'archimate-relation-influence',
        target: {
          type: RELATIONSHIP_INFLUENCE
        }
    }],
    [RELATIONSHIP_ASSOCIATION, {
        group: groupDirect,
        label: RELATIONSHIP_ASSOCIATION, //'Associated to',
        actionName: 'association-connect',
        className: 'archimate-relation-association',
        target: {
          type: RELATIONSHIP_ASSOCIATION
        }
    }],
    [RELATIONSHIP_TRIGGERING, {
        group: groupDirect,
        label: RELATIONSHIP_TRIGGERING, //'Triggers',
        actionName: 'triggering-connect',
        className: 'archimate-relation-triggering',
        target: {
          type: RELATIONSHIP_TRIGGERING
        }
    }],
    [RELATIONSHIP_FLOW, {
        group: groupDirect,
        label: RELATIONSHIP_FLOW, //'Flows to',
        actionName: 'flow-connect',
        className: 'archimate-relation-flow',
        target: {
          type: RELATIONSHIP_FLOW
        }
    }],
    [RELATIONSHIP_SPECIALIZATION, {
        group: groupDirect,
        label: RELATIONSHIP_SPECIALIZATION, //'Specializes',
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
      label: RELATIONSHIP_COMPOSITION, //'Part of',
      actionName: 'composition-connect-reverse',
      className: 'archimate-relation-composition',
      target: {
        type: RELATIONSHIP_COMPOSITION,
        reverse: true
      }
  }],
  [RELATIONSHIP_AGGREGATION, {
      group: groupReverse,
      label: RELATIONSHIP_AGGREGATION, //'Aggregated by',
      actionName: 'aggregation-connect-reverse',
      className: 'archimate-relation-aggregation',
      target: {
        type: RELATIONSHIP_AGGREGATION,
        reverse: true
      }
  }],
  [RELATIONSHIP_ASSIGNMENT, {
      group: groupReverse,
      label: RELATIONSHIP_ASSIGNMENT, //'Assigned from',
      actionName: 'assignement-connect-reverse',
      className: 'archimate-relation-assignment',
      target: {
        type: RELATIONSHIP_ASSIGNMENT,
        reverse: true
      }
  }],
  [RELATIONSHIP_REALIZATION, {
      group: groupReverse,
      label: RELATIONSHIP_REALIZATION, //'Realized by',
      actionName: 'realization-connect-reverse',
      className: 'archimate-relation-realization',
      target: {
        type: RELATIONSHIP_REALIZATION,
        reverse: true
      }
  }],
  [RELATIONSHIP_SERVING, {
      group: groupReverse,
      label: RELATIONSHIP_SERVING, //'Served by',
      actionName: 'serving-connect-reverse',
      className: 'archimate-relation-serving',
      target: {
        type: RELATIONSHIP_SERVING,
        reverse: true
      }
  }],
  [RELATIONSHIP_ACCESS, {
      group: groupReverse,
      label: RELATIONSHIP_ACCESS, //'Accessed by',
      actionName: 'access-connect-reverse',
      className: 'archimate-relation-access',
      target: {
        type: RELATIONSHIP_ACCESS,
        reverse: true
      }
  }],
  [RELATIONSHIP_INFLUENCE, {
      group: groupReverse,
      label: RELATIONSHIP_INFLUENCE, //'Influenced by',
      actionName: 'influence-connect-reverse',
      className: 'archimate-relation-influence',
      target: {
        type: RELATIONSHIP_INFLUENCE,
        reverse: true
      }
  }],
  [RELATIONSHIP_ASSOCIATION, {
      group: groupReverse,
      label: RELATIONSHIP_ASSOCIATION, //'Associated from',
      actionName: 'association-connect-reverse',
      className: 'archimate-relation-association',
      target: {
        type: RELATIONSHIP_ASSOCIATION,
        reverse: true
      }
  }],
  [RELATIONSHIP_TRIGGERING, {
      group: groupReverse,
      label: RELATIONSHIP_TRIGGERING, //'Triggered by',
      actionName: 'triggering-connect-reverse',
      className: 'archimate-relation-triggering',
      target: {
        type: RELATIONSHIP_TRIGGERING,
        reverse: true
      }
  }],
  [RELATIONSHIP_FLOW, {
      group: groupReverse,
      label: RELATIONSHIP_FLOW, //'Flows from',
      actionName: 'flow-connect-reverse',
      className: 'archimate-relation-flow',
      target: {
        type: RELATIONSHIP_FLOW,
        reverse: true
      }
  }],
  [RELATIONSHIP_SPECIALIZATION, {
      group: groupReverse,
      label: RELATIONSHIP_SPECIALIZATION, //'Specialization of',
      actionName: 'specialization-connect-reverse',
      className: 'archimate-relation-specialization',
      target: {
        type: RELATIONSHIP_SPECIALIZATION,
        reverse: true
      }
  }]
]);

export function getRelationshipsMenu(relationshipsAllowed, direct, menuName) {
  var relationshipsMenu = [];
  relationshipsAllowed.forEach(element => {
    var menu = null
    if (direct) {
      menu = RELATIONSHIP_MENU_MAP.get(element);
    } else {
      menu = REVERSE_RELATIONSHIP_MENU_MAP.get(element);
    }
    menu.group.name = menuName;
    relationshipsMenu.push(menu)    
  });

  return relationshipsMenu;
}
  
import {
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_ASSOCIATION,
  RELATIONSHIP_COMPOSITION,
  RELATIONSHIP_FLOW,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_SERVING,
  RELATIONSHIP_SPECIALIZATION,
  RELATIONSHIP_TRIGGERING
} from '../../metamodel/Concept';
import {
  getBaseRelationshipTypeForProfile,
  getProfileRelationship
} from '../../metamodel/languages';

const groupDirect = {
  id: 'group-direct',
  name: 'New direct connection'
};

const groupReverse = {
  id: 'group-reverse',
  name: 'New reverse connection'
};

const RELATIONSHIP_MENU_MAP = new Map([
  createMenuEntry(RELATIONSHIP_COMPOSITION, groupDirect, 'Composed of', 'composition-connect', 'archimate-relation-composition'),
  createMenuEntry(RELATIONSHIP_AGGREGATION, groupDirect, 'Aggregates', 'aggregation-connect', 'archimate-relation-aggregation'),
  createMenuEntry(RELATIONSHIP_ASSIGNMENT, groupDirect, 'Assigned to', 'assignement-connect', 'archimate-relation-assignment'),
  createMenuEntry(RELATIONSHIP_REALIZATION, groupDirect, 'Realizes', 'realization-connect', 'archimate-relation-realization'),
  createMenuEntry(RELATIONSHIP_SERVING, groupDirect, 'Serves', 'serving-connect', 'archimate-relation-serving'),
  createMenuEntry(RELATIONSHIP_ACCESS, groupDirect, 'Accesses', 'access-connect', 'archimate-relation-access'),
  createMenuEntry(RELATIONSHIP_INFLUENCE, groupDirect, 'Influences', 'influence-connect', 'archimate-relation-influence'),
  createMenuEntry(RELATIONSHIP_ASSOCIATION, groupDirect, 'Associated to', 'association-connect', 'archimate-relation-association'),
  createMenuEntry(RELATIONSHIP_TRIGGERING, groupDirect, 'Triggers', 'triggering-connect', 'archimate-relation-triggering'),
  createMenuEntry(RELATIONSHIP_FLOW, groupDirect, 'Flows to', 'flow-connect', 'archimate-relation-flow'),
  createMenuEntry(RELATIONSHIP_SPECIALIZATION, groupDirect, 'Specializes', 'specialization-connect', 'archimate-relation-specialization')
]);

const REVERSE_RELATIONSHIP_MENU_MAP = new Map([
  createMenuEntry(RELATIONSHIP_COMPOSITION, groupReverse, 'Composed in', 'composition-connect-reverse', 'archimate-relation-composition', true),
  createMenuEntry(RELATIONSHIP_AGGREGATION, groupReverse, 'Aggregated in', 'aggregation-connect-reverse', 'archimate-relation-aggregation', true),
  createMenuEntry(RELATIONSHIP_ASSIGNMENT, groupReverse, 'Has assigned', 'assignement-connect-reverse', 'archimate-relation-assignment', true),
  createMenuEntry(RELATIONSHIP_REALIZATION, groupReverse, 'Realized by', 'realization-connect-reverse', 'archimate-relation-realization', true),
  createMenuEntry(RELATIONSHIP_SERVING, groupReverse, 'Served by', 'serving-connect-reverse', 'archimate-relation-serving', true),
  createMenuEntry(RELATIONSHIP_ACCESS, groupReverse, 'Accessed by', 'access-connect-reverse', 'archimate-relation-access', true),
  createMenuEntry(RELATIONSHIP_INFLUENCE, groupReverse, 'Influenced by', 'influence-connect-reverse', 'archimate-relation-influence', true),
  createMenuEntry(RELATIONSHIP_ASSOCIATION, groupReverse, 'Associated from', 'association-connect-reverse', 'archimate-relation-association', true),
  createMenuEntry(RELATIONSHIP_TRIGGERING, groupReverse, 'Triggered by', 'triggering-connect-reverse', 'archimate-relation-triggering', true),
  createMenuEntry(RELATIONSHIP_FLOW, groupReverse, 'Flows from', 'flow-connect-reverse', 'archimate-relation-flow', true),
  createMenuEntry(RELATIONSHIP_SPECIALIZATION, groupReverse, 'Specialized by', 'specialization-connect-reverse', 'archimate-relation-specialization', true)
]);

function createMenuEntry(relationshipType, group, label, actionName, className, reverse) {
  var target = {
    type: relationshipType
  };

  if (reverse) {
    target.reverse = true;
  }

  return [
    relationshipType,
    {
      group: group,
      label: label,
      relationshipType: relationshipType,
      actionName: actionName,
      className: className,
      target: target
    }
  ];
}

function cloneRelationshipMenu(menu, menuName, relationshipType, relationshipDefinition, direct) {
  relationshipDefinition = relationshipDefinition || {};

  return {
    group: {
      id: menu.group.id,
      name: menuName
    },
    label: getRelationshipLabel(menu, relationshipDefinition, direct),
    relationshipType: relationshipType || menu.relationshipType,
    actionName: getRelationshipActionName(menu, relationshipType || menu.relationshipType, relationshipDefinition, direct),
    className: relationshipDefinition.className || menu.className,
    target: Object.assign({}, menu.target, { type: relationshipType || menu.relationshipType })
  };
}

export function getRelationshipsMenu(relationshipsAllowed, direct, menuName, profile) {
  var relationshipsMenu = [],
      relationshipMap = direct ? RELATIONSHIP_MENU_MAP : REVERSE_RELATIONSHIP_MENU_MAP;

  relationshipsAllowed.forEach(function(relationshipType) {
    var relationshipDefinition = profile && getProfileRelationship(relationshipType, profile);
    var baseRelationshipType = profile ?
      getBaseRelationshipTypeForProfile(relationshipType, profile) :
      relationshipType;
    var menu = relationshipMap.get(relationshipType) || relationshipMap.get(baseRelationshipType);

    if (menu) {
      relationshipsMenu.push(cloneRelationshipMenu(
        menu,
        menuName,
        relationshipType,
        relationshipDefinition,
        direct
      ));
    }
  });

  return relationshipsMenu;
}

function getRelationshipLabel(menu, relationshipDefinition, direct) {
  if (direct && relationshipDefinition.directLabel) {
    return relationshipDefinition.directLabel;
  }

  if (!direct && relationshipDefinition.reverseLabel) {
    return relationshipDefinition.reverseLabel;
  }

  return relationshipDefinition.label ||
    relationshipDefinition.typeName ||
    menu.label;
}

function getRelationshipActionName(menu, relationshipType, relationshipDefinition, direct) {
  if (relationshipDefinition.actionName) {
    return relationshipDefinition.actionName;
  }

  if (menu.relationshipType === relationshipType) {
    return menu.actionName;
  }

  return kebab(relationshipType) + '-connect' + (direct ? '' : '-reverse');
}

function kebab(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

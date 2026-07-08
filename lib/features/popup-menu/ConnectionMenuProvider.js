import {
  forEach
} from 'min-dash';
import { ARCHIMATE_CONNECTION, RELATIONSHIP_ACCESS, RELATIONSHIP_ACCESS_NONE, RELATIONSHIP_ACCESS_READ, RELATIONSHIP_ACCESS_READWRITE, RELATIONSHIP_ACCESS_WRITE, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_INFLUENCE } from '../../metamodel/Concept';
import { logger } from '../../util/Logger';
import { getTypeName, is, CONNECTION_LINE, CONNECTION_RELATIONSHIP } from '../../util/ModelUtil';
import {
  canApplyRelationshipMultiplicity,
  getJunctionRelationshipTypeCandidates,
  getRelationshipConceptAggregationType,
  isRelationshipConnectedToJunction
} from '../../util/JunctionUtil';
import {
  getBaseRelationshipTypeForProfile
} from '../../metamodel/languages';

import { getRelationshipsAllowed, getExistingRelationships, isRelationshipAllowed } from '../../util/RelationshipUtil';
import { getRelationshipsMenu } from './ConnectionOptions';

/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
export default function ConnectionMenuProvider(popupMenu, modeling, connect, rules, translate, languageProfile) {

  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._connect = connect;
  this._rules = rules;
  this._translate = translate;
  this._languageProfile = languageProfile;

  this.register();
}

ConnectionMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'connect',
  'rules',
  'translate',
  'languageProfile'
];


/**
 * Register connection menu provider in the popup menu
 */
ConnectionMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('archimate-connection', this);
};


/**
 * Get all entries from ConnectionOptions for the given element and apply filters
 * on them. Get only connections allowed for the given element.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ConnectionMenuProvider.prototype.getEntries = function(element) {
  logger.log(element);

  if (element.type === CONNECTION_LINE) {
    return [];
  }

  /* var rules = this._rules;
  if (!rules.allowed('shape.replace', { element: element })) {
    return [];
  } */

  var entries = [],
      directSubTitle = 'Create new direct relation',
      reverseSubTitle = 'Create new reverse relation';

  var relationshipsAllowed = [];
  var profile = this._languageProfile && this._languageProfile.get();

  if (element.type !== CONNECTION_RELATIONSHIP) {
    directSubTitle = 'Change direct relation type to';
    reverseSubTitle = 'Change reverse relation type to';

    relationshipsAllowed = getAllowedRelationshipTypes(element, false, element.type, profile);
  } else {
    relationshipsAllowed = getAllowedRelationshipTypes(element, false, null, profile);
  }
  var reverseRelationshipsAllowed = getAllowedRelationshipTypes(element, true, null, profile);

  var entriesAllowed = getRelationshipsMenu(relationshipsAllowed, true, directSubTitle, profile);
  entriesAllowed.push(...getRelationshipsMenu(reverseRelationshipsAllowed, false, reverseSubTitle, profile));

  entries = this._getExistingRelationships(element);
  entries.push(...this._createEntries(element, entriesAllowed));

  return entries;

};

function getAllowedRelationshipTypes(connection, reverse, excludedRelationType, profile) {
  var source = reverse ? connection.target : connection.source,
      target = reverse ? connection.source : connection.target;
  var aggregationType = getRelationshipConceptAggregationType(source, target, profile);

  if (aggregationType) {
    return aggregationType !== excludedRelationType ? [ aggregationType ] : [];
  }

  if (isRelationshipConnectedToJunction({ source: source, target: target })) {
    return getJunctionRelationshipTypeCandidates(source, target, connection, isRelationshipAllowed, profile).filter(function(relationshipType) {
      return relationshipType !== excludedRelationType;
    });
  }

  return getRelationshipsAllowed(source.type, target.type, excludedRelationType, profile);
}

function getRelationshipOptionValue(element, propertyName) {
  var value = element[propertyName];

  if (value !== undefined && value !== null) {
    return value;
  }

  return element.typeOption;
}

function getRelationshipFlagValue(element, propertyName) {
  var value = getRelationshipOptionValue(element, propertyName);

  return value === true || value === 'true';
}

/**
 * Get a list of header items for the given element. This includes buttons
 * for multi instance markers and for the ad hoc marker.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ConnectionMenuProvider.prototype.getHeaderEntries = function(element) {
  var headerEntries = [];
  var profile = this._languageProfile && this._languageProfile.get();
  var baseRelationshipType = profile ?
    getBaseRelationshipTypeForProfile(element.type, profile) :
    element.type;

  if (baseRelationshipType === RELATIONSHIP_ACCESS) {
    headerEntries = headerEntries.concat(this._getAccessType(element));
  }

  if (baseRelationshipType === RELATIONSHIP_ASSOCIATION) {
    headerEntries = headerEntries.concat(this._getAssociationIsDirected(element));
  }

  if (baseRelationshipType === RELATIONSHIP_INFLUENCE) {
    headerEntries = headerEntries.concat(this._getInfluenceModifier(element));
  }

  headerEntries = headerEntries.concat(this._getMultiplicityEntries(element));

  return headerEntries;
};

/**
 * Creates an array of menu entry objects for a given element and filters the replaceOptions
 * according to a filter function.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions
 *
 * @return {Array<Object>} a list of menu items
 */
ConnectionMenuProvider.prototype._createEntries = function(connection, connectionOptions) {
  var menuEntries = [];

  var modeling = this._modeling;

  var self = this;

  forEach(connectionOptions, function(entry) {

    menuEntries.push(self._createMenuEntry(entry, function() {
      if (entry.target.reverse) {
        var newSource = connection.target;
        connection.target = connection.source;
        connection.source = newSource;
        connection.waypoints.reverse();
      }
      connection.type = entry.target.type;
      modeling.replaceRelationshipRef(connection);
    }));

  });

  return menuEntries;
};


/**
 * Creates and returns a single menu entry item.
 *
 * @param  {Object} definition a single replace options definition object
 * @param  {djs.model.Base} element
 * @param  {Function} [action] an action callback function which gets called when
 *                             the menu entry is being triggered.
 *
 * @return {Object} menu entry item
 */
ConnectionMenuProvider.prototype._createMenuEntry = function(definition, action) {
  var translate = this._translate;

  // var replaceRelationshipRef = this._modeling.replaceRelationshipRef;
  // action = action || replaceRelationshipRef;

  var menuEntry = {
    label: translate(definition.label),
    className: definition.className,
    description: definition.description,

    // documentationRef: 'http://'
    id: definition.actionName,
    group: { id: definition.group.id,
      name: translate(definition.group.name) },
    action: action,
  };

  return menuEntry;
};

ConnectionMenuProvider.prototype._getAssociationIsDirected = function(element) {
  var self = this;
  var translate = this._translate;

  function toggleIsDirected(event, entry) {
    self._modeling.replaceRelationshipRef(element,
      { type: element.type,
        isDirected: !entry.active
      });
  }

  var isDirected = getRelationshipFlagValue(element, 'isDirected');
  var newEntries = [
    {
      id: 'toggle-is-directed',
      className: 'archimate-relation-association-directed',
      title: translate('Directed'),
      active: isDirected,
      action: toggleIsDirected,
    }
  ];
  return newEntries;
};

ConnectionMenuProvider.prototype._getInfluenceModifier = function(element) {
  var self = this;
  var translate = this._translate;
  var modifier = getRelationshipOptionValue(element, 'modifier');

  function setModifier(event, entry) {
    self._modeling.replaceRelationshipRef(element, {
      type: element.type,
      modifier: entry.active ? '' : entry.options.modifier
    });
  }

  return [
    {
      id: 'set-influence-modifier-positive',
      className: 'archimate-relation-influence-positive',
      title: translate('Positive influence'),
      label: translate('+'),
      active: modifier === '+',
      options: {
        modifier: '+'
      },
      action: setModifier
    },
    {
      id: 'set-influence-modifier-negative',
      className: 'archimate-relation-influence-negative',
      title: translate('Negative influence'),
      label: translate('-'),
      active: modifier === '-',
      options: {
        modifier: '-'
      },
      action: setModifier
    }
  ];
};

ConnectionMenuProvider.prototype._getMultiplicityEntries = function(element) {
  var profile = this._languageProfile && this._languageProfile.get();

  if (!profile || profile.version !== '4.0' || !canApplyRelationshipMultiplicity(element)) {
    return [];
  }

  var self = this;
  var translate = this._translate;

  function setSourceMultiplicity(event, entry) {
    self._modeling.replaceRelationshipRef(element, {
      sourceMultiplicity: entry.active ? '' : '1'
    });
  }

  function setTargetMultiplicity(event, entry) {
    self._modeling.replaceRelationshipRef(element, {
      targetMultiplicity: entry.active ? '' : '*'
    });
  }

  return [
    {
      id: 'set-source-multiplicity-1',
      className: 'archimate-multiplicity-source-1',
      title: translate('Source 1'),
      label: translate('source 1'),
      active: element.sourceMultiplicity === '1',
      action: setSourceMultiplicity
    },
    {
      id: 'set-target-multiplicity-star',
      className: 'archimate-multiplicity-target-star',
      title: translate('Target *'),
      label: translate('target *'),
      active: element.targetMultiplicity === '*',
      action: setTargetMultiplicity
    }
  ];
};

ConnectionMenuProvider.prototype._getAccessType = function(element) {
  var self = this;
  var translate = this._translate;

  function toggleAccessType(event, entry) {
    if (entry.active) {
      self._modeling.replaceRelationshipRef(element,
        { type: element.type,
          accessType: RELATIONSHIP_ACCESS_NONE
        });
    } else {
      self._modeling.replaceRelationshipRef(element,
        { type: element.type,
          accessType: entry.options.accessType
        });
    }
  }

  var accessType = getRelationshipOptionValue(element, 'accessType');
  var isRead = accessType === RELATIONSHIP_ACCESS_READ,
      isReadWrite = accessType === RELATIONSHIP_ACCESS_READWRITE,
      isWrite = accessType === RELATIONSHIP_ACCESS_WRITE;

  var accessTypeEntries = [
    {
      id: 'toggle-read',
      className: 'archimate-relation-access-read',
      title: translate('Read'),
      active: isRead,
      action: toggleAccessType,
      options: {
        accessType: RELATIONSHIP_ACCESS_READ
      }
    },
    {
      id: 'toggle-write',
      className: 'archimate-relation-access-write',
      title: translate('Write'),
      active: isWrite,
      action: toggleAccessType,
      options: {
        accessType: RELATIONSHIP_ACCESS_WRITE
      }
    },
    {
      id: 'toggle-readwrite',
      className: 'archimate-relation-access-readwrite',
      title: translate('Read/Write'),
      active: isReadWrite,
      action: toggleAccessType,
      options: {
        accessType: RELATIONSHIP_ACCESS_READWRITE
      }
    }
  ];
  return accessTypeEntries;
};

ConnectionMenuProvider.prototype._getExistingRelationships = function(connection) {
  logger.log(connection);

  const groupExisting = {
    id: 'group-existing-relationships',
    name: 'Get existing relation from model'
  };

  function filterConnections(array, viewelements) {
    logger.log({ array, viewelements });
    return array.filter((relationship) => {
      logger.log(relationship);
      var filter = true;
      for (const element of viewelements) {
        logger.log(element);
        if (is(element, ARCHIMATE_CONNECTION) && element.type === 'Relationship') {
          if (element.relationshipRef && element.relationshipRef.id === relationship.id) {
            filter = false;
          }
        }
      }
      return filter;
    });
  }

  var modeling = this._modeling;

  var self = this;
  var profile = this._languageProfile && this._languageProfile.get();

  var menuEntries = [];

  var relationshipsNode = connection.parent.modelRef.relationshipsNode;
  var viewElements = connection.parent.businessObject.viewElements || [];

  var currentRelationshipRefId = connection.businessObject.relationshipRef && connection.businessObject.relationshipRef.id;

  logger.log(currentRelationshipRefId);

  // Get all existing direct relationships between source and target shape except :
  // - relationshipRef of current connection
  var directExistingRelationships = getExistingRelationships(connection.source, connection.target, relationshipsNode, currentRelationshipRefId);

  // Check if a connection is yet render for those existing direct relationships
  var filterDirect = filterConnections(directExistingRelationships, viewElements);

  logger.log(filterDirect);

  forEach(filterDirect, function(relationship) {
    var definition = {
      group: groupExisting,
      label: relationship.type,
      description: 'From ' + getTypeName(relationship.source.type, profile) + ' to ' + getTypeName(relationship.target.type, profile),
      actionName: 'existing-relationship-' + relationship.id,
      className: 'archimate-relation-' + relationship.type.toLowerCase(),
    };

    menuEntries.push(self._createMenuEntry(definition, function() {
      modeling.replaceRelationshipRef(connection, relationship);
    }));

  });

  // Get all existing reverse relationships between source and target shape except relationshipRef of current connection
  var reverseExistingRelationships = getExistingRelationships(connection.target, connection.source, relationshipsNode, currentRelationshipRefId);

  // Check if a connection is yet render for those existing reverse relationships
  var filterReverse = filterConnections(reverseExistingRelationships, viewElements);

  logger.log(filterReverse);

  forEach(filterReverse, function(relationship) {
    var definition = {
      group: groupExisting,
      label: relationship.type,
      description: 'From ' + getTypeName(relationship.source.type, profile) + ' to ' + getTypeName(relationship.target.type, profile),
      actionName: 'existing-relationship-' + relationship.id,
      className: 'archimate-relation-' + relationship.type.toLowerCase(),
    };

    menuEntries.push(self._createMenuEntry(definition, function() {
      var newSource = connection.target;
      connection.target = connection.source;
      connection.source = newSource;
      connection.waypoints.reverse();
      modeling.replaceRelationshipRef(connection, relationship);
    }));

  });
  return menuEntries;
};

import {
  forEach
} from 'min-dash';
import { RELATIONSHIP_ACCESS, RELATIONSHIP_ACCESS_NONE, RELATIONSHIP_ACCESS_READ, RELATIONSHIP_ACCESS_READWRITE, RELATIONSHIP_ACCESS_WRITE, RELATIONSHIP_ASSOCIATION } from '../../metamodel/Concept';
import { logger } from '../../util/Logger';
import { is } from '../../util/ModelUtil';
//import modeling from '../modeling';

import { getRelationshipsAllowed, getReverseRelationshipsAllowed } from './ConnectionOptions';

/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
export default function ConnectionMenuProvider(
    popupMenu, modeling, moddle, connect, archimateReplace,
    rules, translate) {

  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._moddle = moddle;
  this._connect = connect;
  this._archimateReplace = archimateReplace;
  this._rules = rules;
  this._translate = translate;

  this.register();
}

ConnectionMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'moddle',
  'connect',
  'archimateReplace',
  'rules',
  'translate'
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

  var rules = this._rules;

  var entries = [];

/*  if (!rules.allowed('shape.replace', { element: element })) {
    return [];
  }
*/

  if (element.type === 'Line') {
    return [];
  }

  var entriesAllowed = getRelationshipsAllowed(element.source.type, element.target.type);
  entriesAllowed.push(...getReverseRelationshipsAllowed(element.source.type, element.target.type));

  entries = this._getExistingRelationships(element);
  entries.push(...this._createEntries(element, entriesAllowed));

  return entries;

};

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

  if (element.type === RELATIONSHIP_ACCESS) {
    headerEntries = headerEntries.concat(this._getAccessType(element));
  }

  if (element.type === RELATIONSHIP_ASSOCIATION) {
    headerEntries = headerEntries.concat(this._getAssociationIsDirected(element));
  }

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
      modeling.updateRelationship(connection, { type: entry.target.type, reverse: entry.target.reverse });
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

  //var updateRelationship = this._modeling.updateRelationship;
  //action = action || updateRelationship;

  var menuEntry = {
    label: translate(definition.label),
    className: definition.className,
    description: definition.description,
    //documentationRef: 'http://'
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
    self._modeling.updateRelationship(element,
      { type: RELATIONSHIP_ASSOCIATION,
        isDirected: !entry.active
      });
  }

  var isDirected = element.isDirected || false;
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

ConnectionMenuProvider.prototype._getAccessType = function(element) {
  var self = this;
  var translate = this._translate;

  function toggleAccessType(event, entry) {
    if (entry.active) {
      self._modeling.updateRelationship(element,
        { type: RELATIONSHIP_ACCESS,
          accessType: RELATIONSHIP_ACCESS_NONE
        });      
    } else {
      self._modeling.updateRelationship(element,
        { type: RELATIONSHIP_ACCESS,
          accessType: entry.options.accessType
        });
    }
  }

  var accessType = element.accesType;
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
        accesType: RELATIONSHIP_ACCESS_READ
      }
    },
    {
      id: 'toggle-write',
      className: 'archimate-relation-access-write',
      title: translate('Write'),
      active: isWrite,
      action: toggleAccessType,
      options: {
        accesType: RELATIONSHIP_ACCESS_WRITE
      }
    },
    {
      id: 'toggle-readwrite',
      className: 'archimate-relation-access-readwrite',
      title: translate('Read/Write'),
      active: isReadWrite,
      action: toggleAccessType,
      options: {
        accesType: RELATIONSHIP_ACCESS_READWRITE
      }
    }
  ];
  return accessTypeEntries;
};

ConnectionMenuProvider.prototype._getExistingRelationships = function(connection) {
  logger.log(connection);

  function filterNode(array, sourceId, targetId, relationshipRefId) {
    logger.log({sourceId, targetId, relationshipRefId});
    return array.filter((element) => {
      logger.log(element);
      return element.source.id === sourceId && element.target.id === targetId && element.id !== relationshipRefId;
    }); 
  }

  const groupDirect = {
    id: 'group-direct-existing',
    name: 'Existing direct connection'
  },
    groupReverse = {
    id: 'group-reverse-existing',
    name: 'Existing reverse connection'
  };

  var modeling = this._modeling;

  var self = this;

  var menuEntries = [];

  var relationshipsNode = connection.parent.modelRef.relationshipsNode;
  var sourceRefId, targetRefId;
  
  if (is(connection.source.businessObject, 'archimate:Node')) {
    sourceRefId = connection.source.businessObject.elementRef.id;
  }
  if (is(connection.source.businessObject, 'archimate:Connection')) {
    sourceRefId = connection.source.businessObject.relationshipRef.id;
  }
  if (is(connection.target.businessObject, 'archimate:Node')) {
    targetRefId = connection.target.businessObject.elementRef.id;
  }
  if (is(connection.target.businessObject, 'archimate:Connection')) {
    targetRefId = connection.target.businessObject.relationshipRef.id;
  }

  var currentRelationshipRef = connection.businessObject.relationshipRef && connection.businessObject.relationshipRef.id;

  if (relationshipsNode) {
    var relationships = relationshipsNode.get('relationships');

    var directConnections = filterNode(relationships, sourceRefId, targetRefId, currentRelationshipRef);

    forEach(directConnections, function(relationship) {
      var definition = {
        group: groupDirect,
        label: relationship.type,
        description: relationship.name,
        actionName: 'existing-connection-' + relationship.id,
        className: 'archimate-relation-' + relationship.type.toLowerCase(),
      }

      menuEntries.push(self._createMenuEntry(definition, function() {
        modeling.updateRelationship(connection, { type: relationship.type, existingRelationship: relationship });
      }));
  
    });

    var reverseConnections = filterNode(relationships, targetRefId, sourceRefId);

    forEach(reverseConnections, function(relationship) {
      var definition = {
        group: groupReverse,
        label: relationship.type,
        description: relationship.name,
        actionName: 'existing-connection-' + relationship.id,
        className: 'archimate-relation-' + relationship.type.toLowerCase(),
      }

      menuEntries.push(self._createMenuEntry(definition, function() {
        modeling.updateRelationship(connection, { type: relationship.type, existingRelationship: relationship, reverse: true });
      }));
  
    });

  }
  return menuEntries;
}

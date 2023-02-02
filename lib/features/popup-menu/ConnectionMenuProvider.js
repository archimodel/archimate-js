import {
  forEach
} from 'min-dash';
import { logger } from '../../util/Logger';
import modeling from '../modeling';

import { getRelationshipsAllowed } from './ConnectionOptions';

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
  logger.log('getEntries');
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

  var entriesAllowed = getRelationshipsAllowed(element.source.type, element.target.type);//element.type);

  logger.log(entriesAllowed);

  entries = this._createEntries(element, entriesAllowed);

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
      modeling.updateRelationship(connection, { type: entry.target.type });
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

  //var updateConnection = this._modeling.connect;//updateProperties; //this._modeling.setConnection; 

  //action = action || updateConnection;//replaceElement;

  var menuEntry = {
    label: translate(definition.label),
    className: definition.className,
    id: definition.actionName,
    action: action
  };

  return menuEntry;
};

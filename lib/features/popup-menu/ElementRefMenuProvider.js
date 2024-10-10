import {
  forEach
} from 'min-dash';

import { getExistingElements } from '../../util/ElementUtil';
import { logger } from '../../util/Logger';


/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
export default function ElementRefMenuProvider(popupMenu, modeling, create, rules, translate, canvas) {

  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._create = create;
  this._rules = rules;
  this._translate = translate;
  this._canvas = canvas;

  this.register();
}

ElementRefMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'create',
  'rules',
  'translate',
  'canvas'
];


/**
 * Register connection menu provider in the popup menu
 */
ElementRefMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('archimate-element-ref', this);
};


/**
 * Get all entries from ConnectionOptions for the given element and apply filters
 * on them. Get only connections allowed for the given element.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ElementRefMenuProvider.prototype.getEntries = function(element) {
/*  var rules = this._rules;

  if (!rules.allowed('shape.replace', { element: element })) {
    return [];
  }
*/
  var entries = [];

  entries = this._getExistingElements(element);

  logger.log(entries);

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
ElementRefMenuProvider.prototype.getHeaderEntries = function(element) {
  var headerEntries = [];

  return headerEntries;
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
ElementRefMenuProvider.prototype._createMenuEntry = function(definition, action) {
  var translate = this._translate;

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

ElementRefMenuProvider.prototype._getExistingElements = function(element) {

  var groupName = element.event ? 'Get existing element from model' : 'Change element reference to';
  const groupExisting = {
    id: 'group-existing-elements',
    name: groupName
  }

  var modeling = this._modeling;
  var create = this._create;

  var self = this;

  var menuEntries = [];

  var elementType = element.type;
  var elementsNode = self._canvas._rootElement.modelRef.elementsNode;
  var existingElements = [];

  var elementRef = element.businessObject.elementRef;
  if (elementRef) {
    existingElements = getExistingElements(elementType, elementsNode, elementRef.id);
  } else {
    // Create a new element because there is no elementRef in businessObject
    var definition = {
      group: {
        id: 'group-new-element',
        name: 'Create new element in model'
      },
      label: element.name,
      actionName: 'new-element',
      className: 'archimate-element-' + element.type.toLowerCase(),
    }

    menuEntries.push(self._createMenuEntry(definition, function() {
      create.start(element.event, element);
    }));
    existingElements = getExistingElements(elementType, elementsNode);
  }
  
  forEach(existingElements, function(existingElementRef) {
    var definition = {
      group: groupExisting,
      label: existingElementRef.name,
      actionName: 'existing-element-' + existingElementRef.id,
      className: 'archimate-element-' + existingElementRef.type.toLowerCase(),
    }

    menuEntries.push(self._createMenuEntry(definition, function() {
      if (element.event) {
        element.newElementRef = existingElementRef;
        create.start(element.event, element);
      } else {
        modeling.replaceElementRef(element, existingElementRef);
      }
    }));

  });

  return menuEntries;
}

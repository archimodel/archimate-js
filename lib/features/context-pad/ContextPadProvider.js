import {
  assign,
  isArray,
  keys,
  forEach
} from 'min-dash';

import {
  hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse';

import COLORS from '../../util/ColorUtil';
import { is, getViewElement, getElementRef } from '../../util/ModelUtil';
import { isAny } from '../modeling/util/ModelingUtil';

import { logger } from "../../util/Logger";

/**
 * A provider for ArchiMate elements context pad
 */
export default function ContextPadProvider(
  config, injector, eventBus,
  contextPad, modeling, elementFactory,
  connect, create, popupMenu,
  canvas, rules, translate) {

  config = config || {};

  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._elementFactory = elementFactory;
  this._connect = connect;
  this._create = create;
  this._popupMenu = popupMenu;
  this._canvas = canvas;
  this._rules = rules;
  this._translate = translate;

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }

  eventBus.on('create.end', 250, function(event) {
    var context = event.context,
        shape = context.shape;

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return;
    }

    var entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });


  eventBus.on('connect.ended', 250, function(event) {
    const connection = event.context.connection;

     if (connection) {

      if (!popupMenu.isEmpty(connection, 'archimate-connection')) {

        openPopupMenu(event, connection, popupMenu, contextPad, translate);

      }
    }
  });

}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
];

ContextPadProvider.prototype.getContextPadEntries = function(element) {

  logger.log('getContextPadEntries(element):');
  logger.log(element);

  const {
    _contextPad: contextPad,
    _rules: rules,
    _modeling: modeling,
    _connect: connect,
    _popupMenu: popupMenu,
    _translate: translate
  } = this;

  let actions = {};

  function getConnectionMenuPosition(element) {

    var Y_OFFSET = 5;

    var pad = contextPad.getPad(element).html;

    var padRect = pad.getBoundingClientRect();

    var pos = {
      x: padRect.left,
      y: padRect.bottom + Y_OFFSET
    };

    return pos;
  }

  function removeElement(e) {
    modeling.removeElements([ element ]);
  }

  function setColor(color) {
    modeling.setColor(element, color);
  }

  function startConnect(event, element) {
    logger.log('startConnect(event, element)');
    logger.log({event, element});
    connect.start(event, element);
  }

  function createDeleteEntry(actions) {

    // delete element entry, only show if allowed by rules
    let deleteAllowed = rules.allowed('elements.delete', { elements: [ element ] });

    if (isArray(deleteAllowed)) {

      // was the element returned as a deletion candidate?
      deleteAllowed = deleteAllowed[0] === element;
    }

    if (deleteAllowed) {
      assign(actions, {
        'delete': {
          group: 'edit',
          className: 'archimate-tool-trash',
          title: translate('Remove'),
          action: {
            click: removeElement
          }
        }
      });
    }
  }

  function createStartConnect(actions) {
    assign(actions, {
      'connect-element': {
        group: 'connect',
        className: 'archimate-relation-multi',
        title: translate('Create connection'),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
  }

  function createSetConnection(actions) {

    if (!popupMenu.isEmpty(element, 'archimate-connection')) {
      // Connection menu entry
      assign(actions, {
        'set-connection': {
          group: 'connect',
          className: 'archimate-tool-wrench',
          title: translate('Set connection'),
          action: {
            click: function(event, element) {

              openPopupMenu(event, element, popupMenu, contextPad, translate);
            }
          }
        }
      });
    }
  }

  function createStartNoteConnect(actions) {
    assign(actions, {
      'connect-note': {
        group: 'connect',
        className: 'archimate-relation-access',
        title: translate('Connect Note'),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
  }


  /*function createColoringEntries(actions) {

    forEach(keys(COLORS), key => {
      var color = COLORS[key];

      function getClassNames() {
        var classNames = [];

        // No getColor possible because fillColor is an rgba string 
        // and can't be equal to standard color of the contextPad
        if (color === getColor(element)) {

          classNames.push('ajs-color-entry-disabled');
        }

        classNames.push('ajs-color-entry-' + key);

        return classNames;
      }

      assign(actions, {
        ['color-' + key]: {
          group: 'color',
          className: getClassNames(),
          title: translate('Set Color'),
          action: {
            click: (event) => setColor(color)
          }
        }
      });
    });
  }*/


  var bo = element.businessObject;

  if (isAny(bo, ['archimate:Note'])) {
    createStartNoteConnect(actions);
  }

  if (isAny(bo, ['archimate:Node'])) {
    // createColoringEntries(actions);
    createStartConnect(actions);
  }

  if (isAny(bo, ['archimate:Connection'])) {
    createSetConnection(actions);
  }

  /*
  if (is(elementRef, 'archimate:Image')) {
    assign(actions, {
      'replace.image': {
        group: 'replace',
        className: 'bpmn-icon-screw-wrench',
        title: translate('Change image source'),
        action: {
          click: (event) => imageSelection.select(element)
        }
      }
    });
  }*/

  createDeleteEntry(actions);

  return actions;
};

function openPopupMenu(event, element, popupMenu, contextPad, translate) {

  var Y_OFFSET = 5;

  var pad = contextPad.getPad(element).html;

  var padRect = pad.getBoundingClientRect();

  var position = {
    x: padRect.left,
    y: padRect.bottom + Y_OFFSET,
    cursor: { x: event.x, y: event.y }
  };

  popupMenu.open(element, 'archimate-connection', position, {
    title: translate('Set connection'),
    width: 180,
    //search: true
  });

}

function getColor(element) {
  var viewElement = getViewElement(element);

  return viewElement.style.fillColor || element.color;
}

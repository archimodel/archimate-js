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
import { is, isAny, NOTE } from '../../util/ModelUtil';

import { logger } from "../../util/Logger";

const colorImageSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m12.5 5.5.3-.4 3.6-3.6c.5-.5 1.3-.5 1.7 0l1 1c.5.4.5 1.2 0 1.7l-3.6 3.6-.4.2v.2c0 1.4.6 2 1 2.7v.6l-1.7 1.6c-.2.2-.4.2-.6 0L7.3 6.6a.4.4 0 0 1 0-.6l.3-.3.5-.5.8-.8c.2-.2.4-.1.6 0 .9.5 1.5 1.1 3 1.1zm-9.9 6 4.2-4.2 6.3 6.3-4.2 4.2c-.3.3-.9.3-1.2 0l-.8-.8-.9-.8-2.3-2.9" /></svg>';
const textImageSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 3.5 3 l 15 0 l 0 5 l -1.5 -2 l -12 0 l -1.5 2 m 9 -2 l 0 11.5 l 2 1.5 l -7 0 l 2 -1.5 l 0 -11.5" /></svg>';

/**
 * A provider for ArchiMate elements context pad
 */
export default function ContextPadProvider(
  config, injector, eventBus,
  contextPad, modeling, elementFactory,
  connect, create, popupMenu,
  canvas, rules, translate, autoPlace) {

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
  this._autoPlace = autoPlace;

  /*if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }
*/
  eventBus.on('create.end', 250, function(event) {
    var context = event.context,
        shape = context.shape;

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return;
    }

    var entries = contextPad.getEntries(shape);

    if (entries.setconnection) {
      entries.setconnection.action.click(event, shape);
    }
  });


  eventBus.on('connect.ended', 250, function(event) {
    const connection = event.context.connection;

    if (connection && connection.type !== 'Line') {
      if (!popupMenu.isEmpty(connection, 'archimate-connection')) {
        openConnectionPopupMenu(event, connection, popupMenu, contextPad, translate, canvas);
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
  'translate',
  'autoPlace'
];

ContextPadProvider.prototype.getContextPadEntries = function(element) {
  logger.log(element);

  const {
    _contextPad: contextPad,
    _rules: rules,
    _modeling: modeling,
    _elementFactory: elementFactory,
    _connect: connect,
    _create: create,
    _popupMenu: popupMenu,
    _translate: translate,
    _autoPlace: autoPlace,
    _canvas: canvas
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
    connect.start(event, element);
  }

  function addJunction(event, element) {
    var shape = elementFactory.createShape(assign({ type: "BusinessActor" }, {}));
    element.target = shape;
    var properties = {
      addJunction: true,
      newSource: element.source,
      newTarget: shape,
      oldSource: element.source,
      oldTarget: element.target
    }
    modeling.updateRelationship(element, properties);

    create.start(event, shape);
  }

  /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {

    if (typeof title !== 'string') {
      options = title;
      title = translate('Append {type}', { type: type.replace(/^archimate:/, '') });
    }

    function appendStart(event, element) {

      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape, {
        source: element
      });

      /* shape = modeling.appendShape(element, shape, {
        x: 100,
        y: 100
      }); */
    }

    var append = autoPlace ? function(event, element) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      autoPlace.append(element, shape);
    } : appendStart;


    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append
      }
    };
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
        title: translate('Create relation'),
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
          className: 'archimate-tool-gear',
          title: translate('Set relation'),
          action: {
            click: function(event, element) {
              openConnectionPopupMenu(event, element, popupMenu, contextPad, translate, canvas);
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
        className: 'archimate-relation-line',
        title: translate('Connect Note'),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
  }

  function createAddJunction(actions) {
    if (element.type === 'Relationship' || element.type === 'Line') {
      return;
    }
    assign(actions, {
      'add-junction': {
        group: 'connect',
        className: 'archimate-relation-junction',
        title: translate('Add Junction'),
        action: {
          click: addJunction
        }
      }
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
            click: (event) => setColor(color) // 
          }
        }
      });
    });
  }*/

  function createTextOptions(actions) {

    assign(actions, {
      'set-text': {
        group: 'edit',
        className: 'bpmn-icon-color',
        title: translate('Set Text'),
        imageUrl: getImageUrl(textImageSvg),
        action: {
          click: (event, elements) => {
            openTextPopupMenu(event, elements, popupMenu, contextPad, translate, canvas);
          }
        }
      }
    });

  }

  var bo = element.businessObject;

  if (isAny(bo, ['archimate:Node'])) {
    // createColoringEntries(actions);
    createTextOptions(actions);

    if (bo.type === NOTE) {
      createStartNoteConnect(actions);
    } else {
      createStartConnect(actions);
    }

  }

  if (isAny(bo, ['archimate:Connection'])) {
    createSetConnection(actions);
    // createAddJunction(actions);
  }

  assign(actions, {
    'append.note': appendAction(NOTE, 'archimate-tool-note')
  });

  createDeleteEntry(actions);

  return actions;
};


// PopupMenu //////////////////////

function openTextPopupMenu(event, elements, popupMenu, contextPad, translate, canvas) {
  var position = {
    ...getStartPosition(canvas, contextPad, elements),
    cursor: {
      x: event.x,
      y: event.y
    }
  };

  popupMenu.open(elements, 'text-options', position);

}

function openConnectionPopupMenu(event, element, popupMenu, contextPad, translate, canvas) {
  var position = {
    ...getStartPosition(canvas, contextPad, element),
    cursor: {
      x: event.x,
      y: event.y
    }
  };

  popupMenu.open(element, 'archimate-connection', position, {
    title: translate('Set relation'),
    width: 300,
    //search: true,
    showCategories: true
  });

}

// helpers //////////////////////

function getStartPosition(canvas, contextPad, elements) {

  var Y_OFFSET = 5;

  var diagramContainer = canvas.getContainer();
  var pad = contextPad.getPad(elements).html;

  var diagramRect = diagramContainer.getBoundingClientRect();
  var padRect = pad.getBoundingClientRect();

  var top = padRect.top - diagramRect.top;
  var left = padRect.left - diagramRect.left;

  var pos = {
    x: left, // padRect.left,
    y: top + padRect.height + Y_OFFSET // padRect.bottom + Y_OFFSET
  };

  return pos;
}

function getImageUrl(svg) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function getColor(element) {
  var viewElement = element.businessObject;

  return viewElement.style.fillColor || element.color;
}

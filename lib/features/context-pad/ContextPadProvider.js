import {
  assign,
  isArray,
  keys,
  forEach
} from 'min-dash';

import {
  hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse';

import { is, isAny, NOTE, CONNECTION_RELATIONSHIP, CONNECTION_LINE, VIEW } from '../../util/ModelUtil';

import { logger } from "../../util/Logger";
import { ARCHIMATE_CONNECTION, ARCHIMATE_NODE } from '../../metamodel/Concept';

const colorImageSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m12.5 5.5.3-.4 3.6-3.6c.5-.5 1.3-.5 1.7 0l1 1c.5.4.5 1.2 0 1.7l-3.6 3.6-.4.2v.2c0 1.4.6 2 1 2.7v.6l-1.7 1.6c-.2.2-.4.2-.6 0L7.3 6.6a.4.4 0 0 1 0-.6l.3-.3.5-.5.8-.8c.2-.2.4-.1.6 0 .9.5 1.5 1.1 3 1.1zm-9.9 6 4.2-4.2 6.3 6.3-4.2 4.2c-.3.3-.9.3-1.2 0l-.8-.8-.9-.8-2.3-2.9" /></svg>';
const textImageSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 3.5 3 l 15 0 l 0 5 l -1.5 -2 l -12 0 l -1.5 2 m 9 -2 l 0 11.5 l 2 1.5 l -7 0 l 2 -1.5 l 0 -11.5" /></svg>';
const nestedImageSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 3 3 l 0 11 l 14 0 l 0 -12 l -14 0 m 6 5 l 12 0 l 0 11 l -12 0 l 0 -11 m -8 -7 l 18 0 l 0 16 l -18 0 l 0 -16" /></svg>';

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

  var self = this;

  /*if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }
*/
  function connectEndedHandler(event) {
    const connection = event.context.connection;

    var title = 'Set Relation';
    if (connection.source.host && connection.source.host === connection.target) {
      title = 'Set Nested Relation'
    }

    if (connection && connection.type !== CONNECTION_LINE) {
      if (!popupMenu.isEmpty(connection, 'archimate-connection')) {
        self.openConnectionPopupMenu(event, connection, title);
      }
    }
  }

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
    connectEndedHandler(event);
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
    _canvas: canvas,
    
  } = this;

  var self = this;

  let actions = {};

  function removeElement(event, element) {
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
    modeling.replaceRelationshipRef(element, properties);

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
      group: 'connect',
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
    let deleteAllowed = true; //rules.allowed('elements.delete', { elements: [ element ] });

    if (isArray(deleteAllowed)) {

      // was the element returned as a deletion candidate?
      deleteAllowed = deleteAllowed[0] === element;
    }

    if (deleteAllowed) {
      assign(actions, {
        'delete': {
          group: 'delete',
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
        title: translate('Create Relation'),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
  }

  function createSetConnection(actions) {

    var title = 'Set Relation';
    if (element.source.host && element.source.host === element.target) {
      title = 'Set Nested Relation';
    }

    if (!popupMenu.isEmpty(element, 'archimate-connection')) {
      // Connection menu entry
      assign(actions, {
        'set-connection': {
          group: 'edit',
          className: 'archimate-tool-gear',
          title: translate(title),
          action: {
            click: function(event, element) {
              self.openConnectionPopupMenu(event, element, title);
            }
          }
        }
      });
    }
  }

  function createReplaceElementRef(actions) {

    if (!popupMenu.isEmpty(element, 'archimate-element-ref')) {
      // Set element reference menu entry
      assign(actions, {
        'set-element-ref': {
          group: 'edit',
          className: 'archimate-tool-gear',
          title: translate('Set Element Reference'),
          action: {
            click: function(event, element) {
              self.openElementRefPopupMenu(event, element);
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
    if (element.type === CONNECTION_RELATIONSHIP || element.type === CONNECTION_LINE) {
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
          group: 'edit',
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
        className: 'archimate-tool-text',
        title: translate('Set Text'),
        imageUrl: getImageUrl(textImageSvg),
        action: {
          click: (event, elements) => {
            self.openTextPopupMenu(event, elements); //, popupMenu, contextPad, translate, canvas);
          }
        }
      }
    });

  }

  var bo = element.businessObject;

  if (isAny(bo, [ ARCHIMATE_NODE ])) {
    // createColoringEntries(actions);
    createTextOptions(actions);

    if (bo.type === NOTE) {
      createStartNoteConnect(actions);
    } else {
      createStartConnect(actions);
      createReplaceElementRef(actions);
    }

    assign(actions, {
      'append.note': appendAction(NOTE, 'archimate-tool-note')
    });
  }

  if (isAny(bo, [ ARCHIMATE_CONNECTION ])) {
    createSetConnection(actions);
    // createAddJunction(actions);

    if (bo.type !== CONNECTION_LINE) {
      assign(actions, {
        'append.note': appendAction(NOTE, 'archimate-tool-note')
      });
    }
  }

  createDeleteEntry(actions);

  return actions;
};


// PopupMenu //////////////////////

ContextPadProvider.prototype.openTextPopupMenu = function(event, elements) {
  const {
    _contextPad: contextPad,
    _popupMenu: popupMenu,
    _canvas: canvas,
  } = this;

  var position = {
    ...getMenuPosition(canvas, contextPad, elements),
    cursor: {
      x: event.x,
      y: event.y
    }
  };

  popupMenu.open(elements, 'text-options', position);

}

ContextPadProvider.prototype.openElementRefPopupMenu = function(event, element) {
  logger.log(event);

  const {
    _contextPad: contextPad,
    _popupMenu: popupMenu,
    _translate: translate,
    _canvas: canvas,
  } = this;

  var position = {
    ...getMenuPosition(canvas, contextPad, element),
    cursor: {
      x: element.x,
      y: element.y
    }
  };

  logger.log(position);

  popupMenu.open(element, 'archimate-element-ref', position, {
      //title: translate('Set Element Reference'),
      width: 300,
      search: true,
      showCategories: true
  });
}

ContextPadProvider.prototype.openConnectionPopupMenu = function (event, element, title) { 
  const {
    _contextPad: contextPad,
    _popupMenu: popupMenu,
    _translate: translate,
    _canvas: canvas,
  } = this;


  var position = {
    ...getMenuPosition(canvas, contextPad, element),
    cursor: {
      x: event.x,
      y: event.y
    }
  };

  popupMenu.open(element, 'archimate-connection', position, {
    title: translate(title),
    width: 300,
    search: true,
    showCategories: true
  });

}

// helpers //////////////////////

function getMenuPosition(canvas, contextPad, elements) {

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

/*function getMenuPosition(element) {

  var Y_OFFSET = 5;

  var pad = contextPad.getPad(element).html;

  var padRect = pad.getBoundingClientRect();

  var pos = {
    x: padRect.left,
    y: padRect.bottom + Y_OFFSET
  };

  return pos;
}*/

function getImageUrl(svg) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function getColor(element) {
  var viewElement = element.businessObject;

  return viewElement.style.fillColor || element.color;
}

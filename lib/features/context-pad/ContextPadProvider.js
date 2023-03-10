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
    _rules: rules,
    _modeling: modeling,
    _connect: connect,
    _translate: translate
  } = this;

  let actions = {};

  function removeElement(e) {
    modeling.removeElements([ element ]);
  }

  function setColor(color) {
    modeling.setColor(element, color);
  }

  function startConnect(event, element) {
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
          className: 'bpmn-icon-trash',
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
      'connect': {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Association Connection'),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
  }

  function createStartNoteConnect(actions) {
    assign(actions, {
      'connect': {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Note connection'),
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


  if (element.type === 'archimate:Note') {
    createStartNoteConnect(actions);
  }

  var elementRef = getElementRef(element);

  if (isAny(elementRef, ['archimate:BaseElement'])) {
    // createColoringEntries(actions);
    createStartConnect(actions);
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

function getColor(element) {
  var viewElement = getViewElement(element);

  return viewElement.style.fillColor || element.color;
}

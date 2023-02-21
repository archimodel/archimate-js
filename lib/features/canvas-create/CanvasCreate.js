import {
  delegate as domDelegate
} from 'min-dom';

import {
  assign
} from 'min-dash';

import {
  isAny,
  getViewElement
} from '../../util/ModelUtil';

import COLORS from '../../util/ColorUtil';

import {
  toPoint
} from 'diagram-js/lib/util/Event';

import { logger } from "../../util/Logger";

var DEFAULT_SHAPE = {
  type: 'archimate:',
  color: '',
  $instanceOf: function() { return true; }
};

export default function CanvasCreate(eventBus, elementFactory, canvas, directEditing, modeling) {

  var lastCreatedShape = DEFAULT_SHAPE;

  function _getNewShapePosition(event) {
    var eventPoint = toPoint(event);

    return {
      x: eventPoint.x,
      y: eventPoint.y
    };
  }

  function _activateDirectEdit(element) {
    if (isAny(getViewElement(element), [ 'archimate:Node', 'archimate:Note' ])) {
      directEditing.activate(element);
    }
  }

  function _createShapeOnCanvas(event) {
    var position = _getNewShapePosition(event);

    var newShape = elementFactory.create(
        'shape', assign(lastCreatedShape, position));

    logger.log('_createShapeOnCanvas(event)');
    logger.log(newShape);

    var root = canvas.getRootElement();

    var createdShape = modeling.createShape(newShape, position, root);

    _activateDirectEdit(createdShape);
  }

  function _saveLastCreatedShape(shape) {
    if (!shape) {
      lastCreatedShape = DEFAULT_SHAPE;
      return;
    }

    var viewElement = getViewElement(shape);

    lastCreatedShape = {
      type: shape.type,
      // color: viewElement.style.fillColor,
      $instanceOf: function(type) {
        return (typeof viewElement.$instanceOf === 'function') && viewElement.$instanceOf(type);
      }
    };
  }


  eventBus.on('canvas.init', function(context) {
    var svg = context.svg;

    domDelegate.bind(svg, 'svg', 'dblclick', function(event) {
      if (event.target !== svg) {
        return;
      }

      _createShapeOnCanvas(event);
    });

    eventBus.on('create.end', function(context) {
      var shape = context.shape;
      _saveLastCreatedShape(shape);
    });
  });
}

CanvasCreate.$inject = ['eventBus', 'elementFactory', 'canvas', 'directEditing', 'modeling'];

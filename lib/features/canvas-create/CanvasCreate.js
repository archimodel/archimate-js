import {
  delegate as domDelegate
} from 'min-dom';

import {
  assign
} from 'min-dash';

import {
  isAny
} from '../../util/ModelUtil';

import {
  toPoint
} from 'diagram-js/lib/util/Event';

import { logger } from "../../util/Logger";

var DEFAULT_SHAPE = {
  type: 'archimate:',
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
    if (isAny(element.businessObject, [ ARCHIMATE_NODE ])) {
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

    var viewElement = shape.businessObject;

    lastCreatedShape = {
      type: shape.type,
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

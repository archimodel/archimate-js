import {
  assign
} from 'min-dash';

import inherits from 'inherits-browser';

import {
  is,
  getViewElement,
  getElementRef
} from '../../../util/ModelUtil';

import {
  isLabelExternal,
  getExternalLabelMid,
  hasExternalLabel,
  isLabel
} from '../../../util/LabelUtil';

import {
  getLabel
} from '../../label-editing/LabelUtil';

import {
  getLabelAdjustment
} from './util/LabelLayoutUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  getNewAttachPoint
} from 'diagram-js/lib/util/AttachUtil';

import {
  getMid,
  roundPoint
} from 'diagram-js/lib/layout/LayoutUtil';

import {
  delta
} from 'diagram-js/lib/util/PositionUtil';

import {
  sortBy
} from 'min-dash';

import {
  getDistancePointLine,
  perpendicularFoot
} from './util/GeometricUtil';

import { logger } from "../../../util/Logger";
import { ARCHIMATE_ELEMENT } from '../../../metamodel/Concept';

var DEFAULT_LABEL_DIMENSIONS = {
  width: 90,
  height: 20
};

var NAME_PROPERTY = 'name';

/**
 * A component that makes sure that external labels are added
 * together with respective elements and properly updated (DI wise)
 * during move.
 *
 * @param {EventBus} eventBus
 * @param {Modeling} modeling
 * @param {ArchimateFactory} archimateFactory
 * @param {TextRenderer} textRenderer
 */
export default function LabelBehavior(
    eventBus, modeling, archimateFactory,
    textRenderer) {

  CommandInterceptor.call(this, eventBus);

  // update label if name property was updated
  this.postExecute('element.updateProperties', function(event) {
    logger.log({event});
    var context = event.context,
        element = context.element,
        properties = context.properties;

    if (NAME_PROPERTY in properties) {
      modeling.updateLabel(element, properties[NAME_PROPERTY]);
    }
  });

  // create label shape after shape/connection was created
  this.postExecute([ 'shape.create', 'connection.create' ], function(event) {
    logger.log({event});

    var context = event.context,
        hints = context.hints || {};

    if (hints.createElementsBehavior === false) {
      return;
    }

    var element = context.shape || context.connection,
        viewElement = getViewElement(element);

    if (isLabel(element) || !isLabelExternal(element)) {
      logger.log('if isLabel(element) || !isLabelExternal(element)');
      return;
    }

    // only create label if attribute available
    if (!getLabel(element)) {
      logger.log('if !getLabel(element)');
      return;
    }

    var labelCenter = getExternalLabelMid(element);

    // we don't care about x and y
    var labelDimensions = textRenderer.getExternalLabelBounds(
      DEFAULT_LABEL_DIMENSIONS,
      getLabel(element)
    );

    modeling.createLabel(element, labelCenter, {
      id: viewElement.id + '_label',
      businessObject: viewElement,
      width: labelDimensions.width,
      height: labelDimensions.height
    });
  });

  // update label after label shape was deleted
  this.postExecute('shape.delete', function(event) {
    logger.log({event});
    var context = event.context,
        labelTarget = context.labelTarget,
        hints = context.hints || {};

    // check if label
    if (labelTarget && hints.unsetLabel !== false) {
      modeling.updateLabel(labelTarget, null, null, { removeShape: false });
    }
  });

  // update di information on label creation
  //  this.postExecute([ 'label.create' ], function(event) {
  this.postExecute([ 'no.call' ], function(event) {
    logger.log({event});
  

    var context = event.context,
        element = context.shape,
        viewElement,
        elementRef;

    // we want to trigger on real labels only
    if (!element.labelTarget) {
      return;
    }

    var tempElementRef = getElementRef(element.labelTarget);
    
    if (!is(tempElementRef, ARCHIMATE_ELEMENT)) {
      return;
    }
    
    tempElementRef = getElementRef(element);

    // we want to trigger on board elements only
    if (!is(tempElementRef, ARCHIMATE_ELEMENT)) {
      return;
    }

    viewElement = getViewElement(element);
    elementRef = getElementRef(element);

    //TODO vbo
    // elementRef have always a name in moddle object so never get inside this "if" but if not => error
    if (!elementRef.name) {
      elementRef.name = archimateFactory.create(ARCHIMATE_LABEL, {
        bounds: archimateFactory.create('dc:Bounds')
      });
    }

    assign(viewElement.bounds, {
      x: element.x,
      y: element.y,
      w: element.width,
      h: element.height
    });
  });

  function getVisibleLabelAdjustment(event) {

    var context = event.context,
        connection = context.connection,
        label = connection.label,
        hints = assign({}, context.hints),
        newWaypoints = context.newWaypoints || connection.waypoints,
        oldWaypoints = context.oldWaypoints;


    if (typeof hints.startChanged === 'undefined') {
      hints.startChanged = !!hints.connectionStart;
    }

    if (typeof hints.endChanged === 'undefined') {
      hints.endChanged = !!hints.connectionEnd;
    }

    return getLabelAdjustment(label, newWaypoints, oldWaypoints, hints);
  }

  this.postExecute([
    'connection.layout',
    'connection.updateWaypoints'
  ], function(event) {
    logger.log({event});
    var context = event.context,
        hints = context.hints || {};

    if (hints.labelBehavior === false) {
      return;
    }

    var connection = context.connection,
        label = connection.label,
        labelAdjustment;

    // handle missing label as well as the case
    // that the label parent does not exist (yet),
    // because it is being pasted / created via multi element create
    //
    // Cf. https://github.com/bpmn-io/bpmn-js/pull/1227
    if (!label || !label.parent) {
      return;
    }

    labelAdjustment = getVisibleLabelAdjustment(event);

    modeling.moveShape(label, labelAdjustment);
  });


  // keep label position on shape replace
  this.postExecute([ 'shape.replace' ], function(event) {
    logger.log({event});
    var context = event.context,
        newShape = context.newShape,
        oldShape = context.oldShape;

    var viewElement = getViewElement(newShape);

    if (viewElement
//      && isLabelExternal(viewElement)
      && isLabelExternal(newShape)
      && oldShape.label
      && newShape.label) {
      newShape.label.x = oldShape.label.x;
      newShape.label.y = oldShape.label.y;
    }
  });


  // move external label after resizing
  this.postExecute('shape.resize', function(event) {
    logger.log({event});
    var context = event.context,
        shape = context.shape,
        newBounds = context.newBounds,
        oldBounds = context.oldBounds;

    if (hasExternalLabel(shape)) {

      var label = shape.label,
          labelMid = getMid(label),
          edges = asEdges(oldBounds);

      // get nearest border point to label as reference point
      var referencePoint = getReferencePoint(labelMid, edges);

      var delta = getReferencePointDelta(referencePoint, oldBounds, newBounds);

      modeling.moveShape(label, delta);

    }

  });

}

inherits(LabelBehavior, CommandInterceptor);

LabelBehavior.$inject = [
  'eventBus',
  'modeling',
  'archimateFactory',
  'textRenderer'
];

// helpers //////////////////////

/**
 * Calculates a reference point delta relative to a new position
 * of a certain element's bounds
 *
 * @param {Point} point
 * @param {Bounds} oldBounds
 * @param {Bounds} newBounds
 *
 * @return {Delta} delta
 */
export function getReferencePointDelta(referencePoint, oldBounds, newBounds) {

  var newReferencePoint = getNewAttachPoint(referencePoint, oldBounds, newBounds);

  return roundPoint(delta(newReferencePoint, referencePoint));
}

/**
 * Generates the nearest point (reference point) for a given point
 * onto given set of lines
 *
 * @param {Array<Point, Point>} lines
 * @param {Point} point
 *
 * @param {Point}
 */
export function getReferencePoint(point, lines) {

  if (!lines.length) {
    return;
  }

  var nearestLine = getNearestLine(point, lines);

  return perpendicularFoot(point, nearestLine);
}

/**
 * Convert the given bounds to a lines array containing all edges
 *
 * @param {Bounds|Point} bounds
 *
 * @return Array<Point>
 */
export function asEdges(bounds) {
  return [
    [ // top
      {
        x: bounds.x,
        y: bounds.y
      },
      {
        x: bounds.x + (bounds.width || 0),
        y: bounds.y
      }
    ],
    [ // right
      {
        x: bounds.x + (bounds.width || 0),
        y: bounds.y
      },
      {
        x: bounds.x + (bounds.width || 0),
        y: bounds.y + (bounds.height || 0)
      }
    ],
    [ // bottom
      {
        x: bounds.x,
        y: bounds.y + (bounds.height || 0)
      },
      {
        x: bounds.x + (bounds.width || 0),
        y: bounds.y + (bounds.height || 0)
      }
    ],
    [ // left
      {
        x: bounds.x,
        y: bounds.y
      },
      {
        x: bounds.x,
        y: bounds.y + (bounds.height || 0)
      }
    ]
  ];
}

/**
 * Returns the nearest line for a given point by distance
 * @param {Point} point
 * @param Array<Point> lines
 *
 * @return Array<Point>
 */
function getNearestLine(point, lines) {

  var distances = lines.map(function(l) {
    return {
      line: l,
      distance: getDistancePointLine(point, l)
    };
  });

  var sorted = sortBy(distances, 'distance');

  return sorted[0].line;
}

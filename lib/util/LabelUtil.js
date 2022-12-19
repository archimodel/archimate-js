import {
  assign
} from 'min-dash';

import { is, getViewElement, getElementRef } from './ModelUtil';


export var DEFAULT_LABEL_SIZE = {
  width: 90,
  height: 20
};

export var FLOW_LABEL_INDENT = 15;

/**
 * Returns true if the given element has an external label
 *
 * @param {Shape} element
 * @return {Boolean} true if has label
 */
export function isLabelExternal(element) {
  var elementRef = getElementRef(element);
  // return is(semantic, 'archimate:Group');
  return is(elementRef, 'archimate:Group');
}

/**
 * Returns true if the given element has an external label
 *
 * @param {djs.model.shape} element
 * @return {Boolean} true if has label
 */
export function hasExternalLabel(element) {
  return isLabel(element.label);
}


/**
 * Get the middle of a number of waypoints
 *
 * @param  {Array<Point>} waypoints
 * @return {Point} the mid point
 */
export function getWaypointsMid(waypoints) {

  var mid = waypoints.length / 2 - 1;

  var first = waypoints[Math.floor(mid)];
  var second = waypoints[Math.ceil(mid + 0.01)];

  return {
    x: first.x + (second.x - first.x) / 2,
    y: first.y + (second.y - first.y) / 2
  };
}


export function getExternalLabelMid(element) {

  var elementRef = getElementRef(element);      
  
  logger.log('getExternalLabelMid(element)');
  logger.log({element});

  if (is(elementRef, 'archimate:Group')) {

    return {
      x: element.x + element.width / 2,
      y: element.y + DEFAULT_LABEL_SIZE.height / 2
    };
  } else {
    return {
      x: element.x + element.width / 2,
      y: element.y + element.height + DEFAULT_LABEL_SIZE.height / 2
    };
  }
}


/**
 * Returns the bounds of an elements label, parsed from the elements or
 * generated from its bounds.
 *
 * @param {djs.model.Base} element
 */
export function getExternalLabelBounds(element) {

  var mid,
      size,
      bounds,
      di = getViewElement(element),
      label = di.label;

  if (label && label.bounds) {
    bounds = label.bounds;

    size = {
      width: Math.max(DEFAULT_LABEL_SIZE.width, bounds.width),
      height: bounds.height
    };

    mid = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
  } else {

    mid = getExternalLabelMid(element);

    size = DEFAULT_LABEL_SIZE;
  }

  return assign({
    x: mid.x - size.width / 2,
    y: mid.y - size.height / 2
  }, size);
}

export function isLabel(element) {
  return element && !!element.labelTarget;
}

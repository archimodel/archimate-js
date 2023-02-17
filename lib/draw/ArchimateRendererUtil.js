import {
  every,
  some
} from 'min-dash';

import {
  componentsToPath
} from 'diagram-js/lib/util/RenderUtil';

import { getViewElement } from '../util/ModelUtil';

import {
  LAYER_APPLICATION, LAYER_BUSINESS, LAYER_MOTIVATION, 
  LAYER_STRATEGY, LAYER_IMP_MIG, 
  LAYER_PHYSICAL, LAYER_TECHNOLOGY,
  ASPECT_BEHAVIOR, ASPECT_ACTIVE
} from '../metamodel/Concept';

export const COLOR_LAYER_STRATEGY = {r: '245', g: '222', b: '170', a: '100'}, // 'rgba(245, 222, 170, 1)' '#F5DEAA'
  COLOR_LAYER_BUSINESS = {r: '255', g: '255', b: '181', a: '100'}, // 'rgba(255, 255, 181, 1)' '#FFFFB5'
  COLOR_LAYER_APPLICATION = {r: '181', g: '255', b: '255', a: '100'}, // 'rgba(181, 255, 255, 1)' '#B5FFFF'
  COLOR_LAYER_TECHNOLOGY = {r: '201', g: '231', b: '183', a: '100'}, // 'rgba(201, 231, 183, 1)'
  COLOR_LAYER_PHYSICAL = {r: '201', g: '231', b: '183', a: '100'}, // 'rgba(201, 231, 183, 1)'
  COLOR_LAYER_IMP_MIG = {r: '255', g: '224', b: '224', a: '100'}, // 'rgba(255, 224, 224,1)'
  COLOR_LAYER_MOTIVATION = {r: '204', g: '204', b: '255', a: '100'}; // 'rgba(204, 204, 255, 1)'

export const COLOR_LAYER_MAP = new Map([
  [LAYER_STRATEGY, COLOR_LAYER_STRATEGY],
  [LAYER_BUSINESS, COLOR_LAYER_BUSINESS],
  [LAYER_APPLICATION, COLOR_LAYER_APPLICATION],
  [LAYER_TECHNOLOGY, COLOR_LAYER_TECHNOLOGY],
  [LAYER_PHYSICAL, COLOR_LAYER_PHYSICAL],
  [LAYER_IMP_MIG, COLOR_LAYER_IMP_MIG],
  [LAYER_MOTIVATION, COLOR_LAYER_MOTIVATION]
])

const BEHAVIOR_BORDER_RADIUS = 10,
  ACTIVE_BORDER_RADIUS = 0;

export const BORDER_ASPECT_MAP = new Map([
  [ASPECT_BEHAVIOR, BEHAVIOR_BORDER_RADIUS],
  [ASPECT_ACTIVE, ACTIVE_BORDER_RADIUS]
]);

export const LIGHT_GREY_RGBA = {r: '211', g: '211', b: '211', a: '100'}; // 'rgba(211, 211, 211, 1)';
export const BLACK_SHADOW_RGBA = {r: '0', g: '0', b: '0', a: '40'}; // 'rgba(0, 0, 0, 0.4)';
export const BLACK_RGBA = {r: '0', g: '0', b: '0', a: '100'}; // 'toRgbaString(0, 0, 0, 100)';

export const LINEWIDTH_NORMAL = 1,
  LINEWIDTH_MEDIUM = 2,
  LINEWIDTH_HEAVY = 3;

// color access //////////////////////

function between(x, min, max) {
  return x >= min && x <= max;
}

export function toRgbaString(color) {
  var r = color.r,
    g = color.g,
    b = color.b,
    a = 1;

  if (between(a, 0, 255) && between(g, 0, 255) && between(b, 0, 255)) {
    if (between(color.a, 0, 100)) {
      a = color.a / 100;
    }
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  } else {
    return false;
  }
}

export function getFillColor(element, defaultColor) {
  var viewElement = getViewElement(element);
  var fillColor = viewElement && viewElement.style && viewElement.style.fillColor;

  return fillColor && toRgbaString(fillColor) || 
      defaultColor && toRgbaString(defaultColor) ||
      toRgbaString(LIGHT_GREY_RGBA);

}

export function getStrokeColor(element, defaultColor) {
  var viewElement = getViewElement(element);
  var lineColor = viewElement && viewElement.style && viewElement.style.lineColor;

  return lineColor && toRgbaString(lineColor) || 
      defaultColor && toRgbaString(defaultColor) ||
      toRgbaString(BLACK_SHADOW_RGBA);

}

export function getLineColor(element, defaultColor) {
  var viewElement = getViewElement(element);
  var lineColor = viewElement && viewElement.style && viewElement.style.lineColor;

  return lineColor && toRgbaString(lineColor) || 
      defaultColor && toRgbaString(defaultColor) ||
      toRgbaString(BLACK_RGBA);

}

// cropping path customizations //////////////////////

export function getCirclePath(shape) {

  var cx = shape.x + shape.width / 2,
      cy = shape.y + shape.height / 2,
      radius = shape.width / 2;

  var circlePath = [
    ['M', cx, cy],
    ['m', 0, -radius],
    ['a', radius, radius, 0, 1, 1, 0, 2 * radius],
    ['a', radius, radius, 0, 1, 1, 0, -2 * radius],
    ['z']
  ];

  return componentsToPath(circlePath);
}

export function getRoundRectPath(shape, borderRadius) {

  var x = shape.x,
      y = shape.y,
      width = shape.width,
      height = shape.height;

  var roundRectPath = [
    ['M', x + borderRadius, y],
    ['l', width - borderRadius * 2, 0],
    ['a', borderRadius, borderRadius, 0, 0, 1, borderRadius, borderRadius],
    ['l', 0, height - borderRadius * 2],
    ['a', borderRadius, borderRadius, 0, 0, 1, -borderRadius, borderRadius],
    ['l', borderRadius * 2 - width, 0],
    ['a', borderRadius, borderRadius, 0, 0, 1, -borderRadius, -borderRadius],
    ['l', 0, borderRadius * 2 - height],
    ['a', borderRadius, borderRadius, 0, 0, 1, borderRadius, -borderRadius],
    ['z']
  ];

  return componentsToPath(roundRectPath);
}

export function getDiamondPath(shape) {

  var width = shape.width,
      height = shape.height,
      x = shape.x,
      y = shape.y,
      halfWidth = width / 2,
      halfHeight = height / 2;

  var diamondPath = [
    ['M', x + halfWidth, y],
    ['l', halfWidth, halfHeight],
    ['l', -halfWidth, halfHeight],
    ['l', -halfWidth, -halfHeight],
    ['z']
  ];

  return componentsToPath(diamondPath);
}

export function getRectPath(shape) {
  var x = shape.x,
      y = shape.y,
      width = shape.width,
      height = shape.height;

  var rectPath = [
    ['M', x, y],
    ['l', width, 0],
    ['l', 0, height],
    ['l', -width, 0],
    ['z']
  ];

  return componentsToPath(rectPath);
}

/**
 * Checks if eventDefinition of the given element matches with archimate type.
 *
 * @return {boolean} true if element is of the given archimate type
 */
export function isTypedEvent(event, eventDefinitionType, filter) {

  function matches(definition, filter) {
    return every(filter, function(val, key) {

      // we want a == conversion here, to be able to catch
      // undefined == false and friends
      /* jshint -W116 */
      return definition[key] == val;
    });
  }

  return some(event.eventDefinitions, function(definition) {
    return definition.$type === eventDefinitionType && matches(event, filter);
  });
}


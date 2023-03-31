import {
  assign, map
} from 'min-dash';

import { is, isAny } from '../util/ModelUtil';

import {
  isLabelExternal,
  getExternalLabelBounds
} from '../util/LabelUtil';

import {
  getLabel
} from '../features/label-editing/LabelUtil';

import {
  elementToString
} from './Util';

import { logger } from "../util/Logger";
import connectionPreview from 'diagram-js/lib/features/connection-preview';

function elementData(semantic, attrs) {
  return assign({
    id: semantic.id,
    type: semantic.$type,
    businessObject: semantic
  }, attrs);
}

function notYetDrawn(translate, semantic, refSemantic, property) {
  return new Error(translate('element {element} referenced by {referenced}#{property} not yet drawn', {
    element: elementToString(refSemantic),
    referenced: elementToString(semantic),
    property: property
  }));
}


/**
 * Used when importing XML model.
 * Adds elements of a specific view to the canvas.
 * All viewElements (connection or node) must refers to a model's element
 * define in baseElements array (elementsNode sub-section).
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 * @param {ElementFactory} elementFactory
 * @param {ElementRegistry} elementRegistry
 * @param {Function} translate
 * @param {TextRenderer} textRenderer
 */
export default function ArchimateImporter(
    eventBus, canvas, elementFactory,
    elementRegistry, translate, textRenderer) {

  this._eventBus = eventBus;
  this._canvas = canvas;
  this._elementFactory = elementFactory;
  this._elementRegistry = elementRegistry;
  this._translate = translate;
  this._textRenderer = textRenderer;
}

ArchimateImporter.$inject = [
  'eventBus',
  'canvas',
  'elementFactory',
  'elementRegistry',
  'translate',
  'textRenderer'
];

/**
 * Add ROOT ELEMENT => root is an invisible element (not being drawn)
 * Root is defined with <View> element
 */
ArchimateImporter.prototype.addRoot = function(view, model) {

  var rootElement, attrs;

  logger.log('addRoot(view, model)');
  logger.log({ view, model });

  // businessObject of this element is <View> object
  // add modelRef attribut with <Model> object
  var eleData = assign({
    type: 'root',
    businessObject: view,
    modelRef: model,
  }, attrs);
  
  // call ElementFactory.prototype.create = function(elementType, attrs)
  // elementType: 'root'
  rootElement = this._elementFactory.createRoot(eleData);

  logger.log('call _canvas.setRootElement(rootElement):');
  logger.log(rootElement);

  this._canvas.setRootElement(rootElement);

  logger.log('fire event \'elementRef.added\'');
  
  this._eventBus.fire('elementRef.added', { element: rootElement });

  return rootElement;
};

/**
 * Add a <Node> element to the canvas onto the specified parent element.
 */
ArchimateImporter.prototype.addElement = function(viewElement, parentElement) {

  var shape,
      translate = this._translate,
      hidden;

  var parentIndex;

  logger.log('addElement(viewElement, parentElement):');
  logger.log({ viewElement, parentElement });

  if (isAny(viewElement, [ 'archimate:Node' ])) {

    var isFrame = is(viewElement.elementRef, 'archimate:Group');

    hidden = parentElement && (parentElement.hidden || parentElement.collapsed);

    var bounds = {x: viewElement.x, y: viewElement.y, width: viewElement.w, height: viewElement.h} ;


    var attrs = {
      hidden: hidden,
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
      isFrame: isFrame,
      // if viewElement is NOTE, elementRef is undefined
      type: viewElement.elementRef && viewElement.elementRef.type || viewElement.$type,
      businessObject: viewElement
    };

    /*TODO
    if (viewElement.type (xsi:Type) == 'Label') {
      // ==> deal with a label objet which has no elementRef and is only display text in his <label> tag
    } else {
      // if the elementRef.$type is a 'archimate:BaseElement' so, the type to transfer must be the elementRef.type in order to drawing 
      // good shape in ArchimateRenderer
      // either we must pass the elementRef.type (ex. BusinessActor)
    */
    /*  
    var eleData = assign({
      type: viewElement.elementRef.type,
      businessObject: viewElement
    }, attrs);
    */

    // call ElementFactory.prototype.create = function(elementType, attrs)
    // elementType: viewElemet.elementRef.type (type attribute of <BaseElement>)
    shape = this._elementFactory.createShape(attrs);

    logger.log('call _canvas.addShape(shape):');
    logger.log(shape);

    this._canvas.addShape(shape, parentElement, parentIndex);

  } else {
    logger.log('unknown viewElement');
    throw new Error(translate('unknown viewElement {viewElement}', {
      viewElement: elementToString(viewElement),
    }));
  }

  // (optional) LABEL
  if (isLabelExternal(shape) && getLabel(shape)) {
    logger.log('add a label');
    this.addLabel(viewElement.elementRef, shape);
  }

  logger.log('fire event \'elementRef.added\'');
  this._eventBus.fire('elementRef.added', { element: shape });

  return shape;
};

/**
 * Add a <Connection> element to the canvas between source and target.
 */
 ArchimateImporter.prototype.addConnection = function(viewElement) {

  logger.log('addConnection(viewElement):');
  logger.log(viewElement);

  var waypoints = collectWaypoints(viewElement.waypointsNode.waypoints);
  
  logger.log(waypoints);

  var translate = this._translate,
    sourceShape = this._elementRegistry.get(viewElement.source.id),
    targetShape = this._elementRegistry.get(viewElement.target.id);

    logger.log(this._elementRegistry);
    logger.log(sourceShape);
    logger.log(targetShape);

  if (is(viewElement, 'archimate:Connection') && sourceShape && targetShape) {

    /* see comment below
    var type;
    if (viewElement.type === 'Relationship') {
      type = viewElement.relationshipRef.type;
    } else {
      type = viewElement.type;
    }*/

    var attrs = {
      hidden: false,
      source: sourceShape,
      target: targetShape,
      waypoints: waypoints,
      // if connection has a relationshipRef ('Relationship' type)
      // get type from relationship reference ('Association', 'Aggregation",...)
      // else must be a 'Line' type connection
      type: viewElement.relationshipRef && viewElement.relationshipRef.type || viewElement.type,
      businessObject: viewElement
    };

    var connection = this._elementFactory.createConnection(attrs);

    logger.log('call _canvas.addConnection(connection):');
    logger.log(connection);

    this._canvas.addConnection(connection);

    logger.log('fire event \'elementRef.added\'');
    this._eventBus.fire('elementRef.added', { element: connection });

    return connection;

  } else {
    logger.log('unknown connection or undefined source or target');
    throw new Error(translate('unknown connection {viewElement} or undefined source or target', {
      viewElement: elementToString(viewElement),
    }));
  }

 }

/**
 * Attach the boundary element to the given host
 *
 * @param {ModdleElement} boundarySemantic
 * @param {djs.model.Base} boundaryElement
 */
ArchimateImporter.prototype._attachBoundary = function(boundarySemantic, boundaryElement) {
  var translate = this._translate;
  var hostSemantic = boundarySemantic.attachedToRef;

  if (!hostSemantic) {
    throw new Error(translate('missing {semantic}#attachedToRef', {
      semantic: elementToString(boundarySemantic)
    }));
  }

  var host = this._elementRegistry.get(hostSemantic.id),
      attachers = host && host.attachers;

  if (!host) {
    throw notYetDrawn(translate, boundarySemantic, hostSemantic, 'attachedToRef');
  }

  // wire element.host <> host.attachers
  boundaryElement.host = host;

  if (!attachers) {
    host.attachers = attachers = [];
  }

  if (attachers.indexOf(boundaryElement) === -1) {
    attachers.push(boundaryElement);
  }
};


/**
 * add label for an element
 */
ArchimateImporter.prototype.addLabel = function(semantic, element) {
  var bounds,
      text,
      label;

  // bounds = getExternalLabelBounds(semantic, element);
  bounds = getExternalLabelBounds(element);

  text = getLabel(element);

  if (text) {

    // get corrected bounds from actual layouted text
    bounds = this._textRenderer.getExternalLabelBounds(bounds, text);
  }

  label = this._elementFactory.createLabel(elementData(semantic, {
    id: semantic.id + '_label',
    labelTarget: element,
    type: 'label',
    hidden: element.hidden || !getLabel(element),
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height)
  }));

  return this._canvas.addShape(label, element.parent);
};

/**
 * Return the drawn connection end based on the given side.
 *
 * @throws {Error} if the end is not yet drawn
 */
ArchimateImporter.prototype._getEnd = function(semantic, side) {

  var element,
      refSemantic,
      translate = this._translate;

  refSemantic = semantic[side + 'Ref'];


  element = refSemantic && this._getElement(refSemantic);

  if (element) {
    return element;
  }

  if (refSemantic) {
    throw notYetDrawn(translate, semantic, refSemantic, side + 'Ref');
  } else {
    throw new Error(translate('{semantic}#{side} Ref not specified', {
      semantic: elementToString(semantic),
      side: side
    }));
  }
};

ArchimateImporter.prototype._getSource = function(semantic) {
  return this._getEnd(semantic, 'source');
};

ArchimateImporter.prototype._getTarget = function(semantic) {
  return this._getEnd(semantic, 'target');
};


ArchimateImporter.prototype._getElement = function(semantic) {
  return this._elementRegistry.get(semantic.id);
};

function collectWaypoints(waypointsModdle) {

  logger.log(waypointsModdle);


  if (waypointsModdle) {
    return map(waypointsModdle, function(waypoint) {
      var position = { x: waypoint.x, y: waypoint.y };

      // return assign(position);
      return assign({ original: position }, position);
    });
  }
}

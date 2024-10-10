import inherits from 'inherits-browser';

import {
  is,
} from '../../util/ModelUtil';

import { logger } from "../../util/Logger";

import { ARCHIMATE_NODE } from '../../metamodel/Concept';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

/**
 * A handler responsible for updating the underlying XML once changes on the diagram happen
 */
export default function NodeUpdater(eventBus, archimateFactory, modeling, canvas) {

  CommandInterceptor.call(this, eventBus);

  this._modeling = modeling;
  this._archimateFactory = archimateFactory;
  this._canvas = canvas;

  var self = this;

  // update root /////////////////////////////////////////////////////////
  function updateRoot(event) {
    logger.log('updateRoot(event)');
    logger.log(event);

   /* var context = event.context,
        oldRoot = context.oldRoot,
        children = oldRoot.children;

    forEach(children, function(child) {
      if (is(child, ARCHIMATE_ELEMENT)) {
        self.updateParent(child);
      }
    });*/
  }

  this.executed([
    'canvas.updateRoot'
  ], updateRoot);

  this.reverted([
    'canvas.updateRoot'
  ], updateRoot);

  // end update root /////////////////////////////////////////////////////////

 
  // update bounds /////////////////////////////////////////////////////////
  function updateBounds(context) {
    var shape = context.shape;

    // exclude labels because they're handled separately during shape.changed
    if (shape.type === 'label') {
      return;
    }

    self.updateBounds(shape);
  }

  this.executed([
    'shape.move',
    'shape.create',
    'shape.resize'
  ], ifNode(function(event) {
    updateBounds(event.context);
  }));

  this.reverted([
    'shape.move',
    'shape.create',
    'shape.resize'
  ], ifNode(function(event) {
    updateBounds(event.context);
  }));

  // end update bounds /////////////////////////////////////////////////////////

  // create style and elementRef node //////////////////////////////////////////////////////
  function createElementRef(context) {

    self.createElementRef(context.shape);
  }

  function createStyle(context) {

    self.createStyle(context.shape);
  }

  this.postExecute([
    'shape.create',
  ], ifNode(function(event) {
    createStyle(event.context);
    createElementRef(event.context);
  }));

  // end create style and elementRef node /////////////////////////////////////////////////////////

  // Handle labels separately. This is necessary, because the label bounds have to be updated
  // every time its shape changes, not only on move, create and resize.
  eventBus.on('shape.changed', function(event) {
    if (event.element.type === 'label') {
      updateBounds({ context: { shape: event.element } });
    }
  });

}

inherits(NodeUpdater, CommandInterceptor);

NodeUpdater.$inject = [
  'eventBus',
  'archimateFactory',
  'modeling',
  'canvas'
];

// implementation //////////////////////

NodeUpdater.prototype.updateBounds = function(shape) {

  var node = shape.businessObject;

  node.x = shape.x;
  node.y = shape.y;
  node.h = shape.height;
  node.w = shape.width;

};

NodeUpdater.prototype.createStyle = function(shape) {
  logger.log('create style for node');
  logger.log(shape);

  var modeling = this._modeling;
  modeling.updateStyle(shape);

};

NodeUpdater.prototype.createElementRef =  function(shape) {
  logger.log('create elementRef for node');
  logger.log(shape);

  var newElementRef = shape.newElementRef;
  if (shape.event) {
    delete shape.event;
  }
  if (shape.newElementRef) {
    delete shape.newElementRef;
  }

  var modeling = this._modeling;
  modeling.replaceElementRef(shape, newElementRef);

};

// helpers //////////////////////

/**
 * Make sure the event listener is only called
 * if the touched element is an Archimate Node element.
 *
 * @param  {Function} fn
 * @return {Function} guarded function
 */
function ifNode(fn) {

  return function(event) {
    logger.log(event);
    var element = event.context.shape;

    if (element && is(element.businessObject, ARCHIMATE_NODE)) {
      fn(event);
    }
  };
}

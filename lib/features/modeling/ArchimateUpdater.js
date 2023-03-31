import {
  forEach
} from 'min-dash';

import inherits from 'inherits-browser';

import {
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';

import {
  Label
} from 'diagram-js/lib/model';

import {
  is,
  isAny,
  getViewElement,
  NOTE,
} from '../../util/ModelUtil';

import { logger } from "../../util/Logger";

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


/**
 * A handler responsible for updating the underlying XML + DI
 * once changes on the diagram happen
 */
export default function ArchimateUpdater(
    eventBus, archimateFactory, connectionDocking,
    translate) {

  CommandInterceptor.call(this, eventBus);

  this._archimateFactory = archimateFactory;
  this._translate = translate;
  this._connectionDocking = connectionDocking;

  var self = this;


  // update parent /////////////////////////////////////////////////////////
  function updateParent(event) {
    var context = event.context;

    logger.log('updateParent(event)');
    logger.log(event);

    self.updateParent(context.shape || context.connection, context.parent);
  }

  function reverseUpdateParent(event) {
    var context = event.context;

    var element = context.shape || context.connection,

        // oldParent is the (old) new parent, because we are undoing
        oldParent = context.parent || context.newParent;

    self.updateParent(element, oldParent);
  }

  this.executed([
    'shape.move',
    'shape.create'//,
//    'shape.delete'
  ], ifArchimate(function(event) {

    // exclude NOTE 
    if (event.context.shape.type === NOTE) {
      return;
    }
    updateParent(event);

  }));

  this.reverted([
    'shape.move',
    'shape.create',
    'shape.delete'
  ], ifArchimate(function(event) {

    // exclude NOTE
    if (event.context.shape.type === NOTE) {
      return;
    }
    reverseUpdateParent(event);

  }));
  // end update parent /////////////////////////////////////////////////////////


  // delete view element /////////////////////////////////////////////////////////
  function deleteViewElement(event) {
    var context = event.context;

    logger.log('deleteViewElement(event)');
    logger.log(event);

    self.deleteViewElement(context.shape);
  }

  function reverseDeleteViewElement(event) {
    /*
    var context = event.context;

    var element = context.shape || context.connection,

        // oldParent is the (old) new parent, because we are undoing
        oldParent = context.parent || context.newParent;

    self.updateParent(element, oldParent);
    */
  }

  this.executed([
    'shape.delete'
  ], ifArchimate(deleteViewElement));
/*
  this.reverted([
    'shape.delete'
  ], ifArchimate(reverseDeleteViewElement));
*/
  // end delete shape /////////////////////////////////////////////////////////


  // update root /////////////////////////////////////////////////////////
  function updateRoot(event) {
    var context = event.context,
        oldRoot = context.oldRoot,
        children = oldRoot.children;

    logger.log('updateRoot(event)');
    logger.log(event);

    forEach(children, function(child) {
      if (is(child, 'archimate:BaseElement')) {
        self.updateParent(child);
      }
    });
  }

  this.executed([
    'canvas.updateRoot'
  ], updateRoot);

  this.reverted([
    'canvas.updateRoot'
  ], updateRoot);

  // end update root /////////////////////////////////////////////////////////


  // update bounds /////////////////////////////////////////////////////////
  function updateBounds(e) {
    var shape = e.context.shape;

    if (!isAny(shape.businessObject, ['archimate:Node'])) {
      return;
    }

    self.updateBounds(shape);
  }

  this.executed([
    'shape.move',
    'shape.create',
    'shape.resize'
  ], ifArchimate(function(event) {

    // exclude labels because they're handled separately during shape.changed
    if (event.context.shape.type === 'label') {
      return;
    }

    updateBounds(event);

  }));

  this.reverted([
    'shape.move',
    'shape.create',
    'shape.resize'
  ], ifArchimate(function(event) {

    // exclude labels because they're handled separately during shape.changed
    if (event.context.shape.type === 'label') {
      return;
    }

    updateBounds(event);

  }));

  // end update bounds & color /////////////////////////////////////////////////////////

  
  // crop connection /////////////////////////////////////////////////////////
/*
  function cropConnection(event) {

    var context = event.context;

    self.cropConnection(context);

  }

  this.executed([
    'connection.create',
    'connection.layout'
  ], cropConnection); //, true);

  this.reverted([
    'connection.layout'
  ], function(context) {
    delete context.cropped;
  }); //, true);

  // End crop connection /////////////////////////////////////////////////////////


  // update connection waypoints /////////////////////////////////////////////////////////

  function updateConnectionWaypoints(event) {
    var context = event.context;

    self.updateConnectionWaypoints(context);
  }

  this.executed([
    'connection.create',
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints'
  ], updateConnectionWaypoints); //, true);

  this.reverted([
    'connection.create',
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints'
  ], updateConnectionWaypoints); //, true);
*/
   // end update connection waypoints /////////////////////////////////////////////////////////
 

  // Handle labels separately. This is necessary, because the label bounds have to be updated
  // every time its shape changes, not only on move, create and resize.
  eventBus.on('shape.changed', function(event) {
    if (event.element.type === 'label') {
      updateBounds({ context: { shape: event.element } });
    }
  });

}

inherits(ArchimateUpdater, CommandInterceptor);

ArchimateUpdater.$inject = [
  'eventBus',
  'archimateFactory',
  'connectionDocking',
  'translate'
];


// implementation //////////////////////

ArchimateUpdater.prototype.updateAttachment = function(context) {

  var shape = context.shape,
      businessObject = shape.businessObject,
      host = shape.host;

  businessObject.attachedToRef = host && host.businessObject;
};

ArchimateUpdater.prototype.updateParent = function(element, oldParent) {

  logger.log('updateParent(element, oldParent)');
  logger.log({ element, oldParent });

  // do not update label parent
  if (element instanceof Label) {
    return;
  }

  var viewElement = element.businessObject,
    newViewElementParent = element.parent.businessObject;

  this.updateViewElementParent(viewElement, newViewElementParent);

  // var elementsNode = parent.modelRef.elementsNode;

  // element.businessObject.elementRef.$parent = parent.modelRef.elementsNode;

  var elementRef = element.businessObject.elementRef,
    newElementRefParent = element.parent.modelRef.elementsNode;

  if (!newElementRefParent) {
    logger.log('no archimate:Elements found in model, create one');
    newElementRefParent = this.getModdleElement('archimate:Elements', { baseElements: [] });
    newElementRefParent.$parent = parent.modelRef;
  }

  this.updateElementRefParent(elementRef, newElementRefParent);

  /*
  var parentShape = element.parent;

  var elementRef = getElementRef(element),
      viewElement = getViewElement(element),
      parentElementRef = parentShape && getElementRef(parentShape),
      newParent = parentElementRef && getViewElement(parentShape);

  this.updateElementRefParent(elementRef, parentElementRef);

 
*/
};

ArchimateUpdater.prototype.deleteViewElement = function(element) {

  logger.log('deleteViewElement(element)');
  logger.log(element);

  // do not update label parent
  if (element instanceof Label) {
    return;
  }

  var viewElement = element.businessObject,
    viewElements = viewElement.$parent.get('viewElements');

  collectionRemove(viewElements, viewElement);

};

ArchimateUpdater.prototype.updateConnectionWaypoints = function(context) {
  var archimateFactory = this._archimateFactory;

  logger.log('updateConnectionWaypoints(context)');
  logger.log(context);

  var connection = context.connection,
      viewElement = connection.businessObject;

  viewElement.waypointsNode = archimateFactory.createWaypoints(connection.waypoints);
  viewElement.waypointsNode.$parent = viewElement;

  viewElement.waypointsNode.waypoints
    .map(function(waypoint) {
      waypoint.$parent = viewElement.waypointsNode;

      return waypoint;
    });

};

ArchimateUpdater.prototype.updateBounds = function(shape) {

  logger.log('update bounds in ArchimateUpdater');
  logger.log(shape);

  var node = getViewElement(shape);

  node.x = shape.x;
  node.y = shape.y;
  node.h = shape.height;
  node.w = shape.width;

};

ArchimateUpdater.prototype.updateViewElementParent = function(viewElement, newParent) {

  logger.log('updateViewElementParent(viewElement, newParent)');
  logger.log({ viewElement, newParent });

  if (newParent && !is(newParent, 'archimate:View')) {
    logger.log('if statement {newParent && !is(newParent, \'archimate:View\')} true');
    newParent = newParent.$parent;
  }

  if (viewElement.$parent === newParent) {
    logger.log('if statement {viewElement.$parent === newParent} true');
    return;
  }

  var viewElements = newParent.get('viewElements');

  if (newParent) {
    viewElements.push(viewElement);
    viewElement.$parent = newParent;
  } else {
    collectionRemove(viewElements, viewElement);
    viewElement.$parent = null;
  }
};

ArchimateUpdater.prototype.updateElementRefParent = function(elementRef, newParent) {
  //businessObject, newParent, visualParent) {

  logger.log('updateElementRefParent(elementRef, newParent)');
  logger.log({ elementRef, newParent });

  var translate = this._translate;

  if (elementRef.$parent === newParent) {
    return;
  }

  if (!is(elementRef, 'archimate:BaseElement')) {
    throw new Error(translate(
      'no parent for {element} in {parent}',
      {
        element: elementRef,
        parent: newParent
      }
    ));
  }

  var baseElements = newParent.get('baseElements');

  if (newParent) {
    baseElements.push(elementRef);
    elementRef.$parent = newParent;
  } else {
    collectionRemove(baseElements, elementRef);
    elementRef.$parent = null;
  }

  /* if (visualParent) {
    var diChildren = visualParent.get(containment);

    collectionRemove(children, businessObject);

    if (newParent) {

      if (!diChildren) {
        diChildren = [];
        newParent.set(containment, diChildren);
      }

      diChildren.push(businessObject);
    }
  }*/
};

ArchimateUpdater.prototype.cropConnection = function(context) {

  var connectionDocking = this._connectionDocking;

  logger.log('cropConnection(context)');
  logger.log(context);

  var connection = context.connection,
    cropped = context.cropped;

  if (!cropped) {
    connection.waypoints = connectionDocking.getCroppedWaypoints(connection);
    context.cropped = true;
  }
}


// helpers //////////////////////

ArchimateUpdater.prototype.getModdleElement = function (moddleElementType, attrs) {

  return this._archimateFactory.create(moddleElementType, attrs);
};

/**
 * Make sure the event listener is only called
 * if the touched element is an Archimate element.
 *
 * @param  {Function} fn
 * @return {Function} guarded function
 */
function ifArchimate(fn) {

  return function(event) {

    var context = event.context,
        element = context.shape || context.connection,
        viewElement = getViewElement(element);

    if (is(viewElement, 'archimate:ViewElement')) {
      fn(event);
    }
  };
}

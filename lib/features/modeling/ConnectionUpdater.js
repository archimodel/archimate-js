import {
  assign,
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
  getViewElement,
} from '../../util/ModelUtil';

import { logger } from "../../util/Logger";

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { COLOR_LAYER_MAP, BLACK_SHADOW_RGBA } from '../../draw/ArchimateRendererUtil';
import { DEFAULT_NOTE_COLOR_RGBA } from '../../draw/ArchimateRenderer';
import { isAny } from './util/ModelingUtil';

/**
 * A handler for updating the underlying XML 
 * once changes on connection happen
 */
export default function ConnectionUpdater(
    eventBus, archimateFactory, connectionDocking,
    translate) {

  CommandInterceptor.call(this, eventBus);

  this._archimateFactory = archimateFactory;
  this._translate = translate;
  this._connectionDocking = connectionDocking;

  var self = this;

  // update color /////////////////////////////////////////////////////////
  /*function updateColors(e) {
    var shape = e.context.shape;
    var viewElement = getViewElement(shape);

    //if (!is(shape, 'archimate:BaseElement')) {
    if (!isAny(viewElement, ['archimate:Node', 'archimate:Note'])) {
      return;
    }

    self.updateColors(shape);
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
    updateColors(event);

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
    updateColors(event);
  }));
*/
  // end update bounds & color /////////////////////////////////////////////////////////

  
  // crop connection /////////////////////////////////////////////////////////

  function cropConnection(event) {

    var context = event.context;

    self.cropConnection(context);

  }

  this.executed([
    'connection.create',
    'connection.layout'
  ], cropConnection);

  this.reverted([
    'connection.layout'
  ], function(context) {
    delete context.cropped;
  });

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

   // end update connection waypoints /////////////////////////////////////////////////////////
 
}

inherits(ConnectionUpdater, CommandInterceptor);

ConnectionUpdater.$inject = [
  'eventBus',
  'archimateFactory',
  'connectionDocking',
  'translate'
];


// implementation //////////////////////

ConnectionUpdater.prototype.updateConnectionWaypoints = function(context) {
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
/*
ArchimateUpdater.prototype.updateColors = function(shape) {

  logger.log('updateColors(shape)');
  logger.log(shape);

  var node = getViewElement(shape);
  var style = node.style,
    fillColor,
    lineColor;

  if (!style) {
    style = this.getModdleElement('archimate:Style');
    node.style = style;
  }

  lineColor = style.lineColor;
  if (!lineColor) {
    lineColor = this.getModdleElement('archimate:LineColor', BLACK_SHADOW_RGBA);
    style.lineColor = lineColor;
  }

};
*/

ConnectionUpdater.prototype.cropConnection = function(context) {

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

ConnectionUpdater.prototype.getModdleElement = function (moddleElementType, attrs) {

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

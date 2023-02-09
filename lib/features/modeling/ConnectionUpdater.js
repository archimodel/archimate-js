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
import { RELATIONSHIP_ACCESS, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_INFLUENCE } from '../../metamodel/Concept';

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

  // update connection archimate objects /////////////////////////////////////////////////////////

  function updateConnectionObjects(event) {
    logger.log(event);
    var context = event.context;

    if (context.connection.type === 'Relationship') {
      return;
    }

    self.updateConnectionObjects(context);
  }

  this.executed([
    'connection.create',
    'connection.move',
    'connection.reconnect',
  ], updateConnectionObjects); //, true);

  this.reverted([
    'connection.create',
    'connection.move',
    'connection.reconnect',
  ], updateConnectionObjects); //, true);

  // end update connection archimate objects /////////////////////////////////////////////////////////

  // delete connection /////////////////////////////////////////////////////////

  function deleteConnectionObjects(event) {
    logger.log(event);
    var context = event.context;

    var connection = context.connection,
        archimateObject = connection.businessObject,
        view = context.parent.businessObject;

        var viewElements = view.get('viewElements');

        collectionRemove(viewElements, archimateObject);
  }

  this.executed([
    'connection.delete',
  ], deleteConnectionObjects); //, true);

  /*
  this.reverted([
    'connection.delete',
  ], deleteConnectionObjects); //, true);
  */
   // end delete connection /////////////////////////////////////////////////////////

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
  logger.log(context);
  
  var archimateFactory = this._archimateFactory;

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

ConnectionUpdater.prototype.updateConnectionObjects = function(context) {
  logger.log(context);

  var archimateFactory = this._archimateFactory;

  var connection = context.connection,
  archimateObject = connection.businessObject,
  source = connection.source, //context.source,
  target = connection.target, //context.target,
  view = connection.parent.businessObject,
  relationshipsNode = connection.parent.modelRef.relationshipsNode;

  // update connection businessObject with correct source 
  // and target businessObject (Moddle object)
  archimateObject.source = source.businessObject;
  archimateObject.target = target.businessObject;

  if (archimateObject.type === 'Relationship') {
    var relationship = archimateObject.relationshipRef;

    if (!relationship) {
      relationship = archimateFactory.createRelationship(connection.type);
    }

    relationship.type = connection.type;
    relationship.source = source.businessObject.elementRef;
    relationship.target = target.businessObject.elementRef;

    delete relationship.modifier;
    delete relationship.accessType;
    delete relationship.isDirected;

    if (connection.type === RELATIONSHIP_INFLUENCE) {
      relationship.modifier = connection.modifier;
    }
    
    if (connection.type === RELATIONSHIP_ACCESS) {
      relationship.accessType = connection.accessType;
    } 

    if (connection.type === RELATIONSHIP_ASSOCIATION) {
      relationship.isDirected = connection.isDirected;
    }

    if (!relationshipsNode) {
      relationshipsNode = archimateFactory.create('archimate:Relationships', { relationships: [] });
      connection.parent.modelRef.relationshipsNode = relationshipsNode;
      relationshipsNode.$parent = connection.parent.modelRef;
    }

    relationship.$parent = relationshipsNode;

    var relationships = relationshipsNode.get('relationships');
    if (!relationships.find(x => x.id === relationship.id)) {
      relationships.push(relationship);
    }
    archimateObject.relationshipRef = relationship;

  }

  archimateObject.$parent = view;

  var viewElements = view.get('viewElements');
  if (!viewElements.find(x => x.id === archimateObject.id)) {
    viewElements.push(archimateObject);
  }

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
  logger.log(context);

  var connectionDocking = this._connectionDocking;

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

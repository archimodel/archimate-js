import inherits from 'inherits-browser';

import { remove as collectionRemove } from 'diagram-js/lib/util/Collections';
import { Connection } from 'diagram-js/lib/model';
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is, CONNECTION_RELATIONSHIP } from '../../util/ModelUtil';
import { logger } from "../../util/Logger";
import { RELATIONSHIP_ACCESS, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_INFLUENCE } from '../../metamodel/Concept';

/**
 * A handler for updating the underlying XML 
 * once changes on connection happen
 */
export default function ConnectionUpdater(
    eventBus, archimateFactory, connectionDocking,modeling,
    translate) {

  CommandInterceptor.call(this, eventBus);

  this._archimateFactory = archimateFactory;
  this._translate = translate;
  this._connectionDocking = connectionDocking;
  this._modeling = modeling;

  var self = this;

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

    if (context.connection.type === CONNECTION_RELATIONSHIP) {
      return;
    }

    // When a connection with incoming or outgoing connections moves, 
    // update hints of the incoming or outgoing connection with a connectionEnd 
    // equal to the docking point calculated with 
    if (context.connection.target instanceof Connection || context.connection.source instanceof Connection) {
      if (context.hints) {
        logger.log("update connectionEnd coords");
        context.hints.connectionEnd = {...context.dockingOrPoints};
        context.hints.connectionStart = false;
      }
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
  'modeling',
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

  if (archimateObject.type === CONNECTION_RELATIONSHIP) {
    var relationship = archimateObject.relationshipRef;

    if (!relationship) {
      relationship = archimateFactory.createRelationship(connection.type);
    }

    relationship.type = connection.type;
    if (is(source.businessObject, 'archimate:Node')) {
      relationship.source = source.businessObject.elementRef;
    }
    if (is(source.businessObject, 'archimate:Connection')) {
      relationship.source = source.businessObject.relationshipRef;
    }
    if (is(target.businessObject, 'archimate:Node')) {
      relationship.target = target.businessObject.elementRef;
    }
    if (is(target.businessObject, 'archimate:Connection')) {
      relationship.target = target.businessObject.relationshipRef;
    }

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
        element = context.shape || context.connection;

    if (is(element.businessObject, 'archimate:ViewElement')) {
      fn(event);
    }
  };
}

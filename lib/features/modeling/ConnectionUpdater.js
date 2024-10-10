import inherits from 'inherits-browser';

import { remove as collectionRemove } from 'diagram-js/lib/util/Collections';
import { isConnection } from 'diagram-js/lib/util/ModelUtil';
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


import { is, CONNECTION_RELATIONSHIP, CONNECTION_LINE } from '../../util/ModelUtil';
import { logger } from "../../util/Logger";
import { ARCHIMATE_CONNECTION, ARCHIMATE_NODE, ARCHIMATE_RELATIONSHIP, ARCHIMATE_RELATIONSHIPS, ARCHIMATE_VIEW_ELEMENT, RELATIONSHIP_ACCESS, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_INFLUENCE } from '../../metamodel/Concept';

/**
 * A handler for updating the underlying XML 
 * once changes on connection happen
 */
export default function ConnectionUpdater(
    eventBus, archimateFactory, connectionDocking,modeling,
    translate, canvas) {

  CommandInterceptor.call(this, eventBus);

  this._archimateFactory = archimateFactory;
  this._translate = translate;
  this._connectionDocking = connectionDocking;
  this._modeling = modeling;
  this._canvas = canvas;

  var self = this;

  // crop connection /////////////////////////////////////////////////////////

  function cropConnection(context) {

    self.cropConnection(context);
  }

  this.executed([
    'connection.create',
    'connection.layout'
  ], ifConnection(function(event) {
    cropConnection(event.context);
  }));

  this.reverted([
    'connection.layout'
  ], ifConnection(function(event) {
    delete event.context.cropped;
  }));

  // End crop connection /////////////////////////////////////////////////////////

  // create connection /////////////////////////////////////////////////////////

  function createConnection(context) {
      self.createConnection(context.connection);
  }

  this.executed([
    'connection.create'
  ], ifConnection(function(event) {
    createConnection(event.context)
  }));

  this.reverted([
    'connection.create'
  ], ifConnection(function(event) {
    deleteConnection(event.context)
  }));

  // End create connection /////////////////////////////////////////////////////////

  // update style connection /////////////////////////////////////////////////////////

  function updateStyle(context) {
    self.updateStyle(context.connection);
  }

  this.postExecute([
    'connection.create'
  ], ifConnection(function(event) {
    updateStyle(event.context)
  }));

  // End update style connection /////////////////////////////////////////////////////////

  // remove nested connection ////////////////////////////////////////////////////
  
  function changedConnection(event) {
    var connection = event.element;

    self.updateConnectionWaypoints(connection);

    if (connection.type !== CONNECTION_RELATIONSHIP && connection.target.host && connection.target.host === connection.source) {
      self.removeNestedConnection( {connection: connection});
    }
  }

  eventBus.on('connection.changed', ifConnection(function(event) {
    changedConnection(event)
  }));

  // End remove nested connection ////////////////////////////////////////////////////

  // update connection waypoints /////////////////////////////////////////////////////////

  function updateConnectionWaypoints(context) {

    // When a connection with incoming or outgoing connections moves, 
    // update hints of the incoming or outgoing connection with a connectionEnd 
    // equal to the docking point calculated with 
    // if (context.connection.target instanceof Connection || context.connection.source instanceof Connection) {
    if (isConnection(context.connection.target) || isConnection(context.connection.source)) {
      if (context.hints) {
        logger.log("update connectionEnd coords");
        context.hints.connectionEnd = {...context.dockingOrPoints};
        context.hints.connectionStart = false;
      }
    }

    self.updateConnectionWaypoints(context.connection);
  }

  this.executed([
    'connection.create',
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints'
  ], ifConnection(function (event) {
      updateConnectionWaypoints(event.context);
  }));

  this.reverted([
    'connection.create',
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints'
  ], ifConnection(function (event) {
      updateConnectionWaypoints(event.context);
  }));

  // end update connection waypoints /////////////////////////////////////////////////////////

  // update connection archimate relationship /////////////////////////////////////////////////////////

  function replaceRelationshipRef(context) {
    var type = context.connection.type;
    if (type === CONNECTION_RELATIONSHIP || type === CONNECTION_LINE) {
      return;
    }

    context.connection.business
    self.replaceRelationshipRef(context.connection);
  }

  this.postExecute([
    'connection.create',
    'connection.reconnect'
  ], ifConnection(function (event) {
    replaceRelationshipRef(event.context);
  }));

  this.reverted([
    'connection.create',
    'connection.move',
    'connection.reconnect',
  ], ifConnection(function (event) {
    //replaceRelationshipRef(event.context);
  }));

  // end update connection archimate relationship /////////////////////////////////////////////////////////

  // delete connection /////////////////////////////////////////////////////////

  function deleteConnection(context) {
    var connection = context.connection,
        archimateConnection = connection.businessObject,
        viewElements = context.parent.businessObject.viewElements;

    collectionRemove(viewElements, archimateConnection);
  }

  function revertDeleteConnectionObjects(context) {
    self.updateConnectionObjects(context);
  }

  this.executed([
    'connection.delete',
  ], ifConnection(function (event) {
    deleteConnection(event.context);
   }));

  
  this.reverted([
    'connection.delete',
  ], ifConnection(function (event) {
    revertDeleteConnectionObjects(event.context);
   }));
  
   // end delete connection /////////////////////////////////////////////////////////

}

inherits(ConnectionUpdater, CommandInterceptor);

ConnectionUpdater.$inject = [
  'eventBus',
  'archimateFactory',
  'connectionDocking',
  'modeling',
  'translate',
  'canvas'
];

// implementation //////////////////////

ConnectionUpdater.prototype.removeNestedConnection = function(context) {
  logger.log(context);

  var modeling = this._modeling;

  var connections = [ context.connection ]

  modeling.removeElements(connections);

}

ConnectionUpdater.prototype.updateStyle = function(connection) {
  logger.log('update Style');
  logger.log(connection);

  var modeling = this._modeling;

  modeling.updateStyle([connection]);

};

ConnectionUpdater.prototype.updateConnectionWaypoints = function(connection) {
  
  var archimateFactory = this._archimateFactory;

  var viewElement = connection.businessObject;

  viewElement.waypointsNode = archimateFactory.createWaypoints(connection.waypoints);
  viewElement.waypointsNode.$parent = viewElement;

  viewElement.waypointsNode.waypoints
    .map(function(waypoint) {
      waypoint.$parent = viewElement.waypointsNode;

      return waypoint;
    });
};

ConnectionUpdater.prototype.createConnection = function(connection) {

    var viewElement = connection.businessObject,
      view = connection.parent.businessObject,
      viewElements = view.viewElements;

    if (!viewElements.find(x => x.id === connection.businessObject.id)) {
      viewElements.push(connection.businessObject);
    }
    viewElement.$parent = view;

    viewElement.source = connection.source.businessObject;
    viewElement.target = connection.target.businessObject;

    if (connection.type === CONNECTION_LINE) {
      viewElement.label = connection.text;
    } else {
      viewElement.label = connection.name;
    }
};

ConnectionUpdater.prototype.replaceRelationshipRef = function(connection) {

  var modeling = this._modeling;
  modeling.replaceRelationshipRef(connection);

}

ConnectionUpdater.prototype.updateConnectionObjects = function(context) {
  logger.log(context);
  
  var canvas = this._canvas;
  var archimateFactory = this._archimateFactory;

  var connection = context.connection,
  source = connection.source || context.source,
  target = connection.target || context.target,
  view = canvas._rootElement.businessObject, // context.parent.businessObject || context.newParent.businessObject, // connection.parent.businessObject,
  relationshipsNode = canvas._rootElement.modelRef.relationshipsNode;

  // update connection businessObject with correct source 
  // and target businessObject (Moddle object)
  connection.businessObject.source = source.businessObject;
  connection.businessObject.target = target.businessObject;

  if (connection.businessObject.type === CONNECTION_RELATIONSHIP) {
    var relationship = connection.businessObject.relationshipRef;

    if (!relationship) {
      relationship = archimateFactory.create(ARCHIMATE_RELATIONSHIP, {type: connection.type});
    }

    relationship.name = connection.name;

    relationship.type = connection.type;
    if (is(source.businessObject, ARCHIMATE_NODE)) {
      relationship.source = source.businessObject.elementRef;
    }
    if (is(source.businessObject, ARCHIMATE_CONNECTION)) {
      relationship.source = source.businessObject.relationshipRef;
    }
    if (is(target.businessObject, ARCHIMATE_NODE)) {
      relationship.target = target.businessObject.elementRef;
    }
    if (is(target.businessObject, ARCHIMATE_CONNECTION)) {
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
      relationshipsNode = archimateFactory.create(ARCHIMATE_RELATIONSHIPS, { relationships: [] });
      connection.parent.modelRef.relationshipsNode = relationshipsNode;
      relationshipsNode.$parent = connection.parent.modelRef;
    }

    relationship.$parent = relationshipsNode;

    var relationships = relationshipsNode.get('relationships');
    if (!relationships.find(x => x.id === relationship.id)) {
      relationships.push(relationship);
    }
    connection.businessObject.relationshipRef = relationship;

  }

  connection.businessObject.$parent = view;

  var viewElements = view.get('viewElements');
  if (!viewElements.find(x => x.id === connection.businessObject.id)) {
    viewElements.push(connection.businessObject);
  }

};

ConnectionUpdater.prototype.cropConnection = function(context) {

  var connectionDocking = this._connectionDocking;

  var connection = context.connection,
    cropped = context.cropped;

  if (!cropped) {
    connection.waypoints = connectionDocking.getCroppedWaypoints(connection);
    context.cropped = true;
  }
}

// helpers //////////////////////

/**
 * Make sure the event listener is only called
 * if the touched element is an Archimate element.
 *
 * @param  {Function} fn
 * @return {Function} guarded function
 */
function ifConnection(fn) {

  return function(event) {
    logger.log(event);
    var element = event.context && event.context.connection || event.element;

    if (element && is(element.businessObject, ARCHIMATE_CONNECTION)) {
      fn(event);
    }
  };
}

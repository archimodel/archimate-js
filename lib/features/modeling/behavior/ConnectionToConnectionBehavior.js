import {
  forEach,
  assign
} from 'min-dash';

import inherits from 'inherits-browser';

import { getConnectionAdjustment as getConnectionAnchorPoint } from './util/ConnectionLayoutUtil';
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { logger } from "../../../util/Logger";

/**
 * If there is a connection between a shape and another connection, 
 * update the endpoint of the incoming connection or the start point of
 * the outgoing connection when the connection moves voluntarily or not
 * (the shape attached to the connection moves and thus moves 
 * the connection itself)
 *
 * @param {Modeling} modeling
 * @param {Injector} injector
 */
// TODO rename => LayoutConnectionBehavior
export default function ConnectionToConnectionBehavior(modeling, connectionDocking, injector) {
  injector.invoke(CommandInterceptor, this);

  function getnewAnchorPoint(event, point) {

    var context = event.context,
        connection = context.connection,
        hints = assign({}, context.hints),
        newWaypoints = context.newWaypoints || connection.waypoints,
        oldWaypoints = context.oldWaypoints;


    if (typeof hints.startChanged === 'undefined') {
      hints.startChanged = !!hints.connectionStart;
    }

    if (typeof hints.endChanged === 'undefined') {
      hints.endChanged = !!hints.connectionEnd;
    }

    return getConnectionAnchorPoint(point, newWaypoints, oldWaypoints, hints);
  }

  this.postExecute([
    'connection.layout',
    'connection.updateWaypoints'
  ], function(event) {
    var context = event.context;

    var connection = context.connection,
        outgoing = connection.outgoing,
        incoming = connection.incoming;

    incoming.forEach(function(connection) {
      var endPoint = connection.waypoints[connection.waypoints.length - 1];
      var newEndpoint = getnewAnchorPoint(event, endPoint);

      var newWaypoints = [].concat(connection.waypoints.slice(0, -1), [ newEndpoint ]);

      modeling.updateWaypoints(connection, newWaypoints);
    });

    outgoing.forEach(function(connection) {
      var startpoint = connection.waypoints[0];
      var newStartpoint = getnewAnchorPoint(event, startpoint);

      var newWaypoints = [].concat([ newStartpoint ], connection.waypoints.slice(1));

      modeling.updateWaypoints(connection, newWaypoints);
    });

  });


  this.postExecute([
    'connection.move'
  ], function(event) {
    var context = event.context;

    var connection = context.connection,
        outgoing = connection.outgoing,
        incoming = connection.incoming,
        delta = context.delta;

    incoming.forEach(function(connection) {
      var endPoint = connection.waypoints[connection.waypoints.length - 1];
      var newEndpoint = {
        x: endPoint.x + delta.x,
        y: endPoint.y + delta.y
      };

      var newWaypoints = [].concat(connection.waypoints.slice(0, -1), [ newEndpoint ]);

      modeling.updateWaypoints(connection, newWaypoints);
    });

    outgoing.forEach(function(connection) {
      var startpoint = connection.waypoints[0];
      var newStartpoint = {
        x: startpoint.x + delta.x,
        y: startpoint.y + delta.y
      };

      var newWaypoints = [].concat([ newStartpoint ], connection.waypoints.slice(1));

      modeling.updateWaypoints(connection, newWaypoints);
    });

  });

/*
  this.postExecuted(['connection.updateWaypoints','connection.move','connection.layout'], function(context) {
    logger.log(context);

    var connection = context.connection,
        hints = context.hints || {};
  
    var incoming = connection.incoming.slice(),
        outgoing = connection.outgoing.slice();
  
    var indexB = Math.ceil(connection.waypoints.length / 2),
      indexA = indexB - 1;
    
    var waypointA = connection.waypoints[indexA],
      waypointB = connection.waypoints[indexB];

    var xm = (waypointA.x + waypointB.x) /2,
      ym = (waypointA.y + waypointB.y) / 2;

    var newWaypoint = {x: xm, y: ym};

    logger.log(newWaypoint);
    
    forEach(incoming, function(incomingConnection) {

      logger.log("reconnect incoming");

      modeling.reconnectEnd(
        incomingConnection, connection,
        newWaypoint
      );
    });
  
    forEach(outgoing, function(outgoingConnection) {

      logger.log("reconnect outgoing");

      modeling.reconnectStart(
        outgoingConnection, connection,
        newWaypoint
      );
    });

  }, true);

  this.postExecuted(['connection.reconnect'], function(context) {
    logger.log('reconnect');
    logger.log(context);

  }, true);
*/
}

ConnectionToConnectionBehavior.$inject = [
  'modeling',
  'connectionDocking',
  'injector'
];

inherits(ConnectionToConnectionBehavior, CommandInterceptor);


// implementation //////////
/*
import {
  assign
} from 'min-dash';

import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { getConnectionAdjustment as getConnectionAnchorPoint } from './util/ConnectionLayoutUtil';

/**
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 * @typedef {import('../Modeling').default} Modeling
 */

/**
 * A component that makes sure that Associations connected to Connections
 * are updated together with the Connection.
 *
 * @param {EventBus} eventBus
 * @param {Modeling} modeling
 *
export default function LayoutConnectionBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  function getnewAnchorPoint(event, point) {

    var context = event.context,
        connection = context.connection,
        hints = assign({}, context.hints),
        newWaypoints = context.newWaypoints || connection.waypoints,
        oldWaypoints = context.oldWaypoints;


    if (typeof hints.startChanged === 'undefined') {
      hints.startChanged = !!hints.connectionStart;
    }

    if (typeof hints.endChanged === 'undefined') {
      hints.endChanged = !!hints.connectionEnd;
    }

    return getConnectionAnchorPoint(point, newWaypoints, oldWaypoints, hints);
  }

  this.postExecute([
    'connection.layout',
    'connection.updateWaypoints'
  ], function(event) {
    var context = event.context;

    var connection = context.connection,
        outgoing = connection.outgoing,
        incoming = connection.incoming;

    incoming.forEach(function(connection) {
      var endPoint = connection.waypoints[connection.waypoints.length - 1];
      var newEndpoint = getnewAnchorPoint(event, endPoint);

      var newWaypoints = [].concat(connection.waypoints.slice(0, -1), [ newEndpoint ]);

      modeling.updateWaypoints(connection, newWaypoints);
    });

    outgoing.forEach(function(connection) {
      var startpoint = connection.waypoints[0];
      var newStartpoint = getnewAnchorPoint(event, startpoint);

      var newWaypoints = [].concat([ newStartpoint ], connection.waypoints.slice(1));

      modeling.updateWaypoints(connection, newWaypoints);
    });

  });


  this.postExecute([
    'connection.move'
  ], function(event) {
    var context = event.context;

    var connection = context.connection,
        outgoing = connection.outgoing,
        incoming = connection.incoming,
        delta = context.delta;

    incoming.forEach(function(connection) {
      var endPoint = connection.waypoints[connection.waypoints.length - 1];
      var newEndpoint = {
        x: endPoint.x + delta.x,
        y: endPoint.y + delta.y
      };

      var newWaypoints = [].concat(connection.waypoints.slice(0, -1), [ newEndpoint ]);

      modeling.updateWaypoints(connection, newWaypoints);
    });

    outgoing.forEach(function(connection) {
      var startpoint = connection.waypoints[0];
      var newStartpoint = {
        x: startpoint.x + delta.x,
        y: startpoint.y + delta.y
      };

      var newWaypoints = [].concat([ newStartpoint ], connection.waypoints.slice(1));

      modeling.updateWaypoints(connection, newWaypoints);
    });

  });

}

inherits(LayoutConnectionBehavior, CommandInterceptor);

LayoutConnectionBehavior.$inject = [
  'eventBus',
  'modeling'
];
*/

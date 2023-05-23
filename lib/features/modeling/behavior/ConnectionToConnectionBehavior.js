import {
  forEach
} from 'min-dash';

import inherits from 'inherits-browser';

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
export default function ConnectionToConnectionBehavior(modeling, connectionDocking, injector) {
  injector.invoke(CommandInterceptor, this);

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

}

ConnectionToConnectionBehavior.$inject = [
  'modeling',
  'connectionDocking',
  'injector'
];

inherits(ConnectionToConnectionBehavior, CommandInterceptor);


// implementation //////////



import {
  forEach
} from 'min-dash';

import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { logger } from "../../../util/Logger";

/**
 * If there is a connection between a Shape and an another connection, 
 * update incoming or outgoing connection endpoint when the target connection moves
 * directly or indirectly (the shape attached to the connection moves)
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

    forEach(incoming, function(incomingConnection) {

      //var point = connectionDocking.getDockingPoint(incomingConnection, connection);

      //var point = connectionDocking.getCroppedWaypoints (incomingConnection, incomingConnection.source, connection);

      logger.log("reconnect incoming");

      modeling.reconnectEnd(
        incomingConnection, connection,
        newWaypoint,
        hints
      );
    });
  
    forEach(outgoing, function(outgoingConnection) {

      logger.log("reconnect outgoing");

      modeling.reconnectStart(
        outgoingConnection, connection,
        newWaypoint,
        hints
      );
    });

  }, true);

}

ConnectionToConnectionBehavior.$inject = [
  'modeling',
  'connectionDocking',
  'injector'
];

inherits(ConnectionToConnectionBehavior, CommandInterceptor);


// implementation //////////



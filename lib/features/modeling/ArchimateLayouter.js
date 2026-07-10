import inherits from 'inherits-browser';

import BaseLayouter from 'diagram-js/lib/layout/BaseLayouter';

import {
  getMid
} from 'diagram-js/lib/layout/LayoutUtil';

export default function ArchimateLayouter() {}

inherits(ArchimateLayouter, BaseLayouter);


ArchimateLayouter.prototype.layoutConnection = function(connection, hints) {
  if (!hints) {
    hints = {};
  }

  var source = hints.source || connection.source,
      target = hints.target || connection.target,
      waypoints = hints.waypoints || connection.waypoints,
      connectionStart = hints.connectionStart,
      connectionEnd = hints.connectionEnd;

  if (!connectionStart) {
    connectionStart = getConnectionDocking(waypoints && waypoints[ 0 ], source);
  }

  if (!connectionEnd) {
    connectionEnd = getConnectionDocking(waypoints && waypoints[ waypoints.length - 1 ], target);
  }

  // TODO(nikku): support vertical modeling
  // and invert preferredLayouts accordingly
  /*
  if (is(connection, 'bpmn:Association') ||
      is(connection, 'bpmn:DataAssociation')) {

    if (waypoints && !isCompensationAssociation(source, target)) {
      return [].concat([ connectionStart ], waypoints.slice(1, -1), [ connectionEnd ]);
    }
  }
  */

  if (waypoints) {
    return [].concat([ connectionStart ], waypoints.slice(1, -1), [ connectionEnd ]);
  }

  return [ connectionStart, connectionEnd ];
};


// helpers //////////

function getConnectionDocking(point, shape) {
  return point ? (point.original || point) : getMid(shape);
}

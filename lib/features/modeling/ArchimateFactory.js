import {
  assign,
  pick
} from 'min-dash';

import {
  is
} from '../../util/ModelUtil';

import { logger } from "../../util/Logger";
import { ARCHIMATE_CONNECTION, ARCHIMATE_ELEMENT, ARCHIMATE_FILLCOLOR, ARCHIMATE_IDOBJECT, ARCHIMATE_LINECOLOR, ARCHIMATE_RELATIONSHIP, ARCHIMATE_STYLE, ARCHIMATE_VIEW, ARCHIMATE_WAYPOINT, ARCHIMATE_WAYPOINTS } from '../../metamodel/Concept';

export default function ArchimateFactory(moddle) {
  this._moddle = moddle;
}

ArchimateFactory.$inject = [ 'moddle' ];

ArchimateFactory.prototype._needsId = function(element) {
  return is(element, ARCHIMATE_IDOBJECT);
};

ArchimateFactory.prototype._ensureId = function(element) {
  var prefix = 'id-';

  if (!element.id && this._needsId(element)) {
    element.id = this._moddle.ids.nextPrefixed(prefix, element);
  }

};

ArchimateFactory.prototype.create = function(type, attrs) {
  logger.log('create(type, attrs)');
  logger.log({type, attrs});

  var element = this._moddle.create(type, attrs || {});

  this._ensureId(element);

  return element;
};

/*
ArchimateFactory.prototype.createBaseElement = function(xsiType) {
  return this.create(ARCHIMATE_ELEMENT, {
    type: xsiType
  });
};

ArchimateFactory.prototype.createRelationship = function(xsiType) {
  return this.create(ARCHIMATE_RELATIONSHIP, {
    type: xsiType
  });
};

ArchimateFactory.prototype.createViewElement = function(elementRef, attrs) {
  return this.create(ARCHIMATE_NODE, assign({
    elementRef: elementRef//,
//    style: this.createStyle(attrs)
  }, attrs));
};

ArchimateFactory.prototype.createConnection = function(relationshipRef, attrs) {
  return this.create(ARCHIMATE_CONNECTION, assign({
    relationshipRef: relationshipRef
  }, attrs));
};
*/

ArchimateFactory.prototype.createWaypoints = function(waypoints) {
  var self = this;

  var waypointsArray = waypoints.map(function(waypoint) {
    return self.createWaypoint(waypoint);
  });

  return this.create(ARCHIMATE_WAYPOINTS, {
    waypoints: waypointsArray
  });

};

ArchimateFactory.prototype.createWaypoint = function(waypoint) {
  return this.create(ARCHIMATE_WAYPOINT, pick(waypoint, [ 'x', 'y' ]));
};


/// NEXT no more used

ArchimateFactory.prototype.createStyle = function(attrs) {
  logger.log('createStyle(attrs)');
  logger.log(attrs);

  return this.create(ARCHIMATE_STYLE, assign({
    fillColor: this.create(ARCHIMATE_FILLCOLOR, attrs),
    lineColor: this.create(ARCHIMATE_LINECOLOR, attrs)
  }, attrs));
};

ArchimateFactory.prototype.createView = function(elementRef) {
  return this.create(ARCHIMATE_VIEW, {
    elementRef: elementRef
  });
};

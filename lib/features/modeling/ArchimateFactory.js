import {
  assign,
  pick
} from 'min-dash';

import {
  isAny
} from './util/ModelingUtil';

import {
  is,
} from '../../util/ModelUtil';

import { logger } from "../../util/Logger";

export default function ArchimateFactory(moddle) {
  this._moddle = moddle;
}

ArchimateFactory.$inject = [ 'moddle' ];


ArchimateFactory.prototype._needsId = function(element) {
  return isAny(element, [
    'archimate:IdObject'
  ]);
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

ArchimateFactory.prototype.createBaseElement = function(xsiType) {
  return this.create('archimate:BaseElement', {
    type: xsiType
  });
};

ArchimateFactory.prototype.createViewElement = function(elementRef, attrs) {
  return this.create('archimate:Node', assign({
    elementRef: elementRef//,
//    style: this.createStyle(attrs)
  }, attrs));
};

ArchimateFactory.prototype.createWaypoints = function(waypoints) {
  var self = this;

  var waypointsArray = waypoints.map(function(waypoint) {
    return self.createWaypoint(waypoint);
  });

  return this.create('archimate:Waypoints', {
    waypoints: waypointsArray
  });

};

ArchimateFactory.prototype.createWaypoint = function(waypoint) {
  return this.create('archimate:Waypoint', pick(waypoint, [ 'x', 'y' ]));
};


/// NEXT no more used

ArchimateFactory.prototype.createStyle = function(attrs) {
  logger.log('createStyle(attrs)');
  logger.log(attrs);

  return this.create('archimate:Style', assign({
    fillColor: this.create('archimate:FillColor', attrs),
    lineColor: this.create('archimate:LineColor', attrs)
  }, attrs));
};

ArchimateFactory.prototype.createView = function(elementRef) {
  return this.create('archimate:View', {
    elementRef: elementRef
  });
};

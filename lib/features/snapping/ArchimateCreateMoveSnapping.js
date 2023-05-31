import inherits from 'inherits-browser';

import CreateMoveSnapping from 'diagram-js/lib/features/snapping/CreateMoveSnapping';

/**
 * Snap during create and move.
 *
 * @param {EventBus} eventBus
 * @param {Injector} injector
 */
export default function ArchimateCreateMoveSnapping(injector) {
  injector.invoke(CreateMoveSnapping, this);
}

inherits(ArchimateCreateMoveSnapping, CreateMoveSnapping);

ArchimateCreateMoveSnapping.$inject = [
  'injector'
];

ArchimateCreateMoveSnapping.prototype.initSnap = function(event) {
  return CreateMoveSnapping.prototype.initSnap.call(this, event);
};

ArchimateCreateMoveSnapping.prototype.addSnapTargetPoints = function(snapPoints, shape, target) {
  return CreateMoveSnapping.prototype.addSnapTargetPoints.call(this, snapPoints, shape, target);
};

ArchimateCreateMoveSnapping.prototype.getSnapTargets = function(shape, target) {
  return CreateMoveSnapping.prototype.getSnapTargets.call(this, shape, target);
};

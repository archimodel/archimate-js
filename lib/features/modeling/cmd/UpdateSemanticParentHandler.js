// TODO(vbo)
// Don't know if this code is used !!!


import { logger } from "../../../util/Logger";

export default function UpdateSemanticParentHandler(archimateUpdater) {
  this._archimateUpdater = archimateUpdater;
}

UpdateSemanticParentHandler.$inject = [ 'archimateUpdater' ];


UpdateSemanticParentHandler.prototype.execute = function(context) {

  logger.log('updateSemanticParentHandler.execute(context)');
  logger.log(context);

  var dataStoreBo = context.dataStoreBo,
      newSemanticParent = context.newSemanticParent,
      newDiParent = context.newDiParent;

  context.oldSemanticParent = dataStoreBo.$parent;
  context.oldDiParent = dataStoreBo.di.$parent;

  // update semantic parent
  this._archimateUpdater.updateElementRefParent(dataStoreBo, newSemanticParent);

  // update DI parent
  this._archimateUpdater.updateViewElementParent(dataStoreBo.di, newDiParent);
};

UpdateSemanticParentHandler.prototype.revert = function(context) {

  logger.log('updateSemanticParentHandler.revert(context)');
  logger.log(context);

  var dataStoreBo = context.dataStoreBo,
      oldSemanticParent = context.oldSemanticParent,
      oldDiParent = context.oldDiParent;

  // update semantic parent
  this._archimateUpdater.updateElementRefParent(dataStoreBo, oldSemanticParent);

  // update DI parent
  this._archimateUpdater.updateViewElementParent(dataStoreBo.di, oldDiParent);
};


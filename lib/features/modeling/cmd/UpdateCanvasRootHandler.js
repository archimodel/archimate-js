import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';

export default function UpdateCanvasRootHandler(canvas, modeling) {
  this._canvas = canvas;
  this._modeling = modeling;
}

UpdateCanvasRootHandler.$inject = [
  'canvas',
  'modeling'
];


UpdateCanvasRootHandler.prototype.execute = function(context) {

  var canvas = this._canvas;

// TODO(vbo) businessObject for root element is "archimate:View"
// as business target must so no need to change when diObject delete

  var newRoot = context.newRoot,
      newRootBusinessObject = newRoot.businessObject,
      oldRoot = canvas.getRootElement(),
      oldRootBusinessObject = oldRoot.businessObject,
      oldRootBusinessObjectParent = oldRootBusinessObject.$parent;


  // (1) replace process old <> new root
  canvas.setRootElement(newRoot, true);

  // (2) update root elements
  collectionAdd(oldRootBusinessObjectParent.rootElements, newRootBusinessObject);
  newRootBusinessObject.$parent = oldRootBusinessObjectParent;

  collectionRemove(oldRootBusinessObjectParent.rootElements, oldRootBusinessObject);
  oldRootBusinessObject.$parent = null;

  context.oldRoot = oldRoot;

  // TODO(nikku): return changed elements?
  // return [ newRoot, oldRoot ];
};


UpdateCanvasRootHandler.prototype.revert = function(context) {

  var canvas = this._canvas;

  var newRoot = context.newRoot,
      newRootBusinessObject = newRoot.businessObject,
      oldRoot = context.oldRoot,
      oldRootBusinessObject = oldRoot.businessObject,
      oldRootBusinessObjectParent = newRootBusinessObject.$parent;

  // (1) replace process old <> new root
  canvas.setRootElement(oldRoot, true);

  // (2) update root elements
  collectionRemove(oldRootBusinessObjectParent.rootElements, newRootBusinessObject);
  newRootBusinessObject.$parent = null;

  collectionAdd(oldRootBusinessObjectParent.rootElements, oldRootBusinessObject);
  oldRootBusinessObject.$parent = oldRootBusinessObjectParent;

  // TODO(nikku): return changed elements?
  // return [ newRoot, oldRoot ];
};
import inherits from 'inherits';

import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';

import UpdatePropertiesHandler from './cmd/UpdatePropertiesHandler';
import UpdateCanvasRootHandler from './cmd/UpdateCanvasRootHandler';
import IdClaimHandler from './cmd/IdClaimHandler';
import SetColorHandler from './cmd/SetColorHandler';

import UpdateLabelHandler from '../label-editing/cmd/UpdateLabelHandler';

import { logger } from "../../util/Logger";

/**
 * Archimate modeling features activator
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 * @param {ArchimateRules} archimateRules
 * @param {Canvas} canvas
 */
export default function Modeling(
//    eventBus, elementFactory, commandStack,
    archimateRules, canvas, elementRegistry, injector) {

//  BaseModeling.call(this, eventBus, elementFactory, commandStack);

  this._archimateRules = archimateRules;
  this._canvas = canvas;
  this._elementRegistry = elementRegistry;

  injector.invoke(BaseModeling, this); // new

}

inherits(Modeling, BaseModeling);

Modeling.$inject = [
//  'eventBus',
//  'elementFactory',
//  'commandStack',
  'archimateRules',
  'canvas',
  'elementRegistry',
  'injector'
];

Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['element.updateProperties'] = UpdatePropertiesHandler;
  handlers['canvas.updateRoot'] = UpdateCanvasRootHandler;
  handlers['id.updateClaim'] = IdClaimHandler;
  handlers['element.setColor'] = SetColorHandler;
  handlers['element.updateLabel'] = UpdateLabelHandler;

  return handlers;
};


Modeling.prototype.connect = function(source, target, attrs, hints) {
  var archimateRules = this._archimateRules,
      rootElement = this._canvas.getRootElement();

  logger.log('connect(source, target, attrs, hints)');
  logger.log({source, target, attrs, hints});


  // canConnect returns the relationship type
  if (!attrs) {
    // attrs = archimateRules.canConnect(source, target) || { type: 'archimate:Relationship' };
  }
  logger.log(this._elementRegistry);

  return this.createConnection(source, target, attrs, source.parent, hints);
  // return;
};

Modeling.prototype.updateLabel = function(element, newLabel, newBounds, hints) {
  this._commandStack.execute('element.updateLabel', {
    element: element,
    newLabel: newLabel,
    newBounds: newBounds,
    hints: hints || {}
  });
};


Modeling.prototype.updateProperties = function(element, properties) {
  this._commandStack.execute('element.updateProperties', {
    element: element,
    properties: properties
  });
};

Modeling.prototype.claimId = function(id, moddleElement) {
  this._commandStack.execute('id.updateClaim', {
    id: id,
    element: moddleElement,
    claiming: true
  });
};


Modeling.prototype.unclaimId = function(id, moddleElement) {
  this._commandStack.execute('id.updateClaim', {
    id: id,
    element: moddleElement
  });
};

Modeling.prototype.setColor = function(elements, color) {
  if (!elements.length) {
    elements = [ elements ];
  }

  this._commandStack.execute('element.setColor', {
    elements: elements,
    color: color
  });
};

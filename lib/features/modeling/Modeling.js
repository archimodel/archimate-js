import inherits from 'inherits-browser';

import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';

import UpdatePropertiesHandler from './cmd/UpdatePropertiesHandler';
import UpdateCanvasRootHandler from './cmd/UpdateCanvasRootHandler';
import IdClaimHandler from './cmd/IdClaimHandler';
import SetColorHandler from './cmd/SetColorHandler';
import UpdateStyleHandler from './cmd/UpdateStyleHandler';
import ReplaceRelationshipRefHandler from './cmd/ReplaceRelationshipRefHandler';
import ReplaceElementRefHandler from './cmd/ReplaceElementRefHandler';
import UpdateLabelHandler from '../label-editing/cmd/UpdateLabelHandler';

import { logger } from "../../util/Logger";
import { assign, forEach } from 'min-dash';


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
    eventBus, elementFactory, commandStack,
    archimateRules){

  BaseModeling.call(this, eventBus, elementFactory, commandStack);

  this._archimateRules = archimateRules;

}

inherits(Modeling, BaseModeling);

Modeling.$inject = [
  'eventBus',
  'elementFactory',
  'commandStack',
  'archimateRules',
];

Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['element.updateProperties'] = UpdatePropertiesHandler;
  handlers['canvas.updateRoot'] = UpdateCanvasRootHandler;
  handlers['id.updateClaim'] = IdClaimHandler;
  handlers['connection.replaceRelationshipRef'] = ReplaceRelationshipRefHandler;
  handlers['element.setColor'] = SetColorHandler;
  handlers['element.updateStyle'] = UpdateStyleHandler;
  handlers['shape.replaceElementRef'] = ReplaceElementRefHandler; 
  handlers['element.updateLabel'] = UpdateLabelHandler;

  return handlers;
};
/*
Modeling.prototype.connect = function(source, target, attrs, hints) {
  logger.log({source, target, attrs, hints});

  var archimateRules = this._archimateRules;
  
  // canConnect returns the relationship type
  if (!attrs) {
    attrs = archimateRules.canConnect(source, target); // || { type: ARCHIMATE_RELATIONSHIP };
  }

  return this.createConnection(source, target, attrs, source.parent, hints);
};
*/
Modeling.prototype.replaceRelationshipRef = function(connection, newRelationshipRef) {

  var context = {
    connection: connection,
    newRelationshipRef: newRelationshipRef
  };
  this._commandStack.execute('connection.replaceRelationshipRef', context);
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

Modeling.prototype.replaceElementRef = function(shape, newElementRef) {
  var context = {
    shape: shape,
    newElementRef: newElementRef
  };
  this._commandStack.execute('shape.replaceElementRef', context);
};

Modeling.prototype.updateStyle = function(elements, newStyle) {
  var targets = [];
  
  if (!elements.length) {
    elements = [elements];
  }

  forEach(elements, function(element) {
    targets.push({ element: element, oldStyle: assign({}, element.style)})
  });

  this._commandStack.execute('element.updateStyle', {
    targets: targets,
    newStyle: newStyle
  });
};

Modeling.prototype.setColor = function(elements, property) {
  if (!elements.length) {
    elements = [ elements ];
  }

  this._commandStack.execute('element.setColor', {
    elements: elements,
    property: property
  });
};
 
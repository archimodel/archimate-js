import { remove as collectionRemove } from 'diagram-js/lib/util/Collections';

import { logger } from "../../../util/Logger";
import { NODE_ELEMENT } from "../../../util/ModelUtil";
import { ARCHIMATE_ELEMENT, ARCHIMATE_ELEMENTS } from '../../../metamodel/Concept';

export default function ReplaceElementRefHandler(eventBus, canvas, archimateFactory) {
  this._eventBus = eventBus;
  this._canvas = canvas;
  this._archimateFactory = archimateFactory;
}

ReplaceElementRefHandler.$inject = [
  'eventBus',
  'canvas',
  'archimateFactory'
];

// Replace Archimate element reference with an another Archimate element defined in the Archimate model 
// with the same Archimate type

ReplaceElementRefHandler.prototype.execute = function(context) {
  logger.log(context);
  var shape = context.shape,
    newElementRef = context.newElementRef,
    oldElementRef = context.oldElementRef || shape.businessObject.elementRef,
    elements = [];

  var eventBus = this._eventBus,
    canvas = this._canvas,
    archimateFactory = this._archimateFactory;

  if (shape.businessObject.type === NODE_ELEMENT) {

    var elementsNode = canvas._rootElement.modelRef.elementsNode;

    if (!elementsNode) {
      elementsNode = archimateFactory.create(ARCHIMATE_ELEMENTS, { baseElements: [] });
      elementsNode.$parent = canvas._rootElement.modelRef;
      canvas._rootElement.modelRef.elementsNode = elementsNode;
    }

    if (!newElementRef) {
      newElementRef = archimateFactory.create(ARCHIMATE_ELEMENT, {type: shape.type});
      newElementRef.name = shape.name;
      newElementRef.$parent = elementsNode;
      if (!elementsNode.baseElements) {
        elementsNode.baseElements = [];
      }
      elementsNode.baseElements.push(newElementRef);
    }

    shape.name = newElementRef.name;
    shape.businessObject.elementRef = newElementRef;

    context.oldElementRef = oldElementRef;
    
    elements.push(shape);
      
  }
  eventBus.fire('elements.changed', { elements });
  return elements;
};

ReplaceElementRefHandler.prototype.revert = function(context) {
  logger.log(context);
  var shape = context.shape,
    oldElementRef = context.oldElementRef,
    newElementRef = context.newElementRef,
    elements = [];

  var eventBus = this._eventBus;

  if (shape.businessObject.type === NODE_ELEMENT) {
    if (oldElementRef) {
    shape.businessObject.elementRef = oldElementRef;
    //update shape
    shape.name = oldElementRef.name;
    elements.push(shape);
    eventBus.fire('elements.changed', { elements });

    } else {
      if (!newElementRef) {
        var canvas = this._canvas;
        var elementsNode = canvas._rootElement.modelRef.elementsNode;
        var elementRef = shape.businessObject.elementRef;
        collectionRemove(elementsNode.baseElements, elementRef);
        delete shape.businessObject.elementRef;
      }
    }
  }
  return elements;
};

/*

  var targets = context.targets,
        newElementType = context.newElementType,
        elements = [];

  var archimateFactory = this._archimateFactory,
    canvas = this._canvas,
    eventBus = this._eventBus;

  var elementsNode = canvas._rootElement.modelRef.elementsNode;

  forEach(targets, function(target) {

    var shape = target.element;

    if (shape.businessObject.type === NODE_ELEMENT) {

      var elementType = newElementType || shape.type 

      var elementRef = shape.businessObject.elementRef;

      if(!elementRef) {
        elementRef = archimateFactory.create(ARCHIMATE_ELEMENT, {type: elementType});
        elementRef.name = shape.name;
        elementRef.$parent = elementsNode;
        elementsNode.baseElements.push(elementRef);
      } else {
        // update archimate element with new type
        elementRef.type = elementType;
      }

      //update shape
      shape.type = elementType;
      shape.aspect = getAspectType(elementType);
      shape.layer = getLayerType(elementType);
      shape.businessObject.elementRef = elementRef;

      elements.push(shape);
    }
  });
  eventBus.fire('elements.changed', { elements });
  return elements;
};

UpdateElementHandler.prototype.revert = function(context) {
  logger.log(context);

  var targets = context.targets,
        newElementType = context.newElementType,
        elements = [];

  var canvas = this._canvas,
    eventBus = this._eventBus;

  var elementsNode = canvas._rootElement.modelRef.elementsNode;

  forEach(targets, function(target) {
    var shape = target.element,
      oldElementype = target.oldElementType;
    
    if (shape.businessObject.type === NODE_ELEMENT) {
      var elementRef = shape.businessObject.elementRef;
      if (!newElementType) {
        collectionRemove(elementsNode.baseElements, elementRef);
        elementRef = undefined;
      } else {
        elementRef.type = oldElementype;
      }

      //update shape
      shape.type = oldElementype;
      shape.aspect = getAspectType(oldElementype);
      shape.layer = getLayerType(oldElementype);

      elements.push(shape);
    }
  });
  
  eventBus.fire('elements.changed', { elements });
  return elements;
};
*/

import inherits from 'inherits-browser';

import { is, NOTE } from '../../../util/ModelUtil';
import { toRgba } from '../../../util/ColorUtil';
import { logger } from "../../../util/Logger";

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function CreateElementBehavior(eventBus, archimateFactory) {

  CommandInterceptor.call(this, eventBus);

  // ensure properties were set in businessObject and businessObject.elementRef

  this.executed('shape.create', function(event) {
    logger.log('shape.create');
    logger.log(event);

    var shape = event.context.shape;

    if (!is(shape.businessObject, ['archimate:Node'])) {
      return;
    }

    logger.log('update Style');

    var style = shape.businessObject.style;
  
    if (!style) {
      style = archimateFactory.create('archimate:Style');
      shape.businessObject.style = style;
    }
  
    style.textAlign = shape.textAlign;
  
    var color = toRgba(shape.fillColor);
    if (!style.fillColor) {
      style.fillColor = archimateFactory.create('archimate:FillColor', color);
    } else {
      style.fillColor = color;
    }
  
    color = toRgba(shape.lineColor);
    if (!style.lineColor) {
      style.lineColor = archimateFactory.create('archimate:LineColor', color);
    } else {
      style.lineColor = color;
    }
  
    var font = {
      name: shape.fontName,
      size: shape.fontSize,
      color: shape.fontColor,
      style: shape.fontStyle   
    }
    if (!style.font) {
      style.font = archimateFactory.create('archimate:Font', font);
    } else {
      style.font = font;
    }


    if (shape.businessObject.type === 'Element') {
      logger.log('Element')

      var elementRef = shape.businessObject.elementRef;

      if(!elementRef) {
        elementRef = archimateFactory.createBaseElement(shape.type);
        shape.businessObject.elementRef = elementRef;
      }

      elementRef.name = shape.name;
    }

    if (shape.businessObject.type === NOTE) {
      logger.log(NOTE);

      var viewElement = shape.businessObject,
        view = shape.parent.businessObject,
        viewElements = view.get('viewElements');

      viewElement.label = shape.text;

      // update with correct Moddel element for XML export
      // viewElement.$parent => view Moddle
      // and relationshipRef.$parent => archimate:Relationships
      // var viewModdle = parent.businessObject;
      //viewElement.$parent = viewModdle;
      //viewElement.relationshipRef.$parent = 

      viewElements.push(viewElement);
      viewElement.$parent = view;
  
    }
  });
}

inherits(CreateElementBehavior, CommandInterceptor);

CreateElementBehavior.$inject = [
  'eventBus',
  'archimateFactory'
];
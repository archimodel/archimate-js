import inherits from 'inherits-browser';
import { assign } from 'min-dash';

import { is, NOTE, NODE_ELEMENT, CONNECTION_RELATIONSHIP, CONNECTION_LINE } from '../../../util/ModelUtil';
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
      assign(style.fillColor, color);
    }
  
    color = toRgba(shape.lineColor);
    if (!style.lineColor) {
      style.lineColor = archimateFactory.create('archimate:LineColor', color);
    } else {
      assign(style.lineColor, color);
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
      assign(style.font, font);
    }


    if (shape.businessObject.type === NODE_ELEMENT) {
      logger.log(NODE_ELEMENT)

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

  this.executed('connection.create', function(event) {
    logger.log('connection.create');
    logger.log(event);

    var connection = event.context.connection;

    if(!is(connection.businessObject, ['archimate:Connection'])) {
      return;
    }

    logger.log('update Style');

    var style = connection.businessObject.style;

    if (!style) {
      style = archimateFactory.create('archimate:Style');
      connection.businessObject.style = style;
    }

    //no text alignement for label connection
    //style.textAlign = connection.textAlign;

    var color = toRgba(connection.lineColor);
    if (!style.lineColor) {
      style.lineColor = archimateFactory.create('archimate:LineColor', color);
    } else {
      assign(style.lineColor, color);
    }

    style.lineWidth = connection.lineWidth;

    var font = {
      name: connection.fontName,
      size: connection.fontSize,
      color: connection.fontColor,
      style: connection.fontStyle
    }
    if (!style.font) {
      style.font = archimateFactory.create('archimate:Font', font);
    } else {
      assign(style.font, font);
    }

    if (connection.businessObject.type === CONNECTION_RELATIONSHIP) {
      logger.log(CONNECTION_RELATIONSHIP);

      var relationshipRef = connection.businessObject.relationshipRef;

      if (!relationshipRef) {
        relationshipRef = archimateFactory.createRelationship(connection.type);
        connection.businessObject.relationshipRef = relationshipRef;
      }

      relationshipRef.name = connection.name;
    }

    if (connection.businessObject.type === CONNECTION_LINE) {
      logger.log(CONNECTION_LINE);

      var viewElement = connection.businessObject,
        view = connection.parent.businessObject,
        viewElements = view.get('viewElements');
      
      viewElement.label = connection.text;

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
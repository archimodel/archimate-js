import inherits from 'inherits-browser';

import {
  assign
} from 'min-dash';

import {
  getViewElement,
  is
} from '../../../util/ModelUtil';

import { logger } from "../../../util/Logger";

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function CreateBaseElementBehavior(eventBus) {

  CommandInterceptor.call(this, eventBus);

  // ensure properties were set in business object

  this.executed('shape.create', function(context) {

    var shape = context.context.shape;

    logger.log('shape.create');
    logger.log(shape);

    if (shape.type === 'archimate:BaseElement') {
      // Nothing to do by now !!
      // const viewElement = getViewElement(shape);
      // !viewElement.color && assign(viewElement, { color: shape.color });
    }

    if (shape.type === 'archimate:Note') {
      logger.log('archimate:Note');
      logger.log(shape);

      var viewElement = shape.businessObject,
        view = shape.parent.businessObject,
        viewElements = view.get('viewElements');


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

inherits(CreateBaseElementBehavior, CommandInterceptor);

CreateBaseElementBehavior.$inject = [
  'eventBus'
];
import { forEach, assign } from 'min-dash';

import { toRgba } from '../../../util/ColorUtil';

export default function SetColorHandler(commandStack, eventBus, archimateFactory) {
  this._commandStack = commandStack;
  this._eventBus = eventBus;
  this._archimateFactory = archimateFactory;
}

SetColorHandler.$inject = [
  'commandStack',
  'eventBus',
  'archimateFactory'
];

SetColorHandler.prototype.postExecute = function(context) {
  var elements = context.elements,
        changed = [ elements ],
        property = context.property;

  var self = this;

  forEach(elements, function(element) {

    var style = element.businessObject.style;
    
    switch(property.name) {
      case 'fillColor':
        element.fillColor = property.value;
        assign(style.fillColor, toRgba(property.value));
        break;

      case 'lineColor':
        element.lineColor = property.value;
        assign(style.lineColor, toRgba(property.value));
        break;

      default:
        // code block
    }
  });

  self._eventBus.fire('elements.changed', { elements });

  return changed;
};
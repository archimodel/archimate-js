import { forEach } from 'min-dash';

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
        properties = context.properties;

  var self = this;

  forEach(elements, function(element) {

    style = element.businessObject.style;
    
    switch(properties.name) {
      case 'fillColor':
        element.fillColor = properties.value;
        style.fillColor = toRgba(properties.value);
        break;

      case 'lineColor':
        element.lineColor = properties.value;
        style.lineColor = toRgba(properties.value);
        break;

      default:
        // code block
    }
    
    self._eventBus.fire('elements.changed', { elements });

  });
  return changed;
};
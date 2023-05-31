import {
  forEach
} from 'min-dash';

export default function SetTextHandler(commandStack, eventBus, archimateFactory) {
  this._commandStack = commandStack;
  this._eventBus = eventBus;
  this._archimateFactory = archimateFactory;
}

SetTextHandler.$inject = [
  'commandStack',
  'eventBus',
  'archimateFactory'
];

SetTextHandler.prototype.postExecute = function(context) {
  var elements = context.elements,
        changed = [ elements ],
        textOption = context.option;

  var self = this;

  forEach(elements, function(element) {

    switch(textOption.name) {
      case 'textAlignment':
        var parts = element.textAlign && element.textAlign.split('-') || ['center', 'middle'];
        parts[0] = textOption.value;
        element.textAlign = parts.join('-');
        element.businessObject.style.textAlign = element.textAlign;
        break;

      case 'textPosition':
        var parts = element.textAlign && element.textAlign.split('-') || ['center', 'middle'];
        element.textPosition = textOption.value;
        parts[1] = textOption.value;
        element.textAlign = parts.join('-');
        element.businessObject.style.textAlign = element.textAlign;
        break;

      case 'fontStyle':
        if (element.fontStyle == textOption.value) {
          element.fontStyle = 'regular';
        } else {
          element.fontStyle = 'bold';
        }
        var font = element.businessObject.style.font;
        if (!font) {
          element.businessObject.style.font = self._archimateFactory.create('archimate:Font', { style: element.fontStyle })
        } else {
          font.style = element.fontStyle;
        }
        break;
      default:
        // code block
    }
  });

  self._eventBus.fire('elements.changed', { elements });
  /*
    self._commandStack.execute('element.changed', {
      element: element
    });
  */
  return changed;
};
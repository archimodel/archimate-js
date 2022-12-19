import {
  forEach
} from 'min-dash';

import COLOR from '../../../util/ColorUtil';
import { getViewElement } from '../../../util/ModelUtil';


var DEFAULT_COLOR = COLOR.PINK;


export default function SetColorHandler(commandStack) {
  this._commandStack = commandStack;
}

SetColorHandler.$inject = [
  'commandStack'
];


SetColorHandler.prototype.postExecute = function(context) {
  var elements = context.elements,
        changed = [ elements ],
        color = context.color || DEFAULT_COLOR;

  var self = this;

  forEach(elements, function(element) {

    var viewElement = getViewElement(element);
    viewElement.style.fillColor = color;
    
    self._commandStack.execute('element.updateProperties', {
      element: element,
      properties: {
// properties must be elementRef properties but color is no more handle by elementRef
//        color: color
      }
    });

  });
  return changed;
};
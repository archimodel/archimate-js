import { ARCHIMATE_CONNECTION, ARCHIMATE_NODE } from '../../metamodel/Concept';
import { isAny, NOTE } from '../../util/ModelUtil';

function getLabelAttr(element) {
  if (isAny(element, [ ARCHIMATE_NODE, ARCHIMATE_CONNECTION ])) {
    if (element.type === NOTE) {
      return 'text';
    } else {
      return 'name';
    }
  }
}

export function getLabel(element) {
  var attr = getLabelAttr(element.businessObject);

  if (attr) {
    return element[attr] || '';
  }

}

export function setLabel(element, text) {

  if (isAny(element.businessObject, [ ARCHIMATE_NODE ])) {
    if (element.businessObject.type === NOTE) {
      element.text = text;
      element.businessObject.label = text;
    } else {
      element.name = text;
      element.businessObject.elementRef.name = text;

    }
  }

  if (isAny(element.businessObject, [ ARCHIMATE_CONNECTION ])) {
    element.name = text;
    element.businessObject.relationshipRef.name = text;

  }
  
  return element;
}
import { is, isAny, NOTE } from '../../util/ModelUtil';

function getLabelAttr(element) {
  if (isAny(element, [ 'archimate:Node' ])) {
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

  if (isAny(element.businessObject, [ 'archimate:Node' ])) {
    if (element.businessObject.type === NOTE) {
      element.text = text;
      element.businessObject.label = text;
    } else {
      element.name = text;
      element.businessObject.elementRef.name = text;

    }
  }

/*
  var attr = getLabelAttr(element.businessObject);

  if (attr) {
    element[attr] = text;
  }
*/
  return element;
}
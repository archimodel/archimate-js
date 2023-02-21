import { is, isAny, getElementRef } from '../../util/ModelUtil';

function getLabelAttr(elementRef) {
  if (isAny(elementRef, [ 'archimate:BaseElement', 'archimate:Group' ])) {
    return 'name';
  }
}

export function getLabel(element) {
/*  
  var elementRef = getElementRef(element),
      attr = getLabelAttr(elementRef);

  if (attr) {
    return elementRef[attr] || '';
  }
*/
  var viewElement = element.businessObject;

  if (is(viewElement, 'archimate:Node')) {
    return viewElement.elementRef.name || '';
  } else if (is(viewElement, 'archimate:Note')) {
    return viewElement.label || '';
  }

}


export function setLabel(element, text) {
/*
  var elementRef = getElementRef(element),
      attr = getLabelAttr(elementRef);

  if (attr) {
    elementRef[attr] = text;
  }
*/
  var viewElement = element.businessObject;

  if (is(viewElement, 'archimate:Node')) {
    viewElement.elementRef.name = text;
  } else if (is(viewElement, 'archimate:Note')) {
    viewElement.label = text;
  }

  return element;
}
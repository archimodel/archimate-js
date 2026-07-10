import { logger } from '../../util/Logger';



/**
 * TODO(vbo) TO REWRITE
 *
 * business object links to viewElement which links to elementRef
 * In a replace function, we need to :
 * - create a new elementRef with the target type and links to existing viewElement
 * - delete old elementRef
 * - redraw new shape
 *
 * This module takes care of replacing elements
 */
export default function ArchimateReplace(
    archimateFactory,
    elementFactory,
    moddleCopy,
    modeling,
    replace,
    selection
) {

  /**
   * Prepares a new business object for the replacement element
   * and triggers the replace operation.
   *
   * @param  {djs.model.Base} element
   * @param  {Object} target
   * @param  {Object} [hints]
   *
   * @return {djs.model.Base} the newly created element
   */
  function replaceElement(element, target, hints) {

    hints = hints || {};

    logger.log('replaceElement');
    logger.log(element);
    logger.log(target);

    /*
    var type = target.type,
        oldBusinessObject = element.businessObject;

    var newBusinessObject = archimateFactory.create(type);

    var newElement = {
      type: type,
      businessObject: newBusinessObject
    };

    var elementProps = getPropertyNames(oldBusinessObject.$descriptor),
        newElementProps = getPropertyNames(newBusinessObject.$descriptor, true),
        copyProps = intersection(elementProps, newElementProps);

    // initialize special properties defined in target definition
    assign(newBusinessObject, pick(target, CUSTOM_PROPERTIES));

    var properties = copyProps;

    newBusinessObject = moddleCopy.copyElement(
      oldBusinessObject,
      newBusinessObject,
      properties
    );

    newBusinessObject.name = oldBusinessObject.name;

    newElement.di = {};

    // fill and stroke will be set to DI
    copyProperties(oldBusinessObject.di, newElement.di, [
      'fill',
      'stroke'
    ]);

    newElement = replace.replaceElement(element, newElement, hints);

    if (hints.select !== false) {
      selection.select(newElement);
    }

    return newElement;
    */

    element.businessObject.relationshipRef.type = 'Aggregation';

    var newElement = {
      type: 'Aggregation',
      businessObject: element.businessObject
    };

    // TODO VBO diagram.js do not replace connections, yet
    newElement = replace.replaceElement(element, newElement, hints);

    if (hints.select !== false) {
      selection.select(newElement);
    }

    return newElement;
  }

  this.replaceElement = replaceElement;
}

ArchimateReplace.$inject = [
  'archimateFactory',
  'elementFactory',
  'moddleCopy',
  'modeling',
  'replace',
  'selection'
];

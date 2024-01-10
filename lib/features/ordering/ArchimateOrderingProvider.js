import inherits from 'inherits-browser';

import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';

import {
  findIndex,
  find
} from 'min-dash';

import { logger } from "../../util/Logger";
import { CONNECTION_LINE, CONNECTION_RELATIONSHIP, is, isAny } from '../../util/ModelUtil';
import { ARCHIMATE_CONNECTION, ARCHIMATE_NODE } from '../../metamodel/Concept';

/**
 * a simple ordering provider that makes sure:
 *
 * (0) labels and groups are rendered always on top
 * (1) elements are ordered by a {level} property
 */
export default function ArchimateOrderingProvider(eventBus, canvas, translate) {

  logger.log('ArchimateOrderingProvider');

  
  OrderingProvider.call(this, eventBus);

  var orders = [
    { type: ARCHIMATE_NODE, order: { level: 1 } },
    { type: ARCHIMATE_CONNECTION, order: { level: 5 } }
  ];

  function computeOrder(element) {
    logger.log('computeOrder');

    if (element.labelTarget) {
      return { level: 10 };
    }

    var entry = find(orders, function(o) {

      return isAny(element.businessObject, [ o.type ]);
    });

    return entry && entry.order || { level: 1 };
  }

  function getOrder(element) {
    logger.log('getOrder');
    logger.log(element);

    var order = element.order;

    if (!order) {
      element.order = order = computeOrder(element);
    }

    if (!order) {
      throw new Error('no order for <' + element.id + '>');
    }

    return order;
  }

  function findActualParent(element, newParent, containers) {
    logger.log('findActualParent');
    var actualParent = newParent;

    while (actualParent) {

      if (isAny(actualParent, containers)) {
        break;
      }

      actualParent = actualParent.parent;
    }

    if (!actualParent) {
      throw new Error(translate('no parent for {element} in {parent}', {
        element: element.id,
        parent: newParent.id
      }));
    }

    return actualParent;
  }

  this.getOrdering = function(element, newParent) {

    if (!element) {
      logger.log('Element undefined');
      return {
        index: 0,
        parent: newParent
      };
    }

    logger.log('getOrdering(element, newParent');
    logger.log( { element, newParent} );

    // render labels always on top
    if (element.labelTarget) {
      logger.log('render labels always on top');    
      return {
        parent: canvas.getRootElement(),  //parent: canvas.findRoot(newParent) || canvas.getRootElement(),
        index: -1
      };
    }

    // render connections always on top
    if (isAny(element.businessObject, [ ARCHIMATE_CONNECTION ])) {
      logger.log('render connections always on top');    
      return {
        parent: canvas.getRootElement(),
        index: -1
      };
    }

    var elementOrder = getOrder(element);

    logger.log(elementOrder);

    if (elementOrder.containers) {
      newParent = findActualParent(element, newParent, elementOrder.containers);
    }

    // correct bug when past new shape on canvas, not in BPMN-js
    if (!newParent) {
      logger.log('newParent undefined, get rootElement');
      newParent = canvas.getRootElement();
    }
    //

    var currentIndex = newParent.children.indexOf(element);

    var insertIndex = findIndex(newParent.children, function(child) {

      // do not compare with labels, they are created
      // in the wrong order (right after elements) during import and
      // mess up the positioning.
      if (!element.labelTarget && child.labelTarget) {
        return false;
      }

      return elementOrder.level < getOrder(child).level;
    });


    // if the element is already in the child list at
    // a smaller index, we need to adjust the insert index.
    // this takes into account that the element is being removed
    // before being re-inserted
    if (insertIndex !== -1) {
      if (currentIndex !== -1 && currentIndex < insertIndex) {
        insertIndex -= 1;
      }
    }

    return {
      index: insertIndex,
      parent: newParent
    };
  };
}

ArchimateOrderingProvider.$inject = [
  'eventBus',
  'canvas',
  'translate'
];

inherits(ArchimateOrderingProvider, OrderingProvider);
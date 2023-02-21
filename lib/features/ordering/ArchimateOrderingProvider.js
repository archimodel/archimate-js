import inherits from 'inherits-browser';

import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';

import {
  findIndex,
  find
} from 'min-dash';

import { logger } from "../../util/Logger";
import { is, isAny } from '../../util/ModelUtil';

/**
 * a simple ordering provider that makes sure:
 *
 * (0) labels and groups are rendered always on top
 * (1) elements are ordered by a {level} property
 */
export default function ArchimateOrderingProvider(eventBus, canvas, translate) {

  OrderingProvider.call(this, eventBus);

  var orders = [
    { type: 'archimate:BaseElement', order: { level: 5 } }
  ];

  function computeOrder(element) {
    if (element.labelTarget) {
      return { level: 10 };
    }

    var entry = find(orders, function(o) {
      return isAny(element, [ o.type ]);
    });

    return entry && entry.order || { level: 1 };
  }

  function getOrder(element) {

    var order = element.order;

    if (!order) {
      element.order = order = computeOrder(element);
    }

    return order;
  }

  function findActualParent(element, newParent, containers) {

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

    logger.log('getOrdering(element, newParent');
    logger.log(element);
    logger.log(newParent);

    // render labels always on top
    if (element.labelTarget) {
      logger.log('render labels always on top');    
      return {
        parent: canvas.getRootElement(),
        index: -1
      };
    }

    // render connections always on top
    if (element.type === 'root') {
      logger.log('render connections always on top');    
      return {
        parent: canvas.getRootElement(),
        index: -1
      };
    }

    var elementOrder = getOrder(element);


    if (elementOrder.containers) {
      newParent = findActualParent(element, newParent, elementOrder.containers);
    }

    // correct bug when past new shape on canvas
    if (!newParent) {
      logger.log('newParent undefined, get rootElement');
      newParent = canvas.getRootElement();
    }

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
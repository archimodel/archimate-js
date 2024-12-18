import {
  every
} from 'min-dash';

import inherits from 'inherits-browser';

import {
  is, isAny, getElementRef, VIEW, NOTE, NODE_ELEMENT, CONNECTION_RELATIONSHIP, CONNECTION_LINE } from '../../util/ModelUtil';

import { isRelationshipAllowed } from '../../util/RelationshipUtil';

import { isLabel } from '../../util/LabelUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import { logger } from "../../util/Logger";
import { ARCHIMATE_CONNECTION, ARCHIMATE_ELEMENT, ARCHIMATE_ELEMENTS, ARCHIMATE_NODE } from '../../metamodel/Concept';

/**
 * Archimate specific modeling rule
 */
export default function ArchimateRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(ArchimateRules, RuleProvider);

ArchimateRules.$inject = [ 'eventBus' ];

ArchimateRules.prototype.init = function() {

  this.addRule('connection.create', function(context) {
    var source = context.source,
        target = context.target;

    return canConnect(source, target);
  });

  this.addRule('connection.reconnect', function(context) {
    var connection = context.connection,
        source = context.source,
        target = context.target;

    return canConnect(source, target, connection);
  });

  this.addRule('connection.updateWaypoints', function(context) {
    const connection = context.connection;

    return {
      type: connection.type,
      businessObject: connection.businessObject
    };
  });

  this.addRule('shape.resize', function(context) {

    var shape = context.shape,
        newBounds = context.newBounds;

    return canResize(shape, newBounds);
  });

  this.addRule('elements.create', function(context) {
    var elements = context.elements,
        position = context.position,
        target = context.target;

    return every(elements, function(element) {
      if (element.host) {
        return canAttach(element, element.host, null, position);
      }

      return canCreate(element, target, null, position);
    });
  });

  this.addRule('elements.move', function(context) {

    var target = context.target,
        shapes = context.shapes,
        position = context.position;

    return canAttach(shapes, target, null, position) ||
           canMove(shapes, target, position);
  });

  this.addRule('shape.create', function(context) {
    return canCreate(
      context.shape,
      context.target,
      context.source,
      context.position
    );
  });

  this.addRule('shape.attach', function(context) {

    return canAttach(
      context.shape,
      context.target,
      null,
      context.position
    );
  });

  this.addRule('element.copy', function(context) {
    var element = context.element,
        elements = context.elements;

    return canCopy(elements, element);
  });
};

ArchimateRules.prototype.canMove = canMove;

ArchimateRules.prototype.canAttach = canAttach;

ArchimateRules.prototype.canDrop = canDrop;

ArchimateRules.prototype.canCreate = canCreate;

ArchimateRules.prototype.canReplace = canReplace;

ArchimateRules.prototype.canResize = canResize;

ArchimateRules.prototype.canCopy = canCopy;

ArchimateRules.prototype.canConnect = canConnect;

/**
 * Utility functions for rule checking
 */

function isSame(a, b) {
  return a === b;
}

function getParents(element) {

  var parents = [];

  while (element) {
    element = element.parent;

    if (element) {
      parents.push(element);
    }
  }

  return parents;
}

function isParent(possibleParent, element) {
  var allParents = getParents(element);
  return allParents.indexOf(possibleParent) !== -1;
}

function isGroup(element) {
  var elementRef = getElementRef(element);
  return is(elementRef, 'archimate:Group') && !element.labelTarget;
}

/**
 * Can an element be dropped into the target element
 *
 * @return {Boolean}
 */
function canDrop(element, target) {

  // can move labels
  if (isLabel(element) || isGroup(element)) {
    return true;
  }


  // drop elements onto board

  if (is(getElementRef(element), ARCHIMATE_ELEMENT) && is(getElementRef(target), ARCHIMATE_ELEMENTS)) {
    return true;
  }

  return false;
}

function canReplace(elements, target) {

  if (!target) {
    return false;
  }

  return true;
}


function canAttach(elements, target) {
logger.log(target);

  if (!Array.isArray(elements)) {
    elements = [ elements ];
  }

  // only (re-)attach one element at a time
  if (elements.length !== 1) {
    return false;
  }

  var element = elements[0];

  // do not attach labels
  if (isLabel(element)) {
    return false;
  }

  if (target && target.type === NOTE) {
    return false;
  }

  return 'attach';
}


function canMove(elements, target) {

  // allow default move check to start move operation
  if (!target) {
    return true;
  }

  return elements.every(function(element) {
    return canDrop(element, target);
  });
}

function canCreate(shape, target, source, position) {

  if (!target) {
    return false;
  }

  if (isLabel(shape) || isGroup(shape)) {
    return true;
  }

  if (isSame(source, target)) {
    return false;
  }

  // ensure we do not drop the element
  // into source
  if (source && isParent(source, target)) {
    return false;
  }

  return canDrop(shape, target, position);
}

function canResize(shape, newBounds) {

  
  if (isAny(shape.businessObject, [ ARCHIMATE_NODE ])) {
    return !newBounds || (newBounds.width >= 5 && newBounds.height >= 5);
  }

  if (is(shape, 'archimate:Group')) {
    return true;
  }

  if (is(shape, 'archimate:Image')) {
    return true;
  }

  return false;
}

function canCopy(elements, element) {
  return false;
}

function canConnect(source, target, connection) {
  logger.log({source, target, connection});

  if (!source || !target ) {
    return false;
  }

  if (source.type === VIEW || target.type === VIEW) {
    return false;
  }

  if (source.businessObject.type === NODE_ELEMENT) { //is(source.businessObject, ARCHIMATE_NODE)) {
    if (target.businessObject.type === NODE_ELEMENT) { //is(target.businessObject, ARCHIMATE_NODE)) {
      // connection.reconnect call
      if (connection) {
        if (isRelationshipAllowed(source.type, target.type, connection.type)) {
          return { type: connection.type};
        } else {
          return false;
        }
      } else {
        return { type: CONNECTION_RELATIONSHIP };
      }
    }
    if (is(target.businessObject, ARCHIMATE_CONNECTION)) { //target.businessObject.type === CONNECTION_RELATIONSHIP) {
      if (connection && connection.type !== 'Association') {
        return false;
      }
      return { type: 'Association' };
    }
    if (target.type === NOTE) {
      return { type: CONNECTION_LINE };
    }
  }
  if (is(source.businessObject, ARCHIMATE_CONNECTION)) {
    if (target.businessObject.type === NODE_ELEMENT) { //is(target.businessObject, ARCHIMATE_NODE)) {
      if (connection && connection.type !== 'Association') {
        return false;
      }
      return { type: 'Association' };
    }
    if (target.type === NOTE) {
      return { type: CONNECTION_LINE };
    }
  }

  if (source.type === NOTE) {
    if (is(target.businessObject, ARCHIMATE_NODE)) { // if (is(target.businessObject, ARCHIMATE_NODE) || target.type === NOTE)) {
      return { type: CONNECTION_LINE };
    }
  }

  return false;

}

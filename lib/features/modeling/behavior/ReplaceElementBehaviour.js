import inherits from 'inherits';

import { forEach } from 'min-dash';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { getViewElement } from '../../../util/ModelUtil';

/**
 * Archimate-specific replace behavior.
 */
export default function ReplaceElementBehaviour(
    archimateReplace,
    archimateRules,
    elementRegistry,
    injector,
    modeling,
    selection
) {
  injector.invoke(CommandInterceptor, this);

  this._archimateReplace = archimateReplace;
  this._elementRegistry = elementRegistry;
  this._selection = selection;

  // replace elements on move
  this.postExecuted([ 'elements.move' ], 500, function(event) {
    var context = event.context,
        target = context.newParent,
        newHost = context.newHost,
        elements = [];

    forEach(context.closure.topLevel, function(topLevelElements) {
      elements = elements.concat(topLevelElements);
    });

    // set target to host if attaching
    if (elements.length === 1 && newHost) {
      target = newHost;
    }

    var canReplace = archimateRules.canReplace(elements, target);

    if (canReplace) {
      this.replaceElements(elements, canReplace.replacements, newHost);
    }
  }, this);

  // update attachments on host replace
  this.postExecute([ 'shape.replace' ], 1500, function(e) {
    var context = e.context,
        oldShape = context.oldShape,
        newShape = context.newShape,
        attachers = oldShape.attachers,
        canReplace;

    if (attachers && attachers.length) {
      canReplace = archimateRules.canReplace(attachers, newShape);

      this.replaceElements(attachers, canReplace.replacements);
    }

  }, this);

  // keep ID on shape replace
  this.postExecuted([ 'shape.replace' ], 1500, function(e) {
    var context = e.context,
        oldShape = context.oldShape,
        newShape = context.newShape;

    oldViewElement = getViewElement(oldShape);

    modeling.unclaimId(oldViewElement.id, oldViewElement);
    modeling.updateProperties(newShape, { id: oldShape.id });
  });
}

inherits(ReplaceElementBehaviour, CommandInterceptor);

ReplaceElementBehaviour.prototype.replaceElements = function(elements, newElements) {
  var elementRegistry = this._elementRegistry,
      archimateReplace = this._archimateReplace,
      selection = this._selection;

  forEach(newElements, function(replacement) {
    var newElement = {
      type: replacement.newElementType
    };

    var oldElement = elementRegistry.get(replacement.oldElementId);

    var idx = elements.indexOf(oldElement);

    elements[idx] = archimateReplace.replaceElement(oldElement, newElement, { select: false });
  });

  if (newElements) {
    selection.select(elements);
  }
};

ReplaceElementBehaviour.$inject = [
  'archimateReplace',
  'archimateRules',
  'elementRegistry',
  'injector',
  'modeling',
  'selection'
];

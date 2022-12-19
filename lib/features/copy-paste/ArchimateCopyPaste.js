import {
  getViewElement,
  getElementRef
} from '../../util/ModelUtil';

import {
  forEach,
  isArray,
  isUndefined,
  omit,
  reduce
} from 'min-dash';

import { logger } from "../../util/Logger";

function copyProperties(source, target, properties) {
  if (!isArray(properties)) {
    properties = [ properties ];
  }

  forEach(properties, function(property) {
    if (!isUndefined(source[property])) {
      target[property] = source[property];
    }
  });
}

function removeProperties(element, properties) {
  if (!isArray(properties)) {
    properties = [ properties ];
  }

  forEach(properties, function(property) {
    if (element[property]) {
      delete element[property];
    }
  });
}

var LOW_PRIORITY = 750;


export default function ArchimateCopyPaste(archimateFactory, eventBus, moddleCopy) {

  eventBus.on('copyPaste.copyElement', LOW_PRIORITY, function(context) {
    var descriptor = context.descriptor,
        element = context.element;

    logger.log('copyPaste.copyElement(context):');
    logger.log({context});

    var elementRef = descriptor.oldElementRef = getElementRef(element);

    descriptor.type = element.type;

    // TODO(vbo) bug on copy element, root cause is on copyProperties
    copyProperties(elementRef, descriptor, ['name', 'documentation']);

    // TODO(vbo)
    // create new property viewElement in shape element, possible confusion with businessObject [getViewElement()]
    // this property is never used after, check copyProperties() code
    descriptor.viewElement = {};

    copyProperties(getViewElement(element), descriptor.viewElement, ['style', 'label', 'fillColor', 'lineColor']);

    if (isLabel(descriptor)) {
      return descriptor;
    }



  });

  var references;

  function resolveReferences(descriptor, cache) {
    var elementRef = descriptor.oldElementRef;

    // default sequence flows
    if (descriptor.default) {

      // relationship cannot be resolved immediately
      references[ descriptor.default ] = {
        element: elementRef,
        property: 'default'
      };
    }

    references = omit(references, reduce(references, function(array, reference, key) {
      var element = reference.element,
          property = reference.property;

      if (key === descriptor.id) {
        element[ property ] = elementRef;

        array.push(descriptor.id);
      }

      return array;
    }, []));
  }

  eventBus.on('copyPaste.pasteElements', function() {
    references = {};
  });

  eventBus.on('copyPaste.pasteElement', function(context) {
    var cache = context.cache,
        descriptor = context.descriptor,
        oldElementRef = descriptor.oldElementRef,
        newElementRef;

    logger.log('copyPaste.pasteElement(context):');
    logger.log({context});

    newElementRef = archimateFactory.create(oldElementRef.$type);

    descriptor.businessObject = moddleCopy.copyElement(
      oldElementRef,
      newElementRef
    );

    // resolve references e.g. default sequence flow
    resolveReferences(descriptor, cache);

    copyProperties(descriptor, newElementRef, [ 'name', 'documentation' ]);

    removeProperties(descriptor, 'oldElementRef');
  });

}


ArchimateCopyPaste.$inject = [
  'archimateFactory',
  'eventBus',
  'moddleCopy'
];

// helpers //////////

function isLabel(element) {
  return !!element.labelTarget;
}

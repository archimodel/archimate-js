import {
  reduce,
  keys,
  forEach,
  assign
} from 'min-dash';

import {
  getViewElement,
  getElementRef
} from '../../../util/ModelUtil';

import { logger } from "../../../util/Logger";

var ID = 'id',
    DI = 'di';

var NULL_DIMENSIONS = {
  width: 0,
  height: 0
};

/**
 * A handler that implements Archimate elements property update.
 *
 * This should be used to set simple properties on elements with
 * an underlying XML business object.
 *
 * Use respective diagram-js provided handlers if you would
 * like to perform automated modeling.
 */
export default function UpdatePropertiesHandler(
    elementRegistry, moddle, translate,
    modeling, textRenderer) {

  this._elementRegistry = elementRegistry;
  this._moddle = moddle;
  this._translate = translate;
  this._modeling = modeling;
  this._textRenderer = textRenderer;
}

UpdatePropertiesHandler.$inject = [
  'elementRegistry',
  'moddle',
  'translate',
  'modeling',
  'textRenderer'
];


// api //////////////////////

/**
 * Updates a board element with a list of new properties
 *
 * @param {Object} context
 * @param {djs.model.Base} context.element the element to update
 * @param {Object} context.properties a list of properties to set on the element
 *
 * @return {Array<djs.model.Base>} the updated element
 */
UpdatePropertiesHandler.prototype.execute = function(context) {

  logger.log('context in UpdatePropertiesHandler.execute');
  logger.log(context);

  var element = context.element,
      changed = [ element ],
      translate = this._translate;
  
  if (!element) {
    throw new Error(translate('element required'));
  }

  var elementRegistry = this._elementRegistry,
      ids = this._moddle.ids;

  logger.log('elementRegistry');
  logger.log(elementRegistry);

  var elementRef = getElementRef(element),
      viewElement = getViewElement(element),
      properties = unwrapElementRef(context.properties),
      oldElementRefProperties = context.oldProperties || getProperties(elementRef, properties),
      oldViewElementProperties = context.oldProperties || getProperties(viewElement, properties);


  if (isIdChange(properties, elementRef)) {
    ids.unclaim(elementRef[ID]);

    elementRegistry.updateId(element, properties[ID]);

    ids.claim(properties[ID], elementRef);
  }

  // update properties
  setProperties(elementRef, properties);
  setProperties(viewElement, properties);

  // store old values
  context.oldProperties = oldElementRefProperties;
  context.changed = changed;

  // indicate changed on objects affected by the update
  return changed;
};


UpdatePropertiesHandler.prototype.postExecute = function(context) {

  logger.log('UpdatePropertiesHandler postExecute');

  var element = context.element,
      label = element.label;

  var text = label && getElementRef(element).name;

  if (!text) {
    return;
  }

  // get layouted text bounds and resize external
  // external label accordingly
  var newLabelBounds = this._textRenderer.getExternalLabelBounds(label, text);

  this._modeling.resizeShape(label, newLabelBounds, NULL_DIMENSIONS);
};

/**
 * Reverts the update on a board elements properties.
 *
 * @param  {Object} context
 *
 * @return {djs.model.Base} the updated element
 */
UpdatePropertiesHandler.prototype.revert = function(context) {

  var element = context.element,
      properties = context.properties,
      oldProperties = context.oldProperties,
      elementRef = getElementRef(element),
      elementRegistry = this._elementRegistry,
      ids = this._moddle.ids;

  // update properties
  setProperties(elementRef, oldProperties);

  if (isIdChange(properties, elementRef)) {
    ids.unclaim(properties[ID]);

    elementRegistry.updateId(element, oldProperties[ID]);

    ids.claim(oldProperties[ID], elementRef);
  }

  return context.changed;
};


function isIdChange(properties, elementRef) {
  return ID in properties && properties[ID] !== elementRef[ID];
}

function getProperties(object, propertyNames) {
  return reduce(propertyNames, function(result, key) {
    result[key] = object.get(key);

    return result;
  }, {});
}

function setProperties(object, properties) {
  forEach(properties, function(value, key) {
    object.set(key, value);
  });
}

/*
function getProperties(businessObject, properties) {
  var propertyNames = keys(properties);

  return reduce(propertyNames, function(result, key) {

    result[key] = object.get(key);

    // handle DI separately
    if (key !== DI) {

    } else {
      result[key] = getDiProperties(businessObject.di, keys(properties.di));
    }

    return result;
  }, {});
}

function getDiProperties(di, propertyNames) {
  return reduce(propertyNames, function(result, key) {
    result[key] = di.get(key);

    return result;
  }, {});
}

function setProperties(businessObject, properties) {
  forEach(properties, function(value, key) {

    if (key !== DI) {
      businessObject.set(key, value);
    } else {

      // only update, if businessObject.di exists
      if (businessObject.di) {
        setDiProperties(businessObject.di, value);
      }
    }
  });
}

function setDiProperties(di, properties) {
  forEach(properties, function(value, key) {
    di.set(key, value);
  });
}
*/

var referencePropertyNames = [ 'default' ];

/**
 * Make sure we unwrap the actual business object
 * behind diagram element that may have been
 * passed as arguments.
 *
 * @param  {Object} properties
 *
 * @return {Object} unwrappedProps
 */
function unwrapElementRef(properties) {

  var unwrappedProps = assign({}, properties);

  referencePropertyNames.forEach(function(name) {
    if (name in properties) {
      unwrappedProps[name] = getElementRef(unwrappedProps[name]);
    }
  });

  return unwrappedProps;
}
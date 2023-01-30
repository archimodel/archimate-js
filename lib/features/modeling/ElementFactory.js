import {
  assign,
  forEach
} from 'min-dash';

import inherits from 'inherits-browser';

import {
  getLayerType,
  getTypeName
} from '../../util/ModelUtil';

import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

import {
  DEFAULT_LABEL_SIZE
} from '../../util/LabelUtil';

import { logger } from "../../util/Logger";

/**
 * An Archimate elements factory for diagram-js shapes
 */
export default function ElementFactory(archimateFactory, moddle, translate) {
  BaseElementFactory.call(this);

  this._archimateFactory = archimateFactory;
  this._moddle = moddle;
  this._translate = translate;
}

inherits(ElementFactory, BaseElementFactory);

ElementFactory.$inject = [
  'archimateFactory',
  'moddle',
  'translate'
];

ElementFactory.prototype.baseCreate = BaseElementFactory.prototype.create;


/*
This function get informations from PaletteProvider or ArchimateImporter 
in order to create a shape (or root) element to display.
The final rendering is done by ArchimateRenderer in order draw the element.

elementType (String) can be : root, shape or label
attrs contains :
=> called from ArchimateImporter
  - businessObject (ModdleElement)
  - diObjet (ModdleElement)
  - bounds of the shape (height, width, x, y)
  - hidden
  - isFrame (boolean)
  - type of the element to draw and passed to ArchimateRenderer (ex. BusinessActor)

  => called from PaletteProvider
   - only type property 
   In this case, 'create' function calls ArchimateFactory create function in order 
   to get back two Moddle objects for elementRef and viewElement 

At the end, basecreate (inherits from BaseElementFactory) is calling with elementType and attrs.
This function callback drawShape function in ArchimateRenderer.

TO DO:
- add layer and aspect properties to attr object in order to give information to
ArchimateRenderer to draw easily shape's aspect, color,...


*/
ElementFactory.prototype.create = function(elementType, attrs) {

  logger.log('create(elementType, attrs)');
  logger.log({elementType, ...attrs});

  var translate = this._translate;

  // no special magic for labels,
  // we assume their businessObjects have already been created
  // and wired via attrs
  if (elementType === 'label') {
    logger.log('create label element');
    return this.baseCreate(elementType, assign({ type: 'label' }, DEFAULT_LABEL_SIZE, attrs));
  }

  // create root gfx element 
  if (elementType === 'root') {
    logger.log('create root element');

    var view = attrs.businessObject;

    attrs = assign({
      id: view.id,
      type: 'root'
    }, attrs);

    return this.baseCreate(elementType, attrs);

  }

  if (elementType === 'connection') {
    logger.log('create connection element');

    attrs = attrs || {};

    if (!attrs.type) {
      throw new Error(translate('no relationship type specified'));
      // attrs.type = 'Association';
    }

    // get the element attached to the view
    var connection = attrs.businessObject;
    
    // No element in the view when connection is drawing on canvas
    if (!connection) {
      logger.log('no businessObject for this connection element');

      // if connection type is Line, no relationship needed
      if (attrs.type === 'Line') {
        logger.log('new Line => create in ArchimateFactory');
        connection = this._archimateFactory.create('archimate:Connection', { type: 'Line' });

        logger.log('return of create in ArchimateFactory');
        logger.log(connection);

      } else {
        logger.log('call archimateFactory.createRelationship to get moddle element');
        var relationship = this._archimateFactory.createRelationship(attrs.type);

        logger.log('new Relationship => createConnection in ArchimateFactory');
        connection = this._archimateFactory.createConnection(relationship, { type: 'Relationship' }); //create('archimate:Connection', { relationshipRef: relationship });

        logger.log('return of createConnection in ArchimateFactory');
        logger.log(connection);

      }
    }

    attrs = assign({
      businessObject: connection,
      id: connection.id,
      // type: attrs.type // connection.relationshipRef.type
    }, attrs);

    logger.log('call baseCreate with :');
    logger.log({elementType, ...attrs});

    var newElement = this.baseCreate(elementType, attrs);

    logger.log(newElement);

    // return this.baseCreate(elementType, attrs);
    return newElement;

  }

  if (elementType === 'shape') {
    logger.log('create shape element');

    attrs = attrs || {};

    if (!attrs.type) {
      throw new Error(translate('no base element type specified'));
    }

    // TODO(vbo)
    // var elementRef = attrs.businessObject; // CHANGE TO attrs.businessObject.elementRef
    // var viewElement = attrs.diObject; // CHANGE TO attrs.businessObject 
    var viewElement = attrs.businessObject; // CHANGE TO attrs.businessObject

    // No viewElement created for this shape when drawing from the palette,
    // first create a moddle element for elementType and then create, else use the model element passing in businessObject's attrs
    if (!viewElement) {
      
      if (attrs.type === 'archimate:Note') {
        // 'Note' element, no need to create an BaseElement (elementRef), only a viewElement
        logger.log('new Note => create in ElementFactory');
        viewElement = this._archimateFactory.create('archimate:Note', {
          label: ''
          });
        logger.log('return of create in ElementFactory');
        logger.log(viewElement);        

      } else {
        logger.log('call archimateFactory.createBaseElement to get moddle element');
        var elementRef = this._archimateFactory.createBaseElement(attrs.type);
        // set default name for this element
        elementRef.name = getTypeName(attrs.type);

        logger.log('new BaseElement => createViewElement in ArchimateFactory');
        // normaly, no need to add di reference to elementRef, only if it's a new model element from palette
        viewElement = this._archimateFactory.createViewElement(elementRef, {
          // id: elementRef.id + '_di'
          // id: this._moddle.ids.nextPrefixed('id-')
          });
        logger.log('return of createViewElement in ArchimateFactory');
        logger.log(viewElement);
      }
    }

/*
    if (is(elementRef, 'archimate:Group')) {
      attrs = assign({
        isFrame: true
      }, attrs);
    }
*/

  /* TODO(vbo) seems to never get into this !
  if (attrs.di) {
    logger.log('passing in if(attrs.di) in ElementFactory');
    assign(elementRef.di, attrs.di);
    delete attrs.di;
  }

    applyAttributes(elementRef, attrs, [
      'processRef',
      'isInterrupting',
      'associationDirection',
      'isForCompensation'
    ]);
  */

    var size = this._getDefaultSize(attrs.type),
      layer = getLayerType(attrs.type);
      // aspect = this._getAspectType(attrs.type);


    attrs = assign({
      businessObject: viewElement,
      id: viewElement.id,
      layer: layer
      // aspect: aspect
    }, size, attrs);  // => size's values are overided if attrs contains width and height properties (eg. when attrs object comes from ArchimateFactory)

    logger.log('call baseCreate with :');
    logger.log({elementType, attrs});

    return this.baseCreate(elementType, attrs);
  }
};


ElementFactory.prototype._getDefaultSize = function(elementType) {
  if (elementType === 'archimate:Group') {
    return { width: 300, height: 300 };
  }

  if (elementType === 'archimate:Note') {
    return { width: 150, height: 80 };
  }

  return { width: 120, height: 55 };
};

// helpers //////////////////////

/**
 * Apply attributes from a map to the given element,
 * remove attribute from the map on application.
 *
 * @param {Base} element
 * @param {Object} attrs (in/out map of attributes)
 * @param {Array<String>} attributeNames name of attributes to apply
 */
function applyAttributes(element, attrs, attributeNames) {

  forEach(attributeNames, function(property) {
    if (attrs[property] !== undefined) {
      applyAttribute(element, attrs, property);
    }
  });
}

/**
 * Apply named property to element and drain it from the attrs
 * collection.
 *
 * @param {Base} element
 * @param {Object} attrs (in/out map of attributes)
 * @param {String} attributeName to apply
 */
function applyAttribute(element, attrs, attributeName) {
  element[attributeName] = attrs[attributeName];

  delete attrs[attributeName];
}
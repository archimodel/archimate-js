import {
  assign,
  find,
  isNumber,
  omit
} from 'min-dash';

import Ids from 'ids';

import {
  domify,
  query as domQuery,
  remove as domRemove
} from 'min-dom';

import {
  innerSVG
} from 'tiny-svg';

import Diagram from 'diagram-js';
import Moddle from './moddle';

import inherits from 'inherits-browser';

import {
  displayGraphicalView
} from './import/Importer';

import { logger } from "./util/Logger";

import { ARCHIMATE_MODEL } from './metamodel/Concept';

/**
 * A base viewer for Archimate model
 *
 * Have a look at {@link Viewer}, {@link NavigatedViewer} or {@link Modeler} for
 * bundles that include actual features.
 *
 * @param {Object} [options] configuration options to pass to the viewer
 * @param {DOMElement} [options.container] the container to render the viewer in, defaults to body.
 * @param {String|Number} [options.width] the width of the viewer
 * @param {String|Number} [options.height] the height of the viewer
 * @param {Object} [options.moddleExtensions] extension packages to provide
 * @param {Array<didi.Module>} [options.modules] a list of modules to override the default modules
 * @param {Array<didi.Module>} [options.additionalModules] a list of modules to use with the default modules
 */
export default function BaseViewer(options) {

  options = assign({}, DEFAULT_OPTIONS, options);

  this._moddle = this._createModdle(options);

  this._container = this._createContainer(options);

  this._init(this._container, this._moddle, options);
}

inherits(BaseViewer, Diagram);

/**
* The importXML result.
*
* @typedef {Object} ImportXMLResult
*
* @property {Array<string>} warnings
*/

/**
* The importXML error.
*
* @typedef {Error} ImportXMLError
*
* @property {Array<string>} warnings
*/


/**
 * Parse and render an Archimate model.
 *
 * Once finished the viewer reports back the result to the
 * provided callback function with (err, warnings).
 *
 * ## Life-Cycle Events
 *
 * During import the viewer will fire life-cycle events:
 *
 *   * import.parse.start (about to read model from xml)
 *   * import.parse.complete (model read; may have worked or not)
 *   * import.render.start (graphical import start)
 *   * import.render.complete (graphical import finished)
 *   * import.done (everything done)
 *
 * You can use these events to hook into the life-cycle.
 *
 * @throws {ImportXMLError} An error thrown during the import of the XML.
 *
 * @fires BaseViewer#ImportParseStartEvent
 * @fires BaseViewer#ImportParseCompleteEvent
 * @fires Importer#ImportRenderStartEvent
 * @fires Importer#ImportRenderCompleteEvent
 * @fires BaseViewer#ImportDoneEvent
 * 
 * @param {String} xml The Archimate XML to be imported
 * @param {ModdleElement<View>|String} [view] Archimate view or id of archimate view to render (if not provided, the first one will be rendered)
 *
 * @returns {Promise<ImportXMLResult, ImportXMLError>} A promise resolving with warnings that were produced during the import.
 */
BaseViewer.prototype.importXML = async function(xml, view, isNewModel) {

  logger.log('Import XML model...');
  logger.log(xml);

  const self = this;

  function ParseCompleteEvent(data) {
    return self.get('eventBus').createEvent(data);
  }

  let aggregatedWarnings = [];
  try {

    // hook in pre-parse listeners +
    // allow xml manipulation
    xml = this._emit('import.parse.start', { xml: xml }) || xml;

    let parseResult;
    try {
      parseResult = await this._moddle.fromXML(xml, ARCHIMATE_MODEL)
    } catch (error) {
      this._emit('import.parse.complete', {
        error
      });

      throw error;
    }

    logger.log('result of moddle.fromXML:');
    logger.log(parseResult);

    let model = parseResult.rootElement;
    const references = parseResult.references;
    const parseWarnings = parseResult.warnings;
    const elementsById = parseResult.elementsById;


    // template model hasn't id for model and default view
    if (isNewModel) {
      var prefix = 'id-';
      var defaultView = model.views.diagrams.viewsList[0];
      model.id = self._moddle.ids.nextPrefixed(prefix, model);
      defaultView.id = self._moddle.ids.nextPrefixed(prefix, defaultView);
    }

    aggregatedWarnings = aggregatedWarnings.concat(parseWarnings);

    var context = {
      references: references,
      elementsById: elementsById,
      warnings: aggregatedWarnings
    };


    model = this._emit('import.parse.complete', {
      error: null,
      model: model,
      context: context
    }) || model;
    
    
    /*ParseCompleteEvent({
//      error: null,
      model: model,
//      references: references,
      warnings: aggregatedWarnings,
//      elementsById: elementsById
    })) || model;
*/
    const importResult = await this.importModel(model, view, elementsById);

    aggregatedWarnings = aggregatedWarnings.concat(importResult.warnings);

    this._emit('import.done', { error: null, warnings: aggregatedWarnings });

    return {warnings: aggregatedWarnings};

  } catch (err) {
    let error = err;
    aggregatedWarnings = aggregatedWarnings.concat(error.warnings || []);
    addWarningsToError(error, aggregatedWarnings);

    error = checkValidationError(error);

    this._emit('import.done', { error, warnings: error.warnings });

    throw error;
  }
};

/**
 * Import parsed model and render an Archimate view.
 *
 * Once finished the viewer reports back the result to the
 * provided callback function with (err, warnings).
 *
 * ## Life-Cycle Events
 *
 * During import the viewer will fire life-cycle events:
 *
 *   * import.render.start (graphical import start)
 *   * import.render.complete (graphical import finished)
 *
 * You can use these events to hook into the life-cycle.
 *
 * @throws {ImportModelError} An error thrown during the import of the model.
 *
 * @param {ModdleElement} model The Archimate model.
 * @param {ModdleElement|string} [view] The optional model view to open.
 *
 * @return {Promise<ImportModelResult>} A promise resolving with warnings that were produced during the import.
 */
BaseViewer.prototype.importModel = async function(model, view, elementsById) {

  logger.log(model);
  this._setModel(model);

  this._setElementsById(elementsById);

  const result = await this.openView(view);

  return { warnings: result.warnings };
};


/**
 * Open a model to start modeling.
 *
 * @returns {Promise<CreateNewModelResult, CreateNewModelError>}
 *
 *
 BaseViewer.prototype.createNewModel = function() {
  logger.log('Creating new XML model !');

  var self = this;

  return new Promise(function(resolve, reject) {

    self.importXML(templateModel)
      .then(function(result) {

        var parseWarnings = result.warnings;


        // template model hasn't id for model and default view
        var prefix = 'id-',
          newModel = self._model,
          defaultView = newModel.views.diagrams.viewsList[0];

        newModel.id = self._moddle.ids.nextPrefixed(prefix, newModel);
        defaultView.id = self._moddle.ids.nextPrefixed(prefix, defaultView);

        self.openView()
          .then(function(result) {
            var allWarnings = [].concat(parseWarnings, result.warnings || []);

            //self._emit('import.done', { error: null, warnings: allWarnings });

            return resolve({ warnings: allWarnings });
          })
          .catch(function(err) {
            var allWarnings = [].concat(parseWarnings, err.warnings || []);

            //self._emit('import.done', { error: err, warnings: allWarnings });

            return reject(addWarningsToError(err, allWarnings));
          });
        return resolve({ warnings: parseWarnings});
      })
      .catch(function(err) {
        logger.log('Catch err');
        self._emit('import.parse.complete', {
          error: err
        });
    
        err = checkValidationError(err);
        self._emit('import.done', { error: err, warnings: err.warnings });
    
        return reject(err);
      });
    });
};
*/

/**
 * The openView result.
 *
 * @typedef {Object} OpenResult
 *
 * @property {Array<string>} warnings
 */

/**
* The openView error.
*
* @typedef {Error} OpenError
*
* @property {Array<string>} warnings
*/

/**
 * Open board of previously imported XML.
 *
 * Once finished the viewer reports back the result to the
 * provided callback function with (err, warnings).
 *
 * ## Life-Cycle Events
 *
 * During switch the viewer will fire life-cycle events:
 *
 *   * import.render.start (graphical import start)
 *   * import.render.complete (graphical import finished)
 *
 * You can use these events to hook into the life-cycle.
 *
 * @param {String|ModdleElement<View>} [viewOrId] id or the view to open
 *
 * returns {Promise<OpenResult, OpenError>}
 */
BaseViewer.prototype.openView = async function(viewOrId) {

  const model = this._model;
  let view = viewOrId;

  logger.log('Opening this selected view:');
  logger.log(viewOrId);

  if (!model) {
    const error = new Error('no model available');
    addWarningsToError(error, []);
    throw error;
  }

  if (typeof viewOrId === 'string') {
    view = findView(model, viewOrId);
    logger.log('find this view in the model:');
    logger.log(view);

    if (!view) {
      const error = new Error('View <' + viewOrId + '> not found');
      addWarningsToError(error, []);

      throw error;
    }
  }

  // clear existing rendered diagram
  // catch synchronous exceptions during #clear()
  try {
    this.clear();
  } catch (error) {
    addWarningsToError(error, []);
    throw error;
  }
    
  // call displayGraphicalView from Importer to perform graphical display
  const { warnings } = await displayGraphicalView(this, model, view);
    
  return { warnings};

};

/**
 * The saveXML result.
 *
 * @typedef {Object} SaveXMLResult
 *
 * @property {string} xml
 */

/**
 * Export the currently displayed Archimate model as
 * an Archimate XML document.
 *
 * ## Life-Cycle Events
 *
 * During XML saving the viewer will fire life-cycle events:
 *
 *   * saveXML.start (before serialization)
 *   * saveXML.serialized (after xml generation)
 *   * saveXML.done (everything done)
 *
 * You can use these events to hook into the life-cycle.
 *
 * @param {Object} [options] export options
 * @param {Boolean} [options.format=false] output formatted XML
 * @param {Boolean} [options.preamble=true] output preamble
 *
 * returns {Promise<SaveXMLResult, Error>}
 */
BaseViewer.prototype.saveXML = function(options) {

  options = options || {};

  var self = this;

  var model = this._model;

  return new Promise(function(resolve, reject) {

    if (!model) {
      var err = new Error('no model loaded');

      return reject(err);
    }

    logger.log('model before saveXML start');
    logger.log(model);

    self._moddle.toXML(model, options).then(function(result) {

      var xml = result.xml;

      try {
        xml = self._emit('saveXML.serialized', {  // => nothing done, no listener for this event
          error: null,
          xml: xml
        }) || xml;

        self._emit('saveXML.done', {    // => nothing done, no listener for this event
          error: null,
          xml: xml
        });
      } catch (e) {
        console.error('error in saveXML life-cycle listener', e);
      }

      return resolve({ xml: xml });
    }).catch(function(err) {

      return reject(err);
    });
  });
};

/**
 * The saveSVG result.
 *
 * @typedef {Object} SaveSVGResult
 *
 * @property {string} svg
 */

/**
 * Export the currently displayed Archimate diagram as
 * an SVG image.
 *
 * ## Life-Cycle Events
 *
 * During SVG saving the viewer will fire life-cycle events:
 *
 *   * saveSVG.start (before serialization)
 *   * saveSVG.done (everything done)
 *
 * You can use these events to hook into the life-cycle.
 *
 * @param {Object} [options]
 *
 * returns {Promise<SaveSVGResult, Error>}
 */
BaseViewer.prototype.saveSVG = function(options) {

  options = options || {};

  var self = this;

  return new Promise(function(resolve, reject) {

    self._emit('saveSVG.start');

    var svg, err;

    try {
      var canvas = self.get('canvas');

      var contentNode = getDefaultLayer(),
          defsNode = domQuery('defs', canvas._svg);

      var contents = innerSVG(contentNode),
          defs = defsNode ? '<defs>' + innerSVG(defsNode) + '</defs>' : '';

      var bbox = contentNode.getBBox();

      svg =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<!-- created with diagram-js / http://bpmn.io -->\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
             'width="' + bbox.width + '" height="' + bbox.height + '" ' +
             'viewBox="' + bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height + '" version="1.1">' +
          defs + contents +
        '</svg>';
    } catch (e) {
      err = e;
    }

    self._emit('saveSVG.done', {
      error: err,
      svg: svg
    });

    if (!err) {
      return resolve({ svg: svg });
    }

    return reject(err);
  });
};

/**
 * Get a named diagram service.
 *
 * @example
 *
 * var elementRegistry = viewer.get('elementRegistry');
 * var startEventShape = elementRegistry.get('StartEvent_1');
 *
 * @param {String} name
 *
 * @return {Object} diagram service instance
 *
 * @method BaseViewer#get
 */

/**
 * Invoke a function in the context of this viewer.
 *
 * @example
 *
 * viewer.invoke(function(elementRegistry) {
 *   var startEventShape = elementRegistry.get('StartEvent_1');
 * });
 *
 * @param {Function} fn to be invoked
 *
 * @return {Object} the functions return value
 *
 * @method BaseViewer#invoke
 */


BaseViewer.prototype._setModel = function(model) {
  this._model = model;
};

BaseViewer.prototype._setElementsById = function(elementsById) {
  this._elementsById = elementsById;
};

BaseViewer.prototype.getElementsById = function() {
  return this._elementsById;
};

BaseViewer.prototype.getModules = function() {
  return this._modules;
};

/**
 * Remove all drawn elements from the viewer.
 *
 * After calling this method the viewer can still
 * be reused for opening another diagram.
 *
 * @method BaseViewer#clear
 */
BaseViewer.prototype.clear = function() {
  if (!this.getModel()) {
    // no diagram to clear
    return;
  }

/*
  // Do we need to remove objects from elementRegistry  ??
  this.get('elementRegistry').forEach(function(element) {

  }

*/
  // remove drawn elements
  Diagram.prototype.clear.call(this);
};

/**
 * Destroy the viewer instance and remove all its
 * remainders from the document tree.
 */
BaseViewer.prototype.destroy = function() {

  // diagram destroy
  Diagram.prototype.destroy.call(this);

  // dom detach
  domRemove(this._container);
};

/**
 * Register an event listener
 *
 * Remove a previously added listener via {@link #off(event, callback)}.
 *
 * @param {String} event
 * @param {Number} [priority]
 * @param {Function} callback
 * @param {Object} [that]
 */
BaseViewer.prototype.on = function(event, priority, callback, target) {
  return this.get('eventBus').on(event, priority, callback, target);
};

/**
 * De-register an event listener
 *
 * @param {String} event
 * @param {Function} callback
 */
BaseViewer.prototype.off = function(event, callback) {
  this.get('eventBus').off(event, callback);
};

BaseViewer.prototype.attachTo = function(parentNode) {

  if (!parentNode) {
    throw new Error('parentNode required');
  }

  // ensure we detach from the
  // previous, old parent
  this.detach();

  // unwrap jQuery if provided
  if (parentNode.get && parentNode.constructor.prototype.jquery) {
    parentNode = parentNode.get(0);
  }

  if (typeof parentNode === 'string') {
    parentNode = domQuery(parentNode);
  }

  parentNode.appendChild(this._container);

  this._emit('attach', {});

  this.get('canvas').resized();
};

BaseViewer.prototype.getModel = function() {
  return this._model;
};

BaseViewer.prototype.detach = function() {

  var container = this._container,
      parentNode = container.parentNode;

  if (!parentNode) {
    return;
  }

  this._emit('detach', {});

  parentNode.removeChild(container);
};

BaseViewer.prototype._init = function(container, moddle, options) {

  var baseModules = options.modules || this.getModules(),
      additionalModules = options.additionalModules || [],
      staticModules = [
        {
          archimatejs: [ 'value', this ],
          moddle: [ 'value', moddle ]
        }
      ];

  var diagramModules = [].concat(staticModules, baseModules, additionalModules);

  var diagramOptions = assign(omit(options, [ 'additionalModules' ]), {
    canvas: assign({}, options.canvas, { container: container }),
    modules: diagramModules
  });

  // invoke diagram constructor
  Diagram.call(this, diagramOptions);

  if (options && options.container) {
    this.attachTo(options.container);
  }
};

/**
 * Emit an event on the underlying {@link EventBus}
 *
 * @param  {String} type
 * @param  {Object} event
 *
 * @return {Object} event processing result (if any)
 */
BaseViewer.prototype._emit = function(type, event) {
  return this.get('eventBus').fire(type, event);
};

BaseViewer.prototype._createContainer = function(options) {

  var container = domify('<div class="ajs-container"></div>');

  assign(container.style, {
    width: ensureUnit(options.width),
    height: ensureUnit(options.height),
    position: options.position
  });

  return container;
};

BaseViewer.prototype._createModdle = function(options) {
  var moddleOptions = assign({}, this._moddleExtensions, options.moddleExtensions);

//  return new Moddle(moddleOptions);

  var moddle = new Moddle(moddleOptions);
  moddle.ids = new Ids();
  logger.log(moddle);
  return moddle;

};

BaseViewer.prototype._modules = [];

BaseViewer.prototype._moddleExtensions = {};


// helpers ///////////////

function addWarningsToError(err, warningsAry) {
  err.warnings = warningsAry;
  return err;
}

function checkValidationError(err) {

  // check if we can help the user by indicating wrong Archimate XML
  // (in case he or the exporting tool did not get that right)

  var pattern = /unparsable content <([^>]+)> detected([\s\S]*)$/;
  var match = pattern.exec(err.message);

  if (match) {
    err.message =
      'unparsable content <' + match[1] + '> detected; ' +
      'this may indicate an invalid Archimate XML file' + match[2];
  }

  return err;
}

var DEFAULT_OPTIONS = {
  width: '100%',
  height: '100%',
  position: 'relative'
};


/**
 * Ensure the passed argument is a proper unit (defaulting to px)
 */
function ensureUnit(val) {
  return val + (isNumber(val) ? 'px' : '');
}

/**
 * Find Archimate view in definitions by ID
 *
 * @param {ModdleElement<Model>} model
 * @param {String} viewId
 *
 * @return {ModdleElement<View>|null}
 */
function findView(model, viewId) {
  if (!viewId) {
    return null;
  }

  return find(model.views.diagrams.viewsList, function(element) {
    return element.id === viewId;
  }) || null;
}
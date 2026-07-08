import {
  elementToString
} from './Util';

import { logger } from '../util/Logger';
import { is } from '../util/ModelUtil';
import { ARCHIMATE_CONNECTION } from '../metamodel/Concept';

/**
 * The displayGraphicalView result.
 *
 * @typedef {Object} importArchimateDiagramResult
 *
 * @property {Array<string>} warnings
 */

/**
* The displayGraphicalView error.
*
* @typedef {Error} importArchimateDiagramError
*
* @property {Array<string>} warnings
*/

/**
 * Import the definitions into a BaseViewer (inherits from diagram-js).
 *
 * Errors and warnings are reported through the specified callback.
 *
 * @param  {BaseViewer} baseViewer
 * @param  {ModdleElement<Model>} model
 * @param  {ModdleElement<View>} [view] the archimate view to be rendered (if not provided, the first one will be rendered)
 *
 * Returns {Promise<importArchimateDiagramResult, importArchimateDiagramError>}
 */
export function displayGraphicalView(baseViewer, model, view) {

  var ArchimateImporter,
      eventBus,
      translate;

  var error,
      warnings = [];

  function renderViewElements(model, viewId) {

    logger.log('renderViewElements(model, viewId)');
    logger.log({ model, viewId });

    // get all views from the model
    var viewsList = model.views.diagrams.viewsList,
        view;

    // verify that model has view(s)
    if (viewId && viewsList.indexOf(viewId) === -1) {
      throw new Error(translate('can\'t find this view { viewId } in model'));
    }

    // select the first view of the model if viewId parameter is undefined
    if (!viewId && viewsList && viewsList.length) {
      view = viewsList[0];
    }

    // no view -> nothing to display
    if (!view) {
      throw new Error(translate('no view to display'));
    }

    logger.log('found a view to display:');
    logger.log(view);

    var rootShape = ArchimateImporter.addRoot(view, model);

    if (view.viewElements) {
      var tempered = [];

      for (const viewElement of view.viewElements) {
        if (is(viewElement, ARCHIMATE_CONNECTION)) {
          tempered.push(viewElement);

        } else {
          try {
            logger.log('viewElement');
            logger.log(viewElement);

            exploreNodeTree(viewElement, rootShape);


          } catch (e) {
            throw createImportError(e, viewElement);
          }
        }
      }

      for (const connectionElement of tempered) {
        try {

          logger.log('connectionElement');
          logger.log(connectionElement);

          ArchimateImporter.addConnection(connectionElement);

        } catch (e) {
          throw createImportError(e, connectionElement);
        }
      }

    }

    function exploreNodeTree(viewElement, parentShape) {

      var shape = ArchimateImporter.addElement(viewElement, parentShape);

      if (viewElement.nodes) {
        for (const node of viewElement.nodes) {
          exploreNodeTree(node, shape);
        }
      }
    }
  }

  return new Promise(function(resolve, reject) {
    try {

      // init ArchimateImporter, eventBus and translate from baseViewer
      ArchimateImporter = baseViewer.get('ArchimateImporter');
      eventBus = baseViewer.get('eventBus');
      translate = baseViewer.get('translate');

      // eventBus.fire('import.render.start', { definitions: definitions });
      eventBus.fire('import.render.start', { model: model });

      // render(model, view);
      renderViewElements(model, view);

      eventBus.fire('import.render.complete', {
        error: error,
        warnings: warnings
      });

      return resolve({ warnings: warnings });
    } catch (e) {
      return reject(e);
    }
  });
}

function createImportError(error, element) {
  var message = 'failed to import ' + elementToString(element) + ': ' + error.message;
  var importError = new Error(message);

  importError.warnings = (error.warnings || []).concat([ message ]);
  importError.error = error;

  return importError;
}

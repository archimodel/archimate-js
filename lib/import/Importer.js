import {
  elementToString
} from './Util';

import { logger } from "../util/Logger";
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

            exploreNodeTree(viewElement, rootShape, rootShape);


          } catch (e) {
            // logError(e.message, { element: viewElement, error: e });   
            console.error('failed to import {element}', { element: elementToString(viewElement) });
            console.error(e);
          }
        }
      }

      for (const connectionElement of tempered) {
        try {

          logger.log('connectionElement');
          logger.log(connectionElement);

          ArchimateImporter.addConnection(connectionElement);
        
        } catch (e) {
          // logError(e.message, { element: connectionElement, error: e });   
          console.error('failed to import {element}', { element: elementToString(connectionElement) });
          console.error(e);
        }
      }

    }
  
    /*function exploreNodeTree(viewElement, parentShape) {

      var shape = ArchimateImporter.addElement(viewElement, parentShape);

      if (viewElement.nodes) {
        for (const node of viewElement.nodes) {
          exploreNodeTree(node, shape);
       }
      }
    }*/

    function exploreNodeTree(viewElement, parentShape, rootShape) {

      var shape = ArchimateImporter.addElement(viewElement, rootShape);
      shape.host = parentShape;

      if (viewElement.nodes) {
        for (const node of viewElement.nodes) {
          exploreNodeTree(node, shape, rootShape);
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

      //render(model, view);
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



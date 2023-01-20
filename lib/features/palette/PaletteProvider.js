import {
  assign
} from 'min-dash';

import COLORS from '../../util/ColorUtil';

import { logger } from "../../util/Logger";
import * as CX from "../../metamodel/Concept";

/**
 * A palette provider for Archimate elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      spaceTool = this._spaceTool,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      translate = this._translate;

  function createAction(type, group, className, title, options) {
/*
    'archimate:BusinessActor', 'groupe name', 'ajs-business-actor',
      translate('Create Business Actor'), { color: or something else... }
*/
    function createListener(event) {

      logger.log('createAction(type, group, className, title, options)');
      logger.log({type, group, className, title, options});

      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape);
    }

    // Delete 'archimate:' from model type
    var shortType = type.replace(/^archimate:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

/*
  function createImage(event) {
    var shape = elementFactory.createShape({
      type: 'archimate:Image'
    });

    create.start(event, shape, {
      hints: { selectImage: true }
    });
  }
*/

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'ajs-tool-hand',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'ajs-tool-select',
      title: translate('Activate the select tool'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    }, /*
    'space-tool': {
      group: 'tools',
      className: 'ajs-tool-space',
      title: translate('Activate the create/remove space tool'),
      action: { 
        click: function(event) {
          spaceTool.activateSelection(event);
        }
      }
    },*/
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.business-actor': createAction(
      CX.BUSINESS_ACTOR, CX.LAYER_BUSINESS, 'ajs-business-actor',
      translate('Business Actor'), { }
    ),
    'create.business-interface': createAction(
      CX.BUSINESS_INTERFACE, CX.LAYER_BUSINESS, 'ajs-business-interface',
      translate('Business Interface'), { }
    ),
    'create.business-function': createAction(
      CX.BUSINESS_FUNCTION, CX.LAYER_BUSINESS, 'ajs-business-function',
      translate('Business Function')
    ),
    'create.business-process': createAction(
      CX.BUSINESS_PROCESS, CX.LAYER_BUSINESS, 'ajs-business-process',
      translate('Business Process')
    ),
    'business-separator': {
      group: CX.LAYER_BUSINESS,
      separator: true
    },
    'create.application-interface': createAction(
      CX.APPLICATION_INTERFACE, CX.LAYER_APPLICATION, 'ajs-application-interface',
      translate('Application Interface'), { }
    ),
    'create.application-function': createAction(
      CX.APPLICATION_FUNCTION, CX.LAYER_APPLICATION, 'ajs-application-function',
      translate('Application Function')
    ),
    'create.application-process': createAction(
      CX.APPLICATION_PROCESS, CX.LAYER_APPLICATION, 'ajs-application-process',
      translate('Application Process')
    ),
    'application-separator': {
      group: CX.LAYER_APPLICATION,
      separator: true
    },
    'create.technology-interface': createAction(
      CX.TECHNOLOGY_INTERFACE, CX.LAYER_TECHNOLOGY, 'ajs-technology-interface',
      translate('Technology Interface'), { }
    ),
    'create.technology-function': createAction(
      CX.TECHNOLOGY_FUNCTION, CX.LAYER_TECHNOLOGY, 'ajs-technology-function',
      translate('Technology Function')
    ),
    'create.technology-process': createAction(
      CX.TECHNOLOGY_PROCESS, CX.LAYER_TECHNOLOGY, 'ajs-technology-process',
      translate('Technology Process')
    ),
    'technology-separator': {
      group: CX.LAYER_TECHNOLOGY,
      separator: true
    },
    'create.note': createAction(
      'archimate:Note', 'Other', 'ajs-note',
      translate('Create Note ')
    )/*,
    'create.group': createAction(
      'archimate:Group', 'artifact', 'ajs-group',
      translate('Create Group')
    )/*,
    'create.image': {
      group: 'artifact',
      className: 'ajs-image',
      title: translate('Create Image'),
      action: {
        click: createImage,
        dragstart: createImage
      }
    } */
  });

  return actions;
};

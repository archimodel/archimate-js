import {
  assign
} from 'min-dash';

import COLORS from '../../util/ColorUtil';

import { logger } from "../../util/Logger";
import { APPLICATION_FUNCTION, APPLICATION_INTERFACE, APPLICATION_PROCESS, 
  BUSINESS_ACTOR, BUSINESS_FUNCTION, BUSINESS_INTERFACE, BUSINESS_PROCESS, 
  LAYER_APPLICATION, LAYER_BUSINESS, LAYER_TECHNOLOGY, LAYER_OTHER,
  TECHNOLOGY_FUNCTION, TECHNOLOGY_INTERFACE, TECHNOLOGY_PROCESS,
  OTHER_NOTE } from '../../util/ModelUtil';

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
      BUSINESS_ACTOR, LAYER_BUSINESS, 'ajs-business-actor',
      translate('Business Actor'), { }
    ),
    'create.business-interface': createAction(
      BUSINESS_INTERFACE, LAYER_BUSINESS, 'ajs-business-interface',
      translate('Business Interface'), { }
    ),
    'create.business-function': createAction(
      BUSINESS_FUNCTION, LAYER_BUSINESS, 'ajs-business-function',
      translate('Business Function')
    ),
    'create.business-process': createAction(
      BUSINESS_PROCESS, LAYER_BUSINESS, 'ajs-business-process',
      translate('Business Process')
    ),
    'business-separator': {
      group: LAYER_BUSINESS,
      separator: true
    },
    'create.application-interface': createAction(
      APPLICATION_INTERFACE, LAYER_APPLICATION, 'ajs-application-interface',
      translate('Application Interface'), { }
    ),
    'create.application-function': createAction(
      APPLICATION_FUNCTION, LAYER_APPLICATION, 'ajs-application-function',
      translate('Application Function')
    ),
    'create.application-process': createAction(
      APPLICATION_PROCESS, LAYER_APPLICATION, 'ajs-application-process',
      translate('Application Process')
    ),
    'application-separator': {
      group: LAYER_APPLICATION,
      separator: true
    },
    'create.technology-interface': createAction(
      TECHNOLOGY_INTERFACE, LAYER_TECHNOLOGY, 'ajs-technology-interface',
      translate('Technology Interface'), { }
    ),
    'create.technology-function': createAction(
      TECHNOLOGY_FUNCTION, LAYER_TECHNOLOGY, 'ajs-technology-function',
      translate('Technology Function')
    ),
    'create.technology-process': createAction(
      TECHNOLOGY_PROCESS, LAYER_TECHNOLOGY, 'ajs-technology-process',
      translate('Technology Process')
    ),
    'technology-separator': {
      group: LAYER_TECHNOLOGY,
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

import {
  assign
} from 'min-dash';

import { logger } from "../../util/Logger";
import * as CX from "../../metamodel/Concept";
import { APPLICATION_ELEMENT_MAP, BUSINESS_ELEMENT_MAP, NOTE, STRATEGY_ELEMENT_MAP, TECHNOLOGY_ELEMENT_MAP } from '../../util/ModelUtil';

/**
 * A palette provider for Archimate elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool, translate,
    popupMenu) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._translate = translate;
  this._popupMenu = popupMenu;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'translate',
  'popupMenu'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
    create = this._create,
    elementFactory = this._elementFactory,
    spaceTool = this._spaceTool,
    lassoTool = this._lassoTool,
    handTool = this._handTool,
    translate = this._translate,
    popupMenu = this._popupMenu;
  

  function createAction(type, group, className, title) {
    //'archimate:BusinessActor', 'groupe name', 'ajs-business-actor',
    //  translate('Create Business Actor'), { color: or something else... }

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }));
      create.start(event, shape);
    }

    return {
      group: group,
      className: className,
      title: translate(title),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };

  }

  function createPopupAction(type, value) {

    function openMenu(event) {
      var position = {
        x: event.x,
        y: event.y,
        cursor: {
          x: event.x,
          y: event.y
        }
      };
    
      var shape = elementFactory.createShape(assign({ type: type }, {event: event}));
    
      popupMenu.open(shape, 'archimate-element-ref', position, {
          //title: translate(''),
          width: 300,
          search: true,
          showCategories: true
      });
    }

    return {
      group: value.layer,
      className: value.className,
      title: translate('Create {type}', {type: value.typeName}),
      action: {
        click: openMenu
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
    },
    /*'space-tool': {
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
  });

  STRATEGY_ELEMENT_MAP.forEach( (value, key) => {
    const propName = 'create.'+value.className;
    var action = {};
    action[propName] = createPopupAction(key, value);
    assign(actions, action);
  });

  assign(actions, {
    'strategy-separator': {
      group: CX.LAYER_BUSINESS,
      separator: true
    }
  });

  BUSINESS_ELEMENT_MAP.forEach( (value, key) => {
    const propName = 'create.'+value.className;
    var action = {};
    action[propName] = createPopupAction(key, value);
    assign(actions, action);
  });

  assign(actions, {
    'business-separator': {
      group: CX.LAYER_BUSINESS,
      separator: true
    }
  });

  APPLICATION_ELEMENT_MAP.forEach( (value, key) => {
    const propName = 'create.'+value.className;
    var action = {};
    action[propName] = createPopupAction(key, value);
    assign(actions, action);
  });

  assign(actions, {
    'application-separator': {
      group: CX.LAYER_APPLICATION,
      separator: true
    }
  });

  TECHNOLOGY_ELEMENT_MAP.forEach( (value, key) => {
    const propName = 'create.'+value.className;
    var action = {};
    action[propName] = createPopupAction(key, value);
    assign(actions, action);
  });

  assign(actions, {
    'technology-separator': {
      group: CX.LAYER_TECHNOLOGY,
      separator: true
    }
  });

  assign(actions, {
    'create.note': createAction(
      NOTE, 'Other', 'archimate-menu-tool-note',
      translate('Create Note'))
  });
/*
    'create.group': createAction(
      'archimate:Group', 'artifact', 'ajs-group',
      translate('Create Group')
    ),
    'create.image': {
      group: 'artifact',
      className: 'ajs-image',
      title: translate('Create Image'),
      action: {
        click: createImage,
        dragstart: createImage
      }
    } */
  //});

  return actions;
};

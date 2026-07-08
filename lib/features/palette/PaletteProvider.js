import {
  assign
} from 'min-dash';

import { NOTE } from '../../util/ModelUtil';

/**
 * A palette provider for Archimate elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool, translate,
    popupMenu, languageProfile) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._translate = translate;
  this._popupMenu = popupMenu;
  this._languageProfile = languageProfile;

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
  'popupMenu',
  'languageProfile'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      translate = this._translate,
      popupMenu = this._popupMenu,
      languageProfile = this._languageProfile;


  function createAction(type, group, className, title) {

    // 'archimate:BusinessActor', 'groupe name', 'ajs-business-actor',
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

      var shape = elementFactory.createShape(assign({ type: type }, { event: event }));

      popupMenu.open(shape, 'archimate-element-ref', position, {

        // title: translate(''),
        width: 300,
        search: true,
        showCategories: true
      });
    }

    return {
      group: value.domain || value.layer,
      className: value.className,
      title: translate('Create {type}', { type: value.typeName }),
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

    /* 'space-tool': {
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

  var profile = languageProfile && languageProfile.get();

  if (profile && profile.elements) {
    profile.elements.forEach(function(value) {
      if (value.palette === false) {
        return;
      }

      const propName = 'create.' + value.className;
      var action = {};
      action[propName] = createPopupAction(value.type, value);
      assign(actions, action);
    });
  }

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
  // });

  return actions;
};

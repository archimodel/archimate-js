import inherits from 'inherits-browser';

import CoreModule from './core';
import TranslateModule from 'diagram-js/lib/i18n/translate';
import SelectionModule from 'diagram-js/lib/features/selection';
import OverlaysModule from 'diagram-js/lib/features/overlays';
import ModelingModule from './features/modeling';
import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';


import BaseViewer from './BaseViewer';

export default function Viewer(options) {
  BaseViewer.call(this, options);
}

inherits(Viewer, BaseViewer);


Viewer.prototype._interactionModules = [
  // non-modeling components
  KeyboardMoveModule,
  //PropertiesPanelModule,
  MoveCanvasModule,
  TouchModule,
  ZoomScrollModule
];

Viewer.prototype._coreModules = [
  CoreModule,
  TranslateModule,
  SelectionModule,
  OverlaysModule,
  ModelingModule  // need to be able to create figures
]

// modules the viewer is composed of
Viewer.prototype._modules = [].concat(
  Viewer.prototype._coreModules,
  Viewer.prototype._interactionModules
);

// default moddle extensions the viewer is composed of
Viewer.prototype._moddleExtensions = {};
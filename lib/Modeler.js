import inherits from 'inherits-browser';

import BaseModeler from './BaseModeler';

import Viewer from './Viewer';
import NavigatedViewer from './NavigatedViewer';

//import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
//import PropertiesPanelModule from './features/properties-panel';
//import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
//import TouchModule from 'diagram-js/lib/navigation/touch';
//import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import AlignElementsModule from 'diagram-js/lib/features/align-elements';
import AutoScrollModule from 'diagram-js/lib/features/auto-scroll';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import CanvasCreate from './features/canvas-create';
import ConnectModule from 'diagram-js/lib/features/connect';
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview';
import ContextPadModule from './features/context-pad';
import CopyPasteModule from './features/copy-paste';
import CreateModule from 'diagram-js/lib/features/create';
import EditorActionsModule from './features/editor-actions';
// import ImageSelectionModule from './features/image-selection';
import KeyboardModule from './features/keyboard';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';
import LabelEditingModule from './features/label-editing';
//import ModelingModule from './features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import PaletteModule from './features/palette';
import ReplacePreviewModule from './features/replace-preview';
import ResizeModule from 'diagram-js/lib/features/resize';
import SnappingModule from './features/snapping';

var templateModel = 
`<?xml version="1.0" encoding="UTF-8"?>
<archimate:Model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="http://www.opengroup.org/xsd/archimate/3.0/" xsi:schemaLocation="http://www.opengroup.org/xsd/archimate/3.0/ http://www.opengroup.org/xsd/archimate/3.1/archimate3_Diagram.xsd">
  <name>New model</name>
  <documentation></documentation>
  <archimate:Elements>
  </archimate:Elements>
  <archimate:Views>
  <archimate:Diagrams>
    <archimate:View>
      <name>Default View</name>
      <documentation></documentation>
    </archimate:View>
  </archimate:Diagrams>
  </archimate:Views>
</archimate:Model>`

export default function Modeler(options) {
  BaseModeler.call(this, options);
}

inherits(Modeler, BaseModeler);


Modeler.Viewer = Viewer;
Modeler.NavigatedViewer = NavigatedViewer;

/**
 * Create a new model to start modeling
 * 
 */
Modeler.prototype.createNewModel = function() {
  return this.importXML(templateModel, 0, true);
}

/* push to Viewer.js
Modeler.prototype._interactionModules = [

  // non-modeling components
  KeyboardMoveModule,
  //PropertiesPanelModule,
  MoveCanvasModule,
  TouchModule,
  ZoomScrollModule
];
*/

Modeler.prototype._modelingModules = [

  // modeling components
  AlignElementsModule,
  AutoScrollModule,
  BendpointsModule,
  CanvasCreate,
  ConnectModule,
  ConnectionPreviewModule,
  ContextPadModule,
  CopyPasteModule,
  CreateModule,
  EditorActionsModule,
  //ImageSelectionModule,
  KeyboardModule,
  KeyboardMoveSelectionModule,
  LabelEditingModule,
  //ModelingModule,   // push to Viewer.js
  MoveModule,
  PaletteModule,
  ReplacePreviewModule,
  ResizeModule,
  SnappingModule,
];


// modules the modeler is composed of
//
// - viewer modules
// - interaction modules
// - modeling modules

Modeler.prototype._modules = [].concat(
  Viewer.prototype._modules,
//  Modeler.prototype._interactionModules, // push to Viewer.js
  Modeler.prototype._modelingModules
);

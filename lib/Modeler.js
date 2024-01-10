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

/*
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
  <archimate:PropertyDefinitions>
  </archimate:PropertyDefinitions>
</archimate:Model>`
*/

var templateModel = 
`<?xml version="1.0" encoding="UTF-8"?>
<archimate:model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="http://www.opengroup.org/xsd/archimate/3.0/" id="id-dzqzo1g6gq3s85gr3z9hhnmde" xsi:schemaLocation="http://www.opengroup.org/xsd/archimate/3.0/ http://www.opengroup.org/xsd/archimate/3.1/archimate3_Diagram.xsd">
  <archimate:name>New model</archimate:name>
  <archimate:documentation></archimate:documentation>
  <archimate:elements>
    <archimate:baseElement id="id-5b3zpiur28m9ps7n9mdz5je0k" type="ApplicationComponent">
      <archimate:name>Test Application Component</archimate:name>
      <archimate:documentation>Test doc</archimate:documentation>
      <archimate:properties>
        <archimate:property propertyDefinitionRef="id-4hz304t2hsov9rqcrf4iwbzqk">
          <archimate:value>Prop-Value</archimate:value>
        </archimate:property>
      </archimate:properties>
    </archimate:baseElement>
    <archimate:baseElement id="id-bu75tpnfdbovhholvcovnrz6f" type="ApplicationComponent">
      <archimate:name>Application Component</archimate:name>
    </archimate:baseElement>
    <archimate:baseElement id="id-5ersa5k2ewhsgfkr9lrbwqcaz" type="DataObject">
      <archimate:name>Data Object</archimate:name>
    </archimate:baseElement>
  </archimate:elements>
  <archimate:views>
    <archimate:diagrams>
      <archimate:view id="id-17rsoa1hq6p4tj18ejhmgm16r">
        <archimate:name>Default View</archimate:name>
        <archimate:documentation></archimate:documentation>
        <archimate:node id="id-2nnldkytas7sk5r5xxlaz7xje" type="Element" elementRef="id-5b3zpiur28m9ps7n9mdz5je0k" x="334" y="168" w="360" h="300">
          <archimate:style textAlign="center-top">
            <archimate:font style="bold" />
            <archimate:fillColor r="181" g="255" b="255" a="100" />
            <archimate:lineColor r="0" g="0" b="0" a="40" />
          </archimate:style>
          <archimate:node id="id-4hz304t2hsov1rqcrf4iwbzqk" type="Element" elementRef="id-bu75tpnfdbovhholvcovnrz6f" x="364" y="220" w="149" h="93">
            <archimate:style textAlign="center-middle">
              <archimate:font />
              <archimate:fillColor r="181" g="255" b="255" a="100" />
              <archimate:lineColor r="0" g="0" b="0" a="40" />
            </archimate:style>
          </archimate:node>
          <archimate:node id="id-7bmzpcwkyg3feus88mi0zkvx8" type="Element" elementRef="id-5ersa5k2ewhsgfkr9lrbwqcaz" x="523" y="360" w="120" h="55">
            <archimate:style textAlign="center-middle">
              <archimate:font />
              <archimate:fillColor r="181" g="255" b="255" a="100" />
              <archimate:lineColor r="0" g="0" b="0" a="40" />
            </archimate:style>
          </archimate:node>
        </archimate:node>
        <archimate:connection id="id-cd3648pfz4rbvawhrgqn6dp56" type="Relationship" relationshipRef="id-152dfcto65cj8nlv6r8yd6eqe" source="id-4hz304t2hsov1rqcrf4iwbzqk" target="id-7bmzpcwkyg3feus88mi0zkvx8">
          <archimate:style lineWidth="1">
            <archimate:font />
            <archimate:lineColor r="0" g="0" b="0" a="100" />
          </archimate:style>
          <archimate:waypoints>
            <archimate:waypoint x="513" y="267" />
            <archimate:waypoint x="593" y="267" />
            <archimate:waypoint x="593" y="360" />
          </archimate:waypoints>
        </archimate:connection>
      </archimate:view>
    </archimate:diagrams>
  </archimate:views>
  <archimate:relationships>
    <archimate:relationship id="id-152dfcto65cj8nlv6r8yd6eqe" type="Access" source="id-bu75tpnfdbovhholvcovnrz6f" target="id-5ersa5k2ewhsgfkr9lrbwqcaz">
      <archimate:name></archimate:name>
    </archimate:relationship>
    <archimate:relationship id="id-6b5cyrj2a4qh1jr6lxh90l7mb" type="Access" source="id-5b3zpiur28m9ps7n9mdz5je0k" target="id-5ersa5k2ewhsgfkr9lrbwqcaz">
      <archimate:name></archimate:name>
    </archimate:relationship>
  </archimate:relationships>
  <archimate:propertyDefinitions>
    <archimate:propertyDefinition id="id-4hz304t2hsov9rqcrf4iwbzqk" type="string">
      <archimate:name>Prop_Name</archimate:name>
    </archimate:propertyDefinition>
  </archimate:propertyDefinitions>
</archimate:model>
`

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

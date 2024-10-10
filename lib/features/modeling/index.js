import BehaviorModule from './behavior';
import RulesModule from '../rules';
import OrderingModule from '../ordering';
import ReplaceModule from '../replace';

import CommandModule from 'diagram-js/lib/command';
import TooltipsModule from 'diagram-js/lib/features/tooltips';
import LabelSupportModule from 'diagram-js/lib/features/label-support';
import AttachSupportModule from 'diagram-js/lib/features/attach-support';
import SelectionModule from 'diagram-js/lib/features/selection';
import ChangeSupportModule from 'diagram-js/lib/features/change-support';
import SpaceToolModule from 'diagram-js/lib/features/space-tool';
import CreateModule from 'diagram-js/lib/features/create'
// import Layouter from 'diagram-js/lib/layout/BaseLayouter';

import ArchimateFactory from './ArchimateFactory';
import NodeUpdater from './NodeUpdater';
import ConnectionUpdater from './ConnectionUpdater';
import ElementFactory from './ElementFactory';
import Modeling from './Modeling';
import ArchimateLayouter from './ArchimateLayouter';
import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';


export default {
  __init__: [
    'modeling',
    'nodeUpdater',
    'connectionUpdater'
  ],
  __depends__: [
    BehaviorModule,
    RulesModule,
    CreateModule,
    OrderingModule,
    ReplaceModule,
    CommandModule,
    TooltipsModule,
    LabelSupportModule,
    AttachSupportModule,
    SelectionModule,
    ChangeSupportModule,
    SpaceToolModule
  ],
  archimateFactory: [ 'type', ArchimateFactory ],
  nodeUpdater: [ 'type', NodeUpdater ],
  connectionUpdater: [ 'type', ConnectionUpdater ],
  elementFactory: [ 'type', ElementFactory ],
  modeling: [ 'type', Modeling ],
  layouter: [ 'type', ArchimateLayouter ],
  connectionDocking: [ 'type', CroppingConnectionDocking ]
};
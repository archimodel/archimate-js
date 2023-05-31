import AdaptiveLabelPositioningBehavior from './AdaptiveLabelPositioningBehavior';
import AppendBehavior from './AppendBehavior';
import FixHoverBehavior from './FixHoverBehavior';
import ImportDockingFix from './ImportDockingFix';
import LabelBehavior from './LabelBehavior';
import ReplaceElementBehaviour from './ReplaceElementBehaviour';
import UnclaimIdBehavior from './UnclaimIdBehavior';
import CreateElementBehavior from './CreateElementBehavior';
import ConnectionToConnectionBehavior from './ConnectionToConnectionBehavior';

import PopupMenuModule from '../../popup-menu';

export default {

  __depends__: [
      PopupMenuModule,
    ],

  __init__: [
    'adaptiveLabelPositioningBehavior',
    'appendBehavior',
    'fixHoverBehavior',
    'importDockingFix',
    'labelBehavior',
    'replaceElementBehaviour',
    'unclaimIdBehavior',
    'createElementBehavior',
    'connectionToConnectionBehavior'
  ],
  adaptiveLabelPositioningBehavior: [ 'type', AdaptiveLabelPositioningBehavior ],
  appendBehavior: [ 'type', AppendBehavior ],
  fixHoverBehavior: [ 'type', FixHoverBehavior ],
  importDockingFix: [ 'type', ImportDockingFix ],
  labelBehavior: [ 'type', LabelBehavior ],
  replaceElementBehaviour: [ 'type', ReplaceElementBehaviour ],
  unclaimIdBehavior: [ 'type', UnclaimIdBehavior ],
  createElementBehavior: [ 'type', CreateElementBehavior ],
  connectionToConnectionBehavior: [ 'type', ConnectionToConnectionBehavior ],
};

import AdaptiveLabelPositioningBehavior from './AdaptiveLabelPositioningBehavior';
import AppendBehavior from './AppendBehavior';
import FixHoverBehavior from './FixHoverBehavior';
import ImportDockingFix from './ImportDockingFix';
import LabelBehavior from './LabelBehavior';
import ReplaceElementBehaviour from './ReplaceElementBehaviour';
import UnclaimIdBehavior from './UnclaimIdBehavior';
import ConnectionToConnectionBehavior from './ConnectionToConnectionBehavior';
import AttachmentBehavior from './AttachmentBehavior';

export default {

  __depends__: [
      // PopupMenuModule
    ],

  __init__: [
    'adaptiveLabelPositioningBehavior',
    'appendBehavior',
    'fixHoverBehavior',
    'importDockingFix',
    'labelBehavior',
    'replaceElementBehaviour',
    'unclaimIdBehavior',
    'connectionToConnectionBehavior',
    'attachmentBehavior',
  ],
  adaptiveLabelPositioningBehavior: [ 'type', AdaptiveLabelPositioningBehavior ],
  appendBehavior: [ 'type', AppendBehavior ],
  fixHoverBehavior: [ 'type', FixHoverBehavior ],
  importDockingFix: [ 'type', ImportDockingFix ],
  labelBehavior: [ 'type', LabelBehavior ],
  replaceElementBehaviour: [ 'type', ReplaceElementBehaviour ],
  unclaimIdBehavior: [ 'type', UnclaimIdBehavior ],
  connectionToConnectionBehavior: [ 'type', ConnectionToConnectionBehavior ],
  attachmentBehavior: [ 'type', AttachmentBehavior ],
};

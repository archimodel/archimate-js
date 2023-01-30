import PopupMenuModule from 'diagram-js/lib/features/popup-menu';
import ConnectModule from 'diagram-js/lib/features/connect'
//import ReplaceModule from '../replace';

import ConnectionMenuProvider from './ConnectionMenuProvider';

export default {
  __depends__: [
    PopupMenuModule,
    ConnectModule,
  //  ReplaceModule
  ],
  __init__: [ 'connectionMenuProvider' ],
  connectionMenuProvider: [ 'type', ConnectionMenuProvider ],
};
import PopupMenuModule from 'diagram-js/lib/features/popup-menu';
import ConnectModule from 'diagram-js/lib/features/connect'
//import ReplaceModule from '../replace';

import ConnectionMenuProvider from './ConnectionMenuProvider';
import TextMenuProvider from './TextMenuProvider';

export default {
  __depends__: [
    PopupMenuModule,
    ConnectModule,
  //  ReplaceModule
  ],
  __init__: [
    'connectionMenuProvider',
    'textMenuProvider'
 ],
  connectionMenuProvider: [ 'type', ConnectionMenuProvider ],
  textMenuProvider: [ 'type', TextMenuProvider]
};
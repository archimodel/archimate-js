import PopupMenuModule from 'diagram-js/lib/features/popup-menu';
import CreateModule from 'diagram-js/lib/features/create'
//import ReplaceModule from '../replace';

import ConnectionMenuProvider from './ConnectionMenuProvider';
import ElementRefMenuProvider from './ElementRefMenuProvider';
import TextMenuProvider from './TextMenuProvider';

export default {
  __depends__: [
    PopupMenuModule,
    CreateModule,
  //  ReplaceModule
  ],
  __init__: [
    'connectionMenuProvider',
    'elementRefMenuProvider',
    'textMenuProvider'
 ],
  connectionMenuProvider: [ 'type', ConnectionMenuProvider ],
  elementRefMenuProvider : [ 'type', ElementRefMenuProvider ],
  textMenuProvider: [ 'type', TextMenuProvider]
};
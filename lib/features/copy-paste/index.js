import CopyPasteModule from 'diagram-js/lib/features/copy-paste';

import ArchimateCopyPaste from './ArchimateCopyPaste';
import ModdleCopy from './ModdleCopy';

export default {
  __depends__: [
    CopyPasteModule
  ],
  __init__: [ 'archimateCopyPaste', 'moddleCopy' ],
  archimateCopyPaste: [ 'type', ArchimateCopyPaste ],
  moddleCopy: [ 'type', ModdleCopy ]
};

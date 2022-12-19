import KeyboardModule from 'diagram-js/lib/features/keyboard';

import ArchimateKeyboardBindings from './ArchimateKeyboardBindings';

export default {
  __depends__: [
    KeyboardModule
  ],
  __init__: [ 'keyboardBindings' ],
  keyboardBindings: [ 'type', ArchimateKeyboardBindings ]
};

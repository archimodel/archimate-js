import PaletteModule from 'diagram-js/lib/features/palette';
import CreateModule from 'diagram-js/lib/features/create';
import SpaceToolModule from 'diagram-js/lib/features/space-tool';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';
import HandToolModule from 'diagram-js/lib/features/hand-tool';
import TranslateModule from 'diagram-js/lib/i18n/translate';

import PopupMenuModule from '../popup-menu';
import PaletteProvider from './PaletteProvider';

export default {
  __depends__: [
    PaletteModule,
    CreateModule,
    SpaceToolModule,
    LassoToolModule,
    HandToolModule,
    TranslateModule,
    PopupMenuModule
  ],
  __init__: [ 'paletteProvider' ],
  paletteProvider: [ 'type', PaletteProvider ]
};

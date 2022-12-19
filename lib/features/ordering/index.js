import translate from 'diagram-js/lib/i18n/translate';

import ArchimateOrderingProvider from './ArchimateOrderingProvider';

export default {
  __depends__: [
    translate
  ],
  __init__: [ 'archimateOrderingProvider' ],
  archimateOrderingProvider: [ 'type', ArchimateOrderingProvider ]
};
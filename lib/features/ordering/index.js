import translate from 'diagram-js/lib/i18n/translate';

import ArchimateOrderingProvider from './ArchimateOrderingProvider';
import ArchimateOrdering from './ArchimateOrdering';

export default {
  __depends__: [
    translate
  ],
  __init__: [ 
    'archimateOrderingProvider',
    'archimateOrdering'
  ],
  archimateOrderingProvider: [ 'type', ArchimateOrderingProvider ],
  archimateOrdering: ['type', ArchimateOrdering]
};
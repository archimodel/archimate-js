import translate from 'diagram-js/lib/i18n/translate';

import ArchimateImporter from './ArchimateImporter';

export default {
  __depends__: [
    translate
  ],
  ArchimateImporter: [ 'type', ArchimateImporter ]
};
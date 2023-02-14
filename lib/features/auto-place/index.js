import AutoPlaceModule from 'diagram-js/lib/features/auto-place';

import ArchimateAutoPlace from './ArchimateAutoPlace';

export default {
  __depends__: [ AutoPlaceModule ],
  __init__: [ 'archimateAutoPlace' ],
  archimateAutoPlace: [ 'type', ArchimateAutoPlace ]
};
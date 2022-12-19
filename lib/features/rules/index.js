import RulesModule from 'diagram-js/lib/features/rules';

import ArchimateRules from './ArchimateRules';

export default {
  __depends__: [
    RulesModule
  ],
  __init__: [ 'archimateRules' ],
  archimateRules: [ 'type', ArchimateRules ]
};

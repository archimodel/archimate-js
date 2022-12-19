import ArchimateRenderer from './ArchimateRenderer';
import TextRenderer from './TextRenderer';

import PathMap from './PathMap';

export default {
  __init__: [ 'ArchimateRenderer' ],
  ArchimateRenderer: [ 'type', ArchimateRenderer ],
  textRenderer: [ 'type', TextRenderer ],
  pathMap: [ 'type', PathMap ]
};

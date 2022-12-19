import PreviewSupportModule from 'diagram-js/lib/features/preview-support';

import ArchimateReplacePreview from './ArchimateReplacePreview';

export default {
  __depends__: [
    PreviewSupportModule
  ],
  __init__: [ 'archimateReplacePreview' ],
  archimateReplacePreview: [ 'type', ArchimateReplacePreview ]
};

import EditorActionsModule from 'diagram-js/lib/features/editor-actions';

import ArchimateEditorActions from './ArchimateEditorActions';

export default {
  __depends__: [
    EditorActionsModule
  ],
  editorActions: [ 'type', ArchimateEditorActions ]
};

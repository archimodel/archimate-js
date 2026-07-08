import Viewer from '../../lib/Viewer';
import {
  EMPTY_ARCHIMATE4_XML,
  seedSampleCanvas,
  setStatus
} from './sample-canvas';

async function boot() {
  const viewer = new Viewer({
    container: document.querySelector('#canvas'),
    archimateVersion: '4.0'
  });

  window.archimateViewer = viewer;

  await viewer.importXML(EMPTY_ARCHIMATE4_XML);
  seedSampleCanvas(viewer);
  setStatus('ready');
}

boot().catch((error) => {
  console.error(error);
  setStatus('error: ' + error.message);
});

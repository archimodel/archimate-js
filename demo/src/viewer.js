import Viewer from '../../lib/Viewer';
import {
  applyDemoProfileToDocument,
  getDemoProfile,
  seedSampleCanvas,
  setStatus
} from './sample-canvas';

async function boot() {
  const demoProfile = getDemoProfile();
  const viewer = new Viewer({
    container: document.querySelector('#canvas'),
    archimateVersion: demoProfile.version
  });

  applyDemoProfileToDocument(demoProfile, 'Viewer');
  window.archimateDemoProfile = demoProfile;
  window.archimateViewer = viewer;

  await viewer.importXML(demoProfile.emptyXml);
  seedSampleCanvas(viewer, demoProfile.version);
  setStatus('ready');
}

boot().catch((error) => {
  console.error(error);
  setStatus('error: ' + error.message);
});

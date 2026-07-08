import Modeler from '../../lib/Modeler';
import {
  applyDemoProfileToDocument,
  getDemoProfile,
  seedSampleCanvas,
  setStatus
} from './sample-canvas';

const demoProfile = getDemoProfile();
const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: demoProfile.version,
  keyboard: {
    bindTo: document
  }
});

applyDemoProfileToDocument(demoProfile, 'Editor');
window.archimateDemoProfile = demoProfile;
window.archimateModeler = modeler;

async function loadSample() {
  await modeler.importXML(demoProfile.emptyXml);
  seedSampleCanvas(modeler, demoProfile.version);
  setStatus('ready');
}

async function createNewModel() {
  await modeler.createNewModel();
  modeler.get('canvas').zoom('fit-viewport');
  setStatus('new model');
}

document.querySelector('#reset-sample').addEventListener('click', () => {
  loadSample().catch(handleError);
});

document.querySelector('#new-model').addEventListener('click', () => {
  createNewModel().catch(handleError);
});

loadSample().catch(handleError);

function handleError(error) {
  console.error(error);
  setStatus('error: ' + error.message);
}

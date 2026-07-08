import Modeler from '../../lib/Modeler';
import {
  EMPTY_ARCHIMATE4_XML,
  seedSampleCanvas,
  setStatus
} from './sample-canvas';

const modeler = new Modeler({
  container: document.querySelector('#canvas'),
  archimateVersion: '4.0',
  keyboard: {
    bindTo: document
  }
});

window.archimateModeler = modeler;

async function loadSample() {
  await modeler.importXML(EMPTY_ARCHIMATE4_XML);
  seedSampleCanvas(modeler);
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

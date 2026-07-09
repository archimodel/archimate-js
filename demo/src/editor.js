import Modeler from '../../lib/Modeler';
import {
  resetArchimate4RelationshipProfile,
  setArchimate4RelationshipProfile
} from '../../lib/metamodel/languages/archimate4-relationships';
import {
  DEMO_ARCHIMATE4_VERSION,
  applyDemoProfileToDocument,
  getDemoProfile,
  renderRelationshipProfileStatus,
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

const relationshipProfileInput = document.querySelector('#relationship-profile-input');
const loadRelationshipProfileButton = document.querySelector('#load-relationship-profile');
const resetRelationshipProfileButton = document.querySelector('#reset-relationship-profile');

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

if (loadRelationshipProfileButton) {
  loadRelationshipProfileButton.addEventListener('click', () => {
    loadRelationshipProfile().catch(handleError);
  });
}

if (resetRelationshipProfileButton) {
  resetRelationshipProfileButton.addEventListener('click', () => {
    resetRelationshipProfile();
  });
}

configureRelationshipProfileControls();
loadSample().catch(handleError);

async function loadRelationshipProfile() {
  if (demoProfile.version !== DEMO_ARCHIMATE4_VERSION) {
    renderRelationshipProfileStatus(demoProfile, 'not available in ArchiMate 3.x mode');
    return;
  }

  const text = relationshipProfileInput && relationshipProfileInput.value.trim();

  if (!text) {
    throw new Error('Appendix B relationship profile input is empty');
  }

  setArchimate4RelationshipProfile(buildRelationshipProfileInput(text), {
    requireComplete: true,
    requireCompleteTargets: true,
    sourceMetadata: {
      suppliedBy: 'editor-demo',
      loadedAt: new Date().toISOString()
    }
  });

  renderRelationshipProfileStatus(demoProfile, 'loaded');
  setStatus('relationship profile loaded');
}

function resetRelationshipProfile() {
  resetArchimate4RelationshipProfile();
  renderRelationshipProfileStatus(demoProfile, 'reset');
  setStatus('relationship profile reset');
}

function buildRelationshipProfileInput(text) {
  if (/^\s*(\{|\[)/.test(text)) {
    return text;
  }

  return {
    matrixText: text
  };
}

function configureRelationshipProfileControls() {
  const enabled = demoProfile.version === DEMO_ARCHIMATE4_VERSION;

  [
    relationshipProfileInput,
    loadRelationshipProfileButton,
    resetRelationshipProfileButton
  ].forEach(function(node) {
    if (node) {
      node.disabled = !enabled;
    }
  });

  if (!enabled) {
    renderRelationshipProfileStatus(demoProfile, 'not available in ArchiMate 3.x mode');
  }
}

function handleError(error) {
  console.error(error);
  renderRelationshipProfileStatus(demoProfile, error.message);
  setStatus('error: ' + error.message);
}

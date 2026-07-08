import {
  getLanguageProfile,
  normalizeArchimateVersion
} from '../../lib/metamodel/languages';

export const DEMO_ARCHIMATE3_VERSION = '3.2';
export const DEMO_ARCHIMATE4_VERSION = '4.0';
export const EMPTY_ARCHIMATE3_XML = createEmptyXml(DEMO_ARCHIMATE3_VERSION, 'Demo ArchiMate 3 model');
export const EMPTY_ARCHIMATE4_XML = createEmptyXml(DEMO_ARCHIMATE4_VERSION, 'Demo ArchiMate 4 model');

const SAMPLE_PROFILES = {
  [DEMO_ARCHIMATE3_VERSION]: {
    version: DEMO_ARCHIMATE3_VERSION,
    label: 'ArchiMate 3.x',
    profileSummary: 'Standard 3.x compatibility profile',
    paletteSummary: '3.x palette; 4.0-only concepts are rejected',
    editingSummary: '3.x editor validation',
    emptyXml: EMPTY_ARCHIMATE3_XML,
    shapes: [
      { key: 'role', type: 'BusinessRole', name: 'Customer Role', x: 170, y: 92, width: 150, height: 76 },
      { key: 'service', type: 'BusinessService', name: 'Digital Service', x: 430, y: 92, width: 170, height: 76 },
      { key: 'application', type: 'ApplicationComponent', name: 'Experience App', x: 720, y: 92, width: 190, height: 76 },
      { key: 'path', type: 'Path', name: 'Technology Path', x: 170, y: 335, width: 150, height: 76 },
      { key: 'object', type: 'BusinessObject', name: 'Shared Object', x: 430, y: 260, width: 170, height: 76 },
      { key: 'junction', type: 'AndJunction', name: '', x: 632, y: 277, width: 42, height: 42 },
      { key: 'technology', type: 'Device', name: 'Edge Device', x: 720, y: 260, width: 190, height: 76 }
    ],
    connections: [
      { source: 'role', target: 'service', type: 'Serving', waypoints: [ { x: 320, y: 130 }, { x: 430, y: 130 } ] },
      { source: 'service', target: 'application', type: 'Realization', waypoints: [ { x: 600, y: 130 }, { x: 720, y: 130 } ] },
      { source: 'service', target: 'junction', type: 'Flow', waypoints: [ { x: 515, y: 168 }, { x: 653, y: 277 } ] },
      { source: 'path', target: 'junction', type: 'Flow', waypoints: [ { x: 320, y: 373 }, { x: 653, y: 373 }, { x: 653, y: 319 } ] },
      { source: 'junction', target: 'technology', type: 'Flow', waypoints: [ { x: 674, y: 298 }, { x: 720, y: 298 } ] },
      { source: 'object', target: 'service', type: 'Aggregation', waypoints: [ { x: 515, y: 260 }, { x: 515, y: 168 } ] }
    ]
  },
  [DEMO_ARCHIMATE4_VERSION]: {
    version: DEMO_ARCHIMATE4_VERSION,
    label: 'ArchiMate 4.0',
    profileSummary: 'ArchiMate 4.0 profile',
    paletteSummary: '4.0 palette; retired 3.x concepts are rejected',
    editingSummary: '4.0 editor validation',
    emptyXml: EMPTY_ARCHIMATE4_XML,
    shapes: [
      { key: 'role', type: 'Role', name: 'Customer Role', x: 170, y: 92, width: 150, height: 76 },
      { key: 'service', type: 'Service', name: 'Digital Service', x: 430, y: 92, width: 170, height: 76 },
      { key: 'application', type: 'ApplicationComponent', name: 'Experience App', x: 720, y: 92, width: 190, height: 76 },
      { key: 'path', type: 'Path', name: 'Experience Path', x: 170, y: 335, width: 150, height: 76 },
      { key: 'grouping', type: 'Grouping', name: 'Shared Context', x: 430, y: 260, width: 170, height: 76 },
      { key: 'junction', type: 'AndJunction', name: '', x: 632, y: 277, width: 42, height: 42 },
      { key: 'technology', type: 'Equipment', name: 'Edge Equipment', x: 720, y: 260, width: 190, height: 76 }
    ],
    connections: [
      { source: 'role', target: 'service', type: 'Serving', waypoints: [ { x: 320, y: 130 }, { x: 430, y: 130 } ] },
      { source: 'service', target: 'application', type: 'Realization', waypoints: [ { x: 600, y: 130 }, { x: 720, y: 130 } ] },
      { source: 'service', target: 'junction', type: 'Flow', waypoints: [ { x: 515, y: 168 }, { x: 653, y: 277 } ] },
      { source: 'path', target: 'junction', type: 'Flow', waypoints: [ { x: 320, y: 373 }, { x: 653, y: 373 }, { x: 653, y: 319 } ] },
      { source: 'junction', target: 'technology', type: 'Flow', waypoints: [ { x: 674, y: 298 }, { x: 720, y: 298 } ] },
      { source: 'grouping', target: 'service', type: 'Aggregation', waypoints: [ { x: 515, y: 260 }, { x: 515, y: 168 } ] }
    ]
  }
};

export function getDemoProfile() {
  var requestedVersion = getSearchParam('version');
  var normalizedVersion = normalizeDemoVersion(requestedVersion);

  return SAMPLE_PROFILES[normalizedVersion];
}

export function applyDemoProfileToDocument(profile, mode) {
  document.documentElement.setAttribute('data-archimate-version', profile.version);
  document.body.setAttribute('data-archimate-version', profile.version);

  setText('#profile-mode', mode);
  setText('#profile-version', profile.label);
  setText('#profile-summary', profile.profileSummary);
  setText('#palette-summary', profile.paletteSummary);
  setText('#editing-summary', mode === 'Viewer' ? 'Read-only display validation' : profile.editingSummary);

  updateDemoLink('#viewer-link', './viewer.html?version=' + profile.version);
  updateDemoLink('#editor-link', './editor.html?version=' + profile.version);
  updateVersionLink('#version-3-link', profile.version === DEMO_ARCHIMATE3_VERSION);
  updateVersionLink('#version-4-link', profile.version === DEMO_ARCHIMATE4_VERSION);
}

export function setStatus(message) {
  const status = document.querySelector('#status');

  if (status) {
    status.textContent = message;
  }
}

export function seedSampleCanvas(instance, version) {
  const profile = SAMPLE_PROFILES[normalizeDemoVersion(version)];
  const canvas = instance.get('canvas');
  const elementFactory = instance.get('elementFactory');
  const root = canvas.getRootElement();
  const shapes = {};

  profile.shapes.forEach(function(attrs) {
    shapes[attrs.key] = addShape(canvas, elementFactory, root, attrs);
  });

  profile.connections.forEach(function(connection) {
    addConnection(
      canvas,
      elementFactory,
      root,
      shapes[connection.source],
      shapes[connection.target],
      connection.type,
      connection.waypoints
    );
  });

  canvas.zoom('fit-viewport');
}

function createEmptyXml(version, name) {
  const profile = getLanguageProfile(version);
  const schemaLocation = profile.schemaLocation ?
    ' xsi:schemaLocation="' + profile.namespace + ' ' + profile.schemaLocation + '"' :
    '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<archimate:Model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="${profile.namespace}"${schemaLocation}>
  <name>${name}</name>
  <documentation></documentation>
  <archimate:Elements></archimate:Elements>
  <archimate:Views>
    <archimate:Diagrams>
      <archimate:View id="view-demo-${profile.version.replace('.', '-')}">
        <name>Demo View</name>
        <documentation></documentation>
      </archimate:View>
    </archimate:Diagrams>
  </archimate:Views>
  <archimate:PropertyDefinitions></archimate:PropertyDefinitions>
</archimate:Model>`;
}

function getSearchParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function normalizeDemoVersion(version) {
  try {
    const normalizedVersion = normalizeArchimateVersion(version || DEMO_ARCHIMATE4_VERSION);

    return normalizedVersion === DEMO_ARCHIMATE4_VERSION ?
      DEMO_ARCHIMATE4_VERSION :
      DEMO_ARCHIMATE3_VERSION;
  } catch (error) {
    console.warn(error);

    return DEMO_ARCHIMATE4_VERSION;
  }
}

function updateDemoLink(selector, href) {
  const link = document.querySelector(selector);

  if (link) {
    link.href = href;
  }
}

function updateVersionLink(selector, active) {
  const link = document.querySelector(selector);

  if (!link) {
    return;
  }

  if (active) {
    link.setAttribute('aria-current', 'true');
  } else {
    link.removeAttribute('aria-current');
  }
}

function setText(selector, text) {
  const node = document.querySelector(selector);

  if (node) {
    node.textContent = text;
  }
}

function addShape(canvas, elementFactory, root, attrs) {
  const shape = elementFactory.createShape({
    type: attrs.type,
    x: attrs.x,
    y: attrs.y,
    width: attrs.width,
    height: attrs.height
  });

  shape.name = attrs.name;
  canvas.addShape(shape, root);

  return shape;
}

function addConnection(canvas, elementFactory, root, source, target, type, waypoints) {
  const connection = elementFactory.createConnection({
    type,
    source,
    target,
    waypoints
  });

  connection.name = type;
  canvas.addConnection(connection, root);

  return connection;
}

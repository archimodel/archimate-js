import archimate3Profile from './archimate3-profile.json';
import archimate4Profile from './archimate4-profile.json';
import { getArchimate3RelationshipMap } from './archimate3-relationships';
import { getArchimate4RelationshipMap } from './archimate4-relationships';

export const DEFAULT_ARCHIMATE_VERSION = '3.2';
export const VIEWPOINT_PURPOSES = [ 'Designing', 'Deciding', 'Informing' ];
export const VIEWPOINT_CONTENT_TYPES = [ 'Details', 'Coherence', 'Overview' ];

const PROFILES = new Map([
  [ '3', archimate3Profile ],
  [ '3.0', archimate3Profile ],
  [ '3.1', archimate3Profile ],
  [ '3.2', archimate3Profile ],
  [ '4', archimate4Profile ],
  [ '4.0', archimate4Profile ]
]);

export function normalizeArchimateVersion(version) {
  if (version === undefined || version === null || version === '') {
    return DEFAULT_ARCHIMATE_VERSION;
  }

  const normalized = String(version);

  if (!PROFILES.has(normalized)) {
    throw new Error('Unsupported ArchiMate version: ' + normalized);
  }

  return PROFILES.get(normalized).version;
}

export function getLanguageProfile(version) {
  const normalized = normalizeArchimateVersion(version);

  return PROFILES.get(normalized);
}

export function createLanguageProfile(version, customization) {
  var profile = cloneProfile(getLanguageProfile(version));
  var customProfile = parseLanguageProfileCustomization(customization);

  if (!customProfile) {
    return profile;
  }

  if (customProfile.version && normalizeArchimateVersion(customProfile.version) !== profile.version) {
    throw new Error('Custom ArchiMate language profile version does not match ' + profile.version);
  }

  mergeNamedItems(profile, customProfile, 'domains', 'name');
  mergeConcepts(profile, customProfile, 'elements');
  mergeConcepts(profile, customProfile, 'connectors');
  mergeRelationshipNames(profile, customProfile);
  mergeAttributes(profile, customProfile);
  mergeViewpoints(profile, customProfile);

  profile.customized = true;

  return profile;
}

export function getBaseConceptTypeForProfile(elementType, profile) {
  var currentType = elementType;
  var visited = new Set();

  while (currentType && !visited.has(currentType)) {
    visited.add(currentType);

    var concept = getProfileConcept(currentType, profile);

    if (!concept || !concept.specializes) {
      return currentType;
    }

    currentType = concept.specializes;
  }

  return elementType;
}

export function getRelationshipMapForProfile(elementType, profile) {
  var relationshipType = getBaseConceptTypeForProfile(elementType, profile);

  if (profile && profile.version === '4.0') {
    return getArchimate4RelationshipMap(relationshipType);
  }

  return getArchimate3RelationshipMap(relationshipType);
}

function parseLanguageProfileCustomization(customization) {
  if (!customization) {
    return null;
  }

  if (typeof customization !== 'string') {
    if (!isObject(customization)) {
      throw new Error('Custom ArchiMate language profile must be an object or JSON string');
    }

    return customization;
  }

  try {
    return JSON.parse(customization);
  } catch (error) {
    throw new Error('Custom ArchiMate language profile JSON could not be parsed: ' + error.message);
  }
}

function cloneProfile(profile) {
  return JSON.parse(JSON.stringify(profile));
}

function mergeNamedItems(profile, customProfile, key, idKey) {
  if (!customProfile[key]) {
    return;
  }

  if (!Array.isArray(customProfile[key])) {
    throw new Error('Custom ArchiMate language profile ' + key + ' must be an array');
  }

  profile[key] = profile[key] || [];

  var existing = new Map(profile[key].map(function(value, index) {
    return [ value[idKey], { value: value, index: index } ];
  }));

  customProfile[key].forEach(function(value) {
    if (!value || !value[idKey]) {
      throw new Error('Custom ArchiMate language profile ' + key + ' entries require ' + idKey);
    }

    var match = existing.get(value[idKey]);

    if (match) {
      profile[key][match.index] = Object.assign({}, match.value, value);
      return;
    }

    profile[key].push(value);
  });
}

function mergeConcepts(profile, customProfile, key) {
  if (!customProfile[key]) {
    return;
  }

  if (!Array.isArray(customProfile[key])) {
    throw new Error('Custom ArchiMate language profile ' + key + ' must be an array');
  }

  var builtInTypes = new Set((profile[key] || []).map(function(concept) {
    return concept.type;
  }));

  mergeNamedItems(profile, customProfile, key, 'type');

  (profile[key] || []).forEach(function(concept) {
    if (!concept.specializes) {
      return;
    }

    if (!getProfileConcept(concept.specializes, profile)) {
      throw new Error(
        'Custom ArchiMate concept ' + concept.type + ' specializes unknown concept ' + concept.specializes
      );
    }
  });

  customProfile[key].forEach(function(concept) {
    if (!getProfileConcept(concept.type, profile)) {
      throw new Error('Custom ArchiMate concept could not be registered: ' + concept.type);
    }

    if (!builtInTypes.has(concept.type) && !concept.specializes) {
      throw new Error('Custom ArchiMate concept ' + concept.type + ' must declare specializes');
    }
  });
}

function mergeRelationshipNames(profile, customProfile) {
  if (!customProfile.relationships) {
    return;
  }

  if (!Array.isArray(customProfile.relationships)) {
    throw new Error('Custom ArchiMate language profile relationships must be an array');
  }

  var relationships = new Set(profile.relationships || []);

  customProfile.relationships.forEach(function(relationship) {
    if (typeof relationship !== 'string') {
      throw new Error('Custom ArchiMate relationship entries must be relationship names');
    }

    relationships.add(relationship);
  });

  profile.relationships = Array.from(relationships);
}

function mergeAttributes(profile, customProfile) {
  if (!customProfile.attributes) {
    return;
  }

  if (!Array.isArray(customProfile.attributes)) {
    throw new Error('Custom ArchiMate language profile attributes must be an array');
  }

  profile.attributes = (profile.attributes || []).concat(customProfile.attributes);
}

function mergeViewpoints(profile, customProfile) {
  if (!customProfile.viewpoints) {
    return;
  }

  if (!Array.isArray(customProfile.viewpoints)) {
    throw new Error('Custom ArchiMate language profile viewpoints must be an array');
  }

  customProfile.viewpoints.forEach(function(viewpoint) {
    validateViewpoint(viewpoint);
  });

  mergeNamedItems(profile, customProfile, 'viewpoints', 'id');
}

function validateViewpoint(viewpoint) {
  if (!viewpoint || !viewpoint.id) {
    throw new Error('Custom ArchiMate viewpoint entries require id');
  }

  validateViewpointTokenList(viewpoint.viewpointPurpose, VIEWPOINT_PURPOSES, 'viewpointPurpose');
  validateViewpointTokenList(viewpoint.viewpointContent, VIEWPOINT_CONTENT_TYPES, 'viewpointContent');
}

function validateViewpointTokenList(value, allowedValues, fieldName) {
  if (!value) {
    return;
  }

  var tokens = Array.isArray(value) ? value : String(value).split(/\s+/).filter(Boolean);
  var allowed = new Set(allowedValues);

  tokens.forEach(function(token) {
    if (!allowed.has(token)) {
      throw new Error('Unsupported ArchiMate viewpoint ' + fieldName + ': ' + token);
    }
  });
}

function getProfileConcept(elementType, profile) {
  var concepts = (profile && profile.elements || []).concat(profile && profile.connectors || []);

  for (const concept of concepts) {
    if (concept.type === elementType) {
      return concept;
    }
  }

  return null;
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

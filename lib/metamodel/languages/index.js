import archimate3Profile from './archimate3-profile.json';
import archimate4Profile from './archimate4-profile.json';
import { getArchimate3RelationshipMap } from './archimate3-relationships';
import { getArchimate4RelationshipMap } from './archimate4-relationships';

export const DEFAULT_ARCHIMATE_VERSION = '3.2';

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

export function getRelationshipMapForProfile(elementType, profile) {
  if (profile && profile.version === '4.0') {
    return getArchimate4RelationshipMap(elementType);
  }

  return getArchimate3RelationshipMap(elementType);
}

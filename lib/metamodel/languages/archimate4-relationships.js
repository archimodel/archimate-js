import archimate4Profile from './archimate4-profile.json' with { type: 'json' };
import { FULL_ELEMENT_MAP } from '../../util/ModelUtil.js';
import { toArchimate4Type } from './retired-concepts.js';
import {
  getRelationshipProfileCoverageReport as buildRelationshipProfileCoverageReport,
  getRelationshipProfileStats,
  normalizeRelationshipProfile,
  parseRelationshipProfile
} from './relationship-profile-loader.js';

var VALID_ARCHIMATE4_CONCEPT_TYPES = new Set(
  archimate4Profile.elements.map(function(element) {
    return element.type;
  }).concat(
    (archimate4Profile.connectors || []).map(function(connector) {
      return connector.type;
    }),
    archimate4Profile.relationships || []
  )
);
var RELATIONSHIPS = buildFallbackRelationships();
var RELATIONSHIP_PROFILE_COVERAGE = buildRelationshipProfileCoverageReport(
  RELATIONSHIPS,
  VALID_ARCHIMATE4_CONCEPT_TYPES
);
var RELATIONSHIP_PROFILE_SOURCE = 'compatibility-fallback';
var RELATIONSHIP_PROFILE_OPTIONS = {
  requireComplete: false,
  requireCompleteTargets: false
};
var RELATIONSHIP_PROFILE_METADATA = null;
var RELATIONSHIP_PROFILE_SCOPE = 'default';

export function getArchimate4RelationshipMap(elementType) {
  return RELATIONSHIPS.get(elementType);
}

export function setArchimate4RelationshipProfile(profile, options) {
  var loadOptions = Object.assign({
    requireComplete: true,
    requireCompleteTargets: true
  }, options || {});
  var parsedProfile = parseRelationshipProfile(profile);

  RELATIONSHIPS = normalizeRelationshipProfile(parsedProfile, VALID_ARCHIMATE4_CONCEPT_TYPES, loadOptions);
  RELATIONSHIP_PROFILE_COVERAGE = buildRelationshipProfileCoverageReport(
    parsedProfile,
    VALID_ARCHIMATE4_CONCEPT_TYPES
  );
  RELATIONSHIP_PROFILE_SOURCE = 'external';
  RELATIONSHIP_PROFILE_OPTIONS = {
    requireComplete: !!loadOptions.requireComplete,
    requireCompleteTargets: !!loadOptions.requireCompleteTargets
  };
  RELATIONSHIP_PROFILE_METADATA = normalizeRelationshipProfileMetadata(parsedProfile, loadOptions);
  RELATIONSHIP_PROFILE_SCOPE = loadOptions.__archimateJsRelationshipProfileScope === 'viewer-constructor' ?
    'viewer-constructor' :
    'global';
}

export function setArchimate4RelationshipProfileForViewer(profile, options) {
  return setArchimate4RelationshipProfile(profile, Object.assign({}, options || {}, {
    __archimateJsRelationshipProfileScope: 'viewer-constructor'
  }));
}

export function resetArchimate4RelationshipProfile() {
  RELATIONSHIPS = buildFallbackRelationships();
  RELATIONSHIP_PROFILE_COVERAGE = buildRelationshipProfileCoverageReport(
    RELATIONSHIPS,
    VALID_ARCHIMATE4_CONCEPT_TYPES
  );
  RELATIONSHIP_PROFILE_SOURCE = 'compatibility-fallback';
  RELATIONSHIP_PROFILE_OPTIONS = {
    requireComplete: false,
    requireCompleteTargets: false
  };
  RELATIONSHIP_PROFILE_METADATA = null;
  RELATIONSHIP_PROFILE_SCOPE = 'default';
}

export function resetArchimate4RelationshipProfileIfViewerScoped() {
  if (RELATIONSHIP_PROFILE_SCOPE === 'viewer-constructor') {
    resetArchimate4RelationshipProfile();
  }
}

export function resetArchimate4RelationshipProfileForTests() {
  resetArchimate4RelationshipProfile();
}

export function setArchimate4RelationshipMapForTests(elementType, relationships) {
  RELATIONSHIPS.set(elementType, relationships);
}

export function getArchimate4RelationshipMapsForTests() {
  return RELATIONSHIPS;
}

export function getArchimate4RelationshipProfileStatus() {
  var stats = getRelationshipProfileStats(RELATIONSHIPS);
  var coverage = RELATIONSHIP_PROFILE_COVERAGE;
  var conceptCount = VALID_ARCHIMATE4_CONCEPT_TYPES.size;

  return {
    source: RELATIONSHIP_PROFILE_SOURCE,
    sourceCount: stats.sourceCount,
    relationshipCount: stats.relationshipCount,
    targetCellCount: coverage.targetCellCount,
    missingSourceCount: coverage.missingSourceCount,
    missingTargetCellCount: coverage.missingTargetCellCount,
    conceptCount: conceptCount,
    expectedTargetCellCount: conceptCount * conceptCount,
    requireComplete: RELATIONSHIP_PROFILE_OPTIONS.requireComplete,
    requireCompleteTargets: RELATIONSHIP_PROFILE_OPTIONS.requireCompleteTargets,
    completeSourceCoverage: coverage.completeSourceCoverage,
    completeTargetCoverage: coverage.completeTargetCoverage,
    sourceScope: RELATIONSHIP_PROFILE_SCOPE,
    hasSourceMetadata: !!RELATIONSHIP_PROFILE_METADATA,
    sourceMetadata: cloneRelationshipProfileMetadata(RELATIONSHIP_PROFILE_METADATA)
  };
}

export function getArchimate4RelationshipProfileCoverageReport() {
  return cloneCoverageReport(RELATIONSHIP_PROFILE_COVERAGE);
}

function cloneCoverageReport(report) {
  return Object.assign({}, report, {
    missingSourceTypes: report.missingSourceTypes.slice(),
    missingTargetCells: report.missingTargetCells.map(function(cell) {
      return {
        source: cell.source,
        target: cell.target
      };
    })
  });
}

function normalizeRelationshipProfileMetadata(profile, options) {
  var metadata = {};

  copyKnownMetadata(metadata, getProfileMetadata(profile));
  copyKnownMetadata(metadata, options && (options.sourceMetadata || options.metadata));

  return Object.keys(metadata).length ? metadata : null;
}

function getProfileMetadata(profile) {
  if (!isObject(profile)) {
    return null;
  }

  return profile.sourceMetadata || profile.metadata || null;
}

function copyKnownMetadata(target, source) {
  if (!isObject(source)) {
    return;
  }

  [
    'sourceId',
    'sourceName',
    'sourceVersion',
    'sourceUri',
    'sourceHash',
    'sourceHashAlgorithm',
    'sourceGeneratedAt',
    'loadedAt',
    'suppliedBy'
  ].forEach(function(key) {
    var value = source[key];

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      target[key] = value;
    }
  });
}

function cloneRelationshipProfileMetadata(metadata) {
  return metadata ? Object.assign({}, metadata) : null;
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function buildFallbackRelationships() {
  var maps = new Map();

  FULL_ELEMENT_MAP.forEach(function(value, sourceType) {
    var source = toArchimate4Type(sourceType);

    if (!VALID_ARCHIMATE4_CONCEPT_TYPES.has(source) || !value.relationshipMap) {
      return;
    }

    value.relationshipMap.forEach(function(relationships, targetType) {
      var target = toArchimate4Type(targetType);

      if (!VALID_ARCHIMATE4_CONCEPT_TYPES.has(target)) {
        return;
      }

      addRelationships(maps, source, target, relationships);
    });
  });

  return maps;
}

function addRelationships(maps, source, target, relationships) {
  var sourceMap = maps.get(source);

  if (!sourceMap) {
    sourceMap = new Map();
    maps.set(source, sourceMap);
  }

  var current = sourceMap.get(target) || '';
  var merged = current;

  for (const relationship of relationships) {
    if (merged.indexOf(relationship) === -1) {
      merged += relationship;
    }
  }

  sourceMap.set(target, merged);
}

import archimate4Profile from './archimate4-profile.json';
import { FULL_ELEMENT_MAP } from '../../util/ModelUtil';
import { toArchimate4Type } from './retired-concepts';
import {
  getRelationshipProfileStats,
  normalizeRelationshipProfile
} from './relationship-profile-loader';

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
var RELATIONSHIP_PROFILE_SOURCE = 'compatibility-fallback';
var RELATIONSHIP_PROFILE_OPTIONS = {
  requireComplete: false,
  requireCompleteTargets: false
};

export function getArchimate4RelationshipMap(elementType) {
  return RELATIONSHIPS.get(elementType);
}

export function setArchimate4RelationshipProfile(profile, options) {
  var loadOptions = Object.assign({
    requireComplete: true,
    requireCompleteTargets: true
  }, options || {});

  RELATIONSHIPS = normalizeRelationshipProfile(profile, VALID_ARCHIMATE4_CONCEPT_TYPES, loadOptions);
  RELATIONSHIP_PROFILE_SOURCE = 'external';
  RELATIONSHIP_PROFILE_OPTIONS = {
    requireComplete: !!loadOptions.requireComplete,
    requireCompleteTargets: !!loadOptions.requireCompleteTargets
  };
}

export function resetArchimate4RelationshipProfileForTests() {
  RELATIONSHIPS = buildFallbackRelationships();
  RELATIONSHIP_PROFILE_SOURCE = 'compatibility-fallback';
  RELATIONSHIP_PROFILE_OPTIONS = {
    requireComplete: false,
    requireCompleteTargets: false
  };
}

export function setArchimate4RelationshipMapForTests(elementType, relationships) {
  RELATIONSHIPS.set(elementType, relationships);
}

export function getArchimate4RelationshipMapsForTests() {
  return RELATIONSHIPS;
}

export function getArchimate4RelationshipProfileStatus() {
  var stats = getRelationshipProfileStats(RELATIONSHIPS);
  var conceptCount = VALID_ARCHIMATE4_CONCEPT_TYPES.size;

  return {
    source: RELATIONSHIP_PROFILE_SOURCE,
    sourceCount: stats.sourceCount,
    relationshipCount: stats.relationshipCount,
    conceptCount: conceptCount,
    expectedTargetCellCount: conceptCount * conceptCount,
    requireComplete: RELATIONSHIP_PROFILE_OPTIONS.requireComplete,
    requireCompleteTargets: RELATIONSHIP_PROFILE_OPTIONS.requireCompleteTargets,
    completeSourceCoverage: RELATIONSHIP_PROFILE_OPTIONS.requireComplete && stats.sourceCount === conceptCount,
    completeTargetCoverage: RELATIONSHIP_PROFILE_OPTIONS.requireCompleteTargets
  };
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

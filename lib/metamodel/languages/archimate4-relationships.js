import archimate4Profile from './archimate4-profile.json';
import { FULL_ELEMENT_MAP } from '../../util/ModelUtil';
import { toArchimate4Type } from './retired-concepts';

var RELATIONSHIPS = buildFallbackRelationships();

export function getArchimate4RelationshipMap(elementType) {
  return RELATIONSHIPS.get(elementType);
}

export function setArchimate4RelationshipMapForTests(elementType, relationships) {
  RELATIONSHIPS.set(elementType, relationships);
}

export function getArchimate4RelationshipMapsForTests() {
  return RELATIONSHIPS;
}

function buildFallbackRelationships() {
  var maps = new Map();
  var validTypes = new Set(archimate4Profile.elements.map(function(element) {
    return element.type;
  }));

  FULL_ELEMENT_MAP.forEach(function(value, sourceType) {
    var source = toArchimate4Type(sourceType);

    if (!validTypes.has(source) || !value.relationshipMap) {
      return;
    }

    value.relationshipMap.forEach(function(relationships, targetType) {
      var target = toArchimate4Type(targetType);

      if (!validTypes.has(target)) {
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

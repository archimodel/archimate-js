import { FULL_ELEMENT_MAP } from '../../util/ModelUtil.js';

export function getArchimate3RelationshipMap(elementType) {
  var entry = FULL_ELEMENT_MAP.get(elementType);

  return entry && entry.relationshipMap;
}

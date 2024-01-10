import { ARCHIMATE_CONNECTION, ARCHIMATE_NODE, RELATIONSHIP_ACCESS, RELATIONSHIP_AGGREGATION, 
    RELATIONSHIP_ASSIGNMENT, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_COMPOSITION, 
    RELATIONSHIP_FLOW, RELATIONSHIP_INFLUENCE,RELATIONSHIP_REALIZATION, 
    RELATIONSHIP_SERVING, RELATIONSHIP_SPECIALIZATION, RELATIONSHIP_TRIGGERING } from "../metamodel/Concept";  

import { is, getRelationshipMap, getTypeName } from "./ModelUtil";
import { logger } from "./Logger";

const s = RELATIONSHIP_SPECIALIZATION,
    c = RELATIONSHIP_COMPOSITION,
    g = RELATIONSHIP_AGGREGATION,
    i = RELATIONSHIP_ASSIGNMENT,
    r = RELATIONSHIP_REALIZATION,
    v = RELATIONSHIP_SERVING,
    a = RELATIONSHIP_ACCESS,
    n = RELATIONSHIP_INFLUENCE,
    t = RELATIONSHIP_TRIGGERING,
    f = RELATIONSHIP_FLOW,
    o = RELATIONSHIP_ASSOCIATION;

export function getRelationshipsAllowed(sourceElementType, targetElementType, excludedRelationType) {
    var relationshipsAllowed = [];
    // logger.log({sourceElementType, targetElementType});
    if (sourceElementType && targetElementType) {
      var sourceRelationshipMap = getRelationshipMap(sourceElementType);
      var relationshipsAllowedString = sourceRelationshipMap.get(targetElementType);
      if (relationshipsAllowedString) {
        var relationship = null;
        for (const char of relationshipsAllowedString) {
            relationship = eval(char);
            if (relationship !== excludedRelationType) {
                relationshipsAllowed.push(relationship);
            }   
        }
      }
    }
    return relationshipsAllowed;
}

/*
export function getReverseRelationshipsAllowed(sourceElementType, targetElementType) {
    var reverseRelationshipsAllowed = [];

    if (sourceElementType && targetElementType) {
        var sourceRelationshipMap = getRelationshipMap(targetElementType);
        var relationshipsAllowedString = sourceRelationshipMap.get(sourceElementType);
        if (relationshipsAllowedString) {
            var menuDef = null;
            for (const char of relationshipsAllowedString) {
                menuDef = eval('REVERSE_RELATIONSHIP_MENU_MAP.get('+char+')');
                menuDef.group.name = 'From ' + getTypeName(targetElementType) + ' to ' + getTypeName(sourceElementType);
                reverseRelationshipsAllowed.push(menuDef);
            }
        }
    }
    return reverseRelationshipsAllowed;
}
*/
  
export function isRelationshipAllowed(sourceType, targetType, relationshipType) {

    if (sourceType && targetType) {
        var sourceRelationshipMap = getRelationshipMap(sourceType);
        var relationshipsAllowedString = sourceRelationshipMap.get(targetType);

        var relationship = null;
        for (const char of relationshipsAllowedString) {
            relationship = eval(char);
            if (relationship === relationshipType) {
                return true;
            }
        }
    }
    return false;
}

export function getExistingRelationships(source, target, relationshipsNode, currentRelationshipRef) {

    function filterNode(array, sourceId, targetId, relationshipRefId) {
        //logger.log({sourceId, targetId, relationshipRefId});
        return array.filter((element) => {
            //logger.log(element);
            return element.source.id === sourceId && element.target.id === targetId && element.id !== relationshipRefId;
        }); 
    }

    var existingRelationships = [];
    var sourceRefId, targetRefId;

    if (is(source.businessObject, ARCHIMATE_NODE)) {
        sourceRefId = source.businessObject.elementRef.id;
    }
    if (is(source.businessObject, ARCHIMATE_CONNECTION)) {
        sourceRefId = source.businessObject.relationshipRef.id;
    }
    if (is(target.businessObject, ARCHIMATE_NODE)) {
        targetRefId = target.businessObject.elementRef.id;
    }
    if (is(target.businessObject, ARCHIMATE_CONNECTION)) {
        targetRefId = target.businessObject.relationshipRef.id;
    }

    if (relationshipsNode) {
        var relationships = relationshipsNode.relationships || [];
        existingRelationships = filterNode(relationships, sourceRefId, targetRefId, currentRelationshipRef);
    }

    return existingRelationships;



}


  

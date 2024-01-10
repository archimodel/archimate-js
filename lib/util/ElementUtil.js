import { logger } from "./Logger";

export function getExistingElements(elementType, elementsNode, excludedElementId) {

    function filterNode(array, elementType, excludedElementId) {
        return array.filter((element) => {
            //logger.log(element);
            return element.type === elementType && element.id !== excludedElementId;
        }); 
    }

    var existingElements = [];

    if (elementsNode) {
        var elements = elementsNode.baseElements || [];
        existingElements = filterNode(elements, elementType, excludedElementId);
    }

    return existingElements.sort(function(a,b){
        return a.name.localeCompare(b.name);
    });
    

}

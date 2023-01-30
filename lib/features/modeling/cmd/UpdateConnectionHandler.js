import { logger } from "../../../util/Logger";

export default function UpdateConnectionHandler(commandStack) {
  this._commandStack = commandStack;
}

UpdateConnectionHandler.$inject = [
  'commandStack'
];

UpdateConnectionHandler.prototype.execute = function(context) {
  logger.log(context);
  var element = context.element,
        changed = [ element ],
        properties = context.properties;

  if (!element) {
    throw new Error(translate('element required'));
  }
      
  var viewElement = element.businessObject,
    relationshipRef = viewElement.relationshipRef,
    newType = properties.type;

  element.type = newType;
  relationshipRef.type = newType;

  return changed;
};
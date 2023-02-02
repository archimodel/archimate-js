import { logger } from "../../../util/Logger";

export default function UpdateRelationshipHandler(commandStack) {
  this._commandStack = commandStack;
}

UpdateRelationshipHandler.$inject = [
  'commandStack'
];

UpdateRelationshipHandler.prototype.execute = function(context) {
  logger.log(context);
  var connection = context.connection,
        changed = [ connection ],
        properties = context.properties;

  if (!connection) {
    throw new Error(translate('connection required'));
  }
      
  var archimateObject = connection.businessObject,
    relationshipRef = archimateObject.relationshipRef;

  var type = properties.type;
  if (type) {
    connection.type = properties.type;
    relationshipRef.type = properties.type;

    if (type === 'Influence') {
      connection.modifier = properties.modifier;
      relationshipRef.modifier = properties.modifier;
    }

    if (type === 'Access') {
      connection.accessType = properties.accessType;
      relationshipRef.accessType = properties.accessType;
    }

    if (type === 'Association') {
      connection.isDirected = properties.isDirected;
      relationshipRef.isDirected = properties.isDirected;
    }

  }
  
  return changed;
};
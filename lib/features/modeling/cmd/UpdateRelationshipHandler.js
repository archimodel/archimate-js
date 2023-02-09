import { RELATIONSHIP_ACCESS, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_INFLUENCE } from "../../../metamodel/Concept";
import { logger } from "../../../util/Logger";

export default function UpdateRelationshipHandler(connectionUpdater) { //commandStack) {
  //this._commandStack = commandStack;
  this._connectionUpdater = connectionUpdater;
}

UpdateRelationshipHandler.$inject = [
  //'commandStack'
  'connectionUpdater'
];

UpdateRelationshipHandler.prototype.execute = function(context) {
  logger.log(context);
  var connection = context.connection,
        changed = [ connection ],
        properties = context.properties;

  if (!connection) {
    throw new Error(translate('connection required'));
  }
      
 // var archimateObject = connection.businessObject,
 //   relationshipRef = archimateObject.relationshipRef;

  var type = properties.type,
    reverse = properties.reverse;
  if (type) {
    connection.type = properties.type;
    //relationshipRef.type = properties.type;

    if (type === RELATIONSHIP_INFLUENCE) {
      connection.modifier = properties.modifier;
      //relationshipRef.modifier = properties.modifier;
    }

    if (type === RELATIONSHIP_ACCESS) {
      connection.accessType = properties.accessType;
      //relationshipRef.accessType = properties.accessType;
    }

    if (type === RELATIONSHIP_ASSOCIATION) {
      connection.isDirected = properties.isDirected;
      //relationshipRef.isDirected = properties.isDirected;
    }

    if (reverse) {
      var newSource = connection.target;
      connection.target = connection.source;
      connection.source = newSource;

      connection.waypoints.reverse();

      this._connectionUpdater.updateConnectionWaypoints(context);
    }

  }
  
  this._connectionUpdater.updateConnectionObjects(context);

  return changed;
};
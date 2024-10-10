import { ARCHIMATE_CONNECTION, ARCHIMATE_NODE, ARCHIMATE_RELATIONSHIPS, ARCHIMATE_RELATIONSHIP, RELATIONSHIP_ACCESS, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_INFLUENCE } from "../../../metamodel/Concept";
import { logger } from "../../../util/Logger";
import { CONNECTION_RELATIONSHIP, is } from "../../../util/ModelUtil";

export default function ReplaceRelationshipRefHandler(eventBus, canvas, archimateFactory) { //commandStack) {
  this._eventBus = eventBus;
  this._canvas = canvas;
  this._archimateFactory = archimateFactory;
}

ReplaceRelationshipRefHandler.$inject = [
  'eventBus',
  'canvas',
  'archimateFactory'
];

ReplaceRelationshipRefHandler.prototype.execute = function(context) {
  logger.log(context);

  var connection = context.connection,
    newRelationshipRef = context.newRelationshipRef,
    oldRelationshipRef = context.oldRelationshipRef || connection.businessObject.relationshipRef,
    source = connection.source,
    target = connection.target,
    elements = [];

  var eventBus = this._eventBus,
    canvas = this._canvas,
    archimateFactory = this._archimateFactory;

  if (connection.businessObject.type === CONNECTION_RELATIONSHIP) {

    var relationshipsNode = canvas._rootElement.modelRef.relationshipsNode;

    if (!relationshipsNode) {
      relationshipsNode = archimateFactory.create(ARCHIMATE_RELATIONSHIPS, { relationships: [] });
      relationshipsNode.$parent = canvas._rootElement.modelRef;
      canvas._rootElement.modelRef.relationshipsNode = relationshipsNode;
    }

    if (!newRelationshipRef) {
        newRelationshipRef = archimateFactory.create(ARCHIMATE_RELATIONSHIP, {type: connection.type});
        newRelationshipRef.name = connection.name;
        newRelationshipRef.$parent = relationshipsNode;
        relationshipsNode.relationships.push(newRelationshipRef);


      if (connection.type === RELATIONSHIP_INFLUENCE) {
        newRelationshipRef.modifier = connection.typeOption;
      }

      if (connection.type === RELATIONSHIP_ACCESS) {
        newRelationshipRef.accessType = connection.typeOption;
      } 
    
      if (connection.type === RELATIONSHIP_ASSOCIATION) {
        newRelationshipRef.isDirected = connection.typeOption;
      }

      if (is(source.businessObject, ARCHIMATE_NODE)) {
        newRelationshipRef.source = source.businessObject.elementRef;
      }
      if (is(source.businessObject, ARCHIMATE_CONNECTION)) {
        newRelationshipRef.source = source.businessObject.relationshipRef;
      }
      if (is(target.businessObject, ARCHIMATE_NODE)) {
        newRelationshipRef.target = target.businessObject.elementRef;
      }
      if (is(target.businessObject, ARCHIMATE_CONNECTION)) {
        newRelationshipRef.target = target.businessObject.relationshipRef;
      }
    }

    connection.name = newRelationshipRef.name;

    var type = newRelationshipRef.type;
    connection.type = type;
    delete connection.typeOption;
  
    if (type === RELATIONSHIP_INFLUENCE) {
      connection.typeOption = newRelationshipRef.modifier;
    }

    if (type === RELATIONSHIP_ACCESS) {
      connection.typeOption = newRelationshipRef.accessType;
    }

    if (type === RELATIONSHIP_ASSOCIATION) {
      connection.typeOption = newRelationshipRef.isDirected;
    }

    connection.businessObject.relationshipRef = newRelationshipRef;

    context.oldRelationshipRef = oldRelationshipRef;

    elements.push(connection);

    eventBus.fire('elements.changed', { elements });
    return elements;

  }

  /*
  var type = properties.type,
    reverse = properties.reverse,
    existingRelationship = properties.existingRelationship;

  if (existingRelationship) {
    connection.businessObject.relationshipRef = existingRelationship;
    connection.name = existingRelationship.name;
  }

  if (type) {
    connection.type = properties.type;

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

      var newWaypoints = connection.waypoints.reverse();

      this._connectionUpdater.updateConnectionWaypoints(context);
      //logger.log('updateWaypoints after reverse');
      //this._eventBus.fire('connection.updateWaypoints', { connection: connection });
      //this._modeling.updateWaypoints(connection, newWaypoints);
      
    }
   

  }
  
  this._connectionUpdater.updateConnectionObjects(context);

  return changed;
   */
};
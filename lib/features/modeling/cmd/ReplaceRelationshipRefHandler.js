import { ARCHIMATE_CONNECTION, ARCHIMATE_NODE, ARCHIMATE_RELATIONSHIPS, ARCHIMATE_RELATIONSHIP, RELATIONSHIP_ACCESS, RELATIONSHIP_ASSOCIATION, RELATIONSHIP_INFLUENCE } from '../../../metamodel/Concept';
import { logger } from '../../../util/Logger';
import { canApplyRelationshipMultiplicity } from '../../../util/JunctionUtil';
import { CONNECTION_RELATIONSHIP, is } from '../../../util/ModelUtil';

export default function ReplaceRelationshipRefHandler(eventBus, canvas, archimateFactory) { // commandStack) {
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
    var relationshipProperties = isRelationshipProperties(newRelationshipRef) && newRelationshipRef;

    if (!relationshipsNode) {
      relationshipsNode = archimateFactory.create(ARCHIMATE_RELATIONSHIPS, { relationships: [] });
      relationshipsNode.$parent = canvas._rootElement.modelRef;
      canvas._rootElement.modelRef.relationshipsNode = relationshipsNode;
    }

    if (relationshipProperties) {
      newRelationshipRef = oldRelationshipRef;
    }

    if (!newRelationshipRef) {
      newRelationshipRef = archimateFactory.create(ARCHIMATE_RELATIONSHIP, { type: connection.type });
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

      setRelationshipEnds(newRelationshipRef, source, target);
      copyMultiplicityFromConnection(newRelationshipRef, connection);
    }

    if (relationshipProperties) {
      applyRelationshipProperties(newRelationshipRef, relationshipProperties, connection);
      setRelationshipEnds(newRelationshipRef, source, target);
    }

    connection.name = newRelationshipRef.name;

    var type = newRelationshipRef.type;
    connection.type = type;
    delete connection.typeOption;
    delete connection.modifier;
    delete connection.accessType;
    delete connection.isDirected;

    if (type === RELATIONSHIP_INFLUENCE) {
      connection.typeOption = newRelationshipRef.modifier;
      connection.modifier = newRelationshipRef.modifier;
    }

    if (type === RELATIONSHIP_ACCESS) {
      connection.typeOption = newRelationshipRef.accessType;
      connection.accessType = newRelationshipRef.accessType;
    }

    if (type === RELATIONSHIP_ASSOCIATION) {
      connection.typeOption = newRelationshipRef.isDirected;
      connection.isDirected = newRelationshipRef.isDirected;
    }

    if (canApplyRelationshipMultiplicity(connection)) {
      connection.sourceMultiplicity = newRelationshipRef.sourceMultiplicity;
      connection.targetMultiplicity = newRelationshipRef.targetMultiplicity;
    } else {
      delete connection.sourceMultiplicity;
      delete connection.targetMultiplicity;
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

function isRelationshipProperties(value) {
  return value && typeof value === 'object' &&
    !value.id &&
    !value.source &&
    !value.target &&
    (
      hasProperty(value, 'type') ||
      hasProperty(value, 'modifier') ||
      hasProperty(value, 'accessType') ||
      hasProperty(value, 'isDirected') ||
      hasProperty(value, 'sourceMultiplicity') ||
      hasProperty(value, 'targetMultiplicity')
    );
}

function applyRelationshipProperties(relationship, properties, connection) {
  relationship.type = properties.type || connection.type || relationship.type;
  relationship.name = properties.name || connection.name || relationship.name;

  delete relationship.modifier;
  delete relationship.accessType;
  delete relationship.isDirected;

  if (relationship.type === RELATIONSHIP_INFLUENCE) {
    setOptionalProperty(relationship, 'modifier', hasProperty(properties, 'modifier') ? properties.modifier : connection.typeOption);
  }

  if (relationship.type === RELATIONSHIP_ACCESS) {
    setOptionalProperty(relationship, 'accessType', hasProperty(properties, 'accessType') ? properties.accessType : connection.typeOption);
  }

  if (relationship.type === RELATIONSHIP_ASSOCIATION) {
    setOptionalProperty(relationship, 'isDirected', hasProperty(properties, 'isDirected') ? properties.isDirected : connection.typeOption);
  }

  if (!canApplyRelationshipMultiplicity(connection)) {
    delete relationship.sourceMultiplicity;
    delete relationship.targetMultiplicity;
    return;
  }

  if (hasProperty(properties, 'sourceMultiplicity')) {
    setOptionalProperty(relationship, 'sourceMultiplicity', properties.sourceMultiplicity);
  } else if (connection.sourceMultiplicity) {
    relationship.sourceMultiplicity = connection.sourceMultiplicity;
  }

  if (hasProperty(properties, 'targetMultiplicity')) {
    setOptionalProperty(relationship, 'targetMultiplicity', properties.targetMultiplicity);
  } else if (connection.targetMultiplicity) {
    relationship.targetMultiplicity = connection.targetMultiplicity;
  }
}

function copyMultiplicityFromConnection(relationship, connection) {
  if (!canApplyRelationshipMultiplicity(connection)) {
    delete relationship.sourceMultiplicity;
    delete relationship.targetMultiplicity;
    return;
  }

  if (connection.sourceMultiplicity) {
    relationship.sourceMultiplicity = connection.sourceMultiplicity;
  }

  if (connection.targetMultiplicity) {
    relationship.targetMultiplicity = connection.targetMultiplicity;
  }
}

function setRelationshipEnds(relationship, source, target) {
  if (is(source.businessObject, ARCHIMATE_NODE)) {
    relationship.source = source.businessObject.elementRef;
  }
  if (is(source.businessObject, ARCHIMATE_CONNECTION)) {
    relationship.source = source.businessObject.relationshipRef;
  }
  if (is(target.businessObject, ARCHIMATE_NODE)) {
    relationship.target = target.businessObject.elementRef;
  }
  if (is(target.businessObject, ARCHIMATE_CONNECTION)) {
    relationship.target = target.businessObject.relationshipRef;
  }
}

function setOptionalProperty(target, property, value) {
  if (value === undefined || value === null || value === '') {
    delete target[property];
  } else {
    target[property] = value;
  }
}

function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}

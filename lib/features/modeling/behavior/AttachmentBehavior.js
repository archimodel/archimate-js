import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { getMid } from 'diagram-js/lib/layout/LayoutUtil';
import { logger } from '../../../util/Logger';
import { NOTE, is, isAny } from '../../../util/ModelUtil';
import { getExistingRelationships } from '../../../util/RelationshipUtil';
import { ARCHIMATE_NODE, ARCHIMATE_VIEW } from '../../../metamodel/Concept';
import { remove as collectionRemove } from 'diagram-js/lib/util/Collections';


// create nested elements relationship if needed
export default function AttachmentBehavior(injector, canvas, modeling) {

  injector.invoke(CommandInterceptor, this);

  this._modeling = modeling;
  this._canvas = canvas;

  var self = this;

  function updateNodes(event) {
    logger.log('updateAttachment(event)');
    logger.log(event);

    var shape = event.context.shape,
      newHost = event.context.newHost,
      oldHost = event.context.oldHost;

    if (!isAny(shape.businessObject, [ARCHIMATE_NODE])) {
      return;
    }

    self.updateNodes(shape, newHost, oldHost);
  }

  function reverteUpdateNodes(event) {
    logger.log('revertUpdateAttachment(event)');
    logger.log(event);

    var shape = event.context.shape,
      newHost = event.context.oldHost,
      oldHost = event.context.newHost;


    if (!isAny(shape.businessObject, [ARCHIMATE_NODE])) {
      return;
    }

    self.updateNodes(shape, newHost, oldHost);
  }

  function updateConnections(event) {
    logger.log('updateConnections(event)');
    logger.log(event);

    var shape = event.context.shape,
      newHost = event.context.newHost,
      oldHost = event.context.oldHost;

    self.updateConnections(shape, newHost, oldHost);
  }

  this.executed([ 'element.updateAttachment' ], updateNodes);

  this.reverted([ 'element.updateAttachment' ], reverteUpdateNodes);

  this.postExecuted([ 'element.updateAttachment' ], updateConnections);

}

inherits(AttachmentBehavior, CommandInterceptor);

AttachmentBehavior.$inject = [
  'injector',
  'canvas',
  'modeling'
]; 

// implementation //////////////////////

AttachmentBehavior.prototype.updateNodes = function(shape, newHost, oldHost) {

  shape.businessObject.$parent = shape.host && shape.host.businessObject;

  if (oldHost && is(oldHost.businessObject, ARCHIMATE_NODE )) {
    // delete from oldHost.businessObject.nodes array the node of the current shape (shape.businessObject)
    collectionRemove(oldHost.businessObject.nodes, shape.businessObject);
  }

  if (oldHost && is(oldHost.businessObject, ARCHIMATE_VIEW)) {
    // delete from oldHost.businessObject.nodes array the node of the current shape (shape.businessObject)
    collectionRemove(oldHost.businessObject.viewElements, shape.businessObject);
  }

  if (newHost && is(newHost.businessObject, ARCHIMATE_NODE )) {
      if (!newHost.businessObject.nodes) {
        newHost.businessObject.nodes = [];
      }
    newHost.businessObject.nodes.push(shape.businessObject);
  }

  if (newHost && is(newHost.businessObject, ARCHIMATE_VIEW)) {
    if (!newHost.businessObject.viewElements) {
      newHost.businessObject.viewElements = [];
    }
    newHost.businessObject.viewElements.push(shape.businessObject);
  }

}

AttachmentBehavior.prototype.updateConnections = function(shape, newHost, oldHost) {

  var modeling = this._modeling,
    canvas = this._canvas;

  if (!oldHost || !newHost) {
    return;
  }

  if (shape.type !== NOTE) { 
    var relationshipsNode = canvas._rootElement.modelRef.relationshipsNode;

    var allRelationships = [];
    // chek if there is nested relationship from shape to oldHost and create connection
    var existingRelationships = getExistingRelationships(shape, oldHost, relationshipsNode);
    for (const relationship of existingRelationships) {
      allRelationships.push( {relationshipRef: relationship, source: shape, target: oldHost});
    }

    // chek if there is nested relationship from oldHost to shape
    var existingRelationships = getExistingRelationships(oldHost, shape, relationshipsNode);
    for (const relationship of existingRelationships) {
      allRelationships.push( {relationshipRef: relationship, source: oldHost, target: shape});
    }

    // create all connections
    createConnections(modeling, allRelationships);

  }
  // check if there is connection between shape to newHost and delete connection
  // keep relationship in relationshsipsNode

  var removeConnections = [];
  for (const connection of shape.incoming) {
    logger.log(connection);
    if (connection.source.id === newHost.id) {
      logger.log('delete incoming connection from newHost to shape');
      removeConnections.push(connection);
    }
  }

  for (const connection of shape.outgoing) {
    logger.log(connection);
    if (connection.target.id === newHost.id) {
      logger.log('delete outgoing connection from shape to newHost');
      removeConnections.push(connection);
    }
  }

  modeling.removeElements(removeConnections);

};


function addStep(point, step) {
  return {
    x: point.x + step,
    y: point.y + step
  }
}

function createConnections(modeling, allRelationships) {

  if (allRelationships.length !== 0) {
    // if true, render all connections between source and target
    var step = 10,
      newStep = 0;

    for (const relationship of allRelationships) {

      var source = relationship.source,
        target = relationship.target;

      var hints = {
        connectionStart: addStep(getMid(source), newStep),
        connectionEnd: addStep(getMid(target), newStep)
      };

      newStep = newStep + step;

      var attrs = {
        type: relationship.relationshipRef.type,
        relationshipRef: relationship.relationshipRef
      };

      modeling.createConnection(source, target, attrs, source.parent, hints);

    }
  }
}

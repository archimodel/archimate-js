import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { remove as collectionRemove } from 'diagram-js/lib/util/Collections';

import { logger } from "../../../util/Logger";
import { BLACK_RGBA } from '../../../draw/ArchimateRendererUtil';

/**
 * Creates archimate moddle for new connection.
 *
 * @param {ArchimateFactory} archimateFactory
 * @param {Injector} injector
 */
export default function CreateConnectionBehavior(archimateFactory, injector) {
  injector.invoke(CommandInterceptor, this);

  this.executed('connection.create', function(context) {
    logger.log(context);

    var connection = context.connection,
        archimateObject = connection.businessObject,
        source = context.source,
        target = context.target,
        view = context.parent.businessObject,
        relationshipsNode = context.parent.modelRef.relationshipsNode;

    if (archimateObject.type === 'Relationship') {

      var relationship = archimateFactory.createRelationship(connection.type);
      relationship.source = source.businessObject.elementRef;
      relationship.target = target.businessObject.elementRef;

      archimateObject.relationshipRef = relationship;

      if (!relationshipsNode) {
          relationshipsNode = archimateFactory.create('archimate:Relationships', { relationships: [] });
          context.parent.modelRef.relationshipsNode = relationshipsNode;
          relationshipsNode.$parent = context.parent.modelRef;
      }

      var relationships = relationshipsNode.get('relationships');
      relationships.push(archimateObject.relationshipRef);
      archimateObject.relationshipRef.$parent = relationshipsNode;

    }
    
    /*
    // update connection businessObject with correct source 
    // and target businessObject (Moddle object)
    archimateObject.source = source.businessObject;
    archimateObject.target = target.businessObject;

    if (connection.type !== 'Line') {
      archimateObject.relationshipRef.source = source.businessObject.elementRef;
      archimateObject.relationshipRef.target = target.businessObject.elementRef;

      if (!relationshipsNode) {
          relationshipsNode = archimateFactory.create('archimate:Relationships', { relationships: [] });
          context.parent.modelRef.relationshipsNode = relationshipsNode;
          relationshipsNode.$parent = context.parent.modelRef;
      }

      var relationships = relationshipsNode.get('relationships');

      relationships.push(archimateObject.relationshipRef);
      archimateObject.relationshipRef.$parent = relationshipsNode;
    }

    var style = archimateFactory.create('archimate:Style', { 'lineWidth': 1}),
      lineColor = archimateFactory.create('archimate:LineColor', BLACK_RGBA);
    
    style.lineColor = lineColor;
    archimateObject.style = style;
    */

    var viewElements = view.get('viewElements');

    viewElements.push(archimateObject);
    archimateObject.$parent = view;

  }, true);


  this.executed('connection.delete', function(context) {
    logger.log(context);
    
    var connection = context.connection,
        archimateObject = connection.businessObject,
        view = context.parent.businessObject;

        var viewElements = view.get('viewElements');

        collectionRemove(viewElements, archimateObject);
        
  }, true);

}

CreateConnectionBehavior.$inject = [
  'archimateFactory',
  'injector'
];

inherits(CreateConnectionBehavior, CommandInterceptor);


// implementation //////////



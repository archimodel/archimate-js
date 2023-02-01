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
        viewElement = connection.businessObject,
        source = context.source,
        target = context.target,
        view = context.parent.businessObject,
        relationshipsNode = context.parent.modelRef.relationshipsNode;

    // update connection businessObject with correct source 
    // and target businessObject (Moddle object)
    viewElement.source = source.businessObject;
    viewElement.target = target.businessObject;

    if (connection.type !== 'Line') {
      viewElement.relationshipRef.source = source.businessObject.elementRef;
      viewElement.relationshipRef.target = target.businessObject.elementRef;

      if (!relationshipsNode) {
          relationshipsNode = archimateFactory.create('archimate:Relationships', { relationships: [] });
          context.parent.modelRef.relationshipsNode = relationshipsNode;
          relationshipsNode.$parent = context.parent.modelRef;
      }

      var relationships = relationshipsNode.get('relationships');

      relationships.push(viewElement.relationshipRef);
      viewElement.relationshipRef.$parent = relationshipsNode;
    }

    var style = archimateFactory.create('archimate:Style', { 'lineWidth': 1}),
      lineColor = archimateFactory.create('archimate:LineColor', BLACK_RGBA);
    
    style.lineColor = lineColor;
    viewElement.style = style;

    var viewElements = view.get('viewElements');

    viewElements.push(viewElement);
    viewElement.$parent = view;

  }, true);


  this.executed('connection.delete', function(context) {
    logger.log(context);
    
    var connection = context.connection,
        viewElement = connection.businessObject,
        view = context.parent.businessObject;

        var viewElements = view.get('viewElements');

        collectionRemove(viewElements, viewElement);
        
  }, true);

}

CreateConnectionBehavior.$inject = [
  'archimateFactory',
  'injector'
];

inherits(CreateConnectionBehavior, CommandInterceptor);


// implementation //////////



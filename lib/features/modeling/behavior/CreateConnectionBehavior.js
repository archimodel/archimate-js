import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { logger } from "../../../util/Logger";

/**
 * Creates DMN-specific refs for new connection.
 *
 * @param {ArchimateFactory} archimateFactory
 * @param {Injector} injector
 */
export default function CreateConnectionBehavior(archimateFactory, injector) {
  injector.invoke(CommandInterceptor, this);

  this.preExecute('commandStack.connection.create', function(context) {
      logger.log('commandStack.connection.create preExecute(context)');
      logger.log(context);
    },
    true);

  this.preExecute('connection.create', function(context) {
    logger.log('connection.create preExecute(context)');
    logger.log(context);
    logger.log(context.connectionStart);

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

        viewElement.relationshipRef.source = source.businessObject.elementRef;
        viewElement.relationshipRef.target = target.businessObject.elementRef;

        // update with correct Moddel element for XML export
        // viewElement.$parent => view Moddle
        // and relationshipRef.$parent => archimate:Relationships
        // var viewModdle = parent.businessObject;
        //viewElement.$parent = viewModdle;
        //viewElement.relationshipRef.$parent = 

        var viewElements = view.get('viewElements');

        viewElements.push(viewElement);
        viewElement.$parent = view;
    
        if (!relationshipsNode) {
            relationshipsNode = archimateFactory.create('archimate:Relationships', { relationships: [] });
            context.parent.modelRef.relationshipsNode = relationshipsNode;
            relationshipsNode.$parent = context.parent.modelRef;
        }

        var relationships = relationshipsNode.get('relationships');

        relationships.push(viewElement.relationshipRef);
        viewElement.relationshipRef.$parent = relationshipsNode;


        // TODO Update relationshipRef.type with final connection type 
        // relationshipRef.type = ...
        // connectionBO..type = ...

  }, true);


  this.executed([
    'connection.delete',
  ], function(context) {
    logger.log('connection.delete executed(context)');
    logger.log(context);
    
    var connection = context.connection,
        viewElement = connection.businessObject,
        view = context.parent.businessObject;

        var viewElements = view.get('viewElements');

        viewElements.forEach((element, index, arr) => {
          if (element.id === connection.id) {
            arr.splice(index, 1);
          }
        });
        
  }, true);

}

CreateConnectionBehavior.$inject = [
  'archimateFactory',
  'injector'
];

inherits(CreateConnectionBehavior, CommandInterceptor);


// helpers //////////


import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { logger } from '../../../util/Logger';
import { NOTE } from '../../../util/ModelUtil';


export default function AppendBehavior(eventBus) {

  CommandInterceptor.call(this, eventBus);

  // assign correct shape position unless already set

  this.preExecute('shape.append', function(context) {
    logger.log({context});

    var source = context.source,
        shape = context.shape;

    if (!context.connection) {
      if (shape.type === NOTE) {
        context.connection = {type : 'Line'}
      }
    }

    if (!context.position) {

      context.position = {
        x: source.x + source.width + 80 + shape.width / 2,
        y: source.y + source.height / 2
      };

    }
  }, true);
}

inherits(AppendBehavior, CommandInterceptor);

AppendBehavior.$inject = [
  'eventBus'
];
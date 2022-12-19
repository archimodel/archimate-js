import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isLabel } from '../../../util/LabelUtil';

import { getElementRef } from '../../../util/ModelUtil';

import { logger } from "../../../util/Logger";
import { is } from 'immutable';

/**
 * Unclaims model IDs on element deletion.
 *
 * @param {Canvas} canvas
 * @param {Injector} injector
 * @param {Moddle} moddle
 * @param {Modeling} modeling
 */
export default function UnclaimIdBehavior(canvas, injector, moddle, modeling) {
  injector.invoke(CommandInterceptor, this);

  this.preExecute('shape.delete', function(event) {

    var context = event.context,
        shape = context.shape,
        elementRef = getElementRef(shape);

    logger.log('shape.delete in UnclaimIdBehavior');
    logger.log(shape);

    if (isLabel(shape)) {
      return;
    }

    if (shape.type === 'archimate:Note') {
      return;
    }

    modeling.unclaimId(elementRef.id, elementRef);
  });

  this.preExecute('canvas.updateRoot', function() {

    var rootElement = canvas.getRootElement(),
        rootElementRef = getElementRef(rootElement);

    logger.log('canvas.updateRoot in UnclaimIdBehavior');
    logger.log(rootElement);

    moddle.ids.unclaim(rootElementRef.id);
  });
}

inherits(UnclaimIdBehavior, CommandInterceptor);

UnclaimIdBehavior.$inject = [ 'canvas', 'injector', 'moddle', 'modeling' ];
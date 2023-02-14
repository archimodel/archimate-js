import { logger } from '../../util/Logger';
import { getNewShapePosition } from './ArchimateAutoPlaceUtil';


/**
 * Archimate auto-place behavior.
 *
 * @param {EventBus} eventBus
 */
export default function AutoPlace(eventBus) {
  eventBus.on('autoPlace', function(context) {
    logger.log(context);
    var shape = context.shape,
        source = context.source;

    return getNewShapePosition(source, shape);
  });
}

AutoPlace.$inject = [ 'eventBus' ];
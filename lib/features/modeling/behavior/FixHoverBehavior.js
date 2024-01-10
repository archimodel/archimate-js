import { logger } from '../../../util/Logger';
import { is } from '../../../util/ModelUtil';

var HIGH_PRIORITY = 1500;


/**
 * Correct hover targets in certain situations to improve diagram interaction.
 *
 * @param {ElementRegistry} elementRegistry
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 */
export default function FixHoverBehavior(elementRegistry, eventBus, canvas) {

  eventBus.on([
    'create.hover',
    'create.move',
    'create.end',
    'shape.move.hover',
    'shape.move.move',
    'shape.move.end'
  ], HIGH_PRIORITY, function(event) {
    logger.log({event});
    var context = event.context,
        shape = context.shape || event.shape,
        hover = event.hover;

    var rootElement = canvas.getRootElement();

    //var elementRef = shape.businessObject.elementRef;

    if (hover !== rootElement) { // && (shape.labelTarget || (elementRef && is(elementRef, 'archimate:Group')))) {
      event.hover = rootElement;
      event.hoverGfx = elementRegistry.getGraphics(event.hover);
    }
  });

}

FixHoverBehavior.$inject = [
  'elementRegistry',
  'eventBus',
  'canvas'
];
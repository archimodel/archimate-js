import {
  forEach,
  assign
} from 'min-dash';
import { ARCHIMATE_FONT,
  ARCHIMATE_STYLE,
  ARCHIMATE_FILLCOLOR,
  ARCHIMATE_LINECOLOR,
  ARCHIMATE_NODE,
  ARCHIMATE_CONNECTION
} from '../../../metamodel/Concept';
import { toHex, toRgba } from '../../../util/ColorUtil';
import { logger } from '../../../util/Logger';
import { is } from '../../../util/ModelUtil';

export default function UpdateStyleHandler(eventBus, archimateFactory) {
  //this._commandStack = commandStack;
  this._eventBus = eventBus;
  this._archimateFactory = archimateFactory;
}

UpdateStyleHandler.$inject = [
  //'commandStack',
  'eventBus',
  'archimateFactory'
];

/*
style.lineWidth     // no lineWidth for shape
style.fontName
style.fontSize
style.fontStyle
style.fontColor
style.fillColor      //no fillColor for connection
style.lineColor
style.textAlignment  //no text alignement for connection
style.textPosition   //no text position for connection
*/

UpdateStyleHandler.prototype.execute = function(context) {
  logger.log(context);
  var targets = context.targets,
        newStyle = context.newStyle,
        elements = [];

  var archimateFactory = this._archimateFactory,
    eventBus = this._eventBus;

  forEach(targets, function(target) {

    var element = target.element;

    var style = element.businessObject.style;
  
    if (!style) {
      style = archimateFactory.create(ARCHIMATE_STYLE);
      style.$parent = element.businessObject;
      element.businessObject.style = style;
    }

    // update fillColor moddle with new fillColor in style object passing in context
    // or with fillColor set in element properties
    // update fillColor element property
    // only for node object
    if (is(element.businessObject, ARCHIMATE_NODE)) {
      var fillColor = newStyle && newStyle.fillColor || element.style.fillColor;
      if (!style.fillColor) {
        style.fillColor = archimateFactory.create(ARCHIMATE_FILLCOLOR, toRgba(fillColor));
        style.fillColor.$parent = style;
      } else {
        assign(style.fillColor, toRgba(fillColor));
      }

      assign(element.style, {
        fillColor: fillColor
      });
    }

    // update lineColor moddle with new lineColor in style object passing in context
    // or with lineColor set in element properties
    // update lineColor element property
    var lineColor = newStyle && newStyle.lineColor || element.style.lineColor;

    if (!style.lineColor) {
      style.lineColor = archimateFactory.create(ARCHIMATE_LINECOLOR, toRgba(lineColor));
      style.lineColor.$parent = style;
    } else {
      assign(style.lineColor, toRgba(lineColor));
    }

    assign(element.style, {
      lineColor: lineColor
    });

    // update lineWidth moddle with new lineWidth in style object passing in context
    // or with lineWidth set in element properties
    // update lineWidth element property
    // only for connection object
    if (is(element.businessObject, ARCHIMATE_CONNECTION)) {
      var lineWidth = newStyle && newStyle.lineWidth || element.style.lineWidth;
      style.lineWidth = lineWidth;

      assign(element.style, {
        lineWidth: lineWidth
      });
    }

    // update font moddle with new font properties in style object passing in context
    // or with font properties set in element properties
    // update font element properties
    var fontName = newStyle && newStyle.fontName || element.style.fontName,
      fontSize = newStyle && newStyle.fontSize || element.style.fontSize,
      fontColor = newStyle && newStyle.fontColor || element.style.fontColor,
      fontStyle = newStyle && newStyle.fontStyle || element.style.fontStyle;
    
    var font = {
      name: fontName,
      size: fontSize,
      style: fontStyle,
      color: toRgba(fontColor) || undefined
    }

    if (!style.font) {
      style.font = archimateFactory.create(ARCHIMATE_FONT, font);
      style.font.$parent = style;
    } else {
      assign(style.font, font);
    }

    assign(element.style, {
      fontName: fontName,
      fontSize: fontSize,
      fontColor: fontColor,
      fontStyle: fontStyle
    });

    if (is(element.businessObject, ARCHIMATE_NODE)) {
      var textAlignment = newStyle && newStyle.textAlignment || element.style.textAlignment,
        textPosition = newStyle && newStyle.textPosition || element.style.textPosition;

      style.textAlign = textAlignment+'-'+textPosition;

      assign(element.style, {
        textAlignment: textAlignment,
        textPosition: textPosition
      });
    }

    elements.push(element);

  });

  eventBus.fire('elements.changed', { elements });
  /*
    self._commandStack.execute('element.changed', {
      element: element
    });
  */
  return elements;
};

UpdateStyleHandler.prototype.revert = function(context) {
  logger.log(context);
  var targets = context.targets,
        newStyle = context.newStyle,
        elements = [];

  var eventBus = this._eventBus;

  if (!newStyle) {
    return;
  }

  forEach(targets, function(target) {

    var element = target.element,
      oldStyle = target.oldStyle;

    var style = element.businessObject.style;

    // update fillColor moddle with old fillColor in style object passing in context
    // update fillColor element property
    // only for node object
    if (is(element.businessObject, ARCHIMATE_NODE)) {
      var fillColor = oldStyle.fillColor;
      if (fillColor) {
        assign(style.fillColor, toRgba(fillColor));
        assign(element.style, {
          fillColor: fillColor
        });
      }
    }

    // update lineColor moddle with old lineColor in style object passing in context
    // update lineColor element property
    var lineColor = oldStyle.lineColor;
    if (lineColor) {
      assign(style.lineColor, toRgba(lineColor));
      assign(element.style, {
        lineColor: lineColor
      });
    }

    if (is(element.businessObject, ARCHIMATE_CONNECTION)) {
      var lineWidth = oldStyle.lineWidth;
      style.lineWidth = lineWidth;
      assign(element.style, {
        lineWidth: lineWidth
      });
    }

    // update font moddle with old font properties in style object passing in context
    // or with font properties set in element properties
    // update font element properties
    assign(style.font, {
      name: oldStyle.fontName,
      size: oldStyle.fontSize,
      color: toRgba(oldStyle.fontColor),
      style: oldStyle.fontStyle
    });

    assign(element.style, {
      fontName: oldStyle.fontName,
      fontSize: oldStyle.fontSize,
      fontColor: toRgba(oldStyle.fontColor),
      fontStyle: oldStyle.fontStyle
    });

    if (is(element.businessObject, ARCHIMATE_NODE)) {
      var textAlignment = oldStyle.textAlignment,
        textPosition = oldStyle.textPosition;
      if (textAlignment && textPosition) {
        style.textAlign = textAlignment+'-'+textPosition;
        assign(element.style, {
          textAlignment: textAlignment,
          textPosition: textPosition
        });
      }
    }

    elements.push(element);

  });

  eventBus.fire('elements.changed', { elements });
  /*
    self._commandStack.execute('element.changed', {
      element: element
    });
  */
  return elements;
};

// Helper
// Get a Style Moddle object and serilize it in a style attribute for ShapeImpl or ConnectionImpl
export function serializeStyle(style) {
  var serializedStyle = {};

  if (style.fillColor) {
    assign(serializedStyle, {
      fillColor: toHex(style.fillColor)
    });
  }

  if (style.lineColor) {
    assign(serializedStyle, {
      lineColor: toHex(style.lineColor)
    });
  }
  
  if (style.lineWidth) {
    assign(serializedStyle, {
      lineWidth: style.lineWidth
    });
  }

  if (style.textAlign) {
    var textAlignArray = style.textAlign.split('-');
    assign(serializedStyle, {
      textAlignment: textAlignArray[0],
      textPosition: textAlignArray[1]
    });
  }

  if (style.font) {
     assign(serializedStyle,{
      fontName: style.font.name,
      fontSize: style.font.size,
      fontColor: toHex(style.font.color),
      fontStyle: style.font.style
    });
  }
  return serializedStyle;
}

import inherits from 'inherits';

import {
  isObject,
  assign
} from 'min-dash';

import {
  query as domQuery
} from 'min-dom';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  getLabel
} from '../features/label-editing/LabelUtil';

import {
  getElementRef,
  isBaseElementType,
  getAspectType,
  getLayerType
} from '../util/ModelUtil';

import {
  getRectPath,
  getFillColor,
  getStrokeColor,
  COLOR_LAYER_MAP,
  BORDER_ASPECT_MAP,
  BLACK_SHADOW_RGBA,
} from './ArchimateRendererUtil';

import { logger } from "../util/Logger";
import { createLine } from 'diagram-js/lib/util/RenderUtil';

export const DEFAULT_NOTE_COLOR_RGBA = {r: '255', g: '255', b: '255', a: '100'};

const DEFAULT_FILL_OPACITY = 1,
  DEFAULT_STROKE_WIDTH = 1,
  DEFAULT_STROKE_COLOR = 'black',
  DEFAULT_STROKE_COLOR_RGBA = {r: '0', g: '0', b: '0', a: '100'},
  DEFAULT_FILL_COLOR = 'grey',
  DEFAULT_TEXT_COLOR = 'black';

export default function ArchimateRenderer(
    config, eventBus, styles, pathMap,
    canvas, textRenderer, priority) {

  BaseRenderer.call(this, eventBus, priority);

  var defaultFillColor = config && config.defaultFillColor,
      defaultStrokeColor = config && config.defaultStrokeColor;

  var computeStyle = styles.computeStyle;

  function drawCircle(parentGfx, width, height, offset, attrs) {

    if (isObject(offset)) {
      attrs = offset;
      offset = 0;
    }

    offset = offset || 0;

    attrs = computeStyle(attrs, {
      stroke: DEFAULT_STROKE_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      fill: DEFAULT_FILL_COLOR
    });

    if (attrs.fill === 'none') {
      delete attrs.fillOpacity;
    }

    var cx = width / 2,
        cy = height / 2;

    var circle = svgCreate('circle');
    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4 - offset)
    });
    svgAttr(circle, attrs);

    svgAppend(parentGfx, circle);

    return circle;
  }

  function drawRect(parentGfx, width, height, r, offset, attrs) {

    if (isObject(offset)) {
      attrs = offset;
      offset = 0;
    }

    offset = offset || 0;

    attrs = computeStyle(attrs, {
      stroke: DEFAULT_STROKE_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      fill: DEFAULT_FILL_COLOR
    });

    var rect = svgCreate('rect');
    svgAttr(rect, {
      x: offset,
      y: offset,
      width: width - offset * 2,
      height: height - offset * 2,
      rx: r,
      ry: r
    });
    svgAttr(rect, attrs);

    svgAppend(parentGfx, rect);

    return rect;
  }

  function drawLine(p, waypoints, attrs) {
    attrs = computeStyle(attrs, [ 'no-fill' ], {
      stroke: DEFAULT_STROKE_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      fill: DEFAULT_FILL_COLOR
    });

    var line = createLine(waypoints, attrs);

    svgAppend(p, line);

    return line;
  }

  function drawPath(parentGfx, d, attrs) {

    attrs = computeStyle(attrs, [ 'no-fill' ], {
      strokeWidth: DEFAULT_STROKE_WIDTH,
      stroke: DEFAULT_STROKE_COLOR
    });

    var path = svgCreate('path');
    svgAttr(path, { d: d });
    svgAttr(path, attrs);

    svgAppend(parentGfx, path);

    return path;
  }


  function renderLabel(parentGfx, label, options) {

    options = assign({
      size: {
        width: 100
      }
    }, options);

    var text = textRenderer.createText(label || '', options);

    svgClasses(text).add('djs-label');

    svgAppend(parentGfx, text);

    return text;
  }

  function renderEmbeddedLabel(text, parentGfx, element, align, fontSize) {

    return renderLabel(parentGfx, text, {
      box: element,
      align: align,
      padding: 5,
      style: {
        fill: DEFAULT_TEXT_COLOR
        // fontSize: fontSize // || DEFAULT_TEXT_SIZE
      },
    });
  }

  function renderExternalLabel(parentGfx, element) {

    var box = {
      width: 90,
      height: 30,
      x: element.width / 2 + element.x,
      y: element.height / 2 + element.y
    };

    return renderLabel(parentGfx, getLabel(element), {
      box: box,
      fitBox: true,
      style: assign(
        {},
        textRenderer.getExternalStyle(),
        {
          fill: DEFAULT_TEXT_COLOR
        }
      )
    });
  }

  function renderArchimateShape(parentGfx, shape) {
    logger.log('renderArchimateElement(parentGfx, shape)');
    logger.log({ parentGfx, shape });

    var elementType = shape.type,
      defaultColorLayer = COLOR_LAYER_MAP.get(getLayerType(elementType)),
      borderRadius = BORDER_ASPECT_MAP.get(getAspectType(elementType));

    var attrs = {
      fill: getFillColor(shape, defaultColorLayer),
      stroke: getStrokeColor(shape, DEFAULT_STROKE_COLOR)
    };

    var figure = drawRect(parentGfx, shape.width, shape.height, borderRadius, attrs);

    var text = getElementRef(shape).name;

    renderEmbeddedLabel(text, parentGfx, shape, 'center-middle');

    var pathData = pathMap.getScaledPath(elementType, {
      xScaleFactor: 1,
      yScaleFactor: 1,
      containerWidth: shape.width,
      containerHeight: shape.height,
      position: {
        mx: ((shape.width - 22) / shape.width),  //((shape.width - 10) / shape.width),
        my: ((2) /shape.height) //((shape.height - 15) / shape.height)
      }
    });

    drawPath(parentGfx, pathData, {
      strokeWidth: 0.8,
      fill: getFillColor(shape, defaultColorLayer),
      stroke: DEFAULT_STROKE_COLOR
    });

    return figure;
  }

  this.handlers = {
    'BusinessActor': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'BusinessInterface': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'BusinessCollaboration': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'BusinessFunction': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'BusinessProcess': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },
    
    'ApplicationInterface': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'ApplicationFunction': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'ApplicationProcess': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'TechnologyInterface': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'TechnologyFunction': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'TechnologyProcess': function(parentGfx, shape) {
      return renderArchimateShape(parentGfx, shape);
    },

    'archimate:Note': function(parentGfx, shape) {

      logger.log('Note handler');
      logger.log(shape);

      var pathData = pathMap.getScaledPath('FIGURE_NOTE', {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: shape.width,
        containerHeight: shape.height,
        position: {
          mx: 0.0,
          my: 0.0
        }
      });

      var figure = drawPath(parentGfx, pathData, {
        strokeWidth: DEFAULT_STROKE_WIDTH,
        fill: getFillColor(shape, DEFAULT_NOTE_COLOR_RGBA),
        stroke: getStrokeColor(shape, BLACK_SHADOW_RGBA)
      });

      var text = shape.businessObject.label;

      renderEmbeddedLabel(text, parentGfx, shape, 'left-top');
  
      return figure;
    },

    'archimate:Group': function(parentGfx, element) {

      logger.log('Group handler');
      logger.log(element);

      var figure = drawRect(parentGfx, element.width, element.height, 0, {
        stroke: 'black',
        strokeWidth: 1,
        strokeDasharray: '3,3',
        fill: 'none',
        pointerEvents: 'none'
      });

      var text = "Group"

      renderEmbeddedLabel(text, parentGfx, element, 'center-middle');

      return figure;
    },

    'label': function(parentGfx, element) {

      logger.log('label handler');
      logger.log(element);
     
      return renderExternalLabel(parentGfx, element);
    },

    'archimate:Relationship': function(parentGfx, element) {
      // var semantic = getSemantic(element);
      logger.log('Relationship handler (parentGfx, shape)');
      logger.log({parentGfx, element});

      var fill = 'grey', // getFillColor(element, defaultFillColor),
          stroke = 'black', //getStrokeColor(element, defaultStrokeColor),
          attrs = {
            stroke: stroke,
            // strokeDasharray: '0.5, 5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none'
          };

      //if (semantic.associationDirection === 'One' ||
      //    semantic.associationDirection === 'Both') {
        attrs.markerEnd = marker('association-end', fill, stroke);
      //}

      //if (semantic.associationDirection === 'Both') {
        attrs.markerStart = marker('association-start', fill, stroke);
      //}

      return drawLine(parentGfx, element.waypoints, attrs);
    },

  };

  // extension API, use at your own risk
  this._drawPath = drawPath;

}


inherits(ArchimateRenderer, BaseRenderer);

ArchimateRenderer.$inject = [
  'config.archimateRenderer',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer'
];


ArchimateRenderer.prototype.canRender = function(element) {
  logger.log('canRender(element):');
  logger.log({element});
/*
  var elementRef = getElementRef(element);
  logger.log(is(elementRef, 'archimate:Concept'));
  return is(elementRef, 'archimate:Concept');
*/

return isBaseElementType(element.type) ||
  element.type === 'archimate:Relationship' ||
  element.type === 'archimate:Note';
};


ArchimateRenderer.prototype.drawConnection = function(parentGfx, element) {
  var type = element.type;
  var h = this.handlers[type];

  if (!h) {
    return BaseRenderer.prototype.drawConnection.apply(this, [ parentGfx, element ]);
  } else {
    return h(parentGfx, element);
  }
};


ArchimateRenderer.prototype.drawShape = function(parentGfx, element) {
  var type = element.type;

  logger.log('drawShape(parentGfx, element)');
  logger.log({ parentGfx, element });

  // No more used as element.type is Archimate element type (e.g. BusinessActor)
  // and was checked by canRender
  // if element.type is 'archimate:BaseElement', 
  // get 'type' property of the elementRef to define which archimate element to render
  /*if(type == 'archimate:BaseElement') {
    type = getElementRef(element).type
  }*/

  var h = this.handlers[type];

  /* jshint -W040 */
  return h(parentGfx, element);
};

ArchimateRenderer.prototype.getShapePath = function(element) {

  return getRectPath(element);
};

// markers //////////

var markers = {};

const counter = 0;

function marker(type, fill, stroke) {
  var id = type + '-' + fill +
    '-' + stroke + '-' + counter;

    logger.log('marker(type, fill, stroke):');
    logger.log(id);

  if (!markers[id]) {
    createMarker(id, type, fill, stroke);
  }

  return 'url(#' + id + ')';
}

function addMarker(id, options) {
  var attrs = assign({
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeDasharray: 'none'
  }, options.attrs);

  var ref = options.ref || { x: 0, y: 0 };

  var scale = options.scale || 1;

  // fix for safari / chrome / firefox bug not correctly
  // resetting stroke dash array
  if (attrs.strokeDasharray === 'none') {
    attrs.strokeDasharray = [ 10000, 1 ];
  }

  var marker = svgCreate('marker');

  svgAttr(options.element, attrs);

  svgAppend(marker, options.element);

  svgAttr(marker, {
    id: id,
    viewBox: '0 0 20 20',
    refX: ref.x,
    refY: ref.y,
    markerWidth: 20 * scale,
    markerHeight: 20 * scale,
    orient: 'auto'
  });
/*
  var defs = domQuery('defs', canvas._svg);

  logger.log('canvas in addMarker:');
  logger.log(canvas._svg);  

  if (!defs) {
    defs = svgCreate('defs');

    logger.log('defs in addMarker:');
    logger.log(defs);

    svgAppend(canvas._svg, defs);
  }

  svgAppend(defs, marker);
*/
  markers[id] = marker;
}

function createMarker(id, type, fill, stroke) {

  if (type === 'association-start') {
    var associationStart = svgCreate('path');
    svgAttr(associationStart, { d: 'M 11 5 L 1 10 L 11 15' });

    addMarker(id, {
      element: associationStart,
      attrs: {
        fill: 'none',
        stroke: stroke,
        strokeWidth: 1.5
      },
      ref: { x: 1, y: 10 },
      scale: 0.5
    });

  } else if (type === 'association-end') {
    var associationEnd = svgCreate('path');
    svgAttr(associationEnd, { d: 'M 1 5 L 11 10 L 1 15' });

    addMarker(id, {
      element: associationEnd,
      attrs: {
        fill: 'none',
        stroke: stroke,
        strokeWidth: 1.5
      },
      ref: { x: 12, y: 10 },
      scale: 0.5
    });
  } else if (type === 'information-requirement-end') {
    var informationRequirementEnd = svgCreate('path');
    svgAttr(informationRequirementEnd, { d: 'M 1 5 L 11 10 L 1 15 Z' });

    addMarker(id, {
      element: informationRequirementEnd,
      attrs: {
        fill: stroke,
        stroke: 'none'
      },
      ref: { x: 11, y: 10 },
      scale: 1
    });
  } else if (type === 'knowledge-requirement-end') {
    var knowledgeRequirementEnd = svgCreate('path');
    svgAttr(knowledgeRequirementEnd, { d: 'M 1 3 L 11 10 L 1 17' });

    addMarker(id, {
      element: knowledgeRequirementEnd,
      attrs: {
        fill: 'none',
        stroke: stroke,
        strokeWidth: 2
      },
      ref: { x: 11, y: 10 },
      scale: 0.8
    });
  } else if (type === 'authority-requirement-end') {
    var authorityRequirementEnd = svgCreate('circle');
    svgAttr(authorityRequirementEnd, { cx: 3, cy: 3, r: 3 });

    addMarker(id, {
      element: authorityRequirementEnd,
      attrs: {
        fill: stroke,
        stroke: 'none'
      },
      ref: { x: 3, y: 3 },
      scale: 0.9
    });
  }
}

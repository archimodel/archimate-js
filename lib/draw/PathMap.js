import { APPLICATION_FUNCTION, APPLICATION_INTERFACE, APPLICATION_PROCESS, 
  BUSINESS_ACTOR, BUSINESS_FUNCTION, BUSINESS_INTERFACE, BUSINESS_PROCESS, 
  TECHNOLOGY_FUNCTION, TECHNOLOGY_INTERFACE, TECHNOLOGY_PROCESS 
} from "../util/ModelUtil";

const PICTO_MAP = new Map([
  [BUSINESS_ACTOR, 'PICTO_ACTOR'],
  [BUSINESS_INTERFACE, 'PICTO_INTERFACE'],
  [BUSINESS_FUNCTION, 'PICTO_FUNCTION'],
  [BUSINESS_PROCESS, 'PICTO_PROCESS'],
  [APPLICATION_INTERFACE, 'PICTO_INTERFACE'],
  [APPLICATION_FUNCTION, 'PICTO_FUNCTION'],
  [APPLICATION_PROCESS, 'PICTO_PROCESS'],
  [TECHNOLOGY_INTERFACE, 'PICTO_INTERFACE'],
  [TECHNOLOGY_FUNCTION, 'PICTO_FUNCTION'],
  [TECHNOLOGY_PROCESS, 'PICTO_PROCESS'],
  ['FIGURE_NOTE', 'FIGURE_NOTE']
]);

/**
 * Map containing SVG paths needed by Renderer.
 */

export default function PathMap() {

  /**
   * Contains a map of path elements
   *
   * <h1>Path definition</h1>
   * A parameterized path is defined like this:
   * <pre>
   * 'GATEWAY_PARALLEL': {
   *   d: 'm {mx},{my} {e.x0},0 0,{e.x1} {e.x1},0 0,{e.y0} -{e.x1},0 0,{e.y1} ' +
          '-{e.x0},0 0,-{e.y1} -{e.x1},0 0,-{e.y0} {e.x1},0 z',
   *   height: 17.5,
   *   width:  17.5,
   *   heightElements: [2.5, 7.5],
   *   widthElements: [2.5, 7.5]
   * }
   * </pre>
   * <p>It's important to specify a correct <b>height and width</b> for the path as the scaling
   * is based on the ratio between the specified height and width in this object and the
   * height and width that is set as scale target (/!\ x,y coordinates will be scaled with
   * individual ratios).</p>
   * <p>The '<b>heightElements</b>' and '<b>widthElements</b>' array must contain the values that will be scaled.
   * The scaling is based on the computed ratios.
   * Coordinates on the y axis should be in the <b>heightElement</b>'s array, they will be scaled using
   * the computed ratio coefficient.
   * In the parameterized path the scaled values can be accessed through the 'e' object in {} brackets.
   *   <ul>
   *    <li>The values for the y axis can be accessed in the path string using {e.y0}, {e.y1}, ....</li>
   *    <li>The values for the x axis can be accessed in the path string using {e.x0}, {e.x1}, ....</li>
   *   </ul>
   *   The numbers x0, x1 respectively y0, y1, ... map to the corresponding array index.
   * </p>
   */
  this.pathMap = {

    'PICTO_ACTOR': {
      // d: 'm {mx},{my} h {e.x0} m -4 3 l 4 5 m -4 -5 l -4 5 m 4 -11 v {e.y0} m 3 -9 a 3 3 0 0 1 -3 3 a 3 3 0 0 1 -3 -3 a 3 3 0 0 1 3 -3 a 3 3 0 0 1 3 3 z',
      // small h17 x w8 // d: 'm {mx},{my} h 8 m -4 3 l 4 5 m -4 -5 l -4 5 m 4 -11 v 6 m 3 -9 a 3 3 0 0 1 -3 3 a 3 3 0 0 1 -3 -3 a 3 3 0 0 1 3 -3 a 3 3 0 0 1 3 3 z',
      // large h21 x w10 // d: 'm {mx},{my} h 10 m -5 4 l 5 6 m -5 -6 l -5 6 m 5 -13 v 7 m 4 -11 a 4 4 90 0 1 -4 4 a 4 4 90 0 1 -4 -4 a 4 4 90 0 1 4 -4 a 4 4 90 0 1 4 4 z
      d: 'm {mx},{my} m 6 12 h 8.9 m -4.4 3.3 l 4.4 5.6 m -4.4 -5.6 l -4.4 5.6 m 4.4 -12.2 v 6.7 m 3.3 -10 a 3.3 3.3 90 0 1 -3.3 3.3 a 3.3 3.3 90 0 1 -3.3 -3.3 a 3.3 3.3 90 0 1 3.3 -3.3 a 3.3 3.3 90 0 1 3.3 3.3 z',
      height: 19,
      width: 9,
      heightElements: [],
      widthElements: []
    },

    'PICTO_COLLABORATION': {
      d:'m {mx},{my} m3 10 a 5 5 90 0 1 5 -5 a 5 5 90 0 1 5 5 a 5 5 90 0 1 -5 5 a 5 5 90 0 1 -5 -5 z m 14 0 a 5 5 90 0 1 -5 5 a 5 5 90 0 1 -5 -5 a 5 5 90 0 1 5 -5 a 5 5 90 0 1 5 5 z',
      height: 10,
      width: 14,
      heightElements: [],
      widthElements: []
    },

    'PICTO_FUNCTION': {
      d:'m {mx},{my} m 4 17 c 0 0 6 -6 6 -6 c 0 0 6 6 6 6 c 0 0 0 -9 0 -9 c 0 0 -6 -5 -6 -5 c 0 0 -6 5 -6 5 c 0 0 0 9 0 9 z',
      height: 13,
      width: 14,
      heightElements: [],
      widthElements: []
    },

    'PICTO_PROCESS': {
      d: 'm {mx},{my} m 1 8 c 0 0 9 0 9 0 c 0 0 0 -3 0 -3 c 0 0 7 5 7 5 c 0 0 -7 5 -7 5 c 0 0 0 -3 0 -3 c 0 0 -9 0 -9 0 c 0 0 0 -4 0 -4 z',
      height: 10,
      width: 16,
      heightElements: [],
      widthElements: []
    },

    'PICTO_INTERFACE': {
      d:'m {mx},{my} m 7 10 h -7 m 17,0 a 5,5 0 0 1 -5,5 5,5 0 0 1 -5,-5 5,5 0 0 1 5,-5 5,5 0 0 1 5,5 z',
      height: 10,
      width: 17,
      heightElements: [],
      widthElements: []
    },
    
    'PICTO_INTERACTION': {
      d:'m {mx},{my} m 8 4 c -2.8 0 -5 2.7 -5 6 c 0 3.3 2.2 6 5 6 v -12 m 3 12 c 2.8 0 5 -2.7 5 -6 c 0 -3.3 -2.2 -6 -5 -6 l 0 12 z',
      height: 12,
      width: 13,
      heightElements: [],
      widthElements: []
    },

    'PICTO_BUSINESS_OBJECT': {
      d:'m {mx},{my} m 0 0 l 0 55.3 c 29.8 19.7 48.4 -4.2 67.2 -6.7 c 12.2 -2.3 19.8 1.6 30.8 6.2 l 0 -54.8 h -98 m 0 10 h 98 z',
      height: 12,
      width: 13,
      heightElements: [],
      widthElements: []
    },

    'FIGURE_BUSINESS_OBJECT': {
      d: 'm {mx},{my} ' +
         'l 0,{e.y0} ' +
         'c {e.x0},{e.y1} {e.x1},-{e.y2} {e.x2},-{e.y3} ' +
         'c {e.x3},-{e.y4} {e.x4},{e.y5} {e.x5},{e.y6} ' +
         'l 0,-{e.y7}z',
      width:  98, //100
      height: 63,  //65
      widthElements: [ 29.8, 48.4, 67.2, 12.2, 19.8, 30.8 ],
      heightElements: [ 55.3, 19.7, 4.2, 6.7, 2.3, 1.6, 6.2, 54.6 ]
    },

    'FIGURE_NOTE': {
      d: 'm {mx},{my} ' +
         'h {e.x0} ' +
         'v {{e.y0}-15} ' +
         'l -15,15 ' +
         'h -{{e.x0}-15} ' + 
         'v -{e.y0} z',
      width:  100,
      height: 70,
      widthElements: [ 100 ],
      heightElements: [ 70 ]
    },

  };

  this.getRawPath = function getRawPath(pathId) {
    return this.pathMap[pathId].d;
  };

  /**
   * Scales the path to the given height and width.
   * <h1>Use case</h1>
   * <p>Use case is to scale the content of elements (event, gateways) based
   * on the element bounding box's size.
   * </p>
   * <h1>Why not transform</h1>
   * <p>Scaling a path with transform() will also scale the stroke and IE does not support
   * the option 'non-scaling-stroke' to prevent this.
   * Also there are use cases where only some parts of a path should be
   * scaled.</p>
   *
   * @param {String} pathId The ID of the path.
   * @param {Object} param <p>
   *   Example param object scales the path to 60% size of the container (data.width, data.height).
   *   <pre>
   *   {
   *     xScaleFactor: 0.6,
   *     yScaleFactor:0.6,
   *     containerWidth: data.width,
   *     containerHeight: data.height,
   *     position: {
   *       mx: 0.46,
   *       my: 0.2,
   *     }
   *   }
   *   </pre>
   *   <ul>
   *    <li>targetpathwidth = xScaleFactor * containerWidth</li>
   *    <li>targetpathheight = yScaleFactor * containerHeight</li>
   *    <li>Position is used to set the starting coordinate of the path. M is computed:
    *    <ul>
    *      <li>position.x * containerWidth</li>
    *      <li>position.y * containerHeight</li>
    *    </ul>
    *    Center of the container <pre> position: {
   *       mx: 0.5,
   *       my: 0.5,
   *     }</pre>
   *     Upper left corner of the container
   *     <pre> position: {
   *       mx: 0.0,
   *       my: 0.0,
   *     }</pre>
   *    </li>
   *   </ul>
   * </p>
   *
   */
  this.getScaledPath = function getScaledPath(elementType, param) {
    var pathId = PICTO_MAP.get(elementType),
      rawPath = this.pathMap[pathId];

    // positioning
    // compute the start point of the path
    var mx, my;

    if (param.abspos) {
      mx = param.abspos.x;
      my = param.abspos.y;
    } else {
      mx = param.containerWidth * param.position.mx;
      my = param.containerHeight * param.position.my;
    }

    var coordinates = {}; // map for the scaled coordinates
    if (param.position) {

      // path
      var heightRatio = (param.containerHeight / rawPath.height) * param.yScaleFactor;
      var widthRatio = (param.containerWidth / rawPath.width) * param.xScaleFactor;


      // Apply height ratio
      for (var heightIndex = 0; heightIndex < rawPath.heightElements.length; heightIndex++) {
        coordinates['y' + heightIndex] = rawPath.heightElements[heightIndex] * heightRatio;
      }

      // Apply width ratio
      for (var widthIndex = 0; widthIndex < rawPath.widthElements.length; widthIndex++) {
        coordinates['x' + widthIndex] = rawPath.widthElements[widthIndex] * widthRatio;
      }
    }

    // Apply value to raw path
    var path = format(
      rawPath.d, {
        mx: mx,
        my: my,
        e: coordinates
      }
    );
    return path;
  };
}



// helpers //////////////////////

var tokenRegex = /\{(.[^{]+)\}/g, // new regex to match group in this format {{e.x0}-15}
    objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g; // matches .xxxxx or ["xxxxx"] to run over object properties

function replacer(all, key, obj) {
  var res = obj;
  key.replace(objNotationRegex, function(all, name, quote, quotedName, isFunc) {
    name = name || quotedName;
    if (res) {
      if (name in res) {
        res = res[name];
      }
      typeof res == 'function' && isFunc && (res = res());
    }
  });
  res = (res == null || res == obj ? all : res) + '';
  return res;
}

// new function => can match {{e.x0}-15} group and
// evaluate arithmetic operation after replacing coordinates
function format(str, obj) {
  return String(str).replace(tokenRegex, function(match, group) {
      if (!group.match(tokenRegex)) {
          return replacer(match, group, obj);
      } else {
          var val = group.replace(tokenRegex, function(match, key) {
              return replacer(match, key, obj);
          });
          return eval(val);
      }
  });
}

// copied from https://github.com/adobe-webplatform/Snap.svg/blob/master/src/svg.js
/*
var tokenRegex = /\{([^}]+)\}/g,
    objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g; // matches .xxxxx or ["xxxxx"] to run over object properties

function replacer(all, key, obj) {
  var res = obj;
  key.replace(objNotationRegex, function(all, name, quote, quotedName, isFunc) {
    name = name || quotedName;
    if (res) {
      if (name in res) {
        res = res[name];
      }
      typeof res == 'function' && isFunc && (res = res());
    }
  });
  res = (res == null || res == obj ? all : res) + '';
  return res;
}

function format(str, obj) {
  return String(str).replace(tokenRegex, function(all, key) {
    return replacer(all, key, obj);
  });
}
*/
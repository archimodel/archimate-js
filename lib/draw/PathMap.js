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
      d: 'm {mx},{my} m 5.5 9.5 h 8 m -4 3.5 l 4 5 m -4 -5 l -4 5 m 4 -11.5 v 6.5 m 0 -12.5 a 0.5 0.5 90 0 0 0 6 a 0.5 0.5 90 0 0 0 -6 z',
      height: 18,
      width: 8,
      heightElements: [],
      widthElements: []
    },

    'PICTO_ROLE': {
      d: 'm {mx},{my} m 5 4.5 l 8 0 a 1 1 90 0 1 0 9 l -8 0 a 1 1 90 0 1 0 -9 m 8 9 a 0.5 0.5 90 0 1 0 -9',
      height: 9,
      width: 17,
      heightElements: [],
      widthElements: []
    },
 
    'PICTO_CONTRACT': {
      d: 'm {mx},{my} m 1.5 2.5 l 15 0 l 0 13 l -15 0 z m 0 4 l 15 0 m -15 5 l 15 0',
      height: 13,
      width: 15,
      heightElements: [],
      widthElements: []
    },

    'PICTO_REPRESENTATION': {
      d: 'm {mx},{my} m 1.5 2.5 l 15 0 l 0 11.5 c -7.5 -5 -7.5 5 -15 0 z m 0 4 l 15 0',
      height: 13,
      width: 15,
      heightElements: [],
      widthElements: []
    },

    'PICTO_PRODUCT': {
      d: 'm {mx},{my} m 1.5 2.5 l 15 0 l 0 13 l -15 0 z m 0 4 l 8 0 m 0 -4 l 0 4',
      height: 13,
      width: 15,
      heightElements: [],
      widthElements: []
    },

    'PICTO_COMPONENT': {
      d: 'm {mx},{my} m 4.5 4.5 l 0 -3 l 12 0 l 0 15 l -12 0 l 0 -3 m -3 -3 l 6 0 l 0 3 l -6 0 z m 3 0 l 0 -3 m -3 -3 l 6 0 l 0 3 l -6 0 z',
      height: 15,
      width: 15,
      heightElements: [],
      widthElements: []
    },

    'PICTO_COLLABORATION': {
      d:'m {mx},{my} m 0.5 9 a 1 1 90 0 0 11 0 a 1 1 90 0 0 -11 0 m 17 0 a 1 1 90 0 0 -11 0 a 1 1 90 0 0 11 0',
      height: 11,
      width: 17,
      heightElements: [],
      widthElements: []
    },

    'PICTO_EVENT': {
      d:'m {mx},{my} m 0.5 3.5 l 12 0 c 6.5 0 6.5 11 0 11 l -12 0 l 3.5 -5.5 z',
      height: 11,
      width: 17,
      heightElements: [],
      widthElements: []
    },

    'PICTO_FUNCTION': {
      d:'m {mx},{my} m 9 2 l -6.5 5.5 l 0 8.5 l 6.5 -5.5 l 6.5 5.5 l 0 -8.5 z',
      height: 14,
      width: 13,
      heightElements: [],
      widthElements: []
    },

    'PICTO_PROCESS': {
      d: 'm {mx},{my} m 0.5 6.5 l 9 0 l 0 -4 l 8 6.5 l -8 6.5 l 0 -4 l -9 0 z',
      height: 13,
      width: 17,
      heightElements: [],
      widthElements: []
    },

    'PICTO_INTERFACE': {
      d:'m {mx},{my} m 7.5 9.5 h -7 m 17 0 a 5 5 90 0 0 -10 0 a 5 5 90 0 0 10 0 z',
      height: 10,
      width: 17,
      heightElements: [],
      widthElements: []
    },

    'PICTO_SERVICE': {
      d:'m {mx},{my} m 5 4.5 l 8 0 a 1 1 90 0 1 0 9 l -8 0 a 1 1 90 0 1 0 -9',
      height: 9,
      width: 17,
      heightElements: [],
      widthElements: []
    },

    'PICTO_INTERACTION': {
      d:'m {mx},{my} m 10.5 2 q 6 0 6 7 q 0 7 -6 7 z m -3 14 q -6 0 -6 -7 q 0 -7 6 -7 z',
      height: 14,
      width: 15,
      heightElements: [],
      widthElements: []
    },

    'PICTO_OBJECT': {
      d:'m {mx},{my} m 1.5 2.5 l 15 0 l 0 13 l -15 0 z m 0 4 l 15 0',
      height: 13,
      width: 15,
      heightElements: [],
      widthElements: []
    },

    'PICTO_CAPABILITY': {
      d:'m {mx},{my} m 16.5 1.5 l -5 0 l 0 5 l -5 0 l 0 5 l -5 0 l 0 5 l 15 0 z m -10 10 l 10 0 m -5 -5 l 0 10 m -5 -5 l 0 5 m 5 -10 l 5 0',
      height: 15,
      width: 15,
      heightElements: [],
      widthElements: []
    },

    'PICTO_RESOURCE': {
      d:'m {mx},{my} m 15.5 7 l 0 -2 l -1.5 -1.5 l -12 0 l -1.5 1.5 l 0 8 l 1.5 1.5 l 12 0 l 1.5 -1.5 l 0 -2 l 1.5 0 l 0.5 -0.5 l 0 -3 l -0.5 -0.5 z m -8 -2 l 0 8 m -4 -8 l 0 8 m 2 0 l 0 -8 m 10 2 l 0 4',
      height: 11,
      width: 17,
      heightElements: [],
      widthElements: []
    },

    'PICTO_VALUE_STREAM': {
      d:'m {mx},{my} m 17 9 l -5 -6.5 l -11 0 l 5 6.5 l -5 6.5 l 11 0 z',
      height: 13,
      width: 16,
      heightElements: [],
      widthElements: []
    },

    'PICTO_COURSE_OF_ACTION': {
      d:'m {mx},{my} m 6.5 6 a 1 1 90 0 0 11 0 a 1 1 90 0 0 -11 0 m 2.5 0 a 1 1 90 0 0 6 0 a 1 1 90 0 0 -6 0 m 2.5 0.5 a 1 1 90 0 0 1 0 a 1 1 90 0 0 0 -1 a 1 1 90 0 0 -1 0 a 1 1 90 0 0 0 1 m -3.5 3.5 l -0.5 4 l -3.5 -3.5 z m -2.5 1.5 q -3.5 2.5 -2.5 6 l 1 0 q -1 -3.5 2.5 -5 m -0.5 -1.5 l 1 0 l 0 1',
      height: 15,
      width: 15,
      heightElements: [],
      widthElements: []
    },

    'FIGURE_OBJECT': {
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

  this.getRawPath = function getRawPath(pathRef) {
    return this.pathMap[pathRef].d;
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
  this.getScaledPath = function getScaledPath(pathRef, param) {
    var rawPath = this.pathMap[pathRef];

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
import { assign } from 'min-dash';

import TextUtil from 'diagram-js/lib/util/Text';

export const FONTSIZE_DEFAULT = 13,
  FONTNAME_DEFAULT = 'Quicksand';


const LINE_HEIGHT_RATIO = 1.4;

export default function TextRenderer(config) {

  var defaultStyle = assign({
    fontFamily: 'Quicksand', //'IBM Plex, sans-serif',
    fontSize: FONTSIZE_DEFAULT,
    fontWeight: '500',
    lineHeight: LINE_HEIGHT_RATIO
  }, config && config.defaultStyle || {});

  var externalFontSize = parseInt(defaultStyle.fontSize, 10) - 1;

  var externalStyle = assign({}, defaultStyle, {
    fontSize: externalFontSize
  }, config && config.externalStyle || {});

  var textUtil = new TextUtil({
    style: defaultStyle
  });

  /**
   * Get the new bounds of an externally rendered,
   * layouted label.
   *
   * @param  {Bounds} bounds
   * @param  {String} text
   *
   * @return {Bounds}
   */
  this.getExternalLabelBounds = function(bounds, text) {

    var layoutedDimensions = textUtil.getDimensions(text, {
      box: {
        width: 90,
        height: 30,
        x: bounds.width / 2 + bounds.x,
        y: bounds.height / 2 + bounds.y
      },
      style: externalStyle
    });

    // resize label shape to fit label text
    return {
      x: Math.round(bounds.x + bounds.width / 2 - layoutedDimensions.width / 2),
      y: Math.round(bounds.y),
      width: Math.ceil(layoutedDimensions.width),
      height: Math.ceil(layoutedDimensions.height)
    };

  };

  /**
   * Create a layouted text element.
   *
   * @param {String} text
   * @param {Object} [options]
   *
   * @return {SVGElement} rendered text
   */
  this.createText = function(text, options) {
    return textUtil.createText(text, options || {});
  };

  /**
   * Get default text style.
   */
  this.getDefaultStyle = function() {
    return defaultStyle;
  };

  /**
   * Get the external text style.
   */
  this.getExternalStyle = function() {
    return externalStyle;
  };

}

TextRenderer.$inject = [
  'config.textRenderer'
];
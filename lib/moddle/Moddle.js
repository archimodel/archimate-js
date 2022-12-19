import { isString, assign } from 'min-dash';

import { Moddle } from 'moddle';

import { Reader, Writer } from 'moddle-xml';

/**
 * A sub class of {@link Moddle} with support for import and export of archimate-js xml files.
 *
 * @class ArchimateModdle
 *
 * @extends Moddle
 *
 * @param {Object|Array} packages to use for instantiating the model
 * @param {Object} [options] additional options to pass over
 */
export default function ArchimateModdle(packages, options) {
  Moddle.call(this, packages, options);
}

ArchimateModdle.prototype = Object.create(Moddle.prototype);

/**
 * The fromXML result.
 *
 * @typedef {Object} ParseResult
 *
 * @property {ModdleElement} rootElement
 * @property {Array<Object>} references
 * @property {Array<Error>} warnings
 * @property {Object} elementsById - a mapping containing each ID -> ModdleElement
 */

/**
 * The fromXML error.
 *
 * @typedef {Error} ParseError
 *
 * @property {Array<Error>} warnings
 */

/**
 * Instantiates an Archimate model tree from a given xml string.
 *
 * @param {String}   xmlStr
 * @param {String}   [typeName='archimate:Model'] name of the root element, typically 'Model'
 * @param {Object}   [options]  options to pass to the underlying reader
 *
 * @returns {Promise<ParseResult, ParseError>}
 */
ArchimateModdle.prototype.fromXML = function(xmlStr, typeName, options) {
  if (!isString(typeName)) {
    options = typeName;
    typeName = 'archimate:Model';

  }

  var reader = new Reader(assign({ model: this, lax: true }, options));
  var rootHandler = reader.handler(typeName);

  return reader.fromXML(xmlStr, rootHandler);
};

/**
 * The toXML result.
 *
 * @typedef {Object} SerializationResult
 *
 * @property {String} xml
 */

/**
 * Serializes a Archimate object tree to XML.
 *
 * @param {String}   element    the root element, typically an instance of 'Model'
 * @param {Object}   [options]  to pass to the underlying writer
 *
 * @returns {Promise<SerializationResult, Error>}
 */
ArchimateModdle.prototype.toXML = function(element, options) {
  var writer = new Writer(options);

  return new Promise(function(resolve, reject) {
    try {
      var result = writer.toXML(element);

      return resolve({
        xml: result
      });
    } catch (err) {
      return reject(err);
    }
  });
};

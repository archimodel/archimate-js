import {
  getModelPropertyValue,
  setModelProperty
} from './ModelPropertyUtil.js';

export const PROFILE_ATTRIBUTE_PROPERTY_PREFIX = 'archimate-js:profileAttribute';

export const PROFILE_ATTRIBUTE_TYPES = [
  'String',
  'Number',
  'Integer',
  'Real',
  'Boolean',
  'Currency',
  'Date',
  'URL',
  'Time',
  'Structure'
];

export function setProfileAttributePropertyValue(model, concept, attribute, value) {
  var propertyName = getProfileAttributePropertyName(attribute);
  var serializedValue = serializeProfileAttributePropertyValue(attribute, value);

  return setModelProperty(model, concept, propertyName, serializedValue, {
    type: attribute.type
  });
}

export function getProfileAttributePropertyValue(concept, attribute) {
  var propertyName = getProfileAttributePropertyName(attribute);
  var value = getModelPropertyValue(concept, propertyName);

  if (value === undefined || value === null) {
    return undefined;
  }

  return parseProfileAttributePropertyValue(attribute, value);
}

export function getProfileAttributePropertyName(attribute) {
  assertProfileAttributeIdentity(attribute);

  return PROFILE_ATTRIBUTE_PROPERTY_PREFIX + ':' + attribute.concept + ':' + attribute.name;
}

export function serializeProfileAttributePropertyValue(attribute, value) {
  var normalized = normalizeProfileAttributeValue(attribute, value);

  if (attribute.type === 'Structure') {
    return JSON.stringify(normalized);
  }

  return String(normalized);
}

export function parseProfileAttributePropertyValue(attribute, value) {
  if (attribute && attribute.type === 'Structure' && typeof value === 'string') {
    try {
      return normalizeProfileAttributeValue(attribute, JSON.parse(value));
    } catch (error) {
      throw new Error('ArchiMate profile attribute Structure property could not be parsed: ' + error.message);
    }
  }

  return normalizeProfileAttributeValue(attribute, value);
}

export function isProfileAttributeValueValid(attribute, value) {
  try {
    normalizeProfileAttributeValue(attribute, value);
    return true;
  } catch (error) {
    return false;
  }
}

export function normalizeProfileAttributeValue(attribute, value) {
  if (!attribute || PROFILE_ATTRIBUTE_TYPES.indexOf(attribute.type) === -1) {
    throw new Error('Unsupported ArchiMate profile attribute type: ' + (attribute && attribute.type));
  }

  if (value === undefined || value === null) {
    throw new Error('ArchiMate profile attribute value is required');
  }

  switch (attribute.type) {
  case 'String':
    return normalizeString(value);
  case 'Number':
  case 'Integer':
    if (attribute.type === 'Number') {
      return normalizeNumber(value);
    }
    return normalizeInteger(value);
  case 'Real':
  case 'Currency':
    return normalizeNumber(value);
  case 'Boolean':
    return normalizeBoolean(value);
  case 'Date':
    return normalizeDate(value);
  case 'URL':
    return normalizeUrl(value);
  case 'Time':
    return normalizeTime(value);
  case 'Structure':
    return normalizeStructure(value);
  default:
    throw new Error('Unsupported ArchiMate profile attribute type: ' + attribute.type);
  }
}

function normalizeString(value) {
  if (typeof value !== 'string') {
    throw new Error('ArchiMate profile attribute value must be a String');
  }

  return value;
}

function normalizeInteger(value) {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === 'string' && /^[+-]?\d+$/.test(value)) {
    return Number(value);
  }

  throw new Error('ArchiMate profile attribute value must be an Integer');
}

function normalizeNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && /^[+-]?(?:\d+|\d*\.\d+)$/.test(value)) {
    var numberValue = Number(value);

    if (Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  throw new Error('ArchiMate profile attribute value must be numeric');
}

function normalizeBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    var normalized = value.toLowerCase();

    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  throw new Error('ArchiMate profile attribute value must be Boolean');
}

function normalizeDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('ArchiMate profile attribute value must be a Date');
  }

  var date = new Date(value + 'T00:00:00Z');

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error('ArchiMate profile attribute value must be a valid Date');
  }

  return value;
}

function normalizeUrl(value) {
  if (typeof value !== 'string') {
    throw new Error('ArchiMate profile attribute value must be a URL');
  }

  try {
    new URL(value);
    return value;
  } catch (error) {
    throw new Error('ArchiMate profile attribute value must be a valid URL');
  }
}

function normalizeTime(value) {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)) {
    throw new Error('ArchiMate profile attribute value must be a Time');
  }

  return value;
}

function normalizeStructure(value) {
  if (typeof value !== 'object' || value === null) {
    throw new Error('ArchiMate profile attribute value must be a Structure');
  }

  return value;
}

function assertProfileAttributeIdentity(attribute) {
  if (!attribute || !attribute.concept) {
    throw new Error('ArchiMate profile attribute property requires concept');
  }

  if (!attribute.name) {
    throw new Error('ArchiMate profile attribute property requires name');
  }
}

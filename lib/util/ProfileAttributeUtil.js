export const PROFILE_ATTRIBUTE_TYPES = [
  'String',
  'Integer',
  'Real',
  'Boolean',
  'Currency',
  'Date',
  'URL',
  'Time',
  'Structure'
];

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
  case 'Integer':
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

export function normalizeRelationshipMultiplicity(value) {
  if (value === undefined || value === null) {
    return '';
  }

  var text = String(value).trim();

  return isValidRelationshipMultiplicity(text) ? text : '';
}

export function isValidRelationshipMultiplicity(value) {
  if (value === undefined || value === null) {
    return false;
  }

  var text = String(value).trim();

  if (!text) {
    return false;
  }

  if (text === '*') {
    return true;
  }

  if (/^[1-9]\d*$/.test(text)) {
    return true;
  }

  var range = /^(0|[1-9]\d*)\.\.(0|[1-9]\d*)$/.exec(text);

  if (!range) {
    return false;
  }

  return compareNonNegativeIntegerStrings(range[2], range[1]) > 0;
}

function compareNonNegativeIntegerStrings(left, right) {
  if (left.length !== right.length) {
    return left.length - right.length;
  }

  if (left === right) {
    return 0;
  }

  return left > right ? 1 : -1;
}

export const ARCHIMATE_RELATIONSHIP_CODES = [
  's',
  'c',
  'g',
  'i',
  'r',
  'v',
  'a',
  'n',
  't',
  'f',
  'o'
];

var RELATIONSHIP_NAME_TO_CODE = new Map([
  [ 'Specialization', 's' ],
  [ 'Composition', 'c' ],
  [ 'Aggregation', 'g' ],
  [ 'Assignment', 'i' ],
  [ 'Realization', 'r' ],
  [ 'Serving', 'v' ],
  [ 'Access', 'a' ],
  [ 'Influence', 'n' ],
  [ 'Triggering', 't' ],
  [ 'Flow', 'f' ],
  [ 'Association', 'o' ]
]);

var RELATIONSHIP_CODE_SET = new Set(ARCHIMATE_RELATIONSHIP_CODES);

export function createRelationshipProfileMatrixTemplate(validElementTypes) {
  var types = Array.from(toSet(validElementTypes));
  var rows = [ [ 'sourceType' ].concat(types) ];

  types.forEach(function(source) {
    rows.push([ source ].concat(types.map(function() {
      return '';
    })));
  });

  return rows;
}

export function serializeRelationshipProfileMatrix(matrixRows, delimiter) {
  delimiter = normalizeMatrixDelimiter(delimiter || '\t');

  return matrixRows.map(function(row) {
    if (!Array.isArray(row)) {
      throw new Error('ArchiMate 4 relationship profile matrix rows must be arrays');
    }

    return row.map(function(cell) {
      return serializeMatrixCell(cell, delimiter);
    }).join(delimiter);
  }).join('\n') + '\n';
}

export function normalizeRelationshipProfile(profile, validElementTypes, options) {
  profile = parseRelationshipProfile(profile);

  var maps = new Map();
  var validTypes = toSet(validElementTypes);
  var sourceProfiles = getSourceProfiles(profile);

  addSourceProfiles(maps, sourceProfiles, validTypes);

  if (options && options.requireComplete) {
    assertCompleteSourceCoverage(maps, validTypes);
  }

  if (options && options.requireCompleteTargets) {
    assertCompleteTargetCoverage(sourceProfiles, validTypes);
  }

  return maps;
}

export function parseRelationshipProfile(profile) {
  if (typeof profile !== 'string') {
    return profile;
  }

  try {
    return JSON.parse(profile);
  } catch (error) {
    throw new Error('ArchiMate 4 relationship profile JSON could not be parsed: ' + error.message);
  }
}

export function normalizeRelationshipLetters(relationships, context) {
  var letters = '';

  for (const relationship of relationshipTokens(relationships, context)) {
    var code = toRelationshipCode(relationship, context);

    if (letters.indexOf(code) === -1) {
      letters += code;
    }
  }

  return letters;
}

export function getRelationshipProfileStats(maps) {
  var sourceCount = 0;
  var relationshipCount = 0;

  maps.forEach(function(targetMap) {
    sourceCount += 1;
    relationshipCount += targetMap.size;
  });

  return {
    sourceCount: sourceCount,
    relationshipCount: relationshipCount
  };
}

export function getRelationshipProfileCoverageStats(profile, validElementTypes) {
  var report = getRelationshipProfileCoverageReport(profile, validElementTypes);

  return {
    sourceCount: report.sourceCount,
    targetCellCount: report.targetCellCount,
    expectedSourceCount: report.expectedSourceCount,
    expectedTargetCellCount: report.expectedTargetCellCount,
    completeSourceCoverage: report.completeSourceCoverage,
    completeTargetCoverage: report.completeTargetCoverage
  };
}

export function getRelationshipProfileCoverageReport(profile, validElementTypes) {
  profile = parseRelationshipProfile(profile);

  var validTypes = toSet(validElementTypes);
  var sourceProfiles = getSourceProfiles(profile);
  var coverage = collectCoverage(sourceProfiles, validTypes);
  var expectedTargetCellCount = validTypes.size * validTypes.size;
  var missingSourceTypes = collectMissingSourceTypes(coverage, validTypes);
  var missingTargetCells = collectMissingTargetCells(coverage, validTypes);

  return {
    sourceCount: coverage.sources.size,
    targetCellCount: coverage.cells.size,
    expectedSourceCount: validTypes.size,
    expectedTargetCellCount: expectedTargetCellCount,
    missingSourceCount: missingSourceTypes.length,
    missingTargetCellCount: missingTargetCells.length,
    missingSourceTypes: missingSourceTypes,
    missingTargetCells: missingTargetCells,
    completeSourceCoverage: missingSourceTypes.length === 0,
    completeTargetCoverage: missingTargetCells.length === 0
  };
}

function getSourceProfiles(profile) {
  if (!profile) {
    throw new Error('ArchiMate 4 relationship profile is required');
  }

  if (profile instanceof Map || Array.isArray(profile)) {
    return profile;
  }

  if (Array.isArray(profile.relationships)) {
    return profile.relationships;
  }

  if (Array.isArray(profile.matrix)) {
    return profile.matrix;
  }

  if (typeof profile.matrixText === 'string') {
    return parseRelationshipMatrixText(profile.matrixText, profile.matrixDelimiter);
  }

  if (profile.sources) {
    return profile.sources;
  }

  return profile;
}

function addSourceProfiles(maps, sourceProfiles, validTypes) {
  if (sourceProfiles instanceof Map) {
    sourceProfiles.forEach(function(targets, source) {
      addTargets(maps, source, targets, validTypes);
    });
    return;
  }

  if (Array.isArray(sourceProfiles)) {
    normalizeRows(sourceProfiles).forEach(function(row) {
      addRow(maps, row, validTypes);
    });
    return;
  }

  if (!isObject(sourceProfiles)) {
    throw new Error('ArchiMate 4 relationship profile must be a Map, object, or row array');
  }

  Object.keys(sourceProfiles).forEach(function(source) {
    addTargets(maps, source, sourceProfiles[source], validTypes);
  });
}

function addRow(maps, row, validTypes) {
  if (!isObject(row)) {
    throw new Error('ArchiMate 4 relationship profile rows must be objects or matrix arrays');
  }

  addRelationship(
    maps,
    row.source || row.sourceType,
    row.target || row.targetType,
    row.relationships || row.allowed,
    validTypes
  );
}

function addTargets(maps, source, targets, validTypes) {
  validateElementType(source, validTypes, 'source');
  ensureSourceMap(maps, source);

  if (targets instanceof Map) {
    targets.forEach(function(relationships, target) {
      addRelationship(maps, source, target, relationships, validTypes);
    });
    return;
  }

  if (!isObject(targets)) {
    throw new Error('ArchiMate 4 relationship targets for ' + source + ' must be a Map or object');
  }

  Object.keys(targets).forEach(function(target) {
    addRelationship(maps, source, target, targets[target], validTypes);
  });
}

function addRelationship(maps, source, target, relationships, validTypes) {
  validateElementType(source, validTypes, 'source');
  validateElementType(target, validTypes, 'target');

  var sourceMap = ensureSourceMap(maps, source);
  var letters = normalizeRelationshipLetters(relationships, source + ' -> ' + target);

  if (!letters) {
    return;
  }

  sourceMap.set(target, letters);
}

function ensureSourceMap(maps, source) {
  var sourceMap = maps.get(source);

  if (!sourceMap) {
    sourceMap = new Map();
    maps.set(source, sourceMap);
  }

  return sourceMap;
}

function relationshipTokens(relationships, context) {
  if (relationships === undefined || relationships === null || relationships === '') {
    return [];
  }

  if (Array.isArray(relationships)) {
    return relationships;
  }

  if (typeof relationships !== 'string') {
    throw new Error('Relationships for ' + context + ' must be a string or array');
  }

  var trimmed = relationships.trim();

  if (!trimmed) {
    return [];
  }

  if (RELATIONSHIP_NAME_TO_CODE.has(trimmed)) {
    return [ trimmed ];
  }

  if (/[,|\s]/.test(trimmed)) {
    return trimmed.split(/[,|\s]+/).filter(Boolean);
  }

  return trimmed.split('');
}

function toRelationshipCode(relationship, context) {
  var code = RELATIONSHIP_NAME_TO_CODE.get(relationship) || relationship;

  if (!RELATIONSHIP_CODE_SET.has(code)) {
    throw new Error(
      'Unsupported ArchiMate 4 relationship code "' + relationship + '" for ' + context
    );
  }

  return code;
}

function validateElementType(type, validTypes, role) {
  if (!validTypes.has(type)) {
    throw new Error('Unknown ArchiMate 4 ' + role + ' element: ' + type);
  }
}

function assertCompleteSourceCoverage(maps, validTypes) {
  validTypes.forEach(function(type) {
    if (!maps.has(type)) {
      throw new Error('ArchiMate 4 relationship profile is missing source element: ' + type);
    }
  });
}

function assertCompleteTargetCoverage(sourceProfiles, validTypes) {
  if (sourceProfiles instanceof Map) {
    assertCompleteTargetCoverageForMap(sourceProfiles, validTypes);
    return;
  }

  if (Array.isArray(sourceProfiles)) {
    assertCompleteTargetCoverageForRows(sourceProfiles, validTypes);
    return;
  }

  assertCompleteTargetCoverageForObject(sourceProfiles, validTypes);
}

function collectCoverage(sourceProfiles, validTypes) {
  var coverage = {
    sources: new Set(),
    cells: new Set()
  };

  if (sourceProfiles instanceof Map) {
    sourceProfiles.forEach(function(targets, source) {
      collectSourceCoverage(coverage, source, validTypes);
      collectTargetsCoverage(coverage, source, targets, validTypes);
    });
    return coverage;
  }

  if (Array.isArray(sourceProfiles)) {
    normalizeRows(sourceProfiles).forEach(function(row) {
      if (!isObject(row)) {
        return;
      }

      var source = row.source || row.sourceType,
          target = row.target || row.targetType;

      if (source) {
        collectSourceCoverage(coverage, source, validTypes);
      }

      if (source && target) {
        collectTargetCoverage(coverage, source, target, validTypes);
      }
    });
    return coverage;
  }

  if (!isObject(sourceProfiles)) {
    throw new Error('ArchiMate 4 relationship profile must be a Map, object, or row array');
  }

  Object.keys(sourceProfiles).forEach(function(source) {
    collectSourceCoverage(coverage, source, validTypes);
    collectTargetsCoverage(coverage, source, sourceProfiles[source], validTypes);
  });

  return coverage;
}

function collectTargetsCoverage(coverage, source, targets, validTypes) {
  if (targets instanceof Map) {
    targets.forEach(function(_relationships, target) {
      collectTargetCoverage(coverage, source, target, validTypes);
    });
    return;
  }

  if (!isObject(targets)) {
    throw new Error('ArchiMate 4 relationship targets for ' + source + ' must be a Map or object');
  }

  Object.keys(targets).forEach(function(target) {
    collectTargetCoverage(coverage, source, target, validTypes);
  });
}

function collectSourceCoverage(coverage, source, validTypes) {
  validateElementType(source, validTypes, 'source');
  coverage.sources.add(source);
}

function collectTargetCoverage(coverage, source, target, validTypes) {
  validateElementType(source, validTypes, 'source');
  validateElementType(target, validTypes, 'target');
  coverage.cells.add(source + '\u0000' + target);
}

function collectMissingSourceTypes(coverage, validTypes) {
  var missing = [];

  validTypes.forEach(function(source) {
    if (!coverage.sources.has(source)) {
      missing.push(source);
    }
  });

  return missing;
}

function collectMissingTargetCells(coverage, validTypes) {
  var missing = [];

  validTypes.forEach(function(source) {
    validTypes.forEach(function(target) {
      if (!coverage.cells.has(source + '\u0000' + target)) {
        missing.push({
          source: source,
          target: target
        });
      }
    });
  });

  return missing;
}

function assertCompleteTargetCoverageForMap(sourceProfiles, validTypes) {
  validTypes.forEach(function(source) {
    var targets = sourceProfiles.get(source);

    assertTargetsComplete(source, targets, validTypes);
  });
}

function assertCompleteTargetCoverageForObject(sourceProfiles, validTypes) {
  validTypes.forEach(function(source) {
    var targets = sourceProfiles && sourceProfiles[source];

    assertTargetsComplete(source, targets, validTypes);
  });
}

function assertCompleteTargetCoverageForRows(sourceProfiles, validTypes) {
  var cells = new Set();

  normalizeRows(sourceProfiles).forEach(function(row) {
    if (!isObject(row)) {
      return;
    }

    var source = row.source || row.sourceType,
        target = row.target || row.targetType;

    if (source && target) {
      cells.add(source + '\u0000' + target);
    }
  });

  validTypes.forEach(function(source) {
    validTypes.forEach(function(target) {
      if (!cells.has(source + '\u0000' + target)) {
        throw new Error(
          'ArchiMate 4 relationship profile is missing target element: ' + source + ' -> ' + target
        );
      }
    });
  });
}

function normalizeRows(sourceProfiles) {
  if (!isRelationshipMatrixRows(sourceProfiles)) {
    return sourceProfiles;
  }

  return relationshipMatrixRowsToObjects(sourceProfiles);
}

function isRelationshipMatrixRows(sourceProfiles) {
  return Array.isArray(sourceProfiles[0]);
}

function relationshipMatrixRowsToObjects(matrixRows) {
  var header = matrixRows[0];

  if (!Array.isArray(header) || header.length < 2) {
    throw new Error('ArchiMate 4 relationship profile matrix requires a header row');
  }

  var targets = header.slice(1).map(toCellString);
  var rows = [];

  matrixRows.slice(1).forEach(function(matrixRow) {
    if (isBlankMatrixRow(matrixRow)) {
      return;
    }

    if (!Array.isArray(matrixRow)) {
      throw new Error('ArchiMate 4 relationship profile matrix rows must be arrays');
    }

    var source = toCellString(matrixRow[0]);

    targets.forEach(function(target, index) {
      if (!target) {
        throw new Error('ArchiMate 4 relationship profile matrix header contains an empty target');
      }

      rows.push({
        source: source,
        target: target,
        relationships: matrixRow[index + 1]
      });
    });
  });

  return rows;
}

function isBlankMatrixRow(row) {
  return Array.isArray(row) && row.every(function(cell) {
    return toCellString(cell) === '';
  });
}

function parseRelationshipMatrixText(text, delimiter) {
  return parseDelimitedRows(text, normalizeMatrixDelimiter(delimiter || detectMatrixDelimiter(text)));
}

function detectMatrixDelimiter(text) {
  var firstLine = String(text).split(/\r\n|\n|\r/).find(function(line) {
    return line.trim();
  }) || '';
  var candidates = [ '\t', ',', ';' ];
  var selected = ',';
  var selectedCount = -1;

  candidates.forEach(function(candidate) {
    var count = firstLine.split(candidate).length - 1;

    if (count > selectedCount) {
      selected = candidate;
      selectedCount = count;
    }
  });

  return selected;
}

function normalizeMatrixDelimiter(delimiter) {
  if (delimiter === 'tab' || delimiter === '\\t') {
    return '\t';
  }

  return delimiter;
}

function parseDelimitedRows(text, delimiter) {
  var rows = [ [] ];
  var cell = '';
  var inQuotes = false;
  var normalizedText = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (var index = 0; index < normalizedText.length; index++) {
    var character = normalizedText[index];

    if (inQuotes) {
      if (character === '"' && normalizedText[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"') {
      inQuotes = true;
    } else if (character === delimiter) {
      rows[rows.length - 1].push(cell);
      cell = '';
    } else if (character === '\n') {
      rows[rows.length - 1].push(cell);
      rows.push([]);
      cell = '';
    } else {
      cell += character;
    }
  }

  if (inQuotes) {
    throw new Error('ArchiMate 4 relationship profile matrix text has an unterminated quoted cell');
  }

  rows[rows.length - 1].push(cell);

  return rows;
}

function assertTargetsComplete(source, targets, validTypes) {
  validTypes.forEach(function(target) {
    if (!hasTarget(targets, target)) {
      throw new Error(
        'ArchiMate 4 relationship profile is missing target element: ' + source + ' -> ' + target
      );
    }
  });
}

function hasTarget(targets, target) {
  if (targets instanceof Map) {
    return targets.has(target);
  }

  return isObject(targets) && Object.prototype.hasOwnProperty.call(targets, target);
}

function toSet(values) {
  if (values instanceof Set) {
    return values;
  }

  return new Set(values);
}

function toCellString(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

function serializeMatrixCell(value, delimiter) {
  var text = value === undefined || value === null ? '' : String(value);

  if (text.includes(delimiter) || /["\r\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }

  return text;
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

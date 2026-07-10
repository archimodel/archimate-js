import fs from 'node:fs';
import path from 'node:path';

import archimate4Profile from '../lib/metamodel/languages/archimate4-profile.json' with { type: 'json' };
import {
  createRelationshipProfileMatrixTemplate,
  serializeRelationshipProfileMatrix
} from '../lib/metamodel/languages/relationship-profile-loader.js';

const args = parseArgs(process.argv.slice(2));
const delimiter = normalizeDelimiter(args.delimiter);
const conceptTypes = archimate4Profile.elements.map(function(element) {
  return element.type;
}).concat(
  (archimate4Profile.connectors || []).map(function(connector) {
    return connector.type;
  }),
  archimate4Profile.relationships || []
);
const matrix = createRelationshipProfileMatrixTemplate(conceptTypes);
const output = serializeRelationshipProfileMatrix(matrix, delimiter);

if (args.out) {
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, output);
} else {
  process.stdout.write(output);
}

function parseArgs(rawArgs) {
  const parsed = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    if (rawArgs[index] === '--out') {
      parsed.out = rawArgs[index + 1];
      index += 1;
    } else if (rawArgs[index] === '--delimiter') {
      parsed.delimiter = rawArgs[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function normalizeDelimiter(value) {
  if (!value || value === 'tab' || value === '\\t') {
    return '\t';
  }

  if (value === 'comma' || value === 'csv') {
    return ',';
  }

  if (value === 'semicolon') {
    return ';';
  }

  if ([ ',', ';', '\t' ].includes(value)) {
    return value;
  }

  throw new Error('Unsupported matrix delimiter: ' + value);
}

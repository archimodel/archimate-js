import fs from 'node:fs';
import path from 'node:path';

import { getArchimate4ImplementationStatus } from '../lib/metamodel/languages/index.js';

const args = parseArgs(process.argv.slice(2));
const checkedAt = args.checkedAt || formatTokyoDate(new Date());
const sourceRunlogPath = normalizeRepoPath(args.sourceRunlogPath || args.out || '');
const status = getArchimate4ImplementationStatus(
  sourceRunlogPath
    ? { implementationCompletionRunlogPath: sourceRunlogPath }
    : undefined
);
const completeSummaries = collectCompleteStatusSummaries(status);
const incompleteSummaries = collectIncompleteStatusSummaries(status);

const report = {
  checkedAt,
  source: 'getArchimate4ImplementationStatus',
  generator: 'scripts/write_archimate4_status_completion_scan.mjs',
  topKeys: Object.keys(status),
  topKeyCount: Object.keys(status).length,
  implementationCompletion: status.implementationCompletion,
  completeSummaryCount: completeSummaries.length,
  incompleteSummaryCount: incompleteSummaries.length,
  incompleteSummaryPaths: incompleteSummaries.map(function(summary) {
    return summary.path;
  }),
  sectionCoverageStatusKeys: status.sectionCoverage.statusKeyIds,
  sectionCoverageMissingStatusKeyIds: status.sectionCoverage.missingStatusKeyIds,
  sectionCoverageExtraStatusKeyIds: status.sectionCoverage.extraStatusKeyIds,
  sectionCoverageMissingStatusKeyReferenceIds: status.sectionCoverage.missingStatusKeyReferenceIds,
  completeSummaries,
  incompleteSummaries
};

const json = JSON.stringify(report, null, 2) + '\n';

if (args.out) {
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, json);
} else {
  process.stdout.write(json);
}

if (incompleteSummaries.length > 0) {
  process.exitCode = 1;
}

function collectCompleteStatusSummaries(value, pathSegments = []) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const summaries = [];

  if (Object.prototype.hasOwnProperty.call(value, 'complete')) {
    summaries.push({
      path: pathSegments.join('.'),
      complete: value.complete
    });
  }

  Object.entries(value).forEach(function(entry) {
    summaries.push(...collectCompleteStatusSummaries(entry[1], pathSegments.concat(entry[0])));
  });

  return summaries;
}

function collectIncompleteStatusSummaries(value, pathSegments = []) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const incomplete = [];

  if (Object.prototype.hasOwnProperty.call(value, 'complete') && value.complete !== true) {
    incomplete.push({
      path: pathSegments.join('.'),
      complete: value.complete,
      status: value.status
    });
  }

  Object.entries(value).forEach(function(entry) {
    incomplete.push(...collectIncompleteStatusSummaries(entry[1], pathSegments.concat(entry[0])));
  });

  return incomplete;
}

function parseArgs(rawArgs) {
  const parsed = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg === '--out') {
      parsed.out = rawArgs[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--checked-at') {
      parsed.checkedAt = rawArgs[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--source-runlog-path') {
      parsed.sourceRunlogPath = rawArgs[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function normalizeRepoPath(filePath) {
  return filePath ? filePath.replace(/\\/g, '/') : '';
}

function formatTokyoDate(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date).reduce(function(values, part) {
    values[part.type] = part.value;
    return values;
  }, {});

  return parts.year + '-' + parts.month + '-' + parts.day +
    'T' + parts.hour + ':' + parts.minute + ':' + parts.second + '+09:00';
}

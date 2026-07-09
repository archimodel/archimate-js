import fs from 'node:fs';
import path from 'node:path';

import { getArchimate4ImplementationStatus } from '../lib/metamodel/languages/index.js';

const args = parseArgs(process.argv.slice(2));
const checkedAt = args.checkedAt || formatTokyoDate(new Date());
const status = getArchimate4ImplementationStatus();
const checks = [];

const expectedCoverageIds = [
  'sectionCoverage',
  'introductionCoverage',
  'definitionCoverage',
  'languageStructureCoverage',
  'commonDomainCoverage',
  'relationshipsAndJunctionsCoverage',
  'motivationDomainCoverage',
  'strategyDomainCoverage',
  'businessDomainCoverage',
  'applicationDomainCoverage',
  'technologyDomainCoverage',
  'relationshipsBetweenCoreDomainsCoverage',
  'implementationAndMigrationDomainCoverage',
  'stakeholdersArchitectureViewsViewpointsCoverage',
  'languageCustomizationMechanismsCoverage',
  'appendixANotationCoverage',
  'appendixBRelationshipsCoverage',
  'appendixCExampleViewpointsCoverage',
  'appendixDStandardsGuidanceCoverage',
  'appendixEVersionChangesCoverage',
  'appendixFAcronymsCoverage',
  'documentArtifactCoverage'
];

const expectedOutlineCoverageIds = expectedCoverageIds.filter(function(coverageId) {
  return coverageId !== 'appendixFAcronymsCoverage';
});

const expectedSourceRunlogPaths = {
  sectionCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  introductionCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  definitionCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  languageStructureCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  commonDomainCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  relationshipsAndJunctionsCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  motivationDomainCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  strategyDomainCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  businessDomainCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  applicationDomainCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  technologyDomainCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  relationshipsBetweenCoreDomainsCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  implementationAndMigrationDomainCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  stakeholdersArchitectureViewsViewpointsCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  languageCustomizationMechanismsCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  appendixANotationCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  appendixBRelationshipsCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  appendixCExampleViewpointsCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  appendixDStandardsGuidanceCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  appendixEVersionChangesCoverage: 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  appendixFAcronymsCoverage: 'project_memory/runlogs/20260709-1066-c260-appendix-f-acronyms-source-check.txt',
  documentArtifactCoverage: 'project_memory/runlogs/20260709-1093-c260-document-artifacts-source-check.txt'
};

const expectedUniqueSourceRunlogPaths = [
  'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt',
  'project_memory/runlogs/20260709-1066-c260-appendix-f-acronyms-source-check.txt',
  'project_memory/runlogs/20260709-1093-c260-document-artifacts-source-check.txt'
];

const expectedOfficialBlockers = [
  'officialAppendixBRelationshipMatrix',
  'officialMeff4Xsd',
  'exactAppendixAArtworkRights'
];

const expectedMissingRequiredSources = [
  'appendixBRelationshipMatrix',
  'meff4Xsd',
  'appendixAArtworkRights'
];

const coverageGroupChecks = [
  check('sectionCoverage.complete', status.sectionCoverage.complete === true),
  check('sectionCoverage.expectedCount', status.sectionCoverage.expectedCount === 20),
  check('sectionCoverage.actualCount', status.sectionCoverage.actualIds.length === 20, {
    actualCount: status.sectionCoverage.actualIds.length
  }),
  checkArray('sectionCoverage.missingIds', status.sectionCoverage.missingIds, []),
  checkArray('sectionCoverage.extraIds', status.sectionCoverage.extraIds, []),
  checkArray('sectionCoverage.missingRequirementReferenceIds', status.sectionCoverage.missingRequirementReferenceIds, []),
  checkArray('sectionCoverage.missingExternalBlockerReferenceIds', status.sectionCoverage.missingExternalBlockerReferenceIds, []),
  checkArray('sectionCoverage.missingStatusKeyReferenceIds', status.sectionCoverage.missingStatusKeyReferenceIds, []),
  check('c260CoverageAggregate.complete', status.c260CoverageAggregate.complete === true),
  checkArray('c260CoverageAggregate.expectedCoverageIds', status.c260CoverageAggregate.expectedCoverageIds, expectedCoverageIds),
  checkArray('c260CoverageAggregate.actualCoverageIds', status.c260CoverageAggregate.actualCoverageIds, expectedCoverageIds),
  checkArray('c260CoverageAggregate.incompleteCoverageIds', status.c260CoverageAggregate.incompleteCoverageIds, []),
  check('c260CoverageAggregate.expectedCoverageCount', status.c260CoverageAggregate.expectedCoverageCount === 22),
  check('c260CoverageAggregate.actualCoverageCount', status.c260CoverageAggregate.actualCoverageCount === 22),
  check('c260CoverageAggregate.expectedItemCount', status.c260CoverageAggregate.expectedItemCount === 284),
  check('c260CoverageAggregate.actualItemCount', status.c260CoverageAggregate.actualItemCount === 284),
  check('c260CoverageAggregate.qualifiedDuplicateCount', status.c260CoverageAggregate.qualifiedDuplicateCount === 0)
];

const sourceAlignmentChecks = [
  check('c260SourceAlignment.complete', status.c260SourceAlignment.complete === true),
  check('c260SourceAlignment.outlineSourceItemCount', status.c260SourceAlignment.outlineSourceItemCount === 253),
  check('c260SourceAlignment.outlineCoveredItemCount', status.c260SourceAlignment.outlineCoveredItemCount === 253),
  check('c260SourceAlignment.outlineItemCountDelta', status.c260SourceAlignment.outlineItemCountDelta === 0),
  checkArray('c260SourceAlignment.expectedOutlineCoverageIds', status.c260SourceAlignment.expectedOutlineCoverageIds, expectedOutlineCoverageIds),
  checkArray('c260SourceAlignment.actualOutlineCoverageIds', status.c260SourceAlignment.actualOutlineCoverageIds, expectedOutlineCoverageIds),
  checkArray('c260SourceAlignment.missingOutlineCoverageIds', status.c260SourceAlignment.missingOutlineCoverageIds, []),
  checkArray('c260SourceAlignment.extraOutlineCoverageIds', status.c260SourceAlignment.extraOutlineCoverageIds, []),
  checkArray('c260SourceAlignment.incompleteOutlineCoverageIds', status.c260SourceAlignment.incompleteOutlineCoverageIds, []),
  checkArray('c260SourceAlignment.nonOutlineDerivedCoverageIds', status.c260SourceAlignment.nonOutlineDerivedCoverageIds, [ 'appendixFAcronymsCoverage' ]),
  check('c260SourceAlignment.nonOutlineDerivedItemCount', status.c260SourceAlignment.nonOutlineDerivedItemCount === 31),
  check('c260SourceAlignment.expectedOutlineAssignedItemCount', status.c260SourceAlignment.expectedOutlineAssignedItemCount === 253),
  check('c260SourceAlignment.actualOutlineAssignedItemCount', status.c260SourceAlignment.actualOutlineAssignedItemCount === 253),
  check('c260SourceAlignment.outlineAssignmentComplete', status.c260SourceAlignment.outlineAssignmentComplete === true),
  checkArray('c260SourceAlignment.outlineCoverageCountDeltas', status.c260SourceAlignment.outlineCoverageCountDeltas, []),
  check('c260SourceAlignment.aggregateItemCount', status.c260SourceAlignment.aggregateItemCount === 284),
  check('c260SourceAlignment.expectedAggregateItemCount', status.c260SourceAlignment.expectedAggregateItemCount === 284),
  check('c260SourceAlignment.aggregateItemCountDelta', status.c260SourceAlignment.aggregateItemCountDelta === 0),
  checkPath('c260SourceAlignment.outlineSourceRunlogPath', status.c260SourceAlignment.outlineSourceRunlogPath)
];

const sourceEvidenceChecks = [
  check('c260CoverageSourceEvidence.complete', status.c260CoverageSourceEvidence.complete === true),
  checkObject('c260CoverageSourceEvidence.coverageSourceRunlogPaths', status.c260CoverageSourceEvidence.coverageSourceRunlogPaths, expectedSourceRunlogPaths),
  checkArray('c260CoverageSourceEvidence.missingSourceRunlogCoverageIds', status.c260CoverageSourceEvidence.missingSourceRunlogCoverageIds, []),
  checkArray('c260CoverageSourceEvidence.extraSourceRunlogCoverageIds', status.c260CoverageSourceEvidence.extraSourceRunlogCoverageIds, []),
  checkArray('c260CoverageSourceEvidence.sourceRunlogPathDeltas', status.c260CoverageSourceEvidence.sourceRunlogPathDeltas, []),
  checkArray('c260CoverageSourceEvidence.uniqueSourceRunlogPaths', status.c260CoverageSourceEvidence.uniqueSourceRunlogPaths, expectedUniqueSourceRunlogPaths),
  check('c260CoverageSourceEvidence.expectedCoverageCount', status.c260CoverageSourceEvidence.expectedCoverageCount === 22),
  check('c260CoverageSourceEvidence.actualCoverageCount', status.c260CoverageSourceEvidence.actualCoverageCount === 22),
  ...Object.entries(status.c260CoverageSourceEvidence.coverageSourceRunlogPaths || {}).map(function(entry) {
    return checkPath('c260CoverageSourceEvidence.runlog.' + entry[0], entry[1]);
  })
];

const externalBoundaryChecks = [
  check('conformanceReadiness.officialConformanceClaimable', status.conformanceReadiness.officialConformanceClaimable === false),
  checkArray('conformanceReadiness.blockers', status.conformanceReadiness.blockers, expectedOfficialBlockers),
  checkArray('sourceCoverage.missingRequiredSources', status.sourceCoverage.missingRequiredSources, expectedMissingRequiredSources),
  checkArray('remainingGaps.officialConformanceGapIds', status.remainingGaps.officialConformanceGapIds, expectedOfficialBlockers)
];

checks.push(...coverageGroupChecks, ...sourceAlignmentChecks, ...sourceEvidenceChecks, ...externalBoundaryChecks);

const failures = checks.filter(function(item) {
  return !item.pass;
});

const report = {
  checkedAt,
  source: 'getArchimate4ImplementationStatus',
  complete: failures.length === 0,
  coverageGroups: {
    expectedCoverageIds,
    actualCoverageIds: status.c260CoverageAggregate.actualCoverageIds,
    expectedCoverageCount: status.c260CoverageAggregate.expectedCoverageCount,
    actualCoverageCount: status.c260CoverageAggregate.actualCoverageCount,
    incompleteCoverageIds: status.c260CoverageAggregate.incompleteCoverageIds
  },
  counts: {
    sectionCount: status.sectionCoverage.expectedCount,
    aggregateItemCount: status.c260CoverageAggregate.actualItemCount,
    outlineSourceItemCount: status.c260SourceAlignment.outlineSourceItemCount,
    outlineCoveredItemCount: status.c260SourceAlignment.outlineCoveredItemCount,
    nonOutlineDerivedItemCount: status.c260SourceAlignment.nonOutlineDerivedItemCount,
    uniqueSourceRunlogPathCount: status.c260CoverageSourceEvidence.uniqueSourceRunlogPaths.length
  },
  sourceEvidence: {
    outlineSourceRunlogPath: status.c260SourceAlignment.outlineSourceRunlogPath,
    coverageSourceRunlogPaths: status.c260CoverageSourceEvidence.coverageSourceRunlogPaths,
    uniqueSourceRunlogPaths: status.c260CoverageSourceEvidence.uniqueSourceRunlogPaths
  },
  externalBoundariesRetained: {
    officialConformanceClaimable: status.conformanceReadiness.officialConformanceClaimable,
    officialBlockerIds: status.conformanceReadiness.blockers,
    missingRequiredSources: status.sourceCoverage.missingRequiredSources,
    missingCompanionSources: status.sourceCoverage.missingCompanionSources
  },
  checkCount: checks.length,
  failureCount: failures.length,
  failures
};

const json = JSON.stringify(report, null, 2) + '\n';

if (args.out) {
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, json);
} else {
  process.stdout.write(json);
}

if (!report.complete) {
  process.exitCode = 1;
}

function check(id, condition, evidence = {}) {
  return {
    id,
    pass: condition === true,
    evidence
  };
}

function checkArray(id, actual, expected) {
  return check(id, arraysEqual(actual || [], expected), {
    actual,
    expected
  });
}

function checkObject(id, actual, expected) {
  return check(id, objectsEqual(actual || {}, expected), {
    actual,
    expected
  });
}

function checkPath(id, filePath, evidence = {}) {
  return check(id, typeof filePath === 'string' && fs.existsSync(filePath), Object.assign({
    path: filePath
  }, evidence));
}

function arraysEqual(actual, expected) {
  return actual.length === expected.length && actual.every(function(item, index) {
    return item === expected[index];
  });
}

function objectsEqual(actual, expected) {
  const actualKeys = Object.keys(actual);
  const expectedKeys = Object.keys(expected);

  return arraysEqual(actualKeys, expectedKeys) && expectedKeys.every(function(key) {
    return actual[key] === expected[key];
  });
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
    }
  }

  return parsed;
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

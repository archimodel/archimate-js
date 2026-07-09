import fs from 'node:fs';
import path from 'node:path';

import { getArchimate4ImplementationStatus } from '../lib/metamodel/languages/index.js';

const args = parseArgs(process.argv.slice(2));
const checkedAt = args.checkedAt || formatTokyoDate(new Date());
const status = getArchimate4ImplementationStatus();
const checks = [];

const expectedRequiredExternalSources = [
  'appendixBRelationshipMatrix',
  'meff4Xsd',
  'appendixAArtworkRights'
];

const expectedCompanionSources = [ 'w262' ];

const expectedRemainingGaps = [
  'officialAppendixBRelationshipMatrix',
  'officialMeff4Xsd',
  'exactAppendixAArtworkRights',
  'w262CompanionPaper'
];

const expectedOfficialBlockers = [
  'officialAppendixBRelationshipMatrix',
  'officialMeff4Xsd',
  'exactAppendixAArtworkRights'
];

const docs = [
  'README.md',
  'CHANGELOG.md',
  'docs/archimate4/sources.md',
  'docs/archimate4/official-specification.md',
  'docs/superpowers/plans/2026-07-08-archimate-4-support.md',
  'project_memory/state/aria_state.json',
  'project_memory/logs/worklog.md'
];

const implementationFiles = [
  'lib/metamodel/languages/index.js',
  'lib/metamodel/languages/archimate4-profile.json',
  'lib/metamodel/languages/archimate4-relationships.js',
  'lib/metamodel/languages/relationship-profile-loader.js',
  'lib/migration/archimate3-to-4.js',
  'lib/moddle/resources/archimate4.json',
  'lib/features/palette/PaletteProvider.js',
  'lib/draw/ArchimateRenderer.js',
  'lib/features/popup-menu/ConnectionMenuProvider.js',
  'test/language-profile.test.mjs',
  'test/xml-roundtrip.test.mjs',
  'test/migration.test.mjs',
  'test/relationship-rules.test.mjs',
  'test/multiplicity.test.mjs'
];

const milestones = [
  evaluateMilestone('M0 Source Gate', [
    check('m0.sourceCoverage.complete', status.sourceCoverage.complete === true, {
      actualSourceIds: status.sourceCoverage.actualSourceIds,
      missingRequiredSources: status.sourceCoverage.missingRequiredSources,
      missingCompanionSources: status.sourceCoverage.missingCompanionSources
    }),
    check('m0.c260.localSourcePresent', status.sourceCoverage.items.c260.localSourcePresent === true),
    check('m0.launchTranscript.localSourcePresent', status.sourceCoverage.items.launchTranscript.localSourcePresent === true),
    checkArray(
      'm0.missingRequiredSources',
      status.sourceCoverage.missingRequiredSources,
      expectedRequiredExternalSources
    ),
    checkArray(
      'm0.missingCompanionSources',
      status.sourceCoverage.missingCompanionSources,
      expectedCompanionSources
    ),
    checkArray('m0.remainingGaps', status.remainingGaps.actualIds, expectedRemainingGaps)
  ]),
  evaluateMilestone('M1 Runtime Boundary', [
    check('m1.elementCatalog.complete', status.elementCatalog.complete === true),
    check('m1.elementCatalog.expectedCount', status.elementCatalog.expectedCount === 42, {
      expectedCount: status.elementCatalog.expectedCount
    }),
    checkArray('m1.elementCatalog.missingTypes', status.elementCatalog.missingTypes, []),
    checkArray('m1.elementCatalog.extraTypes', status.elementCatalog.extraTypes, []),
    check('m1.relationshipConnectors.complete', status.relationshipConnectors.complete === true),
    checkArray(
      'm1.relationshipConnectors.types',
      status.relationshipConnectors.actualTypes,
      [ 'AndJunction', 'OrJunction' ]
    )
  ]),
  evaluateMilestone('M2 XML Boundary', [
    check('m2.exchangeFormat.status', status.exchangeFormat.status === 'experimental', {
      status: status.exchangeFormat.status
    }),
    check('m2.exchangeFormat.internalRoundTripTested', status.exchangeFormat.internalRoundTripTested === true),
    check('m2.exchangeFormat.officialXsdRequired', status.exchangeFormat.officialXsdRequired === true),
    check('m2.exchangeFormat.officialConformanceClaimable', status.exchangeFormat.officialConformanceClaimable === false),
    checkPath('m2.exchangeFormat.internalRoundTripRunlogPath', status.exchangeFormat.internalRoundTripRunlogPath)
  ]),
  evaluateMilestone('M3 Semantics', [
    check('m3.conformanceRequirements.complete', status.conformanceRequirements.complete === true),
    check('m3.conformanceRequirements.shall.complete', status.conformanceRequirements.shall.complete === true),
    check('m3.relationshipProfile.completeSourceCoverage', status.relationshipProfile.completeSourceCoverage === true),
    check('m3.relationshipProfile.completeTargetCoverage', status.relationshipProfile.completeTargetCoverage === true),
    check(
      'm3.appendixB.externalProfileLoaderImplemented',
      status.sourceCoverage.items.appendixBRelationshipMatrix.externalProfileLoaderImplemented === true
    ),
    check(
      'm3.appendixB.redistributableProfilePresent',
      status.sourceCoverage.items.appendixBRelationshipMatrix.redistributableProfilePresent === false
    ),
    checkPath('m3.migrationUtility.file', 'lib/migration/archimate3-to-4.js')
  ]),
  evaluateMilestone('M4 Modeling UX', [
    check('m4.iconography.status', status.iconography.status === 'local-renderer-coverage', {
      status: status.iconography.status
    }),
    check('m4.iconography.profilePictogramCoverage', status.iconography.profilePictogramCoverage === 'dedicated-local-paths'),
    check('m4.iconography.genericObjectAliasCount', status.iconography.genericObjectAliasCount === 0),
    check('m4.profileAttributeTypes.complete', status.profileAttributeTypes.complete === true),
    check('m4.viewpointMechanism.complete', status.viewpointMechanism.complete === true),
    check(
      'm4.appendixA.localDedicatedPathCoverageComplete',
      status.sourceCoverage.items.appendixAArtworkRights.localDedicatedPathCoverageComplete === true
    ),
    checkPath('m4.paletteProvider.file', 'lib/features/palette/PaletteProvider.js'),
    checkPath('m4.renderer.file', 'lib/draw/ArchimateRenderer.js')
  ]),
  evaluateMilestone('M5 Release Readiness', [
    check('m5.implementationCompletion.complete', status.implementationCompletion.complete === true),
    check('m5.implementationCompletion.incompleteSummaryCount', status.implementationCompletion.incompleteSummaryCount === 0, {
      incompleteSummaryCount: status.implementationCompletion.incompleteSummaryCount
    }),
    checkArray('m5.officialConformanceBlockers', status.conformanceReadiness.blockers, expectedOfficialBlockers),
    check('m5.conformanceReadiness.officialConformanceClaimable', status.conformanceReadiness.officialConformanceClaimable === false),
    ...docs.map(function(file) {
      return checkPath('m5.doc.' + file, file);
    })
  ])
];

const implementationFileChecks = implementationFiles.map(function(file) {
  return checkPath('implementationFile.' + file, file);
});

const runlogReferences = collectRunlogReferences(status);
const runlogReferenceChecks = runlogReferences.map(function(reference) {
  return checkPath('runlogReference.' + reference.keyPath, reference.runlogPath, {
    runlogPath: reference.runlogPath
  });
});

checks.push(...implementationFileChecks, ...runlogReferenceChecks);

const failures = checks.filter(function(item) {
  return !item.pass;
});

const report = {
  checkedAt,
  source: 'getArchimate4ImplementationStatus',
  complete: failures.length === 0,
  milestoneCount: milestones.length,
  completeMilestoneCount: milestones.filter(function(milestone) {
    return milestone.complete;
  }).length,
  milestones,
  externalBlockers: {
    officialConformanceClaimable: status.conformanceReadiness.officialConformanceClaimable,
    officialBlockerIds: status.conformanceReadiness.blockers,
    missingRequiredSources: status.sourceCoverage.missingRequiredSources,
    missingCompanionSources: status.sourceCoverage.missingCompanionSources,
    remainingGapIds: status.remainingGaps.actualIds
  },
  evidence: {
    statusTopKeyCount: status.implementationCompletion.topKeyCount,
    completeSummaryCount: status.implementationCompletion.completeSummaryCount,
    incompleteSummaryCount: status.implementationCompletion.incompleteSummaryCount,
    statusCompletionRunlogPath: status.implementationCompletion.sourceRunlogPath,
    runlogReferenceCount: runlogReferences.length,
    missingRunlogReferenceCount: runlogReferenceChecks.filter(function(item) {
      return !item.pass;
    }).length
  },
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

function evaluateMilestone(id, milestoneChecks) {
  checks.push(...milestoneChecks);

  return {
    id,
    complete: milestoneChecks.every(function(item) {
      return item.pass;
    }),
    checkIds: milestoneChecks.map(function(item) {
      return item.id;
    }),
    failedCheckIds: milestoneChecks.filter(function(item) {
      return !item.pass;
    }).map(function(item) {
      return item.id;
    })
  };
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

function collectRunlogReferences(value, pathSegments = []) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(function(child, index) {
      return collectRunlogReferences(child, pathSegments.concat(String(index)));
    });
  }

  const references = [];

  Object.entries(value).forEach(function(entry) {
    const key = entry[0];
    const child = entry[1];

    if (/RunlogPath/.test(key)) {
      const values = Array.isArray(child) ? child : [ child ];

      values.forEach(function(runlogPath, index) {
        if (typeof runlogPath === 'string') {
          references.push({
            keyPath: pathSegments.concat(key, String(index)).join('.'),
            runlogPath
          });
        }
      });
    }

    references.push(...collectRunlogReferences(child, pathSegments.concat(key)));
  });

  return references;
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

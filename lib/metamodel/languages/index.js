import archimate3Profile from './archimate3-profile.json' with { type: 'json' };
import archimate4Profile from './archimate4-profile.json' with { type: 'json' };
import archimate4Descriptor from '../../moddle/resources/archimate4.json' with { type: 'json' };
import { getArchimate3RelationshipMap } from './archimate3-relationships.js';
import {
  getArchimate4RelationshipMap,
  getArchimate4RelationshipProfileStatus
} from './archimate4-relationships.js';
import {
  PROFILE_ATTRIBUTE_TYPES,
  getProfileAttributePropertyName,
  getProfileAttributePropertyValue,
  isProfileAttributeValueValid,
  normalizeProfileAttributeValue,
  parseProfileAttributePropertyValue,
  serializeProfileAttributePropertyValue,
  setProfileAttributePropertyValue
} from '../../util/ProfileAttributeUtil.js';

export {
  PROFILE_ATTRIBUTE_TYPES,
  getProfileAttributePropertyName,
  getProfileAttributePropertyValue,
  isProfileAttributeValueValid,
  normalizeProfileAttributeValue,
  parseProfileAttributePropertyValue,
  serializeProfileAttributePropertyValue,
  setProfileAttributePropertyValue
};

export const DEFAULT_ARCHIMATE_VERSION = '3.2';
export const VIEWPOINT_PURPOSES = [ 'Designing', 'Deciding', 'Informing' ];
export const VIEWPOINT_CONTENT_TYPES = [ 'Details', 'Coherence', 'Overview' ];

const PROFILES = new Map([
  [ '3', archimate3Profile ],
  [ '3.0', archimate3Profile ],
  [ '3.1', archimate3Profile ],
  [ '3.2', archimate3Profile ],
  [ '4', archimate4Profile ],
  [ '4.0', archimate4Profile ]
]);
const ARCHIMATE4_IMPLEMENTATION_STATUS_KEY_IDS = [
  'version',
  'standard',
  'experimental',
  'namespace',
  'schemaLocation',
  'elementCatalog',
  'relationshipConnectors',
  'relationshipMatrix',
  'relationshipProfile',
  'modelValidation',
  'exchangeFormat',
  'iconography',
  'profileAttributeTypes',
  'viewpointClassification',
  'viewpointMechanism',
  'stakeholderConcerns',
  'conformanceRequirements',
  'sourceCoverage',
  'conformanceReadiness',
  'remainingGaps',
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
  'exampleViewpointCatalog',
  'appendixDStandardsGuidanceCoverage',
  'appendixEVersionChangesCoverage',
  'appendixFAcronymsCoverage',
  'documentArtifactCoverage',
  'c260CoverageAggregate',
  'c260SourceAlignment',
  'c260CoverageSourceEvidence',
  'externalBlockerCatalog',
  'externalBlockers',
  'implementationCompletion'
];
const ARCHIMATE4_IMPLEMENTATION_COMPLETION_RUNLOG_PATH =
  'project_memory/runlogs/20260710-0061-status-completion-api-scan.json';
const ARCHIMATE4_EXAMPLE_VIEWPOINT_GROUP_COUNT = 4;
const ARCHIMATE4_EXAMPLE_VIEWPOINT_COUNT = 25;
const ARCHIMATE4_MODEL_VALIDATION_CHECK_IDS = [
  'element-catalog',
  'retired-archimate3-concepts',
  'relationship-catalog',
  'relationship-endpoint-catalog',
  'active-relationship-profile',
  'multiplicity-notation',
  'junction-multiplicity',
  'junction-relationship-type-consistency',
  'junction-chain-profile-validation',
  'viewpoint-purpose-content',
  'viewpoint-allowed-types',
  'view-viewpoint-reference',
  'view-node-element-reference',
  'view-connection-relationship-reference',
  'view-connection-endpoint-reference',
  'view-connection-endpoint-alignment',
  'view-viewpoint-content-application',
  'view-profile-viewpoint-content-application',
  'viewpoint-stakeholder-concern-structure',
  'viewpoint-modeling-note-structure',
  'organization-identifier-reference',
  'property-definition-structure',
  'property-definition-reference',
  'profile-attribute-properties',
  'profile-attribute-values'
];

export function normalizeArchimateVersion(version) {
  if (version === undefined || version === null || version === '') {
    return DEFAULT_ARCHIMATE_VERSION;
  }

  const normalized = String(version);

  if (!PROFILES.has(normalized)) {
    throw new Error('Unsupported ArchiMate version: ' + normalized);
  }

  return PROFILES.get(normalized).version;
}

export function getLanguageProfile(version) {
  const normalized = normalizeArchimateVersion(version);

  return PROFILES.get(normalized);
}

export function getArchimate4ExampleViewpointCatalog() {
  var profile = getLanguageProfile('4.0');
  var conformance = profile.conformance || {};
  var catalog = conformance.appendixCExampleViewpointsCoverageCatalog || {};
  var outlineItems = conformance.appendixCExampleViewpointsCoverage || [];
  var groups = [];
  var currentGroup = null;

  outlineItems.forEach(function(item) {
    var entry = {
      id: item.id,
      c260Section: item.c260Section,
      heading: item.heading,
      status: item.status
    };

    if (/^C\.\d+$/.test(item.c260Section)) {
      currentGroup = Object.assign({}, entry, {
        viewpoints: []
      });
      groups.push(currentGroup);
      return;
    }

    if (/^C\.\d+\.\d+$/.test(item.c260Section) && currentGroup) {
      currentGroup.viewpoints.push(entry);
    }
  });

  var viewpoints = groups.reduce(function(items, group) {
    return items.concat(group.viewpoints);
  }, []);
  var expectedOutlineCount = catalog.expectedCount || outlineItems.length;
  var complete = catalog.status === 'c260-outline-derived' &&
    outlineItems.length === expectedOutlineCount &&
    groups.length === ARCHIMATE4_EXAMPLE_VIEWPOINT_GROUP_COUNT &&
    viewpoints.length === ARCHIMATE4_EXAMPLE_VIEWPOINT_COUNT;

  return {
    status: 'informative-reference-catalog',
    sourceCoverageStatus: catalog.status,
    sourceRunlogPath: catalog.sourceRunlogPath,
    expectedOutlineCount: expectedOutlineCount,
    totalOutlineCount: outlineItems.length,
    expectedGroupCount: ARCHIMATE4_EXAMPLE_VIEWPOINT_GROUP_COUNT,
    groupCount: groups.length,
    expectedViewpointCount: ARCHIMATE4_EXAMPLE_VIEWPOINT_COUNT,
    viewpointCount: viewpoints.length,
    groups: groups,
    viewpoints: viewpoints,
    bundledViewpointDefinitions: false,
    officialConformanceBlocker: false,
    normativeRelationshipConstraints: false,
    complete: complete
  };
}

export function createLanguageProfile(version, customization) {
  var profile = cloneProfile(getLanguageProfile(version));
  var customProfile = parseLanguageProfileCustomization(customization);

  if (!customProfile) {
    return profile;
  }

  if (customProfile.version && normalizeArchimateVersion(customProfile.version) !== profile.version) {
    throw new Error('Custom ArchiMate language profile version does not match ' + profile.version);
  }

  mergeNamedItems(profile, customProfile, 'domains', 'name');
  mergeConcepts(profile, customProfile, 'elements');
  mergeConcepts(profile, customProfile, 'connectors');
  mergeRelationshipNames(profile, customProfile);
  mergeAttributes(profile, customProfile);
  mergeViewpoints(profile, customProfile);

  profile.customized = true;

  return profile;
}

export function getBaseConceptTypeForProfile(elementType, profile) {
  var currentType = elementType;
  var visited = new Set();

  while (currentType && !visited.has(currentType)) {
    visited.add(currentType);

    var concept = getProfileConcept(currentType, profile);

    if (!concept || !concept.specializes) {
      return currentType;
    }

    currentType = concept.specializes;
  }

  return elementType;
}

export function getBaseRelationshipTypeForProfile(relationshipType, profile) {
  var currentType = relationshipType;
  var visited = new Set();

  while (currentType && !visited.has(currentType)) {
    visited.add(currentType);

    var relationship = getProfileRelationship(currentType, profile);

    if (!relationship || !relationship.specializes) {
      return currentType;
    }

    currentType = relationship.specializes;
  }

  return relationshipType;
}

export function getProfileConcept(elementType, profile) {
  var concepts = (profile && profile.elements || []).concat(profile && profile.connectors || []);

  for (const concept of concepts) {
    if (concept.type === elementType) {
      return concept;
    }
  }

  return null;
}

export function getProfileRelationship(relationshipType, profile) {
  var relationships = profile && profile.relationships || [];

  for (const relationship of relationships) {
    var normalizedRelationship = normalizeRelationshipDefinition(relationship);

    if (normalizedRelationship.type === relationshipType) {
      return normalizedRelationship;
    }
  }

  return null;
}

export function getSpecializedRelationshipTypesForProfile(baseRelationshipType, profile) {
  var relationships = profile && profile.relationships || [];
  var specializedTypes = [];

  relationships.forEach(function(relationship) {
    var relationshipDefinition = normalizeRelationshipDefinition(relationship);

    if (relationshipDefinition.type === baseRelationshipType) {
      return;
    }

    if (getBaseRelationshipTypeForProfile(relationshipDefinition.type, profile) === baseRelationshipType) {
      specializedTypes.push(relationshipDefinition.type);
    }
  });

  return specializedTypes;
}

export function getProfileAttributesForConcept(conceptType, profile) {
  var attributes = profile && profile.attributes || [];
  var lineage = getProfileTypeLineage(conceptType, profile);

  return attributes.filter(function(attribute) {
    return lineage.indexOf(attribute.concept) !== -1;
  });
}

export function hasProfileConcept(elementType, profile) {
  return Boolean(getProfileConcept(elementType, profile));
}

export function hasProfileRelationship(relationshipType, profile) {
  if (!profile || !profile.relationships) {
    return true;
  }

  return Boolean(getProfileRelationship(relationshipType, profile));
}

export function getRelationshipMapForProfile(elementType, profile) {
  var relationshipType = getBaseConceptTypeForProfile(elementType, profile);

  if (profile && profile.version === '4.0') {
    return getArchimate4RelationshipMap(relationshipType);
  }

  return getArchimate3RelationshipMap(relationshipType);
}

export function getArchimate4ImplementationStatus() {
  var profile = getLanguageProfile('4.0');
  var conformance = cloneProfile(profile.conformance || {});
  var conformanceRequirements = summarizeConformanceRequirements(
    conformance.requirements || [],
    conformance.requirementCatalog || {}
  );
  var sourceCoverage = summarizeSourceCoverage(
    conformance.sourceCoverage || {},
    conformance.sourceCoverageCatalog || {}
  );
  var externalBlockerCatalog = summarizeExternalBlockers(
    conformance.externalBlockerCatalog || {},
    conformance.readiness || {},
    sourceCoverage,
    conformanceRequirements
  );
  var remainingGaps = summarizeRemainingGaps(
    conformance.gapCatalog || {},
    conformance.gaps || [],
    sourceCoverage,
    externalBlockerCatalog
  );
  var sectionCoverage = summarizeSectionCoverage(
    conformance.sectionCoverageCatalog || {},
    conformance.sectionCoverage || [],
    conformanceRequirements,
    externalBlockerCatalog,
    ARCHIMATE4_IMPLEMENTATION_STATUS_KEY_IDS
  );
  var introductionCoverage = summarizeIntroductionCoverage(
    conformance.introductionCoverageCatalog || {},
    conformance.introductionCoverage || []
  );
  var definitionCoverage = summarizeDefinitionCoverage(
    conformance.definitionCoverageCatalog || {},
    conformance.definitionCoverage || []
  );
  var languageStructureCoverage = summarizeLanguageStructureCoverage(
    conformance.languageStructureCoverageCatalog || {},
    conformance.languageStructureCoverage || []
  );
  var commonDomainCoverage = summarizeCommonDomainCoverage(
    conformance.commonDomainCoverageCatalog || {},
    conformance.commonDomainCoverage || []
  );
  var relationshipsAndJunctionsCoverage = summarizeRelationshipsAndJunctionsCoverage(
    conformance.relationshipsAndJunctionsCoverageCatalog || {},
    conformance.relationshipsAndJunctionsCoverage || []
  );
  var motivationDomainCoverage = summarizeMotivationDomainCoverage(
    conformance.motivationDomainCoverageCatalog || {},
    conformance.motivationDomainCoverage || []
  );
  var strategyDomainCoverage = summarizeStrategyDomainCoverage(
    conformance.strategyDomainCoverageCatalog || {},
    conformance.strategyDomainCoverage || []
  );
  var businessDomainCoverage = summarizeBusinessDomainCoverage(
    conformance.businessDomainCoverageCatalog || {},
    conformance.businessDomainCoverage || []
  );
  var applicationDomainCoverage = summarizeApplicationDomainCoverage(
    conformance.applicationDomainCoverageCatalog || {},
    conformance.applicationDomainCoverage || []
  );
  var technologyDomainCoverage = summarizeTechnologyDomainCoverage(
    conformance.technologyDomainCoverageCatalog || {},
    conformance.technologyDomainCoverage || []
  );
  var relationshipsBetweenCoreDomainsCoverage = summarizeRelationshipsBetweenCoreDomainsCoverage(
    conformance.relationshipsBetweenCoreDomainsCoverageCatalog || {},
    conformance.relationshipsBetweenCoreDomainsCoverage || []
  );
  var implementationAndMigrationDomainCoverage = summarizeImplementationAndMigrationDomainCoverage(
    conformance.implementationAndMigrationDomainCoverageCatalog || {},
    conformance.implementationAndMigrationDomainCoverage || []
  );
  var stakeholdersArchitectureViewsViewpointsCoverage = summarizeStakeholdersArchitectureViewsViewpointsCoverage(
    conformance.stakeholdersArchitectureViewsViewpointsCoverageCatalog || {},
    conformance.stakeholdersArchitectureViewsViewpointsCoverage || []
  );
  var languageCustomizationMechanismsCoverage = summarizeLanguageCustomizationMechanismsCoverage(
    conformance.languageCustomizationMechanismsCoverageCatalog || {},
    conformance.languageCustomizationMechanismsCoverage || []
  );
  var appendixANotationCoverage = summarizeAppendixANotationCoverage(
    conformance.appendixANotationCoverageCatalog || {},
    conformance.appendixANotationCoverage || []
  );
  var appendixBRelationshipsCoverage = summarizeAppendixBRelationshipsCoverage(
    conformance.appendixBRelationshipsCoverageCatalog || {},
    conformance.appendixBRelationshipsCoverage || []
  );
  var appendixCExampleViewpointsCoverage = summarizeAppendixCExampleViewpointsCoverage(
    conformance.appendixCExampleViewpointsCoverageCatalog || {},
    conformance.appendixCExampleViewpointsCoverage || []
  );
  var appendixDStandardsGuidanceCoverage = summarizeAppendixDStandardsGuidanceCoverage(
    conformance.appendixDStandardsGuidanceCoverageCatalog || {},
    conformance.appendixDStandardsGuidanceCoverage || []
  );
  var appendixEVersionChangesCoverage = summarizeAppendixEVersionChangesCoverage(
    conformance.appendixEVersionChangesCoverageCatalog || {},
    conformance.appendixEVersionChangesCoverage || []
  );
  var appendixFAcronymsCoverage = summarizeAppendixFAcronymsCoverage(
    conformance.appendixFAcronymsCoverageCatalog || {},
    conformance.appendixFAcronymsCoverage || []
  );
  var documentArtifactCoverage = summarizeDocumentArtifactCoverage(
    conformance.documentArtifactCoverageCatalog || {},
    conformance.documentArtifactCoverage || []
  );
  var c260CoverageEntries = [
    { id: 'sectionCoverage', summary: sectionCoverage },
    { id: 'introductionCoverage', summary: introductionCoverage },
    { id: 'definitionCoverage', summary: definitionCoverage },
    { id: 'languageStructureCoverage', summary: languageStructureCoverage },
    { id: 'commonDomainCoverage', summary: commonDomainCoverage },
    { id: 'relationshipsAndJunctionsCoverage', summary: relationshipsAndJunctionsCoverage },
    { id: 'motivationDomainCoverage', summary: motivationDomainCoverage },
    { id: 'strategyDomainCoverage', summary: strategyDomainCoverage },
    { id: 'businessDomainCoverage', summary: businessDomainCoverage },
    { id: 'applicationDomainCoverage', summary: applicationDomainCoverage },
    { id: 'technologyDomainCoverage', summary: technologyDomainCoverage },
    { id: 'relationshipsBetweenCoreDomainsCoverage', summary: relationshipsBetweenCoreDomainsCoverage },
    { id: 'implementationAndMigrationDomainCoverage', summary: implementationAndMigrationDomainCoverage },
    { id: 'stakeholdersArchitectureViewsViewpointsCoverage', summary: stakeholdersArchitectureViewsViewpointsCoverage },
    { id: 'languageCustomizationMechanismsCoverage', summary: languageCustomizationMechanismsCoverage },
    { id: 'appendixANotationCoverage', summary: appendixANotationCoverage },
    { id: 'appendixBRelationshipsCoverage', summary: appendixBRelationshipsCoverage },
    { id: 'appendixCExampleViewpointsCoverage', summary: appendixCExampleViewpointsCoverage },
    { id: 'appendixDStandardsGuidanceCoverage', summary: appendixDStandardsGuidanceCoverage },
    { id: 'appendixEVersionChangesCoverage', summary: appendixEVersionChangesCoverage },
    { id: 'appendixFAcronymsCoverage', summary: appendixFAcronymsCoverage },
    { id: 'documentArtifactCoverage', summary: documentArtifactCoverage }
  ];
  var c260CoverageAggregate = summarizeC260CoverageAggregate(c260CoverageEntries);
  var c260SourceAlignment = summarizeC260SourceAlignment(
    conformance.c260SourceAlignmentCatalog || {},
    c260CoverageAggregate,
    c260CoverageEntries
  );
  var c260CoverageSourceEvidence = summarizeC260CoverageSourceEvidence(
    conformance.c260CoverageSourceEvidenceCatalog || {},
    c260CoverageEntries
  );
  var profileAttributeTypes = summarizeProfileAttributeTypes(
    conformance.profileAttributeTypeCatalog || {},
    PROFILE_ATTRIBUTE_TYPES
  );
  var viewpointClassification = summarizeViewpointClassification(
    conformance.viewpointClassificationCatalog || {},
    VIEWPOINT_PURPOSES,
    VIEWPOINT_CONTENT_TYPES
  );
  var viewpointMechanism = summarizeViewpointMechanism(
    conformance.viewpointMechanismCatalog || {},
    archimate4Descriptor
  );
  var stakeholderConcerns = summarizeStakeholderConcerns(
    conformance.stakeholderConcernCatalog || {},
    archimate4Descriptor
  );

  var status = {
    version: profile.version,
    standard: conformance.standard,
    experimental: !!profile.experimental,
    namespace: profile.namespace,
    schemaLocation: profile.schemaLocation || '',
    elementCatalog: summarizeElementCatalog(conformance.elementCatalog || {}, profile),
    relationshipConnectors: summarizeRelationshipConnectorCatalog(
      conformance.relationshipConnectors || {},
      profile
    ),
    relationshipMatrix: conformance.relationshipMatrix,
    relationshipProfile: getArchimate4RelationshipProfileStatus(),
    modelValidation: summarizeModelValidation(
      conformance.modelValidation || {},
      ARCHIMATE4_MODEL_VALIDATION_CHECK_IDS
    ),
    exchangeFormat: conformance.exchangeFormat,
    iconography: conformance.iconography,
    profileAttributeTypes: profileAttributeTypes,
    viewpointClassification: viewpointClassification,
    viewpointMechanism: viewpointMechanism,
    stakeholderConcerns: stakeholderConcerns,
    conformanceRequirements: conformanceRequirements,
    sourceCoverage: sourceCoverage,
    conformanceReadiness: summarizeConformanceReadiness(
      conformance.readiness || {},
      conformanceRequirements,
      sourceCoverage,
      externalBlockerCatalog.actualIds
    ),
    remainingGaps: remainingGaps,
    sectionCoverage: sectionCoverage,
    introductionCoverage: introductionCoverage,
    definitionCoverage: definitionCoverage,
    languageStructureCoverage: languageStructureCoverage,
    commonDomainCoverage: commonDomainCoverage,
    relationshipsAndJunctionsCoverage: relationshipsAndJunctionsCoverage,
    motivationDomainCoverage: motivationDomainCoverage,
    strategyDomainCoverage: strategyDomainCoverage,
    businessDomainCoverage: businessDomainCoverage,
    applicationDomainCoverage: applicationDomainCoverage,
    technologyDomainCoverage: technologyDomainCoverage,
    relationshipsBetweenCoreDomainsCoverage: relationshipsBetweenCoreDomainsCoverage,
    implementationAndMigrationDomainCoverage: implementationAndMigrationDomainCoverage,
    stakeholdersArchitectureViewsViewpointsCoverage: stakeholdersArchitectureViewsViewpointsCoverage,
    languageCustomizationMechanismsCoverage: languageCustomizationMechanismsCoverage,
    appendixANotationCoverage: appendixANotationCoverage,
    appendixBRelationshipsCoverage: appendixBRelationshipsCoverage,
    appendixCExampleViewpointsCoverage: appendixCExampleViewpointsCoverage,
    exampleViewpointCatalog: getArchimate4ExampleViewpointCatalog(),
    appendixDStandardsGuidanceCoverage: appendixDStandardsGuidanceCoverage,
    appendixEVersionChangesCoverage: appendixEVersionChangesCoverage,
    appendixFAcronymsCoverage: appendixFAcronymsCoverage,
    documentArtifactCoverage: documentArtifactCoverage,
    c260CoverageAggregate: c260CoverageAggregate,
    c260SourceAlignment: c260SourceAlignment,
    c260CoverageSourceEvidence: c260CoverageSourceEvidence,
    externalBlockerCatalog: externalBlockerCatalog,
    externalBlockers: externalBlockerCatalog.actualIds
  };

  status.implementationCompletion = summarizeImplementationCompletionStatus(status, {
    status: 'current-status-summary-derived',
    sourceRunlogPath: ARCHIMATE4_IMPLEMENTATION_COMPLETION_RUNLOG_PATH
  });

  return status;
}

function summarizeModelValidation(modelValidationCatalog, implementedCheckIds) {
  var expectedCheckIds = modelValidationCatalog.expectedCheckIds || implementedCheckIds;
  var expectedCheckIdSet = new Set(expectedCheckIds);
  var implementedCheckIdSet = new Set(implementedCheckIds);
  var missingCheckIds = expectedCheckIds.filter(function(checkId) {
    return !implementedCheckIdSet.has(checkId);
  });
  var extraCheckIds = implementedCheckIds.filter(function(checkId) {
    return !expectedCheckIdSet.has(checkId);
  });

  return Object.assign({}, modelValidationCatalog, {
    expectedCheckIds: expectedCheckIds,
    actualCheckIds: implementedCheckIds,
    missingCheckIds: missingCheckIds,
    extraCheckIds: extraCheckIds,
    complete: modelValidationCatalog.status === 'implemented' &&
      missingCheckIds.length === 0 &&
      extraCheckIds.length === 0
  });
}

function summarizeImplementationCompletionStatus(status, completionCatalog) {
  var completeSummaries = collectStatusCompleteSummaries(status);
  var incompleteSummaries = collectStatusIncompleteSummaries(status);
  var topKeys = Object.keys(status).concat('implementationCompletion');
  var incompleteSummaryPaths = incompleteSummaries.map(function(summary) {
    return summary.path;
  });

  return Object.assign({}, completionCatalog, {
    topKeys: topKeys,
    topKeyCount: topKeys.length,
    auditedCompleteSummaryCount: completeSummaries.length,
    completeSummaryCount: completeSummaries.length + 1,
    incompleteSummaryCount: incompleteSummaries.length,
    incompleteSummaryPaths: incompleteSummaryPaths,
    incompleteSummaries: incompleteSummaries,
    complete: incompleteSummaries.length === 0
  });
}

function collectStatusCompleteSummaries(value, path) {
  path = path || [];

  if (!value || typeof value !== 'object') {
    return [];
  }

  var summaries = [];

  if (Object.prototype.hasOwnProperty.call(value, 'complete')) {
    summaries.push({
      path: path.join('.'),
      complete: value.complete,
      status: value.status
    });
  }

  Object.entries(value).forEach(function(entry) {
    var key = entry[0];
    var child = entry[1];

    summaries.push.apply(summaries, collectStatusCompleteSummaries(child, path.concat(key)));
  });

  return summaries;
}

function collectStatusIncompleteSummaries(value, path) {
  path = path || [];

  if (!value || typeof value !== 'object') {
    return [];
  }

  var incomplete = [];

  if (Object.prototype.hasOwnProperty.call(value, 'complete') && value.complete !== true) {
    incomplete.push({
      path: path.join('.'),
      complete: value.complete,
      status: value.status
    });
  }

  Object.entries(value).forEach(function(entry) {
    var key = entry[0];
    var child = entry[1];

    incomplete.push.apply(incomplete, collectStatusIncompleteSummaries(child, path.concat(key)));
  });

  return incomplete;
}

function summarizeViewpointClassification(classificationCatalog, purposeNames, contentNames) {
  var expectedPurposeNames = classificationCatalog.expectedPurposeNames || [];
  var expectedContentNames = classificationCatalog.expectedContentNames || [];
  var expectedPurposeSet = new Set(expectedPurposeNames);
  var expectedContentSet = new Set(expectedContentNames);
  var purposeNameSet = new Set(purposeNames);
  var contentNameSet = new Set(contentNames);
  var actualPurposeNames = expectedPurposeNames.filter(function(purposeName) {
    return purposeNameSet.has(purposeName);
  });
  var actualContentNames = expectedContentNames.filter(function(contentName) {
    return contentNameSet.has(contentName);
  });
  var missingPurposeNames = expectedPurposeNames.filter(function(purposeName) {
    return !purposeNameSet.has(purposeName);
  });
  var missingContentNames = expectedContentNames.filter(function(contentName) {
    return !contentNameSet.has(contentName);
  });
  var unexpectedPurposeNames = purposeNames.filter(function(purposeName) {
    return !expectedPurposeSet.has(purposeName);
  });
  var unexpectedContentNames = contentNames.filter(function(contentName) {
    return !expectedContentSet.has(contentName);
  });

  return Object.assign({}, classificationCatalog, {
    purposeNames: purposeNames.slice(),
    contentNames: contentNames.slice(),
    expectedPurposeNames: expectedPurposeNames,
    actualPurposeNames: actualPurposeNames,
    missingPurposeNames: missingPurposeNames,
    unexpectedPurposeNames: unexpectedPurposeNames,
    expectedContentNames: expectedContentNames,
    actualContentNames: actualContentNames,
    missingContentNames: missingContentNames,
    unexpectedContentNames: unexpectedContentNames,
    complete: missingPurposeNames.length === 0 &&
      missingContentNames.length === 0 &&
      unexpectedPurposeNames.length === 0 &&
      unexpectedContentNames.length === 0
  });
}

function summarizeViewpointMechanism(mechanismCatalog, descriptor) {
  var expectedFeatureIds = mechanismCatalog.expectedFeatureIds || [];
  var actualFeatureIds = getViewpointMechanismFeatureIds(descriptor);
  var actualFeatureSet = new Set(actualFeatureIds);
  var expectedFeatureSet = new Set(expectedFeatureIds);
  var missingFeatureIds = expectedFeatureIds.filter(function(featureId) {
    return !actualFeatureSet.has(featureId);
  });
  var extraFeatureIds = actualFeatureIds.filter(function(featureId) {
    return !expectedFeatureSet.has(featureId);
  });

  return Object.assign({}, mechanismCatalog, {
    expectedFeatureIds: expectedFeatureIds,
    actualFeatureIds: actualFeatureIds,
    missingFeatureIds: missingFeatureIds,
    extraFeatureIds: extraFeatureIds,
    complete: missingFeatureIds.length === 0 && extraFeatureIds.length === 0
  });
}

function summarizeStakeholderConcerns(concernCatalog, descriptor) {
  var expectedFeatureIds = concernCatalog.expectedFeatureIds || [];
  var actualFeatureIds = getStakeholderConcernFeatureIds(descriptor);
  var actualFeatureSet = new Set(actualFeatureIds);
  var expectedFeatureSet = new Set(expectedFeatureIds);
  var missingFeatureIds = expectedFeatureIds.filter(function(featureId) {
    return !actualFeatureSet.has(featureId);
  });
  var extraFeatureIds = actualFeatureIds.filter(function(featureId) {
    return !expectedFeatureSet.has(featureId);
  });

  return Object.assign({}, concernCatalog, {
    expectedFeatureIds: expectedFeatureIds,
    actualFeatureIds: actualFeatureIds,
    missingFeatureIds: missingFeatureIds,
    extraFeatureIds: extraFeatureIds,
    complete: missingFeatureIds.length === 0 && extraFeatureIds.length === 0
  });
}

function getViewpointMechanismFeatureIds(descriptor) {
  var featureIds = [];
  var add = function(featureId) {
    if (featureIds.indexOf(featureId) === -1) {
      featureIds.push(featureId);
    }
  };

  if (hasDescriptorProperty(descriptor, 'Views', 'viewpointsNode', { type: 'Viewpoints' })) {
    add('views-viewpoints-container');
  }

  if (hasDescriptorProperty(descriptor, 'View', 'viewpoint', { type: 'String', isAttr: true })) {
    add('view-viewpoint-attribute');
  }

  if (hasDescriptorProperty(descriptor, 'View', 'viewpointRef', {
    type: 'Viewpoint',
    isReference: true,
    isAttr: true
  })) {
    add('view-viewpoint-reference');
  }

  if (hasDescriptorProperty(descriptor, 'Viewpoint', 'concerns', {
    type: 'Concern',
    isMany: true
  })) {
    add('viewpoint-concern-list');
  }

  if (hasDescriptorProperty(descriptor, 'Concern', 'stakeholdersNode', { type: 'Stakeholders' }) &&
      hasDescriptorProperty(descriptor, 'Stakeholders', 'stakeholders', {
        type: 'Stakeholder',
        isMany: true
      })) {
    add('viewpoint-stakeholder-list');
  }

  if (hasDescriptorProperty(descriptor, 'Viewpoint', 'viewpointPurpose', { type: 'String' })) {
    add('viewpoint-purpose');
  }

  if (hasDescriptorProperty(descriptor, 'Viewpoint', 'viewpointContent', { type: 'String' })) {
    add('viewpoint-content');
  }

  if (hasDescriptorProperty(descriptor, 'Viewpoint', 'allowedElementTypes', {
    type: 'AllowedElementType',
    isMany: true
  })) {
    add('viewpoint-allowed-element-types');
  }

  if (hasDescriptorProperty(descriptor, 'Viewpoint', 'allowedRelationshipTypes', {
    type: 'AllowedRelationshipType',
    isMany: true
  })) {
    add('viewpoint-allowed-relationship-types');
  }

  if (hasDescriptorProperty(descriptor, 'Viewpoint', 'modelingNotes', {
    type: 'ModelingNote',
    isMany: true
  })) {
    add('viewpoint-modeling-notes');
  }

  return featureIds;
}

function getStakeholderConcernFeatureIds(descriptor) {
  var featureIds = [];
  var add = function(featureId) {
    if (featureIds.indexOf(featureId) === -1) {
      featureIds.push(featureId);
    }
  };

  if (hasDescriptorProperty(descriptor, 'Viewpoint', 'concerns', {
    type: 'Concern',
    isMany: true
  })) {
    add('viewpoint-concern-list');
  }

  if (hasDescriptorProperty(descriptor, 'Concern', 'label', { type: 'String' })) {
    add('concern-label');
  }

  if (hasDescriptorProperty(descriptor, 'Concern', 'documentation', { type: 'String' })) {
    add('concern-documentation');
  }

  if (hasDescriptorProperty(descriptor, 'Concern', 'stakeholdersNode', { type: 'Stakeholders' })) {
    add('concern-stakeholders-container');
  }

  if (hasDescriptorProperty(descriptor, 'Stakeholders', 'stakeholders', {
    type: 'Stakeholder',
    isMany: true
  })) {
    add('stakeholders-stakeholder-list');
  }

  if (hasDescriptorProperty(descriptor, 'Stakeholder', 'label', { type: 'String' })) {
    add('stakeholder-label');
  }

  return featureIds;
}

function hasDescriptorProperty(descriptor, typeName, propertyName, expected) {
  var property = getDescriptorProperty(descriptor, typeName, propertyName);

  if (!property) {
    return false;
  }

  return Object.keys(expected || {}).every(function(key) {
    return property[key] === expected[key];
  });
}

function getDescriptorProperty(descriptor, typeName, propertyName) {
  var descriptorType = (descriptor.types || []).find(function(type) {
    return type.name === typeName;
  });

  if (!descriptorType) {
    return null;
  }

  return (descriptorType.properties || []).find(function(property) {
    return property.name === propertyName;
  }) || null;
}

function summarizeProfileAttributeTypes(typeCatalog, supportedTypeNames) {
  var expectedC260TypeNames = typeCatalog.expectedC260TypeNames || [];
  var implementationAdditionalTypeNames = typeCatalog.implementationAdditionalTypeNames || [];
  var supportedTypeSet = new Set(supportedTypeNames);
  var expectedTypeSet = new Set(expectedC260TypeNames);
  var declaredAdditionalTypeSet = new Set(implementationAdditionalTypeNames);
  var actualC260TypeNames = expectedC260TypeNames.filter(function(typeName) {
    return supportedTypeSet.has(typeName);
  });
  var missingC260TypeNames = expectedC260TypeNames.filter(function(typeName) {
    return !supportedTypeSet.has(typeName);
  });
  var actualAdditionalTypeNames = implementationAdditionalTypeNames.filter(function(typeName) {
    return supportedTypeSet.has(typeName);
  });
  var missingAdditionalTypeNames = implementationAdditionalTypeNames.filter(function(typeName) {
    return !supportedTypeSet.has(typeName);
  });
  var unexpectedAdditionalTypeNames = supportedTypeNames.filter(function(typeName) {
    return !expectedTypeSet.has(typeName) && !declaredAdditionalTypeSet.has(typeName);
  });

  return Object.assign({}, typeCatalog, {
    supportedTypeNames: supportedTypeNames.slice(),
    expectedC260TypeNames: expectedC260TypeNames,
    actualC260TypeNames: actualC260TypeNames,
    missingC260TypeNames: missingC260TypeNames,
    implementationAdditionalTypeNames: implementationAdditionalTypeNames,
    actualAdditionalTypeNames: actualAdditionalTypeNames,
    missingAdditionalTypeNames: missingAdditionalTypeNames,
    unexpectedAdditionalTypeNames: unexpectedAdditionalTypeNames,
    complete: missingC260TypeNames.length === 0 &&
      missingAdditionalTypeNames.length === 0 &&
      unexpectedAdditionalTypeNames.length === 0
  });
}

function summarizeElementCatalog(elementCatalog, profile) {
  return summarizeTypeCatalog(elementCatalog, profile.elements || []);
}

function summarizeRelationshipConnectorCatalog(relationshipConnectors, profile) {
  var summary = summarizeTypeCatalog(relationshipConnectors, profile.connectors || []);

  return Object.assign({}, summary, {
    types: summary.actualTypes
  });
}

function summarizeTypeCatalog(typeCatalog, concepts) {
  var expectedTypes = typeCatalog.expectedTypes || [];
  var actualTypes = concepts.map(function(concept) {
    return concept.type;
  });
  var actualTypeSet = new Set(actualTypes);
  var expectedTypeSet = new Set(expectedTypes);
  var missingTypes = expectedTypes.filter(function(type) {
    return !actualTypeSet.has(type);
  });
  var extraTypes = expectedTypes.length ? actualTypes.filter(function(type) {
    return !expectedTypeSet.has(type);
  }) : [];
  var expectedCount = typeCatalog.expectedCount || expectedTypes.length;

  return Object.assign({}, typeCatalog, {
    actualCount: actualTypes.length,
    actualTypes: actualTypes,
    missingTypes: missingTypes,
    extraTypes: extraTypes,
    complete: actualTypes.length === expectedCount && missingTypes.length === 0 && extraTypes.length === 0
  });
}

function summarizeSourceCoverage(sourceCoverage, sourceCoverageCatalog) {
  var items = cloneProfile(sourceCoverage || {});
  var sourceKeys = Object.keys(items);
  var expectedSourceIds = sourceCoverageCatalog.expectedSourceIds || [];
  var expectedSourceIdSet = new Set(expectedSourceIds);
  var actualSourceIdSet = new Set(sourceKeys);
  var missingSourceIds = expectedSourceIds.filter(function(id) {
    return !actualSourceIdSet.has(id);
  });
  var extraSourceIds = expectedSourceIds.length ? sourceKeys.filter(function(id) {
    return !expectedSourceIdSet.has(id);
  }) : [];
  var expectedCount = sourceCoverageCatalog.expectedCount || expectedSourceIds.length;

  return Object.assign({}, sourceCoverageCatalog, {
    items: items,
    expectedSourceIds: expectedSourceIds,
    actualSourceIds: sourceKeys,
    missingSourceIds: missingSourceIds,
    extraSourceIds: extraSourceIds,
    total: sourceKeys.length,
    expectedCount: expectedCount,
    complete: sourceKeys.length === expectedCount && missingSourceIds.length === 0 && extraSourceIds.length === 0,
    localSourceCount: sourceKeys.filter(function(key) {
      return items[key].localSourcePresent === true;
    }).length,
    externalSourceCount: sourceKeys.filter(function(key) {
      return items[key].localSourcePresent === false;
    }).length,
    missingRequiredSources: sourceKeys.filter(function(key) {
      return items[key].required && items[key].localSourcePresent === false;
    }),
    missingCompanionSources: sourceKeys.filter(function(key) {
      return items[key].companion && items[key].localSourcePresent === false;
    })
  });
}

function summarizeExternalBlockers(externalBlockerCatalog, readiness, sourceCoverage, conformanceRequirements) {
  var expectedIds = externalBlockerCatalog.expectedIds || [];
  var readinessIds = readiness.blockers || [];
  var requirementIds = (conformanceRequirements.items || []).map(function(requirement) {
    return requirement.externalBlocker;
  }).filter(Boolean);
  var sourceCoverageIds = Object.keys(sourceCoverage.items || {}).map(function(key) {
    return sourceCoverage.items[key].externalBlocker;
  }).filter(Boolean);
  var actualRawIds = [];

  readinessIds.forEach(function(id) {
    appendUnique(actualRawIds, id);
  });
  requirementIds.forEach(function(id) {
    appendUnique(actualRawIds, id);
  });
  sourceCoverageIds.forEach(function(id) {
    appendUnique(actualRawIds, id);
  });

  var actualRawIdSet = new Set(actualRawIds);
  var expectedIdSet = new Set(expectedIds);
  var actualIds = expectedIds.filter(function(id) {
    return actualRawIdSet.has(id);
  });

  actualRawIds.forEach(function(id) {
    if (!expectedIdSet.has(id)) {
      actualIds.push(id);
    }
  });

  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  });
  var expectedCount = externalBlockerCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, externalBlockerCatalog, {
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    readinessIds: readinessIds,
    requirementIds: requirementIds,
    sourceCoverageIds: sourceCoverageIds,
    expectedCount: expectedCount,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function appendUnique(items, item) {
  if (items.indexOf(item) === -1) {
    items.push(item);
  }
}

function summarizeRemainingGaps(gapCatalog, gaps, sourceCoverage, externalBlockerCatalog) {
  var expectedIds = gapCatalog.expectedIds || [];
  var actualIds = gaps.map(function(gap) {
    return gap.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedOfficialConformanceGapIds = externalBlockerCatalog.expectedIds || [];
  var officialConformanceGapIds = gaps.filter(function(gap) {
    return gap.officialConformanceBlocker === true;
  }).map(function(gap) {
    return gap.id;
  });
  var officialConformanceGapIdSet = new Set(officialConformanceGapIds);
  var expectedOfficialConformanceGapIdSet = new Set(expectedOfficialConformanceGapIds);
  var missingOfficialConformanceGapIds = expectedOfficialConformanceGapIds.filter(function(id) {
    return !officialConformanceGapIdSet.has(id);
  });
  var extraOfficialConformanceGapIds = officialConformanceGapIds.filter(function(id) {
    return !expectedOfficialConformanceGapIdSet.has(id);
  });
  var missingCompanionSources = sourceCoverage.missingCompanionSources || [];
  var companionGapSourceIds = gaps.filter(function(gap) {
    return gap.companion === true;
  }).map(function(gap) {
    return gap.sourceId;
  }).filter(Boolean);
  var companionGapSourceIdSet = new Set(companionGapSourceIds);
  var missingCompanionSourceSet = new Set(missingCompanionSources);
  var missingCompanionGapSourceIds = missingCompanionSources.filter(function(id) {
    return !companionGapSourceIdSet.has(id);
  });
  var extraCompanionGapSourceIds = companionGapSourceIds.filter(function(id) {
    return !missingCompanionSourceSet.has(id);
  });
  var expectedCount = gapCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, gapCatalog, {
    items: gaps,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    expectedCount: expectedCount,
    unresolvedIds: actualIds,
    officialConformanceGapIds: officialConformanceGapIds,
    missingOfficialConformanceGapIds: missingOfficialConformanceGapIds,
    extraOfficialConformanceGapIds: extraOfficialConformanceGapIds,
    companionGapSourceIds: companionGapSourceIds,
    missingCompanionGapSourceIds: missingCompanionGapSourceIds,
    extraCompanionGapSourceIds: extraCompanionGapSourceIds,
    complete: actualIds.length === expectedCount &&
      missingIds.length === 0 &&
      extraIds.length === 0 &&
      missingOfficialConformanceGapIds.length === 0 &&
      extraOfficialConformanceGapIds.length === 0 &&
      missingCompanionGapSourceIds.length === 0 &&
      extraCompanionGapSourceIds.length === 0
  });
}

function summarizeSectionCoverage(
    sectionCatalog,
    sections,
    conformanceRequirements,
    externalBlockerCatalog,
    implementationStatusKeyIds) {
  var expectedIds = sectionCatalog.expectedIds || [];
  var actualIds = sections.map(function(section) {
    return section.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = sectionCatalog.expectedCount || expectedIds.length;
  var expectedRequirementIds = sectionCatalog.expectedRequirementIds || [];
  var expectedExternalBlockerIds = sectionCatalog.expectedExternalBlockerIds || [];
  var expectedStatusKeyIds = sectionCatalog.expectedStatusKeyIds || [];
  var requirementIds = [];
  var externalBlockerIds = [];
  var statusKeyIds = [];

  sections.forEach(function(section) {
    if (section.requirementId) {
      appendUnique(requirementIds, section.requirementId);
    }

    if (section.externalBlocker) {
      appendUnique(externalBlockerIds, section.externalBlocker);
    }

    (section.statusKeys || []).forEach(function(statusKey) {
      appendUnique(statusKeyIds, statusKey);
    });
  });

  var expectedRequirementIdSet = new Set(expectedRequirementIds);
  var requirementIdSet = new Set(requirementIds);
  var conformanceRequirementIdSet = new Set(conformanceRequirements.actualIds || []);
  var missingRequirementIds = expectedRequirementIds.filter(function(id) {
    return !requirementIdSet.has(id);
  });
  var extraRequirementIds = expectedRequirementIds.length ? requirementIds.filter(function(id) {
    return !expectedRequirementIdSet.has(id);
  }) : [];
  var missingRequirementReferenceIds = requirementIds.filter(function(id) {
    return !conformanceRequirementIdSet.has(id);
  });
  var expectedExternalBlockerIdSet = new Set(expectedExternalBlockerIds);
  var externalBlockerIdSet = new Set(externalBlockerIds);
  var externalBlockerCatalogIdSet = new Set(externalBlockerCatalog.expectedIds || []);
  var missingExternalBlockerIds = expectedExternalBlockerIds.filter(function(id) {
    return !externalBlockerIdSet.has(id);
  });
  var extraExternalBlockerIds = expectedExternalBlockerIds.length ? externalBlockerIds.filter(function(id) {
    return !expectedExternalBlockerIdSet.has(id);
  }) : [];
  var missingExternalBlockerReferenceIds = externalBlockerIds.filter(function(id) {
    return !externalBlockerCatalogIdSet.has(id);
  });
  var expectedStatusKeyIdSet = new Set(expectedStatusKeyIds);
  var statusKeyIdSet = new Set(statusKeyIds);
  var implementationStatusKeyIdSet = new Set(implementationStatusKeyIds || []);
  var missingStatusKeyIds = expectedStatusKeyIds.filter(function(id) {
    return !statusKeyIdSet.has(id);
  });
  var extraStatusKeyIds = expectedStatusKeyIds.length ? statusKeyIds.filter(function(id) {
    return !expectedStatusKeyIdSet.has(id);
  }) : [];
  var missingStatusKeyReferenceIds = statusKeyIds.filter(function(id) {
    return !implementationStatusKeyIdSet.has(id);
  });
  var externalDependentIds = sections.filter(function(section) {
    return Boolean(section.externalBlocker);
  }).map(function(section) {
    return section.id;
  });
  var optionalIds = sections.filter(function(section) {
    return section.optional === true;
  }).map(function(section) {
    return section.id;
  });
  var implementedIds = sections.filter(function(section) {
    return /^implemented/.test(section.status || '') || section.status === 'implementation-defined';
  }).map(function(section) {
    return section.id;
  });

  return Object.assign({}, sectionCatalog, {
    items: sections,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    expectedCount: expectedCount,
    expectedRequirementIds: expectedRequirementIds,
    requirementIds: requirementIds,
    missingRequirementIds: missingRequirementIds,
    extraRequirementIds: extraRequirementIds,
    missingRequirementReferenceIds: missingRequirementReferenceIds,
    expectedExternalBlockerIds: expectedExternalBlockerIds,
    externalBlockerIds: externalBlockerIds,
    missingExternalBlockerIds: missingExternalBlockerIds,
    extraExternalBlockerIds: extraExternalBlockerIds,
    missingExternalBlockerReferenceIds: missingExternalBlockerReferenceIds,
    expectedStatusKeyIds: expectedStatusKeyIds,
    statusKeyIds: statusKeyIds,
    missingStatusKeyIds: missingStatusKeyIds,
    extraStatusKeyIds: extraStatusKeyIds,
    missingStatusKeyReferenceIds: missingStatusKeyReferenceIds,
    externalDependentIds: externalDependentIds,
    optionalIds: optionalIds,
    implementedIds: implementedIds,
    complete: actualIds.length === expectedCount &&
      missingIds.length === 0 &&
      extraIds.length === 0 &&
      missingRequirementIds.length === 0 &&
      extraRequirementIds.length === 0 &&
      missingRequirementReferenceIds.length === 0 &&
      missingExternalBlockerIds.length === 0 &&
      extraExternalBlockerIds.length === 0 &&
      missingExternalBlockerReferenceIds.length === 0 &&
      missingStatusKeyIds.length === 0 &&
      extraStatusKeyIds.length === 0 &&
      missingStatusKeyReferenceIds.length === 0
  });
}

function summarizeIntroductionCoverage(introductionCatalog, introductions) {
  var expectedIds = introductionCatalog.expectedIds || [];
  var actualIds = introductions.map(function(introduction) {
    return introduction.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = introductionCatalog.expectedCount || expectedIds.length;
  var expectedRequirementSourceIds = introductionCatalog.expectedRequirementSourceIds || [];
  var requirementSourceIds = introductions.filter(function(introduction) {
    return introduction.requirementSource === true;
  }).map(function(introduction) {
    return introduction.id;
  });
  var expectedRequirementSourceIdSet = new Set(expectedRequirementSourceIds);
  var requirementSourceIdSet = new Set(requirementSourceIds);
  var missingRequirementSourceIds = expectedRequirementSourceIds.filter(function(id) {
    return !requirementSourceIdSet.has(id);
  });
  var extraRequirementSourceIds = expectedRequirementSourceIds.length ? requirementSourceIds.filter(function(id) {
    return !expectedRequirementSourceIdSet.has(id);
  }) : [];
  var expectedReferenceOnlyIds = introductionCatalog.expectedReferenceOnlyIds || [];
  var referenceOnlyIds = introductions.filter(function(introduction) {
    return introduction.referenceOnly === true;
  }).map(function(introduction) {
    return introduction.id;
  });
  var expectedReferenceOnlyIdSet = new Set(expectedReferenceOnlyIds);
  var referenceOnlyIdSet = new Set(referenceOnlyIds);
  var missingReferenceOnlyIds = expectedReferenceOnlyIds.filter(function(id) {
    return !referenceOnlyIdSet.has(id);
  });
  var extraReferenceOnlyIds = expectedReferenceOnlyIds.length ? referenceOnlyIds.filter(function(id) {
    return !expectedReferenceOnlyIdSet.has(id);
  }) : [];

  return Object.assign({}, introductionCatalog, {
    items: introductions,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingIntroductionIds: missingIds,
    extraIntroductionIds: extraIds,
    expectedRequirementSourceIds: expectedRequirementSourceIds,
    requirementSourceIds: requirementSourceIds,
    missingRequirementSourceIds: missingRequirementSourceIds,
    extraRequirementSourceIds: extraRequirementSourceIds,
    expectedReferenceOnlyIds: expectedReferenceOnlyIds,
    referenceOnlyIds: referenceOnlyIds,
    missingReferenceOnlyIds: missingReferenceOnlyIds,
    extraReferenceOnlyIds: extraReferenceOnlyIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount &&
      missingIds.length === 0 &&
      extraIds.length === 0 &&
      missingRequirementSourceIds.length === 0 &&
      extraRequirementSourceIds.length === 0 &&
      missingReferenceOnlyIds.length === 0 &&
      extraReferenceOnlyIds.length === 0
  });
}

function summarizeDefinitionCoverage(definitionCatalog, definitions) {
  var expectedIds = definitionCatalog.expectedIds || [];
  var actualIds = definitions.map(function(definition) {
    return definition.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = definitionCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, definitionCatalog, {
    items: definitions,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingDefinitionIds: missingIds,
    extraDefinitionIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeLanguageStructureCoverage(languageStructureCatalog, languageStructureCoverage) {
  var expectedIds = languageStructureCatalog.expectedIds || [];
  var actualIds = languageStructureCoverage.map(function(languageStructureItem) {
    return languageStructureItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = languageStructureCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, languageStructureCatalog, {
    items: languageStructureCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingLanguageStructureIds: missingIds,
    extraLanguageStructureIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeCommonDomainCoverage(commonDomainCatalog, commonDomainCoverage) {
  var expectedIds = commonDomainCatalog.expectedIds || [];
  var actualIds = commonDomainCoverage.map(function(commonDomainItem) {
    return commonDomainItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = commonDomainCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, commonDomainCatalog, {
    items: commonDomainCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingCommonDomainIds: missingIds,
    extraCommonDomainIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeRelationshipsAndJunctionsCoverage(relationshipsAndJunctionsCatalog, relationshipsAndJunctionsCoverage) {
  var expectedIds = relationshipsAndJunctionsCatalog.expectedIds || [];
  var actualIds = relationshipsAndJunctionsCoverage.map(function(relationshipsAndJunctionsItem) {
    return relationshipsAndJunctionsItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = relationshipsAndJunctionsCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, relationshipsAndJunctionsCatalog, {
    items: relationshipsAndJunctionsCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingRelationshipsAndJunctionsIds: missingIds,
    extraRelationshipsAndJunctionsIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeMotivationDomainCoverage(motivationDomainCatalog, motivationDomainCoverage) {
  var expectedIds = motivationDomainCatalog.expectedIds || [];
  var actualIds = motivationDomainCoverage.map(function(motivationDomainItem) {
    return motivationDomainItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = motivationDomainCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, motivationDomainCatalog, {
    items: motivationDomainCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingMotivationDomainIds: missingIds,
    extraMotivationDomainIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeStrategyDomainCoverage(strategyDomainCatalog, strategyDomainCoverage) {
  var expectedIds = strategyDomainCatalog.expectedIds || [];
  var actualIds = strategyDomainCoverage.map(function(strategyDomainItem) {
    return strategyDomainItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = strategyDomainCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, strategyDomainCatalog, {
    items: strategyDomainCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingStrategyDomainIds: missingIds,
    extraStrategyDomainIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeBusinessDomainCoverage(businessDomainCatalog, businessDomainCoverage) {
  var expectedIds = businessDomainCatalog.expectedIds || [];
  var actualIds = businessDomainCoverage.map(function(businessDomainItem) {
    return businessDomainItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = businessDomainCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, businessDomainCatalog, {
    items: businessDomainCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingBusinessDomainIds: missingIds,
    extraBusinessDomainIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeApplicationDomainCoverage(applicationDomainCatalog, applicationDomainCoverage) {
  var expectedIds = applicationDomainCatalog.expectedIds || [];
  var actualIds = applicationDomainCoverage.map(function(applicationDomainItem) {
    return applicationDomainItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = applicationDomainCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, applicationDomainCatalog, {
    items: applicationDomainCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingApplicationDomainIds: missingIds,
    extraApplicationDomainIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeTechnologyDomainCoverage(technologyDomainCatalog, technologyDomainCoverage) {
  var expectedIds = technologyDomainCatalog.expectedIds || [];
  var actualIds = technologyDomainCoverage.map(function(technologyDomainItem) {
    return technologyDomainItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = technologyDomainCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, technologyDomainCatalog, {
    items: technologyDomainCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingTechnologyDomainIds: missingIds,
    extraTechnologyDomainIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeRelationshipsBetweenCoreDomainsCoverage(
    relationshipsBetweenCoreDomainsCatalog,
    relationshipsBetweenCoreDomainsCoverage
) {
  var expectedIds = relationshipsBetweenCoreDomainsCatalog.expectedIds || [];
  var actualIds = relationshipsBetweenCoreDomainsCoverage.map(function(relationshipsBetweenCoreDomainsItem) {
    return relationshipsBetweenCoreDomainsItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = relationshipsBetweenCoreDomainsCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, relationshipsBetweenCoreDomainsCatalog, {
    items: relationshipsBetweenCoreDomainsCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingRelationshipsBetweenCoreDomainsIds: missingIds,
    extraRelationshipsBetweenCoreDomainsIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeImplementationAndMigrationDomainCoverage(
    implementationAndMigrationDomainCatalog,
    implementationAndMigrationDomainCoverage
) {
  var expectedIds = implementationAndMigrationDomainCatalog.expectedIds || [];
  var actualIds = implementationAndMigrationDomainCoverage.map(function(implementationAndMigrationDomainItem) {
    return implementationAndMigrationDomainItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = implementationAndMigrationDomainCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, implementationAndMigrationDomainCatalog, {
    items: implementationAndMigrationDomainCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingImplementationAndMigrationDomainIds: missingIds,
    extraImplementationAndMigrationDomainIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeStakeholdersArchitectureViewsViewpointsCoverage(
    stakeholdersArchitectureViewsViewpointsCatalog,
    stakeholdersArchitectureViewsViewpointsCoverage
) {
  var expectedIds = stakeholdersArchitectureViewsViewpointsCatalog.expectedIds || [];
  var actualIds = stakeholdersArchitectureViewsViewpointsCoverage.map(function(stakeholdersArchitectureViewsViewpointsItem) {
    return stakeholdersArchitectureViewsViewpointsItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = stakeholdersArchitectureViewsViewpointsCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, stakeholdersArchitectureViewsViewpointsCatalog, {
    items: stakeholdersArchitectureViewsViewpointsCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingStakeholdersArchitectureViewsViewpointsIds: missingIds,
    extraStakeholdersArchitectureViewsViewpointsIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeLanguageCustomizationMechanismsCoverage(
    languageCustomizationMechanismsCatalog,
    languageCustomizationMechanismsCoverage
) {
  var expectedIds = languageCustomizationMechanismsCatalog.expectedIds || [];
  var actualIds = languageCustomizationMechanismsCoverage.map(function(languageCustomizationMechanismsItem) {
    return languageCustomizationMechanismsItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = languageCustomizationMechanismsCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, languageCustomizationMechanismsCatalog, {
    items: languageCustomizationMechanismsCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingLanguageCustomizationMechanismsIds: missingIds,
    extraLanguageCustomizationMechanismsIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeAppendixANotationCoverage(appendixANotationCatalog, appendixANotationCoverage) {
  var expectedIds = appendixANotationCatalog.expectedIds || [];
  var actualIds = appendixANotationCoverage.map(function(appendixANotationItem) {
    return appendixANotationItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = appendixANotationCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, appendixANotationCatalog, {
    items: appendixANotationCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingAppendixANotationIds: missingIds,
    extraAppendixANotationIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeAppendixBRelationshipsCoverage(
    appendixBRelationshipsCatalog,
    appendixBRelationshipsCoverage
) {
  var expectedIds = appendixBRelationshipsCatalog.expectedIds || [];
  var actualIds = appendixBRelationshipsCoverage.map(function(appendixBRelationshipsItem) {
    return appendixBRelationshipsItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = appendixBRelationshipsCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, appendixBRelationshipsCatalog, {
    items: appendixBRelationshipsCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingAppendixBRelationshipsIds: missingIds,
    extraAppendixBRelationshipsIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeAppendixCExampleViewpointsCoverage(
    appendixCExampleViewpointsCatalog,
    appendixCExampleViewpointsCoverage
) {
  var expectedIds = appendixCExampleViewpointsCatalog.expectedIds || [];
  var actualIds = appendixCExampleViewpointsCoverage.map(function(appendixCExampleViewpointsItem) {
    return appendixCExampleViewpointsItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = appendixCExampleViewpointsCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, appendixCExampleViewpointsCatalog, {
    items: appendixCExampleViewpointsCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingAppendixCExampleViewpointsIds: missingIds,
    extraAppendixCExampleViewpointsIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
  });
}

function summarizeAppendixDStandardsGuidanceCoverage(
    appendixDStandardsGuidanceCatalog,
    appendixDStandardsGuidanceCoverage
) {
  var expectedIds = appendixDStandardsGuidanceCatalog.expectedIds || [];
  var expectedReferenceOnlyIds = appendixDStandardsGuidanceCatalog.expectedReferenceOnlyIds || [];
  var actualIds = appendixDStandardsGuidanceCoverage.map(function(appendixDStandardsGuidanceItem) {
    return appendixDStandardsGuidanceItem.id;
  });
  var referenceOnlyIds = appendixDStandardsGuidanceCoverage.filter(function(appendixDStandardsGuidanceItem) {
    return Boolean(appendixDStandardsGuidanceItem.referenceOnly);
  }).map(function(appendixDStandardsGuidanceItem) {
    return appendixDStandardsGuidanceItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var expectedReferenceOnlyIdSet = new Set(expectedReferenceOnlyIds);
  var referenceOnlyIdSet = new Set(referenceOnlyIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var missingReferenceOnlyIds = expectedReferenceOnlyIds.filter(function(id) {
    return !referenceOnlyIdSet.has(id);
  });
  var extraReferenceOnlyIds = expectedReferenceOnlyIds.length ? referenceOnlyIds.filter(function(id) {
    return !expectedReferenceOnlyIdSet.has(id);
  }) : [];
  var expectedCount = appendixDStandardsGuidanceCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, appendixDStandardsGuidanceCatalog, {
    items: appendixDStandardsGuidanceCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingAppendixDStandardsGuidanceIds: missingIds,
    extraAppendixDStandardsGuidanceIds: extraIds,
    referenceOnlyIds: referenceOnlyIds,
    missingReferenceOnlyIds: missingReferenceOnlyIds,
    extraReferenceOnlyIds: extraReferenceOnlyIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount &&
      missingIds.length === 0 &&
      extraIds.length === 0 &&
      missingReferenceOnlyIds.length === 0 &&
      extraReferenceOnlyIds.length === 0
  });
}

function summarizeAppendixEVersionChangesCoverage(
    appendixEVersionChangesCatalog,
    appendixEVersionChangesCoverage
) {
  var expectedIds = appendixEVersionChangesCatalog.expectedIds || [];
  var expectedHistoricalReferenceIds = appendixEVersionChangesCatalog.expectedHistoricalReferenceIds || [];
  var expectedMigrationSourceIds = appendixEVersionChangesCatalog.expectedMigrationSourceIds || [];
  var actualIds = appendixEVersionChangesCoverage.map(function(appendixEVersionChangesItem) {
    return appendixEVersionChangesItem.id;
  });
  var historicalReferenceIds = appendixEVersionChangesCoverage.filter(function(appendixEVersionChangesItem) {
    return Boolean(appendixEVersionChangesItem.historicalReference);
  }).map(function(appendixEVersionChangesItem) {
    return appendixEVersionChangesItem.id;
  });
  var migrationSourceIds = appendixEVersionChangesCoverage.filter(function(appendixEVersionChangesItem) {
    return Boolean(appendixEVersionChangesItem.migrationSource);
  }).map(function(appendixEVersionChangesItem) {
    return appendixEVersionChangesItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var expectedHistoricalReferenceIdSet = new Set(expectedHistoricalReferenceIds);
  var expectedMigrationSourceIdSet = new Set(expectedMigrationSourceIds);
  var historicalReferenceIdSet = new Set(historicalReferenceIds);
  var migrationSourceIdSet = new Set(migrationSourceIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var missingHistoricalReferenceIds = expectedHistoricalReferenceIds.filter(function(id) {
    return !historicalReferenceIdSet.has(id);
  });
  var extraHistoricalReferenceIds = expectedHistoricalReferenceIds.length ? historicalReferenceIds.filter(function(id) {
    return !expectedHistoricalReferenceIdSet.has(id);
  }) : [];
  var missingMigrationSourceIds = expectedMigrationSourceIds.filter(function(id) {
    return !migrationSourceIdSet.has(id);
  });
  var extraMigrationSourceIds = expectedMigrationSourceIds.length ? migrationSourceIds.filter(function(id) {
    return !expectedMigrationSourceIdSet.has(id);
  }) : [];
  var expectedCount = appendixEVersionChangesCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, appendixEVersionChangesCatalog, {
    items: appendixEVersionChangesCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingAppendixEVersionChangesIds: missingIds,
    extraAppendixEVersionChangesIds: extraIds,
    historicalReferenceIds: historicalReferenceIds,
    missingHistoricalReferenceIds: missingHistoricalReferenceIds,
    extraHistoricalReferenceIds: extraHistoricalReferenceIds,
    migrationSourceIds: migrationSourceIds,
    missingMigrationSourceIds: missingMigrationSourceIds,
    extraMigrationSourceIds: extraMigrationSourceIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount &&
      missingIds.length === 0 &&
      extraIds.length === 0 &&
      missingHistoricalReferenceIds.length === 0 &&
      extraHistoricalReferenceIds.length === 0 &&
      missingMigrationSourceIds.length === 0 &&
      extraMigrationSourceIds.length === 0
  });
}

function summarizeAppendixFAcronymsCoverage(
    appendixFAcronymsCatalog,
    appendixFAcronymsCoverage
) {
  var expectedIds = appendixFAcronymsCatalog.expectedIds || [];
  var expectedVocabularyOnlyIds = appendixFAcronymsCatalog.expectedVocabularyOnlyIds || [];
  var actualIds = appendixFAcronymsCoverage.map(function(appendixFAcronymItem) {
    return appendixFAcronymItem.id;
  });
  var vocabularyOnlyIds = appendixFAcronymsCoverage.filter(function(appendixFAcronymItem) {
    return Boolean(appendixFAcronymItem.vocabularyOnly);
  }).map(function(appendixFAcronymItem) {
    return appendixFAcronymItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var expectedVocabularyOnlyIdSet = new Set(expectedVocabularyOnlyIds);
  var vocabularyOnlyIdSet = new Set(vocabularyOnlyIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var missingVocabularyOnlyIds = expectedVocabularyOnlyIds.filter(function(id) {
    return !vocabularyOnlyIdSet.has(id);
  });
  var extraVocabularyOnlyIds = expectedVocabularyOnlyIds.length ? vocabularyOnlyIds.filter(function(id) {
    return !expectedVocabularyOnlyIdSet.has(id);
  }) : [];
  var expectedCount = appendixFAcronymsCatalog.expectedCount || expectedIds.length;

  return Object.assign({}, appendixFAcronymsCatalog, {
    items: appendixFAcronymsCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingAppendixFAcronymIds: missingIds,
    extraAppendixFAcronymIds: extraIds,
    vocabularyOnlyIds: vocabularyOnlyIds,
    missingVocabularyOnlyIds: missingVocabularyOnlyIds,
    extraVocabularyOnlyIds: extraVocabularyOnlyIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount &&
      missingIds.length === 0 &&
      extraIds.length === 0 &&
      missingVocabularyOnlyIds.length === 0 &&
      extraVocabularyOnlyIds.length === 0
  });
}

function summarizeDocumentArtifactCoverage(
    documentArtifactCatalog,
    documentArtifactCoverage
) {
  var expectedIds = documentArtifactCatalog.expectedIds || [];
  var actualIds = documentArtifactCoverage.map(function(documentArtifactItem) {
    return documentArtifactItem.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = documentArtifactCatalog.expectedCount || expectedIds.length;
  var nonImplementationIds = documentArtifactCoverage.filter(function(documentArtifactItem) {
    return documentArtifactItem.nonImplementation;
  }).map(function(documentArtifactItem) {
    return documentArtifactItem.id;
  });
  var expectedNonImplementationIds = documentArtifactCatalog.expectedNonImplementationIds || [];
  var expectedNonImplementationIdSet = new Set(expectedNonImplementationIds);
  var nonImplementationIdSet = new Set(nonImplementationIds);
  var missingNonImplementationIds = expectedNonImplementationIds.filter(function(id) {
    return !nonImplementationIdSet.has(id);
  });
  var extraNonImplementationIds = expectedNonImplementationIds.length ? nonImplementationIds.filter(function(id) {
    return !expectedNonImplementationIdSet.has(id);
  }) : [];

  return Object.assign({}, documentArtifactCatalog, {
    items: documentArtifactCoverage,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingDocumentArtifactIds: missingIds,
    extraDocumentArtifactIds: extraIds,
    expectedNonImplementationIds: expectedNonImplementationIds,
    nonImplementationIds: nonImplementationIds,
    missingNonImplementationIds: missingNonImplementationIds,
    extraNonImplementationIds: extraNonImplementationIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount &&
      missingIds.length === 0 &&
      extraIds.length === 0 &&
      missingNonImplementationIds.length === 0 &&
      extraNonImplementationIds.length === 0
  });
}

function summarizeC260CoverageAggregate(coverageEntries) {
  var expectedCoverageIds = coverageEntries.map(function(entry) {
    return entry.id;
  });
  var actualCoverageIds = coverageEntries.filter(function(entry) {
    return !!entry.summary;
  }).map(function(entry) {
    return entry.id;
  });
  var actualCoverageIdSet = new Set(actualCoverageIds);
  var missingCoverageIds = expectedCoverageIds.filter(function(id) {
    return !actualCoverageIdSet.has(id);
  });
  var expectedCoverageIdSet = new Set(expectedCoverageIds);
  var extraCoverageIds = actualCoverageIds.filter(function(id) {
    return !expectedCoverageIdSet.has(id);
  });
  var incompleteCoverageIds = coverageEntries.filter(function(entry) {
    return !entry.summary || !entry.summary.complete;
  }).map(function(entry) {
    return entry.id;
  });
  var expectedItemCount = coverageEntries.reduce(function(count, entry) {
    return count + ((entry.summary && entry.summary.expectedCount) || 0);
  }, 0);
  var actualItemRefs = [];

  coverageEntries.forEach(function(entry) {
    var actualIds = (entry.summary && entry.summary.actualIds) || [];

    actualIds.forEach(function(id) {
      actualItemRefs.push({
        coverageId: entry.id,
        id: id,
        qualifiedId: entry.id + ':' + id
      });
    });
  });

  var rawSeen = new Set();
  var rawDuplicateSeen = new Set();
  var rawDuplicateIds = [];

  actualItemRefs.forEach(function(itemRef) {
    if (rawSeen.has(itemRef.id) && !rawDuplicateSeen.has(itemRef.id)) {
      rawDuplicateIds.push(itemRef.id);
      rawDuplicateSeen.add(itemRef.id);
    }

    rawSeen.add(itemRef.id);
  });

  var qualifiedSeen = new Set();
  var qualifiedDuplicateIds = [];

  actualItemRefs.forEach(function(itemRef) {
    if (qualifiedSeen.has(itemRef.qualifiedId)) {
      qualifiedDuplicateIds.push(itemRef.qualifiedId);
    }

    qualifiedSeen.add(itemRef.qualifiedId);
  });

  return {
    status: 'c260-coverage-aggregate-derived',
    expectedCoverageIds: expectedCoverageIds,
    actualCoverageIds: actualCoverageIds,
    missingCoverageIds: missingCoverageIds,
    extraCoverageIds: extraCoverageIds,
    incompleteCoverageIds: incompleteCoverageIds,
    expectedCoverageCount: expectedCoverageIds.length,
    actualCoverageCount: actualCoverageIds.length,
    expectedItemCount: expectedItemCount,
    actualItemCount: actualItemRefs.length,
    qualifiedItemCount: qualifiedSeen.size,
    qualifiedDuplicateCount: qualifiedDuplicateIds.length,
    qualifiedDuplicateIds: qualifiedDuplicateIds,
    uniqueRawItemCount: rawSeen.size,
    rawDuplicateIds: rawDuplicateIds,
    complete: missingCoverageIds.length === 0 &&
      extraCoverageIds.length === 0 &&
      incompleteCoverageIds.length === 0 &&
      actualItemRefs.length === expectedItemCount &&
      qualifiedDuplicateIds.length === 0
  };
}

function summarizeC260SourceAlignment(sourceAlignmentCatalog, coverageAggregate, coverageEntries) {
  var expectedOutlineCoverageIds = sourceAlignmentCatalog.expectedOutlineCoverageIds || [];
  var expectedOutlineCoverageCounts = sourceAlignmentCatalog.expectedOutlineCoverageCounts || {};
  var nonOutlineDerivedCoverageIds = sourceAlignmentCatalog.nonOutlineDerivedCoverageIds || [];
  var coverageEntryMap = new Map();

  coverageEntries.forEach(function(entry) {
    coverageEntryMap.set(entry.id, entry);
  });

  var expectedOutlineCoverageIdSet = new Set(expectedOutlineCoverageIds);
  var nonOutlineDerivedCoverageIdSet = new Set(nonOutlineDerivedCoverageIds);
  var actualOutlineCoverageIds = expectedOutlineCoverageIds.filter(function(id) {
    return coverageEntryMap.has(id);
  });
  var actualOutlineCoverageIdSet = new Set(actualOutlineCoverageIds);
  var missingOutlineCoverageIds = expectedOutlineCoverageIds.filter(function(id) {
    return !actualOutlineCoverageIdSet.has(id);
  });
  var extraOutlineCoverageIds = coverageEntries.filter(function(entry) {
    return !expectedOutlineCoverageIdSet.has(entry.id) &&
      !nonOutlineDerivedCoverageIdSet.has(entry.id);
  }).map(function(entry) {
    return entry.id;
  });
  var incompleteOutlineCoverageIds = expectedOutlineCoverageIds.filter(function(id) {
    var entry = coverageEntryMap.get(id);
    return !entry || !entry.summary || !entry.summary.complete;
  });
  var outlineCoveredItemCount = expectedOutlineCoverageIds.reduce(function(count, id) {
    return count + getCoverageEntryActualCount(coverageEntryMap.get(id));
  }, 0);
  var actualOutlineCoverageCounts = {};

  expectedOutlineCoverageIds.forEach(function(id) {
    actualOutlineCoverageCounts[id] = getCoverageEntryActualCount(coverageEntryMap.get(id));
  });

  var expectedOutlineCoverageCountIds = Object.keys(expectedOutlineCoverageCounts);
  var expectedOutlineCoverageCountIdSet = new Set(expectedOutlineCoverageCountIds);
  var missingOutlineCoverageCountIds = expectedOutlineCoverageIds.filter(function(id) {
    return !expectedOutlineCoverageCountIdSet.has(id);
  });
  var extraOutlineCoverageCountIds = expectedOutlineCoverageCountIds.filter(function(id) {
    return !expectedOutlineCoverageIdSet.has(id);
  });
  var outlineCoverageCountDeltas = expectedOutlineCoverageCountIds.filter(function(id) {
    return actualOutlineCoverageCounts[id] !== expectedOutlineCoverageCounts[id];
  }).map(function(id) {
    var expectedCount = expectedOutlineCoverageCounts[id];
    var actualCount = actualOutlineCoverageCounts[id] || 0;

    return {
      id: id,
      expectedCount: expectedCount,
      actualCount: actualCount,
      delta: actualCount - expectedCount
    };
  });
  var expectedOutlineAssignedItemCount = expectedOutlineCoverageCountIds.reduce(function(count, id) {
    return count + expectedOutlineCoverageCounts[id];
  }, 0);
  var actualOutlineAssignedItemCount = Object.keys(actualOutlineCoverageCounts).reduce(function(count, id) {
    return count + actualOutlineCoverageCounts[id];
  }, 0);
  var nonOutlineDerivedItemCount = nonOutlineDerivedCoverageIds.reduce(function(count, id) {
    return count + getCoverageEntryActualCount(coverageEntryMap.get(id));
  }, 0);
  var outlineSourceItemCount = sourceAlignmentCatalog.outlineSourceItemCount || 0;
  var expectedAggregateItemCount = outlineSourceItemCount + nonOutlineDerivedItemCount;
  var aggregateItemCount = coverageAggregate.actualItemCount || 0;

  return Object.assign({}, sourceAlignmentCatalog, {
    expectedOutlineCoverageIds: expectedOutlineCoverageIds,
    actualOutlineCoverageIds: actualOutlineCoverageIds,
    missingOutlineCoverageIds: missingOutlineCoverageIds,
    extraOutlineCoverageIds: extraOutlineCoverageIds,
    incompleteOutlineCoverageIds: incompleteOutlineCoverageIds,
    expectedOutlineCoverageCounts: expectedOutlineCoverageCounts,
    actualOutlineCoverageCounts: actualOutlineCoverageCounts,
    missingOutlineCoverageCountIds: missingOutlineCoverageCountIds,
    extraOutlineCoverageCountIds: extraOutlineCoverageCountIds,
    outlineCoverageCountDeltas: outlineCoverageCountDeltas,
    expectedOutlineAssignedItemCount: expectedOutlineAssignedItemCount,
    actualOutlineAssignedItemCount: actualOutlineAssignedItemCount,
    outlineAssignmentComplete: missingOutlineCoverageCountIds.length === 0 &&
      extraOutlineCoverageCountIds.length === 0 &&
      outlineCoverageCountDeltas.length === 0 &&
      expectedOutlineAssignedItemCount === outlineSourceItemCount &&
      actualOutlineAssignedItemCount === outlineSourceItemCount,
    outlineCoveredItemCount: outlineCoveredItemCount,
    outlineItemCountDelta: outlineCoveredItemCount - outlineSourceItemCount,
    nonOutlineDerivedCoverageIds: nonOutlineDerivedCoverageIds,
    nonOutlineDerivedItemCount: nonOutlineDerivedItemCount,
    aggregateItemCount: aggregateItemCount,
    expectedAggregateItemCount: expectedAggregateItemCount,
    aggregateItemCountDelta: aggregateItemCount - expectedAggregateItemCount,
    complete: missingOutlineCoverageIds.length === 0 &&
      extraOutlineCoverageIds.length === 0 &&
      incompleteOutlineCoverageIds.length === 0 &&
      missingOutlineCoverageCountIds.length === 0 &&
      extraOutlineCoverageCountIds.length === 0 &&
      outlineCoverageCountDeltas.length === 0 &&
      outlineCoveredItemCount === outlineSourceItemCount &&
      expectedOutlineAssignedItemCount === outlineSourceItemCount &&
      actualOutlineAssignedItemCount === outlineSourceItemCount &&
      aggregateItemCount === expectedAggregateItemCount &&
      !!coverageAggregate.complete
  });
}

function summarizeC260CoverageSourceEvidence(sourceEvidenceCatalog, coverageEntries) {
  var expectedCoverageSourceRunlogPaths =
    sourceEvidenceCatalog.expectedCoverageSourceRunlogPaths || {};
  var expectedCoverageIds = Object.keys(expectedCoverageSourceRunlogPaths);
  var expectedCoverageIdSet = new Set(expectedCoverageIds);
  var coverageSourceRunlogPaths = {};

  coverageEntries.forEach(function(entry) {
    var sourceRunlogPath = entry.summary && entry.summary.sourceRunlogPath;

    if (sourceRunlogPath) {
      coverageSourceRunlogPaths[entry.id] = sourceRunlogPath;
    }
  });

  var actualCoverageIds = Object.keys(coverageSourceRunlogPaths);
  var actualCoverageIdSet = new Set(actualCoverageIds);
  var missingSourceRunlogCoverageIds = expectedCoverageIds.filter(function(id) {
    return !actualCoverageIdSet.has(id);
  });
  var extraSourceRunlogCoverageIds = actualCoverageIds.filter(function(id) {
    return !expectedCoverageIdSet.has(id);
  });
  var sourceRunlogPathDeltas = expectedCoverageIds.filter(function(id) {
    return coverageSourceRunlogPaths[id] &&
      coverageSourceRunlogPaths[id] !== expectedCoverageSourceRunlogPaths[id];
  }).map(function(id) {
    return {
      id: id,
      expectedSourceRunlogPath: expectedCoverageSourceRunlogPaths[id],
      actualSourceRunlogPath: coverageSourceRunlogPaths[id]
    };
  });
  var uniqueSourceRunlogPaths = [];
  var uniqueSourceRunlogPathSet = new Set();

  expectedCoverageIds.forEach(function(id) {
    var sourceRunlogPath = coverageSourceRunlogPaths[id];

    if (sourceRunlogPath && !uniqueSourceRunlogPathSet.has(sourceRunlogPath)) {
      uniqueSourceRunlogPaths.push(sourceRunlogPath);
      uniqueSourceRunlogPathSet.add(sourceRunlogPath);
    }
  });

  return Object.assign({}, sourceEvidenceCatalog, {
    expectedCoverageIds: expectedCoverageIds,
    actualCoverageIds: actualCoverageIds,
    coverageSourceRunlogPaths: coverageSourceRunlogPaths,
    missingSourceRunlogCoverageIds: missingSourceRunlogCoverageIds,
    extraSourceRunlogCoverageIds: extraSourceRunlogCoverageIds,
    sourceRunlogPathDeltas: sourceRunlogPathDeltas,
    uniqueSourceRunlogPaths: uniqueSourceRunlogPaths,
    expectedCoverageCount: expectedCoverageIds.length,
    actualCoverageCount: actualCoverageIds.length,
    complete: missingSourceRunlogCoverageIds.length === 0 &&
      extraSourceRunlogCoverageIds.length === 0 &&
      sourceRunlogPathDeltas.length === 0 &&
      actualCoverageIds.length === expectedCoverageIds.length
  });
}

function getCoverageEntryActualCount(entry) {
  if (!entry || !entry.summary) {
    return 0;
  }

  if (typeof entry.summary.actualCount === 'number') {
    return entry.summary.actualCount;
  }

  return (entry.summary.actualIds || []).length;
}

function summarizeConformanceRequirements(requirements, requirementCatalog) {
  var shall = requirements.filter(function(requirement) {
    return requirement.level === 'shall';
  });
  var may = requirements.filter(function(requirement) {
    return requirement.level === 'may';
  });
  var expectedShallIds = requirementCatalog.expectedShallIds || [];
  var expectedMayIds = requirementCatalog.expectedMayIds || [];
  var expectedIds = expectedShallIds.concat(expectedMayIds);
  var actualIds = requirements.map(function(requirement) {
    return requirement.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];
  var expectedCount = requirementCatalog.expectedCount || expectedIds.length;
  var shallSummary = summarizeRequirementLevel(shall, expectedShallIds);
  var maySummary = summarizeRequirementLevel(may, expectedMayIds);

  return Object.assign({}, requirementCatalog, {
    items: requirements,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0,
    shall: Object.assign({}, shallSummary, {
      implemented: shall.filter(function(requirement) {
        return requirement.status === 'implemented';
      }).length,
      externalBlocked: shall.filter(function(requirement) {
        return Boolean(requirement.externalBlocker);
      }).length
    }),
    may: Object.assign({}, maySummary, {
      bundled: may.filter(function(requirement) {
        return requirement.status === 'implemented';
      }).length,
      notBundled: may.filter(function(requirement) {
        return requirement.status !== 'implemented';
      }).length
    })
  });
}

function summarizeRequirementLevel(requirements, expectedIds) {
  var actualIds = requirements.map(function(requirement) {
    return requirement.id;
  });
  var expectedIdSet = new Set(expectedIds);
  var actualIdSet = new Set(actualIds);
  var missingIds = expectedIds.filter(function(id) {
    return !actualIdSet.has(id);
  });
  var extraIds = expectedIds.length ? actualIds.filter(function(id) {
    return !expectedIdSet.has(id);
  }) : [];

  return {
    total: requirements.length,
    expectedCount: expectedIds.length,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    complete: actualIds.length === expectedIds.length && missingIds.length === 0 && extraIds.length === 0
  };
}

function summarizeConformanceReadiness(readiness, conformanceRequirements, sourceCoverage, externalBlockers) {
  var blockers = readiness.blockers || externalBlockers;
  var requiredBeforeClaimByBlocker = readiness.requiredBeforeClaimByBlocker || {};
  var actualRequiredBeforeClaimBlockerIds = Object.keys(requiredBeforeClaimByBlocker);
  var requiredBeforeClaimBlockerIds = readiness.requiredBeforeClaimBlockerIds || blockers;
  var requiredBeforeClaimBlockerIdSet = new Set(requiredBeforeClaimBlockerIds);
  var actualRequiredBeforeClaimBlockerIdSet = new Set(actualRequiredBeforeClaimBlockerIds);
  var missingRequiredBeforeClaimBlockerIds = requiredBeforeClaimBlockerIds.filter(function(id) {
    return !actualRequiredBeforeClaimBlockerIdSet.has(id);
  });
  var extraRequiredBeforeClaimBlockerIds = requiredBeforeClaimBlockerIds.length ? actualRequiredBeforeClaimBlockerIds.filter(function(id) {
    return !requiredBeforeClaimBlockerIdSet.has(id);
  }) : [];
  var missingRequiredSources = sourceCoverage.missingRequiredSources || [];
  var externalBlockedShallCount = conformanceRequirements.shall.externalBlocked;
  var officialConformanceClaimable = readiness.officialConformanceClaimable === true &&
    blockers.length === 0 &&
    missingRequiredSources.length === 0 &&
    externalBlockedShallCount === 0;

  return Object.assign({}, readiness, {
    officialConformanceClaimable: officialConformanceClaimable,
    reason: readiness.reason || (officialConformanceClaimable ? 'claimable' : 'external-blockers-remain'),
    blockers: blockers,
    requiredBeforeClaimBlockerIds: requiredBeforeClaimBlockerIds,
    actualRequiredBeforeClaimBlockerIds: actualRequiredBeforeClaimBlockerIds,
    missingRequiredBeforeClaimBlockerIds: missingRequiredBeforeClaimBlockerIds,
    extraRequiredBeforeClaimBlockerIds: extraRequiredBeforeClaimBlockerIds,
    requiredBeforeClaimByBlocker: requiredBeforeClaimByBlocker,
    implementedShallCount: conformanceRequirements.shall.implemented,
    externalBlockedShallCount: externalBlockedShallCount,
    missingRequiredSources: missingRequiredSources,
    missingCompanionSources: sourceCoverage.missingCompanionSources || []
  });
}

function getProfileTypeLineage(type, profile) {
  var currentType = type;
  var lineage = [];
  var visited = new Set();

  while (currentType && !visited.has(currentType)) {
    visited.add(currentType);
    lineage.push(currentType);

    var concept = getProfileConcept(currentType, profile);

    if (concept && concept.specializes) {
      currentType = concept.specializes;
      continue;
    }

    var relationship = getProfileRelationship(currentType, profile);

    if (relationship && relationship.specializes) {
      currentType = relationship.specializes;
      continue;
    }

    break;
  }

  return lineage;
}

function parseLanguageProfileCustomization(customization) {
  if (!customization) {
    return null;
  }

  if (typeof customization !== 'string') {
    if (!isObject(customization)) {
      throw new Error('Custom ArchiMate language profile must be an object or JSON string');
    }

    return customization;
  }

  try {
    return JSON.parse(customization);
  } catch (error) {
    throw new Error('Custom ArchiMate language profile JSON could not be parsed: ' + error.message);
  }
}

function cloneProfile(profile) {
  return JSON.parse(JSON.stringify(profile));
}

function mergeNamedItems(profile, customProfile, key, idKey) {
  if (!customProfile[key]) {
    return;
  }

  if (!Array.isArray(customProfile[key])) {
    throw new Error('Custom ArchiMate language profile ' + key + ' must be an array');
  }

  profile[key] = profile[key] || [];

  var existing = new Map(profile[key].map(function(value, index) {
    return [ value[idKey], { value: value, index: index } ];
  }));

  customProfile[key].forEach(function(value) {
    if (!value || !value[idKey]) {
      throw new Error('Custom ArchiMate language profile ' + key + ' entries require ' + idKey);
    }

    var match = existing.get(value[idKey]);

    if (match) {
      profile[key][match.index] = Object.assign({}, match.value, value);
      return;
    }

    profile[key].push(value);
  });
}

function mergeConcepts(profile, customProfile, key) {
  if (!customProfile[key]) {
    return;
  }

  if (!Array.isArray(customProfile[key])) {
    throw new Error('Custom ArchiMate language profile ' + key + ' must be an array');
  }

  var builtInTypes = new Set((profile[key] || []).map(function(concept) {
    return concept.type;
  }));

  mergeNamedItems(profile, customProfile, key, 'type');

  (profile[key] || []).forEach(function(concept) {
    if (!concept.specializes) {
      return;
    }

    if (!getProfileConcept(concept.specializes, profile)) {
      throw new Error(
        'Custom ArchiMate concept ' + concept.type + ' specializes unknown concept ' + concept.specializes
      );
    }
  });

  customProfile[key].forEach(function(concept) {
    if (!getProfileConcept(concept.type, profile)) {
      throw new Error('Custom ArchiMate concept could not be registered: ' + concept.type);
    }

    if (!builtInTypes.has(concept.type) && !concept.specializes) {
      throw new Error('Custom ArchiMate concept ' + concept.type + ' must declare specializes');
    }
  });
}

function mergeRelationshipNames(profile, customProfile) {
  if (!customProfile.relationships) {
    return;
  }

  if (!Array.isArray(customProfile.relationships)) {
    throw new Error('Custom ArchiMate language profile relationships must be an array');
  }

  profile.relationships = profile.relationships || [];

  customProfile.relationships.forEach(function(relationship) {
    var relationshipDefinition = normalizeRelationshipDefinition(relationship);
    var existingIndex = findRelationshipIndex(profile.relationships, relationshipDefinition.type);

    if (existingIndex === -1) {
      profile.relationships.push(relationship);
      return;
    }

    profile.relationships[existingIndex] = mergeRelationshipDefinition(
      profile.relationships[existingIndex],
      relationship
    );
  });

  customProfile.relationships.forEach(function(relationship) {
    var relationshipDefinition = normalizeRelationshipDefinition(relationship);

    if (typeof relationship === 'string') {
      return;
    }

    if (!relationshipDefinition.specializes) {
      throw new Error('Custom ArchiMate relationship ' + relationshipDefinition.type + ' must declare specializes');
    }

    if (!getProfileRelationship(relationshipDefinition.specializes, profile)) {
      throw new Error(
        'Custom ArchiMate relationship ' + relationshipDefinition.type +
        ' specializes unknown relationship ' + relationshipDefinition.specializes
      );
    }
  });
}

function mergeAttributes(profile, customProfile) {
  if (!customProfile.attributes) {
    return;
  }

  if (!Array.isArray(customProfile.attributes)) {
    throw new Error('Custom ArchiMate language profile attributes must be an array');
  }

  customProfile.attributes.forEach(function(attribute) {
    validateProfileAttribute(attribute, profile);
  });

  profile.attributes = (profile.attributes || []).concat(customProfile.attributes);
}

function validateProfileAttribute(attribute, profile) {
  if (!attribute || typeof attribute !== 'object') {
    throw new Error('Custom ArchiMate profile attributes must be objects');
  }

  if (!attribute.concept) {
    throw new Error('Custom ArchiMate profile attributes require concept');
  }

  if (!attribute.name) {
    throw new Error('Custom ArchiMate profile attributes require name');
  }

  if (!attribute.type) {
    throw new Error('Custom ArchiMate profile attributes require type');
  }

  if (!hasProfileConcept(attribute.concept, profile) && !hasProfileRelationship(attribute.concept, profile)) {
    throw new Error('Unsupported ArchiMate profile attribute concept: ' + attribute.concept);
  }

  if (PROFILE_ATTRIBUTE_TYPES.indexOf(attribute.type) === -1) {
    throw new Error('Unsupported ArchiMate profile attribute type: ' + attribute.type);
  }
}

function mergeViewpoints(profile, customProfile) {
  if (!customProfile.viewpoints) {
    return;
  }

  if (!Array.isArray(customProfile.viewpoints)) {
    throw new Error('Custom ArchiMate language profile viewpoints must be an array');
  }

  customProfile.viewpoints.forEach(function(viewpoint) {
    validateViewpoint(viewpoint, profile);
  });

  mergeNamedItems(profile, customProfile, 'viewpoints', 'id');
}

function validateViewpoint(viewpoint, profile) {
  if (!viewpoint || !viewpoint.id) {
    throw new Error('Custom ArchiMate viewpoint entries require id');
  }

  validateViewpointTokenList(viewpoint.viewpointPurpose, VIEWPOINT_PURPOSES, 'viewpointPurpose');
  validateViewpointTokenList(viewpoint.viewpointContent, VIEWPOINT_CONTENT_TYPES, 'viewpointContent');
  validateViewpointTypeList(viewpoint.allowedElementTypes, 'allowedElementTypes', function(type) {
    return hasProfileConcept(type, profile);
  });
  validateViewpointTypeList(viewpoint.allowedRelationshipTypes, 'allowedRelationshipTypes', function(type) {
    return hasProfileRelationship(type, profile);
  });
}

function validateViewpointTokenList(value, allowedValues, fieldName) {
  if (!value) {
    return;
  }

  var tokens = Array.isArray(value) ? value : String(value).split(/\s+/).filter(Boolean);
  var allowed = new Set(allowedValues);

  tokens.forEach(function(token) {
    if (!allowed.has(token)) {
      throw new Error('Unsupported ArchiMate viewpoint ' + fieldName + ': ' + token);
    }
  });
}

function validateViewpointTypeList(value, fieldName, isSupported) {
  getViewpointTypeTokens(value, fieldName).forEach(function(type) {
    if (!isSupported(type)) {
      throw new Error('Unsupported ArchiMate viewpoint ' + fieldName + ': ' + type);
    }
  });
}

function getViewpointTypeTokens(value, fieldName) {
  if (!value) {
    return [];
  }

  if (!Array.isArray(value)) {
    return String(value).split(/\s+/).filter(Boolean);
  }

  return value.map(function(entry) {
    if (typeof entry === 'string') {
      return entry;
    }

    if (entry && entry.type) {
      return entry.type;
    }

    throw new Error('Custom ArchiMate viewpoint ' + fieldName + ' entries require type');
  });
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function findRelationshipIndex(relationships, relationshipType) {
  for (var index = 0; index < relationships.length; index++) {
    if (normalizeRelationshipDefinition(relationships[index]).type === relationshipType) {
      return index;
    }
  }

  return -1;
}

function mergeRelationshipDefinition(existing, relationship) {
  if (typeof existing === 'string' && typeof relationship === 'string') {
    return existing;
  }

  return Object.assign(
    {},
    normalizeRelationshipDefinition(existing),
    normalizeRelationshipDefinition(relationship)
  );
}

function normalizeRelationshipDefinition(relationship) {
  if (typeof relationship === 'string') {
    return {
      type: relationship
    };
  }

  if (!isObject(relationship)) {
    throw new Error('Custom ArchiMate relationship entries must be relationship names or objects');
  }

  if (!relationship.type) {
    throw new Error('Custom ArchiMate relationship entries require type');
  }

  return relationship;
}

import archimate3Profile from './archimate3-profile.json' with { type: 'json' };
import archimate4Profile from './archimate4-profile.json' with { type: 'json' };
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
    externalBlockerCatalog
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

  return {
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
    exchangeFormat: conformance.exchangeFormat,
    iconography: conformance.iconography,
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
    externalBlockerCatalog: externalBlockerCatalog,
    externalBlockers: externalBlockerCatalog.actualIds
  };
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

function summarizeSectionCoverage(sectionCatalog, sections, conformanceRequirements, externalBlockerCatalog) {
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
  var requirementIds = [];
  var externalBlockerIds = [];

  sections.forEach(function(section) {
    if (section.requirementId) {
      appendUnique(requirementIds, section.requirementId);
    }

    if (section.externalBlocker) {
      appendUnique(externalBlockerIds, section.externalBlocker);
    }
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
      missingExternalBlockerReferenceIds.length === 0
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

  return Object.assign({}, introductionCatalog, {
    items: introductions,
    expectedIds: expectedIds,
    actualIds: actualIds,
    missingIds: missingIds,
    extraIds: extraIds,
    missingIntroductionIds: missingIds,
    extraIntroductionIds: extraIds,
    expectedCount: expectedCount,
    actualCount: actualIds.length,
    complete: actualIds.length === expectedCount && missingIds.length === 0 && extraIds.length === 0
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

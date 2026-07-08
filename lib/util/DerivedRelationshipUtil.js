import {
  IMP_MIG_PLATEAU,
  OTHER_GROUPING,
  OTHER_LOCATION,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_ASSOCIATION,
  RELATIONSHIP_COMPOSITION,
  RELATIONSHIP_FLOW,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_SERVING,
  RELATIONSHIP_SPECIALIZATION,
  RELATIONSHIP_TRIGGERING
} from '../metamodel/Concept.js';

const STRUCTURAL_RELATIONSHIPS_BY_STRENGTH = [
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_COMPOSITION
];
const DEPENDENCY_RELATIONSHIPS_BY_STRENGTH = [
  RELATIONSHIP_ASSOCIATION,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_SERVING
];
const DYNAMIC_RELATIONSHIPS = [
  RELATIONSHIP_TRIGGERING,
  RELATIONSHIP_FLOW
];
const GROUPING_POTENTIAL_RELATIONSHIPS = [
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_ASSIGNMENT
];
const DEPENDENCY_RELATIONSHIPS = [
  RELATIONSHIP_SERVING,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_ASSOCIATION
];
const RELATIONSHIP_DOMAIN = 'Relationships';
const CORE_DERIVATION_DOMAIN = 'Core';
const MOTIVATION_DERIVATION_DOMAIN = 'Motivation';
const STRATEGY_DERIVATION_DOMAIN = 'Strategy';
const IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN = 'Implementation and Migration';
const CORE_PROFILE_DOMAINS = [
  'Common',
  'Business',
  'Application',
  'Technology'
];
const PASSIVE_STRUCTURE_ASPECTS = [
  'Passive Structure',
  'Passive structure'
];
const RELATIONSHIP_DOMAIN_TYPES = [
  RELATIONSHIP_COMPOSITION,
  RELATIONSHIP_AGGREGATION,
  RELATIONSHIP_ASSIGNMENT,
  RELATIONSHIP_REALIZATION,
  RELATIONSHIP_ASSOCIATION,
  RELATIONSHIP_INFLUENCE,
  RELATIONSHIP_ACCESS,
  RELATIONSHIP_SERVING,
  RELATIONSHIP_TRIGGERING,
  RELATIONSHIP_FLOW,
  RELATIONSHIP_SPECIALIZATION
];
const GROUPING_LOCATION_PLATEAU_TYPES = [
  OTHER_GROUPING,
  OTHER_LOCATION,
  IMP_MIG_PLATEAU
];
const GROUPING_LOCATION_TYPES = [
  OTHER_GROUPING,
  OTHER_LOCATION
];

export function isStructuralRelationshipType(relationshipType, profile) {
  return getStructuralRelationshipStrength(relationshipType, profile) !== -1;
}

export function isDependencyRelationshipType(relationshipType, profile) {
  return DEPENDENCY_RELATIONSHIPS.indexOf(getBaseRelationshipType(relationshipType, profile)) !== -1;
}

export function isDynamicRelationshipType(relationshipType, profile) {
  return DYNAMIC_RELATIONSHIPS.indexOf(getBaseRelationshipType(relationshipType, profile)) !== -1;
}

export function isDerivableRelationshipType(relationshipType, profile) {
  return isStructuralRelationshipType(relationshipType, profile) ||
    isDependencyRelationshipType(relationshipType, profile) ||
    isDynamicRelationshipType(relationshipType, profile);
}

export function getStructuralRelationshipStrength(relationshipType, profile) {
  var baseRelationshipType = getBaseRelationshipType(getRelationshipType(relationshipType), profile);

  return STRUCTURAL_RELATIONSHIPS_BY_STRENGTH.indexOf(baseRelationshipType);
}

export function getDependencyRelationshipStrength(relationshipType, profile) {
  var baseRelationshipType = getBaseRelationshipType(getRelationshipType(relationshipType), profile);

  return DEPENDENCY_RELATIONSHIPS_BY_STRENGTH.indexOf(baseRelationshipType);
}

export function getWeakestStructuralRelationshipType(firstRelationshipType, secondRelationshipType, profile) {
  var firstStrength = getStructuralRelationshipStrength(firstRelationshipType, profile),
      secondStrength = getStructuralRelationshipStrength(secondRelationshipType, profile);

  if (firstStrength === -1 || secondStrength === -1) {
    return null;
  }

  return STRUCTURAL_RELATIONSHIPS_BY_STRENGTH[Math.min(firstStrength, secondStrength)];
}

export function getWeakestDependencyRelationshipType(firstRelationshipType, secondRelationshipType, profile) {
  var firstStrength = getDependencyRelationshipStrength(firstRelationshipType, profile),
      secondStrength = getDependencyRelationshipStrength(secondRelationshipType, profile);

  if (firstStrength === -1 || secondStrength === -1) {
    return null;
  }

  return DEPENDENCY_RELATIONSHIPS_BY_STRENGTH[Math.min(firstStrength, secondStrength)];
}

export function deriveRelationshipType(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      secondRelationshipType = getRelationshipType(secondRelationship);

  if (!firstRelationshipType || !secondRelationshipType) {
    return null;
  }

  var candidate = getInLineDerivationCandidate(firstRelationshipType, secondRelationshipType, profile);

  return candidate && candidate.type || null;
}

export function deriveRelationship(firstRelationship, secondRelationship, options) {
  if (!isRelationshipObject(firstRelationship) || !isRelationshipObject(secondRelationship)) {
    return null;
  }

  var normalizedOptions = normalizeDerivationOptions(options),
      profile = normalizedOptions.profile;

  if (isRelationshipChain(firstRelationship, secondRelationship)) {
    var inLineCandidate = getInLineDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (inLineCandidate) {
      return createDerivedRelationshipIfAllowed(inLineCandidate, firstRelationship, secondRelationship,
        firstRelationship.source, secondRelationship.target, firstRelationship.target, normalizedOptions);
    }
  }

  if (isRelationshipOpposingTarget(firstRelationship, secondRelationship)) {
    var opposingTargetCandidate = getOpposingTargetDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (opposingTargetCandidate) {
      return createDerivedRelationshipIfAllowed(opposingTargetCandidate, firstRelationship, secondRelationship,
        secondRelationship.source, firstRelationship.source, firstRelationship.target, normalizedOptions);
    }
  }

  return null;
}

export function deriveRelationshipChain(relationships, profile) {
  if (!Array.isArray(relationships) || relationships.length < 2) {
    return null;
  }

  var currentRelationship = relationships[0],
      derivedFrom = getDerivedFrom(currentRelationship),
      derivationRules = [];

  for (var i = 1; i < relationships.length; i++) {
    var nextRelationship = relationships[i],
        derivedRelationship = deriveRelationship(currentRelationship, nextRelationship, profile);

    if (!derivedRelationship) {
      return null;
    }

    derivedFrom = derivedFrom.concat(getDerivedFrom(nextRelationship));
    derivationRules = derivationRules.concat(derivedRelationship.derivationRule);
    currentRelationship = Object.assign({}, derivedRelationship, {
      derivedFrom: derivedFrom,
      derivationRules: derivationRules
    });
  }

  return currentRelationship;
}

export function derivePotentialRelationship(firstRelationship, secondRelationship, options) {
  if (!isRelationshipObject(firstRelationship) || !isRelationshipObject(secondRelationship)) {
    return null;
  }

  var normalizedOptions = normalizePotentialOptions(options),
      profile = normalizedOptions.profile;

  if (isRelationshipChain(firstRelationship, secondRelationship)) {
    var inLineCandidate = getInLinePotentialDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (inLineCandidate) {
      return createPotentialDerivedRelationshipIfAllowed(inLineCandidate, firstRelationship, secondRelationship,
        firstRelationship.source, secondRelationship.target, firstRelationship.target, normalizedOptions);
    }
  }

  if (isRelationshipOpposingTarget(firstRelationship, secondRelationship)) {
    var opposingTargetCandidate = getOpposingTargetPotentialDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (opposingTargetCandidate) {
      return createPotentialDerivedRelationshipIfAllowed(opposingTargetCandidate, firstRelationship, secondRelationship,
        opposingTargetCandidate.sourceEndpoint === 'first-source' ? firstRelationship.source : secondRelationship.source,
        opposingTargetCandidate.targetEndpoint === 'second-source' ? secondRelationship.source : firstRelationship.source,
        firstRelationship.target,
        normalizedOptions);
    }
  }

  if (isRelationshipSameSource(firstRelationship, secondRelationship)) {
    var sameSourceCandidate = getSameSourcePotentialDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (sameSourceCandidate) {
      return createPotentialDerivedRelationshipIfAllowed(sameSourceCandidate, firstRelationship, secondRelationship,
        firstRelationship.target, secondRelationship.target, firstRelationship.source, normalizedOptions);
    }
  }

  if (isRelationshipFirstSourceSecondTarget(firstRelationship, secondRelationship)) {
    var firstSourceSecondTargetCandidate =
      getFirstSourceSecondTargetPotentialDerivationCandidate(firstRelationship, secondRelationship, profile);

    if (firstSourceSecondTargetCandidate) {
      return createPotentialDerivedRelationshipIfAllowed(firstSourceSecondTargetCandidate, firstRelationship, secondRelationship,
        secondRelationship.source, firstRelationship.target, firstRelationship.source, normalizedOptions);
    }
  }

  var groupingCandidate = getGroupingPotentialDerivationCandidate(firstRelationship, secondRelationship, normalizedOptions);

  if (groupingCandidate) {
    return createPotentialDerivedRelationshipIfAllowed(groupingCandidate, firstRelationship, secondRelationship,
      firstRelationship.target, secondRelationship.target, firstRelationship.source, normalizedOptions);
  }

  return null;
}

function getInLinePotentialDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstBaseRelationshipType = getBaseRelationshipType(getRelationshipType(firstRelationship), profile),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile),
      weakestDependencyType = getWeakestDependencyRelationshipType(firstRelationship, secondRelationship, profile);

  if (firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
      isDerivableRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-specialization-outgoing'
    };
  }

  if (weakestDependencyType) {
    return {
      type: weakestDependencyType,
      rule: 'potential-dependency-weakest'
    };
  }

  if (firstBaseRelationshipType === RELATIONSHIP_FLOW && isStructuralRelationshipType(secondRelationshipType, profile)) {
    return {
      type: RELATIONSHIP_FLOW,
      rule: 'potential-flow-structural'
    };
  }

  if (firstBaseRelationshipType === RELATIONSHIP_FLOW && secondBaseRelationshipType === RELATIONSHIP_FLOW) {
    return {
      type: RELATIONSHIP_FLOW,
      rule: 'potential-flow-transitivity'
    };
  }

  return null;
}

function getOpposingTargetPotentialDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstBaseRelationshipType = getBaseRelationshipType(getRelationshipType(firstRelationship), profile),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
      isDerivableRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-specialization-incoming'
    };
  }

  if (firstBaseRelationshipType === RELATIONSHIP_TRIGGERING &&
      isStructuralRelationshipType(secondRelationshipType, profile)) {
    return {
      type: RELATIONSHIP_TRIGGERING,
      rule: 'potential-triggering-structural-incoming',
      sourceEndpoint: 'first-source',
      targetEndpoint: 'second-source'
    };
  }

  return null;
}

function getSameSourcePotentialDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      firstBaseRelationshipType = getBaseRelationshipType(firstRelationshipType, profile),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
      isDerivableRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-specialization-source-outgoing'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) &&
      isDependencyRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-structural-dependency-outgoing'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) &&
      isDynamicRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-structural-dynamic-outgoing'
    };
  }

  return null;
}

function getFirstSourceSecondTargetPotentialDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      firstBaseRelationshipType = getBaseRelationshipType(firstRelationshipType, profile),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
      isDerivableRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-specialization-source-incoming'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) &&
      isDependencyRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'potential-structural-dependency-incoming'
    };
  }

  return null;
}

function getGroupingPotentialDerivationCandidate(firstRelationship, secondRelationship, options) {
  var profile = options.profile,
      firstBaseRelationshipType = getBaseRelationshipType(getRelationshipType(firstRelationship), profile),
      secondBaseRelationshipType = getBaseRelationshipType(getRelationshipType(secondRelationship), profile);

  if (
    firstBaseRelationshipType !== RELATIONSHIP_AGGREGATION ||
    getEndpointType(firstRelationship.source) !== OTHER_GROUPING ||
    !isRelationshipSameSource(firstRelationship, secondRelationship) ||
    GROUPING_POTENTIAL_RELATIONSHIPS.indexOf(secondBaseRelationshipType) === -1
  ) {
    return null;
  }

  if (!isRelationshipAllowed(options, firstRelationship.target, secondRelationship.target, secondBaseRelationshipType)) {
    return null;
  }

  return {
    type: secondBaseRelationshipType,
    rule: 'potential-grouping-aggregation'
  };
}

function getInLineDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      secondRelationshipType = getRelationshipType(secondRelationship),
      firstBaseRelationshipType = getBaseRelationshipType(firstRelationshipType, profile),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (
    firstBaseRelationshipType === RELATIONSHIP_SPECIALIZATION &&
    secondBaseRelationshipType === RELATIONSHIP_SPECIALIZATION
  ) {
    return {
      type: RELATIONSHIP_SPECIALIZATION,
      rule: 'specialization-transitivity'
    };
  }

  var weakestStructuralType = getWeakestStructuralRelationshipType(firstRelationshipType, secondRelationshipType, profile);

  if (weakestStructuralType) {
    return {
      type: weakestStructuralType,
      rule: 'structural-weakest'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) && isDependencyRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'structural-dependency'
    };
  }

  if (isStructuralRelationshipType(firstRelationshipType, profile) && isDynamicRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'structural-dynamic'
    };
  }

  if (
    firstBaseRelationshipType === RELATIONSHIP_TRIGGERING &&
    isStructuralRelationshipType(secondRelationshipType, profile)
  ) {
    return {
      type: RELATIONSHIP_TRIGGERING,
      rule: 'triggering-structural'
    };
  }

  if (
    firstBaseRelationshipType === RELATIONSHIP_TRIGGERING &&
    secondBaseRelationshipType === RELATIONSHIP_TRIGGERING
  ) {
    return {
      type: RELATIONSHIP_TRIGGERING,
      rule: 'triggering-transitivity'
    };
  }

  return null;
}

function getOpposingTargetDerivationCandidate(firstRelationship, secondRelationship, profile) {
  var firstRelationshipType = getRelationshipType(firstRelationship),
      secondRelationshipType = getRelationshipType(secondRelationship),
      secondBaseRelationshipType = getBaseRelationshipType(secondRelationshipType, profile);

  if (!isStructuralRelationshipType(firstRelationshipType, profile)) {
    return null;
  }

  if (isDependencyRelationshipType(secondRelationshipType, profile)) {
    return {
      type: secondBaseRelationshipType,
      rule: 'opposing-structural-dependency'
    };
  }

  if (secondBaseRelationshipType === RELATIONSHIP_FLOW) {
    return {
      type: RELATIONSHIP_FLOW,
      rule: 'opposing-structural-flow'
    };
  }

  return null;
}

function createDerivedRelationship(candidate, firstRelationship, secondRelationship, source, target) {
  return {
    type: candidate.type,
    source: source,
    target: target,
    derived: true,
    derivedFrom: [ firstRelationship.id, secondRelationship.id ].filter(Boolean),
    derivationRule: candidate.rule
  };
}

function createDerivedRelationshipIfAllowed(candidate, firstRelationship, secondRelationship, source, target, joinedEndpoint, options) {
  if (!isDerivationAllowedByRestrictions(candidate.type, source, target, joinedEndpoint, options)) {
    return null;
  }

  return createDerivedRelationship(candidate, firstRelationship, secondRelationship, source, target);
}

function createPotentialDerivedRelationship(candidate, firstRelationship, secondRelationship, source, target) {
  var derivedRelationship = createDerivedRelationship(candidate, firstRelationship, secondRelationship, source, target);

  derivedRelationship.potential = true;

  return derivedRelationship;
}

function createPotentialDerivedRelationshipIfAllowed(candidate, firstRelationship, secondRelationship, source, target, joinedEndpoint, options) {
  if (!isDerivationAllowedByRestrictions(candidate.type, source, target, joinedEndpoint, options)) {
    return null;
  }

  return createPotentialDerivedRelationship(candidate, firstRelationship, secondRelationship, source, target);
}

function isDerivationAllowedByRestrictions(relationshipType, source, target, joinedEndpoint, options) {
  if (!options.applyRestrictions || !options.profile || options.profile.version !== '4.0') {
    return true;
  }

  return isDerivationAllowedBySourceAndTargetRestrictions(relationshipType, source, target, options.profile) &&
    isDerivationAllowedByJoinedEndpointRestrictions(source, target, joinedEndpoint, options.profile);
}

function isDerivationAllowedBySourceAndTargetRestrictions(relationshipType, source, target, profile) {
  var sourceClassification = getEndpointClassification(source, profile),
      targetClassification = getEndpointClassification(target, profile),
      baseRelationshipType = getBaseRelationshipType(relationshipType, profile);

  if (!sourceClassification || !targetClassification) {
    return true;
  }

  if (sourceClassification.derivationDomain === RELATIONSHIP_DOMAIN) {
    return baseRelationshipType === RELATIONSHIP_ASSOCIATION;
  }

  if (targetClassification.derivationDomain === RELATIONSHIP_DOMAIN) {
    if (isGroupingLocationOrPlateau(sourceClassification)) {
      return [
        RELATIONSHIP_AGGREGATION,
        RELATIONSHIP_ASSOCIATION
      ].indexOf(baseRelationshipType) !== -1;
    }

    return baseRelationshipType === RELATIONSHIP_ASSOCIATION;
  }

  if (baseRelationshipType === RELATIONSHIP_INFLUENCE &&
      targetClassification.derivationDomain !== MOTIVATION_DERIVATION_DOMAIN) {
    return false;
  }

  if (baseRelationshipType === RELATIONSHIP_ACCESS && !targetClassification.isPassiveStructure) {
    return false;
  }

  if (!sourceClassification.isPassiveStructure && targetClassification.isPassiveStructure) {
    return [
      RELATIONSHIP_ACCESS,
      RELATIONSHIP_ASSIGNMENT,
      RELATIONSHIP_ASSOCIATION
    ].indexOf(baseRelationshipType) !== -1;
  }

  if (sourceClassification.isPassiveStructure && targetClassification.isPassiveStructure) {
    return [
      RELATIONSHIP_REALIZATION,
      RELATIONSHIP_ASSOCIATION
    ].indexOf(baseRelationshipType) !== -1;
  }

  if (sourceClassification.isPassiveStructure && !targetClassification.isPassiveStructure) {
    return [
      RELATIONSHIP_REALIZATION,
      RELATIONSHIP_INFLUENCE,
      RELATIONSHIP_ASSOCIATION
    ].indexOf(baseRelationshipType) !== -1;
  }

  return isDerivationAllowedByDomainRestrictions(
    sourceClassification.derivationDomain,
    targetClassification.derivationDomain,
    baseRelationshipType
  );
}

function isDerivationAllowedByDomainRestrictions(sourceDomain, targetDomain, baseRelationshipType) {
  if ([
    IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN,
    CORE_DERIVATION_DOMAIN,
    STRATEGY_DERIVATION_DOMAIN
  ].indexOf(sourceDomain) !== -1 && targetDomain === MOTIVATION_DERIVATION_DOMAIN) {
    return [
      RELATIONSHIP_ASSIGNMENT,
      RELATIONSHIP_REALIZATION,
      RELATIONSHIP_INFLUENCE,
      RELATIONSHIP_ASSOCIATION
    ].indexOf(baseRelationshipType) !== -1;
  }

  if (sourceDomain === MOTIVATION_DERIVATION_DOMAIN && [
    IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN,
    CORE_DERIVATION_DOMAIN,
    STRATEGY_DERIVATION_DOMAIN
  ].indexOf(targetDomain) !== -1) {
    return baseRelationshipType === RELATIONSHIP_ASSOCIATION;
  }

  if ([
    IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN,
    CORE_DERIVATION_DOMAIN
  ].indexOf(sourceDomain) !== -1 && targetDomain === STRATEGY_DERIVATION_DOMAIN) {
    return [
      RELATIONSHIP_REALIZATION,
      RELATIONSHIP_ASSOCIATION
    ].indexOf(baseRelationshipType) !== -1;
  }

  if (sourceDomain === STRATEGY_DERIVATION_DOMAIN && [
    IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN,
    CORE_DERIVATION_DOMAIN
  ].indexOf(targetDomain) !== -1) {
    return baseRelationshipType === RELATIONSHIP_ASSOCIATION;
  }

  if (sourceDomain === IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN &&
      targetDomain === CORE_DERIVATION_DOMAIN) {
    return [
      RELATIONSHIP_REALIZATION,
      RELATIONSHIP_ASSOCIATION
    ].indexOf(baseRelationshipType) !== -1;
  }

  if (sourceDomain === CORE_DERIVATION_DOMAIN &&
      targetDomain === IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN) {
    return [
      RELATIONSHIP_ASSIGNMENT,
      RELATIONSHIP_ASSOCIATION
    ].indexOf(baseRelationshipType) !== -1;
  }

  return true;
}

function isDerivationAllowedByJoinedEndpointRestrictions(source, target, joinedEndpoint, profile) {
  var sourceClassification = getEndpointClassification(source, profile),
      targetClassification = getEndpointClassification(target, profile),
      joinedClassification = getEndpointClassification(joinedEndpoint, profile);

  if (!sourceClassification || !targetClassification || !joinedClassification) {
    return true;
  }

  if (
    joinedClassification.derivationDomain !== sourceClassification.derivationDomain &&
    joinedClassification.derivationDomain !== targetClassification.derivationDomain &&
    !(
      sourceClassification.derivationDomain === IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN &&
      joinedClassification.derivationDomain === CORE_DERIVATION_DOMAIN &&
      [
        MOTIVATION_DERIVATION_DOMAIN,
        STRATEGY_DERIVATION_DOMAIN
      ].indexOf(targetClassification.derivationDomain) !== -1
    )
  ) {
    return false;
  }

  if (
    sourceClassification.derivationDomain === IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN &&
    [
      MOTIVATION_DERIVATION_DOMAIN,
      STRATEGY_DERIVATION_DOMAIN
    ].indexOf(targetClassification.derivationDomain) !== -1 &&
    isGroupingOrLocation(joinedClassification)
  ) {
    return false;
  }

  return true;
}

function getEndpointClassification(endpoint, profile) {
  var endpointType = getEndpointType(endpoint);

  if (!endpointType) {
    return null;
  }

  if (isRelationshipDomainType(endpointType, profile)) {
    return {
      type: endpointType,
      derivationDomain: RELATIONSHIP_DOMAIN,
      isPassiveStructure: false
    };
  }

  var baseConceptType = getBaseConceptType(endpointType, profile),
      concept = getProfileConcept(baseConceptType, profile);

  if (!concept) {
    return null;
  }

  if (isRelationshipConnectorConcept(concept)) {
    return {
      type: baseConceptType,
      derivationDomain: RELATIONSHIP_DOMAIN,
      isPassiveStructure: false
    };
  }

  return {
    type: baseConceptType,
    derivationDomain: getDerivationDomain(concept.domain),
    isPassiveStructure: PASSIVE_STRUCTURE_ASPECTS.indexOf(concept.aspect) !== -1
  };
}

function isRelationshipDomainType(endpointType, profile) {
  return RELATIONSHIP_DOMAIN_TYPES.indexOf(getBaseRelationshipType(endpointType, profile)) !== -1;
}

function isRelationshipConnectorConcept(concept) {
  return concept.paletteGroup === RELATIONSHIP_DOMAIN ||
    concept.colorGroup === RELATIONSHIP_DOMAIN ||
    concept.aspect === 'Connector';
}

function getDerivationDomain(profileDomain) {
  if (CORE_PROFILE_DOMAINS.indexOf(profileDomain) !== -1) {
    return CORE_DERIVATION_DOMAIN;
  }

  if (profileDomain === 'Implementation & Migration') {
    return IMPLEMENTATION_MIGRATION_DERIVATION_DOMAIN;
  }

  return profileDomain;
}

function isGroupingLocationOrPlateau(classification) {
  return GROUPING_LOCATION_PLATEAU_TYPES.indexOf(classification.type) !== -1;
}

function isGroupingOrLocation(classification) {
  return GROUPING_LOCATION_TYPES.indexOf(classification.type) !== -1;
}

function getDerivedFrom(relationship) {
  if (!relationship) {
    return [];
  }

  if (Array.isArray(relationship.derivedFrom) && relationship.derivedFrom.length) {
    return relationship.derivedFrom.slice();
  }

  return relationship.id ? [ relationship.id ] : [];
}

function normalizeDerivationOptions(options) {
  if (!options) {
    return {
      profile: null,
      applyRestrictions: false
    };
  }

  if (options.profile || options.isRelationshipAllowed || options.applyRestrictions !== undefined) {
    return Object.assign({
      profile: options.profile || null,
      applyRestrictions: options.applyRestrictions !== false
    }, options);
  }

  return {
    profile: options,
    applyRestrictions: true
  };
}

function normalizePotentialOptions(options) {
  var normalizedOptions = normalizeDerivationOptions(options);

  normalizedOptions.isRelationshipAllowed = normalizedOptions.isRelationshipAllowed || null;

  return normalizedOptions;
}

function getBaseRelationshipType(relationshipType, profile) {
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

function getBaseConceptType(elementType, profile) {
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

function getRelationshipType(relationship) {
  return isRelationshipObject(relationship) ? relationship.type : relationship;
}

function getProfileConcept(elementType, profile) {
  var concepts = (profile && profile.elements || []).concat(profile && profile.connectors || []);

  for (const concept of concepts) {
    if (concept.type === elementType) {
      return concept;
    }
  }

  return null;
}

function getProfileRelationship(relationshipType, profile) {
  var relationships = profile && profile.relationships || [];

  for (const relationship of relationships) {
    var relationshipDefinition = typeof relationship === 'string' ?
      { type: relationship } :
      relationship;

    if (relationshipDefinition && relationshipDefinition.type === relationshipType) {
      return relationshipDefinition;
    }
  }

  return null;
}

function isRelationshipObject(relationship) {
  return relationship && typeof relationship === 'object';
}

function isRelationshipChain(firstRelationship, secondRelationship) {
  var firstTargetId = getEndpointId(firstRelationship.target),
      secondSourceId = getEndpointId(secondRelationship.source);

  return Boolean(firstTargetId && secondSourceId && firstTargetId === secondSourceId);
}

function isRelationshipOpposingTarget(firstRelationship, secondRelationship) {
  var firstTargetId = getEndpointId(firstRelationship.target),
      secondTargetId = getEndpointId(secondRelationship.target);

  return Boolean(firstTargetId && secondTargetId && firstTargetId === secondTargetId);
}

function isRelationshipSameSource(firstRelationship, secondRelationship) {
  var firstSourceId = getEndpointId(firstRelationship.source),
      secondSourceId = getEndpointId(secondRelationship.source);

  return Boolean(firstSourceId && secondSourceId && firstSourceId === secondSourceId);
}

function isRelationshipFirstSourceSecondTarget(firstRelationship, secondRelationship) {
  var firstSourceId = getEndpointId(firstRelationship.source),
      secondTargetId = getEndpointId(secondRelationship.target);

  return Boolean(firstSourceId && secondTargetId && firstSourceId === secondTargetId);
}

function isRelationshipAllowed(options, source, target, relationshipType) {
  if (typeof options.isRelationshipAllowed !== 'function') {
    return false;
  }

  return !!options.isRelationshipAllowed(
    getEndpointType(source),
    getEndpointType(target),
    relationshipType,
    options.profile
  );
}

function getEndpointId(endpoint) {
  if (!endpoint) {
    return null;
  }

  if (endpoint.id) {
    return endpoint.id;
  }

  if (endpoint.elementRef && endpoint.elementRef.id) {
    return endpoint.elementRef.id;
  }

  if (endpoint.relationshipRef && endpoint.relationshipRef.id) {
    return endpoint.relationshipRef.id;
  }

  return null;
}

function getEndpointType(endpoint) {
  if (!endpoint) {
    return null;
  }

  if (endpoint.type) {
    return endpoint.type;
  }

  if (endpoint.elementRef && endpoint.elementRef.type) {
    return endpoint.elementRef.type;
  }

  if (endpoint.relationshipRef && endpoint.relationshipRef.type) {
    return endpoint.relationshipRef.type;
  }

  return null;
}

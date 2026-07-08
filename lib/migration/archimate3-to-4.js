import { ARCHIMATE_3_TO_4_MIGRATIONS } from '../metamodel/languages/retired-concepts.js';
import { setModelProperty } from '../util/ModelPropertyUtil.js';

const DEFAULT_INVALID_RELATIONSHIP_REPLACEMENT = 'Association';
const PATH_AGGREGATION_REPLACEMENT = 'Realization';
const SERVICE_REALIZATION_ALTERNATIVES = [ 'Specialization', 'Aggregation' ];
const MERGED_SERVICE_ORIGINAL_DOMAINS = new Set([ 'Business', 'Application', 'Technology' ]);
const TECHNOLOGY_INTERNAL_ACTIVE_STRUCTURE_TYPES = new Set([
  'Node',
  'Device',
  'SystemSoftware',
  'Equipment',
  'Facility'
]);

export const ORIGINAL_ARCHIMATE3_TYPE_PROPERTY = 'archimate-js:originalArchiMate3Type';
export const ORIGINAL_ARCHIMATE3_DOMAIN_PROPERTY = 'archimate-js:originalArchiMate3Domain';
export const SPECIALIZATION_PROPERTY = 'archimate-js:specialization';

export function migrateArchimate3ModelTo4(model, options = {}) {
  const warnings = [];
  const preserveSpecializations = options.preserveSpecializations !== false;

  const elementsNode = model && model.elementsNode;
  const elements = elementsNode && elementsNode.baseElements || [];

  for (const element of elements) {
    const migration = ARCHIMATE_3_TO_4_MIGRATIONS.get(element.type);

    if (!migration) {
      continue;
    }

    const originalType = element.type;
    element.type = migration.replacement;

    if (migration.preserveSpecialization && preserveSpecializations) {
      element.originalArchiMate3Type = originalType;
      element.specialization = originalType;
      setMigrationProperty(model, element, ORIGINAL_ARCHIMATE3_TYPE_PROPERTY, originalType);
      setMigrationProperty(model, element, SPECIALIZATION_PROPERTY, originalType);
    }

    if (migration.originalDomain && preserveSpecializations) {
      element.originalArchiMate3Domain = migration.originalDomain;
      setMigrationProperty(model, element, ORIGINAL_ARCHIMATE3_DOMAIN_PROPERTY, migration.originalDomain);
    }

    const warning = {
      elementId: element.id,
      originalType,
      replacementType: migration.replacement,
      message: migration.warning
    };

    if (migration.alternativeReplacements) {
      warning.alternativeReplacementTypes = migration.alternativeReplacements.slice();
    }

    if (migration.originalDomain) {
      warning.originalDomain = migration.originalDomain;
    }

    warnings.push(warning);
  }

  correctPathAggregationRelationships(model, warnings, options);
  warnForCrossDomainServiceRealizations(model, warnings, options);
  validateMigratedRelationships(model, warnings, options);

  return { model, warnings };
}

function correctPathAggregationRelationships(model, warnings, options) {
  if (options.replacePathAggregationRelationships === false) {
    return;
  }

  var relationshipsNode = model && model.relationshipsNode;
  var relationships = relationshipsNode && relationshipsNode.relationships || [];

  relationships.forEach(function(relationship) {
    var source = relationship.source,
        target = relationship.target,
        sourceType = getRelationshipEndpointType(source),
        targetType = getRelationshipEndpointType(target);

    if (relationship.type !== 'Aggregation' || sourceType !== 'Path') {
      return;
    }

    if (!isTechnologyInternalActiveStructureEndpoint(target, targetType)) {
      return;
    }

    relationship.type = PATH_AGGREGATION_REPLACEMENT;
    relationship.source = target;
    relationship.target = source;

    warnings.push({
      relationshipId: relationship.id,
      originalType: 'Aggregation',
      replacementType: PATH_AGGREGATION_REPLACEMENT,
      sourceType,
      targetType,
      reversed: true,
      message: 'Path Aggregation to a technology internal active structure element was migrated to reversed Realization.'
    });
  });
}

function warnForCrossDomainServiceRealizations(model, warnings, options) {
  if (options.warnServiceRealizationAlternatives === false) {
    return;
  }

  var relationshipsNode = model && model.relationshipsNode;
  var relationships = relationshipsNode && relationshipsNode.relationships || [];

  relationships.forEach(function(relationship) {
    var source = relationship.source,
        target = relationship.target,
        sourceType = getRelationshipEndpointType(source),
        targetType = getRelationshipEndpointType(target),
        sourceDomain = getOriginalArchiMate3Domain(source),
        targetDomain = getOriginalArchiMate3Domain(target);

    if (relationship.type !== 'Realization' || sourceType !== 'Service' || targetType !== 'Service') {
      return;
    }

    if (!isMergedServiceDomain(sourceDomain) || !isMergedServiceDomain(targetDomain)) {
      return;
    }

    if (sourceDomain === targetDomain) {
      return;
    }

    warnings.push({
      relationshipId: relationship.id,
      originalType: 'Realization',
      replacementType: 'Realization',
      alternativeReplacementTypes: SERVICE_REALIZATION_ALTERNATIVES.slice(),
      sourceType,
      targetType,
      sourceOriginalDomain: sourceDomain,
      targetOriginalDomain: targetDomain,
      message: 'Realization between services from different ArchiMate 3 domains is model-dependent after ArchiMate 4 migration; verify whether Specialization or Aggregation is more precise.'
    });
  });
}

function validateMigratedRelationships(model, warnings, options) {
  if (typeof options.isRelationshipAllowed !== 'function') {
    return;
  }

  var relationshipsNode = model && model.relationshipsNode;
  var relationships = relationshipsNode && relationshipsNode.relationships || [];

  relationships.forEach(function(relationship) {
    var sourceType = getRelationshipEndpointType(relationship.source);
    var targetType = getRelationshipEndpointType(relationship.target);
    var relationshipType = relationship.type;

    if (!sourceType || !targetType || !relationshipType) {
      return;
    }

    if (options.isRelationshipAllowed(sourceType, targetType, relationshipType, options.relationshipProfile)) {
      return;
    }

    var replacementType = options.invalidRelationshipReplacement || DEFAULT_INVALID_RELATIONSHIP_REPLACEMENT;
    var shouldReplace = options.replaceInvalidRelationships !== false;
    var warning = {
      relationshipId: relationship.id,
      originalType: relationshipType,
      replacementType: replacementType,
      sourceType: sourceType,
      targetType: targetType,
      message: 'Relationship ' + relationshipType + ' is not allowed after ArchiMate 4 migration; ' +
        (shouldReplace ? 'replaced with ' : 'recommended replacement is ') + replacementType + '.'
    };

    if (shouldReplace) {
      relationship.type = replacementType;
    }

    warnings.push(warning);
  });
}

function getRelationshipEndpointType(endpoint) {
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

function getOriginalArchiMate3Domain(endpoint) {
  return endpoint && endpoint.originalArchiMate3Domain || null;
}

function isMergedServiceDomain(domain) {
  return MERGED_SERVICE_ORIGINAL_DOMAINS.has(domain);
}

function isTechnologyInternalActiveStructureEndpoint(endpoint, endpointType) {
  if (TECHNOLOGY_INTERNAL_ACTIVE_STRUCTURE_TYPES.has(endpointType)) {
    return true;
  }

  return endpointType === 'Collaboration' &&
    endpoint &&
    endpoint.originalArchiMate3Domain === 'Technology';
}

function setMigrationProperty(model, element, name, value) {
  setModelProperty(model, element, name, value);
}

import { ARCHIMATE_3_TO_4_MIGRATIONS } from '../metamodel/languages/retired-concepts.js';

const ARCHIMATE_PROPERTY_DEFINITIONS = 'archimate:PropertyDefinitions';
const ARCHIMATE_PROPERTIES = 'archimate:Properties';
const ARCHIMATE_PROPERTY = 'archimate:Property';
const ARCHIMATE_PROPERTY_DEFINITION = 'archimate:PropertyDefinition';
const DEFAULT_INVALID_RELATIONSHIP_REPLACEMENT = 'Association';
const PATH_AGGREGATION_REPLACEMENT = 'Realization';
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

function isTechnologyInternalActiveStructureEndpoint(endpoint, endpointType) {
  if (TECHNOLOGY_INTERNAL_ACTIVE_STRUCTURE_TYPES.has(endpointType)) {
    return true;
  }

  return endpointType === 'Collaboration' &&
    endpoint &&
    endpoint.originalArchiMate3Domain === 'Technology';
}

function setMigrationProperty(model, element, name, value) {
  var definition = getOrCreatePropertyDefinition(model, name);
  var propertiesNode = getOrCreatePropertiesNode(model, element);
  var properties = propertiesNode.properties || [];
  var property = properties.find(function(item) {
    return item.propertyDefinitionRef === definition ||
      item.propertyDefinitionRef && item.propertyDefinitionRef.name === name;
  });

  if (!property) {
    property = createModelElement(model, ARCHIMATE_PROPERTY, {
      propertyDefinitionRef: definition
    });
    property.$parent = propertiesNode;
    properties.push(property);
    propertiesNode.properties = properties;
  }

  property.value = value;
}

function getOrCreatePropertyDefinition(model, name) {
  var definitionsNode = model.propertyDefinitionsNode;

  if (!definitionsNode) {
    definitionsNode = createModelElement(model, ARCHIMATE_PROPERTY_DEFINITIONS, {
      propertyDefinitions: []
    });
    definitionsNode.$parent = model;
    model.propertyDefinitionsNode = definitionsNode;
  }

  var definitions = definitionsNode.propertyDefinitions || [];
  var definition = definitions.find(function(item) {
    return item.name === name;
  });

  if (!definition) {
    definition = createModelElement(model, ARCHIMATE_PROPERTY_DEFINITION, {
      id: createStablePropertyDefinitionId(name),
      type: 'string',
      name: name
    });
    definition.$parent = definitionsNode;
    definitions.push(definition);
    definitionsNode.propertyDefinitions = definitions;
  }

  return definition;
}

function getOrCreatePropertiesNode(model, element) {
  var propertiesNode = element.propertiesNode;

  if (!propertiesNode) {
    propertiesNode = createModelElement(model, ARCHIMATE_PROPERTIES, {
      properties: []
    });
    propertiesNode.$parent = element;
    element.propertiesNode = propertiesNode;
  }

  return propertiesNode;
}

function createModelElement(model, type, attrs) {
  if (model && model.$model && typeof model.$model.create === 'function') {
    return model.$model.create(type, attrs);
  }

  return Object.assign({ $type: type }, attrs);
}

function createStablePropertyDefinitionId(name) {
  return 'id-' + name.replace(/[^A-Za-z0-9_.-]+/g, '-');
}

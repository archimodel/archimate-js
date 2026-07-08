import { ARCHIMATE_3_TO_4_MIGRATIONS } from '../metamodel/languages/retired-concepts.js';

const ARCHIMATE_PROPERTY_DEFINITIONS = 'archimate:PropertyDefinitions';
const ARCHIMATE_PROPERTIES = 'archimate:Properties';
const ARCHIMATE_PROPERTY = 'archimate:Property';
const ARCHIMATE_PROPERTY_DEFINITION = 'archimate:PropertyDefinition';

export const ORIGINAL_ARCHIMATE3_TYPE_PROPERTY = 'archimate-js:originalArchiMate3Type';
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

    const warning = {
      elementId: element.id,
      originalType,
      replacementType: migration.replacement,
      message: migration.warning
    };

    if (migration.alternativeReplacements) {
      warning.alternativeReplacementTypes = migration.alternativeReplacements.slice();
    }

    warnings.push(warning);
  }

  return { model, warnings };
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

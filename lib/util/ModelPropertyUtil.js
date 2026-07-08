const ARCHIMATE_PROPERTY_DEFINITIONS = 'archimate:PropertyDefinitions';
const ARCHIMATE_PROPERTIES = 'archimate:Properties';
const ARCHIMATE_PROPERTY = 'archimate:Property';
const ARCHIMATE_PROPERTY_DEFINITION = 'archimate:PropertyDefinition';

export function setModelProperty(model, element, name, value, options = {}) {
  var definition = getOrCreatePropertyDefinition(model, name, options);
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

  return property;
}

export function getModelPropertyValue(element, name) {
  var propertiesNode = element && element.propertiesNode;
  var properties = propertiesNode && propertiesNode.properties || [];
  var property = properties.find(function(item) {
    return item.propertyDefinitionRef && item.propertyDefinitionRef.name === name;
  });

  return property && property.value;
}

function getOrCreatePropertyDefinition(model, name, options) {
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
      type: options.type || 'string',
      name: name
    });
    definition.$parent = definitionsNode;
    definitions.push(definition);
    definitionsNode.propertyDefinitions = definitions;
  } else if (!definition.type && options.type) {
    definition.type = options.type;
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

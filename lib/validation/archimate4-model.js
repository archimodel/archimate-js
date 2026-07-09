import { ARCHIMATE_3_TO_4_MIGRATIONS } from '../metamodel/languages/retired-concepts.js';
import {
  createLanguageProfile,
  getBaseConceptTypeForProfile,
  getBaseRelationshipTypeForProfile,
  getLanguageProfile,
  getProfileAttributesForConcept,
  getRelationshipMapForProfile,
  hasProfileConcept,
  hasProfileRelationship,
  VIEWPOINT_CONTENT_TYPES,
  VIEWPOINT_PURPOSES
} from '../metamodel/languages/index.js';
import { canApplyRelationshipMultiplicity } from '../util/JunctionUtil.js';
import {
  isValidRelationshipMultiplicity,
  normalizeRelationshipMultiplicity
} from '../util/MultiplicityUtil.js';
import {
  getProfileAttributePropertyName,
  parseProfileAttributePropertyValue,
  PROFILE_ATTRIBUTE_PROPERTY_PREFIX
} from '../util/ProfileAttributeUtil.js';

const DEFAULT_ARCHIMATE_VALIDATION_VERSION = '4.0';
const RELATIONSHIP_CODE_TO_TYPE = {
  s: 'Specialization',
  c: 'Composition',
  g: 'Aggregation',
  i: 'Assignment',
  r: 'Realization',
  v: 'Serving',
  a: 'Access',
  n: 'Influence',
  t: 'Triggering',
  f: 'Flow',
  o: 'Association'
};
const FONT_STYLE_TOKENS = [ 'plain', 'bold', 'italic', 'underline' ];

export function validateArchimate4Model(model, options = {}) {
  return validateArchimateModel(model, Object.assign({}, options, {
    archimateVersion: '4.0'
  }));
}

export function validateArchimateModel(model, options = {}) {
  var profile = resolveValidationProfile(options);
  var elementsNode = getModelElementsNode(model);
  var relationshipsNode = getModelRelationshipsNode(model);
  var elements = getModelElements(model);
  var relationships = getModelRelationships(model);
  var viewsNode = getModelViewsNode(model);
  var viewpoints = getModelViewpoints(model);
  var views = getModelViews(model);
  var organizationsNode = getModelOrganizationsNode(model);
  var organizations = getModelOrganizations(model);
  var propertyDefinitionsNode = getModelPropertyDefinitionsNode(model);
  var propertyDefinitions = getModelPropertyDefinitions(model);
  var idObjects = getModelIdObjects(model, elements, relationships, viewpoints, views, organizations);
  var elementIndex = indexConcepts(elements, []);
  var relationshipIndex = indexConcepts([], relationships);
  var conceptIndex = indexConcepts(elements, relationships);
  var viewpointIndex = indexConcepts(viewpoints, []);
  var profileViewpointIndex = indexProfileViewpoints(profile);
  var propertyDefinitionIndex = indexPropertyDefinitions(propertyDefinitions);
  var propertyOwners = getModelPropertyOwners(model, elements, relationships, viewpoints, views, organizations);
  var diagnostics = [];

  validateIdObjectIds(idObjects, diagnostics);
  validateXsiTypeFields(elements, relationships, views, diagnostics);
  validateElementsNode(elementsNode, diagnostics);
  validateRelationshipsNode(relationshipsNode, diagnostics);

  elements.forEach(function(element) {
    validateElement(element, profile, diagnostics);
  });

  relationships.forEach(function(relationship) {
    validateRelationship(relationship, profile, conceptIndex, options, diagnostics);
  });

  validateJunctionRelationshipConsistency(relationships, profile, conceptIndex, options, diagnostics);
  validateViewsNode(viewsNode, diagnostics);
  validateViews(views, viewpointIndex, diagnostics);
  validateViewElements(views, elementIndex, relationshipIndex, profile, diagnostics);
  validateViewpointContentApplication(
    views,
    viewpointIndex,
    profileViewpointIndex,
    elementIndex,
    relationshipIndex,
    profile,
    diagnostics
  );
  validateViewpoints(viewpoints, profile, diagnostics);
  validateOrganizationsNode(organizationsNode, diagnostics);
  validateOrganizations(organizations, conceptIndex, profile, diagnostics);
  validatePropertyDefinitions(propertyDefinitionsNode, propertyDefinitions, diagnostics);
  validateBaseObjectFields(propertyOwners, diagnostics);
  validatePropertyDefinitionReferences(propertyOwners, propertyDefinitionIndex, diagnostics);
  validateProfileAttributeProperties(elements.concat(relationships), profile, propertyDefinitionIndex, diagnostics);

  return buildValidationResult(profile, diagnostics);
}

function resolveValidationProfile(options) {
  if (options.profile) {
    return options.profile;
  }

  var version = options.archimateVersion || options.version || DEFAULT_ARCHIMATE_VALIDATION_VERSION;

  if (options.customization) {
    return createLanguageProfile(version, options.customization);
  }

  return getLanguageProfile(version);
}

function validateElement(element, profile, diagnostics) {
  var type = getConceptType(element);

  if (!type) {
    addDiagnostic(diagnostics, 'error', 'missing-element-type', 'Element has no ArchiMate type.', {
      elementId: getConceptId(element)
    });
    return;
  }

  if (profile.version === '4.0' && ARCHIMATE_3_TO_4_MIGRATIONS.has(type)) {
    var migration = ARCHIMATE_3_TO_4_MIGRATIONS.get(type);

    addDiagnostic(diagnostics, 'error', 'retired-element-type', type + ' is not an ArchiMate 4 element type.', {
      elementId: getConceptId(element),
      type: type,
      replacementType: migration.replacement,
      originalDomain: migration.originalDomain || null,
      alternativeReplacementTypes: (migration.alternativeReplacements || []).slice()
    });
    return;
  }

  if (!hasProfileConcept(type, profile)) {
    addDiagnostic(diagnostics, 'error', 'unsupported-element-type', type + ' is not supported by ArchiMate ' + profile.version + '.', {
      elementId: getConceptId(element),
      type: type,
      archimateVersion: profile.version
    });
  }
}

function validateRelationship(relationship, profile, conceptIndex, options, diagnostics) {
  var relationshipId = getConceptId(relationship);
  var relationshipType = getConceptType(relationship);
  var source = resolveEndpoint(relationship.source, conceptIndex);
  var target = resolveEndpoint(relationship.target, conceptIndex);

  if (!relationshipType) {
    addDiagnostic(diagnostics, 'error', 'missing-relationship-type', 'Relationship has no ArchiMate type.', {
      relationshipId: relationshipId
    });
  } else if (!hasProfileRelationship(relationshipType, profile)) {
    addDiagnostic(diagnostics, 'error', 'unsupported-relationship-type', relationshipType + ' is not supported by ArchiMate ' + profile.version + '.', {
      relationshipId: relationshipId,
      relationshipType: relationshipType,
      archimateVersion: profile.version
    });
  }

  validateRelationshipEndpointReference('source', relationshipId, source, diagnostics);
  validateRelationshipEndpointReference('target', relationshipId, target, diagnostics);
  validateRelationshipEndpoint('source', relationshipId, source, profile, diagnostics);
  validateRelationshipEndpoint('target', relationshipId, target, profile, diagnostics);
  validateRelationshipOptionFields(relationship, relationshipId, diagnostics);
  validateRelationshipMultiplicity(relationship, relationshipId, diagnostics);

  if (options.validateRelationshipRules === false) {
    return;
  }

  if (!relationshipType || !hasProfileRelationship(relationshipType, profile) || !source.type || !target.type) {
    return;
  }

  if (!isEndpointTypeSupported(source.type, profile) || !isEndpointTypeSupported(target.type, profile)) {
    return;
  }

  var relationshipAllowed = options.isRelationshipAllowed || isRelationshipAllowedByProfile;

  if (!relationshipAllowed(source.type, target.type, relationshipType, profile)) {
    addDiagnostic(diagnostics, 'error', 'disallowed-relationship', relationshipType + ' is not allowed between ' + source.type + ' and ' + target.type + '.', {
      relationshipId: relationshipId,
      relationshipType: relationshipType,
      sourceId: source.id,
      sourceType: source.type,
      targetId: target.id,
      targetType: target.type,
      archimateVersion: profile.version
    });
  }
}

function validateRelationshipOptionFields(relationship, relationshipId, diagnostics) {
  [
    {
      key: 'modifier',
      expectedType: 'string',
      code: 'invalid-relationship-modifier',
      message: 'Relationship modifier must be a string when present.'
    },
    {
      key: 'accessType',
      expectedType: 'string',
      code: 'invalid-relationship-access-type',
      message: 'Relationship accessType must be a string when present.'
    },
    {
      key: 'isDirected',
      expectedType: 'boolean',
      code: 'invalid-relationship-is-directed',
      message: 'Relationship isDirected must be a boolean when present.'
    }
  ].forEach(function(definition) {
    if (!Object.prototype.hasOwnProperty.call(relationship, definition.key) ||
        relationship[definition.key] === undefined ||
        relationship[definition.key] === null) {
      return;
    }

    if (typeof relationship[definition.key] !== definition.expectedType) {
      addDiagnostic(diagnostics, 'error', definition.code, definition.message, {
        relationshipId: relationshipId,
        field: definition.key,
        valueType: typeof relationship[definition.key]
      });
    }
  });
}

function validateElementsNode(elementsNode, diagnostics) {
  if (elementsNode === undefined || elementsNode === null) {
    return;
  }

  if (!isObject(elementsNode)) {
    addDiagnostic(diagnostics, 'error', 'invalid-elements-node', 'Elements node must be an object.', {
      valueType: typeof elementsNode
    });
    return;
  }

  validateElementListNode(elementsNode, diagnostics);
}

function validateElementListNode(elementsNode, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(elementsNode, 'baseElements') ||
      elementsNode.baseElements === undefined ||
      elementsNode.baseElements === null) {
    return;
  }

  if (!Array.isArray(elementsNode.baseElements)) {
    addDiagnostic(diagnostics, 'error', 'invalid-element-list', 'Element entries must be an array.', {
      field: 'baseElements',
      valueType: typeof elementsNode.baseElements
    });
    return;
  }

  elementsNode.baseElements.forEach(function(element, elementIndex) {
    if (!isObject(element)) {
      addDiagnostic(diagnostics, 'error', 'invalid-element-entry', 'Element entries must be objects.', {
        elementIndex: elementIndex,
        valueType: typeof element
      });
    }
  });
}

function validateRelationshipsNode(relationshipsNode, diagnostics) {
  if (relationshipsNode === undefined || relationshipsNode === null) {
    return;
  }

  if (!isObject(relationshipsNode)) {
    addDiagnostic(diagnostics, 'error', 'invalid-relationships-node', 'Relationships node must be an object.', {
      valueType: typeof relationshipsNode
    });
    return;
  }

  validateRelationshipListNode(relationshipsNode, diagnostics);
}

function validateRelationshipListNode(relationshipsNode, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(relationshipsNode, 'relationships') ||
      relationshipsNode.relationships === undefined ||
      relationshipsNode.relationships === null) {
    return;
  }

  if (!Array.isArray(relationshipsNode.relationships)) {
    addDiagnostic(diagnostics, 'error', 'invalid-relationship-list', 'Relationship entries must be an array.', {
      field: 'relationships',
      valueType: typeof relationshipsNode.relationships
    });
    return;
  }

  relationshipsNode.relationships.forEach(function(relationship, relationshipIndex) {
    if (!isObject(relationship)) {
      addDiagnostic(diagnostics, 'error', 'invalid-relationship-entry', 'Relationship entries must be objects.', {
        relationshipIndex: relationshipIndex,
        valueType: typeof relationship
      });
    }
  });
}

function validateRelationshipEndpoint(role, relationshipId, endpoint, profile, diagnostics) {
  if (endpoint.invalidReference || endpoint.unknownReference) {
    return;
  }

  if (!endpoint.type) {
    addDiagnostic(diagnostics, 'error', 'missing-relationship-endpoint', 'Relationship is missing a ' + role + ' endpoint type.', {
      relationshipId: relationshipId,
      endpoint: role,
      endpointId: endpoint.id || null
    });
    return;
  }

  if (!isEndpointTypeSupported(endpoint.type, profile)) {
    addDiagnostic(diagnostics, 'error', 'unsupported-relationship-endpoint-type', endpoint.type + ' is not a supported ArchiMate ' + profile.version + ' relationship endpoint.', {
      relationshipId: relationshipId,
      endpoint: role,
      endpointId: endpoint.id,
      endpointType: endpoint.type,
      archimateVersion: profile.version
    });
  }
}

function validateRelationshipEndpointReference(role, relationshipId, endpoint, diagnostics) {
  if (endpoint.invalidReference) {
    addDiagnostic(diagnostics, 'error', 'invalid-relationship-' + role + '-reference', 'Relationship ' + role + ' must identify a model concept.', {
      relationshipId: relationshipId,
      endpoint: role,
      valueType: endpoint.valueType
    });
    return;
  }

  if (endpoint.unknownReference) {
    addDiagnostic(diagnostics, 'error', 'unknown-relationship-' + role + '-reference', 'Relationship ' + role + ' points to an unknown model concept.', {
      relationshipId: relationshipId,
      endpoint: role,
      referenceId: endpoint.id
    });
  }
}

function validateRelationshipMultiplicity(relationship, relationshipId, diagnostics) {
  [
    {
      key: 'sourceMultiplicity',
      role: 'source',
      invalidCode: 'invalid-source-multiplicity',
      junctionCode: 'source-junction-multiplicity'
    },
    {
      key: 'targetMultiplicity',
      role: 'target',
      invalidCode: 'invalid-target-multiplicity',
      junctionCode: 'target-junction-multiplicity'
    }
  ].forEach(function(definition) {
    var value = relationship[definition.key];

    if (value === undefined || value === null || String(value).trim() === '') {
      return;
    }

    if (!isValidRelationshipMultiplicity(value)) {
      addDiagnostic(diagnostics, 'error', definition.invalidCode, value + ' is not a supported ArchiMate 4 relationship multiplicity notation.', {
        relationshipId: relationshipId,
        endpoint: definition.role,
        value: value
      });
    }

    if (!canApplyRelationshipMultiplicity(relationship)) {
      addDiagnostic(diagnostics, 'error', definition.junctionCode, 'Multiplicity cannot be applied to a relationship end connected to a junction.', {
        relationshipId: relationshipId,
        endpoint: definition.role,
        value: normalizeRelationshipMultiplicity(value) || String(value)
      });
    }
  });
}

function validateJunctionRelationshipConsistency(relationships, profile, conceptIndex, options, diagnostics) {
  var relationshipAllowed = options.isRelationshipAllowed || isRelationshipAllowedByProfile;
  var junctions = collectJunctionRelationshipGroups(relationships, conceptIndex);

  Object.keys(junctions).forEach(function(junctionId) {
    var group = junctions[junctionId];
    var types = unique(group.relationships.map(function(relationship) {
      return getConceptType(relationship);
    }).filter(Boolean));

    if (types.length > 1) {
      addDiagnostic(diagnostics, 'error', 'mixed-junction-relationship-types', 'A junction connects relationships of more than one type.', {
        junctionId: junctionId,
        junctionType: group.junctionType,
        relationshipTypes: types,
        relationshipIds: group.relationships.map(getConceptId)
      });
    }

    if (options.validateRelationshipRules === false || types.length !== 1) {
      return;
    }

    group.incoming.forEach(function(incoming) {
      group.outgoing.forEach(function(outgoing) {
        var relationshipType = getConceptType(incoming);
        var source = resolveEndpoint(incoming.source, conceptIndex);
        var target = resolveEndpoint(outgoing.target, conceptIndex);

        if (!relationshipType || !source.type || !target.type) {
          return;
        }

        if (!isEndpointTypeSupported(source.type, profile) || !isEndpointTypeSupported(target.type, profile)) {
          return;
        }

        if (!relationshipAllowed(source.type, target.type, relationshipType, profile)) {
          addDiagnostic(diagnostics, 'error', 'disallowed-junction-chain', 'A relationship chain through a junction is not allowed as a direct relationship.', {
            junctionId: junctionId,
            junctionType: group.junctionType,
            sourceRelationshipId: getConceptId(incoming),
            targetRelationshipId: getConceptId(outgoing),
            relationshipType: relationshipType,
            sourceType: source.type,
            targetType: target.type
          });
        }
      });
    });
  });
}

function collectJunctionRelationshipGroups(relationships, conceptIndex) {
  var junctions = {};

  relationships.forEach(function(relationship) {
    var source = resolveEndpoint(relationship.source, conceptIndex);
    var target = resolveEndpoint(relationship.target, conceptIndex);

    addJunctionRelationship(junctions, source, relationship, 'outgoing');
    addJunctionRelationship(junctions, target, relationship, 'incoming');
  });

  return junctions;
}

function validateViews(views, viewpointIndex, diagnostics) {
  views.forEach(function(view) {
    validateViewpointAttribute(view, diagnostics);
    validateViewpointReference(view, viewpointIndex, diagnostics);
  });
}

function validateViewsNode(viewsNode, diagnostics) {
  if (viewsNode === undefined || viewsNode === null) {
    return;
  }

  if (!isObject(viewsNode)) {
    addDiagnostic(diagnostics, 'error', 'invalid-views-node', 'Views node must be an object.', {
      valueType: typeof viewsNode
    });
    return;
  }

  var diagramsNode = getModelDiagramsNode(viewsNode);

  if (diagramsNode !== undefined && diagramsNode !== null && !isObject(diagramsNode)) {
    addDiagnostic(diagnostics, 'error', 'invalid-diagrams-node', 'Diagrams node must be an object.', {
      valueType: typeof diagramsNode
    });
    return;
  }

  if (diagramsNode) {
    validateViewListNode(diagramsNode, 'diagrams', diagnostics);
  }

  validateViewListNode(viewsNode, 'views', diagnostics);
}

function validateViewListNode(owner, ownerKind, diagnostics) {
  var views = null;
  var listField = null;

  if (Object.prototype.hasOwnProperty.call(owner, 'viewsList')) {
    views = owner.viewsList;
    listField = 'viewsList';
  } else if (Object.prototype.hasOwnProperty.call(owner, 'views')) {
    views = owner.views;
    listField = 'views';
  }

  if (views === null || views === undefined) {
    return;
  }

  if (!Array.isArray(views)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-list', 'View entries must be an array.', {
      ownerKind: ownerKind,
      field: listField,
      valueType: typeof views
    });
    return;
  }

  views.forEach(function(view, viewIndex) {
    validateViewTreeEntry(view, viewIndex, diagnostics);
  });
}

function validateViewTreeEntry(view, viewIndex, diagnostics) {
  if (!isObject(view)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-entry', 'View entries must be objects.', {
      viewIndex: viewIndex,
      valueType: typeof view
    });
    return;
  }

  validateViewElementList(view, view.viewElements, 'viewElements', diagnostics);
}

function validateViewElementList(view, viewElements, field, diagnostics) {
  if (viewElements === undefined || viewElements === null) {
    return;
  }

  var viewId = getConceptId(view);

  if (!Array.isArray(viewElements)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-element-list', 'View elements must be an array.', {
      viewId: viewId,
      field: field,
      valueType: typeof viewElements
    });
    return;
  }

  viewElements.forEach(function(viewElement, viewElementIndex) {
    validateViewElementTreeEntry(viewId, viewElement, viewElementIndex, diagnostics);
  });
}

function validateViewElementTreeEntry(viewId, viewElement, viewElementIndex, diagnostics) {
  if (!isObject(viewElement)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-element-entry', 'View element entries must be objects.', {
      viewId: viewId,
      viewElementIndex: viewElementIndex,
      valueType: typeof viewElement
    });
    return;
  }

  validateNestedViewNodeList(viewId, viewElement, diagnostics);
}

function validateNestedViewNodeList(viewId, viewElement, diagnostics) {
  if (viewElement.nodes === undefined || viewElement.nodes === null) {
    return;
  }

  var viewElementId = getViewElementId(viewElement);

  if (!Array.isArray(viewElement.nodes)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-node-list', 'Nested view node entries must be an array.', {
      viewId: viewId,
      viewElementId: viewElementId,
      field: 'nodes',
      valueType: typeof viewElement.nodes
    });
    return;
  }

  viewElement.nodes.forEach(function(node, nodeIndex) {
    if (!isObject(node)) {
      addDiagnostic(diagnostics, 'error', 'invalid-view-node-entry', 'Nested view node entries must be objects.', {
        viewId: viewId,
        viewElementId: viewElementId,
        nodeIndex: nodeIndex,
        valueType: typeof node
      });
      return;
    }

    validateNestedViewNodeList(viewId, node, diagnostics);
  });
}

function validateViewElements(views, elementIndex, relationshipIndex, profile, diagnostics) {
  views.forEach(function(view) {
    var viewElements = collectViewElements(view);
    var viewElementIndex = indexViewElements(viewElements);

    viewElements.forEach(function(viewElement) {
      validateViewElementLabel(viewElement, diagnostics);
      validateViewElementReference(viewElement, elementIndex, relationshipIndex, profile, diagnostics);
      validateViewRelationshipReference(viewElement, elementIndex, relationshipIndex, profile, diagnostics);
      validateViewConnectionEndpointReference(viewElement, viewElementIndex, relationshipIndex, diagnostics);
      validateViewNodeGeometry(viewElement, diagnostics);
      validateViewConnectionWaypointGeometry(viewElement, diagnostics);
      validateViewElementStyle(viewElement, diagnostics);
    });
  });
}

function validateViewpointContentApplication(
    views,
    viewpointIndex,
    profileViewpointIndex,
    elementIndex,
    relationshipIndex,
    profile,
    diagnostics) {

  views.forEach(function(view) {
    var viewpoint = getViewpointForView(view, viewpointIndex, profileViewpointIndex);

    if (!viewpoint) {
      return;
    }

    var allowedElementTypes = getViewpointAllowedTypeSet(viewpoint, 'allowedElementTypes');
    var allowedRelationshipTypes = getViewpointAllowedTypeSet(viewpoint, 'allowedRelationshipTypes');

    if (!allowedElementTypes && !allowedRelationshipTypes) {
      return;
    }

    collectViewElements(view).forEach(function(viewElement) {
      validateViewpointElementTypeApplication(
        view,
        viewpoint,
        viewElement,
        elementIndex,
        allowedElementTypes,
        profile,
        diagnostics
      );
      validateViewpointRelationshipTypeApplication(
        view,
        viewpoint,
        viewElement,
        relationshipIndex,
        allowedRelationshipTypes,
        profile,
        diagnostics
      );
    });
  });
}

function validateViewpointElementTypeApplication(
    view,
    viewpoint,
    viewElement,
    elementIndex,
    allowedElementTypes,
    profile,
    diagnostics) {

  if (!allowedElementTypes ||
      !Object.prototype.hasOwnProperty.call(viewElement, 'elementRef') ||
      viewElement.elementRef === undefined ||
      viewElement.elementRef === null ||
      viewElement.elementRef === '') {
    return;
  }

  var elementRefId = getReferenceId(viewElement.elementRef);
  var element = elementRefId && elementIndex.get(elementRefId);

  if (!element) {
    return;
  }

  var elementType = getConceptType(element) || getConceptType(viewElement.elementRef);

  if (!elementType || !hasProfileConcept(elementType, profile)) {
    return;
  }

  var baseElementType = getBaseConceptTypeForProfile(elementType, profile);

  if (allowedElementTypes.has(elementType) || allowedElementTypes.has(baseElementType)) {
    return;
  }

  addDiagnostic(diagnostics, 'error', 'view-node-outside-viewpoint-element-types', 'View node elementRef type is not allowed by its viewpoint.', {
    viewId: getConceptId(view),
    viewpointId: getConceptId(viewpoint),
    viewElementId: getViewElementId(viewElement),
    elementRefId: elementRefId,
    elementType: elementType,
    baseElementType: baseElementType,
    allowedElementTypes: Array.from(allowedElementTypes)
  });
}

function validateViewpointRelationshipTypeApplication(
    view,
    viewpoint,
    viewElement,
    relationshipIndex,
    allowedRelationshipTypes,
    profile,
    diagnostics) {

  if (!allowedRelationshipTypes ||
      !Object.prototype.hasOwnProperty.call(viewElement, 'relationshipRef') ||
      viewElement.relationshipRef === undefined ||
      viewElement.relationshipRef === null ||
      viewElement.relationshipRef === '') {
    return;
  }

  var relationshipRefId = getReferenceId(viewElement.relationshipRef);
  var relationship = relationshipRefId && relationshipIndex.get(relationshipRefId);

  if (!relationship) {
    return;
  }

  var relationshipType = getConceptType(relationship) || getConceptType(viewElement.relationshipRef);

  if (!relationshipType || !hasProfileRelationship(relationshipType, profile)) {
    return;
  }

  var baseRelationshipType = getBaseRelationshipTypeForProfile(relationshipType, profile);

  if (allowedRelationshipTypes.has(relationshipType) || allowedRelationshipTypes.has(baseRelationshipType)) {
    return;
  }

  addDiagnostic(diagnostics, 'error', 'view-connection-outside-viewpoint-relationship-types', 'View connection relationshipRef type is not allowed by its viewpoint.', {
    viewId: getConceptId(view),
    viewpointId: getConceptId(viewpoint),
    viewElementId: getViewElementId(viewElement),
    relationshipRefId: relationshipRefId,
    relationshipType: relationshipType,
    baseRelationshipType: baseRelationshipType,
    allowedRelationshipTypes: Array.from(allowedRelationshipTypes)
  });
}

function getViewpointForView(view, viewpointIndex, profileViewpointIndex) {
  if (!view) {
    return null;
  }

  if (view.viewpointRef !== undefined && view.viewpointRef !== null && view.viewpointRef !== '') {
    var viewpointRefId = getReferenceId(view.viewpointRef);

    return viewpointRefId && viewpointIndex.get(viewpointRefId) || null;
  }

  if (typeof view.viewpoint === 'string' && view.viewpoint) {
    return profileViewpointIndex.get(view.viewpoint) || null;
  }

  return null;
}

function getViewpointAllowedTypeSet(viewpoint, fieldName) {
  var types = getViewpointAllowedTypes(viewpoint && viewpoint[fieldName]);

  if (!types.length) {
    return null;
  }

  return new Set(types);
}

function getViewpointAllowedTypes(value) {
  if (!value) {
    return [];
  }

  if (!Array.isArray(value)) {
    return splitTypeTokens(value);
  }

  return value.reduce(function(types, entry) {
    if (typeof entry === 'string') {
      return types.concat(splitTypeTokens(entry));
    }

    if (entry && typeof entry.type === 'string') {
      return types.concat(splitTypeTokens(entry.type));
    }

    return types;
  }, []);
}

function splitTypeTokens(value) {
  return String(value).split(/\s+/).filter(Boolean);
}

function collectViewElements(view) {
  var result = [];
  var visited = new Set();

  function visitList(viewElements) {
    if (!Array.isArray(viewElements)) {
      return;
    }

    viewElements.forEach(visit);
  }

  function visit(viewElement) {
    if (!isObject(viewElement) || visited.has(viewElement)) {
      return;
    }

    visited.add(viewElement);
    result.push(viewElement);
    visitList(viewElement.nodes);
    visitList(viewElement.viewElements);
  }

  if (view) {
    visitList(view.viewElements);
    visitList(view.nodes);
  }

  return result;
}

function indexViewElements(viewElements) {
  var index = new Map();

  viewElements.forEach(function(viewElement) {
    var id = getViewElementId(viewElement);

    if (id && !index.has(id)) {
      index.set(id, viewElement);
    }
  });

  return index;
}

function validateIdObjectIds(idObjects, diagnostics) {
  idObjects.forEach(function(entry) {
    var idObject = entry.idObject;

    if (!Object.prototype.hasOwnProperty.call(idObject, 'id') ||
        idObject.id === undefined ||
        idObject.id === null) {
      return;
    }

    if (typeof idObject.id !== 'string' || idObject.id.length === 0) {
      addDiagnostic(diagnostics, 'error', 'invalid-id-object-id', 'IdObject id must be a non-empty string when present.', {
        ownerKind: entry.ownerKind,
        ownerType: getPropertyOwnerType(idObject),
        field: 'id',
        valueType: typeof idObject.id
      });
    }
  });
}

function validateXsiTypeFields(elements, relationships, views, diagnostics) {
  (elements || []).forEach(function(element) {
    validateConceptXsiTypeField(element, 'element', diagnostics);
  });

  (relationships || []).forEach(function(relationship) {
    validateConceptXsiTypeField(relationship, 'relationship', diagnostics);
  });

  getModelViewElements(views).forEach(function(viewElement) {
    validateOptionalStringField(viewElement && viewElement['xsi:type'], 'invalid-view-element-xsi-type', {
      viewElementId: getViewElementId(viewElement),
      field: 'xsi:type',
      valueType: typeof (viewElement && viewElement['xsi:type'])
    }, diagnostics);
  });
}

function validateConceptXsiTypeField(concept, ownerKind, diagnostics) {
  validateOptionalStringField(concept && concept['xsi:type'], 'invalid-concept-xsi-type', {
    conceptId: getConceptId(concept),
    ownerKind: ownerKind,
    field: 'xsi:type',
    valueType: typeof (concept && concept['xsi:type'])
  }, diagnostics);
}

function validateViewElementLabel(viewElement, diagnostics) {
  validateOptionalStringField(viewElement.label, 'invalid-view-element-label', {
    viewElementId: getViewElementId(viewElement),
    field: 'label',
    value: viewElement.label
  }, diagnostics);
}

function validateViewElementReference(viewElement, elementIndex, relationshipIndex, profile, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(viewElement, 'elementRef') ||
      viewElement.elementRef === undefined ||
      viewElement.elementRef === null ||
      viewElement.elementRef === '') {
    return;
  }

  var viewElementId = getViewElementId(viewElement);
  var elementRefId = getReferenceId(viewElement.elementRef);

  if (!elementRefId) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-element-reference', 'View node elementRef must identify a model element.', {
      viewElementId: viewElementId
    });
    return;
  }

  var element = elementIndex.get(elementRefId);

  if (element) {
    var elementType = getConceptType(element) || getConceptType(viewElement.elementRef);

    if (elementType && !hasProfileConcept(elementType, profile)) {
      addDiagnostic(diagnostics, 'error', 'unsupported-view-element-reference-type', 'View node elementRef points to a concept type that is not supported by this ArchiMate profile.', {
        viewElementId: viewElementId,
        elementRefId: elementRefId,
        elementType: elementType,
        referencedConceptKind: 'element',
        archimateVersion: profile.version
      });
    }

    return;
  }

  var relationship = relationshipIndex.get(elementRefId);

  if (relationship) {
    addDiagnostic(diagnostics, 'error', 'unsupported-view-element-reference-type', 'View node elementRef points to a relationship instead of an element.', {
      viewElementId: viewElementId,
      elementRefId: elementRefId,
      elementType: getConceptType(relationship),
      referencedConceptKind: 'relationship',
      archimateVersion: profile.version
    });
    return;
  }

  addDiagnostic(diagnostics, 'error', 'unknown-view-element-reference', 'View node elementRef points to an unknown model element.', {
    viewElementId: viewElementId,
    elementRefId: elementRefId
  });
}

function validateViewRelationshipReference(viewElement, elementIndex, relationshipIndex, profile, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(viewElement, 'relationshipRef') ||
      viewElement.relationshipRef === undefined ||
      viewElement.relationshipRef === null ||
      viewElement.relationshipRef === '') {
    return;
  }

  var viewElementId = getViewElementId(viewElement);
  var relationshipRefId = getReferenceId(viewElement.relationshipRef);

  if (!relationshipRefId) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-relationship-reference', 'View connection relationshipRef must identify a model relationship.', {
      viewElementId: viewElementId
    });
    return;
  }

  var relationship = relationshipIndex.get(relationshipRefId);

  if (relationship) {
    var relationshipType = getConceptType(relationship) || getConceptType(viewElement.relationshipRef);

    if (relationshipType && !hasProfileRelationship(relationshipType, profile)) {
      addDiagnostic(diagnostics, 'error', 'unsupported-view-relationship-reference-type', 'View connection relationshipRef points to a relationship type that is not supported by this ArchiMate profile.', {
        viewElementId: viewElementId,
        relationshipRefId: relationshipRefId,
        relationshipType: relationshipType,
        referencedConceptKind: 'relationship',
        archimateVersion: profile.version
      });
    }

    return;
  }

  var element = elementIndex.get(relationshipRefId);

  if (element) {
    addDiagnostic(diagnostics, 'error', 'unsupported-view-relationship-reference-type', 'View connection relationshipRef points to an element instead of a relationship.', {
      viewElementId: viewElementId,
      relationshipRefId: relationshipRefId,
      relationshipType: getConceptType(element),
      referencedConceptKind: 'element',
      archimateVersion: profile.version
    });
    return;
  }

  addDiagnostic(diagnostics, 'error', 'unknown-view-relationship-reference', 'View connection relationshipRef points to an unknown model relationship.', {
    viewElementId: viewElementId,
    relationshipRefId: relationshipRefId
  });
}

function validateViewConnectionEndpointReference(viewElement, viewElementIndex, relationshipIndex, diagnostics) {
  var sourceEndpoint = validateViewConnectionEndpointRole(viewElement, viewElementIndex, 'source', {
    invalidCode: 'invalid-view-connection-source-reference',
    unknownCode: 'unknown-view-connection-source-reference'
  }, diagnostics);
  var targetEndpoint = validateViewConnectionEndpointRole(viewElement, viewElementIndex, 'target', {
    invalidCode: 'invalid-view-connection-target-reference',
    unknownCode: 'unknown-view-connection-target-reference'
  }, diagnostics);

  validateViewConnectionEndpointAlignment(viewElement, sourceEndpoint, targetEndpoint, relationshipIndex, diagnostics);
}

function validateViewConnectionEndpointRole(viewElement, viewElementIndex, role, codes, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(viewElement, role) ||
      viewElement[role] === undefined ||
      viewElement[role] === null ||
      viewElement[role] === '') {
    return null;
  }

  var viewElementId = getViewElementId(viewElement);
  var referenceId = getReferenceId(viewElement[role]);

  if (!referenceId) {
    addDiagnostic(diagnostics, 'error', codes.invalidCode, 'View connection ' + role + ' must identify a view element.', {
      viewElementId: viewElementId,
      endpoint: role
    });
    return null;
  }

  var endpointViewElement = viewElementIndex.get(referenceId);

  if (!endpointViewElement) {
    addDiagnostic(diagnostics, 'error', codes.unknownCode, 'View connection ' + role + ' points to an unknown view element.', {
      viewElementId: viewElementId,
      endpoint: role,
      referenceId: referenceId
    });
    return null;
  }

  return {
    referenceId: referenceId,
    viewElement: endpointViewElement
  };
}

function validateViewConnectionEndpointAlignment(viewElement, sourceEndpoint, targetEndpoint, relationshipIndex, diagnostics) {
  var relationshipRefId = getReferenceId(viewElement.relationshipRef);

  if (!relationshipRefId) {
    return;
  }

  var relationship = relationshipIndex.get(relationshipRefId);

  if (!relationship) {
    return;
  }

  validateViewConnectionEndpointConceptAlignment(viewElement, relationshipRefId, relationship, sourceEndpoint, 'source', 'view-connection-source-concept-mismatch', diagnostics);
  validateViewConnectionEndpointConceptAlignment(viewElement, relationshipRefId, relationship, targetEndpoint, 'target', 'view-connection-target-concept-mismatch', diagnostics);
}

function validateViewConnectionEndpointConceptAlignment(viewElement, relationshipRefId, relationship, endpoint, role, code, diagnostics) {
  if (!endpoint || !endpoint.viewElement) {
    return;
  }

  var expectedConceptId = getReferenceId(relationship[role]);
  var actualConceptId = getViewElementConceptReferenceId(endpoint.viewElement);

  if (!expectedConceptId || !actualConceptId || expectedConceptId === actualConceptId) {
    return;
  }

  addDiagnostic(diagnostics, 'error', code, 'View connection ' + role + ' does not match the referenced relationship ' + role + ' concept.', {
    viewElementId: getViewElementId(viewElement),
    relationshipRefId: relationshipRefId,
    endpoint: role,
    endpointViewElementId: endpoint.referenceId,
    expectedConceptId: expectedConceptId,
    actualConceptId: actualConceptId
  });
}

function validateViewNodeGeometry(viewElement, diagnostics) {
  [
    {
      field: 'x',
      code: 'invalid-view-node-x',
      positive: false,
      message: 'View node x must be a finite non-negative number.'
    },
    {
      field: 'y',
      code: 'invalid-view-node-y',
      positive: false,
      message: 'View node y must be a finite non-negative number.'
    },
    {
      field: 'w',
      code: 'invalid-view-node-width',
      positive: true,
      message: 'View node width must be a finite positive number.'
    },
    {
      field: 'h',
      code: 'invalid-view-node-height',
      positive: true,
      message: 'View node height must be a finite positive number.'
    }
  ].forEach(function(definition) {
    if (!Object.prototype.hasOwnProperty.call(viewElement, definition.field) ||
        viewElement[definition.field] === undefined ||
        viewElement[definition.field] === null) {
      return;
    }

    var value = viewElement[definition.field];

    if (!isValidDiagramNumber(value, definition.positive)) {
      addDiagnostic(diagnostics, 'error', definition.code, definition.message, {
        viewElementId: getViewElementId(viewElement),
        field: definition.field,
        value: value
      });
    }
  });
}

function validateViewConnectionWaypointGeometry(viewElement, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(viewElement, 'waypointsNode') ||
      viewElement.waypointsNode === undefined ||
      viewElement.waypointsNode === null) {
    return;
  }

  var viewElementId = getViewElementId(viewElement);
  var waypointsNode = viewElement.waypointsNode;

  if (!isObject(waypointsNode)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-connection-waypoints-node', 'View connection waypointsNode must be an object.', {
      viewElementId: viewElementId
    });
    return;
  }

  if (waypointsNode.waypoints === undefined || waypointsNode.waypoints === null) {
    return;
  }

  if (!Array.isArray(waypointsNode.waypoints)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-connection-waypoint-list', 'View connection waypoints must be an array.', {
      viewElementId: viewElementId
    });
    return;
  }

  waypointsNode.waypoints.forEach(function(waypoint, waypointIndex) {
    if (!isObject(waypoint)) {
      addDiagnostic(diagnostics, 'error', 'invalid-view-connection-waypoint-entry', 'View connection waypoint entries must be objects.', {
        viewElementId: viewElementId,
        waypointIndex: waypointIndex
      });
      return;
    }

    validateViewConnectionWaypointPoint(viewElementId, waypointIndex, 'waypoint', waypoint, diagnostics);

    if (!Object.prototype.hasOwnProperty.call(waypoint, 'original') ||
        waypoint.original === undefined ||
        waypoint.original === null) {
      return;
    }

    if (!isObject(waypoint.original)) {
      addDiagnostic(diagnostics, 'error', 'invalid-view-connection-waypoint-original', 'View connection waypoint original point must be an object.', {
        viewElementId: viewElementId,
        waypointIndex: waypointIndex
      });
      return;
    }

    validateViewConnectionWaypointPoint(viewElementId, waypointIndex, 'original', waypoint.original, diagnostics);
  });
}

function validateViewConnectionWaypointPoint(viewElementId, waypointIndex, pointRole, point, diagnostics) {
  [
    {
      field: 'x',
      code: 'invalid-view-connection-waypoint-x',
      message: 'View connection waypoint x must be a finite non-negative integer.'
    },
    {
      field: 'y',
      code: 'invalid-view-connection-waypoint-y',
      message: 'View connection waypoint y must be a finite non-negative integer.'
    }
  ].forEach(function(definition) {
    var value = point[definition.field];

    if (!isValidDiagramInteger(value)) {
      addDiagnostic(diagnostics, 'error', definition.code, definition.message, {
        viewElementId: viewElementId,
        waypointIndex: waypointIndex,
        pointRole: pointRole,
        field: definition.field,
        value: value
      });
    }
  });
}

function validateViewElementStyle(viewElement, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(viewElement, 'style') ||
      viewElement.style === undefined ||
      viewElement.style === null) {
    return;
  }

  var viewElementId = getViewElementId(viewElement);
  var style = viewElement.style;

  if (!isObject(style)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-style', 'View element style must be an object.', {
      viewElementId: viewElementId
    });
    return;
  }

  if (Object.prototype.hasOwnProperty.call(style, 'lineWidth') &&
      style.lineWidth !== undefined &&
      style.lineWidth !== null &&
      !isValidPositiveInteger(style.lineWidth)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-style-line-width', 'View element style lineWidth must be a positive integer.', {
      viewElementId: viewElementId,
      stylePath: 'style.lineWidth',
      value: style.lineWidth
    });
  }

  if (Object.prototype.hasOwnProperty.call(style, 'textAlign') &&
      style.textAlign !== undefined &&
      style.textAlign !== null &&
      typeof style.textAlign !== 'string') {
    addDiagnostic(diagnostics, 'error', 'invalid-view-style-text-align', 'View element style textAlign must be a string.', {
      viewElementId: viewElementId,
      stylePath: 'style.textAlign',
      value: style.textAlign
    });
  }

  validateViewStyleColor(viewElementId, style, 'fillColor', 'invalid-view-style-fill-color', diagnostics);
  validateViewStyleColor(viewElementId, style, 'lineColor', 'invalid-view-style-line-color', diagnostics);
  validateViewStyleFont(viewElementId, style, diagnostics);
}

function validateViewStyleFont(viewElementId, style, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(style, 'font') ||
      style.font === undefined ||
      style.font === null) {
    return;
  }

  var font = style.font;

  if (!isObject(font)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-style-font', 'View element style font must be an object.', {
      viewElementId: viewElementId,
      stylePath: 'style.font'
    });
    return;
  }

  if (Object.prototype.hasOwnProperty.call(font, 'name') &&
      font.name !== undefined &&
      font.name !== null &&
      typeof font.name !== 'string') {
    addDiagnostic(diagnostics, 'error', 'invalid-view-style-font-name', 'View element style font name must be a string.', {
      viewElementId: viewElementId,
      stylePath: 'style.font.name',
      value: font.name
    });
  }

  if (Object.prototype.hasOwnProperty.call(font, 'size') &&
      font.size !== undefined &&
      font.size !== null &&
      !isValidPositiveHalfStepNumber(font.size)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-style-font-size', 'View element style font size must be a whole or half-point value of at least 1.', {
      viewElementId: viewElementId,
      stylePath: 'style.font.size',
      value: font.size
    });
  }

  var fontStyleTokens = getTokenList(font.style);

  fontStyleTokens.forEach(function(token) {
    if (FONT_STYLE_TOKENS.indexOf(token) === -1) {
      addDiagnostic(diagnostics, 'error', 'invalid-view-style-font-style', 'View element style font style contains an unsupported token.', {
        viewElementId: viewElementId,
        stylePath: 'style.font.style',
        value: token
      });
    }
  });

  if (fontStyleTokens.indexOf('plain') !== -1 && fontStyleTokens.length > 1) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-style-font-plain-combination', 'View element style font plain cannot be combined with other font style tokens.', {
      viewElementId: viewElementId,
      stylePath: 'style.font.style',
      values: fontStyleTokens
    });
  }

  validateViewStyleColor(viewElementId, font, 'color', 'invalid-view-style-font-color', diagnostics, 'style.font');
}

function validateViewStyleColor(viewElementId, owner, field, invalidObjectCode, diagnostics, ownerPath) {
  if (!Object.prototype.hasOwnProperty.call(owner, field) ||
      owner[field] === undefined ||
      owner[field] === null) {
    return;
  }

  var color = owner[field];
  var colorPath = (ownerPath || 'style') + '.' + field;

  if (!isObject(color)) {
    addDiagnostic(diagnostics, 'error', invalidObjectCode, 'View element style color must be an object.', {
      viewElementId: viewElementId,
      stylePath: colorPath
    });
    return;
  }

  [ 'r', 'g', 'b' ].forEach(function(channel) {
    var channelPath = colorPath + '.' + channel;

    if (!Object.prototype.hasOwnProperty.call(color, channel) ||
        color[channel] === undefined ||
        color[channel] === null) {
      addDiagnostic(diagnostics, 'error', 'missing-view-style-color-channel', 'View element style color must define r, g, and b channels.', {
        viewElementId: viewElementId,
        stylePath: channelPath,
        channel: channel
      });
      return;
    }

    if (!isValidIntegerInRange(color[channel], 0, 255)) {
      addDiagnostic(diagnostics, 'error', 'invalid-view-style-color-channel', 'View element style color channels must be integers from 0 to 255.', {
        viewElementId: viewElementId,
        stylePath: channelPath,
        channel: channel,
        value: color[channel]
      });
    }
  });

  if (Object.prototype.hasOwnProperty.call(color, 'a') &&
      color.a !== undefined &&
      color.a !== null &&
      !isValidIntegerInRange(color.a, 0, 100)) {
    addDiagnostic(diagnostics, 'error', 'invalid-view-style-color-alpha', 'View element style color alpha must be an integer from 0 to 100.', {
      viewElementId: viewElementId,
      stylePath: colorPath + '.a',
      channel: 'a',
      value: color.a
    });
  }
}

function validateViewpointReference(view, viewpointIndex, diagnostics) {
  if (!view || view.viewpointRef === undefined || view.viewpointRef === null || view.viewpointRef === '') {
    return;
  }

  var viewpointRefId = getReferenceId(view.viewpointRef);

  if (!viewpointRefId) {
    addDiagnostic(diagnostics, 'error', 'invalid-viewpoint-reference', 'View viewpointRef must identify a model-defined viewpoint.', {
      viewId: getConceptId(view)
    });
    return;
  }

  if (!viewpointIndex.has(viewpointRefId)) {
    addDiagnostic(diagnostics, 'error', 'unknown-viewpoint-reference', 'View references an unknown model-defined viewpoint.', {
      viewId: getConceptId(view),
      viewpointRefId: viewpointRefId
    });
  }
}

function validateViewpointAttribute(view, diagnostics) {
  if (!view ||
      !Object.prototype.hasOwnProperty.call(view, 'viewpoint') ||
      view.viewpoint === undefined ||
      view.viewpoint === null) {
    return;
  }

  if (typeof view.viewpoint !== 'string') {
    addDiagnostic(diagnostics, 'error', 'invalid-view-viewpoint', 'View viewpoint must be a string when present.', {
      viewId: getConceptId(view),
      field: 'viewpoint',
      valueType: typeof view.viewpoint
    });
  }
}

function validateViewpoints(viewpoints, profile, diagnostics) {
  viewpoints.forEach(function(viewpoint) {
    validateViewpointTokens(
      viewpoint,
      'viewpointPurpose',
      VIEWPOINT_PURPOSES,
      'unsupported-viewpoint-purpose',
      diagnostics
    );
    validateViewpointTokens(
      viewpoint,
      'viewpointContent',
      VIEWPOINT_CONTENT_TYPES,
      'unsupported-viewpoint-content',
      diagnostics
    );
    validateViewpointTypeList(
      viewpoint,
      'allowedElementTypes',
      'unsupported-viewpoint-element-type',
      'invalid-viewpoint-element-type-entry',
      function(type) {
        return hasProfileConcept(type, profile);
      },
      diagnostics
    );
    validateViewpointTypeList(
      viewpoint,
      'allowedRelationshipTypes',
      'unsupported-viewpoint-relationship-type',
      'invalid-viewpoint-relationship-type-entry',
      function(type) {
        return hasProfileRelationship(type, profile);
      },
      diagnostics
    );
    validateViewpointConcerns(viewpoint, diagnostics);
    validateViewpointModelingNotes(viewpoint, diagnostics);
  });
}

function validateViewpointConcerns(viewpoint, diagnostics) {
  var concerns = viewpoint && viewpoint.concerns;

  if (concerns === undefined || concerns === null) {
    return;
  }

  if (!Array.isArray(concerns)) {
    addDiagnostic(diagnostics, 'error', 'invalid-viewpoint-concern-list', 'Viewpoint concerns must be an array.', {
      viewpointId: getConceptId(viewpoint)
    });
    return;
  }

  concerns.forEach(function(concern, concernIndex) {
    validateConcern(viewpoint, concern, concernIndex, diagnostics);
  });
}

function validateConcern(viewpoint, concern, concernIndex, diagnostics) {
  if (!isObject(concern)) {
    addDiagnostic(diagnostics, 'error', 'invalid-viewpoint-concern-entry', 'Viewpoint concern entries must be objects.', {
      viewpointId: getConceptId(viewpoint),
      concernIndex: concernIndex
    });
    return;
  }

  validateOptionalStringField(concern.label, 'invalid-concern-label', {
    viewpointId: getConceptId(viewpoint),
    concernIndex: concernIndex,
    field: 'label'
  }, diagnostics);
  validateOptionalStringField(concern.documentation, 'invalid-concern-documentation', {
    viewpointId: getConceptId(viewpoint),
    concernIndex: concernIndex,
    field: 'documentation'
  }, diagnostics);
  validateConcernStakeholders(viewpoint, concern, concernIndex, diagnostics);
}

function validateConcernStakeholders(viewpoint, concern, concernIndex, diagnostics) {
  if (!concern.stakeholdersNode) {
    return;
  }

  var stakeholders = concern.stakeholdersNode.stakeholders;

  if (!Array.isArray(stakeholders)) {
    addDiagnostic(diagnostics, 'error', 'invalid-stakeholder-list', 'Concern stakeholders must be an array.', {
      viewpointId: getConceptId(viewpoint),
      concernIndex: concernIndex
    });
    return;
  }

  stakeholders.forEach(function(stakeholder, stakeholderIndex) {
    validateStakeholder(viewpoint, stakeholder, concernIndex, stakeholderIndex, diagnostics);
  });
}

function validateStakeholder(viewpoint, stakeholder, concernIndex, stakeholderIndex, diagnostics) {
  if (!isObject(stakeholder)) {
    addDiagnostic(diagnostics, 'error', 'invalid-stakeholder-entry', 'Stakeholder entries must be objects.', {
      viewpointId: getConceptId(viewpoint),
      concernIndex: concernIndex,
      stakeholderIndex: stakeholderIndex
    });
    return;
  }

  validateOptionalStringField(stakeholder.label, 'invalid-stakeholder-label', {
    viewpointId: getConceptId(viewpoint),
    concernIndex: concernIndex,
    stakeholderIndex: stakeholderIndex,
    field: 'label'
  }, diagnostics);
}

function validateViewpointModelingNotes(viewpoint, diagnostics) {
  var modelingNotes = viewpoint && viewpoint.modelingNotes;

  if (modelingNotes === undefined || modelingNotes === null) {
    return;
  }

  if (!Array.isArray(modelingNotes)) {
    addDiagnostic(diagnostics, 'error', 'invalid-viewpoint-modeling-note-list', 'Viewpoint modelingNotes must be an array.', {
      viewpointId: getConceptId(viewpoint)
    });
    return;
  }

  modelingNotes.forEach(function(modelingNote, modelingNoteIndex) {
    validateModelingNote(viewpoint, modelingNote, modelingNoteIndex, diagnostics);
  });
}

function validateModelingNote(viewpoint, modelingNote, modelingNoteIndex, diagnostics) {
  if (!isObject(modelingNote)) {
    addDiagnostic(diagnostics, 'error', 'invalid-viewpoint-modeling-note-entry', 'Viewpoint modelingNote entries must be objects.', {
      viewpointId: getConceptId(viewpoint),
      modelingNoteIndex: modelingNoteIndex
    });
    return;
  }

  validateOptionalStringField(modelingNote.type, 'invalid-modeling-note-type', {
    viewpointId: getConceptId(viewpoint),
    modelingNoteIndex: modelingNoteIndex,
    field: 'type'
  }, diagnostics);
  validateOptionalStringField(modelingNote.documentation, 'invalid-modeling-note-documentation', {
    viewpointId: getConceptId(viewpoint),
    modelingNoteIndex: modelingNoteIndex,
    field: 'documentation'
  }, diagnostics);
}

function validateOrganizations(organizations, conceptIndex, profile, diagnostics) {
  function visitList(entries, parentOrganizationId) {
    if (entries === undefined || entries === null) {
      return;
    }

    if (!Array.isArray(entries)) {
      addDiagnostic(diagnostics, 'error', 'invalid-organization-list', 'Organization children must be an array.', {
        parentOrganizationId: parentOrganizationId || null
      });
      return;
    }

    entries.forEach(function(organization, organizationIndex) {
      if (!isObject(organization)) {
        addDiagnostic(diagnostics, 'error', 'invalid-organization-entry', 'Organization entries must be objects.', {
          parentOrganizationId: parentOrganizationId || null,
          organizationIndex: organizationIndex
        });
        return;
      }

      validateOrganizationIdentifierReference(organization, conceptIndex, profile, diagnostics);
      visitList(organization.organizations, getConceptId(organization));
    });
  }

  visitList(organizations, null);
}

function validateOrganizationsNode(organizationsNode, diagnostics) {
  if (organizationsNode === undefined || organizationsNode === null) {
    return;
  }

  if (Array.isArray(organizationsNode) || isObject(organizationsNode)) {
    return;
  }

  addDiagnostic(diagnostics, 'error', 'invalid-organizations-node', 'Organizations node must be an object or organization array.', {
    valueType: typeof organizationsNode
  });
}

function validateOrganizationIdentifierReference(organization, conceptIndex, profile, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(organization, 'identifierRef') ||
      organization.identifierRef === undefined ||
      organization.identifierRef === null ||
      organization.identifierRef === '') {
    return;
  }

  var organizationId = getConceptId(organization);
  var identifierRefId = getReferenceId(organization.identifierRef);

  if (!identifierRefId) {
    addDiagnostic(diagnostics, 'error', 'invalid-organization-identifier-reference', 'Organization identifierRef must identify a model concept.', {
      organizationId: organizationId
    });
    return;
  }

  var concept = conceptIndex.get(identifierRefId);

  if (!concept) {
    addDiagnostic(diagnostics, 'error', 'unknown-organization-identifier-reference', 'Organization identifierRef points to an unknown model concept.', {
      organizationId: organizationId,
      identifierRefId: identifierRefId
    });
    return;
  }

  var conceptType = getConceptType(concept) || getConceptType(organization.identifierRef);

  if (conceptType && !isEndpointTypeSupported(conceptType, profile)) {
    addDiagnostic(diagnostics, 'error', 'unsupported-organization-identifier-reference-type', 'Organization identifierRef points to a concept type that is not supported by this ArchiMate profile.', {
      organizationId: organizationId,
      identifierRefId: identifierRefId,
      conceptType: conceptType,
      archimateVersion: profile.version
    });
  }
}

function validatePropertyDefinitions(propertyDefinitionsNode, propertyDefinitions, diagnostics) {
  if (propertyDefinitionsNode === undefined || propertyDefinitionsNode === null) {
    return;
  }

  if (!Array.isArray(propertyDefinitionsNode) && !isObject(propertyDefinitionsNode)) {
    addDiagnostic(diagnostics, 'error', 'invalid-property-definitions-node', 'PropertyDefinitions node must be an object or property definition array.', {
      valueType: typeof propertyDefinitionsNode
    });
    return;
  }

  if (!Array.isArray(propertyDefinitionsNode) && !Array.isArray(propertyDefinitionsNode.propertyDefinitions)) {
    addDiagnostic(diagnostics, 'error', 'invalid-property-definition-list', 'PropertyDefinitions entries must be an array.', {
      propertyDefinitionsNodePresent: true
    });
    return;
  }

  propertyDefinitions.forEach(function(propertyDefinition, propertyDefinitionIndex) {
    validatePropertyDefinition(propertyDefinition, propertyDefinitionIndex, diagnostics);
  });
}

function validatePropertyDefinition(propertyDefinition, propertyDefinitionIndex, diagnostics) {
  if (!isObject(propertyDefinition)) {
    addDiagnostic(diagnostics, 'error', 'invalid-property-definition-entry', 'PropertyDefinition entries must be objects.', {
      propertyDefinitionIndex: propertyDefinitionIndex
    });
    return;
  }

  if (typeof propertyDefinition.id !== 'string' || propertyDefinition.id.trim() === '') {
    addDiagnostic(diagnostics, 'error', 'invalid-property-definition-id', 'PropertyDefinition id must be a non-empty string.', {
      propertyDefinitionIndex: propertyDefinitionIndex,
      field: 'id'
    });
  }

  validateOptionalStringField(propertyDefinition.name, 'invalid-property-definition-name', {
    propertyDefinitionId: propertyDefinition.id || null,
    propertyDefinitionIndex: propertyDefinitionIndex,
    field: 'name'
  }, diagnostics);
  validateOptionalStringField(propertyDefinition.type, 'invalid-property-definition-type', {
    propertyDefinitionId: propertyDefinition.id || null,
    propertyDefinitionIndex: propertyDefinitionIndex,
    field: 'type'
  }, diagnostics);
}

function validatePropertyDefinitionReferences(propertyOwners, propertyDefinitionIndex, diagnostics) {
  propertyOwners.forEach(function(owner) {
    var propertiesNode = owner && owner.propertiesNode;

    if (!propertiesNode) {
      return;
    }

    if (!isObject(propertiesNode)) {
      addDiagnostic(diagnostics, 'error', 'invalid-properties-node', 'Properties node must be an object.', {
        ownerId: getPropertyOwnerId(owner),
        ownerType: getPropertyOwnerType(owner),
        valueType: typeof propertiesNode
      });
      return;
    }

    if (!Array.isArray(propertiesNode.properties)) {
      addDiagnostic(diagnostics, 'error', 'invalid-properties-list', 'Properties entries must be an array.', {
        ownerId: getPropertyOwnerId(owner),
        ownerType: getPropertyOwnerType(owner)
      });
      return;
    }

    propertiesNode.properties.forEach(function(property, propertyIndex) {
      validatePropertyDefinitionReference(owner, property, propertyIndex, propertyDefinitionIndex, diagnostics);
    });
  });
}

function validateBaseObjectFields(baseObjects, diagnostics) {
  baseObjects.forEach(function(baseObject) {
    validateBaseObjectStringField(baseObject, 'name', 'invalid-base-object-name', diagnostics);
    validateBaseObjectStringField(baseObject, 'documentation', 'invalid-base-object-documentation', diagnostics);
  });
}

function validateBaseObjectStringField(baseObject, field, code, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(baseObject, field) ||
      baseObject[field] === undefined ||
      baseObject[field] === null) {
    return;
  }

  if (typeof baseObject[field] !== 'string') {
    addDiagnostic(diagnostics, 'error', code, 'BaseObject ' + field + ' must be a string when present.', {
      ownerId: getPropertyOwnerId(baseObject),
      ownerType: getPropertyOwnerType(baseObject),
      field: field,
      valueType: typeof baseObject[field]
    });
  }
}

function validatePropertyDefinitionReference(owner, property, propertyIndex, propertyDefinitionIndex, diagnostics) {
  var ownerId = getPropertyOwnerId(owner);
  var ownerType = getPropertyOwnerType(owner);

  if (!isObject(property)) {
    addDiagnostic(diagnostics, 'error', 'invalid-property-entry', 'Property entries must be objects.', {
      ownerId: ownerId,
      ownerType: ownerType,
      propertyIndex: propertyIndex
    });
    return;
  }

  validatePropertyValue(owner, property, propertyIndex, diagnostics);

  if (!Object.prototype.hasOwnProperty.call(property, 'propertyDefinitionRef') ||
      property.propertyDefinitionRef === undefined ||
      property.propertyDefinitionRef === null ||
      property.propertyDefinitionRef === '') {
    addDiagnostic(diagnostics, 'error', 'missing-property-definition-reference', 'Property entries must reference a PropertyDefinition.', {
      ownerId: ownerId,
      ownerType: ownerType,
      propertyIndex: propertyIndex
    });
    return;
  }

  var propertyDefinitionId = getPropertyDefinitionReferenceId(property.propertyDefinitionRef);
  var propertyDefinitionName = getPropertyDefinitionReferenceName(property.propertyDefinitionRef);

  if (!propertyDefinitionId && !propertyDefinitionName) {
    addDiagnostic(diagnostics, 'error', 'invalid-property-definition-reference', 'Property propertyDefinitionRef must identify a PropertyDefinition.', {
      ownerId: ownerId,
      ownerType: ownerType,
      propertyIndex: propertyIndex
    });
    return;
  }

  if (propertyDefinitionId && !propertyDefinitionIndex.has(propertyDefinitionId)) {
    addDiagnostic(diagnostics, 'error', 'unknown-property-definition-reference', 'Property propertyDefinitionRef points to an unknown PropertyDefinition.', {
      ownerId: ownerId,
      ownerType: ownerType,
      propertyIndex: propertyIndex,
      propertyDefinitionId: propertyDefinitionId
    });
  }
}

function validatePropertyValue(owner, property, propertyIndex, diagnostics) {
  if (!Object.prototype.hasOwnProperty.call(property, 'value') ||
      property.value === undefined ||
      property.value === null) {
    return;
  }

  if (typeof property.value !== 'string') {
    addDiagnostic(diagnostics, 'error', 'invalid-property-value', 'Property value must be a string when present.', {
      ownerId: getPropertyOwnerId(owner),
      ownerType: getPropertyOwnerType(owner),
      propertyIndex: propertyIndex,
      valueType: typeof property.value
    });
  }
}

function validateOptionalStringField(value, code, details, diagnostics) {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== 'string') {
    addDiagnostic(diagnostics, 'error', code, details.field + ' must be a string.', details);
  }
}

function validateViewpointTokens(viewpoint, fieldName, allowedValues, code, diagnostics) {
  var tokens = getTokenList(viewpoint && viewpoint[fieldName]);
  var allowed = new Set(allowedValues);

  tokens.forEach(function(token) {
    if (!allowed.has(token)) {
      addDiagnostic(diagnostics, 'error', code, token + ' is not a supported ArchiMate viewpoint ' + fieldName + ' value.', {
        viewpointId: getConceptId(viewpoint),
        field: fieldName,
        value: token
      });
    }
  });
}

function validateViewpointTypeList(viewpoint, fieldName, unsupportedCode, invalidEntryCode, isSupported, diagnostics) {
  var entries = getViewpointTypeEntries(viewpoint && viewpoint[fieldName], fieldName, invalidEntryCode, diagnostics, viewpoint);

  entries.forEach(function(entry) {
    if (!isSupported(entry.type)) {
      addDiagnostic(diagnostics, 'error', unsupportedCode, entry.type + ' is not supported by this ArchiMate profile.', {
        viewpointId: getConceptId(viewpoint),
        field: fieldName,
        type: entry.type
      });
    }
  });
}

function getViewpointTypeEntries(value, fieldName, invalidEntryCode, diagnostics, viewpoint) {
  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (!Array.isArray(value)) {
    if (typeof value === 'string') {
      return value.split(/\s+/).filter(Boolean).map(function(type) {
        return { type: type };
      });
    }

    addDiagnostic(diagnostics, 'error', invalidEntryCode, 'Viewpoint ' + fieldName + ' entries require string type values.', {
      viewpointId: getConceptId(viewpoint),
      field: fieldName,
      valueType: typeof value
    });
    return [];
  }

  var entries = [];

  value.forEach(function(entry) {
    if (typeof entry === 'string') {
      String(entry).split(/\s+/).filter(Boolean).forEach(function(type) {
        entries.push({ type: type });
      });
      return;
    }

    if (entry && entry.type && typeof entry.type === 'string') {
      entries.push({ type: entry.type });
      return;
    }

    addDiagnostic(diagnostics, 'error', invalidEntryCode, 'Viewpoint ' + fieldName + ' entries require string type values.', {
      viewpointId: getConceptId(viewpoint),
      field: fieldName,
      valueType: entry && Object.prototype.hasOwnProperty.call(entry, 'type') ? typeof entry.type : typeof entry
    });
  });

  return entries;
}

function validateProfileAttributeProperties(concepts, profile, propertyDefinitionIndex, diagnostics) {
  concepts.forEach(function(concept) {
    var properties = concept && concept.propertiesNode && concept.propertiesNode.properties;

    if (!Array.isArray(properties)) {
      return;
    }

    properties.forEach(function(property) {
      var propertyName = getPropertyDefinitionName(property, propertyDefinitionIndex);

      if (!propertyName || propertyName.indexOf(PROFILE_ATTRIBUTE_PROPERTY_PREFIX + ':') !== 0) {
        return;
      }

      validateProfileAttributeProperty(concept, property, propertyName, profile, diagnostics);
    });
  });
}

function validateProfileAttributeProperty(concept, property, propertyName, profile, diagnostics) {
  var attribute = getProfileAttributeForProperty(concept, propertyName, profile);
  var conceptId = getConceptId(concept);
  var conceptType = getConceptType(concept);

  if (!attribute) {
    addDiagnostic(diagnostics, 'error', 'unsupported-profile-attribute', propertyName + ' is not defined for ' + conceptType + '.', {
      conceptId: conceptId,
      conceptType: conceptType,
      propertyName: propertyName
    });
    return;
  }

  try {
    parseProfileAttributePropertyValue(attribute, property.value);
  } catch (error) {
    addDiagnostic(diagnostics, 'error', 'invalid-profile-attribute-value', propertyName + ' value is not valid for ' + attribute.type + '.', {
      conceptId: conceptId,
      conceptType: conceptType,
      propertyName: propertyName,
      attributeName: attribute.name,
      attributeConcept: attribute.concept,
      attributeType: attribute.type,
      value: property.value,
      reason: error.message
    });
  }
}

function getProfileAttributeForProperty(concept, propertyName, profile) {
  var conceptType = getConceptType(concept);
  var attributes = getProfileAttributesForConcept(conceptType, profile);

  for (const attribute of attributes) {
    if (getProfileAttributePropertyName(attribute) === propertyName) {
      return attribute;
    }
  }

  return null;
}

function getPropertyDefinitionName(property, propertyDefinitionIndex) {
  var definition = resolvePropertyDefinition(property && property.propertyDefinitionRef, propertyDefinitionIndex);

  return definition && definition.name || null;
}

function addJunctionRelationship(junctions, endpoint, relationship, direction) {
  if (!isJunctionType(endpoint.type)) {
    return;
  }

  var junctionId = endpoint.id || endpoint.type;
  var group = junctions[junctionId];

  if (!group) {
    group = junctions[junctionId] = {
      junctionId: junctionId,
      junctionType: endpoint.type,
      incoming: [],
      outgoing: [],
      relationships: []
    };
  }

  group[direction].push(relationship);

  if (group.relationships.indexOf(relationship) === -1) {
    group.relationships.push(relationship);
  }
}

function buildValidationResult(profile, diagnostics) {
  var errors = diagnostics.filter(function(diagnostic) {
    return diagnostic.severity === 'error';
  });
  var warnings = diagnostics.filter(function(diagnostic) {
    return diagnostic.severity === 'warning';
  });

  return {
    valid: errors.length === 0,
    archimateVersion: profile.version,
    diagnosticCount: diagnostics.length,
    errorCount: errors.length,
    warningCount: warnings.length,
    diagnostics: diagnostics,
    errors: errors,
    warnings: warnings
  };
}

function getModelElements(model) {
  var elementsNode = getModelElementsNode(model);

  if (elementsNode && Array.isArray(elementsNode.baseElements)) {
    return elementsNode.baseElements.filter(isObject);
  }

  return [];
}

function getModelRelationships(model) {
  var relationshipsNode = getModelRelationshipsNode(model);

  if (relationshipsNode && Array.isArray(relationshipsNode.relationships)) {
    return relationshipsNode.relationships.filter(isObject);
  }

  return [];
}

function getModelElementsNode(model) {
  return model && model.elementsNode;
}

function getModelRelationshipsNode(model) {
  return model && model.relationshipsNode;
}

function getModelViewpoints(model) {
  var views = getModelViewsNode(model);
  var viewpointsNode = views && viewpointsNodeFromViews(views);

  return viewpointsNode && viewpointsNode.viewpoints || [];
}

function getModelViews(model) {
  var views = getModelViewsNode(model);
  var diagrams = getModelDiagramsNode(views);

  if (diagrams && Array.isArray(diagrams.viewsList)) {
    return diagrams.viewsList;
  }

  if (diagrams && Array.isArray(diagrams.views)) {
    return diagrams.views;
  }

  if (views && Array.isArray(views.viewsList)) {
    return views.viewsList;
  }

  if (views && Array.isArray(views.views)) {
    return views.views;
  }

  return [];
}

function getModelViewsNode(model) {
  return model && (model.views || model.viewsNode);
}

function getModelDiagramsNode(views) {
  return views && (views.diagrams || views.diagramsNode);
}

function getModelOrganizations(model) {
  var organizationsNode = getModelOrganizationsNode(model);

  if (Array.isArray(organizationsNode)) {
    return organizationsNode;
  }

  return organizationsNode && organizationsNode.organizations || [];
}

function getModelOrganizationsNode(model) {
  return model && (model.organizationsNode || model.organizations);
}

function getModelPropertyDefinitions(model) {
  var propertyDefinitionsNode = getModelPropertyDefinitionsNode(model);

  if (Array.isArray(propertyDefinitionsNode)) {
    return propertyDefinitionsNode;
  }

  if (propertyDefinitionsNode && Array.isArray(propertyDefinitionsNode.propertyDefinitions)) {
    return propertyDefinitionsNode.propertyDefinitions;
  }

  return [];
}

function getModelPropertyDefinitionsNode(model) {
  return model && (model.propertyDefinitionsNode || model.propertyDefinitions);
}

function getModelIdObjects(model, elements, relationships, viewpoints, views, organizations) {
  var entries = [];
  var add = function(idObject, ownerKind) {
    if (isObject(idObject)) {
      entries.push({
        idObject: idObject,
        ownerKind: ownerKind
      });
    }
  };

  add(model, 'model');

  (elements || []).forEach(function(element) {
    add(element, 'element');
  });

  (relationships || []).forEach(function(relationship) {
    add(relationship, 'relationship');
  });

  (viewpoints || []).forEach(function(viewpoint) {
    add(viewpoint, 'viewpoint');
  });

  (views || []).forEach(function(view) {
    add(view, 'view');
  });

  flattenOrganizations(organizations || []).forEach(function(organization) {
    add(organization, 'organization');
  });

  getModelViewElements(views).forEach(function(viewElement) {
    add(viewElement, 'viewElement');
  });

  return entries;
}

function getModelViewElements(views) {
  return (views || []).reduce(function(result, view) {
    return result.concat(collectViewElements(view));
  }, []);
}

function getModelPropertyOwners(model, elements, relationships, viewpoints, views, organizations) {
  var owners = [];

  if (isObject(model)) {
    owners.push(model);
  }

  owners = owners
    .concat(elements || [])
    .concat(relationships || [])
    .concat(viewpoints || [])
    .concat(views || [])
    .concat(flattenOrganizations(organizations || []));

  return owners.filter(isObject);
}

function flattenOrganizations(organizations) {
  return organizations.reduce(function(result, organization) {
    if (!isObject(organization)) {
      return result;
    }

    result.push(organization);

    if (Array.isArray(organization.organizations)) {
      return result.concat(flattenOrganizations(organization.organizations));
    }

    return result;
  }, []);
}

function viewpointsNodeFromViews(views) {
  if (Array.isArray(views.viewpoints)) {
    return {
      viewpoints: views.viewpoints
    };
  }

  return views.viewpointsNode || views.viewpoints || null;
}

function indexConcepts(elements, relationships) {
  var index = new Map();

  elements.concat(relationships).forEach(function(concept) {
    var id = getConceptId(concept);

    if (id && !index.has(id)) {
      index.set(id, concept);
    }
  });

  return index;
}

function indexPropertyDefinitions(propertyDefinitions) {
  var index = new Map();

  propertyDefinitions.forEach(function(propertyDefinition) {
    if (propertyDefinition && propertyDefinition.id && !index.has(propertyDefinition.id)) {
      index.set(propertyDefinition.id, propertyDefinition);
    }
  });

  return index;
}

function indexProfileViewpoints(profile) {
  var index = new Map();
  var viewpoints = profile && profile.viewpoints || [];

  viewpoints.forEach(function(viewpoint) {
    if (viewpoint && viewpoint.id && !index.has(viewpoint.id)) {
      index.set(viewpoint.id, viewpoint);
    }
  });

  return index;
}

function resolveEndpoint(endpoint, conceptIndex) {
  if (!endpoint) {
    return {};
  }

  if (typeof endpoint === 'string') {
    return resolveIndexedEndpoint(endpoint, conceptIndex);
  }

  var id = getConceptId(endpoint);
  var indexed = id && conceptIndex.get(id);
  var endpointType = getConceptType(endpoint);
  var type = endpointType || getConceptType(indexed);
  var invalidReference = !id && !type;
  var unknownReference = Boolean(id && !indexed && !endpointType);

  return {
    id: id,
    type: type,
    invalidReference: invalidReference,
    unknownReference: unknownReference,
    valueType: typeof endpoint
  };
}

function resolveIndexedEndpoint(id, conceptIndex) {
  var concept = conceptIndex.get(id);

  return {
    id: id,
    type: getConceptType(concept),
    unknownReference: !concept
  };
}

function getReferenceId(reference) {
  if (typeof reference === 'string') {
    return reference;
  }

  return getConceptId(reference);
}

function resolvePropertyDefinition(reference, propertyDefinitionIndex) {
  var propertyDefinitionId = getPropertyDefinitionReferenceId(reference);

  if (propertyDefinitionId && propertyDefinitionIndex.has(propertyDefinitionId)) {
    return propertyDefinitionIndex.get(propertyDefinitionId);
  }

  return isObject(reference) ? reference : null;
}

function getPropertyDefinitionReferenceId(reference) {
  if (typeof reference === 'string') {
    return reference;
  }

  return reference && reference.id || null;
}

function getPropertyDefinitionReferenceName(reference) {
  return reference && reference.name || null;
}

function getConceptId(concept) {
  if (!concept) {
    return null;
  }

  return concept.id ||
    concept.elementRef && concept.elementRef.id ||
    concept.relationshipRef && concept.relationshipRef.id ||
    concept.businessObject && getConceptId(concept.businessObject) ||
    null;
}

function getViewElementId(viewElement) {
  return viewElement && viewElement.id || null;
}

function getViewElementConceptReferenceId(viewElement) {
  if (!viewElement) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(viewElement, 'elementRef')) {
    return getReferenceId(viewElement.elementRef);
  }

  if (Object.prototype.hasOwnProperty.call(viewElement, 'relationshipRef')) {
    return getReferenceId(viewElement.relationshipRef);
  }

  return null;
}

function getConceptType(concept) {
  if (!concept) {
    return null;
  }

  return concept.type ||
    concept.elementRef && concept.elementRef.type ||
    concept.relationshipRef && concept.relationshipRef.type ||
    concept.businessObject && getConceptType(concept.businessObject) ||
    null;
}

function getPropertyOwnerId(owner) {
  return getConceptId(owner) || owner && owner.id || null;
}

function getPropertyOwnerType(owner) {
  return getConceptType(owner) || owner && owner.$type || null;
}

function isEndpointTypeSupported(type, profile) {
  return hasProfileConcept(type, profile) || hasProfileRelationship(type, profile);
}

function isRelationshipAllowedByProfile(sourceType, targetType, relationshipType, profile) {
  if (!sourceType || !targetType || !relationshipType) {
    return false;
  }

  var baseRelationshipType = getBaseRelationshipTypeForProfile(relationshipType, profile);
  var relationshipTargetType = getBaseConceptTypeForProfile(targetType, profile);
  var sourceRelationshipMap = getRelationshipMapForProfile(sourceType, profile);

  if (!sourceRelationshipMap) {
    return false;
  }

  var relationshipsAllowedString = sourceRelationshipMap.get(relationshipTargetType);

  if (!relationshipsAllowedString) {
    return false;
  }

  for (const char of relationshipsAllowedString) {
    if (RELATIONSHIP_CODE_TO_TYPE[char] === baseRelationshipType) {
      return true;
    }
  }

  return false;
}

function isJunctionType(type) {
  return type === 'AndJunction' || type === 'OrJunction';
}

function addDiagnostic(diagnostics, severity, code, message, details) {
  diagnostics.push(Object.assign({
    severity: severity,
    code: code,
    message: message
  }, details || {}));
}

function unique(values) {
  var result = [];

  values.forEach(function(value) {
    if (result.indexOf(value) === -1) {
      result.push(value);
    }
  });

  return result;
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidDiagramNumber(value, positive) {
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  var number = Number(value);

  if (!Number.isFinite(number)) {
    return false;
  }

  return positive ? number > 0 : number >= 0;
}

function isValidDiagramInteger(value) {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  var number = Number(value);

  return Number.isFinite(number) && Number.isInteger(number) && number >= 0;
}

function isValidPositiveInteger(value) {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  var number = Number(value);

  return Number.isFinite(number) && Number.isInteger(number) && number > 0;
}

function isValidIntegerInRange(value, min, max) {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  var number = Number(value);

  return Number.isFinite(number) &&
    Number.isInteger(number) &&
    number >= min &&
    number <= max;
}

function isValidPositiveHalfStepNumber(value) {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  var number = Number(value);

  return Number.isFinite(number) && number >= 1 && Number.isInteger(number * 2);
}

function getTokenList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.reduce(function(tokens, entry) {
      return tokens.concat(getTokenList(entry));
    }, []);
  }

  return String(value).split(/\s+/).filter(Boolean);
}

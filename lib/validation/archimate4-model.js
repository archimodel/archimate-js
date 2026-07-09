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

export function validateArchimate4Model(model, options = {}) {
  return validateArchimateModel(model, Object.assign({}, options, {
    archimateVersion: '4.0'
  }));
}

export function validateArchimateModel(model, options = {}) {
  var profile = resolveValidationProfile(options);
  var elements = getModelElements(model);
  var relationships = getModelRelationships(model);
  var viewpoints = getModelViewpoints(model);
  var views = getModelViews(model);
  var elementIndex = indexConcepts(elements, []);
  var relationshipIndex = indexConcepts([], relationships);
  var conceptIndex = indexConcepts(elements, relationships);
  var viewpointIndex = indexConcepts(viewpoints, []);
  var profileViewpointIndex = indexProfileViewpoints(profile);
  var diagnostics = [];

  elements.forEach(function(element) {
    validateElement(element, profile, diagnostics);
  });

  relationships.forEach(function(relationship) {
    validateRelationship(relationship, profile, conceptIndex, options, diagnostics);
  });

  validateJunctionRelationshipConsistency(relationships, profile, conceptIndex, options, diagnostics);
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
  validateProfileAttributeProperties(elements.concat(relationships), profile, diagnostics);

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

  validateRelationshipEndpoint('source', relationshipId, source, profile, diagnostics);
  validateRelationshipEndpoint('target', relationshipId, target, profile, diagnostics);
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

function validateRelationshipEndpoint(role, relationshipId, endpoint, profile, diagnostics) {
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
    validateViewpointReference(view, viewpointIndex, diagnostics);
  });
}

function validateViewElements(views, elementIndex, relationshipIndex, profile, diagnostics) {
  views.forEach(function(view) {
    collectViewElements(view).forEach(function(viewElement) {
      validateViewElementReference(viewElement, elementIndex, relationshipIndex, profile, diagnostics);
      validateViewRelationshipReference(viewElement, elementIndex, relationshipIndex, profile, diagnostics);
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
  if (!value) {
    return [];
  }

  if (!Array.isArray(value)) {
    return String(value).split(/\s+/).filter(Boolean).map(function(type) {
      return { type: type };
    });
  }

  var entries = [];

  value.forEach(function(entry) {
    if (typeof entry === 'string') {
      String(entry).split(/\s+/).filter(Boolean).forEach(function(type) {
        entries.push({ type: type });
      });
      return;
    }

    if (entry && entry.type) {
      entries.push({ type: entry.type });
      return;
    }

    addDiagnostic(diagnostics, 'error', invalidEntryCode, 'Viewpoint ' + fieldName + ' entries require type.', {
      viewpointId: getConceptId(viewpoint),
      field: fieldName
    });
  });

  return entries;
}

function validateProfileAttributeProperties(concepts, profile, diagnostics) {
  concepts.forEach(function(concept) {
    var properties = concept && concept.propertiesNode && concept.propertiesNode.properties || [];

    properties.forEach(function(property) {
      var propertyName = getPropertyDefinitionName(property);

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

function getPropertyDefinitionName(property) {
  var definition = property && property.propertyDefinitionRef;

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
  return model && model.elementsNode && model.elementsNode.baseElements || [];
}

function getModelRelationships(model) {
  return model && model.relationshipsNode && model.relationshipsNode.relationships || [];
}

function getModelViewpoints(model) {
  var views = model && (model.views || model.viewsNode);
  var viewpointsNode = views && viewpointsNodeFromViews(views);

  return viewpointsNode && viewpointsNode.viewpoints || [];
}

function getModelViews(model) {
  var views = model && (model.views || model.viewsNode);
  var diagrams = views && (views.diagrams || views.diagramsNode);

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
  var type = getConceptType(endpoint) || getConceptType(indexed);

  return {
    id: id,
    type: type
  };
}

function resolveIndexedEndpoint(id, conceptIndex) {
  var concept = conceptIndex.get(id);

  return {
    id: id,
    type: getConceptType(concept)
  };
}

function getReferenceId(reference) {
  if (typeof reference === 'string') {
    return reference;
  }

  return getConceptId(reference);
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

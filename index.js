export {
  default
} from './lib/Viewer';

export {
  migrateArchimate3ModelTo4
} from './lib/migration/archimate3-to-4';

export {
  getArchimate4RelationshipProfileCoverageReport,
  getArchimate4RelationshipProfileStatus,
  resetArchimate4RelationshipProfile,
  setArchimate4RelationshipProfile
} from './lib/metamodel/languages/archimate4-relationships';

export {
  createLanguageProfile,
  getArchimate4ExampleViewpointCatalog,
  getArchimate4ImplementationStatus,
  getProfileAttributePropertyName,
  getProfileAttributePropertyValue,
  getProfileAttributesForConcept,
  getLanguageProfile,
  isProfileAttributeValueValid,
  normalizeProfileAttributeValue,
  parseProfileAttributePropertyValue,
  serializeProfileAttributePropertyValue,
  setProfileAttributePropertyValue,
  normalizeArchimateVersion
} from './lib/metamodel/languages';

export {
  deriveRelationship,
  deriveRelationshipChain,
  deriveRelationshipType,
  derivePotentialRelationship,
  getDependencyRelationshipStrength,
  getStructuralRelationshipStrength,
  getWeakestDependencyRelationshipType,
  getWeakestStructuralRelationshipType,
  isDerivableRelationshipType,
  isDependencyRelationshipType,
  isDynamicRelationshipType,
  isStructuralRelationshipType
} from './lib/util/DerivedRelationshipUtil';

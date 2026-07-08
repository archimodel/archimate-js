export {
  default
} from './lib/Viewer';

export {
  migrateArchimate3ModelTo4
} from './lib/migration/archimate3-to-4';

export {
  getArchimate4RelationshipProfileStatus,
  setArchimate4RelationshipProfile
} from './lib/metamodel/languages/archimate4-relationships';

export {
  createLanguageProfile,
  getLanguageProfile,
  normalizeArchimateVersion
} from './lib/metamodel/languages';

export {
  deriveRelationship,
  deriveRelationshipType,
  getStructuralRelationshipStrength,
  getWeakestStructuralRelationshipType,
  isStructuralRelationshipType
} from './lib/util/DerivedRelationshipUtil';

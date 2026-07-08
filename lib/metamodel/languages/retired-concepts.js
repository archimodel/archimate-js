export const ARCHIMATE_3_TO_4_MIGRATIONS = new Map([
  [ 'BusinessInteraction', { replacement: 'Process', originalDomain: 'Business', alternativeReplacements: [ 'Function' ], preserveSpecialization: true, warning: 'BusinessInteraction was retired; migrated to Process specialization; verify whether Function is more precise for this model.' } ],
  [ 'ApplicationInteraction', { replacement: 'Process', originalDomain: 'Application', alternativeReplacements: [ 'Function' ], preserveSpecialization: true, warning: 'ApplicationInteraction was retired; migrated to Process specialization; verify whether Function is more precise for this model.' } ],
  [ 'TechnologyInteraction', { replacement: 'Process', originalDomain: 'Technology', alternativeReplacements: [ 'Function' ], preserveSpecialization: true, warning: 'TechnologyInteraction was retired; migrated to Process specialization; verify whether Function is more precise for this model.' } ],
  [ 'Constraint', { replacement: 'Requirement', originalDomain: 'Motivation', preserveSpecialization: true, warning: 'Constraint was retired; migrated to Requirement specialization.' } ],
  [ 'Contract', { replacement: 'BusinessObject', originalDomain: 'Business', preserveSpecialization: true, warning: 'Contract was retired; migrated to BusinessObject specialization.' } ],
  [ 'Gap', { replacement: 'Assessment', originalDomain: 'Implementation & Migration', alternativeReplacements: [ 'Deliverable' ], preserveSpecialization: true, warning: 'Gap was retired; migrated to Assessment specialization; verify whether Deliverable is more precise for this model.' } ],
  [ 'Representation', { replacement: 'DataObject', originalDomain: 'Business', alternativeReplacements: [ 'Artifact', 'Material' ], preserveSpecialization: true, warning: 'Representation was retired; migrated to DataObject specialization; verify whether Artifact or Material is more precise for this model.' } ],
  [ 'ImplementationEvent', { replacement: 'Event', originalDomain: 'Implementation & Migration', preserveSpecialization: true, warning: 'ImplementationEvent was retired; migrated to Event specialization.' } ],
  [ 'BusinessRole', { replacement: 'Role', originalDomain: 'Business', preserveSpecialization: true, warning: 'BusinessRole was merged into Role with original domain preserved.' } ],
  [ 'BusinessCollaboration', { replacement: 'Collaboration', originalDomain: 'Business', preserveSpecialization: true, warning: 'BusinessCollaboration was merged into Collaboration with original domain preserved.' } ],
  [ 'ApplicationCollaboration', { replacement: 'Collaboration', originalDomain: 'Application', preserveSpecialization: true, warning: 'ApplicationCollaboration was merged into Collaboration with original domain preserved.' } ],
  [ 'TechnologyCollaboration', { replacement: 'Collaboration', originalDomain: 'Technology', preserveSpecialization: true, warning: 'TechnologyCollaboration was merged into Collaboration with original domain preserved.' } ],
  [ 'BusinessService', { replacement: 'Service', originalDomain: 'Business', preserveSpecialization: true, warning: 'BusinessService was merged into Service with original domain preserved.' } ],
  [ 'ApplicationService', { replacement: 'Service', originalDomain: 'Application', preserveSpecialization: true, warning: 'ApplicationService was merged into Service with original domain preserved.' } ],
  [ 'TechnologyService', { replacement: 'Service', originalDomain: 'Technology', preserveSpecialization: true, warning: 'TechnologyService was merged into Service with original domain preserved.' } ],
  [ 'BusinessProcess', { replacement: 'Process', originalDomain: 'Business', preserveSpecialization: true, warning: 'BusinessProcess was merged into Process with original domain preserved.' } ],
  [ 'ApplicationProcess', { replacement: 'Process', originalDomain: 'Application', preserveSpecialization: true, warning: 'ApplicationProcess was merged into Process with original domain preserved.' } ],
  [ 'TechnologyProcess', { replacement: 'Process', originalDomain: 'Technology', preserveSpecialization: true, warning: 'TechnologyProcess was merged into Process with original domain preserved.' } ],
  [ 'BusinessFunction', { replacement: 'Function', originalDomain: 'Business', preserveSpecialization: true, warning: 'BusinessFunction was merged into Function with original domain preserved.' } ],
  [ 'ApplicationFunction', { replacement: 'Function', originalDomain: 'Application', preserveSpecialization: true, warning: 'ApplicationFunction was merged into Function with original domain preserved.' } ],
  [ 'TechnologyFunction', { replacement: 'Function', originalDomain: 'Technology', preserveSpecialization: true, warning: 'TechnologyFunction was merged into Function with original domain preserved.' } ],
  [ 'BusinessEvent', { replacement: 'Event', originalDomain: 'Business', preserveSpecialization: true, warning: 'BusinessEvent was merged into Event with original domain preserved.' } ],
  [ 'ApplicationEvent', { replacement: 'Event', originalDomain: 'Application', preserveSpecialization: true, warning: 'ApplicationEvent was merged into Event with original domain preserved.' } ],
  [ 'TechnologyEvent', { replacement: 'Event', originalDomain: 'Technology', preserveSpecialization: true, warning: 'TechnologyEvent was merged into Event with original domain preserved.' } ],
  [ 'Path', { replacement: 'Path', originalDomain: 'Technology', preserveSpecialization: false, warning: 'Technology Path moved to the Common Domain as Path.' } ],
  [ 'DistributionNetwork', { replacement: 'DistributionNetwork', originalDomain: 'Physical', preserveSpecialization: false, warning: 'DistributionNetwork is modeled in the Technology Domain for ArchiMate 4 fallback support.' } ],
  [ 'Equipment', { replacement: 'Equipment', originalDomain: 'Physical', preserveSpecialization: false, warning: 'Equipment is modeled in the Technology Domain for ArchiMate 4 fallback support.' } ],
  [ 'Facility', { replacement: 'Facility', originalDomain: 'Physical', preserveSpecialization: false, warning: 'Facility is modeled in the Technology Domain for ArchiMate 4 fallback support.' } ],
  [ 'Material', { replacement: 'Material', originalDomain: 'Physical', preserveSpecialization: false, warning: 'Material is modeled in the Technology Domain for ArchiMate 4 fallback support.' } ]
]);

export function toArchimate4Type(type) {
  var migration = ARCHIMATE_3_TO_4_MIGRATIONS.get(type);

  return migration ? migration.replacement : type;
}

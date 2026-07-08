export const ARCHIMATE_3_TO_4_MIGRATIONS = new Map([
  [ 'BusinessInteraction', { replacement: 'Process', alternativeReplacements: [ 'Function' ], preserveSpecialization: true, warning: 'BusinessInteraction was retired; migrated to Process specialization; verify whether Function is more precise for this model.' } ],
  [ 'ApplicationInteraction', { replacement: 'Process', alternativeReplacements: [ 'Function' ], preserveSpecialization: true, warning: 'ApplicationInteraction was retired; migrated to Process specialization; verify whether Function is more precise for this model.' } ],
  [ 'TechnologyInteraction', { replacement: 'Process', alternativeReplacements: [ 'Function' ], preserveSpecialization: true, warning: 'TechnologyInteraction was retired; migrated to Process specialization; verify whether Function is more precise for this model.' } ],
  [ 'Constraint', { replacement: 'Requirement', preserveSpecialization: true, warning: 'Constraint was retired; migrated to Requirement specialization.' } ],
  [ 'Contract', { replacement: 'BusinessObject', preserveSpecialization: true, warning: 'Contract was retired; migrated to BusinessObject specialization.' } ],
  [ 'Gap', { replacement: 'Assessment', alternativeReplacements: [ 'Deliverable' ], preserveSpecialization: true, warning: 'Gap was retired; migrated to Assessment specialization; verify whether Deliverable is more precise for this model.' } ],
  [ 'Representation', { replacement: 'DataObject', alternativeReplacements: [ 'Artifact', 'Material' ], preserveSpecialization: true, warning: 'Representation was retired; migrated to DataObject specialization; verify whether Artifact or Material is more precise for this model.' } ],
  [ 'ImplementationEvent', { replacement: 'Event', preserveSpecialization: true, warning: 'ImplementationEvent was retired; migrated to Event specialization.' } ],
  [ 'BusinessRole', { replacement: 'Role', preserveSpecialization: true, warning: 'BusinessRole was merged into Role with original domain preserved.' } ],
  [ 'BusinessCollaboration', { replacement: 'Collaboration', preserveSpecialization: true, warning: 'BusinessCollaboration was merged into Collaboration with original domain preserved.' } ],
  [ 'ApplicationCollaboration', { replacement: 'Collaboration', preserveSpecialization: true, warning: 'ApplicationCollaboration was merged into Collaboration with original domain preserved.' } ],
  [ 'TechnologyCollaboration', { replacement: 'Collaboration', preserveSpecialization: true, warning: 'TechnologyCollaboration was merged into Collaboration with original domain preserved.' } ],
  [ 'BusinessService', { replacement: 'Service', preserveSpecialization: true, warning: 'BusinessService was merged into Service with original domain preserved.' } ],
  [ 'ApplicationService', { replacement: 'Service', preserveSpecialization: true, warning: 'ApplicationService was merged into Service with original domain preserved.' } ],
  [ 'TechnologyService', { replacement: 'Service', preserveSpecialization: true, warning: 'TechnologyService was merged into Service with original domain preserved.' } ],
  [ 'BusinessProcess', { replacement: 'Process', preserveSpecialization: true, warning: 'BusinessProcess was merged into Process with original domain preserved.' } ],
  [ 'ApplicationProcess', { replacement: 'Process', preserveSpecialization: true, warning: 'ApplicationProcess was merged into Process with original domain preserved.' } ],
  [ 'TechnologyProcess', { replacement: 'Process', preserveSpecialization: true, warning: 'TechnologyProcess was merged into Process with original domain preserved.' } ],
  [ 'BusinessFunction', { replacement: 'Function', preserveSpecialization: true, warning: 'BusinessFunction was merged into Function with original domain preserved.' } ],
  [ 'ApplicationFunction', { replacement: 'Function', preserveSpecialization: true, warning: 'ApplicationFunction was merged into Function with original domain preserved.' } ],
  [ 'TechnologyFunction', { replacement: 'Function', preserveSpecialization: true, warning: 'TechnologyFunction was merged into Function with original domain preserved.' } ],
  [ 'BusinessEvent', { replacement: 'Event', preserveSpecialization: true, warning: 'BusinessEvent was merged into Event with original domain preserved.' } ],
  [ 'ApplicationEvent', { replacement: 'Event', preserveSpecialization: true, warning: 'ApplicationEvent was merged into Event with original domain preserved.' } ],
  [ 'TechnologyEvent', { replacement: 'Event', preserveSpecialization: true, warning: 'TechnologyEvent was merged into Event with original domain preserved.' } ],
  [ 'Path', { replacement: 'Path', preserveSpecialization: false, warning: 'Technology Path moved to the Common Domain as Path.' } ],
  [ 'DistributionNetwork', { replacement: 'DistributionNetwork', preserveSpecialization: false, warning: 'DistributionNetwork is modeled in the Technology Domain for ArchiMate 4 fallback support.' } ],
  [ 'Equipment', { replacement: 'Equipment', preserveSpecialization: false, warning: 'Equipment is modeled in the Technology Domain for ArchiMate 4 fallback support.' } ],
  [ 'Facility', { replacement: 'Facility', preserveSpecialization: false, warning: 'Facility is modeled in the Technology Domain for ArchiMate 4 fallback support.' } ],
  [ 'Material', { replacement: 'Material', preserveSpecialization: false, warning: 'Material is modeled in the Technology Domain for ArchiMate 4 fallback support.' } ]
]);

export function toArchimate4Type(type) {
  var migration = ARCHIMATE_3_TO_4_MIGRATIONS.get(type);

  return migration ? migration.replacement : type;
}

import { ARCHIMATE_3_TO_4_MIGRATIONS } from '../metamodel/languages/retired-concepts.js';

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

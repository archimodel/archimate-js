import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readJson(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8');
  return JSON.parse(text);
}

function kebab(type) {
  return type
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

test('archimate 3 profile keeps retired 3.x concepts for compatibility', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate3-profile.json');
  const types = new Set(profile.elements.map((element) => element.type));

  assert.equal(profile.version, '3.2');
  assert.equal(types.has('BusinessInteraction'), true);
  assert.equal(types.has('ApplicationInteraction'), true);
  assert.equal(types.has('TechnologyInteraction'), true);
  assert.equal(types.has('Constraint'), true);
  assert.equal(types.has('Contract'), true);
  assert.equal(types.has('Gap'), true);
  assert.equal(types.has('Representation'), true);
  assert.equal(types.has('AndJunction'), true);
  assert.equal(types.has('OrJunction'), true);
});

test('archimate 4 profile removes retired 3.x concepts', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const types = new Set(profile.elements.map((element) => element.type));

  assert.equal(profile.version, '4.0');
  assert.equal(types.has('BusinessInteraction'), false);
  assert.equal(types.has('ApplicationInteraction'), false);
  assert.equal(types.has('TechnologyInteraction'), false);
  assert.equal(types.has('Constraint'), false);
  assert.equal(types.has('Contract'), false);
  assert.equal(types.has('Gap'), false);
  assert.equal(types.has('Representation'), false);
  assert.equal(types.has('ImplementationEvent'), false);
  assert.equal(types.has('Interface'), false);
  assert.equal(types.has('Service'), true);
  assert.equal(types.has('Process'), true);
  assert.equal(types.has('Function'), true);
  assert.equal(types.has('Event'), true);
  assert.equal(types.has('Path'), true);
  assert.equal(types.has('BusinessInterface'), true);
  assert.equal(types.has('ApplicationInterface'), true);
  assert.equal(types.has('TechnologyInterface'), true);
});

test('archimate 4 profile exposes Common Domain', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const domains = new Set(profile.domains.map((domain) => domain.name));

  assert.equal(domains.has('Common'), true);
  assert.equal(domains.has('Business'), true);
  assert.equal(domains.has('Application'), true);
  assert.equal(domains.has('Technology'), true);
});

test('archimate 4 profile matches the C260 element catalog', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const officialCatalog = await readJson('./fixtures/archimate4-c260-element-catalog.json');
  const rendererUtil = await readFile(new URL('../lib/draw/ArchimateRendererUtil.js', import.meta.url), 'utf8');

  assert.equal(officialCatalog.elements.length, 42);
  assert.equal(profile.elements.length, 42);
  assert.deepEqual(
    profile.elements.map((element) => element.type).sort(),
    officialCatalog.elements.slice().sort()
  );

  const elements = new Map(profile.elements.map((element) => [ element.type, element ]));

  assert.deepEqual(profile.domains.map((domain) => domain.name), officialCatalog.domains);
  assert.deepEqual(
    Array.from(new Set(profile.elements.map((element) => element.aspect))).sort(),
    officialCatalog.aspects.slice().sort()
  );
  for (const aspect of officialCatalog.aspects) {
    if (aspect === 'Behavior') {
      assert.match(rendererUtil, /ASPECT_BEHAVIOR/);
    } else {
      assert.equal(rendererUtil.includes(`'${aspect}'`), true, `${aspect} must have renderer border metadata`);
    }
  }
  assert.equal(Object.keys(officialCatalog.displayNames).length, officialCatalog.elements.length);

  for (const [ type, classification ] of Object.entries(officialCatalog.classifications)) {
    assert.equal(elements.get(type).domain, classification.domain, `${type} domain`);
    assert.equal(elements.get(type).aspect, classification.aspect, `${type} aspect`);
    assert.equal(elements.get(type).typeName, officialCatalog.displayNames[type], `${type} display name`);
  }
});

test('archimate 4 exposes relationship junction connectors outside the element catalog', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const elements = new Set(profile.elements.map((element) => element.type));
  const connectors = new Map(profile.connectors.map((connector) => [ connector.type, connector ]));

  assert.equal(profile.elements.length, 42);
  assert.equal(elements.has('AndJunction'), false);
  assert.equal(elements.has('OrJunction'), false);
  assert.equal(connectors.get('AndJunction').typeName, 'And Junction');
  assert.equal(connectors.get('OrJunction').typeName, 'Or Junction');
  assert.equal(connectors.get('AndJunction').domain, undefined);
  assert.equal(connectors.get('OrJunction').domain, undefined);
  assert.equal(connectors.get('AndJunction').paletteGroup, 'Relationships');
  assert.equal(connectors.get('OrJunction').paletteGroup, 'Relationships');
  assert.equal(connectors.get('AndJunction').colorGroup, 'Relationships');
  assert.equal(connectors.get('OrJunction').colorGroup, 'Relationships');
  assert.notEqual(connectors.get('AndJunction').palette, false);
  assert.notEqual(connectors.get('OrJunction').palette, false);
});

test('archimate 4 deliverable pictogram ref uses standard spelling', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const deliverable = profile.elements.find((element) => element.type === 'Deliverable');

  assert.equal(deliverable.pictoRef, 'PICTO_DELIVERABLE');
});

test('archimate 4 profile uses standard Stakeholder and Course of Action spelling', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const pathMap = await readFile(new URL('../lib/draw/PathMap.js', import.meta.url), 'utf8');
  const elements = new Map(profile.elements.map((element) => [ element.type, element ]));

  assert.equal(elements.get('Stakeholder').typeName, 'Stakeholder');
  assert.equal(elements.get('Stakeholder').pictoRef, 'PICTO_STAKEHOLDER');
  assert.equal(elements.get('CourseOfAction').typeName, 'Course of Action');
  assert.equal(profile.elements.some((element) => element.typeName === 'Course Of Action'), false);
  assert.equal(pathMap.includes("'PICTO_STAKEHOLDER'"), true);
  assert.equal(pathMap.includes("'PICTO_STAKHOLDER'"), true);
});

test('profile-aware metadata and palette include relationship junction connectors', async () => {
  const modelUtil = await readFile(new URL('../lib/util/ModelUtil.js', import.meta.url), 'utf8');
  const colorUtil = await readFile(new URL('../lib/util/ColorUtil.js', import.meta.url), 'utf8');
  const paletteProvider = await readFile(new URL('../lib/features/palette/PaletteProvider.js', import.meta.url), 'utf8');

  assert.match(modelUtil, /\(profile\.elements \|\| \[\]\)\.concat\(profile\.connectors \|\| \[\]\)/);
  assert.match(modelUtil, /element\.layer \|\| element\.domain \|\| element\.colorGroup/);
  assert.match(colorUtil, /\['Relationships', COLOR_DOMAIN_RELATIONSHIPS\]/);
  assert.match(paletteProvider, /getPaletteConcepts\(profile\)/);
  assert.match(paletteProvider, /value\.paletteGroup \|\| value\.domain \|\| value\.layer/);
  assert.match(paletteProvider, /\(profile\.elements \|\| \[\]\)\.concat\(profile\.connectors \|\| \[\]\)/);
});

test('archimate 4 palette exposes every standard element', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const css = await readFile(new URL('../assets/palette-icons.css', import.meta.url), 'utf8');

  assert.equal(profile.elements.length, 42);

  for (const element of profile.elements) {
    assert.notEqual(element.palette, false, `${element.type} must be available in the ArchiMate 4 palette`);
    assert.equal(
      css.includes('.' + element.className),
      true,
      `${element.type} palette class ${element.className} must have an icon rule`
    );
  }
});

test('archimate 4 Common Domain palette uses Common visual assets', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const css = await readFile(new URL('../assets/palette-icons.css', import.meta.url), 'utf8');
  const commonIcons = new Map([
    [ 'Role', 'common_role.svg' ],
    [ 'Collaboration', 'common_collaboration.svg' ],
    [ 'Path', 'common_path.svg' ],
    [ 'Service', 'common_service.svg' ],
    [ 'Process', 'common_process.svg' ],
    [ 'Function', 'common_function.svg' ],
    [ 'Event', 'common_event.svg' ],
    [ 'Grouping', 'common_grouping.svg' ],
    [ 'Location', 'common_location.svg' ]
  ]);

  for (const [ type, iconName ] of commonIcons) {
    const element = profile.elements.find((candidate) => candidate.type === type);
    const icon = await readFile(new URL('../assets/icons/' + iconName, import.meta.url), 'utf8');

    assert.equal(element.domain, 'Common', `${type} must remain a Common Domain element`);
    assert.equal(
      css.includes(`.${element.className} {\nbackground-image: url("./icons/${iconName}")`),
      true,
      `${type} palette class must use ${iconName}`
    );
    assert.match(icon, /#D9D3C8/, `${iconName} must use the Common Domain color`);
  }

  assert.doesNotMatch(css, /\.archimate-common-role \{\nbackground-image: url\("\.\/icons\/business_role\.svg"\)/);
  assert.doesNotMatch(css, /\.archimate-common-path \{\nbackground-image: url\("\.\/icons\/technology_path\.svg"\)/);
});

test('profile palette keeps ArchiMate 3 icons while separating ArchiMate 4 fallback icons', async () => {
  const css = await readFile(new URL('../assets/palette-icons.css', import.meta.url), 'utf8');
  const archimate4Icons = new Map([
    [ 'archimate-motivation-stakeholder', 'motivation_stakeholder.svg' ],
    [ 'archimate-motivation-driver', 'motivation_driver.svg' ],
    [ 'archimate-motivation-assessment', 'motivation_assessment.svg' ],
    [ 'archimate-motivation-goal', 'motivation_goal.svg' ],
    [ 'archimate-motivation-outcome', 'motivation_outcome.svg' ],
    [ 'archimate-motivation-principle', 'motivation_principle.svg' ],
    [ 'archimate-motivation-requirement', 'motivation_requirement.svg' ],
    [ 'archimate-motivation-meaning', 'motivation_meaning.svg' ],
    [ 'archimate-motivation-value', 'motivation_value.svg' ],
    [ 'archimate-technology-distribution-network', 'technology_distribution_network.svg' ],
    [ 'archimate-technology-equipment', 'technology_equipment.svg' ],
    [ 'archimate-technology-facility', 'technology_facility.svg' ],
    [ 'archimate-technology-material', 'technology_material.svg' ],
    [ 'archimate-imp-mig-work-package', 'imp_mig_work_package.svg' ],
    [ 'archimate-imp-mig-deliverable', 'imp_mig_deliverable.svg' ],
    [ 'archimate-imp-mig-plateau', 'imp_mig_plateau.svg' ],
    [ 'archimate-other-and-junction', 'other_and_junction.svg' ],
    [ 'archimate-other-or-junction', 'other_or_junction.svg' ]
  ]);

  assert.match(css, /\.archimate-business-role \{\nbackground-image: url\("\.\/icons\/business_role\.svg"\)/);
  assert.match(css, /\.archimate-business-object \{\nbackground-image: url\("\.\/icons\/business_object\.svg"\)/);

  for (const [ className, iconName ] of archimate4Icons) {
    const icon = await readFile(new URL('../assets/icons/' + iconName, import.meta.url), 'utf8');

    assert.equal(
      css.includes(`.${className} {\nbackground-image: url("./icons/${iconName}")`),
      true,
      `${className} must use ${iconName}`
    );
    assert.doesNotMatch(
      css,
      new RegExp(`\\.${className} \\{\\nbackground-image: url\\("\\./icons/business_object\\.svg"\\)`)
    );
    assert.match(icon, /<svg /, `${iconName} must be a local SVG asset`);
  }
});

test('context pad explains that relationship creation starts by dragging to a target element', async () => {
  const contextPadProvider = await readFile(new URL('../lib/features/context-pad/ContextPadProvider.js', import.meta.url), 'utf8');

  assert.match(contextPadProvider, /title: translate\('Drag to another element to create a relationship'\)/);
  assert.match(contextPadProvider, /title: translate\('Drag to another element to connect the note'\)/);
  assert.match(contextPadProvider, /'connect-element': \{[\s\S]*?action: \{\n {10}dragstart: startConnect,\n {8}\}/);
  assert.match(contextPadProvider, /'connect-note': \{[\s\S]*?action: \{\n {10}dragstart: startConnect,\n {8}\}/);
  assert.doesNotMatch(contextPadProvider, /title: translate\('Create Relation'\)/);
  assert.doesNotMatch(contextPadProvider, /title: translate\('Connect Note'\)/);
  assert.doesNotMatch(contextPadProvider, /click: startConnect/);
});

test('demo sample switches concepts by selected ArchiMate profile', async () => {
  const sample = await readFile(new URL('../demo/src/sample-canvas.js', import.meta.url), 'utf8');
  const archimate3Block = sample.match(/\[DEMO_ARCHIMATE3_VERSION\]: \{([\s\S]*?)\n {2}\},\n {2}\[DEMO_ARCHIMATE4_VERSION\]/)[1];
  const archimate4Block = sample.match(/\[DEMO_ARCHIMATE4_VERSION\]: \{([\s\S]*?)\n {2}\}\n\};/)[1];

  assert.match(sample, /getDemoProfile/);
  assert.match(sample, /normalizeArchimateVersion/);

  assert.match(archimate3Block, /type: 'BusinessRole'/);
  assert.match(archimate3Block, /type: 'BusinessService'/);
  assert.match(archimate3Block, /type: 'BusinessObject'/);
  assert.doesNotMatch(archimate3Block, /type: 'Role'/);
  assert.doesNotMatch(archimate3Block, /type: 'Service'/);
  assert.doesNotMatch(archimate3Block, /type: 'Equipment'/);

  assert.match(archimate4Block, /type: 'Role'/);
  assert.match(archimate4Block, /type: 'Service'/);
  assert.match(archimate4Block, /type: 'Path'/);
  assert.match(archimate4Block, /type: 'Grouping'/);
  assert.match(archimate4Block, /type: 'Equipment'/);
  assert.doesNotMatch(archimate4Block, /type: 'BusinessRole'/);
  assert.doesNotMatch(archimate4Block, /type: 'BusinessService'/);
});

test('archimate 4 profile pictogram refs are defined for renderer path map', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const pathMap = await readFile(new URL('../lib/draw/PathMap.js', import.meta.url), 'utf8');
  const concepts = profile.elements.concat(profile.connectors || []);

  for (const concept of concepts) {
    assert.equal(
      pathMap.includes("'" + concept.pictoRef + "'"),
      true,
      `${concept.type} references missing ${concept.pictoRef}`
    );
  }
});

test('archimate font exposes Fontello glyphs for every ArchiMate 4 element', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const config = await readJson('../archimate-font/lib/config.json');
  const css = await readFile(new URL('../archimate-font/lib/css/archimate-font.css', import.meta.url), 'utf8');
  const demo = await readFile(new URL('../archimate-font/lib/demo.html', import.meta.url), 'utf8');
  const fontSvg = await readFile(new URL('../archimate-font/lib/font/archimate-font.svg', import.meta.url), 'utf8');
  const glyphs = new Map(config.glyphs.map((glyph) => [ glyph.css, glyph ]));
  const codes = new Set(config.glyphs.map((glyph) => glyph.code));

  assert.equal(config.name, 'archimate-font');
  assert.equal(config.css_prefix_text, 'archimate-');
  assert.equal(config.glyphs.filter((glyph) => glyph.css.startsWith('element-')).length, 42);
  assert.equal(codes.size, config.glyphs.length);

  for (const element of profile.elements) {
    const cssName = `element-${kebab(element.type)}`;
    const glyph = glyphs.get(cssName);
    const sourceSvg = await readFile(new URL(`../archimate-font/src/elements/${cssName}.svg`, import.meta.url), 'utf8');

    assert.equal(Boolean(glyph), true, `${element.type} must have a Fontello glyph`);
    assert.equal(glyph.src, 'custom_icons', `${element.type} must use a custom Fontello icon`);
    assert.equal(glyph.selected, true, `${element.type} must be selected in Fontello config`);
    assert.equal(glyph.svg.width, 1000, `${element.type} glyph width`);
    assert.match(glyph.svg.path, /\S/, `${element.type} glyph path`);
    assert.match(css, new RegExp(`\\.archimate-${cssName}:before \\{ content: '\\\\[ef][0-9a-f]{3}'`));
    assert.match(demo, new RegExp(`archimate-${cssName}`));
    assert.match(fontSvg, new RegExp(`glyph-name="${cssName}"`));
    assert.match(sourceSvg, /<path d="[^"]+" fill="black" \/>/);
  }

  assert.equal(glyphs.get('element-role').code, 0xe819);
  assert.equal(glyphs.get('element-plateau').code, 0xe842);
});

test('archimate 4 palette keeps Fontello glyph classes out of diagram-js palette cells', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const paletteProvider = await readFile(new URL('../lib/features/palette/PaletteProvider.js', import.meta.url), 'utf8');
  const fontCss = await readFile(new URL('../archimate-font/lib/css/archimate-font.css', import.meta.url), 'utf8');

  assert.match(paletteProvider, /className: value\.className/);
  assert.doesNotMatch(paletteProvider, /archimate-profile-4-icon/);
  assert.doesNotMatch(paletteProvider, /archimate-element-' \+ kebab\(value\.type\)/);
  assert.doesNotMatch(paletteProvider, /archimate-relation-and-junction/);
  assert.doesNotMatch(paletteProvider, /archimate-relation-or-junction/);

  for (const element of profile.elements) {
    assert.match(fontCss, new RegExp(`\\.archimate-element-${kebab(element.type)}:before`));
  }
});

test('active profile rejects concepts and relationships outside the selected version', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const elementFactory = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');
  const connectionUpdater = await readFile(new URL('../lib/features/modeling/ConnectionUpdater.js', import.meta.url), 'utf8');
  const importer = await readFile(new URL('../lib/import/Importer.js', import.meta.url), 'utf8');

  assert.match(languageIndex, /export function hasProfileConcept/);
  assert.match(languageIndex, /export function hasProfileRelationship/);
  assert.match(elementFactory, /assertConceptAvailable\(attrs\.type, profile, translate\)/);
  assert.match(elementFactory, /assertRelationshipAvailable\(type, profile, translate\)/);
  assert.match(elementFactory, /type === CONNECTION_RELATIONSHIP/);
  assert.match(connectionUpdater, /function getViewElements\(view\)/);
  assert.match(connectionUpdater, /view\.viewElements = \[\]/);
  assert.match(elementFactory, /ArchiMate concept \{type\} is not available in ArchiMate \{version\}/);
  assert.match(elementFactory, /ArchiMate relationship \{type\} is not available in ArchiMate \{version\}/);
  assert.match(importer, /throw createImportError\(e, viewElement\)/);
  assert.match(importer, /throw createImportError\(e, connectionElement\)/);
});

test('renderer uses active language profile pictogram refs', async () => {
  const renderer = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(renderer, /canvas, textRenderer, languageProfile, priority\)/);
  assert.match(renderer, /var profile = languageProfile && languageProfile\.get\(\)/);
  assert.match(renderer, /getPictoRef\(elementType, profile\)/);
  assert.match(renderer, /'languageProfile'/);
  assert.doesNotMatch(renderer, /getPictoRef\(elementType\);/);
});

test('language profile customization supports C260 specialization profiles', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const languageProfile = await readFile(new URL('../lib/core/languageProfile.js', import.meta.url), 'utf8');
  const relationshipUtil = await readFile(new URL('../lib/util/RelationshipUtil.js', import.meta.url), 'utf8');
  const elementFactory = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');
  const packageEntrypoint = await readFile(new URL('../index.js', import.meta.url), 'utf8');

  assert.match(languageIndex, /export function createLanguageProfile/);
  assert.match(languageIndex, /parseLanguageProfileCustomization/);
  assert.match(languageIndex, /must declare specializes/);
  assert.match(languageIndex, /export function getBaseConceptTypeForProfile/);
  assert.match(languageProfile, /archimateLanguageProfile/);
  assert.match(relationshipUtil, /getBaseConceptTypeForProfile\(targetElementType, profile\)/);
  assert.match(relationshipUtil, /getBaseConceptTypeForProfile\(targetType, profile\)/);
  assert.match(elementFactory, /getDomainColor\(domain \|\| layer, profile\)/);
  assert.match(packageEntrypoint, /createLanguageProfile/);
});

test('language profile customization validates C260 profile attribute definitions', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const entrypoint = await readFile(new URL('../index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');

  assert.match(languageIndex, /PROFILE_ATTRIBUTE_TYPES/);
  assert.match(languageIndex, /validateProfileAttribute\(attribute, profile\)/);
  assert.match(languageIndex, /export function getProfileAttributesForConcept/);
  assert.match(languageIndex, /Custom ArchiMate profile attributes require concept/);
  assert.match(languageIndex, /Custom ArchiMate profile attributes require name/);
  assert.match(languageIndex, /Unsupported ArchiMate profile attribute concept/);
  assert.match(languageIndex, /Unsupported ArchiMate profile attribute type/);
  assert.match(languageIndex, /hasProfileConcept\(attribute\.concept, profile\)/);
  assert.match(languageIndex, /hasProfileRelationship\(attribute\.concept, profile\)/);
  assert.match(entrypoint, /normalizeProfileAttributeValue/);
  assert.match(entrypoint, /isProfileAttributeValueValid/);
  assert.match(entrypoint, /setProfileAttributePropertyValue/);
  assert.match(entrypoint, /getProfileAttributePropertyValue/);
  assert.match(readme, /Profile attributes require a supported ArchiMate concept and typed value/);
  assert.match(readme, /Profile attribute values can also be stored as model `Properties`/);
  assert.match(sources, /Profile attributes are validated as C260 typed attributes/);
  assert.match(sources, /Profile attribute values can be normalized and validated/);
  assert.match(sources, /Profile attribute values can also be written to model `Properties`/);
});

test('language profile customization supports relationship specializations', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const relationshipUtil = await readFile(new URL('../lib/util/RelationshipUtil.js', import.meta.url), 'utf8');
  const junctionUtil = await readFile(new URL('../lib/util/JunctionUtil.js', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');

  assert.match(sources, /Specializations of Relationships and Junctions/);
  assert.match(languageIndex, /export function getProfileRelationship/);
  assert.match(languageIndex, /export function getBaseRelationshipTypeForProfile/);
  assert.match(languageIndex, /normalizeRelationshipDefinition\(relationship\)/);
  assert.match(languageIndex, /Custom ArchiMate relationship .* must declare specializes/);
  assert.match(languageIndex, /specializes unknown relationship/);
  assert.match(relationshipUtil, /getBaseRelationshipTypeForProfile\(relationshipType, profile\)/);
  assert.match(relationshipUtil, /relationship === baseRelationshipType/);
  assert.match(junctionUtil, /getBaseRelationshipTypeForProfile\(type, profile\)/);
});

test('relationship specializations are available in editor menus and inherit base behavior', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const relationshipUtil = await readFile(new URL('../lib/util/RelationshipUtil.js', import.meta.url), 'utf8');
  const connectionOptions = await readFile(new URL('../lib/features/popup-menu/ConnectionOptions.js', import.meta.url), 'utf8');
  const connectionMenuProvider = await readFile(new URL('../lib/features/popup-menu/ConnectionMenuProvider.js', import.meta.url), 'utf8');
  const elementFactory = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');
  const connectionUpdater = await readFile(new URL('../lib/features/modeling/ConnectionUpdater.js', import.meta.url), 'utf8');
  const replaceRelationshipRefHandler = await readFile(new URL('../lib/features/modeling/cmd/ReplaceRelationshipRefHandler.js', import.meta.url), 'utf8');
  const renderer = await readFile(new URL('../lib/draw/ArchimateRenderer.js', import.meta.url), 'utf8');

  assert.match(languageIndex, /export function getSpecializedRelationshipTypesForProfile/);
  assert.match(relationshipUtil, /getSpecializedRelationshipTypesForProfile\(relationship, profile\)/);
  assert.match(relationshipUtil, /addAllowedRelationship\(relationshipsAllowed, specializedType, excludedRelationType\)/);
  assert.match(connectionMenuProvider, /getRelationshipsMenu\(relationshipsAllowed, true, directSubTitle, profile\)/);
  assert.match(connectionMenuProvider, /getBaseRelationshipTypeForProfile\(element\.type, profile\)/);
  assert.match(connectionMenuProvider, /type: element\.type/);
  assert.match(connectionOptions, /getProfileRelationship\(relationshipType, profile\)/);
  assert.match(connectionOptions, /getBaseRelationshipTypeForProfile\(relationshipType, profile\)/);
  assert.match(connectionOptions, /relationshipDefinition\.typeName/);
  assert.match(connectionOptions, /kebab\(relationshipType\) \+ '-connect'/);
  assert.match(elementFactory, /setAttrsRelationshipRef\(connectionAttrs, archimateConnection\.relationshipRef, profile\)/);
  assert.match(elementFactory, /baseRelationshipType === 'Access'/);
  assert.match(connectionUpdater, /'languageProfile'/);
  assert.match(connectionUpdater, /isRelationshipBaseType\(connection\.type, RELATIONSHIP_ACCESS, profile\)/);
  assert.match(replaceRelationshipRefHandler, /'languageProfile'/);
  assert.match(replaceRelationshipRefHandler, /isRelationshipBaseType\(type, RELATIONSHIP_INFLUENCE, profile\)/);
  assert.match(renderer, /getBaseRelationshipTypeForProfile\(type, profile\)/);
  assert.match(renderer, /h = this\.handlers\[baseType\]/);
});

test('archimate 4 shape metadata preserves domain terminology', async () => {
  const modelUtil = await readFile(new URL('../lib/util/ModelUtil.js', import.meta.url), 'utf8');
  const elementFactory = await readFile(new URL('../lib/features/modeling/ElementFactory.js', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');

  assert.match(officialSpec, /UI and docs should use "domain" rather than the old/);
  assert.match(modelUtil, /export function getDomainType/);
  assert.match(elementFactory, /getDomainType\(attrs\.type, profile\)/);
  assert.match(elementFactory, /domain: domain/);
});

test('language profile customization supports viewpoint definitions', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');

  assert.match(languageIndex, /VIEWPOINT_PURPOSES/);
  assert.match(languageIndex, /VIEWPOINT_CONTENT_TYPES/);
  assert.match(languageIndex, /mergeViewpoints\(profile, customProfile\)/);
  assert.match(languageIndex, /validateViewpoint\(viewpoint, profile\)/);
  assert.match(languageIndex, /Unsupported ArchiMate viewpoint/);
  assert.match(languageIndex, /validateViewpointTypeList\(viewpoint\.allowedElementTypes/);
  assert.match(languageIndex, /validateViewpointTypeList\(viewpoint\.allowedRelationshipTypes/);
  assert.match(languageIndex, /hasProfileConcept\(type, profile\)/);
  assert.match(languageIndex, /hasProfileRelationship\(type, profile\)/);
  assert.match(languageIndex, /Custom ArchiMate viewpoint ' \+ fieldName \+ ' entries require type/);
  assert.match(languageIndex, /Unsupported ArchiMate viewpoint ' \+ fieldName \+ ': ' \+ type/);
  assert.match(readme, /viewpoints/);
  assert.match(sources, /allowed element and relationship types against the active profile/);
});

test('archimate 4 implementation status is machine-readable and preserves external blockers', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const entrypoint = await readFile(new URL('../index.js', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');

  assert.equal(profile.conformance.standard, 'ArchiMate 4 Specification C260');
  assert.equal(profile.conformance.elementCatalog.expectedCount, 42);
  assert.equal(profile.conformance.elementCatalog.status, 'implemented');
  assert.equal(profile.conformance.relationshipMatrix.status, 'external-profile-required');
  assert.equal(profile.conformance.exchangeFormat.status, 'experimental');
  assert.equal(profile.conformance.exchangeFormat.officialXsdRequired, true);
  assert.equal(profile.conformance.iconography.status, 'local-renderer-coverage');
  assert.equal(profile.conformance.iconography.exactAppendixAVectorsConfirmed, false);

  assert.match(languageIndex, /export function getArchimate4ImplementationStatus/);
  assert.match(languageIndex, /relationshipProfile: getArchimate4RelationshipProfileStatus\(\)/);
  assert.match(languageIndex, /externalBlockers: \[/);
  assert.match(languageIndex, /officialAppendixBRelationshipMatrix/);
  assert.match(languageIndex, /officialMeff4Xsd/);
  assert.match(languageIndex, /exactAppendixAArtworkRights/);
  assert.match(entrypoint, /getArchimate4ImplementationStatus/);
  assert.match(sources, /getArchimate4ImplementationStatus\(\)/);
});

test('archimate 4 implementation status tracks dedicated local pictogram coverage', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const pathMap = await readFile(new URL('../lib/draw/PathMap.js', import.meta.url), 'utf8');
  const iconography = profile.conformance.iconography;

  assert.equal(iconography.profilePictogramCoverage, 'dedicated-local-paths');
  assert.equal(iconography.genericObjectAliasCount, 0);
  assert.deepEqual(iconography.legacyCompatibilityAliases, [ 'PICTO_DELIVRABLE', 'PICTO_STAKHOLDER' ]);
  assert.doesNotMatch(pathMap, /'PICTO_[A-Z_]+': 'PICTO_OBJECT'/);

  for (const concept of profile.elements.concat(profile.connectors || [])) {
    if (concept.pictoRef === 'PICTO_OBJECT') {
      continue;
    }

    assert.match(
      pathMap,
      new RegExp("'" + concept.pictoRef + "': \\{"),
      `${concept.type} must use a dedicated PathMap entry for ${concept.pictoRef}`
    );
  }
});

test('archimate 4 implementation status exposes source coverage boundaries', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const sourceCoverage = profile.conformance.sourceCoverage;

  assert.equal(sourceCoverage.c260.status, 'local-licensed-source-reviewed');
  assert.equal(sourceCoverage.w262.status, 'external-download-required');
  assert.equal(sourceCoverage.w262.url, 'https://publications.opengroup.org/w262');
  assert.equal(sourceCoverage.w262.localSourcePresent, false);
  assert.equal(sourceCoverage.meff4Xsd.status, 'external-source-required');

  assert.match(languageIndex, /sourceCoverage: summarizeSourceCoverage/);
  assert.match(languageIndex, /missingCompanionSources/);
  assert.match(sources, /W262 is published by The Open Group as a free PDF download/);
});

test('archimate 4 conformance requirements are tracked per C260 shall and may clauses', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const requirements = profile.conformance.requirements;
  const byId = new Map(requirements.map((requirement) => [ requirement.id, requirement ]));

  assert.equal(requirements.filter((requirement) => requirement.level === 'shall').length, 5);
  assert.equal(requirements.filter((requirement) => requirement.level === 'may').length, 1);
  assert.equal(byId.get('language-structure').status, 'implemented');
  assert.equal(byId.get('standard-iconography').status, 'local-renderer-coverage');
  assert.equal(byId.get('standard-iconography').externalBlocker, 'exactAppendixAArtworkRights');
  assert.equal(byId.get('viewpoint-mechanism').status, 'implemented');
  assert.equal(byId.get('language-customization').status, 'implemented');
  assert.equal(byId.get('language-customization').implementationDefined, true);
  assert.equal(byId.get('appendix-b-relationships').status, 'external-profile-required');
  assert.equal(byId.get('appendix-b-relationships').externalBlocker, 'officialAppendixBRelationshipMatrix');
  assert.equal(byId.get('example-viewpoints').level, 'may');
  assert.equal(byId.get('example-viewpoints').status, 'not-bundled-informative');

  assert.match(languageIndex, /conformanceRequirements: summarizeConformanceRequirements/);
  assert.match(languageIndex, /function summarizeConformanceRequirements/);
  assert.match(sources, /C260 conformance requirements are represented per shall\/may clause/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

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

async function runNodeModule(source) {
  return execFileAsync(process.execPath, [ '--input-type=module', '-e', source ], {
    cwd: new URL('..', import.meta.url)
  });
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
  const connectorTypes = profile.connectors.map((connector) => connector.type);
  const expectedConnectorTypes = profile.conformance.relationshipConnectors.expectedTypes;

  assert.equal(profile.elements.length, 42);
  assert.equal(profile.conformance.relationshipConnectors.status, 'implemented-experimental-exchange');
  assert.equal(profile.conformance.relationshipConnectors.expectedCount, 2);
  assert.deepEqual(profile.conformance.relationshipConnectors.expectedTypes, [ 'AndJunction', 'OrJunction' ]);
  assert.deepEqual(connectorTypes, expectedConnectorTypes);
  assert.deepEqual(expectedConnectorTypes.filter((type) => !connectors.has(type)), []);
  assert.deepEqual(connectorTypes.filter((type) => !expectedConnectorTypes.includes(type)), []);
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
  const officialCatalog = await readJson('./fixtures/archimate4-c260-element-catalog.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const entrypoint = await readFile(new URL('../index.js', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const expectedExternalBlockerIds = [
    'officialAppendixBRelationshipMatrix',
    'officialMeff4Xsd',
    'exactAppendixAArtworkRights'
  ];

  assert.equal(profile.conformance.standard, 'ArchiMate 4 Specification C260');
  assert.equal(profile.conformance.elementCatalog.expectedCount, 42);
  assert.deepEqual(profile.conformance.elementCatalog.expectedTypes, officialCatalog.elements);
  assert.equal(profile.conformance.elementCatalog.status, 'implemented');
  assert.equal(profile.conformance.relationshipMatrix.status, 'external-profile-required');
  assert.equal(profile.conformance.exchangeFormat.status, 'experimental');
  assert.equal(profile.conformance.exchangeFormat.officialXsdRequired, true);
  assert.equal(profile.conformance.exchangeFormat.internalRoundTripTested, true);
  assert.equal(
    profile.conformance.exchangeFormat.internalRoundTripRunlogPath,
    'project_memory/runlogs/20260709-781-xml-roundtrip-exchange-format-test.txt'
  );
  assert.equal(profile.conformance.exchangeFormat.officialConformanceClaimable, false);
  assert.equal(profile.conformance.iconography.status, 'local-renderer-coverage');
  assert.equal(profile.conformance.iconography.exactAppendixAVectorsConfirmed, false);
  assert.equal(profile.conformance.externalBlockerCatalog.status, 'external-source-dependent');
  assert.deepEqual(profile.conformance.externalBlockerCatalog.expectedIds, expectedExternalBlockerIds);

  assert.match(languageIndex, /export function getArchimate4ImplementationStatus/);
  assert.match(languageIndex, /function summarizeElementCatalog/);
  assert.match(languageIndex, /function summarizeRelationshipConnectorCatalog/);
  assert.match(languageIndex, /relationshipConnectors: summarizeRelationshipConnectorCatalog/);
  assert.match(languageIndex, /types: summary\.actualTypes/);
  assert.match(languageIndex, /function summarizeTypeCatalog/);
  assert.match(languageIndex, /actualTypes/);
  assert.match(languageIndex, /missingTypes/);
  assert.match(languageIndex, /extraTypes/);
  assert.match(languageIndex, /relationshipProfile: getArchimate4RelationshipProfileStatus\(\)/);
  assert.match(languageIndex, /exchangeFormat: conformance\.exchangeFormat/);
  assert.match(languageIndex, /var externalBlockerCatalog = summarizeExternalBlockers/);
  assert.match(languageIndex, /externalBlockerCatalog: externalBlockerCatalog/);
  assert.match(languageIndex, /externalBlockers: externalBlockerCatalog\.actualIds/);
  assert.doesNotMatch(languageIndex, /var externalBlockers = \[/);
  assert.match(entrypoint, /getArchimate4ImplementationStatus/);
  assert.match(sources, /getArchimate4ImplementationStatus\(\)/);
  assert.match(readme, /elementCatalog\.(expectedTypes|missingTypes|extraTypes)/);
  assert.match(readme, /relationshipConnectors\.(expectedTypes|missingTypes|extraTypes)/);
  assert.match(readme, /exchangeFormat\.internalRoundTripTested/);
  assert.match(readme, /externalBlockerCatalog\.expectedIds/);
  assert.match(sources, /read\/write\/read coverage/);
  assert.match(sources, /externalBlockerCatalog\.actualIds/);
  assert.match(officialSpec, /internally round-trip tested/);
  assert.match(officialSpec, /expectedTypes/);
  assert.match(officialSpec, /missingTypes/);
  assert.match(officialSpec, /extraTypes/);
  assert.match(officialSpec, /externalBlockerCatalog\.missingIds/);
});

test('archimate 4 implementation status exposes C260 definition vocabulary identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const definitionCatalog = profile.conformance.definitionCoverageCatalog;
  const definitions = profile.conformance.definitionCoverage;
  const expectedDefinitionIds = [
    'archimate-core-language',
    'archimate-full-language',
    'architecture-domain',
    'architecture-view',
    'architecture-viewpoint',
    'aspect',
    'attribute',
    'composite-element',
    'concept',
    'conformance',
    'conforming-implementation',
    'core-element',
    'domain',
    'element',
    'model',
    'relationship'
  ];

  assert.equal(definitionCatalog.status, 'c260-outline-derived');
  assert.equal(definitionCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(definitionCatalog.expectedCount, expectedDefinitionIds.length);
  assert.deepEqual(definitionCatalog.expectedIds, expectedDefinitionIds);
  assert.deepEqual(definitions.map((definition) => definition.id), expectedDefinitionIds);
  assert.equal(definitions.every((definition) => definition.c260Section && definition.term), true);

  assert.match(languageIndex, /function summarizeDefinitionCoverage/);
  assert.match(languageIndex, /definitionCoverage: definitionCoverage/);
  assert.match(languageIndex, /missingDefinitionIds/);
  assert.match(readme, /definitionCoverage\.expectedIds/);
  assert.match(sources, /definitionCoverage\.actualIds/);
  assert.match(officialSpec, /definitionCoverage\.missingDefinitionIds/);
});

test('archimate 4 implementation status API can be imported directly by Node ESM', async () => {
  const { stdout } = await runNodeModule(`
    import { getArchimate4ImplementationStatus } from './lib/metamodel/languages/index.js';
    const status = getArchimate4ImplementationStatus();
    console.log(JSON.stringify({
      version: status.version,
      sectionCoverageComplete: status.sectionCoverage.complete,
      officialConformanceClaimable: status.conformanceReadiness.officialConformanceClaimable
    }));
  `);
  const status = JSON.parse(stdout.trim());

  assert.deepEqual(status, {
    version: '4.0',
    sectionCoverageComplete: true,
    officialConformanceClaimable: false
  });
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
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const sourceCoverage = profile.conformance.sourceCoverage;
  const sourceCoverageCatalog = profile.conformance.sourceCoverageCatalog;
  const expectedSourceIds = [
    'c260',
    'w262',
    'launchTranscript',
    'appendixBRelationshipMatrix',
    'meff4Xsd',
    'appendixAArtworkRights'
  ];

  assert.equal(sourceCoverageCatalog.status, 'implemented-with-external-blockers');
  assert.deepEqual(sourceCoverageCatalog.expectedSourceIds, expectedSourceIds);
  assert.deepEqual(sourceCoverageCatalog.requiredSourceIds, [
    'appendixBRelationshipMatrix',
    'meff4Xsd',
    'appendixAArtworkRights'
  ]);
  assert.deepEqual(sourceCoverageCatalog.companionSourceIds, [ 'w262' ]);
  assert.deepEqual(Object.keys(sourceCoverage), expectedSourceIds);
  assert.equal(sourceCoverage.c260.status, 'local-licensed-source-reviewed');
  assert.equal(sourceCoverage.w262.status, 'external-download-required');
  assert.equal(sourceCoverage.w262.url, 'https://publications.opengroup.org/w262');
  assert.equal(sourceCoverage.w262.localSourcePresent, false);
  assert.equal(sourceCoverage.w262.publicationPageStatusCode, 200);
  assert.equal(sourceCoverage.w262.lastLocalSearchAt, '2026-07-09T08:10:22+09:00');
  assert.equal(sourceCoverage.w262.lastLocalSearchRunlogPath, 'project_memory/runlogs/20260709-626-w262-local-source-search.txt');
  assert.deepEqual(sourceCoverage.w262.localSearchRoots, [
    'C:\\Users\\syska\\Downloads',
    'C:\\Users\\syska\\.codex\\attachments'
  ]);
  assert.deepEqual(sourceCoverage.w262.localSearchMatchedFiles, []);
  assert.equal(sourceCoverage.appendixBRelationshipMatrix.status, 'external-profile-required');
  assert.equal(sourceCoverage.appendixBRelationshipMatrix.localC260SourceReviewed, true);
  assert.equal(sourceCoverage.appendixBRelationshipMatrix.localSourceMeaning, 'redistributable Appendix B profile artifact');
  assert.equal(sourceCoverage.appendixBRelationshipMatrix.redistributableProfilePresent, false);
  assert.equal(sourceCoverage.appendixBRelationshipMatrix.externalProfileLoaderImplemented, true);
  assert.equal(sourceCoverage.appendixBRelationshipMatrix.coverageReportImplemented, true);
  assert.equal(
    sourceCoverage.appendixBRelationshipMatrix.relationshipProfileStatusApi,
    'getArchimate4RelationshipProfileStatus'
  );
  assert.equal(
    sourceCoverage.appendixBRelationshipMatrix.relationshipProfileCoverageApi,
    'getArchimate4RelationshipProfileCoverageReport'
  );
  assert.equal(sourceCoverage.meff4Xsd.status, 'external-source-required');
  assert.equal(sourceCoverage.meff4Xsd.directoryStatusCode, 200);
  assert.equal(sourceCoverage.meff4Xsd.official4XsdDiscovered, false);
  assert.equal(sourceCoverage.meff4Xsd.lastRunlogPath, 'project_memory/runlogs/20260709-731-meff4-xsd-latest-recheck.txt');
  assert.deepEqual(sourceCoverage.meff4Xsd.discoveredXsdLinks, [
    '3.1/archimate3_Model.xsd',
    '3.1/archimate3_View.xsd',
    '3.1/archimate3_Diagram.xsd'
  ]);
  assert.equal(sourceCoverage.meff4Xsd.candidateStatusCodes['https://www.opengroup.org/xsd/archimate/4.0/'], 404);
  assert.equal(
    sourceCoverage.meff4Xsd.candidateStatusCodes[
      'https://www.opengroup.org/xsd/archimate/4.0/archimate4_Model.xsd'
    ],
    404
  );
  assert.equal(sourceCoverage.meff4Xsd.candidateStatusCodes['https://www.opengroup.org/xsd/archimate/4.0/archimate4.xsd'], 404);
  assert.equal(
    sourceCoverage.meff4Xsd.candidateStatusCodes[
      'https://www.opengroup.org/xsd/archimate/4.0/archimate4_ModelExchangeFile.xsd'
    ],
    404
  );

  assert.match(languageIndex, /var sourceCoverage = summarizeSourceCoverage\(\s*conformance\.sourceCoverage \|\| \{\},\s*conformance\.sourceCoverageCatalog \|\| \{\}/);
  assert.match(languageIndex, /actualSourceIds/);
  assert.match(languageIndex, /missingSourceIds/);
  assert.match(languageIndex, /extraSourceIds/);
  assert.match(languageIndex, /sourceCoverage: sourceCoverage/);
  assert.match(languageIndex, /missingCompanionSources/);
  assert.match(readme, /sourceCoverage\.expectedSourceIds/);
  assert.match(readme, /sourceCoverage\.missingSourceIds/);
  assert.match(sources, /W262 is published by The Open Group as a free PDF download/);
  assert.match(sources, /sourceCoverage\.actualSourceIds/);
  assert.match(sources, /20260709-626-w262-local-source-search/);
  assert.match(sources, /redistributable Appendix B profile artifact is still not present/);
  assert.match(sources, /20260709-731-meff4-xsd-latest-recheck/);
  assert.match(officialSpec, /sourceCoverage\.expectedSourceIds/);
});

test('archimate 4 implementation status exposes official conformance readiness', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const readiness = profile.conformance.readiness;

  assert.equal(readiness.officialConformanceClaimable, false);
  assert.equal(readiness.reason, 'external-blockers-remain');
  assert.deepEqual(readiness.blockers, [
    'officialAppendixBRelationshipMatrix',
    'officialMeff4Xsd',
    'exactAppendixAArtworkRights'
  ]);
  assert.deepEqual(readiness.requiredBeforeClaim, [
    'Load an official or redistributable Appendix B relationship profile',
    'Confirm the official MEFF 4.0 XSD namespace and serialization details',
    'Confirm exact Appendix A vector-artwork redistribution rights or approved artwork source'
  ]);
  assert.deepEqual(readiness.requiredBeforeClaimBlockerIds, [
    'officialAppendixBRelationshipMatrix',
    'officialMeff4Xsd',
    'exactAppendixAArtworkRights'
  ]);
  assert.deepEqual(readiness.requiredBeforeClaimByBlocker, {
    officialAppendixBRelationshipMatrix: 'Load an official or redistributable Appendix B relationship profile',
    officialMeff4Xsd: 'Confirm the official MEFF 4.0 XSD namespace and serialization details',
    exactAppendixAArtworkRights: 'Confirm exact Appendix A vector-artwork redistribution rights or approved artwork source'
  });

  assert.match(languageIndex, /conformanceReadiness: summarizeConformanceReadiness/);
  assert.match(languageIndex, /officialConformanceClaimable/);
  assert.match(languageIndex, /requiredBeforeClaimByBlocker/);
  assert.match(languageIndex, /missingRequiredBeforeClaimBlockerIds/);
  assert.match(languageIndex, /extraRequiredBeforeClaimBlockerIds/);
  assert.match(languageIndex, /implementedShallCount/);
  assert.match(languageIndex, /externalBlockedShallCount/);
  assert.match(languageIndex, /missingRequiredSources/);
  assert.match(languageIndex, /missingCompanionSources/);
  assert.match(languageIndex, /external-blockers-remain/);
  assert.match(readme, /conformanceReadiness\.officialConformanceClaimable/);
  assert.match(readme, /conformanceReadiness\.missingRequiredBeforeClaimBlockerIds/);
  assert.match(sources, /officialConformanceClaimable: false/);
  assert.match(sources, /requiredBeforeClaimByBlocker/);
  assert.match(officialSpec, /conformanceReadiness\.officialConformanceClaimable/);
  assert.match(officialSpec, /missingRequiredBeforeClaimBlockerIds/);

  assert.equal(profile.conformance.requirements.filter((requirement) => requirement.level === 'shall' && requirement.status === 'implemented').length, 3);
  assert.equal(profile.conformance.requirements.filter((requirement) => requirement.level === 'shall' && requirement.externalBlocker).length, 2);
  assert.deepEqual(Object.keys(profile.conformance.sourceCoverage).filter((key) => profile.conformance.sourceCoverage[key].required && profile.conformance.sourceCoverage[key].localSourcePresent === false), [
    'appendixBRelationshipMatrix',
    'meff4Xsd',
    'appendixAArtworkRights'
  ]);
  assert.deepEqual(Object.keys(profile.conformance.sourceCoverage).filter((key) => profile.conformance.sourceCoverage[key].companion && profile.conformance.sourceCoverage[key].localSourcePresent === false), [ 'w262' ]);
});

test('archimate 4 implementation status exposes remaining gap identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const gapCatalog = profile.conformance.gapCatalog;
  const gaps = profile.conformance.gaps;
  const expectedGapIds = [
    'officialAppendixBRelationshipMatrix',
    'officialMeff4Xsd',
    'exactAppendixAArtworkRights',
    'w262CompanionPaper'
  ];

  assert.equal(gapCatalog.status, 'external-source-dependent');
  assert.deepEqual(gapCatalog.expectedIds, expectedGapIds);
  assert.deepEqual(gaps.map((gap) => gap.id), expectedGapIds);
  assert.deepEqual(gaps.filter((gap) => gap.officialConformanceBlocker).map((gap) => gap.id), [
    'officialAppendixBRelationshipMatrix',
    'officialMeff4Xsd',
    'exactAppendixAArtworkRights'
  ]);
  assert.deepEqual(gaps.filter((gap) => gap.companion).map((gap) => gap.sourceId), [ 'w262' ]);

  assert.match(languageIndex, /var remainingGaps = summarizeRemainingGaps/);
  assert.match(languageIndex, /remainingGaps: remainingGaps/);
  assert.match(languageIndex, /missingOfficialConformanceGapIds/);
  assert.match(languageIndex, /missingCompanionGapSourceIds/);
  assert.match(readme, /remainingGaps\.expectedIds/);
  assert.match(sources, /remainingGaps\.actualIds/);
  assert.match(officialSpec, /remainingGaps\.missingIds/);
});

test('archimate 4 implementation status exposes C260 section coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const sectionCatalog = profile.conformance.sectionCoverageCatalog;
  const sections = profile.conformance.sectionCoverage;
  const requirementIds = profile.conformance.requirements.map((requirement) => requirement.id);
  const externalBlockerIds = profile.conformance.externalBlockerCatalog.expectedIds;
  const expectedSectionIds = [
    'introduction-and-conformance',
    'definitions',
    'language-structure',
    'common-domain',
    'relationships-and-junctions',
    'motivation-domain',
    'strategy-domain',
    'business-domain',
    'application-domain',
    'technology-domain',
    'relationships-between-core-domains',
    'implementation-and-migration-domain',
    'viewpoint-mechanism',
    'language-customization',
    'appendix-a-notation',
    'appendix-b-relationships',
    'appendix-c-example-viewpoints',
    'appendix-e-version-changes'
  ];
  const expectedRequirementIds = [
    'language-structure',
    'viewpoint-mechanism',
    'language-customization',
    'standard-iconography',
    'appendix-b-relationships',
    'example-viewpoints'
  ];
  const expectedExternalBlockerIds = [
    'exactAppendixAArtworkRights',
    'officialAppendixBRelationshipMatrix'
  ];
  const sectionRequirementIds = sections
    .map((section) => section.requirementId)
    .filter(Boolean);
  const sectionExternalBlockerIds = sections
    .map((section) => section.externalBlocker)
    .filter(Boolean);

  assert.equal(sectionCatalog.status, 'c260-outline-derived');
  assert.equal(sectionCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(sectionCatalog.expectedCount, expectedSectionIds.length);
  assert.deepEqual(sectionCatalog.expectedIds, expectedSectionIds);
  assert.deepEqual(sectionCatalog.expectedRequirementIds, expectedRequirementIds);
  assert.deepEqual(sectionCatalog.expectedExternalBlockerIds, expectedExternalBlockerIds);
  assert.deepEqual(sections.map((section) => section.id), expectedSectionIds);
  assert.equal(sections.every((section) => section.c260Section), true);
  assert.deepEqual(sectionRequirementIds, expectedRequirementIds);
  assert.deepEqual(sectionExternalBlockerIds, expectedExternalBlockerIds);
  assert.equal(sectionRequirementIds.every((id) => requirementIds.includes(id)), true);
  assert.equal(sectionExternalBlockerIds.every((id) => externalBlockerIds.includes(id)), true);
  assert.deepEqual(sections.filter((section) => section.externalBlocker).map((section) => section.id), [
    'appendix-a-notation',
    'appendix-b-relationships'
  ]);
  assert.deepEqual(sections.filter((section) => section.optional).map((section) => section.id), [
    'appendix-c-example-viewpoints'
  ]);

  assert.match(languageIndex, /var sectionCoverage = summarizeSectionCoverage/);
  assert.match(languageIndex, /sectionCoverage: sectionCoverage/);
  assert.match(languageIndex, /externalDependentIds/);
  assert.match(languageIndex, /missingRequirementReferenceIds/);
  assert.match(languageIndex, /missingExternalBlockerReferenceIds/);
  assert.match(readme, /sectionCoverage\.expectedIds/);
  assert.match(readme, /sectionCoverage\.missingRequirementReferenceIds/);
  assert.match(sources, /sectionCoverage\.actualIds/);
  assert.match(sources, /sectionCoverage\.missingExternalBlockerReferenceIds/);
  assert.match(officialSpec, /sectionCoverage\.missingIds/);
  assert.match(officialSpec, /sectionCoverage\.missingRequirementReferenceIds/);
  assert.match(plan, /Section coverage status reports/);
});

test('archimate 4 implementation plan records current execution boundary', async () => {
  const plan = await readFile(
    new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url),
    'utf8'
  );

  assert.match(plan, /## Current Execution Status/);
  assert.match(plan, /M0 Source Gate/);
  assert.match(plan, /M1 Runtime Boundary/);
  assert.match(plan, /M2 XML Boundary/);
  assert.match(plan, /M3 Semantics/);
  assert.match(plan, /M4 Modeling UX/);
  assert.match(plan, /M5 Release Readiness/);
  assert.match(plan, /getArchimate4ImplementationStatus\(\)/);
  assert.match(plan, /expectedTypes/);
  assert.match(plan, /missingTypes/);
  assert.doesNotMatch(plan, /As of commit/);
  assert.match(plan, /Official Appendix B relationship matrix data/);
  assert.match(plan, /Official MEFF 4\.0 XSD/);
  assert.match(plan, /W262 is still not present locally/);
  assert.match(plan, /Exact Appendix A vector artwork redistribution rights remain unconfirmed/);
});

test('archimate 4 conformance requirements are tracked per C260 shall and may clauses', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const requirements = profile.conformance.requirements;
  const requirementCatalog = profile.conformance.requirementCatalog;
  const byId = new Map(requirements.map((requirement) => [ requirement.id, requirement ]));
  const actualShallIds = requirements
    .filter((requirement) => requirement.level === 'shall')
    .map((requirement) => requirement.id);
  const actualMayIds = requirements
    .filter((requirement) => requirement.level === 'may')
    .map((requirement) => requirement.id);

  assert.equal(requirements.filter((requirement) => requirement.level === 'shall').length, 5);
  assert.equal(requirements.filter((requirement) => requirement.level === 'may').length, 1);
  assert.equal(requirementCatalog.status, 'implemented-with-external-blockers');
  assert.equal(requirementCatalog.expectedShallCount, 5);
  assert.equal(requirementCatalog.expectedMayCount, 1);
  assert.deepEqual(requirementCatalog.expectedShallIds, [
    'language-structure',
    'standard-iconography',
    'viewpoint-mechanism',
    'language-customization',
    'appendix-b-relationships'
  ]);
  assert.deepEqual(requirementCatalog.expectedMayIds, [ 'example-viewpoints' ]);
  assert.deepEqual(actualShallIds, requirementCatalog.expectedShallIds);
  assert.deepEqual(actualMayIds, requirementCatalog.expectedMayIds);
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

  assert.match(languageIndex, /var conformanceRequirements = summarizeConformanceRequirements/);
  assert.match(languageIndex, /conformance\.requirementCatalog/);
  assert.match(languageIndex, /conformanceRequirements: conformanceRequirements/);
  assert.match(languageIndex, /function summarizeConformanceRequirements/);
  assert.match(languageIndex, /missingIds/);
  assert.match(languageIndex, /extraIds/);
  assert.match(readme, /conformanceRequirements\.(expectedIds|missingIds|extraIds)/);
  assert.match(sources, /C260 conformance requirements are represented per shall\/may clause/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import {
  createLanguageProfile,
  getArchimate4ImplementationStatus,
  getProfileAttributesForConcept
} from '../lib/metamodel/languages/index.js';

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

function collectIncompleteStatusSummaries(value, path = []) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const incomplete = [];

  if (Object.prototype.hasOwnProperty.call(value, 'complete') && value.complete !== true) {
    incomplete.push({
      path: path.join('.'),
      complete: value.complete,
      status: value.status
    });
  }

  for (const [ key, child ] of Object.entries(value)) {
    incomplete.push(...collectIncompleteStatusSummaries(child, path.concat(key)));
  }

  return incomplete;
}

function collectStatusRunlogReferences(value, path = []) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((child, index) => collectStatusRunlogReferences(child, path.concat(String(index))));
  }

  const references = [];

  for (const [ key, child ] of Object.entries(value)) {
    if (/RunlogPath/.test(key)) {
      const values = Array.isArray(child) ? child : [ child ];

      values.forEach((runlogPath, index) => {
        if (typeof runlogPath === 'string') {
          references.push({
            keyPath: path.concat(key, String(index)).join('.'),
            runlogPath
          });
        }
      });
    }

    references.push(...collectStatusRunlogReferences(child, path.concat(key)));
  }

  return references;
}

function collectStatusIdentityArrays(value, path = []) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((child, index) => collectStatusIdentityArrays(child, path.concat(String(index))));
  }

  const arrays = [];
  const identityArrayPattern = /(Ids|Types|Names|Sources|Blockers|Gaps|Paths)$/;

  for (const [ key, child ] of Object.entries(value)) {
    if (Array.isArray(child) &&
        identityArrayPattern.test(key) &&
        child.every((item) => typeof item === 'string' || typeof item === 'number')) {
      arrays.push({
        keyPath: path.concat(key).join('.'),
        values: child
      });
    }

    arrays.push(...collectStatusIdentityArrays(child, path.concat(key)));
  }

  return arrays;
}

function collectDuplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();

  values.forEach((value) => {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  });

  return Array.from(duplicates);
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

test('archimate 4 implementation status exposes profile attribute type coverage', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const status = getArchimate4ImplementationStatus();

  assert.deepEqual(status.profileAttributeTypes.expectedC260TypeNames, [
    'String',
    'Boolean',
    'Date',
    'Number',
    'Real',
    'Currency',
    'Time',
    'Integer'
  ]);
  assert.deepEqual(
    status.profileAttributeTypes.actualC260TypeNames,
    status.profileAttributeTypes.expectedC260TypeNames
  );
  assert.deepEqual(status.profileAttributeTypes.missingC260TypeNames, []);
  assert.deepEqual(status.profileAttributeTypes.implementationAdditionalTypeNames, [
    'URL',
    'Structure'
  ]);
  assert.deepEqual(status.profileAttributeTypes.actualAdditionalTypeNames, [
    'URL',
    'Structure'
  ]);
  assert.deepEqual(status.profileAttributeTypes.missingAdditionalTypeNames, []);
  assert.deepEqual(status.profileAttributeTypes.unexpectedAdditionalTypeNames, []);
  assert.equal(status.profileAttributeTypes.complete, true);
  assert.deepEqual(status.profileAttributeTypes.sourceRunlogPaths, [
    'project_memory/runlogs/20260709-200-c260-profile-attribute-detail-scan.txt',
    'project_memory/runlogs/20260709-233-c260-profile-attribute-property-scan.txt',
    'project_memory/runlogs/20260709-1243-c260-profile-attribute-type-token-scan.txt'
  ]);

  assert.match(languageIndex, /function summarizeProfileAttributeTypes/);
  assert.match(languageIndex, /profileAttributeTypes: profileAttributeTypes/);
  assert.match(readme, /profileAttributeTypes\.expectedC260TypeNames/);
  assert.match(sources, /profileAttributeTypes\.missingC260TypeNames/);
  assert.match(officialSpec, /profileAttributeTypes\.unexpectedAdditionalTypeNames/);
});

test('custom profile attributes validate active concepts relationships and lineage lookup', () => {
  const profile = createLanguageProfile('4.0', {
    version: '4.0',
    elements: [
      {
        type: 'CustomerActor',
        specializes: 'BusinessActor',
        domain: 'Business',
        aspect: 'active-structure',
        className: 'business-actor',
        typeName: 'Customer Actor'
      }
    ],
    relationships: [
      {
        type: 'EscalatesTo',
        specializes: 'Association',
        label: 'Escalates To'
      }
    ],
    attributes: [
      {
        concept: 'BusinessActor',
        name: 'criticality',
        type: 'Integer'
      },
      {
        concept: 'CustomerActor',
        name: 'segment',
        type: 'String'
      },
      {
        concept: 'Association',
        name: 'contractual',
        type: 'Boolean'
      },
      {
        concept: 'EscalatesTo',
        name: 'escalationNote',
        type: 'String'
      }
    ]
  });

  assert.deepEqual(
    getProfileAttributesForConcept('CustomerActor', profile).map((attribute) => attribute.name),
    [
      'criticality',
      'segment'
    ]
  );
  assert.deepEqual(
    getProfileAttributesForConcept('EscalatesTo', profile).map((attribute) => attribute.name),
    [
      'contractual',
      'escalationNote'
    ]
  );

  assert.throws(() => createLanguageProfile('4.0', {
    attributes: [
      {
        concept: 'BusinessInteraction',
        name: 'retired',
        type: 'String'
      }
    ]
  }), /Unsupported ArchiMate profile attribute concept: BusinessInteraction/);

  assert.throws(() => createLanguageProfile('4.0', {
    attributes: [
      {
        concept: 'BusinessActor',
        name: 'badType',
        type: 'Enumeration'
      }
    ]
  }), /Unsupported ArchiMate profile attribute type: Enumeration/);

  assert.throws(() => createLanguageProfile('4.0', {
    attributes: [
      {
        concept: 'Association',
        type: 'String'
      }
    ]
  }), /Custom ArchiMate profile attributes require name/);
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
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');

  assert.match(languageIndex, /VIEWPOINT_PURPOSES/);
  assert.match(languageIndex, /VIEWPOINT_CONTENT_TYPES/);
  assert.match(languageIndex, /viewpointClassification: viewpointClassification/);
  assert.match(languageIndex, /viewpointMechanism: viewpointMechanism/);
  assert.match(languageIndex, /stakeholderConcerns: stakeholderConcerns/);
  assert.match(languageIndex, /summarizeViewpointClassification/);
  assert.match(languageIndex, /summarizeViewpointMechanism/);
  assert.match(languageIndex, /summarizeStakeholderConcerns/);
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
  assert.match(readme, /viewpointMechanism\.expectedFeatureIds/);
  assert.match(readme, /stakeholderConcerns\.expectedFeatureIds/);
  assert.match(readme, /viewpointClassification\.expectedPurposeNames/);
  assert.match(sources, /allowed element and relationship types against the active profile/);
  assert.match(sources, /viewpointMechanism\.missingFeatureIds/);
  assert.match(sources, /stakeholderConcerns\.missingFeatureIds/);
  assert.match(sources, /viewpointClassification\.missingContentNames/);
  assert.match(officialSpec, /viewpointMechanism/);
  assert.match(officialSpec, /stakeholderConcerns/);
  assert.match(officialSpec, /viewpointClassification/);
});

test('custom viewpoint definitions validate purpose content and allowed types', () => {
  const profile = createLanguageProfile('4.0', {
    version: '4.0',
    viewpoints: [
      {
        id: 'custom-decision-overview',
        name: 'Custom Decision Overview',
        viewpointPurpose: [ 'Deciding' ],
        viewpointContent: 'Overview',
        allowedElementTypes: [
          'BusinessActor',
          { type: 'ApplicationComponent' }
        ],
        allowedRelationshipTypes: [
          'Association',
          { type: 'Serving' }
        ]
      }
    ]
  });

  const customViewpoint = profile.viewpoints.find((viewpoint) => viewpoint.id === 'custom-decision-overview');

  assert.equal(profile.customized, true);
  assert.equal(customViewpoint.name, 'Custom Decision Overview');
  assert.deepEqual(customViewpoint.viewpointPurpose, [ 'Deciding' ]);
  assert.equal(customViewpoint.viewpointContent, 'Overview');
  assert.deepEqual(customViewpoint.allowedElementTypes, [
    'BusinessActor',
    { type: 'ApplicationComponent' }
  ]);
  assert.deepEqual(customViewpoint.allowedRelationshipTypes, [
    'Association',
    { type: 'Serving' }
  ]);

  assert.throws(() => createLanguageProfile('4.0', {
    viewpoints: [
      {
        id: 'bad-purpose',
        viewpointPurpose: [ 'Planning' ]
      }
    ]
  }), /Unsupported ArchiMate viewpoint viewpointPurpose: Planning/);

  assert.throws(() => createLanguageProfile('4.0', {
    viewpoints: [
      {
        id: 'retired-element-type',
        allowedElementTypes: [ 'BusinessInteraction' ]
      }
    ]
  }), /Unsupported ArchiMate viewpoint allowedElementTypes: BusinessInteraction/);

  assert.throws(() => createLanguageProfile('4.0', {
    viewpoints: [
      {
        id: 'unknown-relationship-type',
        allowedRelationshipTypes: [ 'UnknownRelationship' ]
      }
    ]
  }), /Unsupported ArchiMate viewpoint allowedRelationshipTypes: UnknownRelationship/);

  assert.throws(() => createLanguageProfile('4.0', {
    viewpoints: [
      {
        id: 'missing-element-type',
        allowedElementTypes: [ {} ]
      }
    ]
  }), /Custom ArchiMate viewpoint allowedElementTypes entries require type/);
});

test('archimate 4 implementation status exposes C260 viewpoint classification tokens', () => {
  const status = getArchimate4ImplementationStatus();

  assert.deepEqual(status.viewpointClassification.expectedPurposeNames, [
    'Designing',
    'Deciding',
    'Informing'
  ]);
  assert.deepEqual(status.viewpointClassification.actualPurposeNames, [
    'Designing',
    'Deciding',
    'Informing'
  ]);
  assert.deepEqual(status.viewpointClassification.missingPurposeNames, []);
  assert.deepEqual(status.viewpointClassification.expectedContentNames, [
    'Details',
    'Coherence',
    'Overview'
  ]);
  assert.deepEqual(status.viewpointClassification.actualContentNames, [
    'Details',
    'Coherence',
    'Overview'
  ]);
  assert.deepEqual(status.viewpointClassification.missingContentNames, []);
  assert.deepEqual(status.viewpointClassification.unexpectedPurposeNames, []);
  assert.deepEqual(status.viewpointClassification.unexpectedContentNames, []);
  assert.equal(status.viewpointClassification.complete, true);
  assert.deepEqual(status.viewpointClassification.sourceRunlogPaths, [
    'project_memory/runlogs/20260709-1268-c260-viewpoint-classification-token-scan.txt'
  ]);
});

test('archimate 4 implementation status exposes C260 viewpoint mechanism features', () => {
  const status = getArchimate4ImplementationStatus();
  const expectedFeatureIds = [
    'views-viewpoints-container',
    'view-viewpoint-attribute',
    'view-viewpoint-reference',
    'viewpoint-concern-list',
    'viewpoint-stakeholder-list',
    'viewpoint-purpose',
    'viewpoint-content',
    'viewpoint-allowed-element-types',
    'viewpoint-allowed-relationship-types',
    'viewpoint-modeling-notes'
  ];

  assert.deepEqual(status.viewpointMechanism.expectedFeatureIds, expectedFeatureIds);
  assert.deepEqual(status.viewpointMechanism.actualFeatureIds, expectedFeatureIds);
  assert.deepEqual(status.viewpointMechanism.missingFeatureIds, []);
  assert.deepEqual(status.viewpointMechanism.extraFeatureIds, []);
  assert.equal(status.viewpointMechanism.complete, true);
  assert.deepEqual(status.viewpointMechanism.sourceRunlogPaths, [
    'project_memory/runlogs/20260709-1284-c260-viewpoint-mechanism-feature-scan.txt',
    'project_memory/runlogs/20260709-1268-c260-viewpoint-classification-token-scan.txt'
  ]);
});

test('archimate 4 implementation status exposes C260 stakeholder concern features', () => {
  const status = getArchimate4ImplementationStatus();
  const expectedFeatureIds = [
    'viewpoint-concern-list',
    'concern-label',
    'concern-documentation',
    'concern-stakeholders-container',
    'stakeholders-stakeholder-list',
    'stakeholder-label'
  ];

  assert.deepEqual(status.stakeholderConcerns.expectedFeatureIds, expectedFeatureIds);
  assert.deepEqual(status.stakeholderConcerns.actualFeatureIds, expectedFeatureIds);
  assert.deepEqual(status.stakeholderConcerns.missingFeatureIds, []);
  assert.deepEqual(status.stakeholderConcerns.extraFeatureIds, []);
  assert.equal(status.stakeholderConcerns.complete, true);
  assert.deepEqual(status.stakeholderConcerns.sourceRunlogPaths, [
    'project_memory/runlogs/20260709-1299-c260-stakeholder-concern-feature-scan.txt'
  ]);
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

test('archimate 4 implementation status has no incomplete non-external summaries', () => {
  const status = getArchimate4ImplementationStatus();
  const expectedOfficialBlockerIds = [
    'officialAppendixBRelationshipMatrix',
    'officialMeff4Xsd',
    'exactAppendixAArtworkRights'
  ];
  const expectedGapIds = expectedOfficialBlockerIds.concat('w262CompanionPaper');

  assert.deepEqual(collectIncompleteStatusSummaries(status), []);
  assert.equal(status.conformanceReadiness.officialConformanceClaimable, false);
  assert.deepEqual(status.conformanceReadiness.blockers, expectedOfficialBlockerIds);
  assert.deepEqual(status.conformanceReadiness.missingRequiredBeforeClaimBlockerIds, []);
  assert.deepEqual(status.conformanceReadiness.extraRequiredBeforeClaimBlockerIds, []);
  assert.deepEqual(status.remainingGaps.actualIds, expectedGapIds);
  assert.deepEqual(status.remainingGaps.unresolvedIds, expectedGapIds);
  assert.deepEqual(status.remainingGaps.missingIds, []);
  assert.deepEqual(status.remainingGaps.extraIds, []);
});

test('archimate 4 implementation status runlog references resolve to committed evidence', async () => {
  const status = getArchimate4ImplementationStatus();
  const references = collectStatusRunlogReferences(status);
  const missing = [];

  assert.equal(references.length > 0, true);
  assert.equal(references.every((reference) => reference.runlogPath.startsWith('project_memory/runlogs/')), true);

  for (const reference of references) {
    try {
      await readFile(new URL(`../${reference.runlogPath}`, import.meta.url), 'utf8');
    } catch (error) {
      missing.push(Object.assign({}, reference, {
        error: error.code || error.message
      }));
    }
  }

  assert.deepEqual(missing, []);
});

test('archimate 4 implementation status identity arrays contain no duplicate values', () => {
  const status = getArchimate4ImplementationStatus();
  const identityArrays = collectStatusIdentityArrays(status);
  const duplicateArrays = identityArrays
    .map((identityArray) => {
      return Object.assign({}, identityArray, {
        duplicates: collectDuplicateValues(identityArray.values)
      });
    })
    .filter((identityArray) => identityArray.duplicates.length > 0)
    .map((identityArray) => {
      return {
        keyPath: identityArray.keyPath,
        duplicates: identityArray.duplicates
      };
    });

  assert.equal(identityArrays.length > 0, true);
  assert.deepEqual(duplicateArrays, []);
});

test('archimate 4 implementation status exposes C260 introduction coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const introductionCatalog = profile.conformance.introductionCoverageCatalog;
  const introductions = profile.conformance.introductionCoverage;
  const expectedIntroductionIds = [
    'objective',
    'overview',
    'conformance',
    'normative-references',
    'terminology',
    'future-directions'
  ];

  assert.equal(introductionCatalog.status, 'c260-outline-derived');
  assert.equal(introductionCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(introductionCatalog.expectedCount, expectedIntroductionIds.length);
  assert.deepEqual(introductionCatalog.expectedIds, expectedIntroductionIds);
  assert.deepEqual(introductions.map((introduction) => introduction.id), expectedIntroductionIds);
  assert.equal(introductions.every((introduction) => introduction.c260Section && introduction.heading), true);

  assert.match(languageIndex, /function summarizeIntroductionCoverage/);
  assert.match(languageIndex, /introductionCoverage: introductionCoverage/);
  assert.match(languageIndex, /missingIntroductionIds/);
  assert.match(readme, /introductionCoverage\.expectedIds/);
  assert.match(sources, /introductionCoverage\.actualIds/);
  assert.match(officialSpec, /introductionCoverage\.missingIntroductionIds/);
});

test('archimate 4 implementation status exposes C260 language structure coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const languageStructureCatalog = profile.conformance.languageStructureCoverageCatalog;
  const languageStructureCoverage = profile.conformance.languageStructureCoverage;
  const expectedLanguageStructureIds = [
    'language-design-considerations',
    'archimate-language',
    'domains-of-archimate-language',
    'aspects-of-archimate-language',
    'top-level-language-structure',
    'structure-and-behavior-elements',
    'active-structure-elements',
    'passive-structure-elements',
    'behavior-elements',
    'structure-and-behavior-example',
    'abstraction-in-archimate-language',
    'concepts-and-notation',
    'use-of-nesting',
    'use-of-colors-and-notational-cues'
  ];

  assert.equal(languageStructureCatalog.status, 'c260-outline-derived');
  assert.equal(languageStructureCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(languageStructureCatalog.expectedCount, expectedLanguageStructureIds.length);
  assert.deepEqual(languageStructureCatalog.expectedIds, expectedLanguageStructureIds);
  assert.deepEqual(
    languageStructureCoverage.map((languageStructureItem) => languageStructureItem.id),
    expectedLanguageStructureIds
  );
  assert.equal(
    languageStructureCoverage.every((languageStructureItem) => (
      languageStructureItem.c260Section && languageStructureItem.heading
    )),
    true
  );

  assert.match(languageIndex, /function summarizeLanguageStructureCoverage/);
  assert.match(languageIndex, /languageStructureCoverage: languageStructureCoverage/);
  assert.match(languageIndex, /missingLanguageStructureIds/);
  assert.match(readme, /languageStructureCoverage\.expectedIds/);
  assert.match(sources, /languageStructureCoverage\.actualIds/);
  assert.match(officialSpec, /languageStructureCoverage\.missingLanguageStructureIds/);
  assert.match(plan, /Language structure coverage status reports/);
});

test('archimate 4 implementation status exposes C260 common domain coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const commonDomainCatalog = profile.conformance.commonDomainCoverageCatalog;
  const commonDomainCoverage = profile.conformance.commonDomainCoverage;
  const expectedCommonDomainIds = [
    'active-structure-elements',
    'role',
    'collaboration',
    'path',
    'behavior-elements',
    'service',
    'process',
    'function',
    'event',
    'composite-elements',
    'grouping',
    'location',
    'summary-of-common-domain-elements'
  ];

  assert.equal(commonDomainCatalog.status, 'c260-outline-derived');
  assert.equal(commonDomainCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(commonDomainCatalog.expectedCount, expectedCommonDomainIds.length);
  assert.deepEqual(commonDomainCatalog.expectedIds, expectedCommonDomainIds);
  assert.deepEqual(commonDomainCoverage.map((commonDomainItem) => commonDomainItem.id), expectedCommonDomainIds);
  assert.equal(
    commonDomainCoverage.every((commonDomainItem) => commonDomainItem.c260Section && commonDomainItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeCommonDomainCoverage/);
  assert.match(languageIndex, /commonDomainCoverage: commonDomainCoverage/);
  assert.match(languageIndex, /missingCommonDomainIds/);
  assert.match(readme, /commonDomainCoverage\.expectedIds/);
  assert.match(sources, /commonDomainCoverage\.actualIds/);
  assert.match(officialSpec, /commonDomainCoverage\.missingCommonDomainIds/);
  assert.match(plan, /Common domain coverage status reports/);
});

test('archimate 4 implementation status exposes C260 relationships and junctions coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const relationshipsAndJunctionsCatalog = profile.conformance.relationshipsAndJunctionsCoverageCatalog;
  const relationshipsAndJunctionsCoverage = profile.conformance.relationshipsAndJunctionsCoverage;
  const expectedRelationshipsAndJunctionsIds = [
    'structural-relationships',
    'aggregation-relationship',
    'composition-relationship',
    'assignment-relationship',
    'realization-relationship',
    'semantics-of-structural-relationships',
    'dependency-relationships',
    'serving-relationship',
    'access-relationship',
    'influence-relationship',
    'association-relationship',
    'semantics-of-dependency-relationships',
    'dynamic-relationships',
    'triggering-relationship',
    'flow-relationship',
    'semantics-of-dynamic-relationships',
    'other-relationships',
    'specialization-relationship',
    'semantics-of-other-relationships',
    'junctions',
    'junction',
    'multiplicity',
    'summary-of-relationships-and-junctions',
    'derivation-of-relationships'
  ];

  assert.equal(relationshipsAndJunctionsCatalog.status, 'c260-outline-derived');
  assert.equal(relationshipsAndJunctionsCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(relationshipsAndJunctionsCatalog.expectedCount, expectedRelationshipsAndJunctionsIds.length);
  assert.deepEqual(relationshipsAndJunctionsCatalog.expectedIds, expectedRelationshipsAndJunctionsIds);
  assert.deepEqual(
    relationshipsAndJunctionsCoverage.map((relationshipsAndJunctionsItem) => relationshipsAndJunctionsItem.id),
    expectedRelationshipsAndJunctionsIds
  );
  assert.equal(
    relationshipsAndJunctionsCoverage.every((relationshipsAndJunctionsItem) => (
      relationshipsAndJunctionsItem.c260Section && relationshipsAndJunctionsItem.heading
    )),
    true
  );

  assert.match(languageIndex, /function summarizeRelationshipsAndJunctionsCoverage/);
  assert.match(languageIndex, /relationshipsAndJunctionsCoverage: relationshipsAndJunctionsCoverage/);
  assert.match(languageIndex, /missingRelationshipsAndJunctionsIds/);
  assert.match(readme, /relationshipsAndJunctionsCoverage\.expectedIds/);
  assert.match(sources, /relationshipsAndJunctionsCoverage\.actualIds/);
  assert.match(officialSpec, /relationshipsAndJunctionsCoverage\.missingRelationshipsAndJunctionsIds/);
  assert.match(plan, /Relationships and junctions coverage status reports/);
});

test('archimate 4 implementation status exposes C260 motivation domain coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const motivationDomainCatalog = profile.conformance.motivationDomainCoverageCatalog;
  const motivationDomainCoverage = profile.conformance.motivationDomainCoverage;
  const expectedMotivationDomainIds = [
    'motivation-elements',
    'motivation-elements-metamodel',
    'stakeholder-driver-and-assessment',
    'stakeholder',
    'driver',
    'assessment',
    'stakeholder-driver-assessment-example',
    'goal-outcome-principle-and-requirement',
    'goal',
    'outcome',
    'principle',
    'requirement',
    'goal-outcome-principle-requirement-example',
    'meaning-and-value',
    'meaning',
    'value',
    'meaning-value-example',
    'summary-of-motivation-elements',
    'relationships-with-other-domains'
  ];

  assert.equal(motivationDomainCatalog.status, 'c260-outline-derived');
  assert.equal(motivationDomainCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(motivationDomainCatalog.expectedCount, expectedMotivationDomainIds.length);
  assert.deepEqual(motivationDomainCatalog.expectedIds, expectedMotivationDomainIds);
  assert.deepEqual(motivationDomainCoverage.map((motivationDomainItem) => motivationDomainItem.id), expectedMotivationDomainIds);
  assert.equal(
    motivationDomainCoverage.every((motivationDomainItem) => motivationDomainItem.c260Section && motivationDomainItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeMotivationDomainCoverage/);
  assert.match(languageIndex, /motivationDomainCoverage: motivationDomainCoverage/);
  assert.match(languageIndex, /missingMotivationDomainIds/);
  assert.match(readme, /motivationDomainCoverage\.expectedIds/);
  assert.match(sources, /motivationDomainCoverage\.actualIds/);
  assert.match(officialSpec, /motivationDomainCoverage\.missingMotivationDomainIds/);
  assert.match(plan, /Motivation domain coverage status reports/);
});

test('archimate 4 implementation status exposes C260 strategy domain coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const strategyDomainCatalog = profile.conformance.strategyDomainCoverageCatalog;
  const strategyDomainCoverage = profile.conformance.strategyDomainCoverage;
  const expectedStrategyDomainIds = [
    'strategy-elements-metamodel',
    'structure-elements',
    'resource',
    'behavior-elements',
    'capability',
    'value-stream',
    'course-of-action',
    'examples',
    'summary-of-strategy-elements',
    'relationships-with-other-domains'
  ];

  assert.equal(strategyDomainCatalog.status, 'c260-outline-derived');
  assert.equal(strategyDomainCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(strategyDomainCatalog.expectedCount, expectedStrategyDomainIds.length);
  assert.deepEqual(strategyDomainCatalog.expectedIds, expectedStrategyDomainIds);
  assert.deepEqual(strategyDomainCoverage.map((strategyDomainItem) => strategyDomainItem.id), expectedStrategyDomainIds);
  assert.equal(
    strategyDomainCoverage.every((strategyDomainItem) => strategyDomainItem.c260Section && strategyDomainItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeStrategyDomainCoverage/);
  assert.match(languageIndex, /strategyDomainCoverage: strategyDomainCoverage/);
  assert.match(languageIndex, /missingStrategyDomainIds/);
  assert.match(readme, /strategyDomainCoverage\.expectedIds/);
  assert.match(sources, /strategyDomainCoverage\.actualIds/);
  assert.match(officialSpec, /strategyDomainCoverage\.missingStrategyDomainIds/);
  assert.match(plan, /Strategy domain coverage status reports/);
});

test('archimate 4 implementation status exposes C260 business domain coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const businessDomainCatalog = profile.conformance.businessDomainCoverageCatalog;
  const businessDomainCoverage = profile.conformance.businessDomainCoverage;
  const expectedBusinessDomainIds = [
    'business-structure-metamodel',
    'active-structure-elements',
    'business-actor',
    'business-interface',
    'active-structure-example',
    'passive-structure-elements',
    'business-object',
    'passive-structure-example',
    'composite-elements',
    'product',
    'product-example',
    'summary-of-business-domain-elements'
  ];

  assert.equal(businessDomainCatalog.status, 'c260-outline-derived');
  assert.equal(businessDomainCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(businessDomainCatalog.expectedCount, expectedBusinessDomainIds.length);
  assert.deepEqual(businessDomainCatalog.expectedIds, expectedBusinessDomainIds);
  assert.deepEqual(businessDomainCoverage.map((businessDomainItem) => businessDomainItem.id), expectedBusinessDomainIds);
  assert.equal(
    businessDomainCoverage.every((businessDomainItem) => businessDomainItem.c260Section && businessDomainItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeBusinessDomainCoverage/);
  assert.match(languageIndex, /businessDomainCoverage: businessDomainCoverage/);
  assert.match(languageIndex, /missingBusinessDomainIds/);
  assert.match(readme, /businessDomainCoverage\.expectedIds/);
  assert.match(sources, /businessDomainCoverage\.actualIds/);
  assert.match(officialSpec, /businessDomainCoverage\.missingBusinessDomainIds/);
  assert.match(plan, /Business domain coverage status reports/);
});

test('archimate 4 implementation status exposes C260 application domain coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const applicationDomainCatalog = profile.conformance.applicationDomainCoverageCatalog;
  const applicationDomainCoverage = profile.conformance.applicationDomainCoverage;
  const expectedApplicationDomainIds = [
    'application-structure-metamodel',
    'active-structure-elements',
    'application-component',
    'application-interface',
    'active-structure-example',
    'passive-structure-elements',
    'data-object',
    'passive-structure-example',
    'summary-of-application-domain-elements'
  ];

  assert.equal(applicationDomainCatalog.status, 'c260-outline-derived');
  assert.equal(applicationDomainCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(applicationDomainCatalog.expectedCount, expectedApplicationDomainIds.length);
  assert.deepEqual(applicationDomainCatalog.expectedIds, expectedApplicationDomainIds);
  assert.deepEqual(
    applicationDomainCoverage.map((applicationDomainItem) => applicationDomainItem.id),
    expectedApplicationDomainIds
  );
  assert.equal(
    applicationDomainCoverage.every((applicationDomainItem) => applicationDomainItem.c260Section && applicationDomainItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeApplicationDomainCoverage/);
  assert.match(languageIndex, /applicationDomainCoverage: applicationDomainCoverage/);
  assert.match(languageIndex, /missingApplicationDomainIds/);
  assert.match(readme, /applicationDomainCoverage\.expectedIds/);
  assert.match(sources, /applicationDomainCoverage\.actualIds/);
  assert.match(officialSpec, /applicationDomainCoverage\.missingApplicationDomainIds/);
  assert.match(plan, /Application domain coverage status reports/);
});

test('archimate 4 implementation status exposes C260 technology domain coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const technologyDomainCatalog = profile.conformance.technologyDomainCoverageCatalog;
  const technologyDomainCoverage = profile.conformance.technologyDomainCoverage;
  const expectedTechnologyDomainIds = [
    'technology-metamodel',
    'active-structure-elements',
    'node',
    'technology-interface',
    'device',
    'system-software',
    'equipment',
    'facility',
    'communication-network',
    'distribution-network',
    'passive-structure-elements',
    'artifact',
    'material',
    'technology-example',
    'summary-of-technology-domain-elements'
  ];

  assert.equal(technologyDomainCatalog.status, 'c260-outline-derived');
  assert.equal(technologyDomainCatalog.sourceRunlogPath, 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt');
  assert.equal(technologyDomainCatalog.expectedCount, expectedTechnologyDomainIds.length);
  assert.deepEqual(technologyDomainCatalog.expectedIds, expectedTechnologyDomainIds);
  assert.deepEqual(
    technologyDomainCoverage.map((technologyDomainItem) => technologyDomainItem.id),
    expectedTechnologyDomainIds
  );
  assert.equal(
    technologyDomainCoverage.every((technologyDomainItem) => technologyDomainItem.c260Section && technologyDomainItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeTechnologyDomainCoverage/);
  assert.match(languageIndex, /technologyDomainCoverage: technologyDomainCoverage/);
  assert.match(languageIndex, /missingTechnologyDomainIds/);
  assert.match(readme, /technologyDomainCoverage\.expectedIds/);
  assert.match(sources, /technologyDomainCoverage\.actualIds/);
  assert.match(officialSpec, /technologyDomainCoverage\.missingTechnologyDomainIds/);
  assert.match(plan, /Technology domain coverage status reports/);
});

test('archimate 4 implementation status exposes C260 relationships between core domains coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const relationshipsBetweenCoreDomainsCatalog = profile.conformance.relationshipsBetweenCoreDomainsCoverageCatalog;
  const relationshipsBetweenCoreDomainsCoverage = profile.conformance.relationshipsBetweenCoreDomainsCoverage;
  const expectedRelationshipsBetweenCoreDomainsIds = [
    'core-domain-relationships-example'
  ];

  assert.equal(relationshipsBetweenCoreDomainsCatalog.status, 'c260-outline-derived');
  assert.equal(
    relationshipsBetweenCoreDomainsCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(relationshipsBetweenCoreDomainsCatalog.expectedCount, expectedRelationshipsBetweenCoreDomainsIds.length);
  assert.deepEqual(relationshipsBetweenCoreDomainsCatalog.expectedIds, expectedRelationshipsBetweenCoreDomainsIds);
  assert.deepEqual(
    relationshipsBetweenCoreDomainsCoverage.map((relationshipsBetweenCoreDomainsItem) => relationshipsBetweenCoreDomainsItem.id),
    expectedRelationshipsBetweenCoreDomainsIds
  );
  assert.equal(
    relationshipsBetweenCoreDomainsCoverage.every((relationshipsBetweenCoreDomainsItem) => relationshipsBetweenCoreDomainsItem.c260Section && relationshipsBetweenCoreDomainsItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeRelationshipsBetweenCoreDomainsCoverage/);
  assert.match(languageIndex, /relationshipsBetweenCoreDomainsCoverage: relationshipsBetweenCoreDomainsCoverage/);
  assert.match(languageIndex, /missingRelationshipsBetweenCoreDomainsIds/);
  assert.match(readme, /relationshipsBetweenCoreDomainsCoverage\.expectedIds/);
  assert.match(sources, /relationshipsBetweenCoreDomainsCoverage\.actualIds/);
  assert.match(officialSpec, /relationshipsBetweenCoreDomainsCoverage\.missingRelationshipsBetweenCoreDomainsIds/);
  assert.match(plan, /Relationships between core domains coverage status reports/);
});

test('archimate 4 implementation status exposes C260 implementation and migration domain coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const implementationAndMigrationDomainCatalog = profile.conformance.implementationAndMigrationDomainCoverageCatalog;
  const implementationAndMigrationDomainCoverage = profile.conformance.implementationAndMigrationDomainCoverage;
  const expectedImplementationAndMigrationDomainIds = [
    'implementation-and-migration-elements-metamodel',
    'implementation-and-migration-elements',
    'work-package',
    'deliverable',
    'plateau',
    'implementation-and-migration-example',
    'summary-of-implementation-and-migration-elements',
    'relationships-with-domains'
  ];

  assert.equal(implementationAndMigrationDomainCatalog.status, 'c260-outline-derived');
  assert.equal(
    implementationAndMigrationDomainCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(implementationAndMigrationDomainCatalog.expectedCount, expectedImplementationAndMigrationDomainIds.length);
  assert.deepEqual(implementationAndMigrationDomainCatalog.expectedIds, expectedImplementationAndMigrationDomainIds);
  assert.deepEqual(
    implementationAndMigrationDomainCoverage.map((implementationAndMigrationDomainItem) => implementationAndMigrationDomainItem.id),
    expectedImplementationAndMigrationDomainIds
  );
  assert.equal(
    implementationAndMigrationDomainCoverage.every((implementationAndMigrationDomainItem) => implementationAndMigrationDomainItem.c260Section && implementationAndMigrationDomainItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeImplementationAndMigrationDomainCoverage/);
  assert.match(languageIndex, /implementationAndMigrationDomainCoverage: implementationAndMigrationDomainCoverage/);
  assert.match(languageIndex, /missingImplementationAndMigrationDomainIds/);
  assert.match(readme, /implementationAndMigrationDomainCoverage\.expectedIds/);
  assert.match(sources, /implementationAndMigrationDomainCoverage\.actualIds/);
  assert.match(officialSpec, /implementationAndMigrationDomainCoverage\.missingImplementationAndMigrationDomainIds/);
  assert.match(plan, /Implementation and migration domain coverage status reports/);
});

test('archimate 4 implementation status exposes C260 stakeholders architecture views viewpoints coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const stakeholdersArchitectureViewsViewpointsCatalog = profile.conformance.stakeholdersArchitectureViewsViewpointsCoverageCatalog;
  const stakeholdersArchitectureViewsViewpointsCoverage = profile.conformance.stakeholdersArchitectureViewsViewpointsCoverage;
  const expectedStakeholdersArchitectureViewsViewpointsIds = [
    'stakeholders-views-viewpoints-introduction',
    'stakeholders-and-concerns',
    'architecture-views-and-viewpoints',
    'viewpoint-mechanism',
    'defining-and-classifying-viewpoints',
    'creating-the-view',
    'example-viewpoints'
  ];

  assert.equal(stakeholdersArchitectureViewsViewpointsCatalog.status, 'c260-outline-derived');
  assert.equal(
    stakeholdersArchitectureViewsViewpointsCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(stakeholdersArchitectureViewsViewpointsCatalog.expectedCount, expectedStakeholdersArchitectureViewsViewpointsIds.length);
  assert.deepEqual(stakeholdersArchitectureViewsViewpointsCatalog.expectedIds, expectedStakeholdersArchitectureViewsViewpointsIds);
  assert.deepEqual(
    stakeholdersArchitectureViewsViewpointsCoverage.map((stakeholdersArchitectureViewsViewpointsItem) => stakeholdersArchitectureViewsViewpointsItem.id),
    expectedStakeholdersArchitectureViewsViewpointsIds
  );
  assert.equal(
    stakeholdersArchitectureViewsViewpointsCoverage.every((stakeholdersArchitectureViewsViewpointsItem) => stakeholdersArchitectureViewsViewpointsItem.c260Section && stakeholdersArchitectureViewsViewpointsItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeStakeholdersArchitectureViewsViewpointsCoverage/);
  assert.match(languageIndex, /stakeholdersArchitectureViewsViewpointsCoverage: stakeholdersArchitectureViewsViewpointsCoverage/);
  assert.match(languageIndex, /missingStakeholdersArchitectureViewsViewpointsIds/);
  assert.match(readme, /stakeholdersArchitectureViewsViewpointsCoverage\.expectedIds/);
  assert.match(sources, /stakeholdersArchitectureViewsViewpointsCoverage\.actualIds/);
  assert.match(officialSpec, /stakeholdersArchitectureViewsViewpointsCoverage\.missingStakeholdersArchitectureViewsViewpointsIds/);
  assert.match(plan, /Stakeholders architecture views viewpoints coverage status reports/);
});

test('archimate 4 implementation status exposes C260 language customization mechanisms coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const languageCustomizationMechanismsCatalog = profile.conformance.languageCustomizationMechanismsCoverageCatalog;
  const languageCustomizationMechanismsCoverage = profile.conformance.languageCustomizationMechanismsCoverage;
  const expectedLanguageCustomizationMechanismsIds = [
    'adding-attributes-to-archimate-concepts',
    'specialization-of-concepts',
    'specializations-of-common-domain-elements',
    'specializations-of-business-domain-elements',
    'specializations-of-application-domain-elements',
    'specializations-of-technology-domain-elements',
    'specializations-of-motivation-elements',
    'specializations-of-strategy-elements',
    'specializations-of-implementation-and-migration-elements',
    'specializations-of-composite-elements',
    'specializations-of-relationships-and-junctions'
  ];

  assert.equal(languageCustomizationMechanismsCatalog.status, 'c260-outline-derived');
  assert.equal(
    languageCustomizationMechanismsCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(languageCustomizationMechanismsCatalog.expectedCount, expectedLanguageCustomizationMechanismsIds.length);
  assert.deepEqual(languageCustomizationMechanismsCatalog.expectedIds, expectedLanguageCustomizationMechanismsIds);
  assert.deepEqual(
    languageCustomizationMechanismsCoverage.map((languageCustomizationMechanismsItem) => languageCustomizationMechanismsItem.id),
    expectedLanguageCustomizationMechanismsIds
  );
  assert.equal(
    languageCustomizationMechanismsCoverage.every((languageCustomizationMechanismsItem) => languageCustomizationMechanismsItem.c260Section && languageCustomizationMechanismsItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeLanguageCustomizationMechanismsCoverage/);
  assert.match(languageIndex, /languageCustomizationMechanismsCoverage: languageCustomizationMechanismsCoverage/);
  assert.match(languageIndex, /missingLanguageCustomizationMechanismsIds/);
  assert.match(readme, /languageCustomizationMechanismsCoverage\.expectedIds/);
  assert.match(sources, /languageCustomizationMechanismsCoverage\.actualIds/);
  assert.match(officialSpec, /languageCustomizationMechanismsCoverage\.missingLanguageCustomizationMechanismsIds/);
  assert.match(plan, /Language customization mechanisms coverage status reports/);
});

test('archimate 4 implementation status exposes C260 appendix A notation coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const appendixANotationCatalog = profile.conformance.appendixANotationCoverageCatalog;
  const appendixANotationCoverage = profile.conformance.appendixANotationCoverage;
  const expectedAppendixANotationIds = [
    'core-elements',
    'motivation-strategy-implementation-and-migration-elements',
    'relationships-and-junctions'
  ];

  assert.equal(appendixANotationCatalog.status, 'c260-outline-derived');
  assert.equal(
    appendixANotationCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(appendixANotationCatalog.expectedCount, expectedAppendixANotationIds.length);
  assert.deepEqual(appendixANotationCatalog.expectedIds, expectedAppendixANotationIds);
  assert.deepEqual(
    appendixANotationCoverage.map((appendixANotationItem) => appendixANotationItem.id),
    expectedAppendixANotationIds
  );
  assert.equal(
    appendixANotationCoverage.every((appendixANotationItem) => appendixANotationItem.c260Section && appendixANotationItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeAppendixANotationCoverage/);
  assert.match(languageIndex, /appendixANotationCoverage: appendixANotationCoverage/);
  assert.match(languageIndex, /missingAppendixANotationIds/);
  assert.match(readme, /appendixANotationCoverage\.expectedIds/);
  assert.match(sources, /appendixANotationCoverage\.actualIds/);
  assert.match(officialSpec, /appendixANotationCoverage\.missingAppendixANotationIds/);
  assert.match(plan, /Appendix A notation coverage status reports/);
});

test('archimate 4 implementation status exposes C260 appendix B relationships coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const appendixBRelationshipsCatalog = profile.conformance.appendixBRelationshipsCoverageCatalog;
  const appendixBRelationshipsCoverage = profile.conformance.appendixBRelationshipsCoverage;
  const expectedAppendixBRelationshipsIds = [
    'specification-of-derivation-rules',
    'derivation-rules-for-valid-relationships',
    'valid-derivations-for-specialization-relationships',
    'valid-derivations-for-structural-relationships',
    'valid-derivations-for-dependency-relationships',
    'valid-derivations-for-dynamic-relationships',
    'derivation-rules-for-potential-relationships',
    'potential-derivation-for-specialization-relationships',
    'potential-derivation-for-structural-and-dependency-relationships',
    'potential-derivation-for-dependency-relationships',
    'potential-derivation-for-dynamic-relationships',
    'potential-derivation-rule-for-grouping',
    'restrictions-on-applying-derivation-rules',
    'relationship-tables',
    'grouping-plateau-and-relationships-between-relationships'
  ];

  assert.equal(appendixBRelationshipsCatalog.status, 'c260-outline-derived');
  assert.equal(
    appendixBRelationshipsCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(appendixBRelationshipsCatalog.expectedCount, expectedAppendixBRelationshipsIds.length);
  assert.deepEqual(appendixBRelationshipsCatalog.expectedIds, expectedAppendixBRelationshipsIds);
  assert.deepEqual(
    appendixBRelationshipsCoverage.map((appendixBRelationshipsItem) => appendixBRelationshipsItem.id),
    expectedAppendixBRelationshipsIds
  );
  assert.equal(
    appendixBRelationshipsCoverage.every((appendixBRelationshipsItem) => appendixBRelationshipsItem.c260Section && appendixBRelationshipsItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeAppendixBRelationshipsCoverage/);
  assert.match(languageIndex, /appendixBRelationshipsCoverage: appendixBRelationshipsCoverage/);
  assert.match(languageIndex, /missingAppendixBRelationshipsIds/);
  assert.match(readme, /appendixBRelationshipsCoverage\.expectedIds/);
  assert.match(sources, /appendixBRelationshipsCoverage\.actualIds/);
  assert.match(officialSpec, /appendixBRelationshipsCoverage\.missingAppendixBRelationshipsIds/);
  assert.match(plan, /Appendix B relationships coverage status reports/);
});

test('archimate 4 implementation status exposes C260 appendix C example viewpoints coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const appendixCExampleViewpointsCatalog = profile.conformance.appendixCExampleViewpointsCoverageCatalog;
  const appendixCExampleViewpointsCoverage = profile.conformance.appendixCExampleViewpointsCoverage;
  const expectedAppendixCExampleViewpointsIds = [
    'basic-viewpoints-in-the-archimate-language',
    'organization-viewpoint',
    'application-structure-viewpoint',
    'information-structure-viewpoint',
    'technology-viewpoint',
    'layered-viewpoint',
    'physical-viewpoint',
    'product-viewpoint',
    'application-usage-viewpoint',
    'technology-usage-viewpoint',
    'process-cooperation-viewpoint',
    'application-cooperation-viewpoint',
    'service-realization-viewpoint',
    'implementation-and-deployment-viewpoint',
    'motivation-viewpoints',
    'stakeholder-viewpoint',
    'goal-realization-viewpoint',
    'requirements-realization-viewpoint',
    'motivation-viewpoint',
    'strategy-viewpoints',
    'strategy-viewpoint',
    'capability-map-viewpoint',
    'value-stream-viewpoint',
    'outcome-realization-viewpoint',
    'resource-map-viewpoint',
    'implementation-and-migration-viewpoints',
    'project-viewpoint',
    'migration-viewpoint',
    'implementation-and-migration-viewpoint'
  ];

  assert.equal(appendixCExampleViewpointsCatalog.status, 'c260-outline-derived');
  assert.equal(
    appendixCExampleViewpointsCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(appendixCExampleViewpointsCatalog.expectedCount, expectedAppendixCExampleViewpointsIds.length);
  assert.deepEqual(appendixCExampleViewpointsCatalog.expectedIds, expectedAppendixCExampleViewpointsIds);
  assert.deepEqual(
    appendixCExampleViewpointsCoverage.map((appendixCExampleViewpointsItem) => appendixCExampleViewpointsItem.id),
    expectedAppendixCExampleViewpointsIds
  );
  assert.equal(
    appendixCExampleViewpointsCoverage.every((appendixCExampleViewpointsItem) => appendixCExampleViewpointsItem.c260Section && appendixCExampleViewpointsItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeAppendixCExampleViewpointsCoverage/);
  assert.match(languageIndex, /appendixCExampleViewpointsCoverage: appendixCExampleViewpointsCoverage/);
  assert.match(languageIndex, /missingAppendixCExampleViewpointsIds/);
  assert.match(readme, /appendixCExampleViewpointsCoverage\.expectedIds/);
  assert.match(sources, /appendixCExampleViewpointsCoverage\.actualIds/);
  assert.match(officialSpec, /appendixCExampleViewpointsCoverage\.missingAppendixCExampleViewpointsIds/);
  assert.match(plan, /Appendix C example viewpoints coverage status reports/);
});

test('archimate 4 implementation status exposes C260 appendix D standards guidance coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const appendixDStandardsGuidanceCatalog = profile.conformance.appendixDStandardsGuidanceCoverageCatalog;
  const appendixDStandardsGuidanceCoverage = profile.conformance.appendixDStandardsGuidanceCoverage;
  const expectedAppendixDStandardsGuidanceIds = [
    'togaf-standard',
    'bizbok-guide',
    'other-modeling-languages',
    'bpmn',
    'uml',
    'bmm'
  ];

  assert.equal(appendixDStandardsGuidanceCatalog.status, 'c260-outline-derived');
  assert.equal(
    appendixDStandardsGuidanceCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(appendixDStandardsGuidanceCatalog.expectedCount, expectedAppendixDStandardsGuidanceIds.length);
  assert.deepEqual(appendixDStandardsGuidanceCatalog.expectedIds, expectedAppendixDStandardsGuidanceIds);
  assert.deepEqual(
    appendixDStandardsGuidanceCoverage.map((appendixDStandardsGuidanceItem) => appendixDStandardsGuidanceItem.id),
    expectedAppendixDStandardsGuidanceIds
  );
  assert.equal(
    appendixDStandardsGuidanceCoverage.every((appendixDStandardsGuidanceItem) => appendixDStandardsGuidanceItem.c260Section && appendixDStandardsGuidanceItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeAppendixDStandardsGuidanceCoverage/);
  assert.match(languageIndex, /appendixDStandardsGuidanceCoverage: appendixDStandardsGuidanceCoverage/);
  assert.match(languageIndex, /missingAppendixDStandardsGuidanceIds/);
  assert.match(readme, /appendixDStandardsGuidanceCoverage\.expectedIds/);
  assert.match(sources, /appendixDStandardsGuidanceCoverage\.actualIds/);
  assert.match(officialSpec, /appendixDStandardsGuidanceCoverage\.missingAppendixDStandardsGuidanceIds/);
  assert.match(plan, /Appendix D standards guidance coverage status reports/);
});

test('archimate 4 implementation status exposes C260 appendix E version changes coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const appendixEVersionChangesCatalog = profile.conformance.appendixEVersionChangesCoverageCatalog;
  const appendixEVersionChangesCoverage = profile.conformance.appendixEVersionChangesCoverage;
  const expectedAppendixEVersionChangesIds = [
    'changes-from-version-2-1-to-version-3-0-1',
    'changes-from-version-3-0-1-to-version-3-1',
    'changes-from-version-3-1-to-version-3-2',
    'changes-from-version-3-2-to-this-document'
  ];

  assert.equal(appendixEVersionChangesCatalog.status, 'c260-outline-derived');
  assert.equal(
    appendixEVersionChangesCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt'
  );
  assert.equal(appendixEVersionChangesCatalog.expectedCount, expectedAppendixEVersionChangesIds.length);
  assert.deepEqual(appendixEVersionChangesCatalog.expectedIds, expectedAppendixEVersionChangesIds);
  assert.deepEqual(
    appendixEVersionChangesCoverage.map((appendixEVersionChangesItem) => appendixEVersionChangesItem.id),
    expectedAppendixEVersionChangesIds
  );
  assert.equal(
    appendixEVersionChangesCoverage.every((appendixEVersionChangesItem) => appendixEVersionChangesItem.c260Section && appendixEVersionChangesItem.heading),
    true
  );

  assert.match(languageIndex, /function summarizeAppendixEVersionChangesCoverage/);
  assert.match(languageIndex, /appendixEVersionChangesCoverage: appendixEVersionChangesCoverage/);
  assert.match(languageIndex, /missingAppendixEVersionChangesIds/);
  assert.match(readme, /appendixEVersionChangesCoverage\.expectedIds/);
  assert.match(sources, /appendixEVersionChangesCoverage\.actualIds/);
  assert.match(officialSpec, /appendixEVersionChangesCoverage\.missingAppendixEVersionChangesIds/);
  assert.match(plan, /Appendix E version changes coverage status reports/);
});

test('archimate 4 implementation status exposes C260 appendix F acronym coverage identity', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const appendixFAcronymsCatalog = profile.conformance.appendixFAcronymsCoverageCatalog;
  const appendixFAcronymsCoverage = profile.conformance.appendixFAcronymsCoverage;
  const expectedAppendixFAcronymIds = [
    'abb',
    'adm',
    'ai',
    'ascii',
    'b2b',
    'bmm',
    'bpmn',
    'ceo',
    'cfo',
    'cio',
    'cmo',
    'crm',
    'dr',
    'erd',
    'gui',
    'html',
    'iaas',
    'ict',
    'iot',
    'lan',
    'jee',
    'pdf',
    'pdr',
    'rtf',
    'sbb',
    'swot',
    'uml',
    'vpn',
    'wan',
    'wlan',
    'xml'
  ];

  assert.equal(appendixFAcronymsCatalog.status, 'c260-acronym-token-derived');
  assert.equal(
    appendixFAcronymsCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-1066-c260-appendix-f-acronyms-source-check.txt'
  );
  assert.equal(appendixFAcronymsCatalog.expectedCount, expectedAppendixFAcronymIds.length);
  assert.deepEqual(appendixFAcronymsCatalog.expectedIds, expectedAppendixFAcronymIds);
  assert.deepEqual(
    appendixFAcronymsCoverage.map((appendixFAcronymItem) => appendixFAcronymItem.id),
    expectedAppendixFAcronymIds
  );
  assert.equal(
    appendixFAcronymsCoverage.every((appendixFAcronymItem) => appendixFAcronymItem.c260Section && appendixFAcronymItem.acronym),
    true
  );

  assert.match(languageIndex, /function summarizeAppendixFAcronymsCoverage/);
  assert.match(languageIndex, /appendixFAcronymsCoverage: appendixFAcronymsCoverage/);
  assert.match(languageIndex, /missingAppendixFAcronymIds/);
  assert.match(readme, /appendixFAcronymsCoverage\.expectedIds/);
  assert.match(sources, /appendixFAcronymsCoverage\.actualIds/);
  assert.match(officialSpec, /appendixFAcronymsCoverage\.missingAppendixFAcronymIds/);
  assert.match(plan, /Appendix F acronym coverage status reports/);
});

test('archimate 4 implementation status exposes C260 document artifact boundary', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const documentArtifactCatalog = profile.conformance.documentArtifactCoverageCatalog;
  const documentArtifactCoverage = profile.conformance.documentArtifactCoverage;
  const sectionCatalog = profile.conformance.sectionCoverageCatalog;
  const expectedDocumentArtifactIds = [
    'cover',
    'title',
    'copyright',
    'table-of-contents',
    'preface',
    'the-open-group',
    'this-document',
    'trademarks',
    'acknowledgements',
    'referenced-documents',
    'index'
  ];

  assert.equal(documentArtifactCatalog.status, 'c260-outline-derived');
  assert.equal(
    documentArtifactCatalog.sourceRunlogPath,
    'project_memory/runlogs/20260709-1093-c260-document-artifacts-source-check.txt'
  );
  assert.equal(documentArtifactCatalog.expectedCount, expectedDocumentArtifactIds.length);
  assert.deepEqual(documentArtifactCatalog.expectedIds, expectedDocumentArtifactIds);
  assert.deepEqual(
    documentArtifactCoverage.map((documentArtifactItem) => documentArtifactItem.id),
    expectedDocumentArtifactIds
  );
  assert.equal(documentArtifactCoverage.every((documentArtifactItem) => documentArtifactItem.nonImplementation), true);
  assert.equal(documentArtifactCoverage.every((documentArtifactItem) => Number.isInteger(documentArtifactItem.pdfPage)), true);
  assert.deepEqual(documentArtifactCoverage.filter((documentArtifactItem) => documentArtifactItem.depth === 1).map((documentArtifactItem) => documentArtifactItem.id), [
    'the-open-group',
    'this-document'
  ]);
  assert.equal(sectionCatalog.expectedIds.includes('index'), false);
  assert.equal(sectionCatalog.expectedIds.includes('table-of-contents'), false);

  assert.match(languageIndex, /function summarizeDocumentArtifactCoverage/);
  assert.match(languageIndex, /documentArtifactCoverage: documentArtifactCoverage/);
  assert.match(languageIndex, /missingDocumentArtifactIds/);
  assert.match(readme, /documentArtifactCoverage\.expectedIds/);
  assert.match(sources, /documentArtifactCoverage\.actualIds/);
  assert.match(officialSpec, /documentArtifactCoverage\.missingDocumentArtifactIds/);
  assert.match(plan, /Document artifact coverage status reports/);
});

test('archimate 4 implementation status exposes aggregate C260 coverage integrity', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const { getArchimate4ImplementationStatus } = await import('../lib/metamodel/languages/index.js');
  const status = getArchimate4ImplementationStatus();
  const aggregate = status.c260CoverageAggregate;
  const expectedCoverageIds = [
    'sectionCoverage',
    'introductionCoverage',
    'definitionCoverage',
    'languageStructureCoverage',
    'commonDomainCoverage',
    'relationshipsAndJunctionsCoverage',
    'motivationDomainCoverage',
    'strategyDomainCoverage',
    'businessDomainCoverage',
    'applicationDomainCoverage',
    'technologyDomainCoverage',
    'relationshipsBetweenCoreDomainsCoverage',
    'implementationAndMigrationDomainCoverage',
    'stakeholdersArchitectureViewsViewpointsCoverage',
    'languageCustomizationMechanismsCoverage',
    'appendixANotationCoverage',
    'appendixBRelationshipsCoverage',
    'appendixCExampleViewpointsCoverage',
    'appendixDStandardsGuidanceCoverage',
    'appendixEVersionChangesCoverage',
    'appendixFAcronymsCoverage',
    'documentArtifactCoverage'
  ];
  const expectedRawDuplicateIds = [
    'conformance',
    'active-structure-elements',
    'behavior-elements',
    'relationships-with-other-domains',
    'passive-structure-elements',
    'composite-elements',
    'active-structure-example',
    'passive-structure-example',
    'viewpoint-mechanism',
    'relationships-and-junctions',
    'bmm',
    'bpmn',
    'uml'
  ];

  assert.deepEqual(aggregate.expectedCoverageIds, expectedCoverageIds);
  assert.deepEqual(aggregate.actualCoverageIds, expectedCoverageIds);
  assert.deepEqual(aggregate.incompleteCoverageIds, []);
  assert.equal(aggregate.expectedCoverageCount, expectedCoverageIds.length);
  assert.equal(aggregate.expectedItemCount, 284);
  assert.equal(aggregate.actualItemCount, 284);
  assert.equal(aggregate.qualifiedItemCount, 284);
  assert.equal(aggregate.qualifiedDuplicateCount, 0);
  assert.equal(aggregate.uniqueRawItemCount, 265);
  assert.deepEqual(aggregate.rawDuplicateIds, expectedRawDuplicateIds);
  assert.equal(aggregate.complete, true);

  assert.match(languageIndex, /function summarizeC260CoverageAggregate/);
  assert.match(languageIndex, /c260CoverageAggregate: c260CoverageAggregate/);
  assert.match(readme, /c260CoverageAggregate\.qualifiedDuplicateCount/);
  assert.match(sources, /c260CoverageAggregate\.rawDuplicateIds/);
  assert.match(officialSpec, /c260CoverageAggregate\.incompleteCoverageIds/);
  assert.match(plan, /Aggregate C260 coverage status reports/);
});

test('archimate 4 implementation status reconciles C260 PDF outline source with derived coverage', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const { getArchimate4ImplementationStatus } = await import('../lib/metamodel/languages/index.js');
  const status = getArchimate4ImplementationStatus();
  const alignment = status.c260SourceAlignment;
  const expectedOutlineCoverageIds = [
    'sectionCoverage',
    'introductionCoverage',
    'definitionCoverage',
    'languageStructureCoverage',
    'commonDomainCoverage',
    'relationshipsAndJunctionsCoverage',
    'motivationDomainCoverage',
    'strategyDomainCoverage',
    'businessDomainCoverage',
    'applicationDomainCoverage',
    'technologyDomainCoverage',
    'relationshipsBetweenCoreDomainsCoverage',
    'implementationAndMigrationDomainCoverage',
    'stakeholdersArchitectureViewsViewpointsCoverage',
    'languageCustomizationMechanismsCoverage',
    'appendixANotationCoverage',
    'appendixBRelationshipsCoverage',
    'appendixCExampleViewpointsCoverage',
    'appendixDStandardsGuidanceCoverage',
    'appendixEVersionChangesCoverage',
    'documentArtifactCoverage'
  ];
  const expectedSourceRawDuplicateIds = [
    'conformance',
    'active-structure-elements',
    'behavior-elements',
    'example',
    'relationships-with-other-domains',
    'passive-structure-elements',
    'composite-elements',
    'introduction',
    'relationships-and-junctions'
  ];

  assert.equal(profile.conformance.c260SourceAlignmentCatalog.outlineSourceItemCount, 253);
  assert.equal(alignment.status, 'c260-pdf-outline-and-derived-token-aligned');
  assert.equal(alignment.outlineSourceRunlogPath, 'project_memory/runlogs/20260709-1118-c260-full-outline-source-check.txt');
  assert.equal(alignment.outlineSourceItemCount, 253);
  assert.equal(alignment.outlineCoveredItemCount, 253);
  assert.equal(alignment.outlineItemCountDelta, 0);
  assert.deepEqual(alignment.expectedOutlineCoverageIds, expectedOutlineCoverageIds);
  assert.deepEqual(alignment.actualOutlineCoverageIds, expectedOutlineCoverageIds);
  assert.deepEqual(alignment.missingOutlineCoverageIds, []);
  assert.deepEqual(alignment.extraOutlineCoverageIds, []);
  assert.deepEqual(alignment.incompleteOutlineCoverageIds, []);
  assert.deepEqual(alignment.nonOutlineDerivedCoverageIds, [ 'appendixFAcronymsCoverage' ]);
  assert.equal(alignment.nonOutlineDerivedItemCount, 31);
  assert.equal(alignment.aggregateItemCount, 284);
  assert.equal(alignment.expectedAggregateItemCount, 284);
  assert.equal(alignment.aggregateItemCountDelta, 0);
  assert.deepEqual(alignment.sourceRawDuplicateIds, expectedSourceRawDuplicateIds);
  assert.equal(alignment.complete, true);

  assert.match(languageIndex, /function summarizeC260SourceAlignment/);
  assert.match(languageIndex, /c260SourceAlignment: c260SourceAlignment/);
  assert.match(readme, /c260SourceAlignment\.outlineSourceItemCount/);
  assert.match(sources, /c260SourceAlignment\.nonOutlineDerivedCoverageIds/);
  assert.match(officialSpec, /c260SourceAlignment\.missingOutlineCoverageIds/);
  assert.match(plan, /C260 source alignment status reports/);
});

test('archimate 4 implementation status audits C260 outline assignment counts by coverage group', async () => {
  const profile = await readJson('../lib/metamodel/languages/archimate4-profile.json');
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const { getArchimate4ImplementationStatus } = await import('../lib/metamodel/languages/index.js');
  const status = getArchimate4ImplementationStatus();
  const alignment = status.c260SourceAlignment;
  const expectedOutlineCoverageCounts = {
    sectionCoverage: 20,
    introductionCoverage: 6,
    definitionCoverage: 16,
    languageStructureCoverage: 14,
    commonDomainCoverage: 13,
    relationshipsAndJunctionsCoverage: 24,
    motivationDomainCoverage: 19,
    strategyDomainCoverage: 10,
    businessDomainCoverage: 12,
    applicationDomainCoverage: 9,
    technologyDomainCoverage: 15,
    relationshipsBetweenCoreDomainsCoverage: 1,
    implementationAndMigrationDomainCoverage: 8,
    stakeholdersArchitectureViewsViewpointsCoverage: 7,
    languageCustomizationMechanismsCoverage: 11,
    appendixANotationCoverage: 3,
    appendixBRelationshipsCoverage: 15,
    appendixCExampleViewpointsCoverage: 29,
    appendixDStandardsGuidanceCoverage: 6,
    appendixEVersionChangesCoverage: 4,
    documentArtifactCoverage: 11
  };

  assert.deepEqual(
    profile.conformance.c260SourceAlignmentCatalog.expectedOutlineCoverageCounts,
    expectedOutlineCoverageCounts
  );
  assert.deepEqual(alignment.expectedOutlineCoverageCounts, expectedOutlineCoverageCounts);
  assert.deepEqual(alignment.actualOutlineCoverageCounts, expectedOutlineCoverageCounts);
  assert.deepEqual(alignment.missingOutlineCoverageCountIds, []);
  assert.deepEqual(alignment.extraOutlineCoverageCountIds, []);
  assert.deepEqual(alignment.outlineCoverageCountDeltas, []);
  assert.equal(alignment.expectedOutlineAssignedItemCount, 253);
  assert.equal(alignment.actualOutlineAssignedItemCount, 253);
  assert.equal(alignment.outlineAssignmentComplete, true);
  assert.equal(alignment.complete, true);

  assert.match(languageIndex, /outlineCoverageCountDeltas/);
  assert.match(readme, /c260SourceAlignment\.outlineCoverageCountDeltas/);
  assert.match(sources, /c260SourceAlignment\.expectedOutlineCoverageCounts/);
  assert.match(officialSpec, /c260SourceAlignment\.missingOutlineCoverageCountIds/);
  assert.match(plan, /C260 outline assignment status reports/);
});

test('archimate 4 implementation status audits C260 coverage source runlog evidence', async () => {
  const languageIndex = await readFile(new URL('../lib/metamodel/languages/index.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const sources = await readFile(new URL('../docs/archimate4/sources.md', import.meta.url), 'utf8');
  const officialSpec = await readFile(new URL('../docs/archimate4/official-specification.md', import.meta.url), 'utf8');
  const plan = await readFile(new URL('../docs/superpowers/plans/2026-07-08-archimate-4-support.md', import.meta.url), 'utf8');
  const { getArchimate4ImplementationStatus } = await import('../lib/metamodel/languages/index.js');
  const status = getArchimate4ImplementationStatus();
  const evidence = status.c260CoverageSourceEvidence;
  const outlineRunlogPath = 'project_memory/runlogs/20260709-805-c260-outline-current-extract.txt';
  const expectedCoverageSourceRunlogPaths = {
    sectionCoverage: outlineRunlogPath,
    introductionCoverage: outlineRunlogPath,
    definitionCoverage: outlineRunlogPath,
    languageStructureCoverage: outlineRunlogPath,
    commonDomainCoverage: outlineRunlogPath,
    relationshipsAndJunctionsCoverage: outlineRunlogPath,
    motivationDomainCoverage: outlineRunlogPath,
    strategyDomainCoverage: outlineRunlogPath,
    businessDomainCoverage: outlineRunlogPath,
    applicationDomainCoverage: outlineRunlogPath,
    technologyDomainCoverage: outlineRunlogPath,
    relationshipsBetweenCoreDomainsCoverage: outlineRunlogPath,
    implementationAndMigrationDomainCoverage: outlineRunlogPath,
    stakeholdersArchitectureViewsViewpointsCoverage: outlineRunlogPath,
    languageCustomizationMechanismsCoverage: outlineRunlogPath,
    appendixANotationCoverage: outlineRunlogPath,
    appendixBRelationshipsCoverage: outlineRunlogPath,
    appendixCExampleViewpointsCoverage: outlineRunlogPath,
    appendixDStandardsGuidanceCoverage: outlineRunlogPath,
    appendixEVersionChangesCoverage: outlineRunlogPath,
    appendixFAcronymsCoverage: 'project_memory/runlogs/20260709-1066-c260-appendix-f-acronyms-source-check.txt',
    documentArtifactCoverage: 'project_memory/runlogs/20260709-1093-c260-document-artifacts-source-check.txt'
  };

  assert.equal(evidence.status, 'c260-coverage-source-evidence-aligned');
  assert.deepEqual(evidence.coverageSourceRunlogPaths, expectedCoverageSourceRunlogPaths);
  assert.deepEqual(evidence.missingSourceRunlogCoverageIds, []);
  assert.deepEqual(evidence.extraSourceRunlogCoverageIds, []);
  assert.deepEqual(evidence.sourceRunlogPathDeltas, []);
  assert.deepEqual(evidence.uniqueSourceRunlogPaths, [
    outlineRunlogPath,
    'project_memory/runlogs/20260709-1066-c260-appendix-f-acronyms-source-check.txt',
    'project_memory/runlogs/20260709-1093-c260-document-artifacts-source-check.txt'
  ]);
  assert.equal(evidence.expectedCoverageCount, 22);
  assert.equal(evidence.actualCoverageCount, 22);
  assert.equal(evidence.complete, true);

  await Promise.all(evidence.uniqueSourceRunlogPaths.map((runlogPath) => {
    return readFile(new URL(`../${runlogPath}`, import.meta.url), 'utf8');
  }));

  assert.match(languageIndex, /function summarizeC260CoverageSourceEvidence/);
  assert.match(languageIndex, /c260CoverageSourceEvidence: c260CoverageSourceEvidence/);
  assert.match(readme, /c260CoverageSourceEvidence\.missingSourceRunlogCoverageIds/);
  assert.match(sources, /c260CoverageSourceEvidence\.coverageSourceRunlogPaths/);
  assert.match(officialSpec, /c260CoverageSourceEvidence\.sourceRunlogPathDeltas/);
  assert.match(plan, /C260 coverage source evidence status reports/);
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
  assert.equal(
    sourceCoverage.w262.publicationPageTitle,
    'The Motivation for Changes in the ArchiMate® 4 Specification'
  );
  assert.equal(sourceCoverage.w262.lastPublicationPageCheckedAt, '2026-07-09T17:28:55+09:00');
  assert.equal(
    sourceCoverage.w262.lastPublicationPageRunlogPath,
    'project_memory/runlogs/20260709-1343-external-source-continuation-recheck.json'
  );
  assert.equal(sourceCoverage.w262.freePdfDetected, true);
  assert.equal(sourceCoverage.w262.loginRequiredDetected, true);
  assert.equal(sourceCoverage.w262.pages22Detected, true);
  assert.equal(sourceCoverage.w262.published20260427Detected, true);
  assert.equal(sourceCoverage.w262.lastLocalSearchAt, '2026-07-09T17:28:55+09:00');
  assert.equal(
    sourceCoverage.w262.lastLocalSearchRunlogPath,
    'project_memory/runlogs/20260709-1343-external-source-continuation-recheck.json'
  );
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
  assert.equal(
    sourceCoverage.appendixBRelationshipMatrix.relationshipProfileResetApi,
    'resetArchimate4RelationshipProfile'
  );
  assert.equal(
    sourceCoverage.appendixBRelationshipMatrix.relationshipProfileSourceMetadataField,
    'getArchimate4RelationshipProfileStatus().sourceMetadata'
  );
  assert.equal(
    sourceCoverage.appendixBRelationshipMatrix.relationshipProfileSourceScopeField,
    'getArchimate4RelationshipProfileStatus().sourceScope'
  );
  assert.equal(sourceCoverage.appendixBRelationshipMatrix.viewerScopedProfileResetImplemented, true);
  assert.equal(sourceCoverage.meff4Xsd.status, 'external-source-required');
  assert.equal(sourceCoverage.meff4Xsd.directoryStatusCode, 200);
  assert.equal(sourceCoverage.meff4Xsd.official4XsdDiscovered, false);
  assert.equal(
    sourceCoverage.meff4Xsd.lastRunlogPath,
    'project_memory/runlogs/20260709-1343-external-source-continuation-recheck.json'
  );
  assert.deepEqual(sourceCoverage.meff4Xsd.discoveredXsdLinks, [
    '3.1/archimate3_Diagram.xsd',
    '3.1/archimate3_Model.xsd',
    '3.1/archimate3_View.xsd'
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
      'https://www.opengroup.org/xsd/archimate/4.0/archimate_Model.xsd'
    ],
    404
  );
  assert.equal(
    sourceCoverage.meff4Xsd.candidateStatusCodes[
      'https://www.opengroup.org/xsd/archimate/4.0/archimate_Diagram.xsd'
    ],
    404
  );
  assert.equal(
    sourceCoverage.meff4Xsd.candidateStatusCodes[
      'https://www.opengroup.org/xsd/archimate/4.0/archimate_View.xsd'
    ],
    404
  );
  assert.equal(
    sourceCoverage.meff4Xsd.candidateStatusCodes[
      'https://www.opengroup.org/xsd/archimate/4.0/archimate4_ModelExchangeFile.xsd'
    ],
    404
  );
  assert.equal(
    sourceCoverage.meff4Xsd.candidateStatusCodes[
      'https://www.opengroup.org/xsd/archimate/3.1/archimate3_Model.xsd'
    ],
    200
  );
  assert.equal(sourceCoverage.appendixAArtworkRights.status, 'external-rights-required');
  assert.equal(sourceCoverage.appendixAArtworkRights.localSourcePresent, false);
  assert.equal(sourceCoverage.appendixAArtworkRights.localArtworkPolicy, 'locally-authored-renderer-paths');
  assert.equal(sourceCoverage.appendixAArtworkRights.localDedicatedPathCoverageComplete, true);
  assert.equal(sourceCoverage.appendixAArtworkRights.officialAppendixAArtworkCommitted, false);
  assert.equal(sourceCoverage.appendixAArtworkRights.exactArtworkRedistributionRightsConfirmed, false);
  assert.equal(
    sourceCoverage.appendixAArtworkRights.lastPictogramAuditRunlogPath,
    'project_memory/runlogs/20260709-1189-appendix-a-artwork-rights-pictogram-audit.json'
  );
  assert.equal(sourceCoverage.appendixAArtworkRights.profileConceptAndConnectorCount, 44);
  assert.equal(sourceCoverage.appendixAArtworkRights.profilePictogramRefCount, 41);
  assert.equal(sourceCoverage.appendixAArtworkRights.nonObjectPictoRefCount, 40);
  assert.deepEqual(sourceCoverage.appendixAArtworkRights.objectPictoRefConceptTypes, [
    'BusinessObject',
    'DataObject'
  ]);
  assert.deepEqual(sourceCoverage.appendixAArtworkRights.missingPathMapRefs, []);
  assert.deepEqual(sourceCoverage.appendixAArtworkRights.objectAliasRefs, []);

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
  assert.match(sources, /20260709-1343-external-source-continuation-recheck/);
  assert.match(sources, /redistributable Appendix B profile artifact is still not present/);
  assert.match(sources, /20260709-731-meff4-xsd-latest-recheck/);
  assert.match(officialSpec, /20260709-1343-external-source-continuation-recheck/);
  assert.match(sources, /20260709-1189-appendix-a-artwork-rights-pictogram-audit/);
  assert.match(officialSpec, /locally-authored renderer\s+paths/);
  assert.match(officialSpec, /sourceCoverage\.expectedSourceIds/);
});

test('archimate 4 source coverage status agrees with external source runlog evidence', async () => {
  const status = getArchimate4ImplementationStatus();
  const sourceCoverage = status.sourceCoverage.items;
  const meff4Xsd = sourceCoverage.meff4Xsd;
  const w262 = sourceCoverage.w262;
  const runlog = await readJson(`../${meff4Xsd.lastRunlogPath}`);

  assert.equal(meff4Xsd.lastRunlogPath, w262.lastPublicationPageRunlogPath);
  assert.equal(w262.lastPublicationPageRunlogPath, w262.lastLocalSearchRunlogPath);
  assert.equal(runlog.checkedAt, meff4Xsd.lastCheckedAt);
  assert.equal(runlog.checkedAt, w262.lastPublicationPageCheckedAt);
  assert.equal(runlog.checkedAt, w262.lastLocalSearchAt);

  assert.equal(runlog.meff4Xsd.url, meff4Xsd.url);
  assert.equal(runlog.meff4Xsd.directoryStatusCode, meff4Xsd.directoryStatusCode);
  assert.equal(runlog.meff4Xsd.official4XsdDiscovered, meff4Xsd.official4XsdDiscovered);
  assert.deepEqual(runlog.meff4Xsd.discoveredXsdLinks, meff4Xsd.discoveredXsdLinks);
  assert.deepEqual(runlog.meff4Xsd.candidateStatusCodes, meff4Xsd.candidateStatusCodes);

  assert.equal(runlog.w262.url, w262.url);
  assert.equal(runlog.w262.publicationPageStatusCode, w262.publicationPageStatusCode);
  assert.equal(runlog.w262.titleDetected, true);
  assert.equal(runlog.w262.freePdfDetected, w262.freePdfDetected);
  assert.equal(runlog.w262.loginRequiredDetected, w262.loginRequiredDetected);
  assert.equal(runlog.w262.pages22Detected, w262.pages22Detected);
  assert.equal(runlog.w262.published20260427Detected, w262.published20260427Detected);
  assert.deepEqual(runlog.w262.localSearchRoots, w262.localSearchRoots);
  assert.deepEqual(runlog.w262.localSearchPatterns, w262.localSearchPatterns);
  assert.deepEqual(
    runlog.w262.localSearchMatchedFiles.map((candidate) => candidate.path),
    w262.localSearchMatchedFiles
  );
});

test('archimate 4 Appendix A artwork status agrees with pictogram audit evidence', async () => {
  const status = getArchimate4ImplementationStatus();
  const appendixA = status.sourceCoverage.items.appendixAArtworkRights;
  const iconography = status.iconography;
  const runlog = await readJson(`../${appendixA.lastPictogramAuditRunlogPath}`);

  assert.equal(runlog.checkedAt, appendixA.lastPictogramAuditAt);
  assert.equal(runlog.sourceCoverageId, 'appendixAArtworkRights');
  assert.equal(runlog.externalBlocker, appendixA.externalBlocker);
  assert.equal(runlog.exactArtworkRedistributionRightsConfirmed, appendixA.exactArtworkRedistributionRightsConfirmed);
  assert.equal(runlog.exactArtworkRedistributionRightsRequired, appendixA.required);
  assert.equal(runlog.localArtworkPolicy, appendixA.localArtworkPolicy);
  assert.equal(runlog.localDedicatedPathCoverageComplete, appendixA.localDedicatedPathCoverageComplete);
  assert.equal(runlog.officialAppendixAArtworkCommitted, appendixA.officialAppendixAArtworkCommitted);
  assert.equal(runlog.profileConceptAndConnectorCount, appendixA.profileConceptAndConnectorCount);
  assert.equal(runlog.profilePictogramRefCount, appendixA.profilePictogramRefCount);
  assert.equal(runlog.nonObjectPictoRefCount, appendixA.nonObjectPictoRefCount);
  assert.deepEqual(runlog.objectPictoRefConceptTypes, appendixA.objectPictoRefConceptTypes);
  assert.deepEqual(runlog.missingPathMapRefs, appendixA.missingPathMapRefs);
  assert.deepEqual(runlog.objectAliasRefs, appendixA.objectAliasRefs);

  assert.equal(runlog.profilePictogramCoverage, iconography.profilePictogramCoverage);
  assert.equal(runlog.genericObjectAliasCount, iconography.genericObjectAliasCount);
  assert.deepEqual(
    runlog.legacyCompatibilityAliases.map((alias) => alias.alias).sort(),
    iconography.legacyCompatibilityAliases.slice().sort()
  );
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

test('archimate 4 external blocker gaps map to source coverage and readiness', () => {
  const status = getArchimate4ImplementationStatus();
  const sourceCoverage = status.sourceCoverage.items;
  const expectedBlockerSourceIds = {
    officialAppendixBRelationshipMatrix: 'appendixBRelationshipMatrix',
    officialMeff4Xsd: 'meff4Xsd',
    exactAppendixAArtworkRights: 'appendixAArtworkRights'
  };
  const gapsById = new Map(status.remainingGaps.items.map((gap) => [ gap.id, gap ]));

  assert.deepEqual(status.remainingGaps.officialConformanceGapIds, status.conformanceReadiness.blockers);
  assert.deepEqual(status.externalBlockerCatalog.actualIds, status.conformanceReadiness.blockers);
  assert.deepEqual(status.externalBlockerCatalog.sourceCoverageIds, status.conformanceReadiness.blockers);
  assert.deepEqual(status.conformanceReadiness.missingRequiredSources, status.sourceCoverage.missingRequiredSources);

  for (const blockerId of status.conformanceReadiness.blockers) {
    const sourceId = expectedBlockerSourceIds[blockerId];
    const gap = gapsById.get(blockerId);
    const source = sourceCoverage[sourceId];

    assert.equal(gap.sourceId, sourceId);
    assert.equal(gap.officialConformanceBlocker, true);
    assert.equal(source.required, true);
    assert.equal(source.localSourcePresent, false);
    assert.equal(source.externalBlocker, blockerId);
  }

  assert.deepEqual(status.remainingGaps.companionGapSourceIds, status.sourceCoverage.missingCompanionSources);
  assert.deepEqual(status.remainingGaps.companionGapSourceIds, [ 'w262' ]);
  assert.equal(gapsById.get('w262CompanionPaper').sourceId, 'w262');
  assert.equal(sourceCoverage.w262.companion, true);
  assert.equal(sourceCoverage.w262.localSourcePresent, false);
});

test('archimate 4 conformance requirement blockers map to gaps and required sources', () => {
  const status = getArchimate4ImplementationStatus();
  const requirements = status.conformanceRequirements.items;
  const gapsByRequirementId = new Map(
    status.remainingGaps.items
      .filter((gap) => gap.requirementId)
      .map((gap) => [ gap.requirementId, gap ])
  );
  const implementedShallRequirements = requirements.filter((requirement) => {
    return requirement.level === 'shall' && requirement.status === 'implemented';
  });
  const externalBlockedShallRequirements = requirements.filter((requirement) => {
    return requirement.level === 'shall' && requirement.externalBlocker;
  });

  assert.deepEqual(implementedShallRequirements.map((requirement) => requirement.id), [
    'language-structure',
    'viewpoint-mechanism',
    'language-customization'
  ]);
  assert.equal(status.conformanceRequirements.shall.implemented, implementedShallRequirements.length);
  assert.equal(status.conformanceReadiness.implementedShallCount, implementedShallRequirements.length);
  assert.equal(implementedShallRequirements.every((requirement) => !gapsByRequirementId.has(requirement.id)), true);

  assert.deepEqual(externalBlockedShallRequirements.map((requirement) => requirement.id), [
    'standard-iconography',
    'appendix-b-relationships'
  ]);
  assert.deepEqual(
    status.externalBlockerCatalog.requirementIds,
    externalBlockedShallRequirements.map((requirement) => requirement.externalBlocker)
  );
  assert.equal(status.conformanceRequirements.shall.externalBlocked, externalBlockedShallRequirements.length);
  assert.equal(status.conformanceReadiness.externalBlockedShallCount, externalBlockedShallRequirements.length);

  for (const requirement of externalBlockedShallRequirements) {
    const gap = gapsByRequirementId.get(requirement.id);
    const source = status.sourceCoverage.items[gap.sourceId];

    assert.equal(gap.officialConformanceBlocker, true);
    assert.equal(gap.id, requirement.externalBlocker);
    assert.equal(source.required, true);
    assert.equal(source.localSourcePresent, false);
    assert.equal(source.externalBlocker, requirement.externalBlocker);
  }
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
    'appendix-d-standards-guidance',
    'appendix-e-version-changes',
    'appendix-f-acronyms'
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

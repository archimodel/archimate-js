import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readJson(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8');
  return JSON.parse(text);
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

  assert.match(languageIndex, /VIEWPOINT_PURPOSES/);
  assert.match(languageIndex, /VIEWPOINT_CONTENT_TYPES/);
  assert.match(languageIndex, /mergeViewpoints\(profile, customProfile\)/);
  assert.match(languageIndex, /validateViewpoint\(viewpoint\)/);
  assert.match(languageIndex, /Unsupported ArchiMate viewpoint/);
  assert.match(readme, /viewpoints/);
});

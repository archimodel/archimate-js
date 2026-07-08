import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Moddle } from 'moddle';
import { Reader } from 'moddle-xml';

async function readDescriptor(path) {
  const descriptor = await readFile(new URL(path, import.meta.url), 'utf8');

  return JSON.parse(descriptor);
}

function findType(descriptor, name) {
  return descriptor.types.find((type) => type.name === name);
}

function findProperty(type, name) {
  return type.properties.find((property) => property.name === name);
}

function getDescriptorTypeReferences(descriptor) {
  const primitiveTypes = new Set([ 'String', 'Boolean', 'Integer', 'Real' ]);
  const typeNames = new Set(descriptor.types.map((type) => type.name));
  const references = [];

  for (const type of descriptor.types) {
    for (const property of type.properties || []) {
      if (property.type && !primitiveTypes.has(property.type) && !typeNames.has(property.type)) {
        references.push(type.name + '.' + property.name + ' -> ' + property.type);
      }
    }
  }

  return references;
}

async function readModel(path, xml) {
  const descriptor = await readDescriptor(path);
  const model = new Moddle({ archimate: descriptor });
  const reader = new Reader({ model, lax: true });

  return reader.fromXML(xml, reader.handler('archimate:Model'));
}

test('archimate 3 fixture keeps current namespace', async () => {
  const xml = await readFile(new URL('./fixtures/archimate3-minimal.xml', import.meta.url), 'utf8');

  assert.match(xml, /http:\/\/www\.opengroup\.org\/xsd\/archimate\/3\.0\//);
});

test('archimate 4 fixture uses archimate 4 namespace', async () => {
  const xml = await readFile(new URL('./fixtures/archimate4-minimal.xml', import.meta.url), 'utf8');

  assert.match(xml, /http:\/\/www\.opengroup\.org\/xsd\/archimate\/4\.0\//);
});

test('archimate 4 descriptor stores relationship multiplicity fields', async () => {
  const descriptor = await readFile(new URL('../lib/moddle/resources/archimate4.json', import.meta.url), 'utf8');

  assert.match(descriptor, /sourceMultiplicity/);
  assert.match(descriptor, /targetMultiplicity/);
});

test('archimate 4 descriptor allows relationships between relationship concepts', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate4.json');
  const relationship = findType(descriptor, 'Relationship');

  assert.equal(findProperty(relationship, 'source').type, 'Concept');
  assert.equal(findProperty(relationship, 'target').type, 'Concept');
});

test('archimate 4 descriptor allows connections to relationship view elements', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate4.json');
  const connection = findType(descriptor, 'Connection');

  assert.equal(findProperty(connection, 'source').type, 'ViewElement');
  assert.equal(findProperty(connection, 'target').type, 'ViewElement');
});

test('archimate 4 descriptor stores viewpoint definitions and view references', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate4.json');
  const views = findType(descriptor, 'Views');
  const view = findType(descriptor, 'View');
  const viewpoint = findType(descriptor, 'Viewpoint');

  assert.equal(findProperty(views, 'viewpointsNode').type, 'Viewpoints');
  assert.equal(findProperty(view, 'viewpoint').isAttr, true);
  assert.equal(findProperty(view, 'viewpointRef').type, 'Viewpoint');
  assert.equal(findProperty(view, 'viewpointRef').isReference, true);
  assert.equal(findProperty(viewpoint, 'viewpointPurpose').type, 'String');
  assert.equal(findProperty(viewpoint, 'viewpointContent').type, 'String');
  assert.equal(findProperty(viewpoint, 'allowedElementTypes').type, 'AllowedElementType');
  assert.equal(findProperty(viewpoint, 'allowedRelationshipTypes').type, 'AllowedRelationshipType');
});

test('archimate descriptors resolve every declared complex type reference', async () => {
  for (const descriptorPath of [
    '../lib/moddle/resources/archimate.json',
    '../lib/moddle/resources/archimate3.json',
    '../lib/moddle/resources/archimate4.json'
  ]) {
    const descriptor = await readDescriptor(descriptorPath);

    assert.deepEqual(getDescriptorTypeReferences(descriptor), [], descriptorPath);
  }
});

test('archimate 4 descriptor stores organization trees', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate4.json');
  const model = findType(descriptor, 'Model');
  const organizations = findType(descriptor, 'Organizations');
  const organization = findType(descriptor, 'Organization');

  assert.equal(findProperty(model, 'organizationsNode').type, 'Organizations');
  assert.equal(findProperty(organizations, 'organizations').type, 'Organization');
  assert.equal(findProperty(organization, 'organizations').type, 'Organization');
  assert.equal(findProperty(organization, 'identifierRef').isReference, true);
});

test('archimate 4 organization trees resolve through moddle xml', async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<archimate:Model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="http://www.opengroup.org/xsd/archimate/4.0/">
  <archimate:Elements>
    <archimate:BaseElement id="role-1" xsi:type="archimate:BaseElement">
      <name>Role</name>
    </archimate:BaseElement>
  </archimate:Elements>
  <archimate:Organizations>
    <archimate:Organization id="organization-1" identifierRef="role-1">
      <name>Actors</name>
      <archimate:Organization id="organization-2">
        <name>Nested</name>
      </archimate:Organization>
    </archimate:Organization>
  </archimate:Organizations>
</archimate:Model>`;

  const result = await readModel('../lib/moddle/resources/archimate4.json', xml);
  const rootOrganization = result.rootElement.organizationsNode.organizations[0];

  assert.equal(rootOrganization.id, 'organization-1');
  assert.equal(rootOrganization.identifierRef.id, 'role-1');
  assert.equal(rootOrganization.organizations[0].id, 'organization-2');
});

test('archimate 4 viewpoint references resolve through moddle xml', async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<archimate:Model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="http://www.opengroup.org/xsd/archimate/4.0/">
  <archimate:Views>
    <archimate:Viewpoints>
      <archimate:Viewpoint id="vp-1">
        <name>Risk Summary</name>
        <archimate:viewpointPurpose>Deciding</archimate:viewpointPurpose>
        <archimate:viewpointContent>Overview</archimate:viewpointContent>
        <archimate:allowedElementType type="BusinessActor" />
        <archimate:allowedRelationshipType type="Association" />
      </archimate:Viewpoint>
    </archimate:Viewpoints>
    <archimate:Diagrams>
      <archimate:View id="view-1" viewpointRef="vp-1">
        <name>View</name>
      </archimate:View>
    </archimate:Diagrams>
  </archimate:Views>
</archimate:Model>`;

  const result = await readModel('../lib/moddle/resources/archimate4.json', xml);
  const views = result.rootElement.views;
  const viewpoint = views.viewpointsNode.viewpoints[0];
  const view = views.diagrams.viewsList[0];

  assert.equal(viewpoint.id, 'vp-1');
  assert.equal(viewpoint.viewpointPurpose, 'Deciding');
  assert.equal(viewpoint.allowedElementTypes[0].type, 'BusinessActor');
  assert.equal(view.viewpointRef.id, 'vp-1');
});

test('archimate 3 descriptor keeps existing endpoint constraints', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate3.json');
  const relationship = findType(descriptor, 'Relationship');
  const connection = findType(descriptor, 'Connection');

  assert.equal(findProperty(relationship, 'source').type, 'BaseElement');
  assert.equal(findProperty(relationship, 'target').type, 'BaseElement');
  assert.equal(findProperty(connection, 'source').type, 'Node');
  assert.equal(findProperty(connection, 'target').type, 'Node');
});

test('archimate 3 descriptor also preserves optional viewpoint metadata', async () => {
  const descriptor = await readDescriptor('../lib/moddle/resources/archimate3.json');
  const views = findType(descriptor, 'Views');
  const view = findType(descriptor, 'View');

  assert.equal(findProperty(views, 'viewpointsNode').type, 'Viewpoints');
  assert.equal(findProperty(view, 'viewpoint').isAttr, true);
  assert.equal(findProperty(view, 'viewpointRef').type, 'Viewpoint');
});

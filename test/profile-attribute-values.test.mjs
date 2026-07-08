import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getProfileAttributePropertyValue,
  isProfileAttributeValueValid,
  normalizeProfileAttributeValue,
  setProfileAttributePropertyValue
} from '../lib/util/ProfileAttributeUtil.js';

test('profile attribute values normalize implementation-supported C260 basic types', () => {
  assert.equal(normalizeProfileAttributeValue({ type: 'String' }, 'high'), 'high');
  assert.equal(normalizeProfileAttributeValue({ type: 'Integer' }, '42'), 42);
  assert.equal(normalizeProfileAttributeValue({ type: 'Real' }, '42.5'), 42.5);
  assert.equal(normalizeProfileAttributeValue({ type: 'Currency' }, '1200.50'), 1200.5);
  assert.equal(normalizeProfileAttributeValue({ type: 'Boolean' }, 'true'), true);
  assert.equal(normalizeProfileAttributeValue({ type: 'Date' }, '2026-07-09'), '2026-07-09');
  assert.equal(normalizeProfileAttributeValue({ type: 'Time' }, '14:30:05'), '14:30:05');
  assert.equal(normalizeProfileAttributeValue({ type: 'URL' }, 'https://publications.opengroup.org/w262'), 'https://publications.opengroup.org/w262');
  assert.deepEqual(normalizeProfileAttributeValue({ type: 'Structure' }, { unit: 'risk' }), { unit: 'risk' });
});

test('profile attribute values reject values outside their declared type', () => {
  assert.equal(isProfileAttributeValueValid({ type: 'Integer' }, '4.2'), false);
  assert.equal(isProfileAttributeValueValid({ type: 'Boolean' }, 'yes'), false);
  assert.equal(isProfileAttributeValueValid({ type: 'Date' }, '2026-02-30'), false);
  assert.equal(isProfileAttributeValueValid({ type: 'Time' }, '24:00'), false);
  assert.equal(isProfileAttributeValueValid({ type: 'URL' }, 'not a url'), false);
  assert.equal(isProfileAttributeValueValid({ type: 'Structure' }, 'plain'), false);
});

test('profile attribute values can be stored as model properties', () => {
  const model = {};
  const element = { id: 'risk-event-1', type: 'RiskEvent' };
  const attribute = { concept: 'RiskEvent', name: 'severity', type: 'Integer' };

  const property = setProfileAttributePropertyValue(model, element, attribute, '4');
  const propertyAgain = setProfileAttributePropertyValue(model, element, attribute, 5);

  assert.equal(property, propertyAgain);
  assert.deepEqual(
    model.propertyDefinitionsNode.propertyDefinitions.map((definition) => ({
      name: definition.name,
      type: definition.type
    })),
    [
      {
        name: 'archimate-js:profileAttribute:RiskEvent:severity',
        type: 'Integer'
      }
    ]
  );
  assert.equal(element.propertiesNode.properties.length, 1);
  assert.equal(element.propertiesNode.properties[0].value, '5');
  assert.equal(getProfileAttributePropertyValue(element, attribute), 5);
});

test('structured profile attribute values are stored as JSON property values', () => {
  const model = {};
  const element = { id: 'risk-event-2', type: 'RiskEvent' };
  const attribute = { concept: 'RiskEvent', name: 'impact', type: 'Structure' };

  setProfileAttributePropertyValue(model, element, attribute, { score: 8, unit: 'risk' });

  assert.equal(element.propertiesNode.properties[0].value, '{"score":8,"unit":"risk"}');
  assert.deepEqual(getProfileAttributePropertyValue(element, attribute), { score: 8, unit: 'risk' });
});

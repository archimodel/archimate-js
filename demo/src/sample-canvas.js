export const EMPTY_ARCHIMATE4_XML = `<?xml version="1.0" encoding="UTF-8"?>
<archimate:Model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="http://www.opengroup.org/xsd/archimate/4.0/">
  <name>Demo ArchiMate 4 model</name>
  <documentation></documentation>
  <archimate:Elements></archimate:Elements>
  <archimate:Views>
    <archimate:Diagrams>
      <archimate:View id="view-demo">
        <name>Demo View</name>
        <documentation></documentation>
      </archimate:View>
    </archimate:Diagrams>
  </archimate:Views>
  <archimate:PropertyDefinitions></archimate:PropertyDefinitions>
</archimate:Model>`;

export function setStatus(message) {
  const status = document.querySelector('#status');

  if (status) {
    status.textContent = message;
  }
}

export function seedSampleCanvas(instance) {
  const canvas = instance.get('canvas');
  const elementFactory = instance.get('elementFactory');
  const root = canvas.getRootElement();

  const role = addShape(canvas, elementFactory, root, {
    type: 'Role',
    name: 'Customer Role',
    x: 170,
    y: 92,
    width: 150,
    height: 76
  });

  const service = addShape(canvas, elementFactory, root, {
    type: 'Service',
    name: 'Digital Service',
    x: 430,
    y: 92,
    width: 170,
    height: 76
  });

  const application = addShape(canvas, elementFactory, root, {
    type: 'ApplicationComponent',
    name: 'Experience App',
    x: 720,
    y: 92,
    width: 190,
    height: 76
  });

  const path = addShape(canvas, elementFactory, root, {
    type: 'Path',
    name: 'Experience Path',
    x: 170,
    y: 335,
    width: 150,
    height: 76
  });

  const grouping = addShape(canvas, elementFactory, root, {
    type: 'Grouping',
    name: 'Shared Context',
    x: 430,
    y: 260,
    width: 170,
    height: 76
  });

  const junction = addShape(canvas, elementFactory, root, {
    type: 'AndJunction',
    name: '',
    x: 632,
    y: 277,
    width: 42,
    height: 42
  });

  const technology = addShape(canvas, elementFactory, root, {
    type: 'Equipment',
    name: 'Edge Equipment',
    x: 720,
    y: 260,
    width: 190,
    height: 76
  });

  addConnection(canvas, elementFactory, root, role, service, 'Serving', [
    { x: 320, y: 130 },
    { x: 430, y: 130 }
  ]);

  addConnection(canvas, elementFactory, root, service, application, 'Realization', [
    { x: 600, y: 130 },
    { x: 720, y: 130 }
  ]);

  addConnection(canvas, elementFactory, root, service, junction, 'Flow', [
    { x: 515, y: 168 },
    { x: 653, y: 277 }
  ]);

  addConnection(canvas, elementFactory, root, path, junction, 'Flow', [
    { x: 320, y: 373 },
    { x: 653, y: 373 },
    { x: 653, y: 319 }
  ]);

  addConnection(canvas, elementFactory, root, junction, technology, 'Flow', [
    { x: 674, y: 298 },
    { x: 720, y: 298 }
  ]);

  addConnection(canvas, elementFactory, root, grouping, service, 'Aggregation', [
    { x: 515, y: 260 },
    { x: 515, y: 168 }
  ]);

  canvas.zoom('fit-viewport');
}

function addShape(canvas, elementFactory, root, attrs) {
  const shape = elementFactory.createShape({
    type: attrs.type,
    x: attrs.x,
    y: attrs.y,
    width: attrs.width,
    height: attrs.height
  });

  shape.name = attrs.name;
  canvas.addShape(shape, root);

  return shape;
}

function addConnection(canvas, elementFactory, root, source, target, type, waypoints) {
  const connection = elementFactory.createConnection({
    type,
    source,
    target,
    waypoints
  });

  connection.name = type;
  canvas.addConnection(connection, root);

  return connection;
}

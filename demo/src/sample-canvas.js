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

  const actor = addShape(canvas, elementFactory, root, {
    type: 'BusinessActor',
    name: 'Customer',
    x: 80,
    y: 92,
    width: 150,
    height: 76
  });

  const service = addShape(canvas, elementFactory, root, {
    type: 'Service',
    name: 'Digital Service',
    x: 360,
    y: 92,
    width: 170,
    height: 76
  });

  const application = addShape(canvas, elementFactory, root, {
    type: 'ApplicationComponent',
    name: 'Experience App',
    x: 650,
    y: 92,
    width: 190,
    height: 76
  });

  const junction = addShape(canvas, elementFactory, root, {
    type: 'AndJunction',
    name: '',
    x: 450,
    y: 245,
    width: 42,
    height: 42
  });

  const technology = addShape(canvas, elementFactory, root, {
    type: 'Equipment',
    name: 'Edge Device',
    x: 650,
    y: 225,
    width: 190,
    height: 76
  });

  addConnection(canvas, elementFactory, root, actor, service, 'Serving', [
    { x: 230, y: 130 },
    { x: 360, y: 130 }
  ]);

  addConnection(canvas, elementFactory, root, service, application, 'Realization', [
    { x: 530, y: 130 },
    { x: 650, y: 130 }
  ]);

  addConnection(canvas, elementFactory, root, service, junction, 'Flow', [
    { x: 445, y: 168 },
    { x: 471, y: 245 }
  ]);

  addConnection(canvas, elementFactory, root, junction, technology, 'Flow', [
    { x: 492, y: 266 },
    { x: 650, y: 263 }
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

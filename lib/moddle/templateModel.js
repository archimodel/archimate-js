import { getLanguageProfile } from '../metamodel/languages';

export function createTemplateModelXml(version) {
  const profile = getLanguageProfile(version);
  const schemaLocation = profile.schemaLocation ?
    ' xsi:schemaLocation="' + profile.namespace + ' ' + profile.schemaLocation + '"' :
    '';

  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<archimate:Model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="' + profile.namespace + '"' + schemaLocation + '>\n' +
    '  <name>New model</name>\n' +
    '  <documentation></documentation>\n' +
    '  <archimate:Elements>\n' +
    '  </archimate:Elements>\n' +
    '  <archimate:Views>\n' +
    '    <archimate:Diagrams>\n' +
    '      <archimate:View>\n' +
    '        <name>Default View</name>\n' +
    '        <documentation></documentation>\n' +
    '      </archimate:View>\n' +
    '    </archimate:Diagrams>\n' +
    '  </archimate:Views>\n' +
    '  <archimate:PropertyDefinitions>\n' +
    '  </archimate:PropertyDefinitions>\n' +
    '</archimate:Model>';
}

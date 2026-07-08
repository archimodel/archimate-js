import {
  assign
} from 'min-dash';

import Moddle from './Moddle';

import Archimate3Descriptors from './resources/archimate3.json';
import Archimate4Descriptors from './resources/archimate4.json';
import { normalizeArchimateVersion } from '../metamodel/languages';

export default function(additionalPackages, options) {
  var version = normalizeArchimateVersion(options && options.archimateVersion);
  var descriptor = version === '4.0' ? Archimate4Descriptors : Archimate3Descriptors;
  var packages = {
    archimate: descriptor,
  };
  var pks = assign({}, packages, additionalPackages);

  return new Moddle(pks, options);
}

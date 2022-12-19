import {
  assign
} from 'min-dash';

import Moddle from './Moddle';

import ArchimateDescriptors from './resources/archimate.json';

var packages = {
  archimate: ArchimateDescriptors,
};

export default function(additionalPackages, options) {
  var pks = assign({}, packages, additionalPackages);

  return new Moddle(pks, options);
}
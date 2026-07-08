import { getLanguageProfile } from '../metamodel/languages';

export default function LanguageProfile(config) {
  var version = config && config.archimateVersion;

  this.profile = getLanguageProfile(version);
}

LanguageProfile.$inject = [ 'config' ];

LanguageProfile.prototype.get = function() {
  return this.profile;
};

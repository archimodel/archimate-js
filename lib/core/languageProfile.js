import { createLanguageProfile } from '../metamodel/languages';

export default function LanguageProfile(config) {
  var version = config && config.archimateVersion;

  this.profile = createLanguageProfile(version, config && config.archimateLanguageProfile);
}

LanguageProfile.$inject = [ 'config' ];

LanguageProfile.prototype.get = function() {
  return this.profile;
};

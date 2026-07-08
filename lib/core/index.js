import DrawModule from '../draw';
import ImportModule from '../import';
import LanguageProfile from './languageProfile';

export default {
  __depends__: [
    DrawModule,
    ImportModule
  ],
  languageProfile: [ 'type', LanguageProfile ]
};

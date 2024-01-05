import { I18n } from 'aws-amplify';

const enJson = require('./en.json');

export const t = (identifier) => I18n.get(identifier);

export const setupI18n = () => {
  const dict = {
    en: enJson,
  };

  I18n.putVocabularies(dict);

  I18n.setLanguage('en');
};

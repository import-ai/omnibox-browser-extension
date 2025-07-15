// eslint-disable-next-line import-x/no-named-as-default
import i18n from 'i18next';
import locales from './locales';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  // options: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    resources: locales,
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })
  .then();

export default i18n;

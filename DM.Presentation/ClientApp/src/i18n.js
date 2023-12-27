import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

var middleware = require("i18next-express-middleware");

const lngDetectorOptions = {
  // order and from where user language should be detected
  order: [/*"path", "session", "querystring",*/ "localStorage" /*"header"*/],

  // keys or params to lookup language from
  lookupLocalStorage: "i18nextLng",
};

i18n
  .use(initReactI18next)
  .use(middleware.LanguageDetector)
  .use(Backend)
  .init({
    preload: ["en", "ar"],
    initImmediate: false,
    whitelist: ["en", "ar"],
    lng:
      localStorage.getItem("i18nextLng") ||
      "en" /* don't uncomment this if you want to get lang from lang detector */,
    backend: {
      /* translation file path */
      loadPath: "/assets/i18n/{{ns}}/{{lng}}.json",
    },
    detection: lngDetectorOptions,
    load: "languageOnly",
    fallbackLng: "en",
    debug: false,
    /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      wait: true,
    },
  });

export default i18n;

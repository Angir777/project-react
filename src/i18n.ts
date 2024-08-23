import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import plTranslations from "./app/i18n/pl.json";
import enTranslations from "./app/i18n/en.json";
import ruTranslations from "./app/i18n/ru.json";

const resources = {
  ru: {
    translation: ruTranslations,
  },
  en: {
    translation: enTranslations,
  },
  pl: {
    translation: plTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pl",
  fallbackLng: "pl",
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;

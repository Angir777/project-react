import { t } from 'i18next';

export const setPageTitle = (pageTranslationName: string | null) => {
  // Ustawia w title nazwę strony
  if (pageTranslationName === null) {
    document.title = t('appName');
  } else {
    document.title = t(pageTranslationName) + ' | ' + t('appName');
  }
};

import i18next, { type BackendModule, type ReadCallback } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Logger } from './logger.service';

const log = new Logger('DAILO');
const languageKey = 'language';

/**
 * Translation file names (Angular: `translationsFilesNames` in app.config.ts).
 */
const translationsFilesNames = [
  'auth',
  'error',
  'layout',
  'main',
  'nav',
  'role',
  'user',
  'account',
];

/**
 * Equivalent of the Angular `MultiTranslateHttpLoaderHelper`:
 * loads every file from /assets/i18n/{lang}/*.json and merges them into one dictionary.
 * `{{APP_VERSION_TO_REPLACE}}` is replaced after the build by build/post-build.cjs.
 */
const multiTranslateHttpLoader: BackendModule = {
  type: 'backend',
  init: () => {},
  read(language: string, _namespace: string, callback: ReadCallback) {
    const appVersion = '{{APP_VERSION_TO_REPLACE}}';
    const versionQuery = appVersion ? `?v=${appVersion}` : '';

    Promise.all(
      translationsFilesNames.map((path) =>
        fetch(`/assets/i18n/${language}/${path}.json${versionQuery}`).then((res) => {
          if (!res.ok) {
            throw new Error(`Cannot load translation file: ${language}/${path}.json`);
          }
          return res.json();
        }),
      ),
    )
      .then((responses) => callback(null, Object.assign({}, ...responses)))
      .catch((error) => callback(error, false));
  },
};

/**
 * Equivalent of the Angular I18nService.
 */
class I18nService {
  supportedLanguages: string[] = [];

  private defaultLanguage = '';

  async init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;

    if (!i18next.isInitialized) {
      await i18next
        .use(multiTranslateHttpLoader)
        .use(initReactI18next)
        .init({
          fallbackLng: false,
          supportedLngs: supportedLanguages,
          load: 'currentOnly',
          keySeparator: '.',
          returnNull: false,
          interpolation: { escapeValue: false },
          react: { useSuspense: true },
        });

      i18next.on('languageChanged', (lang: string) => {
        localStorage.setItem(languageKey, lang);
        document.documentElement.lang = lang;
      });
    }

    const savedLang = localStorage.getItem(languageKey) || defaultLanguage;
    await this.setLanguage(savedLang);
  }

  async setLanguage(language: string) {
    const savedLang = localStorage.getItem(languageKey) || navigator.language;

    if (!language) {
      language = savedLang || this.defaultLanguage;
    }

    const isSupported = this.supportedLanguages.includes(language);
    if (!isSupported) {
      language = language.split('-')[0];
      language =
        this.supportedLanguages.find((lang) => lang.startsWith(language)) || this.defaultLanguage;
    }

    log.debug(`Language set to "${language}"`);
    await i18next.changeLanguage(language);
  }

  get language(): string {
    return i18next.language ?? 'pl';
  }
}

export const i18nService = new I18nService();

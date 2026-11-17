import { Language } from '@/shared/constants/language.const';

export const environmentProd = {
  PRODUCTION: true,
  VERSION: '1.0.1',

  APP_STORAGE_PREFIX: 'DAILO-BASIC-PROD',
  APP_URL: 'https://dailo.com/',
  SERVER_URL: 'https://dailo.com/rest/api/',
  SERVER_PUBLIC_PATH: 'https://dailo.com/',

  ENABLE_REGISTRATION: true,

  ENABLE_LANGUAGE_CHANGE: true,
  DEFAULT_LANGUAGE: Language.PL,
  LANGUAGES_AVAILABLE: [Language.PL, Language.EN, Language.ES],

  PAGE_SIZES: [1, 10, 15, 20, 30, 100],
  DEFAULT_PAGE_SIZE: 15,

  DATETIME_DISPLAY_FORMAT: 'yyyy-MM-dd',
  DATETIME_DISPLAY_HISTORY_FORMAT: 'yyyy-MM-dd HH:mm',

  LOGO_DARK_URL: 'assets/brand/myCom_logo_dark.png',
  LOGO_WHITE_URL: 'assets/brand/myCom_logo_white.png',
  LOGO_ALT: 'DAILO',
};

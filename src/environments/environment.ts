import { Language } from '@/shared/constants/language.const';

export const environmentLocal = {
  PRODUCTION: false,
  VERSION: '1.0.1',

  APP_STORAGE_PREFIX: 'DAILO-BASIC-LOCAL',
  APP_URL: 'http://localhost:4200/',
  SERVER_URL: 'http://localhost:8000/api/',
  SERVER_PUBLIC_PATH: 'http://localhost:8000/',

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

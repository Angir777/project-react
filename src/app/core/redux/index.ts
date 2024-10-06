import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import toastReducer from './toast';
import languageReducer from './language';
import motywReducer from './motyw';
import mainMenuReducer from './mainMenu';

import layoutReducer from './layout';

// TODO: Tutaj pytanie czy będzie potrzebne layoutReducer i leftMenuReducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    language: languageReducer,
    motyw: motywReducer,
    mainMenu: mainMenuReducer,

    layout: layoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import toastReducer from './toast';
import languageReducer from './language';
import motywReducer from './motyw';
import mainMenuReducer from './mainMenu';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    language: languageReducer,
    motyw: motywReducer,
    mainMenu: mainMenuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

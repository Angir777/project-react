import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import toastReducer from './toast';
import configReducer from './config';
import layoutReducer from './layout';
import leftMenuReducer from './leftMenu';

// TODO: Tutaj pytanie czy będzie potrzebne layoutReducer i leftMenuReducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    
    config: configReducer,
    layout: layoutReducer,
    leftMenu: leftMenuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import configReducer from './config';
import layoutReducer from './layout';
import leftMenuReducer from './leftMenu';

// TODO: Tutaj pytanie czy będzie potrzebne layoutReducer i leftMenuReducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
    config: configReducer,
    layout: layoutReducer,
    leftMenu: leftMenuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

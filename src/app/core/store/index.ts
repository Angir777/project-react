import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { credentialsSlice } from './credentials.slice';
import { themeSlice } from './theme.slice';

export const store = configureStore({
  reducer: {
    credentials: credentialsSlice.reducer,
    theme: themeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export * from './credentials.slice';
export * from './theme.slice';

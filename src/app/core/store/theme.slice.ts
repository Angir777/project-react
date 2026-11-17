import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

export interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: 'light',
};

/**
 * Theme state (equivalent of `theme$` in the Angular ThemeService).
 * DOM and localStorage side effects are handled by `themeService`.
 */
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
  },
});

export const themeActions = themeSlice.actions;

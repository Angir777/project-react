import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP_STORAGE_KEY, APP_DEFAULT_LANG } from '../../../envrionment';

interface ConfigSliceState {
  currentLanguage: string;
}

const initialState: ConfigSliceState = {
  currentLanguage: 'pl',
};

const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
  reducers: {
    changeLanguage(state, action: PayloadAction<any>) {
      state.currentLanguage = action.payload;
      localStorage.setItem(`${APP_STORAGE_KEY}-currentLanguage`, action.payload);
    },
    loadCurrentLanguageFromLocalStore(state) {
      const currentLang = localStorage.getItem(`${APP_STORAGE_KEY}-currentLanguage`);
      if (currentLang !== null) {
        state.currentLanguage = currentLang;
      } else {
        state.currentLanguage = APP_DEFAULT_LANG ?? 'pl';
      }
    },
  },
});

export const configActions = configSlice.actions;
export default configSlice.reducer;

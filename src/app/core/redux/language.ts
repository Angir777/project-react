import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP_STORAGE_KEY, APP_DEFAULT_LANG } from '../../../envrionment';

interface LanguageSliceState {
  currentLanguage: string;
}

const initialState: LanguageSliceState = {
  currentLanguage: APP_DEFAULT_LANG ?? 'pl',
};

const languageSlice = createSlice({
  name: 'language',
  initialState: initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changeLanguage(state, action: PayloadAction<any>) {
      localStorage.setItem(`${APP_STORAGE_KEY}-currentLanguage`, action.payload);
      state.currentLanguage = action.payload;
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

export const languageActions = languageSlice.actions;
export default languageSlice.reducer;

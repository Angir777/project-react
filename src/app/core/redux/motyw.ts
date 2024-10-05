import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP_STORAGE_KEY, APP_DEFAULT_MOTYW } from '../../../envrionment';

interface MotywSliceState {
  currentMotyw: string;
}

const initialState: MotywSliceState = {
  currentMotyw: APP_DEFAULT_MOTYW ?? 'light',
};

const motywSlice = createSlice({
  name: 'motyw',
  initialState: initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changeMotyw(state, action: PayloadAction<any>) {
      localStorage.setItem(`${APP_STORAGE_KEY}-currentMotyw`, action.payload);
      state.currentMotyw = action.payload;
    },
    loadCurrentMotywFromLocalStore(state) {
      const currentLang = localStorage.getItem(`${APP_STORAGE_KEY}-currentMotyw`);
      if (currentLang !== null) {
        state.currentMotyw = currentLang;
      } else {
        state.currentMotyw = APP_DEFAULT_MOTYW ?? 'light';
      }
    },
  },
});

export const motywActions = motywSlice.actions;
export default motywSlice.reducer;

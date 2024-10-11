import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP_STORAGE_KEY } from '../../../envrionment';

interface MainMenuSliceState {
  currentMainMenu: boolean;
}

const initialState: MainMenuSliceState = {
  currentMainMenu: true,
};

const mainMenuSlice = createSlice({
  name: 'mainMenu',
  initialState: initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setMainMenuState(state, action: PayloadAction<any>) {
      localStorage.setItem(`${APP_STORAGE_KEY}-currentMainMenu`, JSON.stringify(action.payload));
      state.currentMainMenu = action.payload;
    },
    getMainMenuState(state) {
      const currentMenuState = localStorage.getItem(`${APP_STORAGE_KEY}-currentMainMenu`);
      if (currentMenuState !== null) {
        state.currentMainMenu = JSON.parse(currentMenuState) as boolean;
      } else {
        state.currentMainMenu = true;
      }
    },
  },
});

export const mainMenuActions = mainMenuSlice.actions;
export default mainMenuSlice.reducer;

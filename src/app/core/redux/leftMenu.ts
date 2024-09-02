import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LeftMenuSliceState {
  showMenu: boolean;
  showSubMenu: boolean;
}

const initialState: LeftMenuSliceState = {
  showMenu: true,
  showSubMenu: true,
};

const leftMenuSlice = createSlice({
  name: 'authentication',
  initialState: initialState,
  reducers: {
    setLeftSideMenu(state, action: PayloadAction<any>) {
      state.showMenu = action.payload;
      state.showSubMenu = false;
    },
    setLeftSideSubMenu(state, action: PayloadAction<any>) {
      state.showSubMenu = action.payload;
    },
  },
});

export const leftMenuActions = leftMenuSlice.actions;
export default leftMenuSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutSliceState {
  showingNavigationDropdown: boolean;
}

const initialState: LayoutSliceState = {
  showingNavigationDropdown: false,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState: initialState,
  reducers: {
    setShowingNavigationDropdown(state, action: PayloadAction<boolean>) {
      state.showingNavigationDropdown = action.payload;
    },
  },
});

export const layoutActions = layoutSlice.actions;
export default layoutSlice.reducer;

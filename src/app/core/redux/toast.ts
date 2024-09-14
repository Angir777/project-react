import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastSliceState {
  severity: 'success' | 'error' | 'info' | 'warn';
  summary: string;
  detail: string;
  isVisible: boolean;
}

const initialState: ToastSliceState = {
  severity: 'info',
  summary: '',
  detail: '',
  isVisible: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState: initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Omit<ToastSliceState, 'isVisible'>>) => {
      const { severity, summary, detail } = action.payload;
      state.severity = severity;
      state.summary = summary;
      state.detail = detail;
      state.isVisible = true;
    },
    hideToast: (state) => {
      state.isVisible = false;
    },
  },
});

export const toastActions = toastSlice.actions;
export default toastSlice.reducer;

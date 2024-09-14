import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../../models/auth/Auth';
import { APP_STORAGE_KEY } from '../../../envrionment';

interface AuthSliceState {
  currentUser: AuthUser | null;
  isLoading: boolean;
}

const initialState: AuthSliceState = {
  currentUser: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialState,
  reducers: {
    login(state, action: PayloadAction<AuthUser>) {
      localStorage.setItem(`${APP_STORAGE_KEY}-currentUser`, JSON.stringify(action.payload));
      state.currentUser = action.payload;
    },
    logout(state) {
      localStorage.removeItem(`${APP_STORAGE_KEY}-currentUser`);
      state.currentUser = null;
    },
    register(state, action: PayloadAction<AuthUser>) {
      localStorage.setItem(`${APP_STORAGE_KEY}-currentUser`, JSON.stringify(action.payload));
      state.currentUser = action.payload;
    },
    restoreUser(state, action: PayloadAction<AuthUser>) {
      state.currentUser = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Credentials {
  id: number | string | null;
  firstName: string;
  lastName: string;
  email: string;
  permissions: string[];
  roles: string[];
  token: string;
  avatarUrl: string | null;
  settings: Record<string, boolean>;
}

export interface CredentialsState {
  credentials: Credentials | null;
}

const initialState: CredentialsState = {
  credentials: null,
};

/**
 * Credentials state (equivalent of the `_credentials` signal in the Angular CredentialsService).
 * Persistence in session/localStorage is handled by `credentialsService`.
 */
export const credentialsSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<Credentials | null>) {
      state.credentials = action.payload;
    },
  },
});

export const credentialsActions = credentialsSlice.actions;

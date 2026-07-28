import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authStorage } from './authStorage';
import type { AuthUser } from '@/types';

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!authStorage.getToken(),
  user: authStorage.getUser(),
  token: authStorage.getToken(),
};

/**
 * Auth slice — handles auth state. Reducers are pure.
 * Side effects (localStorage) should be handled where the action is dispatched.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      authStorage.clearAuth();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export default authSlice.reducer;

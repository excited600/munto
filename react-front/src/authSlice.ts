import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  email: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearAccessToken(state) {
      state.accessToken = null;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    clearEmail(state) {
      state.email = null;
    },
  },
});

export const { setAccessToken, clearAccessToken, setEmail, clearEmail } = authSlice.actions;
export default authSlice.reducer; 
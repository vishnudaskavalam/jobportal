import { createSlice,  } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        rememberMe?: boolean;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      if (action.payload.rememberMe) {
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      } else {
        sessionStorage.setItem('accessToken', action.payload.accessToken);
        sessionStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },

    updateAccessToken: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.accessToken = action.payload;

      if (localStorage.getItem('refreshToken')) {
        localStorage.setItem('accessToken', action.payload);
      } else {
        sessionStorage.setItem('accessToken', action.payload);
      }
    },

      logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    },
  },
});

export const {
  setTokens,
  updateAccessToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
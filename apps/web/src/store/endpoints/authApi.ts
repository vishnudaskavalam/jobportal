import { apiSlice } from '../slice/apiSlice';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        data: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;

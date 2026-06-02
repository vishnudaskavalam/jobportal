import { apiSlice } from '../apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    signup: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        data: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;

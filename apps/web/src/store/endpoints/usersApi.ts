import { apiSlice } from '../apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserCount: builder.query<number, void>({
      query: () => ({
        url: '/users/count',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserCountQuery } = usersApi;

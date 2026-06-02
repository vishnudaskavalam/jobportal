import { apiSlice } from '../apiSlice';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;

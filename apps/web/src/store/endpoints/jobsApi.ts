import { apiSlice } from '../slice/apiSlice';
import type { Job, MetaData } from '@components';

export interface JobsResponse {
  data: Job[];
  meta: MetaData;
}

export const jobsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<JobsResponse, any>({
      query: (params) => ({
        url: '/jobs/list',
        method: 'GET',
        params,
      }),
      providesTags: ['Job'],
    }),
    getAdminJobs: builder.query<JobsResponse, any>({
      query: (params) => ({
        url: '/jobs',
        method: 'GET',
        params,
      }),
      providesTags: ['Job'],
    }),
    getJobById: builder.query<Job, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Job', id }],
    }),
    createJob: builder.mutation<Job, any>({
      query: (job) => ({
        url: '/jobs',
        method: 'POST',
        data: job,
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    updateJob: builder.mutation<Job, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),
    deleteJob: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),
    applyForJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `/jobs/${id}/apply`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Job', id }],
    }),
    getJobCount: builder.query<number, void>({
      query: () => ({
        url: '/jobs/count',
        method: 'GET',
      }),
      providesTags: ['Job'],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetAdminJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyForJobMutation,
  useGetJobCountQuery,
} = jobsApi;

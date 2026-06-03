import { apiSlice } from '../slice/apiSlice';
import type { Job, MetaData } from '@components';

export interface JobsResponse {
  data: Job[];
  meta: MetaData;
}

export interface GetJobsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  location?: string;
  posted?: string;
  yearsOfExperience?: string;
}

export const jobsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<JobsResponse, GetJobsParams>({
      query: (params) => ({
        url: '/jobs/list',
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    getAdminJobs: builder.query<JobsResponse, GetJobsParams>({
      query: (params) => ({
        url: '/jobs',
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    getJobById: builder.query<Job, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Job', id }],
    }),
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (job) => ({
        url: '/jobs',
        method: 'POST',
        data: job,
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    updateJob: builder.mutation<Job, { id: string; data: Partial<Job> }>({
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
    applyForJob: builder.mutation<Job, string>({
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
      providesTags: [{ type: 'Job', id: 'LIST' }],
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

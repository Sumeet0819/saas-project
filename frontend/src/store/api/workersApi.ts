import { apiSlice } from './apiSlice';
import { Worker, Attendance } from '../../types';

export const workersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkers: builder.query<Worker[], void>({
      query: () => '/workers',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Worker' as const, id })),
              { type: 'Worker', id: 'LIST' },
            ]
          : [{ type: 'Worker', id: 'LIST' }],
    }),
    createWorker: builder.mutation<Worker, Partial<Worker>>({
      query: (body) => ({
        url: '/workers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Worker', id: 'LIST' }],
    }),
    getAttendance: builder.query<Attendance[], { projectId?: string; date?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.projectId) queryParams.append('project_id', params.projectId);
        if (params.date) queryParams.append('date', params.date);
        
        return `/attendance?${queryParams.toString()}`;
      },
      providesTags: ['Attendance'],
    }),
    markAttendance: builder.mutation<Attendance, Partial<Attendance>>({
      query: (body) => ({
        url: '/attendance',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetWorkersQuery,
  useCreateWorkerMutation,
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
} = workersApi;

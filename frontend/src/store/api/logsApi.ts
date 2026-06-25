import { apiSlice } from './apiSlice';
import { DailyLog } from '../../types';

export const logsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDailyLogs: builder.query<DailyLog[], { projectId?: string }>({
      query: (params) => {
        let url = '/daily-logs';
        if (params.projectId) {
          url += `?project_id=${params.projectId}`;
        }
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'DailyLog' as const, id })),
              { type: 'DailyLog', id: 'LIST' },
            ]
          : [{ type: 'DailyLog', id: 'LIST' }],
    }),
    createDailyLog: builder.mutation<DailyLog, Partial<DailyLog>>({
      query: (body) => ({
        url: '/daily-logs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'DailyLog', id: 'LIST' }],
    }),
  }),
});

export const { useGetDailyLogsQuery, useCreateDailyLogMutation } = logsApi;
